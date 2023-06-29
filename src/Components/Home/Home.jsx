import Header from './Header'
import PhasesBar from './PhasesBar'
import { Body, PhasesBarWrapper, PhasesForm, PhaseDiv, InputDiv, PhaseKeysDiv } from '../Styles/Home.styled'
import { Flex } from '../Styles/Flex.styled'
import { useState } from 'react'

import SQLText from '../Utils/SQLText'

import pseudoDb from '../../content'
import { processExternalSource, generateFiles } from '../../Utils'


import { saveAs } from 'file-saver'

export default function Home(){
    const [ originId, setOriginId ] = useState(0)
    const [ type, setType ] = useState("FAT")

    const [ externalName, setExternalName ] = useState("")
    const [ tablesName, setTablesName ] = useState("")
    const [ mergesName, setMergesName ] = useState("")
    const [whereClauseColumn, setWhereClauseColumn] = useState("")

    const [ processedSource, setProcessedSource ] = useState(null)


    const [ currentPhase, setCurrentPhase ] = useState(1)

    function handleSubmit(event){
        event.preventDefault()
    
        const form = event.target
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries())

        const generatingSource = {
            databaseName: pseudoDb.origins[formJson.origin].databaseName,
            origin: pseudoDb.origins[formJson.origin].polyBaseLocation,
            processedSource: processedSource,
            externalName: formJson.externalName,
            tablesName: {stgTableName:"Frisia.stg."+formJson.tableName, tableName: "Frisia."+formJson.type.toLowerCase()+"."+formJson.tableName},
            mergesName: {stgMergeName: formJson.stgMergeName, mergeName: formJson.mergeName},
            whereClause: formJson.whereClause,
            mergeKeys: formJson.mergeKeys
        }

        const files = generateFiles(generatingSource)
        
        saveAs(files.external, formJson.externalName+".sql")
        saveAs(files.mergeStg, formJson.stgMergeName+".sql")
        saveAs(files.merge, formJson.mergeName+".sql")
    }

    return(
        <>
            <Header />
            <Body>
                <Flex>
                    <PhasesBarWrapper>
                        <PhasesBar numberOfPhases={8} currentPhase={currentPhase}/>
                    </PhasesBarWrapper>
                    <PhasesForm onSubmit={handleSubmit}>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="origin">Origin </label>
                                <select name="origin" id="origin"
                                 onChange={(event)=>{
                                    setOriginId(event.target.value)
                                    setTablesName(pseudoDb.origins[event.target.value].tableConvention(externalName))
                                    setMergesName(pseudoDb.origins[event.target.value].mergeConvention(externalName))
                                }}>
                                    {pseudoDb.origins.map((origin, index) => {
                                        return <option key={index} value={index}> {origin.originName}</option>
                                    })}
                                </select>
                            </InputDiv>
                            <SQLText value={`use ${pseudoDb.origins[originId].databaseName} \n.\n.\n.\n[${pseudoDb.origins[originId].polyBaseLocation[0]}],LOCATION = N'${pseudoDb.origins[originId].polyBaseLocation[1]}..`} />
                        </PhaseDiv>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="type">Type </label>
                                <select name="type" id="type" onChange={(event)=>{
                                    setType(event.target.value)
                                }}>
                                    <option value="FAT">FAT</option>
                                    <option value="DIM">DIM</option>
                                </select>
                            </InputDiv>
                            <SQLText value={`CREATE TABLE Frisia.${type.toLowerCase()}...\n.\n.\n.\nCREATE PROCEDURE [dbo]SP_FRISIA_MRG_${type}...`} />
                        </PhaseDiv>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="externalName">External Name </label>
                                <input type="text" name='externalName' onChange={(event) => {
                                    setExternalName(event.target.value)
                                    setTablesName(pseudoDb.origins[originId].tableConvention(event.target.value))
                                    setMergesName(pseudoDb.origins[originId].mergeConvention(event.target.value))
                                }}/>
                            </InputDiv>
                            <SQLText value={`CREATE EXTERNAL TABLE ${externalName}`} />
                        </PhaseDiv>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="tableName">Tables Name </label>
                                <input type="text" name='tableName' value={tablesName} onChange={(event) => setTablesName(event.target.value)}/>
                            </InputDiv>
                            <SQLText value={`CREATE TABLE Frisia.stg.${pseudoDb.origins[originId].tableTemplatePrefix}${tablesName}\n.\n.\n.\nCREATE TABLE Frisia.${type.toLowerCase()}.${pseudoDb.origins[originId].tableTemplatePrefix}${tablesName}`}/>
                        </PhaseDiv>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="mergeName">Merges Name </label>
                                <input type="text" name='mergeName' value={mergesName} onChange={(event) => setMergesName(event.target.value)}/>
                            </InputDiv>
                            <SQLText value={`CREATE PROCEDURE [dbo].${pseudoDb.origins[originId].mergeTemplatePrefix}_STG_${pseudoDb.origins[originId].mergeConvention(mergesName)}\n.\n.\n.\nCREATE PROCEDURE [dbo].${pseudoDb.origins[originId].mergeTemplatePrefix}_${type}_${pseudoDb.origins[originId].mergeConvention(mergesName)}`}/>
                        </PhaseDiv>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="source">External source </label>
                                <input type="text" name='source' onChange={event => {
                                    setProcessedSource(processExternalSource(event.target.value))
                                    setWhereClauseColumn(processExternalSource(event.target.value)[0].name)
                                }}/>
                            </InputDiv>
                        </PhaseDiv>
                        <PhaseDiv>
                            <InputDiv>
                                <label htmlFor="whereClauseSelect">Where Clause </label>
                                <select name="whereClauseSelect" id="whereClauseSelect" disabled={processedSource==null} value={whereClauseColumn} onChange={event => setWhereClauseColumn(event.target.value)}>
                                    {processedSource && processedSource.map((column, index) => {
                                        return <option key={index} value={column.name}> {column.name}</option>
                                    })}
                                </select>
                            </InputDiv>
                            <SQLText name="whereClause" editable="true" value={`where ${whereClauseColumn} >= \ncase\nwhen @controlaData = 1 then\n(\n\tselect DT_RETRO\n\tfrom dbo.PARAMETRO\n\twhere NM_PARAMETRO = '${pseudoDb.origins[originId].mergeTemplatePrefix}_STG_${pseudoDb.origins[originId].mergeConvention(mergesName)}'\n)\nelse '1910-01-01'\nend`}/>
                        </PhaseDiv>
                        <PhaseKeysDiv>
                            <div>
                                <label htmlFor="mergeKeys">Merge Keys </label>
                            </div>

                            <SQLText name='mergeKeys' editable='true'/>
                        </PhaseKeysDiv>
                        <button>Submit</button>
                    </PhasesForm>
                </Flex>
            </Body>
        </>
    )
}