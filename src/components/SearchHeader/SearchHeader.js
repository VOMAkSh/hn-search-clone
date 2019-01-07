import React, { Component, Fragment } from "react";
import firebase from "firebase";
import fire from "../../config/fire";

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

export class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queryString: "",
      isTyping: false
    };
  }
  componentDidMount = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        const userRef = db.collection("users").where("email", "==", user.email);
        userRef.get().then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.setState({
              username: doc.data().username
            });
          });
        });
      }
    });
  };

  onChangeHandler = event => {
    this.setState({
      queryString: event.target.value
    });
    if (this.props.queryString !== "") {
      this.setState({
        isTyping: true
      });
    }
  };
  onSearchQuery = () => {
    const userRef = db
      .collection("users")
      .where("email", "==", this.props.userEmail);
    userRef.get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        db.collection("users")
          .doc(doc.id)
          .collection("history")
          .add({
            search: this.state.queryString,
            timeOfSearch: new Date()
          });
      });
    });
    this.props.onSearchHandler(this.state.queryString);
  };
  render() {
    let queryString = "";
    if (this.props.queryString !== "" && this.state.isTyping === false) {
      queryString = this.props.queryString;
    } else {
      queryString = this.state.queryString;
    }
    return (
      <Fragment>
        <div class="navbar-fixed">
          <nav
            id="nav-inner"
            className="container"
            style={{
              height: "70px",
              width: "100%"
            }}
          >
            <div
              class="nav-wrapper"
              style={{
                background: "#FF742B"
              }}
            >
              <img
                src="https://hn.algolia.com/assets/logo-hn-search.png"
                className="left"
                style={{
                  height: "40px",
                  display: "inline-block",
                  marginTop: "10px",
                  marginLeft: "10px",
                  width: "40px"
                }}
                alt="logo"
              />
              <div
                style={{
                  display: "inline-block",
                  position: "absolute",
                  left: 60,
                  fontSize: "14px"
                }}
              >
                <b>{this.state.username}</b>
              </div>
              <ul
                className="left-align"
                style={{
                  marginLeft: "99px"
                }}
              >
                <li
                  style={{
                    width: "100%",
                    marginLeft: "0px"
                  }}
                >
                  <div
                    className="center-align"
                    style={{
                      display: "inline-block",
                      position: "relative"
                    }}
                  >
                    <input
                      id="search"
                      className="inputText"
                      placeholder="Search..."
                      onChange={this.onChangeHandler}
                      style={{
                        width: "50%",
                        background: "white",
                        paddingLeft: "10px",
                        marginLeft: "0px",
                        borderStyle: "solid",
                        borderWidth: "1px",
                        borderColor: "orange"
                      }}
                      value={queryString}
                    />
                    <button
                      class="btn waves-effect waves-light yellow darken-3"
                      onClick={this.onSearchQuery}
                      style={{
                        height: "44px",
                        marginTop: "-3px"
                      }}
                    >
                      <i
                        class="material-icons"
                        style={{
                          position: "relative",
                          top: "-5px"
                        }}
                      >
                        search
                      </i>
                    </button>
                  </div>
                  <div
                    className="hide-on-small-only"
                    style={{
                      display: "inline-block",
                      position: "relative",
                      top: "0px",
                      padding: "5px",
                      paddingRight: "10px"
                    }}
                  >
                    &nbsp; by &nbsp;&nbsp;&nbsp;
                    <img
                      alt=""
                      src="https://d3nb9u6x572n0.cloudfront.net/assets/algolia-logo-white-65086ed3930483340981cc7aaab1be051e38bc091406fd806d0ad05640c1bc28.svg"
                      style={{
                        height: "20px",
                        width: "80px",
                        position: "relative",
                        top: "5px",
                        right: "5px"
                      }}
                    />
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </Fragment>
    );
  }
}

export default SearchHeader;
