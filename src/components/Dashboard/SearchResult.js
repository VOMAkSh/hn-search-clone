import React, { Component, Fragment } from "react";

export class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: ""
    };
  }
  render() {
    let title =
      this.props.data.title && this.props.data.title !== ""
        ? this.props.data.title
        : this.props.data.story_title;
    if (!this.props.data.title && !this.props.data.story_title) {
      title = null;
    }
    let storyText = this.props.data.url
      ? this.props.data.story_text
      : this.props.data.comment_text;
    if (!storyText) {
      storyText = this.props.data._highlightResult.story_text
        ? this.props.data._highlightResult.story_text.value
        : null;
    }
    if (this.props.queryString !== "" && title !== null) {
      const queryRegex = new RegExp(this.props.queryString, "gi");
      title = title.replace(
        queryRegex,
        `<span class="yellow">${this.props.queryString[0].toUpperCase()}${this.props.queryString.substr(
          1
        )}</span>`
      );
      if (storyText !== null) {
        storyText = storyText.replace(
          queryRegex,
          `<span class="yellow">${this.props.queryString[0].toUpperCase()}${this.props.queryString.substr(
            1
          )}</span>`
        );
      }
    }
    return (
      <Fragment>
        {title ? (
          <li
            style={{
              background: "#F5F7EE",
              borderStyle: "none",
              borderBottomStyle: "solid",
              borderColor: "#cccccc",
              borderWidth: "1px",
              padding: "10px",
              paddingLeft: "15px",
              marginBottom: "0px",
              width: "100%"
            }}
          >
            <h6>
              {this.props.data.url ? (
                <a
                  href={this.props.data.url}
                  style={{
                    color: "black"
                  }}
                  dangerouslySetInnerHTML={{ __html: title }}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: title }} />
              )}
            </h6>
            <div
              style={{
                color: "grey"
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  whiteSpace: "nowrap"
                }}
              >
                {this.props.data.points} points | {this.props.data.author} |
                months ago |{" "}
                {" " + this.props.data.num_comments
                  ? this.props.data.num_comments
                  : null}{" "}
                comments{" "}
                <div
                  style={{
                    display: "inline-block"
                  }}
                  className="hide-on-small-only"
                >
                  {this.props.data.url ? ` | (${this.props.data.url})` : null}
                </div>
                {storyText ? (
                  <div
                    style={{
                      whiteSpace: "pre-wrap"
                    }}
                    dangerouslySetInnerHTML={{ __html: storyText }}
                  />
                ) : null}
              </div>
            </div>
          </li>
        ) : null}
      </Fragment>
    );
  }
}

export default SearchResult;
