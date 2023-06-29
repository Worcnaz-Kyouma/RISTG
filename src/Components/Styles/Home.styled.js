import styled from "styled-components";

export const PhasesBarWrapper = styled.div`
    display: flex;
    flex-basis: 40px;
    flex-grow: 1;
    max-width: 10%;
`

export const Body = styled.div`
    margin-top: 50px;
`

export const PhasesForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    
    flex-grow: 9;
    max-width: 90%;
`

export const PhaseDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    box-sizing: border-box;

    width: 90%;
    min-height: 150px;

    padding: 0px 3% 25px 3%;

    margin-bottom: 50px;

    border-bottom-left-radius: 40px 30px;
    border-bottom-right-radius: 40px 30px;
    border-bottom: 2px solid black;

    div.w-tc-editor,textarea.w-tc-editor-text{
        border-radius: 15px; 
        background-color: #f5f5f5;
        color: black;
        font-size: 16px;
        font-family: 'Consolas';
        padding: 16px !important;
    }
    div.w-tc-editor-preview{
        padding: 0px !important;
    }
`

export const InputDiv = styled.div`
    display: flex;
    justify-content: space-evenly;
    
    width: 40%;
    min-width: 300px;
    
    border: 1px solid black;
    border-left: 0px;
    border-right: 0px;
    border-radius: 15px;

    padding: 20px 0px 20px 0px;

    select {
        border: 0px;
        border-radius: 8px;

        padding: 5px;

        background-color: #ededed;
    }

`

export const PhaseKeysDiv = styled(PhaseDiv)`
    flex-direction: column;

    div.w-tc-editor,textarea.w-tc-editor-text{
        width: 60%;
        min-height: 200px;

        margin-top: 10px;
    }
    div.w-tc-editor-preview{
        width: 100%;
        min-height: 200px !important;
    }
`