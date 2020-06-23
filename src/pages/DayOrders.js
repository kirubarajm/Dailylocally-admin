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
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
} from "reactstrap";
import {
  DAT_ORDER_LIST,
  MOVE_TO_PROCUREMENT,
  ON_CLEAR_PROCUREMENT,
  WARE_HOUSE_SELECTED_TAB,
  ZONE_ITEM_REFRESH,
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
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
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
      today: Moment(new Date()),
      orderid_refresh: false,
      isViewModal: false,
      isOpenOrderStatus: false,
      view_item: false,
      select_order_status: {
        id: -1,
        status: "All",
      },
    };
  }

  UNSAFE_componentWillMount() {
    this.startSelect = this.startSelect.bind(this);
    this.endSelect = this.endSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.movetoprocurement = this.movetoprocurement.bind(this);
    this.toggleProcuremPopUp = this.toggleProcuremPopUp.bind(this);
    this.confirmToprocurment = this.confirmToprocurment.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onView = this.onView.bind(this);
    this.toggleOrderView = this.toggleOrderView.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.clickOrderStatus = this.clickOrderStatus.bind(this);
    this.toggleOrderStatus = this.toggleOrderStatus.bind(this);
    this.onGetOrders = this.onGetOrders.bind(this);
    this.onGetOrders();
  }
  toggleOrderStatus = () => {
    this.setState({
      isOpenOrderStatus: !this.state.isOpenOrderStatus,
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
      if (this.state.orderid) data.doid = this.state.orderid;
      if (
        this.state.select_order_status &&
        this.state.select_order_status.id !== -1
      )
        data.dayorderstatus = this.state.select_order_status.id;
      this.props.onGetDayorders(data);
    }
  };
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    if (this.props.movetoprocurement) {
      this.props.onClear();
      this.props.history.push("/warehouse/procurement");
      store.dispatch({ type: WARE_HOUSE_SELECTED_TAB, tab_type: 1 });
    }
    this.onGetOrders();
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
  toggleOrderView = () => {
    this.setState({
      isViewModal: !this.state.isViewModal,
    });
  };
  clickOrderStatus = (Item) => {
    this.setState({ select_order_status: Item });
  };
  onView = (Item) => {
    this.setState({ view_item: Item });
    this.toggleOrderView();
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
    // var data = {
    //   zoneid: this.props.zoneItem.id
    // };
    // if(this.state.startdate)data.starting_date = this.state.startdate;
    // if(this.state.enddate)data.end_date = this.state.enddate;
    // if (this.state.orderid) data.doid = this.state.orderid;
    // if (this.state.select_order_status && this.state.select_order_status.id !== -1)
    //   data.dayorderstatus = this.state.select_order_status.id;
    // this.props.onGetDayorders(data);
    this.setState({ isLoading: false });
    //this.onGetOrders();
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
            <div className="pd-10 font-size-14">
              <span className="mr-r-20">From Date/Time: </span>
              <DateRangePicker
                opens="right"
                singleDatePicker
                maxDate={this.state.today}
                endDate="+0d"
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
              <span className="mr-l-10">
                {this.state.startdate
                  ? Moment(this.state.startdate).format("DD/MM/YYYY")
                  : "DD/MM/YYYY"}
              </span>
              <span className="mr-l-50 mr-r-20">To Date/Time: </span>
              <DateRangePicker
                opens="right"
                singleDatePicker
                maxDate={this.state.today}
                endDate="+0d"
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
              <span className="mr-l-10">
                {this.state.enddate
                  ? Moment(this.state.enddate).format("DD/MM/YYYY")
                  : "DD/MM/YYYY"}
              </span>
            </div>
            <Row className="pd-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="1">
                <div>Order No : </div>{" "}
              </Col>
              <Col lg="2" className="pd-0">
                <Search
                  onSearch={this.onSearchInput}
                  type="number"
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </Col>
              <Col lg="2">
                <div>Order Status : </div>{" "}
              </Col>
              <Col lg="3" className="pd-0">
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
                            onClick={() => this.onView(item)}
                          />
                        }
                      </td>
                      <td>
                        <label className="container-check">
                          <input
                            type="checkbox"
                            name={"" + item.id}
                            disabled={item.dayorderstatus !== 0}
                            checked={this.state.selected_dayorderid[item.id]}
                            onChange={(e) => this.handleChange(e)}
                          />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </td>
                      <td>{Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}</td>
                      <td>{item.userid}</td>
                      <td>{item.id}</td>
                      <td>{item.u_product_count}</td>
                      <td>{item.order_quantity}</td>
                      <td>{getOrderStatus(item.dayorderstatus)}</td>
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

        <Modal
          isOpen={this.state.isViewModal}
          toggle={this.toggleOrderView}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleOrderView}
            className="pd-10 border-none"
          >
            Day Order Id # {this.state.view_item.id}
          </ModalHeader>
          <ModalBody className="pd-10">
            <Table>
              <thead>
                <tr>
                  <th>Pid</th>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {this.state.view_item?this.state.view_item.products.map((item, i) => (
                  <tr key={i}>
                    <td>{item.vpid}</td>
                    <td>{item.productname}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                  </tr>
                )):""}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DayOrders);
