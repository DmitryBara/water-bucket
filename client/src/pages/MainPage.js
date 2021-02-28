import React from 'react'
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom'

import { BucketDataComp } from '../components/BucketComp'
import { RulesComp } from '../components/RulesComp'


export const MainPage = () => {
  
  return (
    <BrowserRouter>
    <div className="row">
      <div className="col s6 offset-s3">
        <div className="card pink lighten-3" id='auth'>
          <div className="card-content white-text">
            <span className="card-title">Water Jug Challenge</span>
            <Link to='/input'>Input Data</Link>
            {'\u00A0'}{'\u00A0'}{'\u00A0'}
            <Link to='/rules'>See rules</Link>
            
            <Switch>
                <Route path='/input' component={BucketDataComp} />
                <Route path='/rules' component={RulesComp} />
            </Switch>

          </div>
        </div>
      </div>
    </div> 
    </BrowserRouter>
  )
}