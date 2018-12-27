import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import LoginForm from './components/auth/LoginForm';
import SignUpForm from './components/auth/SignUpForm';
import Dashboard from "./components/Dashboard/Dashboard"
import History from './components/History/History';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" component={SignUpForm} exact />
          <Route path="/login" component={LoginForm} />
          <Route path="/dashboard" component={Dashboard} exact />
          <Route path="/dashboard/history" component={History} />
        </Switch>
      </div>
    );
  }
}

export default App;
