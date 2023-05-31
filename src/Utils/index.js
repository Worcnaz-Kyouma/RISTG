function generateFiles(external, merge){
    let files = {
        external: generateExternal(external),
        mergeStg: generateMerge(merge),
        merge: generateMerge(merge)
    }
    return files
}

function generateExternal(external){

}

function generateMerge(merge){

}

module.exports = generateExternal