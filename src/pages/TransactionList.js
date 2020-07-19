import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import PaginationComponent from "react-reactstrap-pagination";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Moment from "moment";
import AxiosRequest from "../AxiosRequest";
import {
  TRANSACTION_FILTER,
  TRANSACTION_LIST,
  TRANSACTION_VIEW,
} from "../constants/actionTypes";

const mapStateToProps = (state) => ({ ...state.transaction });

const mapDispatchToProps = (dispatch) => ({
  ongetTrasnactionList: (data) =>
    dispatch({
      type: TRANSACTION_LIST,
      payload: AxiosRequest.CRM.getTransactionList(data),
    }),
  ongetTrasnactionView: (data) =>
    dispatch({
      type: TRANSACTION_VIEW,
      payload: AxiosRequest.CRM.getTransactionView(data),
    }),
  onSetTrasnactionFilters: (userfilter) =>
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
    this.onGetTransaction();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetTransaction();
  }
  componentDidCatch() {}

  onGetTransaction = () => {
    if (!this.state.isLoading) {
      var userid = this.props.match.params.userid;
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
        data.userid = userid;
        if (this.state.startdate) data.starting_date = this.state.startdate;
        if (this.state.enddate) data.end_date = this.state.enddate;
      }

      this.props.ongetTrasnactionList(data);
      this.props.onSetTrasnactionFilters(data);
    }
  };

  dateSelectOr = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate, enddate: enddate });
  };
  onSearch = () => {
    this.props.onSetTrasnactionFilters(false);
    this.setState({ isLoading: false });
  };
  onReset = () => {
    this.setState({
      startdate: false,
      enddate: false,
    });
    this.props.onSetTrasnactionFilters(false);
    this.setState({ isLoading: false });
  };
  onViewTransaction = (item) => {
    this.setState({ viewtrItem: item });
    this.props.ongetTrasnactionView({ orderid: item.orderid });
    this.toggleTransPopUp();
  };

  toggleTransPopUp = () => {
    this.setState((prevState) => ({
      isTransModal: !prevState.isTransModal,
    }));
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

  dateConvertFormat(date) {
    var datestr = Moment(date).format("dddd DD MMM YYYY");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

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
                      <td>{this.dateConvert(item.transaction_time)}</td>
                      <td>{item.transaction_status}</td>
                      <td>
                        {" "}
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => this.onViewTransaction(item)}
                        >
                          {" "}
                          tranid #{item.orderid}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="float-right mr-t-20" hidden={this.props.totalcount<this.props.pagelimit}>
              <PaginationComponent
                totalItems={this.props.totalcount}
                pageSize={this.props.pagelimit}
                onSelect={this.handleSelected}
                activePage={this.props.selectedPage}
                size="sm"
              />
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.isTransModal}
          toggle={this.toggleTransPopUp}
          className="max-width-400"
          backdrop={true}
        >
          <ModalBody className="pd-10">
            <div className="font-size-14 font-weight-bold">Transaction View</div>
            {this.props.transactionview ? (
              <div className="font-size-14 mr-t-20">
                <div className="flex-row">
                  Transaction ID # {this.props.transactionview.orderid}
                </div>
                <div className="color-grey font-size-10">
                  {this.dateConvertFormat(
                    this.props.transactionview.transaction_time
                  )}
                </div>

                <div className="mr-t-50 font-size-14 font-weight-bold">
                  Items in my order | {this.props.transactionview.itemscount}{" "}
                  Items
                </div>
                <hr className="mr-2" />
                <div className="mr-t-20">
                  {this.props.transactionview.items.map((item, i) => (
                    <div className="flex-row mr-t-10">
                      <div className="width-250">
                        <div>{item.product_name}</div>
                        <div className="font-size-10 color-grey">
                          {item.weight} {item.unit}
                        </div>
                      </div>
                      <div className="width-100 txt-align-right mr-l-10">
                        <i className="fas fa-rupee-sign font-size-12" />{" "}
                        {item.price}
                      </div>
                    </div>
                  ))}
                  <div className="mr-t-20 font-size-14 font-weight-bold">Bill Detail</div>
                  {this.props.transactionview.cartdetails.map((item, i) => (
                    <div className="flex-row mr-t-10">
                      <div className="width-250 color-grey">{item.title}</div>
                      <div className="width-100 txt-align-right mr-l-10">
                        <i className="fas fa-rupee-sign font-size-12" />{" "}
                        {item.charges}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleTransPopUp}>
              CLOSE
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TransactionList);
