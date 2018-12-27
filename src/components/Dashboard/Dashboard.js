import React, { Component, Fragment } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import fire from '../../config/fire';
import SearchHeader from '../SearchHeader/SearchHeader';
import SearchResults from './SearchResults';
import { Link } from 'react-router-dom';
import firebase from 'firebase';

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReceieved: [],
      queryString: '',
      totalPages: 0,
      currentPage: 0,
      totalSearchResults: 0,
      username: '',
      email: '',
      isLoading: true
    }
  }
  componentDidMount = () => {
    window.M.AutoInit();
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          username: user.displayName,
          email: user.email
        })
        const urlParams = "query=&page=0";
        if(!this.props.location.search.startsWith('?query=')){
          this.props.history.push(`/dashboard?${urlParams}`);
        }
        const values = queryString.parse(this.props.location.search);
        const { query, page } = values;
        if(this.props.location.search.indexOf("&page=") === -1) {
          this.props.history.push(`/dashboard?query=${query}&page=0`);
        }
        this.setState({
          queryString: query.trim()
        });
        axios.get(`https://hn.algolia.com/api/v1/search?query=${this.state.queryString}&page=${page}`).then(res => {
          this.setState({
            dataReceieved: res.data.hits,
            totalPages: res.data.nbPages,
            currentPage: res.data.page,
            totalSearchResults: res.data.nbHits,
            isLoading: false
          });
          if(this.state.queryString !== ""){
            const userRef = db.collection("users").where("email",'==' , user.email);
            userRef.get().then(querySnapshot => {
              querySnapshot.forEach(doc => {
                  db.collection("users").doc(doc.id).collection('history').add({
                    search: this.state.queryString,
                    timeOfSearch: new Date()
                  })
                })
              });
          }
        });
      } else {
        this.props.history.push("/");
      }
    });
  }

  onSearchHandler = query => {
    this.setState({
      queryString: query
    });
    this.props.history.push(`/dashboard?query=${query}&page=0`)
    axios.get(`https://hn.algolia.com/api/v1/search?query=${query}&page=0`).then(res => {
      this.setState({
        dataReceieved: res.data.hits,
        totalPages: res.data.nbPages,
        currentPage: res.data.page
      });
    });
  }
  onPageChangeHandler = page => {
    axios.get(`https://hn.algolia.com/api/v1/search?query=${this.state.queryString}&page=${page - 1}`).then(res => {
      this.setState({
        dataReceieved: res.data.hits,
        totalPages: res.data.nbPages,
        currentPage: res.data.page
      });
      console.log(this.state.currentPage, "in page handler")
    });
  }
  render() {
    let pages = [];
    if (this.state.totalPages > 0 && this.state.totalPages > 5) {
      for(let i = 1; i <= 5; i++){
        pages.push(i);
      }
      pages.push("...");
      pages.push(this.state.totalPages)
    } else {
      for (let i = 1; i <= this.state.totalPages; i++){
        pages.push(i);
      }
    }
    return (
      <div className="container" style={{
        overflowX: "hidden",
        width: "100%"
      }}>
        <SearchHeader queryString={this.state.queryString} onSearchHandler={this.onSearchHandler} username={this.state.username} userEmail={this.state.email} />
        <div className="row" style={{
          position: "fixed",
          background: "white",
          marginTop: '5px',
          padding: "4px",
          paddingTop: "10px",
          width: "100%",
          zIndex: '10'
        }}>
        <div className="center-align">
            <b>{this.state.totalSearchResults.toLocaleString() + " results"}</b>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Link className="btn waves-effect waves-light yellow darken-4" type="submit" to="/dashboard/history">History</Link>
        </div>
        </div>
        <div id="searchResults" className="container left-align" style={{
          position: "static",
          marginTop: "55px",
          width: "100%"
        }}>
          <SearchResults dataReceieved={this.state.dataReceieved} queryString={this.state.queryString} />
        </div>
        {this.state.totalPages > 0 ?
        <div id="pagination" className="center-align" style={{
          background: '#F5F7EE',
          marginTop: "-14px",
          padding: "10px"
        }}>
          <ul class="pagination">
            {this.state.currentPage === 0 ?
            <Fragment>
            <li class="disabled" style={{
              cursor: "not-allowed"
            }}><Link style={{
              width: "30px",
              padding: "0px"
            }} className="btn disabled" to=""><i class="material-icons">chevron_left</i></Link></li>
            &nbsp;
            &nbsp;
            </Fragment>
            :
            <Fragment>
              <li class="active"><Link to={`/dashboard?query=${this.state.queryString}&page=${this.state.currentPage - 1}`} style={{
                width: "30px",
                padding: "0px"
              }} className="btn orange darken-4" onClick={() => this.onPageChangeHandler(this.state.currentPage)}><i class="material-icons">chevron_left</i></Link></li>&nbsp;
            </Fragment>}
            {pages.map(page => {
              if (page === "..."){
                return <Fragment>
                  <li className="disabled" style={{
                  cursor: "not-allowed"
                }}><Link className="btn disabled" to="">...</Link></li>
                &nbsp;
                </Fragment>
              }
              if (this.state.currentPage + 1 === page) {
                return <li className="active"><Link onClick={() => this.onPageChangeHandler(page)} to={`/dashboard?query=${this.state.queryString}&page=${this.state.currentPage}`}>{page}</Link></li>
              } 
              return <li className="waves-effect"><Link onClick={() => this.onPageChangeHandler(page)} to={`/dashboard?query=${this.state.queryString}&page=${page - 1}`}>{page}</Link></li>
              })}
              {this.state.currentPage !== this.state.totalPages - 1 ?
              <li class="active"><Link to={`/dashboard?query=${this.state.queryString}&page=${this.state.currentPage + 1}`} style={{
                width: "30px",
                padding: "0px"
              }} className="btn orange darken-4" onClick={() => this.onPageChangeHandler(this.state.currentPage + 2)}><i class="material-icons">chevron_right</i></Link></li>
              :
              <Fragment>
                &nbsp;
                &nbsp;
                <li class="disabled" style={{
                  cursor: "not-allowed"
                }}><Link style={{
                  width: "30px",
                  padding: 0
                }} className="btn disabled" to=""><i class="material-icons">chevron_right</i></Link></li>
              </Fragment>}

          </ul>
        </div>: null}
      </div>
    )
  }
}

export default Dashboard
