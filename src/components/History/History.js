import React, { Component , Fragment } from 'react'
import HistoryHeader from '../Header/HistoryHeader';
import fire from '../../config/fire';
import firebase from 'firebase';

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchHistory: [],
      loading: true
    }
  }
  componentDidMount = () => {
    window.M.AutoInit();
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        const userRef = db.collection("users").where("email",'==' , user.email);
        userRef.get().then(querySnapshot =>{
          querySnapshot.forEach(doc => {
            db.collection("users").doc(doc.id).collection('history').orderBy('timeOfSearch', 'desc').limit(5).get().then(querySnapshot => {
              const searchHistory = []
              querySnapshot.forEach(doc => {
                searchHistory.push(doc.data());
              })
              this.setState({
                searchHistory,
                loading: false
              })
            })
          });
        })
      } else {
        this.props.history.push("/");
      }
    });
  }
  logout = () => {
    fire.auth().signOut().then(() => {
      window.M.toast({html: "You have been logged out successfully"});
      this.props.history.push("/login")
    }).catch(function(error) {
      window.M.toast({html: error.message})
    });
  }
  render() {
    return (
      <Fragment>
        <HistoryHeader logout={this.logout} />
        <div className="container" style={{
          marginTop: "20px"
        }}>
        <ul class="collection">
          <li class="collection-header" style={{
            padding: "20px"
          }}><h4>Top 5 Recent Searches</h4>
            <hr />
          </li>
          {this.state.loading === false ?
            this.state.searchHistory.length === 0 ?
            <b>No Searches found.</b> :
            this.state.searchHistory.map(history => 
              <li className="left-align collection-item"><b>{history.search}</b> <span className="right">{(new Date(history.timeOfSearch.seconds * 1000)).toDateString() + " " + (new Date(history.timeOfSearch.seconds * 1000)).toLocaleTimeString()}</span></li>  
            ) :
            <li className="center-align collection-item"><b>Loading your History.....</b></li>
          }
        </ul>
        </div>
      </Fragment>
    )
  }
}

export default History
