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
    const { origin, processedSource, externalName, tablesName/*stgTableName, tableName*/, mergesName/*stgMergeName,  mergeName*/, whereClause, mergeKeys } = form;
    let files = {
        external: generateExternal(externalName, processedSource, origin, mergesName.stgMergeName, tablesName),
        mergeStg: generateMerge(mergesName.stgMergeName, tablesName.stgTableName, externalName, whereClause, mergeKeys, processedSource),
        merge: generateMerge(mergesName.mergeName, tablesName.tableName, tablesName.stgTableName, processedSource)
    }
    return files
}

function generateExternal(external){

}

function generateMerge(merge){

}


