import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export class HistoryHeader extends Component {
  render() {
    return (
      <nav className="orange darken-2">
        <div class="container left-align nav-wrapper orange darken-2">
          <span class="left brand-logo">History</span>
          <ul id="nav-mobile" class="right">
            <li><Link to="/dashboard">Search</Link></li>
            <li><button className="btn red" onClick={this.props.logout}>Logout</button></li>
          </ul>
        </div>
    </nav>
    )
  }
}

export default HistoryHeader
