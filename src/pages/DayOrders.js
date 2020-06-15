import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  ModalFooter,
} from "reactstrap";
import {
  DAT_ORDER_LIST,
  MOVE_TO_PROCUREMENT,
  ON_CLEAR_PROCUREMENT,
  WARE_HOUSE_SELECTED_TAB,
} from "../constants/actionTypes";
import Moment from "moment";
import AxiosRequest from "../AxiosRequest";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { getOrderStatus } from "../utils/ConstantFunction";
import { FaEye } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
const mapStateToProps = (state) => ({
  ...state.dayorders,
  zoneItem: state.warehouse.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onGetDayorders: (data) =>
    dispatch({
      type: DAT_ORDER_LIST,
      payload: AxiosRequest.Warehouse.dayorderlist(data),
    }),
  onCreateProcurement: (data) =>
    dispatch({
      type: MOVE_TO_PROCUREMENT,
      payload: AxiosRequest.Warehouse.createprocurement(data),
    }),
  onClear: () =>
    dispatch({
      type: ON_CLEAR_PROCUREMENT,
    }),
});

var today;
class DayOrders extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      selected_dayorderid: false,
      startdate: false,
      enddate: false,
      search: "",
      orderid: false,
      isprocur: false,
      orderid_refresh: false,
    };
  }

  UNSAFE_componentWillMount() {
    today = Moment(new Date()).format("YYYY-MM-DD");
    this.startSelect = this.startSelect.bind(this);
    this.endSelect = this.endSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.movetoprocurement = this.movetoprocurement.bind(this);
    this.toggleProcuremPopUp = this.toggleProcuremPopUp.bind(this);
    this.confirmToprocurment = this.confirmToprocurment.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSuccessRefresh=this.onSuccessRefresh.bind(this);
    this.onGetOrders=this.onGetOrders.bind(this);
    this.onGetOrders();
  }
  onGetOrders=()=>{
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetDayorders({
        zoneid: this.props.zoneItem.id,
      });
    }
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetOrders();

    if (this.props.movetoprocurement) {
      this.props.onClear();
      this.props.history.push("/warehouse/procurement");
      store.dispatch({ type: WARE_HOUSE_SELECTED_TAB, tab_type: 1 });
    }
  }
  componentDidCatch() {}
  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_dayorderid || [];
    const dayorderlist = this.props.dayorderlist || [];
    if (name === "selectall") {
      if (value) {
        arvalue[name] = value;
        dayorderlist.map((item, i) => {
          arvalue[item.id] = value;
        });
      } else {
        arvalue = {};
      }
    } else {
      if (value) {
        arvalue[name] = value;
        var allCheck = true;
        dayorderlist.map((item, i) => {
          if (!arvalue[item.id]) {
            allCheck = false;
          }
        });
        if (allCheck) arvalue["selectall"] = value;
      } else {
        if (arvalue["selectall"]) {
          delete arvalue["selectall"];
        }
        delete arvalue[name];
      }
    }

    this.setState({
      selected_dayorderid: arvalue,
    });
  }

  startSelect = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate });
  };
  endSelect = (event, picker) => {
    var enddate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ enddate: enddate });
  };
  toggleProcuremPopUp = () => {
    this.setState({
      isprocur: !this.state.isprocur,
    });
  };

  confirmToprocurment = () => {
    var checkItem = this.state.selected_dayorderid;
    delete checkItem["selectall"];
    var Values = Object.keys(checkItem);
    this.props.onCreateProcurement({
      doid: Values,
      zoneid: this.props.zoneItem.id,
    });
  };
  movetoprocurement = () => {
    var checkItem = this.state.selected_dayorderid;
    var Values = Object.keys(checkItem);
    if (Values.length > 0) {
      this.toggleProcuremPopUp();
    } else {
      notify.show(
        "Please select the orders after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };
  onSearchInput = (e) => {
    const value = e.target.value || "";
    this.setState({ orderid: value });
  };

  onSearch = () => {
    var data = {
      zoneid: this.props.zoneItem.id,
      starting_date: this.state.startdate,
      end_date: this.state.enddate,
    };
    if (this.state.orderid) data.orderid = this.state.orderid;
    this.props.onGetDayorders(data);
  };

  onReset = () => {
    this.setState({
      startdate: "",
      enddate: "",
      orderid: "",
      orderid_refresh: true,
    });
  };

  onSuccessRefresh = () => {
    this.setState({ orderid_refresh: false });
  };

  render() {
    const dayorderlist = this.props.dayorderlist || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Day Order - Search</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="2" className="pd-0">
                From Date/Time:{" "}
                <DateRangePicker
                  opens="right"
                  singleDatePicker
                  maxDate={today}
                  drops="down"
                  onApply={this.startSelect}
                >
                  <Button
                    className="mr-r-10"
                    style={{ width: "30px", height: "30px", padding: "0px" }}
                  >
                    <i className="far fa-calendar-alt"></i>
                  </Button>
                </DateRangePicker>
              </Col>
              <Col lg="1" className="pd-0">
                <span className="mr-l-10">
                  {this.state.startdate
                    ? Moment(this.state.startdate).format("DD/MM/YYYY")
                    : ""}
                </span>
              </Col>
              <Col lg="2" className="pd-0">
                To Date/Time:{" "}
                <DateRangePicker
                  opens="right"
                  singleDatePicker
                  maxDate={today}
                  drops="down"
                  onApply={this.endSelect}
                >
                  <Button
                    className="mr-r-10"
                    style={{ width: "30px", height: "30px", padding: "0px" }}
                  >
                    <i className="far fa-calendar-alt"></i>
                  </Button>
                </DateRangePicker>
              </Col>
              <Col lg="1" className="pd-0">
                <span className="mr-l-10">
                  {this.state.enddate
                    ? Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </span>
              </Col>
              <Col lg="2"></Col>
            </Row>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="1">
                <div>Order No : </div>{" "}
              </Col>
              <Col lg="3">
                <Search
                  onSearch={this.onSearchInput}
                  type="number"
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </Col>
            </Row>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14 txt-align-right">
              <Col lg="10"></Col>
              <Col className="txt-align-right">
                <Button size="sm" className="mr-r-10" onClick={this.onReset}>
                  Reset
                </Button>
                <Button size="sm" onClick={this.onSearch}>
                  Search
                </Button>
              </Col>
            </Row>
          </div>
          <div className="pd-6">
            <Row>
              <Col>
                <div className="pd-6">
                  <div>
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name="selectall"
                        checked={this.state.selected_dayorderid["selectall"]}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="font-size-12 mr-l-20">{" Select All "}</div>
                </div>
              </Col>
              <Col className="txt-align-right">
                <Button size="sm" onClick={this.movetoprocurement}>
                  Add Selected orders
                </Button>
              </Col>
            </Row>
            <div className="search-scroll">
              <Table>
                <thead>
                  <tr>
                    <th>View</th>
                    <th>Select</th>
                    <th>Date/Time</th>
                    <th>Customer ID</th>
                    <th>Day Order ID</th>
                    <th>Order item No</th>
                    <th>Order quantity</th>
                    <th>order status</th>
                  </tr>
                </thead>
                <tbody>
                  {dayorderlist.map((item, i) => (
                    <tr key={i}>
                      <td>
                        {
                          <FaEye
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        }
                      </td>
                      <td>
                        <label className="container-check">
                          <input
                            type="checkbox"
                            name={"" + item.id}
                            checked={this.state.selected_dayorderid[item.id]}
                            onChange={(e) => this.handleChange(e)}
                          />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </td>
                      <td>{Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}</td>
                      <td>{item.userid}</td>
                      <td>{item.id}</td>
                      <td>{item.dayorderstatus}</td>
                      <td>{item.quantity}</td>
                      <td>{getOrderStatus(item.orderstatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.isprocur}
          toggle={this.toggleProcuremPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleProcuremPopUp}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want selected orders move to the procurement?
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleProcuremPopUp}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmToprocurment}>
              YES
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DayOrders);
