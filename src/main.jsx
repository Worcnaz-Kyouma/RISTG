import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Components/Home/Home'
import GlobalStyles from './Components/Styles/Global'

import { ThemeProvider } from 'styled-components'

const theme = {
    colors: {
        primary: "#004ea6",
        secondary: "#b0c80c"
    }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Home />
    </ThemeProvider>,
)
