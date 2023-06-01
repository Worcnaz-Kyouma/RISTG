import { ProgressBar } from "../Styles/PhasesBar.styled"

export default function PhasesBar(props){
    return (
        <ProgressBar numberOfPhases={props.numberOfPhases} currentPhase={props.currentPhase}>
            {[...Array(props.numberOfPhases)].map((value, index) => <div key={index}></div>)}
        </ProgressBar>
    )
}