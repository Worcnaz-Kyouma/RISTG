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

    padding: 0px 5% 0px 5%;

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
        margin-bottom: 25px;
        padding: 16px !important;
    }
    div.w-tc-editor-preview{
        padding: 0px !important;
    }
`

export const PhaseKeysDiv = styled(PhaseDiv)`
    flex-direction: column;

    div.w-tc-editor,textarea.w-tc-editor-text{
        width: 60%;
        min-height: 200px;
        resize: none;
    }
    div.w-tc-editor-preview{
        width: 100%;
        min-height: 200px !important;
        resize: none;
    }
`