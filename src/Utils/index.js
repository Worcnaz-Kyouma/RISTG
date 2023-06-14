function processRawColumn(rawColumn){
    let column = {
        name: '',
        type: '',
        options: {
            collate: ''
        }
        
    }
    column.name = rawColumn.slice(0, rawColumn.indexOf(']'))
    column.type = rawColumn.slice(rawColumn.indexOf('] ')+1, rawColumn.indexOf(')')+1)
    if(rawColumn[rawColumn.lenght-1]!=')'){
        let collatePosition = rawColumn.search('COLLATE')
        if(collatePosition!=-1){
            column.options.collate = 'COLLATE ' + rawColumn.slice(collatePosition+8)
        }
    }
    return column
}

export function processExternalSource(source){
    let rawColumns = source.replace(/\[/, '').split(', [')

    let columns = rawColumns.map(processRawColumn)

    return columns
}

export function generateFiles(form){
    const { databaseName/*content.js -> Home.jsx -> index.js*/, origin, processedSource, externalName, tablesName/*stgTableName, tableName*/, mergesName/*stgMergeName,  mergeName*/, whereClause, mergeKeys } = form;
    let files = {
        external: generateExternalBlob(databaseName, externalName, processedSource, origin, mergesName.stgMergeName, tablesName),
        mergeStg: generateMergeBlob(mergesName.stgMergeName, tablesName.stgTableName, externalName, processedSource, mergeKeys, whereClause, databaseName),
        merge: generateMergeBlob(mergesName.mergeName, tablesName.tableName, tablesName.stgTableName, processedSource, mergeKeys)
    }
    return files
}

function generateExternalBlob(databaseName, externalName, processedSource, origin, stgMergeName, tablesName){
    const lenghtLongestColumnName = processedSource.map(column => column.name).reduce((longestColumn, currentColumn) => currentColumn.lenght>longestColumn.lenght ? currentColumn : longestColumn).lenght
    
    const numOfAdditionalTabs = (column) => {return  -Math.round(-(lenghtLongestColumnName-column.length)/8)}

    const columnsAccumulated = (haveCollate=false) => processedSource.slice(1).reduce((accumulator, currentColumn) => {
        return (
        `${accumulator}
        ,   [${currentColumn.name}]${[...Array(1+numOfAdditionalTabs(column))].map((cell=>cell="\t")).join('')}${currentColumn.type}\t${(haveCollate) ? currentColumn.options.collate || "NOT NULL" : "NOT NULL"}
        `
        )
      }, `  [${processedSource[0].name}]    ${processedSource[0].type}     ${processedSource[0].options.collate || "NOT NULL"}` )
    
    const externalText = 
    `use ${databaseName}

    CREATE EXTERNAL TABLE [dbo].${externalName}
    (
      ${columnsAccumulated(true)}
    )
    WITH (DATA_SOURCE = [${origin[0]}],LOCATION = N'${origin[1]+externalName}')
    GO
    
    --Teste external
    --select * from ${externalName}
    
    use Frisia
    --select * from PARAMETRO order by 1 desc
    insert into parametro values ( (select max(cd_parametro) + 1 from PARAMETRO), 
                                    '${stgMergeName}', 
                                    'NOME DA PROCEDURE', 
                                    -1, 
                                    getdate(),
                                    (select cast(getdate() -1 as date))
                                  )
    
    CREATE TABLE ${tablesName.stgTableName}
    (
        ${columnsAccumulated(false)}            
    )
    
    CREATE TABLE ${tablesName.tableName}
    (
        ${columnsAccumulated(false)}
        , DT_INCLUIDO_DW				DATETIME
        , DT_ALTERADO_DW				DATETIME
    )
    `
    
    //return externalText;
    return new Blob([externalText], {type: "application/sql"})
}

function generateMergeBlob(mergeName, targetTable, sourceTable, processedSource, mergeKeys, whereClause, databaseName=false){
    const updateSetText = processedSource.slice(1).reduce((accumulator, currentColumn) => {
        return (
        `${accumulator}
        ,   [${currentColumn.name}] = SOURCE.[${currentColumn.name}]
        `
        )
      }, `   [${processedSource[0].name}] = SOURCE.[${processedSource[0].name}]`) 
    
    const insertSetText = (isSource=false) => processedSource.slice(1).reduce((accumulator, currentColumn) => {
        return (
        `${accumulator}
        ,   ${isSource && "SOURCE."}[${currentColumn.name}]
        `
        )
      }, `   ${isSource && "SOURCE."}[${processedSource[0].name}]`) 
    
    const mergeText = 
    `USE FRISIA
    GO
    
    create or ALTER procedure [dbo].${mergeName}  ${(databaseName) ? "@ControlaData bit" : ""} as 
    
    ${(databaseName) ? "truncate table " + targetTable : ""}
    
    MERGE ${targetTable} as TARGET
        USING (
                SELECT * FROM ${databaseName ? databaseName + ".dbo." : ""}${sourceTable}
                    ${whereClause ? whereClause : ""}	
              ) 
              AS SOURCE ON (                      		 
                    ${mergeKeys}						
              )
        WHEN MATCHED 
        THEN 
            UPDATE SET 
                   ${updateSetText}
                   ${!databaseName && ", DT_ALTERADO_DW = GETDATE()"}								
                
        WHEN NOT MATCHED THEN
            INSERT (				 
                    ${insertSetText()}
                    ${!databaseName && ",    DT_INCLUIDO_DW"} 					                
            )
            VALUES 
            (
                   ${insertSetText(true)}
                   ${!databaseName && ",    GETDATE()"}   				        
            );
    update 	Frisia.dbo.PARAMETRO  set [DT_EXECUCAO] = getdate() 
    where [NM_PARAMETRO] = ${mergeName}
    GO
    `

    //return mergeText;
    return new Blob([mergeText], {type: "application/sql"})
}