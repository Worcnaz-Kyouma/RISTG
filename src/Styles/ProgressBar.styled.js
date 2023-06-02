import styled from "styled-components"

export const StyledProgressDiv = styled.div`
    //flex-grow: 1;
    //flex-shrink: 0;
    position: absolute;
    width: 5px;
    height: 100%;
    border-radius: 50%;
    background-color: black;

    &:before{
        width: 100%;
        height: 100%;
        transform: scaleY(0);

        transition: 1s all
    }
`