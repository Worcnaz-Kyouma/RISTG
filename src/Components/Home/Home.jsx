import Header from './Header'
import PhasesBar from './PhasesBar'
import { PhasesBarWrapper, PhasesForm, PhaseDiv } from '../Styles/Home.styled'
import { Flex } from '../Styles/Flex.styled'
import GlobalStyles from '../Styles/Global'

import { useState } from 'react'

import { processExternalSource } from '../../Utils'

export default function Home(){
    const [ currentPhase, setCurrentPhase ] = useState(1)

    function handleSubmit(event){
        event.preventDefault()
    
        const form = event.target
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries())
    }

    return(
        <>
            <GlobalStyles />
            <Header />
            <Flex>
                <PhasesBarWrapper>
                    <PhasesBar numberOfPhases={8} currentPhase={currentPhase}/>
                </PhasesBarWrapper>
                <PhasesForm onSubmit={handleSubmit}>
                    <PhaseDiv>
                        <label htmlFor="origin">Origin </label>
                        <input type="text" name='origin' onKeyDown={event => {
                            console.log(event)
                        }}/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="type">Type </label>
                        <input type="text" name='type' onKeyDown={event => {
                            console.log(event)
                        }}/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="externalName">External Name </label>
                        <input type="text" name='externalName'/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="tablesName">Tables Name </label>
                        <input type="text" name='tablesName'/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="proceduresName">Procedures Name </label>
                        <input type="text" name='proceduresName'/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="source">External source </label>
                        <input type="text" name='source'/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="whereClause">Where Clause </label>
                        <input type="text" name='whereClause'/>
                    </PhaseDiv>
                    <PhaseDiv>
                        <label htmlFor="mergeKeys">Merge Keys </label>
                        <input type="text" name='mergeKeys'/>
                    </PhaseDiv>
                </PhasesForm>
            </Flex>
            
        </>
    )
}