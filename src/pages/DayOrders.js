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
  Tooltip,
} from "reactstrap";
import {
  DAT_ORDER_LIST,
  DAT_ORDER_REPORT,
  MOVE_TO_PROCUREMENT,
  ON_CLEAR_PROCUREMENT,
  WARE_HOUSE_SELECTED_TAB,
  ZONE_ITEM_REFRESH,
} from "../constants/actionTypes";
import Moment from "moment";
import AxiosRequest from "../AxiosRequest";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { getOrderStatus, onActionHidden } from "../utils/ConstantFunction";
import { FaEye, FaDownload } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
import PaginationComponent from "react-reactstrap-pagination";
import { CSVLink } from "react-csv";

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
    onGetDayordersReport: (data) =>
    dispatch({
      type: DAT_ORDER_REPORT,
      payload: AxiosRequest.Warehouse.dayorderreport(data),
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
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      selected_dayorderid: false,
      selected_page_dayorderid: false,
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
      tooltipOpen: false,
      selectedPage: 1,
      select_order_status: {
        id: -1,
        status: "All",
      },
    };
  }
  toggle = () => {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen,
    });
  };
  UNSAFE_componentWillMount() {
    this.startSelect = this.startSelect.bind(this);
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
      if (this.state.startdate) data.from_date = this.state.startdate;
      if (this.state.enddate) data.to_date = this.state.enddate;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      if (this.state.orderid) data.id = this.state.orderid;
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

    if (this.props.dayorderreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    this.onGetOrders();
  }
  componentDidCatch() {}
  handleChange(e,page) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var pageValue = this.state.selected_page_dayorderid || [];
    var arvalue = this.state.selected_dayorderid || [];
    const dayorderlist = this.props.dayorderlist || [];
    if (pageValue.length === 0 || !pageValue[page])
    pageValue[page] = { ids: [] };
    
    if (name === "selectall") {
      if (value) {
        pageValue[page].ids[name] = value;
        dayorderlist.map((item, i) => {
          pageValue[page].ids[item.id] = value;
        });
      } else {
        pageValue[page].ids = {};
      }
    } else {
      if (value) {
        pageValue[page].ids[name] = value;
        var allCheckPage = true;
        dayorderlist.map((item, i) => {
          if (!pageValue[page].ids[item.id]) {
            allCheckPage=false;
          }
        });
        if (allCheckPage) {
          pageValue[page].ids["selectall"] = value;
        }
      } else {
        if (pageValue[page].ids["selectall"]) {
          delete pageValue[page].ids["selectall"];
        }
        delete pageValue[page].ids[name];
      }
    }

    this.setState({
      selected_page_dayorderid: pageValue,
    });
  }

  startSelect = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate, enddate: enddate });
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
    var checkItem_page = this.state.selected_page_dayorderid;
    var Values = Object.keys(checkItem_page);
    var AllValues=[]
    for(var i=0;i<Values.length;i++){
      var arr = Object.keys(checkItem_page[Values[i]].ids);
      var indexof = arr.indexOf("selectall");
      if (indexof !== -1) {
        arr.splice(indexof, 1);
      }
      AllValues = AllValues.concat(arr); 
    }

    this.props.onCreateProcurement({
      doid: AllValues,
      zoneid: this.props.zoneItem.id,
    });
  };
  movetoprocurement = () => {
    var checkItem_page = this.state.selected_page_dayorderid;
    var Values = Object.keys(checkItem_page);
    var AllValues=[]
    for(var i=0;i<Values.length;i++){
      var arr = Object.keys(checkItem_page[Values[i]].ids);
      AllValues = AllValues.concat(arr);
    }
    if (AllValues.length > 0) {
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
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };
  onViewOrder = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
  };

  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };

  onReset = () => {
    this.setState({
      startdate: "",
      enddate: "",
      orderid: "",
      selectedPage: 1,
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

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    if (this.state.startdate) data.from_date = this.state.startdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
    if (this.state.orderid) data.id = this.state.orderid;
    if (
      this.state.select_order_status &&
      this.state.select_order_status.id !== -1
    )
      data.dayorderstatus = this.state.select_order_status.id;
      data.report=1;

    this.props.onGetDayordersReport(data);
  };

  render() {
    const dayorderlist = this.props.dayorderlist || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Day Order - Search</div>
            <div className="flex-row pd-10 font-size-14">
              <div className="mr-r-20 width-100">Date/Time: </div>
              <div className="width-250">
                <DateRangePicker
                  opens="right"
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
                  {this.state.startdate
                    ? " - " + Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </span>
              </div>
              <div className="mr-l-50 mr-r-20">Order Status : </div>
              <div>
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
              {/* <span className="mr-l-50 mr-r-20">To Date/Time: </span>
              <Button
                className="mr-r-10"
                hidden={this.state.startdate}
                style={{ width: "30px", height: "30px", padding: "0px" }}
              >
                <span href="#" id="DisabledAutoHideExample">
                  <i className="far fa-calendar-alt"></i>
                </span>
              </Button> 
              <DateRangePicker
                opens="right"
                singleDatePicker
                maxDate={this.state.today}
                endDate="+0d"
                drops="down"
                onApply={this.endSelect}
              >
                <Button
                  hidden={!this.state.startdate}
                  className="mr-r-10"
                  disabled={!this.state.startdate}
                  style={{ width: "30px", height: "30px", padding: "0px" }}
                >
                  <i className="far fa-calendar-alt"></i>
                </Button>
              </DateRangePicker>
              <span className="mr-l-10">
                {this.state.enddate
                  ? Moment(this.state.enddate).format("DD/MM/YYYY")
                  : "DD/MM/YYYY"}
              </span>*/}
            </div>
            <div className="flex-row pd-10 mr-r-10 mr-b-10 font-size-14 ">
              <div className="width-120">Day Order ID : </div>
              <div lg="2" className="pd-0">
                <Search
                  onSearch={this.onSearchInput}
                  type="number"
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              {/*<Col lg="2">
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
              </Col> */}
            </div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14 txt-align-right">
              <Col lg="10"></Col>
              <Col className="txt-align-right">
                <Button size="sm" className="mr-r-10" onClick={this.onReset}>
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={this.onSearch}
                  disabled={!this.props.zoneItem}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </div>
          <div className="pd-6">
            <Row className="mr-r-5">
              <Col>
                <div className="pd-6">
                  <div>
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name="selectall"
                        checked={
                          this.state.selected_page_dayorderid &&
                          this.state.selected_page_dayorderid[
                            this.state.selectedPage
                          ]? this.state.selected_page_dayorderid[
                                this.state.selectedPage
                              ].ids["selectall"]
                            : false
                        }
                        //checked={this.state.selected_procument["selectall"]}
                        onChange={(e) =>
                          this.handleChange(e, this.state.selectedPage)
                        }
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="font-size-12 mr-l-20">{" Select All "}</div>
                </div>
              </Col>
              <Col className="txt-align-right pd-0">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={!onActionHidden("wh_dayorder_report")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>
                <CSVLink
                  data={this.props.dayorderreport}
                  filename={"dayorderreport.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
                <Button
                  size="sm"
                  onClick={this.movetoprocurement}
                  hidden={onActionHidden("wh_procurement_create")}
                >
                  Add Selected orders
                </Button>
              </Col>
            </Row>
            <div className="search-scroll-dayorder">
              <Table style={{ width: "1200px" }}>
                <thead>
                  <tr>
                    <th>View</th>
                    <th>Select</th>
                    <th>Date/Time</th>
                    <th>Delivery/Time</th>
                    <th>Customer ID</th>
                    <th>Day Order ID</th>
                    <th>Order item count</th>
                    <th>Order quantity</th>
                    <th>order status</th>
                  </tr>
                </thead>
                <tbody>
                  {dayorderlist.map((item, i) => (
                    <tr key={i}>
                      <td>
                        {
                          <Button
                            size="sm"
                            color="link"
                            disabled={onActionHidden("wh_order_view")}
                            onClick={() => this.onView(item)}
                          >
                            <FaEye size="15" />
                          </Button>
                        }
                      </td>
                      <td>
                        <label className="container-check">
                        <input
                            type="checkbox"
                            name={"" + item.id}
                            checked={
                              this.state.selected_page_dayorderid &&
                              this.state.selected_page_dayorderid[
                                this.state.selectedPage
                              ]? this.state.selected_page_dayorderid[
                                    this.state.selectedPage
                                  ].ids[item.id]
                                : false
                            }
                            onChange={(e) =>
                              this.handleChange(e, this.state.selectedPage)
                            }
                          />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </td>
                      <td>
                        {Moment(item.created_at).format("DD-MMM-YYYY/hh:mm a")}
                      </td>
                      <td>{Moment(item.date).format("DD-MMM-YYYY/hh:mm")+" pm"}</td>
                      <td>{item.userid}</td>
                      <td>
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => this.onViewOrder(item)}
                        >
                          {item.id}
                        </Button>
                      </td>
                      <td>{item.u_product_count}</td>
                      <td>{item.order_quantity}</td>
                      <td>{getOrderStatus(item.dayorderstatus)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div
              className="float-right"
              hidden={this.props.totalcount < this.props.pagelimit}
            >
              <PaginationComponent
                totalItems={this.props.totalcount}
                pageSize={this.props.pagelimit}
                onSelect={this.handleSelected}
                activePage={this.state.selectedPage}
                size="sm"
              />
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
                {this.state.view_item
                  ? this.state.view_item.products.map((item, i) => (
                      <tr key={i}>
                        <td>{item.vpid}</td>
                        <td>{item.productname}</td>
                        <td>{item.price}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>

        {/* <Tooltip
          placement="right"
          isOpen={this.state.tooltipOpen}
          autohide={false}
          target="DisabledAutoHideExample"
          toggle={this.toggle}
        >
          Please select from date
        </Tooltip> */}
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DayOrders);
