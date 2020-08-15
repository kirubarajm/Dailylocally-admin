import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import PaginationComponent from "react-reactstrap-pagination";
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
  Card,
  CardImg,
} from "reactstrap";
import { FaDownload } from "react-icons/fa";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { store } from "../store";
import Search from "../components/Search";
import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  TRIP_ORDER_LIST,
  TRIP_ORDER_REPORT,
  TRIP_ORDER_SEARCH,
  TRIP_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  ORDER_ACTION_CLEAR,
  TRIP_ORDER_UNASSIGN,
} from "../constants/actionTypes";
import SearchItem from "../components/SearchItem";

const mapStateToProps = (state) => ({
  ...state.triporders,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetTripList: (data) =>
    dispatch({
      type: TRIP_ORDER_LIST,
      payload: AxiosRequest.Logistics.getTripList(data),
    }),
  onGetTripReport: (data) =>
    dispatch({
      type: TRIP_ORDER_REPORT,
      payload: AxiosRequest.Logistics.getTripReport(data),
    }),
  onGetTripSearchList: (data) =>
    dispatch({
      type: TRIP_ORDER_SEARCH,
      payload: AxiosRequest.Logistics.getTripSearchList(data),
    }),
  onPostOrderUnAssign: (data) =>
    dispatch({
      type: TRIP_ORDER_UNASSIGN,
      payload: AxiosRequest.Logistics.postTripUnAssign(data),
    }),
  onSetTripFilters: (data) =>
    dispatch({
      type: TRIP_ORDER_LIST_FILTER,
      data,
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
  onGetReturnReason: () =>
    dispatch({
      type: ORDER_RETURN_REASON,
      payload: AxiosRequest.CRM.getReturnReason(),
    }),
  onPostReturnOrder: (data) =>
    dispatch({
      type: POST_RETURN_ORDER,
      payload: AxiosRequest.CRM.postReturnOrder(data),
    }),
  onClear: () =>
    dispatch({
      type: ORDER_ACTION_CLEAR,
    }),
});

const defultPage = 1;
const pagelimit = 20;
const defult_slot = {
  id: -1,
  status: "All",
};
var defualtReturnReason = { rid: -1, reason: "Select reason" };
class TripOrders extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      startdate: false,
      enddate: false,
      selected_page_dayorderid: false,
      isOpenOrderStatus: false,
      isOpenSlot: false,
      select_order_status: defult_slot,
      select_slot: defult_slot,
      order_no: false,
      user_search: false,
      orderid_refresh: false,
      isLoading: false,
      isLoadingSearch: false,
      userid: 0,
      user_via_order: false,
      check_item: { products: [] },

      isDunzoModal: false,
      isImageModal: false,
      returnItem: false,
      imageItem: false,
      isOpenActionDropDown: false,
      actionItem: [{ id: -1 }],
      isReturnorderModal: false,
      returnorderItem: defualtReturnReason,
      isReturnorderReasonModal: false,
      isReport: false,
      isAllDisable:true,
    };
  }

  UNSAFE_componentWillMount() {
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }
    this.dateSelectOr = this.dateSelectOr.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
    this.clickAction = this.clickAction.bind(this);

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

    if (this.props.isReturnordered) {
      this.props.onClear();
      this.toggleReturnorder();
      this.setState({ isLoading: false });
    }
    if (this.props.isOrderUpdated) {
      this.props.onClear();
      this.setState({ isLoading: false, selected_page_dayorderid: false });
    }

    if (this.props.triporderreport.length > 0 && this.state.isReport) {
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

  toggleDunzoPopUp = () => {
    this.setState((prevState) => ({
      isDunzoModal: !prevState.isDunzoModal,
    }));
  };

  toggleImagePopUp = () => {
    this.setState((prevState) => ({
      isImageModal: !prevState.isImageModal,
    }));
  };

  toggleReturnorder = () => {
    this.setState({
      isReturnorderModal: !this.state.isReturnorderModal,
    });
  };

  selectPickupImage = (item) => {
    this.setState({ imageItem: item });
    this.toggleImagePopUp();
  };

  selectBookReturn = (item) => {
    this.setState({ returnItem: item });
    this.props.onGetReturnReason();
    this.toggleReturnorder();
  };

  movetoDunzo = () => {
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
    var data = {
      zoneid: this.props.zoneItem.id,
      doid: AllValues,
      done_by: getAdminId(),
    };
    this.toggleDunzoPopUp();
    if (this.state.actionItem.id === 1) {
      console.log("data-->", data);
      this.props.onPostOrderUnAssign(data);
    }
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
    this.props.onSetTripFilters(false);
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
    this.props.onSetTripFilters(false);
    this.props.onGetTripList({
      zoneid: this.props.zoneItem.id,
      page: defultPage,
    });
  };

  onGetOrders = () => {
    if (this.props.zoneItem && !this.state.isLoadingSearch) {
      var datasearch = { zoneid: this.props.zoneItem.id };
      this.setState({ isLoadingSearch: true });
      this.props.onGetTripSearchList(datasearch);
    }
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
        });
      } else {
        data.page = defultPage;
        if (this.state.startdate) data.from_date = this.state.startdate;
        if (this.state.enddate) data.to_date = this.state.enddate;
        if (this.state.order_no) data.tripid = this.state.order_no;
        if (this.state.user_search) data.moveit_id = this.state.user_search;
        if (
          this.state.select_order_status &&
          this.state.select_order_status.id !== -1
        )
          data.dayorderstatus = this.state.select_order_status.id;
        if (this.state.select_slot && this.state.select_slot.id !== -1)
          data.slot = this.state.select_slot.id;
      }

      this.props.onSelectStatus(this.state.select_order_status);
      this.props.onSelectSlot(this.state.select_slot);
      this.props.onGetTripList(data);
      this.props.onSetTripFilters(data);
    }
  };

  onView = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  onCheckOrder = (item) => {
    if (item.dayorderstatus===8) return true;
    else return false;
  };

  handleSelected = (selectedPage) => {
    var data = { zoneid: this.props.zoneItem.id };
    if (this.props.datafilter) {
      data = this.props.datafilter;
    }
    this.setState({ selectedPage: selectedPage,isAllDisable:true});
    data.page = selectedPage;
    this.props.onGetTripList(data);
    this.props.onSetTripFilters(data);
  };

  handleChange(e,page) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var pageValue = this.state.selected_page_dayorderid || [];
    const dayorderlist = this.props.dayorderlist || [];
    if (pageValue.length === 0 || !pageValue[page])
    pageValue[page] = { ids: [] };
    
    if (name === "selectall") {
      if (value) {
        pageValue[page].ids[name] = value;
        dayorderlist.map((item, i) => {
          if (item.dayorderstatus === 7 || item.dayorderstatus === 8)
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
  toggleAction = () => {
    this.setState({
      isOpenActionDropDown: !this.state.isOpenActionDropDown,
    });
  };

  clickAction = (item) => {
    var checkItem_page = this.state.selected_page_dayorderid;
    var Values = Object.keys(checkItem_page);
    var AllValues=[]
    for(var i=0;i<Values.length;i++){
      var arr = Object.keys(checkItem_page[Values[i]].ids);
      AllValues = AllValues.concat(arr);
    }
    if (AllValues.length === 0) {
      notify.show(
        "Please select the order after try this",
        "custom",
        2000,
        notification_color
      );
    } else {
      this.setState({ actionItem: item });
      this.toggleDunzoPopUp();
    }
  };

  toggleReturnReason = () => {
    this.setState({
      isReturnorderReasonModal: !this.state.isReturnorderReasonModal,
    });
  };

  clickReturnorderReason = (item) => {
    this.setState({
      returnorderItem: item,
    });
  };

  retrunorderConfirm = () => {
    if (this.state.returnorderItem.rid === -1) {
      notify.show(
        "Please select the return order reason",
        "custom",
        3000,
        notification_color
      );
    } else {
      var data = {
        doid: this.state.returnItem.id,
        return_reason: this.state.returnorderItem.rid,
        done_by: getAdminId(),
      };
      this.props.onPostReturnOrder(data);
    }
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

  ImageDownload = (img) => {
    document.getElementById(img).click();
  };
  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { zoneid: this.props.zoneItem.id };
    if (this.state.startdate) data.from_date = this.state.startdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
    if (this.state.order_no) data.tripid = this.state.order_no;
    if (this.state.user_search) data.moveit_id = this.state.user_search;
    if (
      this.state.select_order_status &&
      this.state.select_order_status.id !== -1
    )
      data.dayorderstatus = this.state.select_order_status.id;
    if (this.state.select_slot && this.state.select_slot.id !== -1)
      data.slot = this.state.select_slot.id;
    data.report = 1;
    this.props.onGetTripReport(data);
  };

  onViewOrder = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  checkDisable = (item) => {
    if(item.dayorderstatus !== 7 &&item.dayorderstatus !== 8){
        return true;
    }else{
      if (this.state.isAllDisable) this.setState({isAllDisable:false});
      return false;
    }
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
            <div className="legend">Trip Orders Search</div>
            <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-150 mr-l-20 align_self_center">
                Logistics executive :
              </div>
              <div className="width-200 mr-l-10">
                <Search
                  onSearch={this.onSearchOrderno}
                  type="text"
                  value={this.state.order_no}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-74 mr-l-20 align_self_center">Date:</div>
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
              <div className="width-150 mr-l-20 align_self_center">
                Trip no :
              </div>
              <div className="width-200 mr-l-10">
                <SearchItem
                  onSearch={this.onSearchOrderno}
                  type="number"
                  value={this.state.order_no}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
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
                        disabled={this.state.isAllDisable}
                        checked={
                          this.state.selected_page_dayorderid &&
                          this.state.selected_page_dayorderid[
                            this.state.selectedPage
                          ]? this.state.selected_page_dayorderid[
                                this.state.selectedPage
                              ].ids["selectall"]
                            : false
                        }
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
              <Col className="txt-align-right mr-r-20">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("trip_export")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>

                <CSVLink
                  data={this.props.triporderreport}
                  filename={"Trip_OrderReport.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
                <ButtonDropdown
                  className="max-height-30"
                  isOpen={this.state.isOpenActionDropDown}
                  toggle={this.toggleAction}
                  size="sm"
                >
                  <DropdownToggle caret>Action</DropdownToggle>
                  <DropdownMenu>
                    {this.props.actionList.map((item, index) => (
                      <DropdownItem
                        disabled={
                          onActionHidden("trip_unassign_order") && item.id === 1
                        }
                        onClick={() => this.clickAction(item)}
                        key={index}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </Col>
            </Row>
            <div className="scroll-horizantal-trip">
              <div>
                <Table style={{ width: "1500px" }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Select</th>
                      <th>Order no</th>
                      <th>Status</th>
                      <th>Trip No</th>
                      <th>Logistics executive</th>
                      <th>Assigned By</th>
                      <th>Assigned Date/Time</th>
                      <th>Picked Up</th>
                      <th>Delivered</th>
                      <th>Photo</th>
                      <th>Book return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayorderlist.map((item, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <label className="container-check">
                          <input
                              type="checkbox"
                              name={"" + item.id}
                              disabled={ this.checkDisable(item)
                                
                              }
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
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => this.onViewOrder(item)}
                        >
                          {item.id}
                        </Button>
                      </td>
                        <td>{item.dayorderstatus_msg}</td>
                        <td>{item.trip_id}</td>
                        <td>{item.name}</td>
                        <td>{item.assigned_by}</td>
                        <td>{this.dateConvert(item.assigned_datetime)}</td>
                        <td>{this.dateConvert(item.moveit_pickup_time)}</td>
                        <td>{this.dateConvert(item.moveit_actual_delivered_time)}</td>
                        <td>
                          <Button
                            size="sm"
                            color="link"
                            disabled={!item.checklist_img1}
                            onClick={() => this.selectPickupImage(item)}
                          >
                            <FaDownload size="20" />{" "}
                          </Button>
                        </td>
                        <td>
                          {this.onCheckOrder(item) ? (
                            <Button
                              size="sm"
                              disabled={onActionHidden("trip_book_return")}
                              onClick={() => this.selectBookReturn(item)}
                            >
                              Book Return
                            </Button>
                          ) : (
                            <Button size="sm" disabled="true">
                              Book Return
                            </Button>
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
          isOpen={this.state.isDunzoModal}
          toggle={this.toggleDunzoPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleDunzoPopUp}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to unassign the orders?
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.movetoDunzo}>
              YES
            </Button>
            <Button size="sm" onClick={this.toggleDunzoPopUp}>
              NO
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.isReturnorderModal}
          toggle={this.toggleReturnorder}
          backdrop={true}
          className="max-width-800"
        >
          <ModalBody className="pd-10">
            <div className="fieldset">
              <div className="legend">
                Book Return -Order No - #{this.state.returnItem.id}
              </div>
              <Row className="mr-l-10 mr-b-10">
                <Col className="flex-row">
                  <div className="width-200 font-size-14">
                    Return Reason
                    <span className="must width-25">*</span>
                  </div>
                  <div className="mr-l-10">
                    <ButtonDropdown
                      className="max-height-30"
                      isOpen={this.state.isReturnorderReasonModal}
                      toggle={this.toggleReturnReason}
                      size="sm"
                    >
                      <DropdownToggle caret>
                        {this.state.returnorderItem.reason || ""}
                      </DropdownToggle>
                      <DropdownMenu>
                        {this.props.returnReasonList.map((item, index) => (
                          <DropdownItem
                            onClick={() => this.clickReturnorderReason(item)}
                            key={index}
                          >
                            {item.reason}
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                </Col>
              </Row>
            </div>
            <Row className="mr-b-10 mr-r-10">
              <Col lg="8"></Col>
              <Col className="pd-0 mr-r-10 txt-align-right">
                <Button
                  size="sm"
                  type="submit"
                  onClick={this.retrunorderConfirm}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  className="mr-l-10"
                  onClick={this.toggleReturnorder}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </ModalBody>
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
                Pickedup Image - Order No - #{this.state.imageItem.id}
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
                  {this.state.imageItem.checklist_img1 ? (
                    <a
                      id="img1"
                      href={this.state.imageItem.checklist_img1}
                      download
                      hidden
                      target="_blank"
                    ></a>
                  ) : (
                    ""
                  )}
                  {this.state.imageItem.checklist_img2 ? (
                    <a
                      id="img2"
                      href={this.state.imageItem.checklist_img2}
                      download
                      hidden
                      target="_blank"
                    ></a>
                  ) : (
                    ""
                  )}
                  <Card hidden={!this.state.imageItem.checklist_img1}>
                    <CardImg
                      top
                      style={{ width: "200px", height: "200px" }}
                      src={this.state.imageItem.checklist_img1}
                      alt="PickedUp Image1"
                    />
                    <Button
                      size="sm"
                      onClick={() => this.ImageDownload("img1")}
                    >
                      View
                    </Button>
                  </Card>
                  <Card
                    className="mr-l-20"
                    hidden={!this.state.imageItem.checklist_img2}
                  >
                    <CardImg
                      top
                      style={{ width: "200px", height: "200px" }}
                      src={this.state.imageItem.checklist_img2}
                      alt="PickedUp Image2"
                    />
                    <Button
                      size="sm"
                      onClick={() => this.ImageDownload("img2")}
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
export default connect(mapStateToProps, mapDispatchToProps)(TripOrders);
