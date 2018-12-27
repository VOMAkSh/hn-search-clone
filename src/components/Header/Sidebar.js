import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class Sidebar extends Component {
  render() {
    return (
      <ul class="sidenav" id="mobile-demo">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/">Create Account</Link></li>
      </ul>
    )
  }
}

export default Sidebar
