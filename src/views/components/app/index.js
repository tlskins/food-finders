import React from 'react';
import { Redirect, Route, Link, Switch } from 'react-router-dom'
import Home from '@containers/home/Home'
import LoginPage from '@containers/user/LoginForm'
import ConfirmEmail from '@containers/user/ConfirmEmail'
import FlashMessages from '@containers/common/FlashMessages'


const App = () => (
  <div>
    <FlashMessages />
    <main>
      <Switch>
        <Route exact path="/login" component={ LoginPage } />
        <Route path="/" component={ Home } />
      </Switch>
      <Route path="/users/confirmation" component={ ConfirmEmail } />
    </main>
  </div>
)

export default App
