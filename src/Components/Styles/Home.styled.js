import styled from "styled-components";

export const PhasesBarWrapper = styled.div`
    display: flex;
    flex-grow: 1;
    flex-basis: 40px;
`

export const Body = styled.div`
    margin-top: 50px;
`

export const PhasesForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    
    flex-grow: 9;
`

export const PhaseDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    box-sizing: border-box;

    width: 90%;

    padding: 0px 75px 0px 75px;

    margin-bottom: 50px;

    border-bottom-left-radius: 40px 30px;
    border-bottom-right-radius: 40px 30px;
    border-bottom: 2px solid black;

    div{

    }

    div.w-tc-editor{
        border-radius: 15px; 
        background-color: #f5f5f5;
        color: black;
        font-size: 16px;
        font-family: 'Consolas';
        margin-bottom: 25px;
    }
`