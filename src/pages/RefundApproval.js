import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import PaginationComponent from "react-reactstrap-pagination";
import { FaDownload } from "react-icons/fa";
import { CSVLink } from "react-csv";
import {
  Row,
  Col,
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardImg,
  Card,
} from "reactstrap";
import Moment from "moment";
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { store } from "../store";
import Search from "../components/Search";
import Select from "react-dropdown-select";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  REFUND_ORDER_LIST,
  REFUND_ORDER_REPORT,
  REFUND_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ZONE_TRIP_ORDER_LIST,
  TRIP_DRIVER_LIST,
  QA_CHECK_LIST,
  POST_QA_CHECK_LIST,
  LOGISTICS_CLEAR,
  REFUND_POST_REPAYMENT,
  POST_TRIP_ASSIGN,
  TRACK_SELECT_TRIP,
} from "../constants/actionTypes";
import SearchInput from "../components/SearchInput";
import SearchItem from "../components/SearchItem";
import SearchTrip from "../components/SearchTrip";

const InputSearchDropDown = ({
  onSelection,
  options,
  label,
  labelField,
  searchable,
  searchBy,
  values,
  disabled,
  clearable,
  noDataLabel,
  valueField,
}) => {
  return (
    <div className="border-none" style={{ marginBottom: "10px" }}>
      <Row className="pd-0 mr-l-10 mr-r-10 border-none">
        <Col lg="4" className="pd-0">
          <label className="mr-0 color-grey pd-0 ">
            {label} <span className="must">*</span>
          </label>
        </Col>
        <Col
          className="pd-0"
          style={{
            border: "1px solid #000",
            height: "30px",
            marginRight: "10px",
          }}
        >
          <Select
            options={options}
            labelField={labelField}
            searchable={searchable}
            searchBy={searchBy}
            values={[...values]}
            noDataLabel={noDataLabel}
            valueField={valueField}
            dropdownHeight={"300px"}
            disabled={disabled}
            onChange={(value) => {
              onSelection(value);
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state.refundapproval,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetDayorders: (data) =>
    dispatch({
      type: REFUND_ORDER_LIST,
      payload: AxiosRequest.CRM.getRefundApprovalList(data),
    }),
  onGetRefundReport: (data) =>
    dispatch({
      type: REFUND_ORDER_REPORT,
      payload: AxiosRequest.CRM.getRefundApprovalReport(data),
    }),

  onSetDayordersFilters: (data) =>
    dispatch({
      type: REFUND_ORDER_LIST_FILTER,
      data,
    }),
  onPostRepayment: (data) =>
    dispatch({
      type: REFUND_POST_REPAYMENT,
      payload: AxiosRequest.CRM.postRepayment(data),
    }),
  onSelectSlot: (selectedSlot) =>
    dispatch({
      type: TRACK_SELECT_SOLT,
      selectedSlot,
    }),
  onSelectStatus: (selectedStatus) =>
    dispatch({
      type: TRACK_SELECT_STATUS,
      selectedStatus,
    }),
  onSelectTrip: (selectedTrip) =>
    dispatch({
      type: TRACK_SELECT_TRIP,
      selectedTrip,
    }),
  onClear: () =>
    dispatch({
      type: LOGISTICS_CLEAR,
    }),
});

const defultPage = 1;
const pagelimit = 20;
const defult_slot = {
  id: -1,
  status: "All",
};

var logi;
class RefundApproval extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      startdate: false,
      enddate: false,
      selected_dayorderid: false,
      isOpenOrderStatus: false,
      isOpenSlot: false,
      select_order_status: defult_slot,
      select_slot: defult_slot,
      order_no: false,
      user_search: false,
      orderid_refresh: false,
      isLoading: false,
      userid: 0,
      action: [
        { id: 1, status: "Approve" },
        { id: 2, status: "Reject" },
      ],
      user_via_order: false,
      check_item: { products: [] },
      view_item: { qachecklist: 0 },
      isActionModal: false,
      isTripEnable: true,
      trip_search: false,
      select_driver: [],
      qa_checklist: [],
      checkBoxVal: 0,
      actionindex: 0,
      actionitem: false,
      imageItem: false,
      isReport: false,
    };
  }

  UNSAFE_componentWillMount() {
    logi = this;
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
  componentWillReceiveProps(nextProps) {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    if (this.props.qualityUpdate) {
      this.props.onClear();
      this.setState({ isLoading: false, qa_checklist: [] });
    }

    if (this.props.orderStatusUpdate) {
      this.props.onClear();
      this.setState({
        isLoading: false,
        selected_dayorderid: false,
      });
    }

    if (this.props.refundorderreport.length > 0 && this.state.isReport) {
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
  toggleActionPopUp = () => {
    this.setState((prevState) => ({
      isActionModal: !prevState.isActionModal,
    }));
  };

  movetoApprove = () => {
    var data = {
      zoneid: this.props.zoneItem.id,
      rs_id: this.state.actionitem.rs_id,
      amount: this.state.actionitem.refund_amt,
      paymentid: this.state.actionitem.payment_id,
      active_status: this.state.dropitem.id,
      done_by: getAdminId(),
    };
    this.toggleActionPopUp();
    this.props.onPostRepayment(data);
  };

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  clickApprove = (item, i) => {
    if (this.state.actionindex === i) {
      this.setState({ dropitem: item });
      this.toggleActionPopUp();
    }
  };

  componentDidCatch() {}

  dateSelectOr = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate, enddate: enddate });
  };

  selectPickupImage = (item) => {
    this.setState({ imageItem: item });
    this.toggleImagePopUp();
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

  onSearchDriver = (e) => {
    const value = e.target.value || "";
    this.setState({ moveit_search: value });
  };

  onSearchTrip = (e) => {
    const value = e.target.value || "";
    this.setState({ trip_search: value });
  };

  onSuccessRefresh = () => {
    this.setState({ orderid_refresh: false });
  };
  onSearch = () => {
    this.props.onSetDayordersFilters(false);
    this.setState({ isLoading: false });
  };

  onReset = () => {
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
    this.props.onGetDayorders({
      zoneid: this.props.zoneItem.id,
    });
  };

  onGetOrders = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zoneid: this.props.zoneItem.id };
      if (this.props.datafilter) {
        data = this.props.datafilter;
        this.setState({
          startdate: data.starting_date,
          enddate: data.end_date,
          order_no: data.id,
          user_search: data.search,
          select_order_status: this.props.orderSelectedStatus,
          select_slot: this.props.orderSelectedSolt,
          checkVal: this.props.selectedTrip,
          moveit_search: data.moveit_search,
          trip_search: data.trip_search,
        });
      } else {
        data.page = defultPage;
        if (this.state.startdate) data.starting_date = this.state.startdate;
        if (this.state.enddate) data.end_date = this.state.enddate;
        if (this.state.order_no) data.doid = this.state.order_no;
        if (this.state.user_search) data.user_search = this.state.user_search;
        if (this.state.moveit_search)
          data.moveit_search = this.state.moveit_search;
        if (this.state.trip_search) data.trip_search = this.state.trip_search;
        if (
          this.state.select_order_status &&
          this.state.select_order_status.id !== -1
        )
          data.order_status = this.state.select_order_status.id;
        if (this.state.select_slot && this.state.select_slot.id !== -1)
          data.slot = this.state.select_slot.id;
      }

      this.props.onSelectStatus(this.state.select_order_status);
      this.props.onSelectSlot(this.state.select_slot);
      this.props.onGetDayorders(data);
      this.props.onSetDayordersFilters(data);
    }
  };

  onView = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  onFillView = (item) => {
    this.setState({ view_item: item });
    this.onViewCheckListModal();
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
  onViewCheckListModal = () => {
    this.setState((prevState) => ({
      viewchecklistModal: !prevState.viewchecklistModal,
    }));
  };
  reportClick = (e, item, i) => {
    var id = parseInt(e.target.value);
    var drop = {};
    drop.id = id;
    this.setState({ dropitem: drop, actionitem: item });
    if (id !== 0) {
      document.getElementById("" + i).selectedIndex = 0;
      this.toggleActionPopUp();
    }
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return "-";
  }

  ImageDownload = (img) => {
    document.getElementById(img).click();
  };

  toggleImagePopUp = () => {
    this.setState((prevState) => ({
      isImageModal: !prevState.isImageModal,
    }));
  };
  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { zoneid: this.props.zoneItem.id };
    if (this.state.startdate) data.starting_date = this.state.startdate;
    if (this.state.enddate) data.end_date = this.state.enddate;
    if (this.state.order_no) data.doid = this.state.order_no;
    if (this.state.user_search) data.user_search = this.state.user_search;
    if (this.state.moveit_search) data.moveit_search = this.state.moveit_search;
    if (this.state.trip_search) data.trip_search = this.state.trip_search;
    if (
      this.state.select_order_status &&
      this.state.select_order_status.id !== -1
    )
      data.order_status = this.state.select_order_status.id;
    if (this.state.select_slot && this.state.select_slot.id !== -1)
      data.slot = this.state.select_slot.id;
    data.report = 1;
    this.props.onGetRefundReport(data);
  };

  onViewOrder = (Item) => {
    this.props.history.push("/orderview/" + Item.doid);
  };

  render() {
    const dayorderlist = this.props.dayorderlist || [];
    return (
      <div className="pd-6 width-full" style={{ position: "fixed" }}>
        <div style={{ height: "75vh" }} className="width-85">
          <Row>
            <Col></Col>
            <Col>
              <div className="float-right mr-r-20">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("refund_export")}
                  onClick={() => this.onReportDownLoad()}
                  >
                    <FaDownload size="15" />
                  </Button>
  
                  <CSVLink
                    data={this.props.refundorderreport}
                    filename={"Refund_Order_Report.csv"}
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
            <div className="legend">Refund - Search</div>
            <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-200 mr-l-20 align_self_center">
                Order No :
              </div>
              <div className="width-200 mr-l-10">
                <Search
                  onSearch={this.onSearchOrderno}
                  type="number"
                  value={this.state.order_no}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              {/* <div className="width-120 mr-l-20 align_self_center">
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
              </div> */}
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
                  disabled={this.state.user_via_order}
                  value={this.state.user_search}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-50 mr-l-20 align_self_center">Slot :</div>
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

            {/* <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-200 mr-l-20 align_self_center">
                Delivery name/Phone :
              </div>
              <div className="width-200 mr-l-10">
                <SearchItem
                  onSearch={this.onSearchDriver}
                  type="text"
                  value={this.state.moveit_search}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-100 mr-l-20 align_self_center">
                Trip/Dunzo :
              </div>
              <div className="width-200 mr-l-20 align_self_center" onClick={this.onCheckMoveit}>
                <form id="radioForm" name="radioForm" className="mr-t-10">
                  <input
                    type="radio"
                    name="moveit_type"
                    value="0"
                    checked={this.state.checkBoxVal===0}
                    className="mr-r-5"
                  />{" "}
                  <label className="mr-r-10">All</label>
                  <input
                    type="radio"
                    name="moveit_type"
                    value="1"
                    checked={this.state.checkBoxVal===1}
                    className="mr-r-5"
                  />{" "}
                  <label className="mr-r-10">Trip</label>
                  <input
                    type="radio"
                    name="moveit_type"
                    value="2"
                    checked={this.state.checkBoxVal===2}
                    className="mr-r-5"
                  />{" "}
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
            </div> */}
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
            <div className="scroll-horizantal-refund">
              <div>
                <Table style={{ width: "1500px" }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Order date/time</th>
                      <th>CRM Agent</th>
                      <th>Refund Request time</th>
                      <th>Order id</th>
                      <th>Transaction id</th>
                      <th>User id</th>
                      <th>Refund reason </th>
                      <th>Refund amount</th>
                      <th>Refund products</th>
                      <th>Attachment</th>
                      <th>Approval</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayorderlist.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{this.dateConvert(item.order_created_time)}</td>
                        <td>{item.adminname}</td>
                        <td>{this.dateConvert(item.created_at)}</td>
                        <td>
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => this.onViewOrder(item)}
                        >
                          {item.doid}
                        </Button>
                      </td>
                        <td>inv#{item.orderid}</td>
                        <td>{item.userid}</td>
                        <td>{item.refund_reason || ""}</td>
                        <td>{item.original_amt}</td>
                        <td>
                          <Button
                            size="sm"
                            onClick={() => this.onFillView(item)}
                          >
                            View list
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            color="link"
                            disabled={!item.refund_image}
                            onClick={() => this.selectPickupImage(item)}
                          >
                            <FaDownload size="20" />{" "}
                          </Button>
                        </td>
                        <td>
                          {item.active_status === 0 ? (
                            <select
                              id={i}
                              onChange={(e) => this.reportClick(e, item, i)}
                              data-default-value="0"
                              className="onDropDown"
                            >
                              <option value="0">Action</option>
                              <option
                                value="1"
                                disabled={onActionHidden("refund_approval")}
                              >
                                Approve
                              </option>
                              <option
                                value="2"
                                disabled={onActionHidden("refund_reject")}
                              >
                                Recject
                              </option>
                            </select>
                          ) : (
                            <div>{item.status_message}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div
              className="float-right mr-t-20"
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

        <Modal
          isOpen={this.state.viewchecklistModal}
          toggle={this.onViewCheckListModal}
          backdrop={"static"}
          className="max-width-600"
        >
          <ModalHeader toggle={this.onViewCheckListModal}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend">View Product</div>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className="pd-10"
              >
                <div
                  className="font-size-14"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid",
                    marginLeft: "30px",
                  }}
                >
                  <div className="width-250 pd-4">Order details</div>
                  <div className="width-100 pd-4 mr-l-20 ">Delivered</div>
                </div>
              </div>
              <hr className="mr-2" />
              <div
                className="pd-10"
                hidden={!this.state.view_item}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "30px",
                    }}
                  >
                    {this.state.view_item.products
                      ? this.state.view_item.products.map((item, index) => (
                          <div
                            className="font-size-14"
                            style={{ display: "flex", flexDirection: "row" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginLeft: "10px",
                              }}
                            >
                              <div className="width-200 pd-4 flex-row">
                                <div>{item.productname}</div> -{" "}
                                <div className="mr-l-10">{item.quantity}</div>
                              </div>
                              <div className="width-150 pd-4 mr-l-40">
                                {item.received_quantity}
                              </div>
                            </div>
                          </div>
                        ))
                      : ""}

                    {this.state.view_item.refund_delivery_charge ? (
                      <div
                        className="font-size-14"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "10px",
                        }}
                      >
                        <div className="width-250 pd-4 flex-row">
                          <div>Delivery Charge</div>
                        </div>
                        <div className="width-150 pd-4 mr-l-40">
                          <i className="fas fa-rupee-sign" />{" "}
                          {this.state.view_item.refund_delivery_charge}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {this.state.view_item.gst ? (
                      <div
                        className="font-size-14"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "10px",
                        }}
                      >
                        <div className="width-250 pd-4 flex-row">
                          <div>Gst Charge</div>
                        </div>
                        <div className="width-150 pd-4 mr-l-40">
                          <i className="fas fa-rupee-sign" />{" "}
                          {this.state.view_item.gst}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}

                    {this.state.view_item.original_amt ? (
                      <div
                        className="font-size-14"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "10px",
                        }}
                      >
                        <div className="width-250 pd-4 flex-row">
                          <div>Total Amount</div>
                        </div>
                        <div className="width-150 pd-4 mr-l-40">
                          <i className="fas fa-rupee-sign" />{" "}
                          {this.state.view_item.original_amt}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isActionModal}
          toggle={this.toggleActionPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleActionPopUp}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            {this.state.dropitem
              ? this.state.dropitem.id === 1
                ? "Are you sure you want to approve this payment?"
                : "Are you sure you want to reject this payment?"
              : ""}
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.movetoApprove}>
              YES
            </Button>
            <Button size="sm" onClick={this.toggleActionPopUp}>
              NO
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.isImageModal}
          toggle={this.toggleImagePopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalBody className="pd-10">
            <div className="fieldset">
              <div className="legend">
                Proof Image - Order No - #{this.state.imageItem.orderid}
              </div>
              {this.state.imageItem ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px",
                  }}
                >
                  {this.state.imageItem.refund_image ? (
                    <a
                      id="img1"
                      href={this.state.imageItem.refund_image}
                      download
                      hidden
                      target="_blank"
                    ></a>
                  ) : (
                    ""
                  )}

                  <Card hidden={!this.state.imageItem.refund_image}>
                    <CardImg
                      top
                      style={{ width: "200px", height: "200px" }}
                      src={this.state.imageItem.refund_image}
                      alt="Proof Image"
                    />
                    <Button
                      size="sm"
                      onClick={() => this.ImageDownload("img1")}
                    >
                      View
                    </Button>
                  </Card>
                </div>
              ) : (
                ""
              )}
            </div>
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleImagePopUp}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(RefundApproval);
