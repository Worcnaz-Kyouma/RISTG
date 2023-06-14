const nrTabs=1

const columns = ['a', 'sugoma', 'sugomass', 'notSusButYouKnow', 'vidao', 'nothingHesadasdasreImportLessThanMck']

const biggestColumn = columns.reduce((biggestColumn, current) => current.length>biggestColumn.length ? current: biggestColumn)

const additionalTabs = (column) => {return  -Math.round(-(biggestColumn.length-column.length)/8)}

const result = columns.map((column) => 
    `${column}${[...Array(nrTabs+additionalTabs(column))].map((cell=>cell="\t")).join('')}type`).reduce((accumulator, current) => accumulator+"\n"+current)

console.log(result)

//8 character = 1 tab