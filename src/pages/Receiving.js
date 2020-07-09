import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "reactstrap";
import Select from "react-dropdown-select";
import {
  RECEIVING_LIST,
  RECEIVING_UPDATE,
  RECEIVING_CLEAR,
  ZONE_ITEM_REFRESH,
  UNRECEIVING_UPDATE,
  MOVE_TO_SORTING,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { Field, reduxForm, reset } from "redux-form";
import { required } from "../utils/Validation";
import { RECEIVING_FORM } from "../utils/constant";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Search from "../components/Search";
import Searchnew from "../components/Searchnew";
import SearchItem from "../components/SearchItem";
import { store } from "../store";

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
    <Row className="pd-0">
      <div
        className="border-none"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className="mr-0 border-none pd-0"
          style={{
            height: "auto",
            width: "175px",
          }}
        >
          <label className="mr-0 color-grey">
            {label} <span className="must">*</span>
          </label>
        </div>
        <div
          className="mr-0"
          style={{
            border: "1px solid #000",
            height: "auto",
            width: "210px",
            marginLeft: "-6px",
            marginRight: "12px",
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
        </div>
      </div>
    </Row>
  );
};

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
  ...state.receiving,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetReceivingList: (data) =>
    dispatch({
      type: RECEIVING_LIST,
      payload: AxiosRequest.Warehouse.getReceivingList(data),
    }),
  onUpdateList: (data) =>
    dispatch({
      type: RECEIVING_UPDATE,
      payload: AxiosRequest.Warehouse.updateReceiving(data),
    }),
  onUpdateUnRecevie: (data) =>
    dispatch({
      type: UNRECEIVING_UPDATE,
      payload: AxiosRequest.Warehouse.updateUNReceiving(data),
    }),
  onItemMovetoSorting: (data) =>
    dispatch({
      type: MOVE_TO_SORTING,
      payload: AxiosRequest.Warehouse.movetoSorting(data),
    }),
  onClear: () =>
    dispatch({
      type: RECEIVING_CLEAR,
    }),
  onFromClear: () => dispatch(reset(RECEIVING_FORM)),
});

class Receiving extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      poid_refresh: false,
      recevingModal: false,
      receivingSelection: [],
      selectedItem: false,
      search_refresh: false,
      pono: false,
      supplier_name: false,
      item_name: false,
      po_createdate: false,
      isConfrimModal: false,
      today: Moment(new Date()),
    };
  }

  UNSAFE_componentWillMount() {
    this.onReceivingList = this.onReceivingList.bind(this);
    this.onReceivingModal = this.onReceivingModal.bind(this);
    this.selectedReceiving = this.selectedReceiving.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onSortingClick = this.onSortingClick.bind(this);
    this.submit = this.submit.bind(this);
    this.pocreateDate = this.pocreateDate.bind(this);
    this.onSearchPOno = this.onSearchPOno.bind(this);
    this.onSearchSupplier = this.onSearchSupplier.bind(this);
    this.onSearchItem = this.onSearchItem.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.toggleConfirmPopup = this.toggleConfirmPopup.bind(this);
    this.onReceivingList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.receving_update) {
      this.props.onClear();
      this.onReceivingModal();
      this.setState({ isLoading: false });
    }

    if (this.props.sorting_update) {
      this.props.onClear();
      this.setState({ isLoading: false });
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    this.onReceivingList();
  }
  componentDidCatch() {}

  onReceivingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zone_id: this.props.zoneItem.id,
      };
      if (this.state.po_createdate) data.date = this.state.po_createdate;
      if (this.state.supplier_name) data.vid = this.state.supplier_name;
      if (this.state.item_name) data.vpid = this.state.item_name;
      if (this.state.pono) data.poid = this.state.pono;

      this.props.onGetReceivingList(data);
    }
  };
  toggleConfirmPopup = () => {
    this.setState({
      isConfrimModal: !this.state.isConfrimModal,
    });
  };
  confirmTo = () => {
    var dData = {};
    dData.zone_id = this.props.zoneItem.id;
    dData.popid = this.state.selectedItem.popid;
    this.props.onItemMovetoSorting(dData);
    this.toggleConfirmPopup();
  };

  onActionClick = (item) => (ev) => {
    this.props.onFromClear();
    this.setState({ selectedItem: item, receivingSelection: [] });
    this.onReceivingModal();
  };
  onSortingClick = (item) => (ev) => {
    this.setState({ selectedItem: item });
    this.toggleConfirmPopup();
  };
  selectedReceiving = (item) => {
    this.setState({ receivingSelection: item });
  };

  onSearchPOno = (e) => {
    const value = e.target.value || "";
    this.setState({ pono: value });
    if (e.keyCode === 13 && e.shiftKey === false || value==="") {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };
  onSearchSupplier = (e) => {
    const value = e.target.value || "";
    this.setState({ supplier_name: value });
    if (e.keyCode === 13 && e.shiftKey === false || value==="") {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };

  onSearchItem = (e) => {
    const value = e.target.value || "";
    this.setState({ item_name: value });
    if (e.keyCode === 13 && e.shiftKey === false || value==="") {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };
  onReceivingModal = () => {
    this.setState((prevState) => ({
      recevingModal: !prevState.recevingModal,
    }));
  };
  submit = (data) => {
    var data1 = {
      zone_id: this.props.zoneItem.id,
      popid: this.state.selectedItem.popid,
    };
      data1.vpid = this.state.selectedItem.vpid;
      data1.quantity = data.item_quantity;
      data1.delivery_note = data.delivery_note ||"";
    if (
      this.state.receivingSelection.length > 0 &&
      this.state.receivingSelection[0].id === 1
    ) {
      this.props.onUpdateList(data1);
    } else if (
      this.state.receivingSelection.length > 0 &&
      this.state.receivingSelection[0].id === 2
    ) {
      this.props.onUpdateUnRecevie(data1);
    }
  };

  pocreateDate = (event, picker) => {
    var po_createdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ po_createdate: po_createdate });
  };

  onSearch = () => {
    this.setState({ isLoading: false });
  };

  onReset = () => {
    this.setState({
      po_createdate: false,
      pono: "",
      supplier_name: "",
      item_name: "",
      search_refresh: true,
    });
    var data = {
      zone_id: this.props.zoneItem.id,
    };
    this.props.onGetReceivingList(data);
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };
  render() {
    const recevingList = this.props.recevingList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">PO search Criteri</div>
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
                  <div className="mr-r-10 width-120">Date: </div>
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
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

              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    Product Name/Code :{" "}
                  </div>
                  <SearchItem
                    onSearch={this.onSearchItem}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.search_refresh}
                  />
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
          {/* className="search-horizantal-scroll" style={{ width: "1400px" }}*/}
            <div >
              <div className="search-vscroll">
                <Table >
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>PO No - Supplier name</th>
                      <th>UOM</th>
                      <th>BOH</th>
                      <th>PO quantity</th>
                      <th>received quantity</th>
                      <th>Receive/Unreceive</th>
                      <th>Standby count</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {recevingList.map((item, i) => (
                      <tr key={i}>
                        <td>{Moment(item.created_at).format("DD-MMM-YYYY")}</td>
                        <td>{item.vpid}</td>
                        <td>{item.productname}</td>
                        <td>
                          PO#{item.poid} - {item.name}
                        </td>
                        <td>{item.uom}</td>
                        <td>{item.boh}</td>
                        <td>{item.total_quantity}</td>
                        <td>{item.received_quantity}</td>
                        <td>
                          <Button
                            className="btn-custom"
                            disabled={item.received_quantity !== 0}
                            onClick={this.onActionClick(item)}
                          >
                            Action
                          </Button>
                        </td>
                        <td>
                          <div className="flex-row">
                          <div hidden={item.stand_by === 0}>{item.stand_by}</div>
                          <Button
                            size="sm"
                            className="btn-custom mr-l-10"
                            disabled={item.stand_by === 0}
                            onClick={this.onSortingClick(item)}
                          >
                            Push to Sort
                          </Button>
                          </div>
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
          toggle={this.onReceivingModal}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.onReceivingModal}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend">Receiving/Unreceiving</div>
              <div className="mr-r-20 mr-l-20">
                <form onSubmit={this.props.handleSubmit(this.submit)}>
                  <Row className="pd-0">
                    <Col lg="5" className="color-grey pd-0">
                      <div className="border-none pd-0">Product name</div>
                    </Col>
                    <Col lg="7" className="mr-l-10">
                      {this.state.selectedItem.productname}
                    </Col>
                  </Row>
                  <Field
                    name="ac_id"
                    component={InputSearchDropDown}
                    options={
                      this.state.selectedItem.pop_status === 1
                        ? this.props.unreceivingAction
                        : this.props.receivingAction
                    }
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.receivingSelection}
                    onSelection={this.selectedReceiving}
                    label="Select Action"
                  />
                  
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Row
                        className="pd-0"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "3px",
                        }}
                      >
                        <Col lg="5" className="color-grey pd-0 border-none">
                          <div className="border-none">
                            Quantity<span className="must">*</span>
                          </div>
                        </Col>
                        <Col lg="7" className="border-none">
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
                      <Row
                        className="pd-0"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          marginLeft: "3px",
                        }}
                      >
                        <Col lg="5" className="color-grey pd-0 border-none">
                          <div className="border-none">Delivery Note</div>
                        </Col>
                        <Col lg="7" className="border-none">
                          <Field
                            name="delivery_note"
                            autoComplete="off"
                            type="text"
                            component={InputField}
                          />
                        </Col>
                      </Row>
                    </div>
                  <Row className="pd-10">
                    <Col className="txt-align-right">
                      <Button color="secondary">Submit</Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
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
            Are you sure you want to move to sorting
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
Receiving = reduxForm({
  form: RECEIVING_FORM, // a unique identifier for this form
})(Receiving);
export default connect(mapStateToProps, mapDispatchToProps)(Receiving);
