import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaEye, FaRegFilePdf, FaTrashAlt, FaDownload } from "react-icons/fa";
import {
  PO_LIST,
  PO_REPORT,
  ZONE_ITEM_REFRESH,
  PO_DELETE_REASON_LIST,
  PO_VIEW,
  PO_DELETE,
  PO_CLOSE,
  PO_CLEAR,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Search from "../components/Search";
import Searchnew from "../components/Searchnew";
import { store } from "../store";
import {
  getPoStatus,
  getAdminId,
  onActionHidden,
} from "../utils/ConstantFunction";
import { CSVLink } from "react-csv";
import PaginationComponent from "react-reactstrap-pagination";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";

const mapStateToProps = (state) => ({
  ...state.po,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetPoDeleteReasonList: (data) =>
    dispatch({
      type: PO_DELETE_REASON_LIST,
      payload: AxiosRequest.Warehouse.getPoReasonList(data),
    }),
  onGetPoList: (data) =>
    dispatch({
      type: PO_LIST,
      payload: AxiosRequest.Warehouse.getPoList(data),
    }),
  onGetPoReport: (data) =>
    dispatch({
      type: PO_REPORT,
      payload: AxiosRequest.Warehouse.getPoReport(data),
    }),

  onGetViewPO: (data) =>
    dispatch({
      type: PO_VIEW,
      payload: AxiosRequest.Warehouse.getPoView(data),
    }),
  onGetDeletePO: (data) =>
    dispatch({
      type: PO_DELETE,
      payload: AxiosRequest.Warehouse.getPoDelete(data),
    }),
  onGetClosePO: (data) =>
    dispatch({
      type: PO_CLOSE,
      payload: AxiosRequest.Warehouse.getPoClose(data),
    }),
  onPoClear: () =>
    dispatch({
      type: PO_CLEAR,
    }),
});

class Po extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      search_refresh: false,
      pono: false,
      supplier_name: false,
      selectedPage: 1,
      po_createdate: false,
      enddate: false,
      due_date: false,
      today: Moment(new Date()),
      isOpenRecevingDropDown: false,
      isOpenpoDropDown: false,
      isOpenpoReasonDropDown: false,
      poreasonItem: { dpoid: -1, reason: "Wrong PO" },
      isViewModal: false,
      view_item: false,
      isConfrimModal: false,
      select_item: false,
      isReport: false,
      isDelete: false,
      recevingItem: { id: -1, name: "All" },
      postatusItem: { id: -1, name: "All" },
    };
  }

  UNSAFE_componentWillMount() {
    this.onGetPoList = this.onGetPoList.bind(this);
    this.pocreateDate = this.pocreateDate.bind(this);
    this.dueDate = this.dueDate.bind(this);
    this.toggleConfirmPopup = this.toggleConfirmPopup.bind(this);
    this.onSearchPOno = this.onSearchPOno.bind(this);
    this.onSearchSupplier = this.onSearchSupplier.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.gotoVendorAssign = this.gotoVendorAssign.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.toggleRecevingDropDown = this.toggleRecevingDropDown.bind(this);
    this.togglePoDropDown = this.togglePoDropDown.bind(this);
    this.clickReceving = this.clickReceving.bind(this);
    this.clickPostatus = this.clickPostatus.bind(this);
    this.clickPoReasonstatus = this.clickPoReasonstatus.bind(this);
    this.onReset = this.onReset.bind(this);
    this.toggleOrderView = this.toggleOrderView.bind(this);
    this.onView = this.onView.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onClose = this.onClose.bind(this);
    this.togglePoReasonDropDown = this.togglePoReasonDropDown.bind(this);
    this.onGetPoList();
    this.props.onGetPoDeleteReasonList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    if (this.props.deleteStatus || this.props.closeStatus) {
      this.props.onPoClear();
      this.setState({ isLoading: false });
    }
    if (this.props.poreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    this.onGetPoList();
  }
  componentDidCatch() {}

  onGetPoList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.po_createdate) data.from_date = this.state.po_createdate;
      if (this.state.enddate) data.to_date = this.state.enddate;
      if (this.state.supplier_name)
        data.vendorsearch = this.state.supplier_name;
      if (this.state.due_date) data.due_date = this.state.due_date;
      if (this.state.pono) data.poid = this.state.pono;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      if (this.state.postatusItem && this.state.postatusItem.id !== -1)
        data.po_status = this.state.postatusItem.id;
      if (this.state.recevingItem && this.state.recevingItem.id !== -1)
        data.pop_status = this.state.recevingItem.id;
      this.props.onGetPoList(data);
    }
  };
  onSearchPOno = (e) => {
    const value = e.target.value || "";
    this.setState({ pono: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };
  onSearchSupplier = (e) => {
    const value = e.target.value || "";
    this.setState({ supplier_name: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };

  pocreateDate = (event, picker) => {
    var po_createdate = picker.startDate.format("YYYY-MM-DD");
    var endDate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ po_createdate: po_createdate, enddate: endDate });
  };

  dueDate = (event, picker) => {
    var due_date = picker.startDate.format("YYYY-MM-DD");
    this.setState({ due_date: due_date });
  };
  toggleRecevingDropDown = () => {
    this.setState({
      isOpenRecevingDropDown: !this.state.isOpenRecevingDropDown,
    });
  };

  togglePoReasonDropDown = () => {
    this.setState({
      isOpenpoReasonDropDown: !this.state.isOpenpoReasonDropDown,
    });
  };

  togglePoDropDown = () => {
    this.setState({
      isOpenpoDropDown: !this.state.isOpenpoDropDown,
    });
  };
  toggleOrderView = () => {
    this.setState({
      isViewModal: !this.state.isViewModal,
    });
  };

  toggleConfirmPopup = () => {
    this.setState({
      isConfrimModal: !this.state.isConfrimModal,
    });
  };

  onClose = (Item) => {
    this.setState({ select_item: Item, isDelete: false });
    this.toggleConfirmPopup();
  };

  onDelete = (Item) => {
    this.setState({
      select_item: Item,
      isDelete: true,
      poreasonItem: { dpoid: -1, reason: "Select Reason" },
    });
    this.toggleConfirmPopup();
  };

  onView = (Item) => {
    this.setState({ view_item: Item });
    this.props.onGetViewPO({
      zoneid: this.props.zoneItem.id,
      poid: Item.poid,
    });
    this.toggleOrderView();
  };

  clickReceving = (item) => {
    this.setState({ recevingItem: item });
  };
  clickPostatus = (item) => {
    this.setState({ postatusItem: item });
  };

  clickPoReasonstatus = (item) => {
    this.setState({ poreasonItem: item });
  };

  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
  };
  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };
  gotoVendorAssign = () => {
    this.props.history.push("/vendor-assign");
  };

  confirmTo = () => {
    var dData = {};
    dData.zoneid = this.props.zoneItem.id;
    dData.poid = this.state.select_item.poid;
    dData.done_by = getAdminId();

    if (this.state.isDelete) {
      if (this.state.poreasonItem.dpoid !== -1) {
        dData.delete_reason=this.state.poreasonItem.reason;
        this.props.onGetDeletePO(dData);
        this.toggleConfirmPopup();
      } else {
        notify.show(
          "Please select the reason",
          "custom",
          2000,
          notification_color
        );
      }
    } else {
      this.props.onGetClosePO(dData);
      this.toggleConfirmPopup();
    }
  };
  onReset = () => {
    this.setState({
      po_createdate: false,
      enddate: false,
      due_date: false,
      selectedPage: 1,
      pono: "",
      supplier_name: "",
      search_refresh: true,
      recevingItem: { id: -1, name: "All" },
      postatusItem: { id: -1, name: "All" },
    });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    this.props.onGetPoList(data);
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };
  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    if (this.state.po_createdate) data.from_date = this.state.po_createdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
    if (this.state.supplier_name) data.vendorsearch = this.state.supplier_name;
    if (this.state.due_date) data.due_date = this.state.due_date;
    if (this.state.pono) data.poid = this.state.pono;
    if (this.state.postatusItem && this.state.postatusItem.id !== -1)
      data.po_status = this.state.postatusItem.id;
    if (this.state.recevingItem && this.state.recevingItem.id !== -1)
      data.pop_status = this.state.recevingItem.id;

    data.report = 1;

    this.props.onGetPoReport(data);
  };

  render() {
    const poList = this.props.poList || [];
    return (
      <div className="width-full pd-6" style={{ position: "fixed" }}>
        <div style={{ height: "85vh" }} className="width-85">
          <div className="fieldset">
            <div className="legend">Purchase Order - Search</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    PO No :{" "}
                  </div>
                  <Search
                    onSearch={this.onSearchPOno}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.search_refresh}
                  />
                </div>
              </Col>
              <Col lg="4" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Date Created: </div>
                  <DateRangePicker
                    opens="right"
                    maxDate={this.state.today}
                    drops="down"
                    onApply={this.pocreateDate}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                  </DateRangePicker>
                  {this.state.po_createdate
                    ? Moment(this.state.po_createdate).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                  {this.state.po_createdate
                    ? " - " + Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </div>
              </Col>

              <Col lg="3" className="pd-0">
                <div
                  hidden={true}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Receiving Status: </div>
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isOpenRecevingDropDown}
                    toggle={this.toggleRecevingDropDown}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.state.recevingItem
                        ? this.state.recevingItem.name
                        : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.receving.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickReceving(item)}
                          key={index}
                        >
                          {item.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </Col>
            </Row>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    Supplier Name :{" "}
                  </div>
                  <Searchnew
                    onSearch={this.onSearchSupplier}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.search_refresh}
                  />
                </div>
              </Col>
              <Col lg="3" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Due Date: </div>
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    minDate={this.state.today}
                    drops="down"
                    onApply={this.dueDate}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                  </DateRangePicker>
                  {this.state.due_date
                    ? Moment(this.state.due_date).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                </div>
              </Col>

              <Col lg="3" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Po Status: </div>
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isOpenpoDropDown}
                    toggle={this.togglePoDropDown}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.state.postatusItem
                        ? this.state.postatusItem.name
                        : ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.postatus.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickPostatus(item)}
                          key={index}
                        >
                          {item.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </Col>
            </Row>
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
          <Row className="mr-b-10 mr-l-10 mr-r-10">
            <Col className="txt-align-right pd-0">
              <Button
                size="sm"
                color="link"
                className="mr-r-20"
                hidden={onActionHidden("wh_po_export")}
                onClick={() => this.onReportDownLoad()}
              >
                <FaDownload size="15" />
              </Button>
              <CSVLink
                data={this.props.poreport}
                filename={"poreport.csv"}
                className="mr-r-20"
                ref={this.csvLink}
                hidden={true}
              ></CSVLink>
              <Button size="sm" onClick={this.gotoVendorAssign}>
                Supplier Assign
              </Button>
            </Col>
          </Row>
          <div className="pd-6">
            <div className="search-horizantal-po">
              <Table style={{ width: "2000px" }}>
                <thead>
                  <tr>
                    <th>PDF</th>
                    <th>View</th>
                    <th>Delete</th>
                    <th>Close PO</th>
                    <th>PO No</th>
                    <th>Supplier Name</th>
                    <th>Supplier Code</th>
                    <th>Date Created</th>
                    <th>Total Quantity</th>
                    <th>Open Quantity </th>
                    <th>Received Quantity </th>
                    <th>Amt </th>
                    <th>Due Date/Time</th>
                    <th>PO Status</th>
                  </tr>
                </thead>
                <tbody>
                  {poList.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <Button
                          size="sm"
                          color="link"
                          disabled={
                            !item.po_pdf_url || onActionHidden("wh_po_view")
                          }
                        >
                          <a href={item.po_pdf} target="_blank">
                            <FaRegFilePdf
                              className="txt-color-theme txt-cursor pd-2"
                              size="18"
                            />
                          </a>
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => this.onView(item)}
                          disabled={onActionHidden("wh_po_view")}
                        >
                          <FaEye size="16" />
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          color="link"
                          onClick={() => this.onDelete(item)}
                          disabled={
                            item.delete_flag === 0 ||
                            onActionHidden("wh_delete_po")
                          }
                        >
                          <FaTrashAlt size="16" />
                        </Button>
                      </td>
                      <td>
                        <Button
                          className="btn-close"
                          disabled={
                            item.close_flag === 0 ||
                            onActionHidden("wh_po_close")
                          }
                          onClick={() => this.onClose(item)}
                        >
                          Close
                        </Button>
                      </td>
                      <td>{item.poid}</td>
                      <td>{item.name}</td>
                      <td>{item.vid}</td>
                      <td>
                        {Moment(item.created_at).format("DD-MMM-YYYY/hh:mm a")}
                      </td>
                      <td>{item.total_quantity}</td>
                      <td>{item.open_quqntity}</td>
                      <td>{item.received_quantity}</td>
                      <td>{item.cost}</td>
                      <td>
                        {Moment(item.due_date).format("DD-MMM-YYYY/hh:mm a")}
                      </td>
                      <td>{getPoStatus(item.po_status)}</td>
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
          isOpen={this.state.isViewModal}
          toggle={this.toggleOrderView}
          className="max-width-1000"
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleOrderView}
            className="pd-10 border-none"
          >
            PO Id # {this.props.poview ? this.props.poview.poid : ""}
          </ModalHeader>
          <ModalBody className="pd-10">
            <div>
              {this.props.poview ? (
                <div className="font-size-12 mr-b-10">
                  <div>Supplier ID : {this.props.poview.vid}</div>
                  <div>Supplier Name : {this.props.poview.vendorname}</div>
                  <div>
                    PO Status :{" "}
                    {this.props.poview.po_status === 0 ? "Open" : "Close"}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <Table>
              <thead>
                <tr>
                  <th>Pid</th>
                  <th>Product Name</th>
                  <th>Requested Quantity</th>
                  <th>Aditional Quantity</th>
                  <th>Received Quantity</th>
                  <th>Receving Status</th>
                  <th>Delivery Notes</th>
                </tr>
              </thead>
              <tbody>
                {this.props.poview
                  ? this.props.poview.products.map((item, i) => (
                      <tr key={i}>
                        <td>{item.vpid}</td>
                        <td>{item.productname}</td>
                        <td>{item.requested_quantity}</td>
                        <td>{item.aditional_quantity}</td>
                        <td>{item.received_quantity}</td>
                        <td>{getPoStatus(item.pop_status)}</td>
                        <td>{item.delivery_note || "-"}</td>
                      </tr>
                    ))
                  : ""}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isConfrimModal}
          toggle={this.togglePoPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleConfirmPopup}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            {this.state.isDelete
              ? "Are you sure you want to delete the po?"
              : "Are you sure you want to close the po?"}
            {this.state.isDelete ? (
              <div>
              <ButtonDropdown
                className="max-height-30 mr-t-20"
                isOpen={this.state.isOpenpoReasonDropDown}
                toggle={this.togglePoReasonDropDown}
                size="sm"
              >
                <DropdownToggle caret>
                  {this.state.poreasonItem
                    ? this.state.poreasonItem.reason
                    : ""}
                </DropdownToggle>
                <DropdownMenu>
                  {this.props.po_reason_list.map((item, index) => (
                    <DropdownItem
                      onClick={() => this.clickPoReasonstatus(item)}
                      key={index}
                    >
                      {item.reason}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
              </div>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleConfirmPopup}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmTo}>
              YES
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Po);
