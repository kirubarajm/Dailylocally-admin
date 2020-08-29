import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import PaginationComponent from "react-reactstrap-pagination";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
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
} from "reactstrap";
import Moment from "moment";
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { FaEye, FaPlus, FaDownload } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import { CSVLink } from "react-csv";
import Search from "../components/Search";
import Select from "react-dropdown-select";

import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  TRACK_ORDER_LIST,
  TRACK_LOGISTICS_REPORT,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ZONE_TRIP_ORDER_LIST,
  TRIP_DRIVER_LIST,
  QA_CHECK_LIST,
  POST_QA_CHECK_LIST,
  LOGISTICS_CLEAR,
  POST_DUNZO_ASSIGN,
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
  ...state.logistics,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetDayorders: (data) =>
    dispatch({
      type: TRACK_ORDER_LIST,
      payload: AxiosRequest.Logistics.getOrdersList(data),
    }),
  onGetDayordersReport: (data) =>
    dispatch({
      type: TRACK_LOGISTICS_REPORT,
      payload: AxiosRequest.Logistics.getOrderReport(data),
    }),
  onGetTripOrders: (data) =>
    dispatch({
      type: ZONE_TRIP_ORDER_LIST,
      payload: AxiosRequest.Logistics.getTripOrders(data),
    }),
  onGetDriverList: (data) =>
    dispatch({
      type: TRIP_DRIVER_LIST,
      payload: AxiosRequest.Logistics.getDriverList(data),
    }),
  onGetQACheckList: (data) =>
    dispatch({
      type: QA_CHECK_LIST,
      payload: AxiosRequest.Logistics.getQACheckList(data),
    }),
  onPostQACheckList: (data) =>
    dispatch({
      type: POST_QA_CHECK_LIST,
      payload: AxiosRequest.Logistics.postQACheckList(data),
    }),
  onPostDunzoAssign: (data) =>
    dispatch({
      type: POST_DUNZO_ASSIGN,
      payload: AxiosRequest.Logistics.postDunzoAssign(data),
    }),
  onPostTripAssign: (data) =>
    dispatch({
      type: POST_TRIP_ASSIGN,
      payload: AxiosRequest.Logistics.postTripAssign(data),
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
class LogisticsOrders extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      startdate: false,
      enddate: false,
      selected_dayorderid: false,
      selected_page_dayorderid: false,
      selectedPage: 1,
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
      check_item: { products: [] },
      view_item: { qachecklist: 0 },
      isDunzoModal: false,
      dunzoItem: false,
      isTripEnable: true,
      trip_search: false,
      select_driver: [],
      qa_checklist: [],
      checkBoxVal: 0,
      isReport: false,
      isAllDisable: true,
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

    if (this.props.logisticsreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    if (this.props.orderStatusUpdate) {
      this.props.onClear();
      this.setState({
        isLoading: false,
        isTripAssignModal: false,
        selected_page_dayorderid: false,
      });
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

  toggleTripAssignPopUp = () => {
    this.setState((prevState) => ({
      isTripAssignModal: !prevState.isTripAssignModal,
    }));
  };

  selectDunzo = (item) => {
    this.setState({ dunzoItem: item });
    this.toggleDunzoPopUp();
  };

  movetoDunzo = () => {
    var doid = [];
    doid.push(this.state.dunzoItem.id);
    var data = {
      zoneid: this.props.zoneItem.id,
      doid: doid,
      done_by: getAdminId(),
    };
    this.toggleDunzoPopUp();
    this.props.onPostDunzoAssign(data);
  };

  createToTrip = () => {
    if (this.state.select_driver.length === 0) {
      notify.show(
        "Please select the driver after try this",
        "custom",
        2000,
        notification_color
      );
    } else {
      var checkItem_page = this.state.selected_page_dayorderid;
      var Values = Object.keys(checkItem_page);
      var AllValues = [];
      for (var i = 0; i < Values.length; i++) {
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
        moveit_id: this.state.select_driver[0].userid,
        trip_id: this.state.select_driver[0].tripid,
      };
      this.props.onPostTripAssign(data);
    }
  };

  onTripOrders = () => {
    var checkItem_page = this.state.selected_page_dayorderid;
    var Values = Object.keys(checkItem_page);
    var AllValues = [];
    for (var i = 0; i < Values.length; i++) {
      var arr = Object.keys(checkItem_page[Values[i]].ids);
      var indexof = arr.indexOf("selectall");
      if (indexof !== -1) {
        arr.splice(indexof, 1);
      }
      AllValues = AllValues.concat(arr);
    }
    this.props.onGetTripOrders({
      doid: AllValues,
      zoneid: this.props.zoneItem.id,
    });
  };

  gotoTrip = () => {
    var checkItem_page = this.state.selected_page_dayorderid;
    var Values = Object.keys(checkItem_page);
    var AllValues = [];
    for (var i = 0; i < Values.length; i++) {
      var arr = Object.keys(checkItem_page[Values[i]].ids);
      AllValues = AllValues.concat(arr);
    }
    if (AllValues.length > 0) {
      this.onTripOrders();
      this.props.onGetDriverList({ zoneid: this.props.zoneItem.id });
      this.toggleTripAssignPopUp();
    } else {
      notify.show(
        "Please select the order after try this",
        "custom",
        2000,
        notification_color
      );
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
      selectedPage: 1,
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
        if (this.state.startdate) data.from_date = this.state.startdate;
        if (this.state.enddate) data.to_date = this.state.enddate;
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

  onCheckOrder = (item) => {
    if (item.dayorderstatus > 4 && item.dayorderstatus < 11) return true;
    else return true;
  };

  onCheckTrip = (item) => {
    if (item.dayorderstatus === 6) return true;
    else return false;
  };

  onFillCheckList = (item) => {
    this.setState({ check_item: item });
    this.props.onGetQACheckList();
    this.onCheckListModal();
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
    this.setState({ selectedPage: selectedPage, isAllDisable: true });
    this.props.onGetDayorders(data);
    this.props.onSetDayordersFilters(data);
  };

  handleChange(e, page) {
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
          if (item.dayorderstatus === 6) pageValue[page].ids[item.id] = value;
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
            allCheckPage = false;
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

  onCheckListModal = () => {
    this.setState((prevState) => ({
      checklistModal: !prevState.checklistModal,
    }));
  };

  onViewCheckListModal = () => {
    this.setState((prevState) => ({
      viewchecklistModal: !prevState.viewchecklistModal,
    }));
  };

  onCheckListSubmit = () => {
    this.onCheckListModal();
    var data = {
      zoneid: this.props.zoneItem.id,
      doid: this.state.check_item.id,
      qa_checklist: this.state.qa_checklist,
      done_by: getAdminId(),
    };
    console.log("data-->", data);
    this.props.onPostQACheckList(data);
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

  clickDropDown(e, qItem, i) {
    var checkList = this.state.qa_checklist || [];
    if (checkList.length === 0) {
      var qualitytype = this.props.qualitytype;
      for (var i = 0; i < qualitytype.length; i++) {
        var data = {};
        data.qaid = qualitytype[i].qaid;
        if (qualitytype[i].qaid === qItem.qaid) {
          data.qavalue = e.target.selectedIndex === 1 ? 1 : 0;
        } else {
          data.qavalue = 0;
        }
        checkList.push(data);
      }
    } else {
      for (var i = 0; i < checkList.length; i++) {
        var qdata = checkList[i];
        if (qdata.qaid === qItem.qaid) {
          qdata.qavalue = e.target.selectedIndex === 1 ? 1 : 0;
        }
        checkList[i] = qdata;
      }
    }
    this.setState({ qa_checklist: checkList });
  }

  selectedDriver = (item) => {
    var checkItem_page = this.state.selected_page_dayorderid;
    var Values = Object.keys(checkItem_page);
    var AllValues = [];
    for (var i = 0; i < Values.length; i++) {
      var arr = Object.keys(checkItem_page[Values[i]].ids);
      var indexof = arr.indexOf("selectall");
      if (indexof !== -1) {
        arr.splice(indexof, 1);
      }
      AllValues = AllValues.concat(arr);
    }
    this.setState({ select_driver: item });
    this.props.onGetTripOrders({
      doid: AllValues,
      moveit_id: item[0].userid,
      zoneid: this.props.zoneItem.id,
    });
  };
  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { zoneid: this.props.zoneItem.id };
    if (this.state.startdate) data.from_date = this.state.startdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
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

    this.props.onGetDayordersReport(data);
  };
  onViewOrder = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  checkDisable = (item) => {
    if (item.dayorderstatus !== 6) {
      return true;
    } else {
      if (this.state.isAllDisable) this.setState({ isAllDisable: false });
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
            <div className="legend">Order Tracker</div>
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
                  disabled={this.state.user_via_order}
                  value={this.state.user_search}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-120 mr-l-20 align_self_center">Slot :</div>
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
              <div
                className="width-200 mr-l-20 align_self_center"
                onClick={this.onCheckMoveit}
              >
                <form id="radioForm" name="radioForm" className="mr-t-10">
                  <input
                    type="radio"
                    name="moveit_type"
                    value="0"
                    checked={this.state.checkBoxVal === 0}
                    className="mr-r-5"
                  />{" "}
                  <label className="mr-r-10">All</label>
                  <input
                    type="radio"
                    name="moveit_type"
                    value="1"
                    checked={this.state.checkBoxVal === 1}
                    className="mr-r-5"
                  />{" "}
                  <label className="mr-r-10">Trip</label>
                  <input
                    type="radio"
                    name="moveit_type"
                    value="2"
                    checked={this.state.checkBoxVal === 2}
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
                          ]
                            ? this.state.selected_page_dayorderid[
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
              <Col className="txt-align-right">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("logi_invoice_download")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>

                <CSVLink
                  data={this.props.logisticsreport}
                  filename={"Logistics_OrderReport.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
                <Button
                  size="sm"
                  onClick={this.gotoTrip}
                  disabled={onActionHidden("logi_assign_trip")}
                  className="mr-r-20"
                >
                  Assign to trip
                </Button>
              </Col>
            </Row>
            <div className="scroll-horizantal-logistics">
              <div>
                <Table style={{ width: "2000px" }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Select</th>
                      <th>Order no</th>
                      <th>User Name</th>
                      <th>User Phone</th>
                      <th>Due Date</th>
                      <th>Weight</th>
                      <th>Distance</th>
                      <th>Area</th>
                      <th>Pin code</th>
                      <th>Total qty</th>
                      <th>ETA</th>
                      <th>Slot</th>
                      <th>Status</th>
                      <th>QA Checklist</th>
                      <th>Trip ID</th>
                      <th>Download Invoice</th>
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
                              disabled={this.checkDisable(item)}
                              checked={
                                this.state.selected_page_dayorderid &&
                                this.state.selected_page_dayorderid[
                                  this.state.selectedPage
                                ]
                                  ? this.state.selected_page_dayorderid[
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
                        <td>{item.name}</td>
                        <td>{item.phoneno}</td>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm")+" PM"}
                        </td>
                        <td>
                          {item.total_product_weight
                            ? item.total_product_weight + " kg"
                            : "0 kg"}
                        </td>
                        <td>
                          {item.Lastmile ? item.Lastmile + " km" : "0 km"}
                        </td>
                        <td>{item.area}</td>
                        <td>{item.cus_pincode}</td>
                        <td>{item.total_quantity}</td>
                        <td>{item.eta}</td>
                        <td>{item.slot}</td>
                        <td>{item.dayorderstatus_msg}</td>
                        <td>
                          {this.onCheckOrder(item) ? (
                            item.qachecklist === "0" ? (
                              <Button
                                size="sm"
                                disabled={onActionHidden("logi_fill_checklist")}
                                onClick={() => this.onFillCheckList(item)}
                              >
                                Fill Checklist
                              </Button>
                            ) : (
                              //onFillView
                              <Button
                                size="sm"
                                color="link"
                                disabled={onActionHidden("logi_fill_checklist")}
                                className="text-decoration-underline txt-color-theme"
                                onClick={() => this.onFillView(item)}
                              >
                                View
                              </Button>
                              // <div className="text-decoration-underline txt-cursor">
                              //   View
                              // </div>
                            )
                          ) : (
                            <Button size="sm" disabled="true">
                              Fill Checklist
                            </Button>
                          )}
                        </td>
                        <td>
                          {this.onCheckTrip(item) ? (
                            item.trip_id === null ? (
                              <Button
                                size="sm"
                                disabled={
                                  item.moveit_type === 2 ||
                                  onActionHidden("logi_assign_dunzo")
                                }
                                onClick={() => this.selectDunzo(item)}
                              >
                                Assign to Dunzo
                              </Button>
                            ) : (
                              <div>{item.trip_id}</div>
                            )
                          ) : (
                            <Button size="sm" disabled="true">
                              Assign to Dunzo
                            </Button>
                          )}
                        </td>
                        <td>
                          <Button
                            size="sm"
                            disabled={
                              !item.invoice_url ||
                              onActionHidden("logi_invoice_download")
                            }
                          >
                            {item.invoice_url ? (
                              <a
                                href={item.invoice_url}
                                target="_blank"
                                className="txt-color-theme"
                              >
                                <div>Download Invoice</div>
                              </a>
                            ) : (
                              "Download Invoice"
                            )}
                          </Button>
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
          isOpen={this.state.checklistModal}
          toggle={this.onCheckListModal}
          backdrop={"static"}
          className="max-width-1000"
        >
          <ModalHeader toggle={this.onCheckListModal}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend">QA Checklist</div>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className="pd-10"
              >
                <div style={{ width: "500px" }}></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid",
                    marginLeft: "10px",
                  }}
                >
                  <div className="width-200 pd-4">Order details</div>
                  <div className="width-100 pd-4 mr-l-20 ">Available</div>
                </div>
              </div>
              <hr className="mr-2" />
              <div
                className="pd-10"
                hidden={!this.state.check_item}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Row style={{ width: "500px" }}>
                    {this.props.qualitytype.map((qitem, index) => (
                      <Col lg="6">
                        <div>
                          <div className="font-size-14 font-weight-bold">
                            {qitem.name}
                          </div>
                          <div className="pd-4 mr-t-10" key={index}>
                            <select
                              id={qitem.qaid}
                              onChange={(e) =>
                                this.clickDropDown(e, qitem, index)
                              }
                            >
                              <option value="0">No</option>
                              <option value="1">Yes</option>
                            </select>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginLeft: "30px",
                    }}
                  >
                    {this.state.check_item.products.map((item, index) => (
                      <div style={{ display: "flex", flexDirection: "row" }}>
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
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={this.onCheckListModal}>
              Close
            </Button>
            <Button size="sm" onClick={this.onCheckListSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.viewchecklistModal}
          toggle={this.onViewCheckListModal}
          backdrop={"static"}
          className="max-width-1000"
        >
          <ModalHeader toggle={this.onViewCheckListModal}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend">QA Checklist</div>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                className="pd-10"
              >
                <div style={{ width: "500px" }}></div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    border: "1px solid",
                    marginLeft: "10px",
                  }}
                >
                  <div className="width-200 pd-4">Order details</div>
                  <div className="width-100 pd-4 mr-l-20 ">Available</div>
                </div>
              </div>
              <hr className="mr-2" />
              <div
                className="pd-10"
                hidden={!this.state.view_item}
                style={{ display: "flex", flexDirection: "row" }}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Row style={{ width: "500px" }}>
                    {this.state.view_item.qachecklist
                      ? this.state.view_item.qachecklist.map((qitem, index) => (
                          <Col lg="6">
                            <div className="font-size-14 flex-row">
                              <div className="font-weight-bold">
                                {qitem.name}
                              </div>
                              <div className="mr-l-10">
                                - {qitem.qavalue === 1 ? "Yes" : "No"}
                              </div>
                            </div>
                          </Col>
                        ))
                      : "mvkldvlkdvkldv"}
                  </Row>
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
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
        </Modal>

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
            Are you sure order assign to dunzo?
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
          isOpen={this.state.isTripAssignModal}
          toggle={this.toggleTripAssignPopUp}
          className={this.props.className}
          backdrop={true}
          className="max-width-800"
        >
          <ModalBody className="pd-10">
            <div className="fieldset">
              <div className="legend">Trip Assign</div>
              <InputSearchDropDown
                options={this.props.driverlist}
                labelField="name"
                searchable={true}
                clearable={true}
                searchBy="name"
                valueField="userid"
                noDataLabel="No matches found"
                values={this.state.select_driver}
                onSelection={this.selectedDriver}
                label="Driver Name"
              />
              <Row className="mr-lr-10 mr-t-50">
                <Col className="font-size-14 pd-0" lg="4">
                  Trip details
                </Col>
                <Col className="font-size-14 border-block  scroll-trip-assign pd-0 mr-r-10 mr-b-20">
                  {this.props.triporderlist.map((item, index) => (
                    <div
                      className="pd-10"
                      style={{ display: "flex", flexDirection: "row" }}
                    >
                      {item.doid_name} , {item.Locality}, {item.pincode},{" "}
                      {item.order_status}
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.createToTrip}>
              Confirm
            </Button>
            <Button size="sm" onClick={this.toggleTripAssignPopUp}>
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(LogisticsOrders);
