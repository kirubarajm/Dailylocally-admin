import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import PaginationComponent from "react-reactstrap-pagination";
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
  TRACK_ORDER_LIST,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  ORDER_ACTION_CLEAR,
} from "../constants/actionTypes";
import SearchItem from "../components/SearchItem";

const mapStateToProps = (state) => ({
  ...state.triporders,
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
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      startdate: "2020-07-01",
      enddate: "2020-07-16",
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
      user_via_order: false,
      check_item: { products: [] },

      isDunzoModal: false,
      returnItem: false,
      isOpenActionDropDown: false,
      actionItem: [{ id: -1 }],
      isReturnorderModal: false,
      returnorderItem: defualtReturnReason,
      isReturnorderReasonModal: false,
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

  toggleReturnorder = () => {
    this.setState({
      isReturnorderModal: !this.state.isReturnorderModal,
    });
  };

  selectBookReturn = (item) => {
    this.setState({ returnItem: item });
    this.props.onGetReturnReason();
    this.toggleReturnorder();
  };

  movetoDunzo = () => {
    this.toggleDunzoPopUp();
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
        });
      } else {
        data.page = defultPage;
        if (this.state.startdate) data.starting_date = this.state.startdate;
        if (this.state.enddate) data.end_date = this.state.enddate;
        if (this.state.order_no) data.id = this.state.order_no;
        if (this.state.user_search) data.search = this.state.user_search;
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
      this.props.onGetDayorders(data);
      this.props.onSetDayordersFilters(data);
    }
  };

  onView = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  onCheckOrder = (item) => {
    if (item.dayorderstatus > 5 && item.dayorderstatus < 10) return true;
    else return true;
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
          if (item.dayorderstatus === 6) arvalue[item.id] = value;
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
  toggleAction = () => {
    this.setState({
      isOpenActionDropDown: !this.state.isOpenActionDropDown,
    });
  };

  clickAction = (item) => {
    this.setState({ actionItem: item });
    this.toggleDunzoPopUp();
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
        done_by: 1,
      };
      this.props.onPostReturnOrder(data);
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
                  type="number"
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
                  type="text"
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
            <div className="scroll-horizantal-logistics">
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
                              disabled={item.dayorderstatus !== 6}
                              checked={this.state.selected_dayorderid[item.id]}
                              onChange={(e) => this.handleChange(e)}
                            />
                            <span className="checkmark"></span>{" "}
                          </label>
                        </td>

                        <td>{item.id}</td>
                        <td>{item.dayorderstatus_msg}</td>
                        <td>{item.trip_id}</td>
                        <td>{item.driver_name}</td>
                        <td>{item.assigned_by}</td>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>
                          <FaDownload
                            size="20"
                            className="txt-cursor txt-color-theme"
                          />
                        </td>
                        <td>
                          {this.onCheckOrder(item) ? (
                            <Button
                              size="sm"
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
            <Button size="sm" onClick={this.toggleDunzoPopUp}>
              NO
            </Button>
            <Button size="sm" onClick={this.movetoDunzo}>
              YES
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
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TripOrders);
