import styled from "styled-components";

export const StyledHeader = styled.div`
    position: relative;
    height: 110px;
    background-color: ${({ theme }) => theme.colors.primary};

    img {
        position: absolute;

        display: block;
        width: 6.5%;
        height: 80%;

        top: 50%;
        left: 50%;

        transform: translate(-50%, -50%);

        margin: auto;
    }
`