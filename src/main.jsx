import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './Components/Home/Home'
import GlobalStyles from './Components/Styles/Global'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStyles />
    <Home />
  </React.StrictMode>,
)
