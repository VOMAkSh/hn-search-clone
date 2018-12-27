import React, { Component, Fragment } from 'react'

export class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ''
    }
  }
  render() {
    let title = this.props.data.title;
    let storyText = this.props.data.story_text;
    if(this.props.queryString !== "" && title !== null){
      const queryRegex = new RegExp(this.props.queryString, 'gi');
      title = this.props.data.title.replace(queryRegex, `<span class="yellow">${this.props.queryString[0].toUpperCase()}${this.props.queryString.substr(1,)}</span>`);
      if(storyText !== null) {
        storyText = this.props.data.story_text.replace(queryRegex, `<span class="yellow">${this.props.queryString[0].toUpperCase()}${this.props.queryString.substr(1,)}</span>`);
      }
    }
    return (
      <Fragment>
        <li style={{
          background: '#F5F7EE',
          borderStyle: 'none',
          borderBottomStyle: 'solid',
          borderColor: '#cccccc',
          borderWidth: '1px',
          padding: "10px",
          paddingLeft: "15px",
          marginBottom: '0px',
          width: "100%",
        }}>
          <h6><a href={this.props.data.url} style={{
            color: 'black'
          }} dangerouslySetInnerHTML={{__html: title}} />
          </h6>
          <div style={{
            color: "grey"
          }}>
            <div style={{
              fontSize: "12px",
              whiteSpace: "nowrap"
            }}>
            {this.props.data.points} points |  {this.props.data.author} | months ago |  {" " + this.props.data.num_comments} comments {" "}
            <div style={{
              display: "inline-block"
            }} className="hide-on-small-only">
              {this.props.data.url ?
                ` | (${this.props.data.url})` : null
              }
            </div>
            {
              this.props.data.story_text !== null ?
                <div style={{
                  whiteSpace: "pre-wrap"
                }} dangerouslySetInnerHTML={{__html: storyText}}/>
                :
                null
            }
            </div>
          </div>
        </li>
      </Fragment>
    )
  }
}

export default SearchResult
