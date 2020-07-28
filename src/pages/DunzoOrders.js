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
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { onActionHidden } from "../utils/ConstantFunction";
import { store } from "../store";
import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  DUNZO_ORDER_LIST,
  DUNZO_ORDER_FILTER,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  ORDER_ACTION_CLEAR,
  DUNZO_ORDER_PICKED_UP,
  DUNZO_ORDER_DELIVERED,
} from "../constants/actionTypes";

const mapStateToProps = (state) => ({
  ...state.dunzoorders,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetDunzoOrders: (data) =>
    dispatch({
      type: DUNZO_ORDER_LIST,
      payload: AxiosRequest.Logistics.getDunzoOrderList(data),
    }),
  onPostDunzoPickedUp: (data) =>
    dispatch({
      type: DUNZO_ORDER_PICKED_UP,
      payload: AxiosRequest.Logistics.postDunzoPickedUp(data),
    }),
  onPostDunzoDelivered: (data) =>
    dispatch({
      type: DUNZO_ORDER_DELIVERED,
      payload: AxiosRequest.Logistics.postDunzoDelivered(data),
    }),
  onSetDunzoOrderFilters: (data) =>
    dispatch({
      type: DUNZO_ORDER_FILTER,
      data,
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
const defult_slot = {
  id: -1,
  status: "All",
};
var defualtReturnReason = { rid: -1, reason: "Select reason" };
class DunzoOrders extends React.Component {
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

    if (this.props.isOrderUpdated) {
      this.props.onClear();
      this.setState({ isLoading: false, selected_dayorderid: false });
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
    var checkItem = this.state.selected_dayorderid;
    var Values = Object.keys(checkItem);
    var indexof = Values.indexOf("selectall");
    if (indexof !== -1) {
      Values.splice(indexof, 1);
    }
    var data = {
      zoneid: this.props.zoneItem.id,
      doid: Values,
      done_by: 1,
    };
    this.toggleDunzoPopUp();
    if (this.state.actionItem.id === 1) {
      console.log("data-->", data);
      this.props.onPostDunzoPickedUp(data);
    } else if (this.state.actionItem.id === 2) {
      console.log("data-->", data);
      this.props.onPostDunzoDelivered(data);
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
    this.props.onSetDunzoOrderFilters(false);
    this.setState({ isLoading: false });
  };

  onReset = () => {
    this.setState({
      startdate: "",
      enddate: "",
      order_no: "",
      orderid_refresh: true,
    });
    this.props.onSetDunzoOrderFilters(false);
    this.props.onGetDunzoOrders({
      zoneid: this.props.zoneItem.id,
      page:defultPage
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
        });
      } else {
        data.page = defultPage;
        if (this.state.startdate) data.from_date = this.state.startdate;
        if (this.state.enddate) data.to_date = this.state.enddate;
        if (this.state.order_no) data.doid = this.state.order_no;
      }

      this.props.onGetDunzoOrders(data);
      this.props.onSetDunzoOrderFilters(data);
    }
  };

  onView = (Item) => {
    this.props.history.push("/orderview/" + Item.id);
  };

  onCheckOrder = (item) => {
    if (item.dayorderstatus > 5 && item.dayorderstatus < 11) return true;
    else return false;
  };

  handleSelected = (selectedPage) => {
    var data = { zoneid: this.props.zoneItem.id };
    if (this.props.datafilter) {
      data = this.props.datafilter;
    }
    data.page = selectedPage;
    this.props.onGetDunzoOrders(data);
    this.props.onSetDunzoOrderFilters(data);
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
          if (item.dayorderstatus === 7 || item.dayorderstatus === 8)
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
          if (item.dayorderstatus === 7 || item.dayorderstatus === 8) {
            if (!arvalue[item.id]) {
              allCheck = false;
            }
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
    var checkItem = this.state.selected_dayorderid;
    var Values = Object.keys(checkItem);
    if (Values.length === 0) {
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
        done_by: 1,
      };
      this.props.onPostReturnOrder(data);
    }
  };
  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

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
            <div className="legend">Dunzo Orders Search</div>
            <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-75 mr-l-20 align_self_center">
                Order ID :
              </div>
              <div className="width-200 mr-l-10">
                <Searchnew
                  onSearch={this.onSearchUser}
                  type="number"
                  disabled={this.state.user_via_order}
                  value={this.state.user_search}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.orderid_refresh}
                />
              </div>
              <div className="width-100 mr-l-20 align_self_center">Date:</div>
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
                      disabled={
                        (onActionHidden("dunzo_picked_up")&&item.id === 1) ||
                        (onActionHidden("dunzo_delivered") && item.id === 2)}
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
            <div className="scroll-horizantal-dunzo">
              <div>
                <Table style={{ width: "1300px" }}>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Select</th>
                      <th>Order no</th>
                      <th>Status</th>
                      <th>Slot</th>
                      <th>Assigned</th>
                      <th>Assigned Date/Time</th>
                      <th>Picked Up</th>
                      <th>Delivered</th>
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
                              disabled={
                                item.dayorderstatus !== 7 &&
                                item.dayorderstatus !== 8
                              }
                              checked={this.state.selected_dayorderid[item.id]}
                              onChange={(e) => this.handleChange(e)}
                            />
                            <span className="checkmark"></span>{" "}
                          </label>
                        </td>

                        <td>{item.id}</td>
                        <td>{item.dayorderstatus_msg}</td>
                        <td>{item.slot}</td>
                        <td>{item.assigned_by}</td>
                        <td>{this.dateConvert(item.date)}</td>
                        <td>{this.dateConvert(item.moveit_pickup_time)}</td>
                        <td>{this.dateConvert(item.deliver_date)}</td>

                        <td>
                          {this.onCheckOrder(item) ? (
                            <Button
                              size="sm"
                              disabled={onActionHidden('dunzo_book_return')}
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
            {this.state.actionItem.id === 1
              ? "Are you sure order move to picked-up?"
              : "Are you sure order move to delived?"}
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
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(DunzoOrders);
