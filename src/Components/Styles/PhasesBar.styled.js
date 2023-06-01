import styled from "styled-components";

export const ProgressBar = styled.div`
    position:relative;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    margin: auto;
    width: 5px;
    height: 90%;
    border-radius: 10%;

    background-color: rgb(165, 164, 164);
    
    transition: all 0.4s;

    &::before{
        content: '';

        position: absolute;
        top: 0px;
        left: 0px;

        width: 100%;
        height: ${({numberOfPhases, currentPhase}) => ((currentPhase-1)/(numberOfPhases-1))*100}%;

        border-radius: 10%;
        background-color: rgb(57, 114, 39);

        z-index: 1;

        transition: inherit;
    }

    div{
        position: relative;

        width: 40px;
        aspect-ratio: 1;

        border: 4px solid white;

        background-color: inherit;

        border-radius: 50%;

        z-index: 2;

        transition: all 0.4s;
    }

    div:nth-child(-n+${({currentPhase}) => currentPhase}){
        background-color: rgb(57, 114, 39);
    }

    div:nth-child(${({currentPhase}) => currentPhase})::before{
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