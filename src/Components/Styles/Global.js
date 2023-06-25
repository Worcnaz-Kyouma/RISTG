import { createGlobalStyle } from "styled-components"

const GlobalStyles = createGlobalStyle`
    body{
        margin: 0px;
        font-family: brandon-grotesque, sans-serif;
        font-style: normal;
        font-weight: 100;
    }

    p {
        opacity: 0.6;
        line-height: 1.5;
    }
`

export default GlobalStyles