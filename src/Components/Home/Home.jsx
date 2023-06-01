import Header from './Header'
import PhasesBar from './PhasesBar'
import { PhasesBarWrapper, PhasesForm, PhaseDiv } from '../Styles/Home.styled'
import { Flex } from '../Styles/Flex.styled'

export default function Home(){
    return(
        <>
            <Header />
            <Flex>
                <PhasesBarWrapper>
                    <PhasesBar numberOfPhases={5} currentPhase={5}/>
                </PhasesBarWrapper>
                <PhasesForm onSubmit={''}>
                    <PhaseDiv>
                        sd
                    </PhaseDiv>
                    <PhaseDiv>
                        sd  
                    </PhaseDiv>
                    <PhaseDiv>
                        sd
                    </PhaseDiv>
                    <PhaseDiv>
                        sd
                    </PhaseDiv>
                    <PhaseDiv>
                        sd
                    </PhaseDiv>
                </PhasesForm>
            </Flex>
            
        </>
    )
}