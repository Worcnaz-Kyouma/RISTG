import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
    body{
        margin: 0px;
        font-family: 'Segoe UI';
        font-style: normal;
        font-weight: 350;
    }

    p {
        opacity: 0.6;
        line-height: 1.5;
    }
`

export default GlobalStyles