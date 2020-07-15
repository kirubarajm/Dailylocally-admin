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
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { FaEye, FaPlus } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
import Select from "react-dropdown-select";

import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  TRACK_ORDER_LIST,
  TRACK_ORDER_LIST_FILTER,
  TRACK_SELECT_SOLT,
  TRACK_SELECT_STATUS,
  ZONE_TRIP_ORDER_LIST,
  TRIP_DRIVER_LIST,
} from "../constants/actionTypes";
import { getOrderStatus } from "../utils/ConstantFunction";

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
      payload: AxiosRequest.CRM.getOrderList(data),
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
});

const defultPage = 1;
const pagelimit = 20;
const defult_slot = {
  id: -1,
  status: "All",
};

class LogisticsOrders extends React.Component {
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
      dunzoItem: false,
      select_driver: [],
    };
  }

  UNSAFE_componentWillMount() {
    var userid = this.props.match.params.userid || false;
    if (userid) this.setState({ user_via_order: true, userid: userid });
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
      var userid = this.props.match.params.userid || false;
      if (userid) this.setState({ user_via_order: true, userid: userid });
      this.onReset();
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
    this.toggleDunzoPopUp();
  };

  createToTrip = () => {
    this.toggleTripAssignPopUp();
  };

  gotoTrip = () => {
    this.props.onGetDriverList({ zone_id: this.props.zoneItem.id });
    this.toggleTripAssignPopUp();
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
    if (item.dayorderstatus > 4 && item.dayorderstatus < 11) return true;
    else return true;
  };

  onCheckTrip = (item) => {
    if (item.dayorderstatus > 5 && item.dayorderstatus < 11) return true;
    else return false;
  };

  onFillCheckList = (item) => {
    this.setState({ check_item: item });
    this.onCheckListModal();
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

  onCheckListModal = () => {
    this.setState((prevState) => ({
      checklistModal: !prevState.checklistModal,
    }));
  };

  onCheckListSubmit = () => {
    this.onCheckListModal();
  };

  clickDropDown(e, qItem, i) {}

  selectedDriver = (item) => {
    this.setState({ select_driver: item });
    this.props.onGetTripOrders({
      doid: [18],
      moveit_id: item.userid,
      zone_id: this.props.zoneItem.id,
    });
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
                <Button size="sm" onClick={this.gotoTrip}>
                  Assign to trip
                </Button>
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
                      <th>User Name</th>
                      <th>User Phone</th>
                      <th>Date created</th>
                      <th>Area</th>
                      <th>Pin code</th>
                      <th>Total qty</th>
                      <th>ETA</th>
                      <th>Slot</th>
                      <th>Status</th>
                      <th>QA Checklist</th>
                      <th>Trip ID</th>
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
                        <td>{item.name}</td>
                        <td>{item.phoneno}</td>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>{item.city}</td>
                        <td>{item.cus_pincode}</td>
                        <td>{item.order_quantity}</td>
                        <td>{item.eta}</td>
                        <td>{item.slot_id}</td>
                        <td>{item.slot_status}</td>
                        <td>
                          {this.onCheckOrder(item) ? (
                            item.check_list !== null ? (
                              <Button
                                size="sm"
                                onClick={() => this.onFillCheckList(item)}
                              >
                                Fill Checklist
                              </Button>
                            ) : (
                              <div className="text-decoration-underline txt-cursor">
                                View
                              </div>
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
          isOpen={this.state.checklistModal}
          toggle={this.onCheckListModal}
          backdrop={"static"}
          className="max-width-1000"
        >
          <ModalHeader toggle={this.onCheckListModal}></ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "row" }}>
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
                <div className="width-100 pd-4">Available</div>
              </div>
            </div>
            <hr />
            <div
              hidden={!this.state.check_item}
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Row style={{ width: "500px" }}>
                  {this.props.qualitytype.map((qitem, index) => (
                    <Col lg="6">
                      <div>
                        <div className="font-size-14">{qitem.name}</div>
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
                        <div className="width-200 pd-4">
                          {item.productname} - {item.quantity}
                        </div>
                        <div className="width-150 pd-4">
                          {item.received_quantity}
                        </div>
                      </div>
                    </div>
                  ))}
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
            <Button size="sm" onClick={this.toggleDunzoPopUp}>
              NO
            </Button>
            <Button size="sm" onClick={this.movetoDunzo}>
              YES
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
                <Col className="font-size-14 pd-0" lg="4">Trip details</Col>
                <Col className="font-size-14 border-block  scroll-trip-assign pd-0 mr-r-10 mr-b-20">
                  {this.props.triporderlist.map((item, index) => (
                    <div className="pd-4" style={{ display: "flex", flexDirection: "row" }}>
                          {item.doid} , {item.Locality}, {item.pincode}, {item.order_status}
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
