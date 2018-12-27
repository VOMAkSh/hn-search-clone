import React, { Component, Fragment } from 'react'
import Header from '../Header/Header';
import fire from '../../config/fire';
import firebase from 'firebase';

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      "username": '',
      "signupEmail": '',
      "signupPassword": ''
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
  createUserAccount = event => {
    event.preventDefault();
    const { signupEmail, signupPassword, username } = this.state;
    fire.auth().createUserWithEmailAndPassword(signupEmail, signupPassword)
    .then(() => {
      window.M.toast({html: "Creating your Account....."});
      db.collection('users').doc().set({
        email: signupEmail,
        username
      });
      const user = fire.auth().currentUser;
      user.updateProfile({
        displayName: username,
        username
      }).then(() => {
        window.M.toast({html: "Your Account has been created successfully"});
        this.props.history.push("/dashboard");
      }).catch(function(error) {
        window.M.toast({html: error.message})
      });
    })
    .catch(function(error) {
      window.M.toast({html: error.message})
    });
  }
  render() {
    return (
      <Fragment>
        <Header />
        <div className="container">
          <h3>Create your Account</h3>
          <form className="col s12" autocomplete="off">
            <div className="row">
              <div className="input-field col s8 offset-s2">
                <input id="username" type="text" onChange={this.handleOnChange} value={this.state.username} />
                <label for="username">Username</label>
              </div>
              <div className="input-field col s8 offset-s2">
                <input id="signupEmail" type="email" onChange={this.handleOnChange} value={this.state.email} />
                <label for="signupEmail">Email</label>
              </div>
              <div className="input-field col s8 offset-s2">
                <input id="signupPassword" type="password" onChange={this.handleOnChange} value={this.state.password} />
                <label for="signupPassword">Password</label>
              </div>
            </div>
            <div className="row">
              <button onClick={this.createUserAccount} className="btn-large col s8 green darken-2 push-s2">Create your Account</button>
            </div>
          </form>
        </div>
      </Fragment>
    )
  }
}

export default SignUpForm;