import { ProgressBar, ProgressCircle } from "../Styles/PhasesBar.styled"

export default function PhasesBar(props){
    return (
        <>
            <ProgressBar positions={props.progressPhasesPosition} numberOfPhases={props.numberOfPhases} currentPhase={props.currentPhase} />
            {[...Array(props.numberOfPhases)].map((value, index) => <ProgressCircle position={props.progressPhasesPosition[index]} currentPhase={props.currentPhase} key={index}></ProgressCircle>)}
        </>
    )
}