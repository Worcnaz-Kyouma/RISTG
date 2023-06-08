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

function generateFiles(form){
    const { databaseName/*content.js -> Home.jsx -> index.js*/, origin, processedSource, externalName, tablesName/*stgTableName, tableName*/, mergesName/*stgMergeName,  mergeName*/, whereClause, mergeKeys } = form;
    let files = {
        external: generateExternalBlob(databaseName, externalName, processedSource, origin, mergesName.stgMergeName, tablesName),
        mergeStg: generateMergeBlob(mergesName.stgMergeName, tablesName.stgTableName, externalName, processedSource, mergeKeys, whereClause, databaseName),
        merge: generateMergeBlob(mergesName.mergeName, tablesName.tableName, tablesName.stgTableName, processedSource, mergeKeys)
    }
    return files
}

function generateExternalBlob(databaseName, externalName, processedSource, origin, stgMergeName, tablesName){
    const columnsAccumulated = (haveCollate=false) => processedSource.slice(1).reduce((accumulator, currentColumn) => {
        return (
        `${accumulator}
        ,   [${currentColumn.name}]     ${currentColumn.type}      ${(haveCollate) ? currentColumn.options.collate || "NOT NULL" : "NOT NULL"}
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
    
    return externalText;
    //return new Blob([externalText], {type: "application/sql"})
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

    return mergeText;
    //return new Blob([], {type: "application/sql"})
}


console.log(generateMergeBlob("SP_FRISIA_MRG_FAT_NF_ENTRADA_LIN", "Frisia.fat.nf_entrada_lin", "Frisia.stg.nf_entrada_lin", processExternalSource('[PK_CUSTOMER_TRX_LINE_ID] DECIMAL(15) NOT NULL, [FK_CUSTOMER_TRX_ID] DECIMAL(15) NOT NULL, [FK_CD_UNIDADE_OPERACIONAL] VARCHAR(960) COLLATE Latin1_General_100_BIN2_UTF8, [FK_CD_FILIAL] VARCHAR(12) COLLATE Latin1_General_100_BIN2_UTF8, [FK_ID_ORGANIZACAO_INVENTARIO] DECIMAL(15) NOT NULL, [FK_CD_ORGANIZACAO_INVENTARIO] VARCHAR(12) COLLATE Latin1_General_100_BIN2_UTF8, [FK_ID_PRODUTO] FLOAT(53) NOT NULL, [FK_CD_PRODUTO] VARCHAR(160) COLLATE Latin1_General_100_BIN2_UTF8, [FK_NR_ORDEM_VENDA] VARCHAR(200) COLLATE Latin1_General_100_BIN2_UTF8, [FK_CD_TIPO_ORDEM_VENDA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [FK_NR_LINHA_ORDEM_VENDA] VARCHAR(120) COLLATE Latin1_General_100_BIN2_UTF8, [FK_ID_LINHA_ORDEM_VENDA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [FK_NM_DISTRIBUICAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [FK_ID_LOTE] VARCHAR(MAX) COLLATE Latin1_General_100_BIN2_UTF8, [DT_INCLUIDO] DATETIME2(0) NOT NULL, [NM_USUARIO_INCLUIDO] VARCHAR(400) COLLATE Latin1_General_100_BIN2_UTF8, [DT_ALTERADO] DATETIME2(0) NOT NULL, [NM_USUARIO_ALTERADO] VARCHAR(400) COLLATE Latin1_General_100_BIN2_UTF8, [NR_LINHA_NOTA_FISCAL] FLOAT(53) NOT NULL, [DS_PRODUTO_NOTA_FISCAL] VARCHAR(960) COLLATE Latin1_General_100_BIN2_UTF8, [CD_UNID_MEDIDA_NOTA_FISCAL] VARCHAR(12) COLLATE Latin1_General_100_BIN2_UTF8, [QT_LINHA_NOTA_FISCAL] FLOAT(53), [CD_UNID_MEDIDA_PRI_PRODUTO] VARCHAR(12) COLLATE Latin1_General_100_BIN2_UTF8, [QT_PRIMARIA_PRODUTO] FLOAT(53), [CD_UNID_MEDIDA_SEC_PRODUTO] VARCHAR(12) COLLATE Latin1_General_100_BIN2_UTF8, [QT_SECUNDARIA_PRODUTO] FLOAT(53), [VL_PRECO_UNITARIO_PADRAO] FLOAT(53), [VL_PRECO_UNITARIO_VENDA] FLOAT(53), [VL_DESCONTO_UNITARIO] FLOAT(53), [VL_TOTAL_VENDA_LINHA] FLOAT(53), [VL_DESCONTO_TOTAL_LINHA] FLOAT(53), [IE_CLASSIFICACAO_IMPOSTO] VARCHAR(200) COLLATE Latin1_General_100_BIN2_UTF8, [CD_FISCAL_OPERACAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_NCM_PRODUTO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [DS_NCM_PRODUTO] VARCHAR(MAX) COLLATE Latin1_General_100_BIN2_UTF8, [CD_CLASSE_CONDICAO_TRANSACAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_ORIGEM_PRODUTO] VARCHAR(MAX) COLLATE Latin1_General_100_BIN2_UTF8, [IE_TIPO_FISCAL_PRODUTO] VARCHAR(MAX) COLLATE Latin1_General_100_BIN2_UTF8, [VL_QUANTIA_BASE_IMPOSTO] FLOAT(53), [TX_BASE_IMPOSTO] FLOAT(53), [VL_QUANTIA_IMPOSTO_COBRADO] FLOAT(53), [VL_QUANTIA_FISCAL_CALCULADA] FLOAT(53), [CD_TRANSACAO_PADRAO] VARCHAR(120) COLLATE Latin1_General_100_BIN2_UTF8, [ID_CONTA_FINANCEIRA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NM_CONTA_FINANCEIRA] VARCHAR(400) COLLATE Latin1_General_100_BIN2_UTF8, [CD_VALOR_CONTEXTO] VARCHAR(120) COLLATE Latin1_General_100_BIN2_UTF8, [NM_ATIVIDADE] VARCHAR(96) COLLATE Latin1_General_100_BIN2_UTF8, [DS_CULTURA] VARCHAR(136) COLLATE Latin1_General_100_BIN2_UTF8, [DS_PROPOSITO] VARCHAR(976) COLLATE Latin1_General_100_BIN2_UTF8, [CD_SAFRA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_TIPO_SAFRA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_FINANCIAMENTO] VARCHAR(MAX) COLLATE Latin1_General_100_BIN2_UTF8, [IE_PRAZO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [QT_AREA_HECTARES_ATENDIDA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_SEMENTE_CONSUMO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_RECEITUARIO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_TECNICO_RECEITUARIO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_DESCONTO_BIGBAG] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [ID_ITEM_PROGRAMACAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_PLACA_VEICULO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [SG_ESTADO_VEICULO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_ODOMETRO_VEICULO] FLOAT(53), [NR_BOMBA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_BICO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_TANQUE] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_ENCERRANTE_FINAL] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_SEMENTE_TAXA_TECNOLOGICA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [VL_PRECO_UNITARIO_NEGOCIADO] FLOAT(53), [IE_COMISSAO_TSI] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_VEICULO] FLOAT(53), [ID_COMB_CONTABIL_DESPESA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [ID_LOTE_TERMINACAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [SQ_FASE_LOTE] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [PC_COMISSAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_CONTRATO_CORRETORA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [DS_GERMINACAO_MIN] FLOAT(53), [CD_LOCAL_EMBARQUE] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_STATUS_EMBALAGEM] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_REGIAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [DT_STATUS_TSI] DATETIME2(0), [IE_CLIENTE_RETIRA_AMOSTRA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_ATIVO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_CENTRO_RESULTADO_CREDITO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_USO_VALOR_BLOQUEADO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [PC_DESCONTO_PRECO_VDA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_ORDEM_COMPRA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_RECEITA_VETERINARIA] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_AGENDAMENTO_TRANSPORTE] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_PERIODO_PROGRAMACAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [NR_ODOMETRO_VE] FLOAT(53), [CD_PALETIZADO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [CD_DISPONIBILIDADE_CARREGAMENT] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [DS_OBSERVACAO] VARCHAR(600) COLLATE Latin1_General_100_BIN2_UTF8, [IE_UTILIZAR_PREVISAO] VARCHAR(40) COLLATE Latin1_General_100_BIN2_UTF8, [NR_LOTE] VARCHAR(MAX) COLLATE Latin1_General_100_BIN2_UTF8, [IE_NF_TERCEIROS] CHAR(12) COLLATE Latin1_General_100_BIN2_UTF8, [TP_CONTRATO_TERCEIRO] VARCHAR(320) COLLATE Latin1_General_100_BIN2_UTF8'), "TARGET.[ID] = SOURCE.[ID]"))