import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import PaginationComponent from "react-reactstrap-pagination";
import { CSVLink } from "react-csv";
import { onActionHidden,onGetColor } from "../utils/ConstantFunction";
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
import { FaEye, FaPlus, FaDownload } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  TRACK_ORDER_LIST,
  TRACK_ORDER_REPORT,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  TRACK_SELECT_TRIP,
  TRACK_SELECT_VIEW,
} from "../constants/actionTypes";
import SearchTrip from "../components/SearchTrip";

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
      payload: AxiosRequest.CRM.getOrderList(data),
    }),
    onGetDayordersReport: (data) =>
    dispatch({
      type: TRACK_ORDER_REPORT,
      payload: AxiosRequest.CRM.getOrderReport(data),
    }),
    
  onSetDayordersFilters: (data) =>
    dispatch({
      type: TRACK_ORDER_LIST_FILTER,
      data,
    }),
  onSelectSlot: (selectedSlot) =>
    dispatch({
      type: TRACK_SELECT_SOLT,
      selectedSlot,
    }),
  onSelectTrip: (selectedTrip) =>
    dispatch({
      type: TRACK_SELECT_TRIP,
      selectedTrip,
    }),
  onSelectStatus: (selectedStatus) =>
    dispatch({
      type: TRACK_SELECT_STATUS,
      selectedStatus,
    }),
  onSelectView: (data) =>
    dispatch({
      type: TRACK_SELECT_VIEW,
      data,
    }),
});

const defultPage = 1;
const pagelimit = 20;
const defult_slot = {
  id: -1,
  status: "All",
};

var logi;
class Crm extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      startdate: false,
      enddate: false,
      isOpenOrderStatus: false,
      isOpenSlot: false,
      select_order_status: defult_slot,
      select_slot: defult_slot,
      order_no: false,
      user_search: false,
      orderid_refresh: false,
      isLoading: false,
      userid: 0,
      user_via_order: false,
      isTripEnable: true,
      trip_search: false,
      checkBoxVal: 0,
      isReport:false,
    };
  }

  UNSAFE_componentWillMount() {
    logi = this;
    var userid = this.props.match.params.userid || false;
    if (userid) {
      this.setState({ user_via_order: true, userid: userid });
      if (!this.props.isViewed) this.onInit();
    }
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.userid !== this.props.match.params.userid) {
      var userid = nextProps.match.params.userid || false;
      if (userid) this.setState({ user_via_order: true, userid: userid });
      else
        this.setState({ user_via_order: false, userid: 0, isLoading: false });
      // this.onReset();
    }
  }
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    if (this.props.dayorderreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
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
    this.props.onSetDayordersFilters(false);
    this.setState({ isLoading: false });
  };
  onInit = () => {
    this.setState({
      startdate: "",
      enddate: "",
      order_no: "",
      user_search: "",
      orderid_refresh: true,
      select_order_status: defult_slot,
      select_slot: defult_slot,
    });
    this.props.onSelectStatus(defult_slot);
    this.props.onSelectSlot(defult_slot);
    this.props.onSetDayordersFilters(false);
  };

  onReset = () => {
    this.setState({
      startdate: "",
      enddate: "",
      order_no: "",
      user_search: "",
      checkBoxVal: 0,
      isTripEnable: true,
      orderid_refresh: true,
      select_order_status: defult_slot,
      select_slot: defult_slot,
    });
    this.props.onSelectStatus(defult_slot);
    this.props.onSelectSlot(defult_slot);
    this.props.onSetDayordersFilters(false);
    var userid = this.props.match.params.userid || false;
    var data = {
      zoneid: this.props.zoneItem.id,
      page: defultPage,
    };
    if (userid) data.userid = userid;
    this.props.onGetDayorders(data);
  };

  onGetOrders = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zoneid: this.props.zoneItem.id };
      if (this.props.datafilter) {
        data = this.props.datafilter;
        var userid = this.props.match.params.userid || false;
        if (!userid) delete data.userid;
        else data.userid = userid;
        this.setState({
          startdate: data.starting_date,
          enddate: data.end_date,
          order_no: data.id,
          user_search: data.search,
          select_order_status: this.props.orderSelectedStatus,
          select_slot: this.props.orderSelectedSolt,
          trip_search: this.props.orderSelectedTrip,
          checkBoxVal: data.moveit_type || 0,
        });
      } else {
        data.page = defultPage;
        if (this.state.startdate) data.starting_date = this.state.startdate;
        if (this.state.enddate) data.end_date = this.state.enddate;
        if (this.state.order_no) data.id = this.state.order_no;
        if (this.state.user_search) data.search = this.state.user_search;
        if (this.state.trip_search && this.state.checkBoxVal === 1) {
          data.trip_id = this.state.trip_search;
          data.moveit_type = this.state.checkBoxVal;
        } else if (this.state.checkBoxVal === 2) {
          data.moveit_type = this.state.checkBoxVal;
        }

        if (
          this.state.select_order_status &&
          this.state.select_order_status.id !== -1
        )
          data.dayorderstatus = this.state.select_order_status.id;
        if (this.state.select_slot && this.state.select_slot.id !== -1)
          data.slot = this.state.select_slot.id;
        if (this.state.userid) data.userid = this.state.userid;
      }

      this.props.onSelectStatus(this.state.select_order_status);
      this.props.onSelectSlot(this.state.select_slot);
      this.props.onGetDayorders(data);
      this.props.onSetDayordersFilters(data);
    }
  };

  onView = (Item) => {
    this.props.onSelectView(true);
    this.props.history.push("/orderview/" + Item.id);
  };

  onCheckMoveit = () => {
    //document.radioForm.onclick = function () {
    var radVal = document.radioForm.moveit_type.value;
    var checkVal = parseInt(radVal);
    logi.setState({
      trip_search: "",
      isTripEnable: checkVal === 1 ? false : true,
      checkBoxVal: checkVal,
    });
    this.props.onSelectTrip(checkVal);
    //};
  };

  handleSelected = (selectedPage) => {
    var data = { zoneid: this.props.zoneItem.id };
    if (this.props.datafilter) {
      data = this.props.datafilter;
    }
    data.page = selectedPage;
    this.props.onGetDayorders(data);
    this.props.onSetDayordersFilters(data);
  };

  onSearchTrip = (e) => {
    const value = e.target.value || "";
    this.setState({ trip_search: value });
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

  paymentmode(item) {
    if(item.cod_price&&item.online_price){
      return "Online/COD"
    }else if(item.cod_price){
      return "COD"
    }else if(item.online_price){
      return "Online"
    }
    else return " - ";
  }

  
  dateOnlyConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }
  
  

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { zoneid: this.props.zoneItem.id };
    if (this.state.startdate) data.starting_date = this.state.startdate;
        if (this.state.enddate) data.end_date = this.state.enddate;
        if (this.state.order_no) data.id = this.state.order_no;
        if (this.state.user_search) data.search = this.state.user_search;
        if (this.state.trip_search && this.state.checkBoxVal === 1) {
          data.trip_id = this.state.trip_search;
          data.moveit_type = this.state.checkBoxVal;
        } else if (this.state.checkBoxVal === 2) {
          data.moveit_type = this.state.checkBoxVal;
        }

        if (
          this.state.select_order_status &&
          this.state.select_order_status.id !== -1
        )
          data.dayorderstatus = this.state.select_order_status.id;
        if (this.state.select_slot && this.state.select_slot.id !== -1)
          data.slot = this.state.select_slot.id;
        if (this.state.userid) data.userid = this.state.userid;
      data.report=1;

      this.props.onGetDayordersReport(data);
  };

  render() {
    const dayorderlist = this.props.dayorderlist || [];
    return (
      <div className="pd-6 width-full" style={{ position: "fixed" }}>
        <div style={{ height: "85vh" }} className="width-85">
          <Row>
            <Col></Col>
            <Col>
              <div className="float-right mr-r-20">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("crm_export")}
                  onClick={() => this.onReportDownLoad()}
                  >
                    <FaDownload size="15" />
                  </Button>
  
                  <CSVLink
                    data={this.props.dayorderreport}
                    filename={"CRM_OrderReport.csv"}
                    className="mr-r-20"
                    ref={this.csvLink}
                    hidden={true}
                  ></CSVLink>

                <span className="mr-r-20">Zone</span>
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
              <div className="width-200 mr-l-20">Order No :</div>
              <div className="width-200">
                <Search
                  onSearch={this.onSearchOrderno}
                  type="number"
                  value={this.state.order_no}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-100 mr-l-20 align-self-center">
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
              <div className="width-50 mr-l-20 align-self-center">Date:</div>
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
              <div className="width-200 mr-l-20">User id/phone/name :</div>
              <div className="width-200">
                <Searchnew
                  onSearch={this.onSearchUser}
                  type="text"
                  disabled={this.state.user_via_order}
                  value={this.state.user_search}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-100 mr-l-20 align-self-center">Slot :</div>
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
            <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-200 mr-l-20 align-self-center">
                Trip/Dunzo :
              </div>
              <div className="width-200 mr-l-10" onClick={this.onCheckMoveit}>
                <form id="radioForm" name="radioForm" className="mr-t-10">
                  <input
                    type="radio"
                    name="moveit_type"
                    value="0"
                    checked={this.state.checkBoxVal === 0}
                    className="mr-r-5"
                  />
                  <label className="mr-r-10">All</label>
                  <input
                    type="radio"
                    name="moveit_type"
                    value="1"
                    checked={this.state.checkBoxVal === 1}
                    className="mr-r-5"
                  />
                  <label className="mr-r-10">Trip</label>
                  <input
                    type="radio"
                    name="moveit_type"
                    value="2"
                    checked={this.state.checkBoxVal === 2}
                    className="mr-r-5"
                  />
                  <label className="mr-r-10">Dunzo</label>
                </form>
              </div>
              <div className="width-200 mr-l-10">
                <div hidden={this.state.isTripEnable}>
                  <SearchTrip
                    onSearch={this.onSearchTrip}
                    type="number"
                    value={this.state.trip_search}
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.orderid_refresh}
                  />
                </div>
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
                  hidden={!this.state.user_via_order}
                  className="mr-l-10"
                >
                  Back
                </Button>
              </Col>
            </Row>
          </div>
          <div className="pd-6">
            <div className="scroll-crm">
              <Table style={{ width: "3000px" }}>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>View</th>
                    <th>Order no</th>
                    <th>User Name</th>
                    <th>User id</th>
                    <th>User Phone</th>
                    <th>User email</th>
                    {/* <th>Date created</th> */}
                    <th>Placed time</th>
                    <th>Quantity</th>
                    <th>Pack Qty</th>
                    <th>Amt</th>
                    <th>Online Amt</th>
                    <th>COD Amt</th>
                    <th>Payment Mode</th>
                    <th>Payment Status</th>
                    <th>Community id</th>
                    <th>Community name</th>
                    <th>Weight</th>
                    <th>Distance</th>
                    <th>Due date/Time</th>
                    <th>Slot</th>
                    <th>Status</th>
                    <th>Trip ID</th>
                    <th>Delivered Date/Time</th>
                    <th>Download Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {dayorderlist.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>
                        <Button
                          size="sm"
                          className="pd-0"
                          disabled={onActionHidden("crm_view")}
                          onClick={() => this.onView(item)}
                          color="link"
                        >
                          <FaEye size="16" />
                        </Button>
                      </td>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>{item.userid}</td>
                      <td>{item.phoneno}</td>
                      <td className="table-cloumn-overflow">{item.email}</td>
                      {/* <td>{this.dateConvert(item.created_at)}</td> */}
                      <td>{this.dateConvert(item.order_place_time)}</td>

                      <td>{item.order_quantity}</td>
                      <td>{item.sorted_quantity}</td>
                      <td>{item.total_product_price}</td>
                      <td>{item.online_price|| "-"}</td>
                      <td>{item.cod_price || "-"}</td>
                      <td>{this.paymentmode(item)}</td>
                      <td>{item.payment_status===1?"Paid":"Not Paid"}</td>
                      <td>{item.comid ||"-"}</td>
                      <td>{item.community_name || "-"}</td>
                      <td>{item.total_product_weight?item.total_product_weight+" kg":"0 kg"}</td>
                      <td>{item.Lastmile?item.Lastmile+" km":"0 km"}</td>
                      <td>{this.dateOnlyConvert(item.date)+" pm"}</td>
                      <td>{item.slot_msg}</td>
                      <td style={{ color: onGetColor(item.dayorderstatus) }}>{item.dayorderstatus_msg}</td>
                      <td>
                        {item.moveit_type === 1
                          ? item.trip_id
                          : item.moveit_type === null
                          ? "-"
                          : "Dunzo"}
                      </td>
                      <td>{this.dateConvert(item.moveit_actual_delivered_time)}</td>
                      <td>
                        <Button
                          size="sm"
                          disabled={
                            !item.invoice_url || onActionHidden("crm_order_details_export")
                          }
                        >
                          {item.invoice_url?<a href={item.invoice_url} target="_blank" className="txt-color-theme">
                            <div>Download Invoice</div>
                          </a>:"Download Invoice"}
                          
                        </Button>
                      </td>
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
export default connect(mapStateToProps, mapDispatchToProps)(Crm);
