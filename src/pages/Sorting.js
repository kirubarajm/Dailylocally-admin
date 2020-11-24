import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonDropdown,
} from "reactstrap";
import {
  SORTING_LIST,
  SORTING_REPORT,
  SORTING_SAVING_ITEM,
  SORTING_SUBMIT_ITEM,
  SORTING_CLEAR,
  ZONE_ITEM_REFRESH,
  SORTING_SUBMIT_REPORT,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color, RECEIVING_FORM } from "../utils/constant";
import Search from "../components/Search";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { store } from "../store";
import { Field, reduxForm } from "redux-form";
import { required } from "../utils/Validation";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import PaginationComponent from "react-reactstrap-pagination";
import { CSVLink } from "react-csv";
import { FaDownload, FaCaretDown, FaCaretUp } from "react-icons/fa";
const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div
      className="border-none"
      style={{ display: "flex", flexDirection: "column" }}
    >
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        <span
          style={{
            flex: "0",
            WebkitFlex: "0",
            width: "150px",
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
  );
};

const mapStateToProps = (state) => ({
  ...state.sorting,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetSortingList: (data) =>
    dispatch({
      type: SORTING_LIST,
      payload: AxiosRequest.Warehouse.getSortingList(data),
    }),
  onGetSortingReport: (data) =>
    dispatch({
      type: SORTING_REPORT,
      payload: AxiosRequest.Warehouse.getSortingReport(data),
    }),
  onSaving: (data) =>
    dispatch({
      type: SORTING_SAVING_ITEM,
      payload: AxiosRequest.Warehouse.saveSorting(data),
    }),
  onSubmit: (data) =>
    dispatch({
      type: SORTING_SUBMIT_ITEM,
      payload: AxiosRequest.Warehouse.submitSorting(data),
    }),
  onReportSubmit: (data) =>
    dispatch({
      type: SORTING_SUBMIT_REPORT,
      payload: AxiosRequest.Warehouse.submitSortingReport(data),
    }),
  onClear: () =>
    dispatch({
      type: SORTING_CLEAR,
    }),
});

class Sorting extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      search_refresh: false,
      sortingModal: false,

      isOpenReportDropDown: false,
      reportingItem: false,
      reportingSortingItem: false,
      reportingModal: false,

      selected_dopid: false,
      orderdate: false,
      enddate: false,
      isReport: false,
      selectedPage: 1,
      orderid: "",
      isFilter: false,
      selectedItem: { products: [] },
      today: Moment(new Date()),
    };
  }

  UNSAFE_componentWillMount() {
    this.onSortingList = this.onSortingList.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onSortingModal = this.onSortingModal.bind(this);
    this.onSortingSave = this.onSortingSave.bind(this);
    this.onSortingSubmit = this.onSortingSubmit.bind(this);

    this.onReportingModal = this.onReportingModal.bind(this);
    this.reportSubmit = this.reportSubmit.bind(this);
    this.reportClick = this.reportClick.bind(this);
    this.toggleReportDropDown = this.toggleReportDropDown.bind(this);
    this.clickReportingItem = this.clickReportingItem.bind(this);

    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.orderDate = this.orderDate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSearchOrderId = this.onSearchOrderId.bind(this);

    this.onSortingList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isSaving) {
      this.props.onClear();
      this.onSortingModal();
      this.setState({ isLoading: false });
    }

    if (this.props.isReportSubmiting) {
      this.props.onClear();
      this.onReportingModal();
    }

    if (this.props.sortingreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    if (this.props.isSubmiting) {
      this.props.onClear();
      this.onSortingModal();
      this.setState({ isLoading: false });
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    this.onSortingList();
  }
  componentDidCatch() {}
  onActionClick = (item) => (ev) => {
    if (item.products.length > 0) {
      var arvalue = {};
      for (var i = 0; i < item.products.length; i++) {
        if (item.products[i].sorting_status === 2)
          arvalue[item.products[i].dopid] = true;
      }
      this.setState({
        selected_dopid: arvalue,
      });
    }

    this.setState({ selectedItem: item });
    this.onSortingModal();
  };

  clickReportingItem = (item) => (ev) => {
    this.setState({ reportingItem: item });
  };
  reportClick = (item) => (ev) => {
    this.setState({ reportingSortingItem: item });
    this.onReportingModal();
  };

  onSortingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.orderdate) data.from_date = this.state.orderdate;
      if (this.state.enddate) data.to_date = this.state.enddate;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      if (this.state.orderid) data.doid = this.state.orderid;
      this.props.onGetSortingList(data);
    }
  };

  onReportingModal = () => {
    this.setState((prevState) => ({
      reportingModal: !prevState.reportingModal,
    }));
  };
  onSortingModal = () => {
    this.setState((prevState) => ({
      sortingModal: !prevState.sortingModal,
    }));
  };

  toggleReportDropDown = () => {
    this.setState((prevState) => ({
      isOpenReportDropDown: !prevState.isOpenReportDropDown,
    }));
  };

  onSortingSave = () => {
    var checkItem = this.state.selected_dopid;
    var Values = Object.keys(checkItem);
    if (Values.length > 0) {
      var data = {
        dopid_list: Values,
        zoneid: this.props.zoneItem.id,
        done_by: getAdminId(),
      };
      this.props.onSaving(data);
    } else {
      notify.show(
        "Please select quantity after try this",
        "custom",
        3000,
        notification_color
      );
    }
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
      from_type: 1,
      zoneid: this.props.zoneItem.id,
      dopid: this.state.reportingSortingItem.dopid,
      vpid: this.state.reportingSortingItem.vpid,
      report_quantity: values.item_quantity,
      report_type: this.state.reportingItem.id,
      done_by: getAdminId(),
    };
    console.log("data-->", data);
    this.props.onReportSubmit(data);
  };
  onSortingSubmit = () => {
    var checkItem = this.state.selected_dopid;
    var Values = Object.keys(checkItem);
    var products = this.state.selectedItem.products || [];
    if (Values.length > 0 && Values.length === products.length) {
      var data = {
        zoneid: this.props.zoneItem.id,
        dopid_list: Values,
        done_by: getAdminId(),
      };
      this.props.onSubmit(data);
    } else {
      notify.show(
        "Please select all quantity after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_dopid || [];
    if (value) {
      arvalue[name] = value;
    } else {
      delete arvalue[name];
    }

    this.setState({
      selected_dopid: arvalue,
    });
  }

  orderDate = (event, picker) => {
    var orderdate = picker.startDate.format("YYYY-MM-DD");
    var endDate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ orderdate: orderdate, enddate: endDate });
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };
  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };
  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
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
    this.props.onGetSortingList(data);
  };

  onSearchOrderId = (e) => {
    const value = e.target.value || "";
    this.setState({ orderid: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };
  onToggleFilter = () => {
    this.setState({
      isFilter: !this.state.isFilter,
    });
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
    this.props.onGetSortingReport(data);
  };
  render() {
    const sortingList = this.props.sortingList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="d-xl-none d-md-none mr-b-20 mr-l-10 mr-r-10 mr-t-10">
            <Button onClick={this.onToggleFilter} className="width-full">
              Filter{" "}
              <span className="float-right">
                {this.state.isFilter ? <FaCaretDown /> : <FaCaretUp />}
              </span>
            </Button>
          </div>
          <div className="fieldset" hidden={this.state.isFilter}>
            <div className="legend">Sorting / packing Search criteria</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" sm="12" className="pd-0 mr-b-10">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-75">
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
              <Col lg="4" sm="12" className="pd-0 mr-b-10">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-75">Date: </div>
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
            <Row className="mr-b-10 mr-l-10 mr-r-10 d-none d-sm-block">
              <Col className="txt-align-right pd-0">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("wh_sorting_export")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>
                <CSVLink
                  data={this.props.sortingreport}
                  filename={"sortingreport.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
              </Col>
            </Row>
            <div
              className="search-horizantal-sort"
              style={
                this.state.isFilter ? { height: "50vh" } : { height: "40vh" }
              }
            >
              <Table>
                <thead>
                  <tr>
                    <th>Date/Time</th>
                    <th>Order ID</th>
                    <th>Order status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortingList.map((item, i) => (
                    <tr key={i}>
                      <td style={{ width: 142 }}>
                        {Moment(item.date).format("DD-MMM-YYYY/ hh:mm a")}
                      </td>
                      <td>{item.doid}</td>
                      <td>
                        <Button
                          size="sm"
                          disabled={onActionHidden("wh_moveto_qc")}
                          onClick={this.onActionClick(item)}
                        >
                          Move To QC
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
          isOpen={this.state.sortingModal}
          toggle={this.onSortingModal}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.onSortingModal}>
            Order Id # {this.state.selectedItem.doid}
          </ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="width-100 pd-4">Quality</div>
              <div className="width-150 pd-4">Order details</div>
              <div className="width-150 pd-4">Available</div>
              <div className="width-150 pd-4">{}</div>
            </div>
            <hr />
            <div hidden={!this.state.selectedItem}>
              {this.state.selectedItem.products.map((item, i) => (
                <div style={{ display: "flex", flexDirection: "row" }} key={i}>
                  <div className="width-100 pd-4">
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name={"" + item.dopid}
                        checked={this.state.selected_dopid[item.dopid]}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="checkmark"></span>{" "}
                    </label>
                  </div>
                  <div className="width-200 pd-4">
                    {item.product_name} - {item.quantity}
                  </div>
                  <div className="width-150 pd-4">{item.received_quantity}</div>
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
            <Button size="sm" onClick={this.onSortingSave}>
              Save
            </Button>
            <Button size="sm" onClick={this.onSortingSubmit}>
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
              <Row className="pd-12">
                <Col
                  xs={12}
                  md={6}
                  lg={5}
                  sm={12}
                  className="mr-l-10 mr-b-10 color-grey pd-0"
                >
                  <div className="border-none">Product Name :</div>
                </Col>

                <Col
                  xs={12}
                  md={6}
                  lg={5}
                  sm={12}
                  className="mr-l-10 mr-b-10 mr-r-10 color-grey pd-0 pd-r-15"
                >
                  {this.state.reportingSortingItem
                    ? this.state.reportingSortingItem.product_name
                    : ""}
                </Col>
              </Row>
              <Row className="pd-12">
                <Col
                  xs={6}
                  md={6}
                  lg={5}
                  sm={6}
                  className="mr-l-10 mr-b-10 color-grey pd-0"
                >
                  <div className="border-none">Quantity shown :</div>
                </Col>

                <Col
                  xs={4}
                  md={6}
                  lg={5}
                  sm={6}
                  className="mr-l-10 mr-b-10 color-grey pd-0"
                >
                  {this.state.reportingSortingItem
                    ? this.state.reportingSortingItem.quantity
                    : ""}
                </Col>
              </Row>
              <form onSubmit={this.props.handleSubmit(this.reportSubmit)}>
                <Row className="mr-t-10 mr-b-10 nflex-row">
                  <Col
                    xs={12}
                    md={6}
                    lg={5}
                    sm={6}
                    className="mr-b-10 color-grey pd-0"
                  >
                    <div className="border-none pd-0">
                      Quantity to report<span className="must">*</span>
                    </div>
                  </Col>
                  <Col xs={12} md={6} lg={6} sm={6} className="border-none pd-0">
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

Sorting = reduxForm({
  form: RECEIVING_FORM, // a unique identifier for this form
})(Sorting);
export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
