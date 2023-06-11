import Header from './Header'
import PhasesBar from './PhasesBar'
import { PhasesBarWrapper, PhasesForm, PhaseDiv } from '../Styles/Home.styled'
import { Flex } from '../Styles/Flex.styled'
import { useState } from 'react'
import { useRef } from 'react'

import pseudoDb from '../../content'
import { processExternalSource, generateFiles } from '../../Utils'


import { saveAs } from 'file-saver'

export default function Home(){
    const [ originId, setOriginId ] = useState(0)
    const [ type, setType ] = useState("FAT")
    const [ externalName, setExternalName ] = useState("")
    const [ processedSource, setProcessedSource ] = useState(null)

    const tableNameDOMRef = useRef(null)
    const stgMergeNameDOMRef = useRef(null)
    const mergeNameDOMRef = useRef(null)

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
            <Flex>
                <PhasesBarWrapper>
                    <PhasesBar numberOfPhases={8} currentPhase={currentPhase}/>
                </PhasesBarWrapper>
                <PhasesForm onSubmit={handleSubmit}>
                    <PhaseDiv>
                        <label htmlFor="origin">Origin </label>
                        <select name="origin" id="origin"
                         onChange={(event)=>{
                            setOriginId(event.target.value)

                            tableNameDOMRef.current.value = pseudoDb.origins[event.target.value].tableConvention(externalName)

                            stgMergeNameDOMRef.current.value = pseudoDb.origins[event.target.value].mergeConvention(externalName, "STG")
                            mergeNameDOMRef.current.value = pseudoDb.origins[event.target.value].mergeConvention(externalName, type)
                        }}>
                            {pseudoDb.origins.map((origin, index) => {
                                return <option key={index} value={index}> {origin.originName}</option>
                            })}
                        </select>
                    </PhaseDiv>
                    <PhaseDiv>
                    <label htmlFor="type">Type </label>
                        <select name="type" id="type" onChange={(event)=>{
                            setType(event.target.value)
                            stgMergeNameDOMRef.current.value = pseudoDb.origins[originId].mergeConvention(externalName, "STG")
                            mergeNameDOMRef.current.value = pseudoDb.origins[originId].mergeConvention(externalName, event.target.value)
                        }}>
                            <option value="FAT">FAT</option>
                            <option value="DIM">DIM</option>
                        </select>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="externalName">External Name </label>
                        <input type="text" name='externalName' onChange={(event) => {
                            setExternalName(event.target.value)

                            tableNameDOMRef.current.value = pseudoDb.origins[originId].tableConvention(event.target.value)

                            stgMergeNameDOMRef.current.value = pseudoDb.origins[originId].mergeConvention(event.target.value, "STG")
                            mergeNameDOMRef.current.value = pseudoDb.origins[originId].mergeConvention(event.target.value, type)
                        }}/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="tableName">Tables Name </label>
                        <input type="text" name='tableName' defaultValue={pseudoDb.origins[originId].tableConvention(externalName)} ref={tableNameDOMRef}/>
                    </PhaseDiv>
                    <PhaseDiv>
                    <label htmlFor="stgMergeName">STG Merge </label>
                        <input type="text" name='stgMergeName' defaultValue={pseudoDb.origins[originId].mergeConvention(externalName, "STG")} ref={stgMergeNameDOMRef}/>
                        <br />
                        <label htmlFor="mergeName">{type} Merge </label>
                        <input type="text" name='mergeName' defaultValue={pseudoDb.origins[originId].mergeConvention(externalName, type)} ref={mergeNameDOMRef}/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="source">External source </label>
                        <input type="text" name='source' onChange={event => {
                            setProcessedSource(processExternalSource(event.target.value))
                        }}/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="whereClause">Where Clause </label>
                        <select name="whereClause" id="whereClause" disabled={processedSource==null}>
                            {processedSource && processedSource.map((column, index) => {
                                return <option key={index} value={index}> {column.name}</option>
                            })}
                        </select>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="mergeKeys">Merge Keys </label>
                        <input type="text" name='mergeKeys'/>
                    </PhaseDiv>
                    <button>Submit</button>
                </PhasesForm>
            </Flex>
        </>
    )
}