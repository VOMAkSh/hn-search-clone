import React, { Component } from "react";
import SearchResult from "./SearchResult";

export class SearchResults extends Component {
  render() {
    return (
      <ul
        style={{
          width: "100%",
          overflowX: "hidden"
        }}
      >
        {this.props.dataReceieved.map(data => (
          <SearchResult data={data} queryString={this.props.queryString} />
        ))}
      </ul>
    );
  }
}

export default SearchResults;
