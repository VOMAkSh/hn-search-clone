import React, { Component } from "react";
import { Modal, Header, Button, Icon } from "semantic-ui-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export class DatePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: "",
      endDate: ""
    };
  }
  handleChangeStartDate = date => {
    console.log(date);
    console.log(moment(date).format());
    this.setState({
      startDate: date
    });
  };
  handleChangeEndDate = date => {
    this.setState({
      endDate: date
    });
  };
  render() {
    return (
      <Modal open={this.props.open} className="container">
        <Header icon="archive" content="Custom Search by Date" />
        <Modal.Content className="container">
          <DatePicker
            selected={this.state.startDate}
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeStartDate}
            placeholderText="Start Date"
          />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <DatePicker
            selected={this.state.endDate}
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={this.handleChangeEndDate}
            placeholderText="End Date"
          />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </Modal.Content>
        <Modal.Actions>
          <Button basic color="red" onClick={this.props.closeModalWindow}>
            <Icon name="remove" /> Close
          </Button>
          <Button
            color="green"
            onClick={() => {
              if (this.state.startDate === "" || this.state.endDate === "") {
                window.M.toast({ html: "Please, enter valid dates" });
                return;
              }
              this.props.searchCustomDateRange(
                moment(this.state.startDate).unix(),
                moment(this.state.endDate).unix()
              );
            }}
          >
            <Icon name="checkmark" /> Search by Date
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DatePickerModal;
