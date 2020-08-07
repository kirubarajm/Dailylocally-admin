import React from "react";
import { connect } from "react-redux";
import { notify } from "react-notify-toast";
import { notification_color, RECEIVING_FORM } from "../utils/constant";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import Search from "../components/Search";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  QA_LIST,
  QA_REPORT,
  QA_QUALITY_LIST,
  UPDATE_QA_LIST,
  ORDERS_QA_SUBMIT,
  ORDERS_QA_CLEAR,
  ZONE_ITEM_REFRESH,
  SORTING_SUBMIT_REPORT,
} from "../constants/actionTypes";
import { CSVLink } from "react-csv";
import { store } from "../store";
import { Field, reduxForm } from "redux-form";
import { required } from "../utils/Validation";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import PaginationComponent from "react-reactstrap-pagination";
import { FaDownload, FaRegFilePdf } from "react-icons/fa";

const mapStateToProps = (state) => ({
  ...state.qapage,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetQAList: (data) =>
    dispatch({
      type: QA_LIST,
      payload: AxiosRequest.Warehouse.getQaList(data),
    }),
  onGetQAReport: (data) =>
    dispatch({
      type: QA_REPORT,
      payload: AxiosRequest.Warehouse.getQaReport(data),
    }),
  onGetQualityOpation: (data) =>
    dispatch({
      type: QA_QUALITY_LIST,
      payload: AxiosRequest.Warehouse.getQaQualityList(data),
    }),
  onUpdateQAList: (index, item) =>
    dispatch({
      type: UPDATE_QA_LIST,
      index,
      item,
    }),
  onSubmitQAOrders: (data) =>
    dispatch({
      type: ORDERS_QA_SUBMIT,
      payload: AxiosRequest.Warehouse.submitQA(data),
    }),
  onReportSubmit: (data) =>
    dispatch({
      type: SORTING_SUBMIT_REPORT,
      payload: AxiosRequest.Warehouse.submitSortingReport(data),
    }),
  onQAClear: () =>
    dispatch({
      type: ORDERS_QA_CLEAR,
    }),
});

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div className="border-none">
      <div>
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        <span
          style={{
            flex: "0",
            WebkitFlex: "0",
            width: "100px",
            height: "10px",
            fontSize: "12px",
            color: "red",
          }}
        >
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </span>
      </div>
    </div>
  );
};

class QAPage extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      poid_refresh: false,
      qaModal: false,
      isQuality: false,
      orderdate: false,
      enddate: false,
      selectedPage: 1,
      orderid: "",
      selectedItem: { products: [] },
      checklist: [],
      isOpenReportDropDown: false,
      reportingItem: false,
      reportingSortingItem: false,
      reportingModal: false,
      isReport: false,
      today: Moment(new Date()),
    };
  }

  UNSAFE_componentWillMount() {
    this.onQAList = this.onQAList.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.isOpenQualityDropDown = this.isOpenQualityDropDown.bind(this);
    this.isOpenQuantityDropDown = this.isOpenQuantityDropDown.bind(this);
    this.isOpenPackagingDropDown = this.isOpenPackagingDropDown.bind(this);
    this.isOpenDriveHygieneDropDown = this.isOpenDriveHygieneDropDown.bind(
      this
    );
    this.clickQuality = this.clickQuality.bind(this);
    this.clickQuantity = this.clickQuantity.bind(this);
    this.clickPackaging = this.clickPackaging.bind(this);
    this.onQaRevoke = this.onQaRevoke.bind(this);
    this.onQaSubmit = this.onQaSubmit.bind(this);

    this.onQAModal = this.onQAModal.bind(this);

    this.orderDate = this.orderDate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.onSearchOrderId = this.onSearchOrderId.bind(this);

    this.onReportingModal = this.onReportingModal.bind(this);
    this.reportSubmit = this.reportSubmit.bind(this);
    this.reportClick = this.reportClick.bind(this);
    this.toggleReportDropDown = this.toggleReportDropDown.bind(this);
    this.clickReportingItem = this.clickReportingItem.bind(this);

    this.props.onGetQualityOpation({});
    this.onQAList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.qa_submitted) {
      this.props.onQAClear();
      this.setState({ isLoading: false });
      this.onQAModal();
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    if (this.props.qcreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    if (this.props.isReportSubmiting) {
      this.props.onQAClear();
      this.onReportingModal();
    }

    this.onQAList();
  }
  componentDidCatch() {}
  onActionClick = (item, index) => (ev) => {
    item.checklist = [];
    this.props.onUpdateQAList(index, item);
    this.setState({ selectedItem: item, selectedIndex: index });
    this.onSetCheckList(item);
    this.onQAModal();
  };
  onQAList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.orderdate) data.from_date = this.state.orderdate;
      if (this.state.enddate) data.to_date = this.state.enddate;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      if (this.state.orderid) data.doid = this.state.orderid;

      this.props.onGetQAList(data);
    }
  };
  onQAModal = () => {
    this.setState((prevState) => ({
      qaModal: !prevState.qaModal,
    }));
  };

  isOpenQualityDropDown = () => {
    this.setState((prevState) => ({
      isQuality: !prevState.isQuality,
    }));
  };

  isOpenQuantityDropDown = () => {
    this.setState((prevState) => ({
      isQuantity: !prevState.isQuantity,
    }));
  };

  isOpenPackagingDropDown = () => {
    this.setState((prevState) => ({
      isPackaging: !prevState.isPackaging,
    }));
  };

  isOpenDriveHygieneDropDown = () => {
    this.setState((prevState) => ({
      isDriveHygiene: !prevState.isDriveHygiene,
    }));
  };

  clickQuality = (Item) => {
    this.setState({ isDriveHygiene: Item });
  };

  clickQuantity = (Item) => {
    this.setState({ isDriveHygiene: Item });
  };

  clickPackaging = (Item) => {
    this.setState({ isDriveHygiene: Item });
  };

  clickDropDown(e, qItem, Item, i) {
    var checklist = this.state.checklist;
    checklist.map((ck, i) => {
      if (Item.vpid === ck.vpid) {
        var qaidArray = ck.qclist || [];
        qaidArray.map((qcl, i) => {
          if (qcl.qcid === qItem.qcid) {
            qcl.qcvalue = e.target.selectedIndex === 1 ? 1 : 0;
          }
        });
      }
    });
    this.props.onUpdateQAList(
      this.state.selectedIndex,
      this.state.selectedItem
    );
    this.setState({ checklist: checklist });
  }

  onQaRevoke = () => {
    var data = {};
    data.type = 2;
    data.doid = this.state.selectedItem.doid;
    data.checklist = this.state.checklist;
    data.zoneid = this.props.zoneItem.id;
    data.done_by = getAdminId();
    this.props.onSubmitQAOrders(data);
  };

  onQaSubmit = () => {
    var data = {};
    data.type = 1;
    data.doid = this.state.selectedItem.doid;
    data.checklist = this.state.checklist;
    data.zoneid = this.props.zoneItem.id;
    data.done_by = getAdminId();
    this.props.onSubmitQAOrders(data);
  };
  orderDate = (event, picker) => {
    var orderdate = picker.startDate.format("YYYY-MM-DD");
    var endDate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ orderdate: orderdate, enddate: endDate });
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };
  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
  };

  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };

  onReset = () => {
    this.setState({
      orderdate: false,
      enddate: false,
      selectedPage: 1,
      orderid: "",
      search_refresh: true,
    });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    this.props.onGetQAList(data);
  };

  onSearchOrderId = (e) => {
    const value = e.target.value || "";
    this.setState({ orderid: value });
  };

  onReportingModal = () => {
    this.setState((prevState) => ({
      reportingModal: !prevState.reportingModal,
    }));
  };
  toggleReportDropDown = () => {
    this.setState((prevState) => ({
      isOpenReportDropDown: !prevState.isOpenReportDropDown,
    }));
  };
  clickReportingItem = (item) => (ev) => {
    this.setState({ reportingItem: item });
  };
  reportClick = (item) => (ev) => {
    this.setState({ reportingSortingItem: item });
    this.onReportingModal();
  };

  reportSubmit = (values) => {
    if (!this.state.reportingItem) {
      notify.show(
        "Please select report type after try this",
        "custom",
        2000,
        notification_color
      );
      return;
    }
    var data = {
      from_type: 2,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
      dopid: this.state.reportingSortingItem.dopid,
      vpid: this.state.reportingSortingItem.vpid,
      report_quantity: values.item_quantity,
      report_type: this.state.reportingItem.id,
    };
    console.log("data-->", data);
    this.props.onReportSubmit(data);
  };

  onSetCheckList = (item) => {
    var checklist = [];
    item.products.map((item, index) => {
      var data = {};
      var qclist = [];
      data.vpid = item.vpid;
      this.props.qualitytype.map((qitem, i) => {
        if (qitem.active_status === 1) {
          var qcidv = {};
          qcidv.qcid = qitem.qcid;
          qcidv.qcvalue = 0;
          qclist.push(qcidv);
        }
      });
      data.qclist = qclist;
      checklist.push(data);
    });
    this.setState({ checklist: checklist });
  };
  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    if (this.state.orderdate) data.from_date = this.state.orderdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
    if (this.state.orderid) data.doid = this.state.orderid;
    data.report = 1;
    this.props.onGetQAReport(data);
  };

  render() {
    const qaList = this.props.qaList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Order Search criteria</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-100">
                    Order ID :{" "}
                  </div>
                  <Search
                    onSearch={this.onSearchOrderId}
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
                  <div className="mr-r-10 width-50">Date: </div>
                  <DateRangePicker
                    opens="right"
                    maxDate={this.state.today}
                    drops="down"
                    onApply={this.orderDate}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                  </DateRangePicker>
                  {this.state.orderdate
                    ? Moment(this.state.orderdate).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                  {this.state.orderdate
                    ? " - " + Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </div>
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
            <Row className="mr-b-10 mr-l-10 mr-r-10">
              <Col className="txt-align-right pd-0">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("wh_qc_report")}
                  onClick={() => this.onReportDownLoad()}
                  >
                    <FaDownload size="15" />
                  </Button>
                  <CSVLink
                    data={this.props.qcreport}
                    filename={"qcreport.csv"}
                    className="mr-r-20"
                    ref={this.csvLink}
                    hidden={true}
                  ></CSVLink>
              </Col>
            </Row>
            <div className="search-horizantal-qc">
              <Table>
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Order ID</th>
                    <th>Order status</th>
                    <th>order checklist</th>
                  </tr>
                </thead>
                <tbody>
                  {qaList.map((item, i) => (
                    <tr key={i}>
                      <td>{Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}</td>
                      <td>{item.doid}</td>
                      <td>
                        <Button
                          size="sm"
                          disabled={onActionHidden("wh_qc_approve")}
                          onClick={this.onActionClick(item, i)}
                        >
                          Approve
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          disabled={
                            !item.invoice_url || onActionHidden("wh_qc_invoice_download")
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
                activePage={this.state.selectedPage}
                size="sm"
              />
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.qaModal}
          toggle={this.onQAModal}
          backdrop={"static"}
          className="max-width-1000"
        >
          <ModalHeader toggle={this.onQAModal}></ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  border: "1px solid",
                }}
              >
                {this.props.qualitytype.map((item, i) => (
                  <div
                    className="width-150 pd-4"
                    hidden={item.active_status === 0}
                  >
                    {item.name}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  border: "1px solid",
                  marginLeft: "10px",
                }}
              >
                <div className="width-150 pd-4">Order details</div>
                <div className="width-100 pd-4">Available</div>
              </div>
            </div>
            <hr />
            <div hidden={!this.state.selectedItem}>
              {this.state.selectedItem.products.map((item, index) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    {this.props.qualitytype.map((qitem, i) => (
                      <div
                        className="width-150 pd-4"
                        hidden={qitem.active_status === 0}
                      >
                        <select
                          id={qitem.qaid}
                          onChange={(e) =>
                            this.clickDropDown(e, qitem, item, index)
                          }
                        >
                          <option value="0">No</option>
                          <option value="1">Yes</option>
                        </select>
                      </div>
                    ))}
                  </div>
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

                  <div className="width-150 pd-4">
                    <Button
                      size="sm"
                      onClick={this.reportClick(item)}
                      disabled={item.received_quantity === 0}
                    >
                      Report
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={this.onQaRevoke}>
              Revoke
            </Button>
            <Button size="sm" onClick={this.onQaSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.reportingModal}
          toggle={this.onReportingModal}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.onReportingModal}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend">Return back to standby</div>
              <div className="font-size-12 mr-l-10 color-grey">
                What do you want to report ?
              </div>
              <ButtonDropdown
                className="max-height-30 mr-l-10 mr-t-10"
                isOpen={this.state.isOpenReportDropDown}
                toggle={this.toggleReportDropDown}
                size="sm"
              >
                <DropdownToggle caret>
                  {this.state.reportingItem
                    ? this.state.reportingItem.report
                    : "Please Select"}
                </DropdownToggle>
                <DropdownMenu>
                  {this.props.report_sorting.map((item, index) => (
                    <DropdownItem
                      onClick={this.clickReportingItem(item)}
                      key={index}
                    >
                      {item.report}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
              <Row className="mr-t-10 mr-l-10 mr-b-10">
                <Col lg="3" className="color-grey pd-0 border-none">
                  <div className="border-none font-size-12">Product Name</div>
                </Col>
                <Col lg="1" className="pd-0">
                  :
                </Col>
                <Col lg="7" className="border-none pd-0">
                  {this.state.reportingSortingItem
                    ? this.state.reportingSortingItem.productname
                    : ""}
                </Col>
              </Row>
              <Row className="mr-t-10 mr-l-10 mr-b-10">
                <Col lg="3" className="color-grey pd-0 border-none">
                  <div className="border-none font-size-12">Quantity shown</div>
                </Col>
                <Col lg="1" className="pd-0">
                  :
                </Col>
                <Col lg="7" className="border-none pd-0">
                  {this.state.reportingSortingItem
                    ? this.state.reportingSortingItem.quantity
                    : ""}
                </Col>
              </Row>
              <form onSubmit={this.props.handleSubmit(this.reportSubmit)}>
                <Row className="mr-t-10 mr-b-10">
                  <Col lg="3" className="color-grey pd-0 border-none">
                    <div className="border-none font-size-12">
                      Quantity to report<span className="must">*</span>
                    </div>
                  </Col>
                  <Col lg="1" className="pd-0"></Col>
                  <Col lg="7" className="border-none pd-0">
                    <Field
                      name="item_quantity"
                      autoComplete="off"
                      type="number"
                      component={InputField}
                      validate={[required]}
                      required={true}
                    />
                  </Col>
                </Row>
                <div className="float-right">
                  <Button size="sm" type="submit" className="width-120">
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
QAPage = reduxForm({
  form: RECEIVING_FORM, // a unique identifier for this form
})(QAPage);
export default connect(mapStateToProps, mapDispatchToProps)(QAPage);
