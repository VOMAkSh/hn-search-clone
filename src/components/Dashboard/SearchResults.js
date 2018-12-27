import React, { Component } from 'react'
import SearchResult from './SearchResult';

export class SearchResults extends Component {
  render() {
    return (
      <ul style={{
        width: "100%",
        overflowX: 'hidden'
      }}>
        {this.props.dataReceieved.map(data => {
          if(data.title !== null && data.title !== ""){
            return <SearchResult data={data} queryString={this.props.queryString} />
          }
          return null;
        })}
      </ul>
    )
  }
}

export default SearchResults
