import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export class Header extends Component {
  render() {
    return (
        <nav className="black">
          <div className="nav-wrapper container ">
            <a href="/" className="brand-logo right">Dummy Algolia</a>
            <a href="/" data-target="mobile-demo" className="sidenav-trigger">
              <i class="material-icons">menu</i>
            </a>
            <ul id="nav-mobile" className="left hide-on-med-and-down">
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/">Create Account</Link></li>
            </ul>
          </div>
          <Sidebar />
        </nav>
    )
  }
}

export default Header
