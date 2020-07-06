import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  Row,
  Col,
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
} from "reactstrap";
import Moment from "moment";
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { FaEye, FaPlus } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  TRACK_ORDER_LIST,
} from "../constants/actionTypes";
import { getOrderStatus } from "../utils/ConstantFunction";

const mapStateToProps = (state) => ({
  ...state.crm,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetDayorders: (data) =>
    dispatch({
      type: TRACK_ORDER_LIST,
      payload: AxiosRequest.Warehouse.dayorderlist(data),
    }),
});

class Crm extends React.Component {
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      startdate: false,
      enddate: false,
      isOpenOrderStatus: false,
      isOpenSlot: false,
      select_order_status: {
        id: -1,
        status: "All",
      },
      select_slot: {
        id: -1,
        status: "All",
      },
      order_no: false,
      user_search: false,
      orderid_refresh: false,
      isLoading: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.dateSelectOr = this.dateSelectOr.bind(this);
    this.toggleOrderStatus = this.toggleOrderStatus.bind(this);
    this.toggleSlot = this.toggleSlot.bind(this);
    this.clickOrderStatus = this.clickOrderStatus.bind(this);
    this.clickSlot = this.clickSlot.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onGetOrders();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    this.onGetOrders();
  }
  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  componentDidCatch() {}

  dateSelectOr = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate, enddate: enddate });
  };

  toggleOrderStatus = () => {
    this.setState({
      isOpenOrderStatus: !this.state.isOpenOrderStatus,
    });
  };
  toggleSlot = () => {
    this.setState({
      isOpenSlot: !this.state.isOpenSlot,
    });
  };

  clickOrderStatus = (item) => {
    this.setState({ select_order_status: item });
  };

  clickSlot = (item) => {
    this.setState({ select_slot: item });
  };

  onSearchOrderno = (e) => {
    const value = e.target.value || "";
    this.setState({ order_no: value });
  };
  onSearchUser = (e) => {
    const value = e.target.value || "";
    this.setState({ user_search: value });
  };

  onSuccessRefresh = () => {
    this.setState({ orderid_refresh: false });
  };
  onSearch = () => {
    this.setState({ isLoading: false });
  };

  onReset = () => {
    this.setState({
      startdate: "",
      enddate: "",
      orderid: "",
      orderid_refresh: true,
      select_order_status: {
        id: -1,
        status: "All",
      },
    });
    this.props.onGetDayorders({
      zoneid: this.props.zoneItem.id,
    });
  };

  onGetOrders = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.startdate) data.starting_date = this.state.startdate;
      if (this.state.enddate) data.end_date = this.state.enddate;
      if (this.state.order_no) data.doid = this.state.order_no;
      if (this.state.user_search) data.user_search = this.state.user_search;
      if (
        this.state.select_order_status &&
        this.state.select_order_status.id !== -1
      )
        data.dayorderstatus = this.state.select_order_status.id;
      if (this.state.select_slot && this.state.select_slot.id !== -1)
        data.slotid = this.state.select_slot.id;
      this.props.onGetDayorders(data);
    }
  };

  onView = (Item) => {
    this.props.history.push('/orderview/'+Item.id)
  };

  render() {
    const dayorderlist = this.props.dayorderlist || [];
    return (
          <div className="pd-6 width-full" style={{position:"fixed"}}>
            <div style={{ height: "85vh" }} className="width-85" > 
            <Row>
              <Col></Col>
              <Col>
                <div className="float-right mr-r-20">
                  <span className="mr-r-20">Area</span>
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isOpenAreaDropDown}
                    toggle={this.toggleAreaDropDown}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.props.zoneItem.Zonename || ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.zone_list.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickArea(item)}
                          key={index}
                        >
                          {item.Zonename}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </Col>
            </Row>
            <div className="fieldset">
              <div className="legend">Order Tracker</div>
              <div className="replies_field_container mr-b-10 font-size-14">
                <div className="width-200 mr-l-20 align_self_center">
                  Order No :
                </div>
                <div className="width-200 mr-l-10">
                  <Search
                    onSearch={this.onSearchOrderno}
                    type="number"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.orderid_refresh}
                  />
                </div>
                <div className="width-120 mr-l-20 align_self_center">
                  Order Status :
                </div>
                <div className="width-150 mr-l-10">
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isOpenOrderStatus}
                    toggle={this.toggleOrderStatus}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.state.select_order_status.status || ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.orderStatus.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickOrderStatus(item)}
                          key={index}
                        >
                          {item.status}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
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

              <div className="replies_field_container mr-b-10 font-size-14">
                <div className="width-200 mr-l-20 align_self_center">
                  User id/phone/name :
                </div>
                <div className="width-200 mr-l-10">
                  <Searchnew
                    onSearch={this.onSearchUser}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.orderid_refresh}
                  />
                </div>
                <div className="width-120 mr-l-20 align_self_center">
                  Slot :
                </div>
                <div className="width-150 mr-l-10">
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isOpenSlot}
                    toggle={this.toggleSlot}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.state.select_slot.status || ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.orderSlot.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickSlot(item)}
                          key={index}
                        >
                          {item.status}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </div>
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
              <div className="search-vscroll">
                <div className="order-horizantal-scroll">
                  <Table style={{width:"1500px"}}>
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>View</th>
                        <th>Order no</th>
                        <th>User Name</th>
                        <th>User id</th>
                        <th>Date created</th>
                        <th>Quantity</th>
                        <th>Sorted Qty</th>
                        <th>Amt</th>
                        <th>Due date/Time</th>
                        <th>Status</th>
                        <th>Trip ID</th>
                        <th>Delivered Date/Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dayorderlist.map((item, i) => (
                        <tr key={i}>
                          <td>
                            {
                              <FaPlus
                                className="txt-color-theme txt-cursor pd-2"
                                size="20"
                              />
                            }
                          </td>
                          <td>
                            {
                              <FaEye
                                className="txt-color-theme txt-cursor pd-2"
                                size="20"
                                onClick={() => this.onView(item)}
                              />
                            }
                          </td>
                          <td>{item.id}</td>
                          <td>{item.userid}</td>
                          <td>{item.userid}</td>
                          <td>
                            {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                          </td>
                          <td>{item.order_quantity}</td>
                          <td>{item.u_product_count}</td>
                          <td>{item.amount}</td>
                          <td>
                            {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                          </td>
                          <td>{getOrderStatus(item.dayorderstatus)}</td>
                          <td>{item.trip_id}</td>
                          <td>
                            {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
            </div>
          </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Crm);
