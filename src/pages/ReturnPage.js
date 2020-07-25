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
  RETURN_LIST,
  SORTING_SAVING_ITEM,
  RETURN_SORTING_ITEM,
  RETURN_SUBMIT_ITEM,
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

const mapStateToProps = (state) => ({
  ...state.returnpage,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetReturnList: (data) =>
    dispatch({
      type: RETURN_LIST,
      payload: AxiosRequest.Warehouse.getReturnList(data),
    }),
  onSaving: (data) =>
    dispatch({
      type: SORTING_SAVING_ITEM,
      payload: AxiosRequest.Warehouse.saveSorting(data),
    }),
  onSorting: (data) =>
    dispatch({
      type: RETURN_SORTING_ITEM,
      payload: AxiosRequest.Warehouse.movetoStoring(data),
    }),
  onSubmit: (data) =>
    dispatch({
      type: RETURN_SUBMIT_ITEM,
      payload: AxiosRequest.Warehouse.submitReturning(data),
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

class ReturnPage extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      search_refresh: false,
      sortingModal: false,

      isOpenReportDropDown: false,
      reportingItem: false,
      reportingSortingItem: false,
      sortingItem:false,
      reportingModal: false,
      recevingModal: false,

      selected_dopid: false,
      orderdate: false,
      orderid: "",
      selectedItem: { products: [] },
      today: Moment(new Date()),
    };
  }

  UNSAFE_componentWillMount() {
    this.onSortingList = this.onSortingList.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onSortingModal = this.onSortingModal.bind(this);
    this.onRecevingModal = this.onRecevingModal.bind(this);
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
      this.onRecevingModal();
      this.setState({ isLoading: false });
    }

    if (this.props.isReportSubmiting) {
      this.props.onClear();
      this.onReportingModal();
    }

    if (this.props.isSubmiting) {
      this.props.onClear();
      this.onRecevingModal();
      this.setState({ isLoading: false });
    }

    if (this.props.isReturning) {
      this.props.onClear();
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
    this.onRecevingModal();
  };

  clickReportingItem = (item) => (ev) => {
    this.setState({ reportingItem: item });
  };
  reportClick = (e, item, i) => {
    var sItem = this.state.selectedItem;
    var arvalue = sItem.products || [];
    arvalue[i].type = e.target.value;
    sItem.products = arvalue;
    this.setState({
      selectedItem: sItem,
    });
  };

  onSortingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.orderdate) data.date = this.state.orderdate;
      if (this.state.orderid) data.doid = this.state.orderid;
      this.props.onGetReturnList(data);
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
        done_by: 1,
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
      done_by: 1,
    };
    console.log("data-->", data);
    this.props.onReportSubmit(data);
  };
  onSortingSubmit = () => {
    var checkItem = this.state.selectedItem;
    var sItem = this.state.selectedItem;
    var arvalue = sItem.products || [];
    var isAllenter = true;
    var products = [];
    for (var i = 0; i < arvalue.length; i++) {
      if (arvalue[i].edit_quantity === undefined) {
        isAllenter = false;
      } else {
        products.push({
          dopid: arvalue[i].dopid,
          vpid: arvalue[i].vpid,
          quantity: arvalue[i].edit_quantity,
          type: arvalue[i].type || "1",
        });
      }
    }

    if (!isAllenter) {
      notify.show(
        "Please enter all received quantity after try this",
        "custom",
        3000,
        notification_color
      );
    } else {
      var data = {
        zoneid: this.props.zoneItem.id,
        done_by: 1,
        doid: this.state.selectedItem.doid,
        products: products,
      };
      console.log("datttt-->", data);
      this.props.onSubmit(data);
    }
  };

  handleChange(e, i) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var sItem = this.state.selectedItem;
    var arvalue = sItem.products || [];
    arvalue[i].edit_quantity = value;
    sItem.products = arvalue;
    this.setState({
      selectedItem: sItem,
    });
  }

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
    this.props.onGetReturnList(data);
  };

  onSearchOrderId = (e) => {
    const value = e.target.value || "";
    this.setState({ orderid: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };

  movetoSorting = (item) => {
    this.setState({sortingItem:item});
    this.onSortingModal();
  };
  confirmToSorting = () => {
    this.onSortingModal();
    this.props.onSorting({ zoneid: this.props.zoneItem.id, done_by: 1,doid:this.state.sortingItem.doid});
  };
  onRecevingModal = () => {
    this.setState((prevState) => ({
      recevingModal: !prevState.recevingModal,
    }));
  };
  render() {
    const sortingList = this.props.sortingList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Sorting / packing Search criteria</div>
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
                      <th>Order Date/Time</th>
                      <th>Return Date/Time</th>
                      <th>Order ID</th>
                      <th>Receive order</th>
                      <th>Sorting order</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortingList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>{item.doid}</td>
                        <td>
                          <Button size="sm" onClick={this.onActionClick(item)}>
                            Receive
                          </Button>
                        </td>
                        <td>
                          <Button size="sm" onClick={()=>this.movetoSorting(item)}>
                            Sorting
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
          isOpen={this.state.recevingModal}
          toggle={this.onRecevingModal}
          backdrop={"static"}
          className="max-width-800"
        >
          <ModalHeader toggle={this.onRecevingModal}></ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="width-200 pd-4">Order details</div>
              <div className="width-150 pd-4">Available</div>
              <div className="width-100 pd-4">Received</div>
              <div className="width-150 pd-4">Status of stock</div>
            </div>
            <hr />
            <div hidden={!this.state.selectedItem}>
              {this.state.selectedItem.products.map((item, i) => (
                <div style={{ display: "flex", flexDirection: "row" }} key={i}>
                  <div className="width-200 pd-4">
                    {item.product_name} - {item.quantity}
                  </div>
                  <div className="width-150 pd-4 mr-l-10">
                    {item.received_quantity}
                  </div>
                  <div className="width-100 pd-4">
                    <input
                      className="width-50"
                      type="number"
                      onChange={(e) => this.handleChange(e, i)}
                    ></input>
                  </div>
                  <div className="width-150 pd-4 mr-l-20">
                    <div className="width-150 pd-4">
                      <select onChange={(e) => this.reportClick(e, item, i)}>
                        <option value="1">Push to stock</option>
                        <option value="2">Push to wastage</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={this.onRecevingModal}>
              Close
            </Button>
            <Button size="sm" onClick={this.onSortingSubmit}>
              Receive
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.sortingModal}
          toggle={this.onSortingModal}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.onSortingModal}>Confirm</ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to move to sorting?
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.onSortingModal}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmToSorting}>
              YES
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ReturnPage = reduxForm({
  form: RECEIVING_FORM, // a unique identifier for this form
})(ReturnPage);
export default connect(mapStateToProps, mapDispatchToProps)(ReturnPage);
