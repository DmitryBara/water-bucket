import React from 'react'
import { BrowserRouter, Route, Redirect } from 'react-router-dom'
import 'materialize-css'
import 'materialize-css/dist/css/materialize.min.css';
import { MainPage } from './pages/MainPage'


function App() {

  return (
    <BrowserRouter>
        <Route path="/" exact>
          <MainPage />
        </Route>
        <Redirect to="/" />
    </BrowserRouter>
  )
}

export default App
