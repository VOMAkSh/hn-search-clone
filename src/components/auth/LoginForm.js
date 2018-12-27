import React, { Component, Fragment } from 'react'
import Header from '../Header/Header';
import fire from '../../config/fire';

export class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginEmail: '',
      loginPassword: ''
    }
  }
  componentDidMount = () => {
    window.M.AutoInit();
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.history.push("/dashboard");
      }
    });
  }
  handleOnChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    })
  }
  loggingIn = event => {
    event.preventDefault();
    const { loginEmail, loginPassword } = this.state;
    fire.auth().signInWithEmailAndPassword(loginEmail, loginPassword)
    .then(() => {
      window.M.toast({html: "You have successfully logged in."});
      this.props.history.push("/dashboard");
    })
    .catch(function(error) {
      window.M.toast({html: error.message});
    });
  }
  render() {
    return (
      <Fragment>
        <Header />
        <div className="container">
          <h3>Login</h3>
          <form className="col s12" autocomplete="off">
            <div className="row">
              <div className="input-field col s8 offset-s2">
                <input id="loginEmail" type="email" onChange={this.handleOnChange} value={this.state.loginEmail} />
                <label for="loginEmail">Email</label>
              </div>
              <div className="input-field col s8 offset-s2">
                <input id="loginPassword" type="password" onChange={this.handleOnChange} value={this.state.loginPassword} />
                <label for="loginPassword">Password</label>
              </div>
            </div>
            <div className="row">
              <button onClick={this.loggingIn} className="btn-large col s8 blue offset-s2">Login</button>
            </div>
          </form>
        </div>
      </Fragment>
    )
  }
}

export default LoginForm
