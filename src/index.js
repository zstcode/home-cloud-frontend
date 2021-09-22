import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './index.css';
import App from './App/App';
import Login from './Login/Login'


ReactDOM.render(
  (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/logout" render={() => <Redirect to="/login" />} />
        <Route path="/" component={App} />
      </Switch>
    </Router>
  ),
  document.getElementById('root')
);

