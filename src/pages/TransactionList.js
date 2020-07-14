import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import PaginationComponent from "react-reactstrap-pagination";
import { Row, Col, Table, Button } from "reactstrap";
import Moment from "moment";
import AxiosRequest from "../AxiosRequest";
import {
  TRANSACTION_FILTER,
  TRANSACTION_LIST
} from "../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.transaction });

const mapDispatchToProps = (dispatch) => ({
  ongetTrasnactionList: (data) =>
  dispatch({
    type: TRANSACTION_LIST,
    payload: AxiosRequest.CRM.getUserList(data),
  }),
onSetUserFilters: (userfilter) =>
  dispatch({
    type: TRANSACTION_FILTER,
    userfilter,
  }),
});
const defultPage = 1;
const pagelimit = 20;
class TransactionList extends React.Component {
  constructor() {
    super();
    this.state = {
      startdate: false,
      enddate: false,
      isLoading: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.dateSelectOr = this.dateSelectOr.bind(this);
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}

  onGetTransaction = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {};
      if (this.props.userfilter) {
        data = this.props.userfilter;
        this.setState({
          startdate: data.starting_date,
          enddate: data.end_date,
        });
      } else {
        data.page = defultPage;
        if (this.state.startdate) data.starting_date = this.state.startdate;
        if (this.state.enddate) data.end_date = this.state.enddate;
      }

      this.props.ongetUserList(data);
      this.props.onSetUserFilters(data);
    }
  };

  dateSelectOr = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate, enddate: enddate });
  };
  onSearch = () => {
    this.props.onSetUserFilters(false);
    this.setState({ isLoading: false });
  };
  onReset = () => {
    this.setState({
      startdate: false,
      enddate: false,
    });
    this.props.onSetUserFilters(false);
    this.setState({ isLoading: false });
  };
  render() {
    const transactionlist = this.props.transactionlist || [];
    return (
      <div className="pd-6 width-full mr-t-20" style={{ position: "fixed" }}>
        <div style={{ height: "85vh" }} className="width-85">
          <div className="fieldset">
            <div className="legend">Transaction List</div>
            <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-50 mr-l-20 align_self_center">Date:</div>
              <div className="width-250 mr-l-10">
                <DateRangePicker
                  opens="right"
                  drops="down"
                  onApply={this.dateSelectOr}
                >
                  <Button
                    className="mr-r-10"
                    style={{ width: "30px", height: "30px", padding: "0px" }}
                  >
                    <i className="far fa-calendar-alt"></i>
                  </Button>
                </DateRangePicker>
                <span className="mr-l-10">
                  {this.state.startdate
                    ? Moment(this.state.startdate).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                  {this.state.startdate
                    ? " - " + Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </span>
              </div>
            </div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14 txt-align-right">
              <Col lg="8"></Col>
              <Col className="txt-align-right">
                <Button size="sm" className="mr-r-10" onClick={this.onReset}>
                  Reset
                </Button>
                <Button size="sm" onClick={this.onSearch}>
                  Search
                </Button>
                <Button
                  size="sm"
                  onClick={() => this.props.history.goBack()}
                  className="mr-l-10"
                >
                  Back
                </Button>
              </Col>
            </Row>
          </div>

          <div className="pd-6">
            <div className="scroll-crm">
              <Table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Order ID</th>
                    <th>User Name</th>
                    <th>User Id</th>
                    <th>User phone number</th>
                    <th>Transaction date/Time</th>
                    <th>Payment Status </th>
                    <th>Transaction reference</th>
                  </tr>
                </thead>
                <tbody>
                  {transactionlist.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>

                      <td>{item.orderid}</td>
                      <td>{item.name}</td>
                      <td>{item.userid}</td>
                      <td>{item.phoneno}</td>
                      <td>
                        {Moment(item.createdat).format("DD-MMM-YYYY/hh:mm a")}
                      </td>
                      <td>{item.payment_status}</td>
                      <td>{item.transaction_link}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="float-right mr-t-20">
              <PaginationComponent
                totalItems={this.props.totalcount}
                pageSize={pagelimit}
                onSelect={this.handleSelected}
                activePage={this.props.selectedPage}
                size="sm"
              />
            </div>
          </div>

        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TransactionList);
