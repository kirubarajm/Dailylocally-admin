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
  QA_QUALITY_LIST,
  UPDATE_QA_LIST,
  ORDERS_QA_SUBMIT,
  ORDERS_QA_CLEAR,
  ZONE_ITEM_REFRESH,
  SORTING_SUBMIT_REPORT,
} from "../constants/actionTypes";
import { store } from "../store";
import { Field, reduxForm } from "redux-form";
import { required } from "../utils/Validation";

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
  constructor() {
    super();
    this.state = {
      isLoading: false,
      poid_refresh: false,
      qaModal: false,
      isQuality: false,
      orderdate: false,
      orderid: "",
      selectedItem: { products: [] },

      isOpenReportDropDown: false,
      reportingItem: false,
      reportingSortingItem: false,
      reportingModal: false,

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
    this.onQAModal();
  };
  onQAList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.orderdate) data.date = this.state.orderdate;
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
    var isSelectedItem = this.state.selectedItem;
    if (isSelectedItem.checklist) {
      console.log("sel-->", e.target.selectedIndex);
      var checklist = isSelectedItem.checklist;
      if (e.target.selectedIndex === 1) {
        var isalready = false;
        checklist.map((ck, i) => {
          if (Item.vpid === ck.vpid) {
            isalready = true;
            var qaidArray = ck.qaid || [];
            qaidArray.push(qItem.qaid);
            ck.qaid = qaidArray;
          }
        });
        if (!isalready) {
          var newproduct = {};
          newproduct.vpid = Item.vpid;
          newproduct.qaid = [];
          newproduct.qaid.push(qItem.qaid);
          checklist.push(newproduct);
        }
      } else {
        checklist.map((ck, i) => {
          if (Item.vpid === ck.vpid) {
            var qaidArray = ck.qaid || [];
            var qindex = qaidArray.indexOf(qItem.qaid);
            if (qindex !== -1) {
              qaidArray.splice(qindex, 1);
              ck.qaid = qaidArray;
            }
          }
        });
      }
      isSelectedItem.checklist = checklist;
    } else {
      var checklistnew = [];
      var data = {};
      data.vpid = Item.vpid;
      data.qaid = [];
      data.qaid.push(qItem.qaid);
      checklistnew.push(data);
      isSelectedItem.checklist = checklistnew;
    }
    this.props.onUpdateQAList(
      this.state.selectedIndex,
      this.state.selectedItem
    );
    this.setState({ selectedItem: isSelectedItem });
  }

  onQaRevoke = () => {
    var data = {};
    data.type = 2;
    data.doid = this.state.selectedItem.doid;
    data.checklist = this.state.selectedItem.checklist;
    this.props.onSubmitQAOrders(data);
  };

  onQaSubmit = () => {
    var data = {};
    data.type = 1;
    data.doid = this.state.selectedItem.doid;
    data.checklist = this.state.selectedItem.checklist;
    this.props.onSubmitQAOrders(data);
  };
  orderDate = (event, picker) => {
    var orderdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ orderdate: orderdate });
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };
  onSearch = () => {
    this.setState({ isLoading: false });
  };

  onReset = () => {
    this.setState({
      orderdate: false,
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
      zone_id: this.props.zoneItem.id,
      dopid: this.state.reportingSortingItem.dopid,
      vpid: this.state.reportingSortingItem.vpid,
      report_quantity: values.item_quantity,
      report_type: this.state.reportingItem.id,
    };
    console.log("data-->", data);
    this.props.onReportSubmit(data);
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
                    singleDatePicker
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
            <div className="search-horizantal-scroll width-full">
              <div className="search-vscroll">
                <Table>
                  <thead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Order ID</th>
                      <th>Order status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qaList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>{item.doid}</td>
                        <td>
                          <Button
                            size="sm"
                            onClick={this.onActionClick(item, i)}
                          >
                            Ready to Dispatch
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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
                    <div className="width-150 pd-4">
                      {item.productname} - {item.quantity}
                    </div>
                    <div className="width-150 pd-4">{item.quantity}</div>
                  </div>

                  <div className="width-150 pd-4">
                    <Button size="sm" onClick={this.reportClick(item)}>
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
