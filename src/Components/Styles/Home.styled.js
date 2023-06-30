import styled from "styled-components";

export const PhasesBarWrapper = styled.div`
    position: relative;
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
        border: 1px dotted rgb(112, 112, 112);
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
    align-items: center;
    
    width: 30%;
    min-width: ${props => props.id=="externalSource" ? "100%" : "400px"};
    
    border: 1px solid black;
    border-left: 0px;
    border-right: 0px;
    border-radius: 15px;

    padding: 20px 0px 20px 0px;

    label {
        text-align: center;
        font-size: 17px;
    }

    input {
        font-size: 15px;

        border: 0px;
        border-radius: 8px;

        padding: 5px 15px 5px 15px;

        outline: none;

        ${props => props.id=="externalSource" ? "width: 50%;" : ""}

        background-color: #ededed;
    }

    select {
        font-size: 15px;

        border: 0px;
        border-radius: 8px;

        padding: 5px 15px 5px 15px;

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

export const StyledButton = styled.button`
    width: 15%;
    height: 50px;

    border: 0px;
    border-radius: 15px;

    margin-bottom: 50px;

    font-size: 17px;
    font-family: 'Segoe UI';

    cursor: pointer;

    background-color: ${({ theme }) => theme.colors.primary};
    color: white;

    transition: all 0.4s;

    &:hover{
        filter: brightness(95%);
    }

    &:active{
        filter: brightness(80%);
    }
`