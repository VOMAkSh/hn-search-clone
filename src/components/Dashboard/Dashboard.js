import React, { Component, Fragment } from "react";
import queryString from "query-string";
import axios from "axios";
import fire from "../../config/fire";
import SearchHeader from "../SearchHeader/SearchHeader";
import SearchResults from "./SearchResults";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { Dropdown } from "semantic-ui-react";
import moment from "moment";
import DatePickerModal from "../DatePickerModal/DatePickerModal";

var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});

const searchFilters = [
  {
    text: "All",
    value: "all"
  },
  {
    text: "Stories",
    value: "story"
  },
  {
    text: "Comments",
    value: "comment"
  }
];

const popularityFilters = [
  {
    text: "Popularity",
    value: "Popularity"
  },
  {
    text: "Date",
    value: "Date"
  }
];

const dateFilters = [
  {
    text: "All time",
    value: "all"
  },
  {
    text: "Past 24h",
    value: "past24h"
  },
  {
    text: "Past Week",
    value: "pastWeek"
  },
  {
    text: "Past Month",
    value: "pastMonth"
  },
  {
    text: "Past Year",
    value: "pastYear"
  },
  {
    text: "Custom Range",
    value: "custom"
  }
];

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataReceieved: [],
      queryString: "",
      totalPages: 0,
      currentPage: 0,
      totalSearchResults: 0,
      username: "",
      email: "",
      isLoading: true,
      type: "all",
      sort: "Popularity",
      date: "all",
      datePickerOpen: false
    };
  }
  componentDidMount = () => {
    window.M.AutoInit();
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({
          username: user.displayName,
          email: user.email
        });
        const urlParams =
          "query=&page=0&type=all&sort=byPopularity&dateRange=all";
        if (!this.props.location.search.startsWith("?query=")) {
          this.props.history.push(`/dashboard?${urlParams}`);
        }
        const values = queryString.parse(this.props.location.search);
        let { query, page, type, sort, dateRange } = values;
        if (sort !== "byDate" && sort !== "byPopularity") {
          sort = "Popularity";
        } else if (sort === "byDate") {
          sort = "Date";
        } else if (sort === "byPopularity") {
          sort = "Popularity";
        }
        if (
          dateRange !== "all" &&
          dateRange !== "past24h" &&
          dateRange !== "pastWeek" &&
          dateRange !== "pastMonth" &&
          dateRange !== "pastYear" &&
          dateRange !== "custom"
        ) {
          dateRange = "all";
          this.props.history.push(
            `/dashboard?query=${query}&page=${
              this.state.currentPage
            }&type=all&sort=by${this.state.sort}&dateRange=${this.state.date}`
          );
        }
        if (dateRange === "custom") {
          this.setState({
            datePickerOpen: true
          });
          return;
        }
        this.setState({
          queryString: query.trim(),
          type: type === "" || type === undefined ? "all" : type,
          currentPage:
            page === "" || page === undefined ? this.state.currentPage : page,
          sort,
          dateRange
        });
        if (this.props.location.search.indexOf("&type=") === -1 || !type) {
          this.props.history.push(
            `/dashboard?query=${query}&page=${
              this.state.currentPage
            }&type=all&sort=by${this.state.sort}&dateRange=${this.state.date}`
          );
        }
        if (this.props.location.search.indexOf("&page=") === -1 || !page) {
          this.props.history.push(
            `/dashboard?query=${query}&page=${
              this.state.currentPage
            }&type=all&sort=by${this.state.sort}&dateRange=${this.state.date}`
          );
        }
        if (
          this.props.location.search.indexOf("&dateRange=") === -1 ||
          !dateRange
        ) {
          this.props.history.push(
            `/dashboard?query=${query}&page=${
              this.state.currentPage
            }&type=all&sort=by${this.state.sort}&dateRange=${this.state.date}`
          );
        }
        if (
          this.props.location.search.indexOf("&sort=") === -1 ||
          (queryString.parse(this.props.location.search).sort !==
            "byPopularity" &&
            queryString.parse(this.props.location.search).sort !== "byDate")
        ) {
          this.props.history.push(
            `/dashboard?query=${query}&page=${
              this.state.currentPage
            }&type=all&sort=by${this.state.sort}&dateRange=${this.state.date}`
          );
        }
        if (this.state.sort === "Date") {
          axios
            .get(
              `https://hn.algolia.com/api/v1/${
                this.state.sort === "Date" ? "search_by_date" : ""
              }?query=${this.state.queryString}&page=${
                this.state.currentPage
              }&tags=${this.state.type === "all" ? "" : this.state.type}`
            )
            .then(res => {
              console.log(this.state, "in axios get component did mount");
              this.setState({
                dataReceieved: res.data.hits,
                totalPages: res.data.nbPages,
                currentPage: res.data.page,
                totalSearchResults: res.data.nbHits,
                isLoading: false
              });
              if (this.state.queryString !== "") {
                const userRef = db
                  .collection("users")
                  .where("email", "==", user.email);
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
              }
            });
        } else {
          axios
            .get(
              `https://hn.algolia.com/api/v1/search?query=${
                this.state.queryString
              }&page=${this.state.currentPage}&tags=${
                this.state.type === "all" ? "" : this.state.type
              }`
            )
            .then(res => {
              console.log(this.state, "in axios get component did mount");
              this.setState({
                dataReceieved: res.data.hits,
                totalPages: res.data.nbPages,
                currentPage: res.data.page,
                totalSearchResults: res.data.nbHits,
                isLoading: false
              });
              if (this.state.queryString !== "") {
                const userRef = db
                  .collection("users")
                  .where("email", "==", user.email);
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
              }
            });
        }
      } else {
        this.props.history.push("/");
      }
    });
  };
  onSearchHandler = query => {
    this.setState({
      queryString: query
    });
    this.props.history.push(
      `/dashboard?query=${query}&page=0&type=${this.state.type}&dateRange=${
        this.state.date
      }`
    );
    axios
      .get(
        `https://hn.algolia.com/api/v1/search?query=${query}&page=0&tags=${
          this.state.type === "all" ? "" : this.state.type
        }`
      )
      .then(res => {
        this.setState({
          dataReceieved: res.data.hits,
          totalPages: res.data.nbPages,
          currentPage: res.data.page
        });
      });
  };
  onPageChangeHandler = page => {
    console.log(
      `/dashboard?query=${this.state.queryString}&page=${page - 1}&type=${
        this.state.type
      }`
    );
    axios
      .get(
        `https://hn.algolia.com/api/v1/search?query=${
          this.state.queryString
        }&page=${page - 1}&tags=${
          this.state.type === "all" ? "" : this.state.type
        }`
      )
      .then(res => {
        this.setState({
          dataReceieved: res.data.hits,
          totalPages: res.data.nbPages,
          currentPage: res.data.page
        });
      });
  };
  onChangeSearchFilterHandler = (event, { value }) => {
    const querySearch = this.state.queryString;
    let type = value;
    this.setState({
      type
    });
    type = value === "all" ? "" : value;
    if (this.state.sort === "Popularity") {
      console.log(value);
      axios
        .get(
          `http://hn.algolia.com/api/v1/search?query=${querySearch}&page=0&tags=${type}`
        )
        .then(({ data }) => {
          console.log(data);
          this.props.history.push(
            `/dashboard?query=${querySearch}&page=0&type=${value}&sort=by${
              this.state.sort
            }&dateRange=${this.state.date}`
          );
          this.setState({
            type: value,
            dataReceieved: data.hits,
            totalPages: data.nbPages,
            currentPage: 0
          });
        });
    } else {
      console.log(value);
      this.props.history.push(
        `/dashboard?query=${this.state.queryString}&page=${
          this.state.currentPage
        }&type=${value}&sort=by${this.state.sort}&dateRange=${this.state.date}`
      );
      axios
        .get(
          `https://hn.algolia.com/api/v1/${
            this.state.sort === "Date" ? "search_by_date" : ""
          }?query=${this.state.queryString}&page=${
            this.state.currentPage
          }&tags=${type === "all" ? "" : type}`
        )
        .then(res => {
          console.log(res.data);
          this.setState({
            dataReceieved: res.data.hits,
            totalPages: res.data.nbPages,
            currentPage: res.data.page,
            totalSearchResults: res.data.nbHits,
            isLoading: false
          });
        });
    }
  };
  onChangePopularityFilterHandler = (event, { value }) => {
    this.setState({
      sort: value
    });
    if (value === "Date") {
      this.props.history.push(
        `/dashboard?query=${this.state.queryString}&page=${
          this.state.currentPage
        }&type=all&sort=by${value}&dateRange=${this.state.date}`
      );
      axios
        .get(
          `https://hn.algolia.com/api/v1/${
            value === "Date" ? "search_by_date" : ""
          }?query=${this.state.queryString}&page=${
            this.state.currentPage
          }&tags=${this.state.type === "all" ? "" : this.state.type}`
        )
        .then(res => {
          this.setState({
            dataReceieved: res.data.hits,
            totalPages: res.data.nbPages,
            currentPage: res.data.page,
            totalSearchResults: res.data.nbHits,
            isLoading: false
          });
        });
    } else {
      this.props.history.push(
        `/dashboard?query=${this.state.queryString}&page=${
          this.state.currentPage
        }&type=all&sort=by${value}&dateRange=${this.state.date}`
      );
      axios
        .get(
          `https://hn.algolia.com/api/v1/search?query=${
            this.state.queryString
          }&page=${this.state.currentPage}&tags=${
            this.state.type === "all" ? "" : this.state.type
          }`
        )
        .then(res => {
          this.setState({
            dataReceieved: res.data.hits,
            totalPages: res.data.nbPages,
            currentPage: res.data.page,
            totalSearchResults: res.data.nbHits,
            isLoading: false
          });
        });
    }
  };
  onChangeDateFilterHandler = (event, { value }) => {
    this.setState({
      date: value
    });
    this.props.history.push(
      `/dashboard?query=${this.state.queryString}&page=${
        this.state.currentPage
      }&type=${this.state.type}&sort=by${this.state.sort}&dateRange=${value}`
    );
    let apiRequestUrl = "";
    if (value === "all") {
      apiRequestUrl = `https://hn.algolia.com/api/v1/${
        this.state.sort === "Date" ? "search_by_date" : "search"
      }?query=${this.state.queryString}&page=${this.state.currentPage}&tags=${
        this.state.type === "all" ? "" : this.state.type
      }`;
    } else if (value === "past24h") {
      const last24hTime = moment()
        .subtract(1, "day")
        .unix();
      apiRequestUrl = `https://hn.algolia.com/api/v1/${
        this.state.sort === "Date" ? "search_by_date" : "search"
      }?query=${this.state.queryString}&page=${this.state.currentPage}&tags=${
        this.state.type === "all" ? "" : this.state.type
      }&numericFilters=["created_at_i>${last24hTime}"]`;
    } else if (value === "pastWeek") {
      const pastWeekTime = moment()
        .subtract(7, "days")
        .unix();
      apiRequestUrl = `https://hn.algolia.com/api/v1/${
        this.state.sort === "Date" ? "search_by_date" : "search"
      }?query=${this.state.queryString}&page=${this.state.currentPage}&tags=${
        this.state.type === "all" ? "" : this.state.type
      }&numericFilters=["created_at_i>${pastWeekTime}"]`;
    } else if (value === "pastMonth") {
      const pastMonthTime = moment()
        .subtract(1, "months")
        .unix();
      apiRequestUrl = `https://hn.algolia.com/api/v1/${
        this.state.sort === "Date" ? "search_by_date" : "search"
      }?query=${this.state.queryString}&page=${this.state.currentPage}&tags=${
        this.state.type === "all" ? "" : this.state.type
      }&numericFilters=["created_at_i>${pastMonthTime}"]`;
    } else if (value === "pastYear") {
      const pastYearTime = moment()
        .subtract(1, "years")
        .unix();
      apiRequestUrl = `https://hn.algolia.com/api/v1/${
        this.state.sort === "Date" ? "search_by_date" : "search"
      }?query=${this.state.queryString}&page=${this.state.currentPage}&tags=${
        this.state.type === "all" ? "" : this.state.type
      }&numericFilters=["created_at_i>${pastYearTime}"]`;
    } else if (value === "custom") {
      this.setState({
        datePickerOpen: true
      });
      return;
    }
    axios.get(apiRequestUrl).then(res => {
      console.log(res.data);
      this.setState({
        dataReceieved: res.data.hits,
        totalPages: res.data.nbPages,
        currentPage: res.data.page,
        totalSearchResults: res.data.nbHits,
        isLoading: false
      });
    });
  };
  closeModalWindow = () => {
    this.setState({
      datePickerOpen: false,
      date: "all"
    });
  };
  searchCustomDateRange = (startDate, endDate) => {
    const apiRequestUrl = `https://hn.algolia.com/api/v1/${
      this.state.sort === "Date" ? "search_by_date" : "search"
    }?query=${this.state.queryString}&page=${this.state.currentPage}&tags=${
      this.state.type === "all" ? "" : this.state.type
    }&numericFilters=["created_at_i>${startDate}","created_at_i<${endDate}"]`;
    axios.get(apiRequestUrl).then(res => {
      this.setState({
        dataReceieved: res.data.hits,
        totalPages: res.data.nbPages,
        currentPage: res.data.page,
        totalSearchResults: res.data.nbHits,
        isLoading: false,
        datePickerOpen: false
      });
    });
  };
  render() {
    let pages = [];
    if (this.state.totalPages > 0 && this.state.totalPages > 5) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(this.state.totalPages);
    } else {
      for (let i = 1; i <= this.state.totalPages; i++) {
        pages.push(i);
      }
    }
    return (
      <div
        className="container"
        style={{
          overflowX: "hidden",
          width: "100%"
        }}
      >
        <SearchHeader
          queryString={this.state.queryString}
          onSearchHandler={this.onSearchHandler}
          username={this.state.username}
          userEmail={this.state.email}
        />
        <div
          className="row"
          style={{
            position: "fixed",
            background: "white",
            marginTop: "5px",
            padding: "4px",
            paddingTop: "10px",
            width: "100%",
            zIndex: "10"
          }}
        >
          <div>
            <div className="left-align">
              Search by{" "}
              <Dropdown
                inline
                options={searchFilters}
                defaultValue={
                  queryString.parse(this.props.location.search).type
                    ? queryString.parse(this.props.location.search).type
                    : this.state.type
                }
                onChange={this.onChangeSearchFilterHandler}
              />{" "}
              by{" "}
              <Dropdown
                inline
                options={popularityFilters}
                defaultValue={
                  queryString.parse(this.props.location.search).sort
                    ? queryString
                        .parse(this.props.location.search)
                        .sort.slice(2)
                    : this.state.sort
                }
                onChange={this.onChangePopularityFilterHandler}
              />{" "}
              by{" "}
              <Dropdown
                inline
                options={dateFilters}
                defaultValue={
                  queryString.parse(this.props.location.search).dateRange !==
                    "all" &&
                  queryString.parse(this.props.location.search).dateRange !==
                    "past24h" &&
                  queryString.parse(this.props.location.search).dateRange !==
                    "pastWeek" &&
                  queryString.parse(this.props.location.search).dateRange !==
                    "pastMonth" &&
                  queryString.parse(this.props.location.search).dateRange !==
                    "pastYear" &&
                  queryString.parse(this.props.location.search).dateRange !==
                    "custom"
                    ? "all"
                    : queryString.parse(this.props.location.search).dateRange
                }
                onChange={this.onChangeDateFilterHandler}
              />
            </div>
            <div className="center-align">
              <b>
                {this.state.totalSearchResults.toLocaleString() + " results"}
              </b>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <Link
                className="btn-small waves-effect waves-light yellow darken-4"
                type="submit"
                to="/dashboard/history"
              >
                History
              </Link>
            </div>
          </div>
        </div>
        <div
          id="searchResults"
          className="container left-align"
          style={{
            position: "static",
            marginTop: "55px",
            width: "100%"
          }}
        >
          <SearchResults
            dataReceieved={this.state.dataReceieved}
            queryString={this.state.queryString}
          />
        </div>
        {this.state.totalPages > 0 ? (
          <div
            id="pagination"
            className="center-align"
            style={{
              background: "#F5F7EE",
              marginTop: "-14px",
              padding: "10px"
            }}
          >
            <ul class="pagination">
              {this.state.currentPage === 0 ? (
                <Fragment>
                  <li
                    class="disabled"
                    style={{
                      cursor: "not-allowed"
                    }}
                  >
                    <Link
                      style={{
                        width: "30px",
                        padding: "0px"
                      }}
                      className="btn disabled"
                      to=""
                    >
                      <i class="material-icons">chevron_left</i>
                    </Link>
                  </li>
                  &nbsp; &nbsp;
                </Fragment>
              ) : (
                <Fragment>
                  <li class="active">
                    <Link
                      to={`/dashboard?query=${
                        this.state.queryString
                      }&page=${this.state.currentPage - 1}&tags=${
                        this.state.type === "all" ? "" : this.state.type
                      }`}
                      style={{
                        width: "30px",
                        padding: "0px"
                      }}
                      className="btn orange darken-4"
                      onClick={() =>
                        this.onPageChangeHandler(this.state.currentPage)
                      }
                    >
                      <i class="material-icons">chevron_left</i>
                    </Link>
                  </li>
                  &nbsp;
                </Fragment>
              )}
              {pages.map(page => {
                if (page === "...") {
                  return (
                    <Fragment>
                      <li
                        className="disabled"
                        style={{
                          cursor: "not-allowed"
                        }}
                      >
                        <Link className="btn disabled" to="">
                          ...
                        </Link>
                      </li>
                      &nbsp;
                    </Fragment>
                  );
                }
                if (this.state.currentPage + 1 === page) {
                  return (
                    <li className="active">
                      <Link
                        onClick={() => this.onPageChangeHandler(page)}
                        to={`/dashboard?query=${this.state.queryString}&page=${
                          this.state.currentPage
                        }&tags=${
                          this.state.type === "all" ? "" : this.state.type
                        }`}
                      >
                        {page}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li className="waves-effect">
                    <Link
                      onClick={() => this.onPageChangeHandler(page)}
                      to={`/dashboard?query=${
                        this.state.queryString
                      }&page=${page - 1}&tags=${
                        this.state.type === "all" ? "" : this.state.type
                      }`}
                    >
                      {page}
                    </Link>
                  </li>
                );
              })}
              {this.state.currentPage !== this.state.totalPages - 1 ? (
                <li class="active">
                  <Link
                    to={`/dashboard?query=${this.state.queryString}&page=${this
                      .state.currentPage + 1}&tags=${
                      this.state.type === "all" ? "" : this.state.type
                    }`}
                    style={{
                      width: "30px",
                      padding: "0px"
                    }}
                    className="btn orange darken-4"
                    onClick={() =>
                      this.onPageChangeHandler(this.state.currentPage + 2)
                    }
                  >
                    <i class="material-icons">chevron_right</i>
                  </Link>
                </li>
              ) : (
                <Fragment>
                  &nbsp; &nbsp;
                  <li
                    class="disabled"
                    style={{
                      cursor: "not-allowed"
                    }}
                  >
                    <Link
                      style={{
                        width: "30px",
                        padding: 0
                      }}
                      className="btn disabled"
                      to=""
                    >
                      <i class="material-icons">chevron_right</i>
                    </Link>
                  </li>
                </Fragment>
              )}
            </ul>
          </div>
        ) : null}
        <DatePickerModal
          open={this.state.datePickerOpen}
          closeModalWindow={this.closeModalWindow}
          searchCustomDateRange={this.searchCustomDateRange}
        />
      </div>
    );
  }
}

export default Dashboard;
