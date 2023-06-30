import styled from "styled-components";

export const ProgressBar = styled.div`
    position: absolute;
    left: 50%;
    top: ${props=>props.positions[0]-35}px;
    transform: translateX(-50%);

    width: 5px;
    height: ${props=>props.positions[props.positions.length-1] - props.positions[0]}px;

    background-color: rgb(165, 164, 164);

    transition: all 0.4s;

    &::before{
        content: '';

        position: absolute;
        top: 0px;
        left: 0px;

        width: 100%;
        height: ${props=>props.positions[props.currentPhase]-50}px;

        border-radius: 10%;
        background-color: rgb(57, 114, 39);

        z-index: 1;

        transition: inherit;
    }
`

export const ProgressCircle = styled.div`
    position: absolute;
    left: 50%;
    top: ${props => props.position-35}px;
    transform: translateX(-50%);

    width: 40px;
    aspect-ratio: 1;

    border: 4px solid white;

    background-color: rgb(165, 164, 164);;

    border-radius: 50%;

    z-index: 2;

    transition: all 0.4s;

    &:nth-child(-n+${({currentPhase}) => currentPhase+2}){
        background-color: rgb(57, 114, 39);
    }

    &:nth-child(${({currentPhase}) => currentPhase+2})::before{
        content: '';

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        width: 45px;
        aspect-ratio: 1;
        border-radius: 50%;

        border: 2px solid rgb(57, 114, 39);

    }
`