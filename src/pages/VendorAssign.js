import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import {
  PR_VENDOR_ASSIGN_LIST,
  GET_VENDOR_LIST,
  UPDATE_VENDOR_LIST,
  CREATE_PO,
  CLEAR_PO,
  WARE_HOUSE_SELECTED_TAB
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color, VENDOR_ASSIGN } from "../utils/constant";
import { Field, reduxForm, reset } from "redux-form";
import Select from "react-dropdown-select";
import { required, minLength2 } from "../utils/Validation";
import { store } from "../store";

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div>
      <label className="pd-0" style={{ minWidth: "180px" }}>
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div>
        {" "}
        <input
          {...input}
          placeholder={label}
          type={type}
          autoComplete="off"
          onWheel={(event) => {
            event.preventDefault();
          }}
          style={{ width: "192px" }}
        />
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ ...state.vendorassign });

const mapDispatchToProps = (dispatch) => ({
  onGetPrWatingList: (data) =>
    dispatch({
      type: PR_VENDOR_ASSIGN_LIST,
      payload: AxiosRequest.Warehouse.getPrWaitingList(data),
    }),
  onGetVendorList: (data) =>
    dispatch({
      type: GET_VENDOR_LIST,
      payload: AxiosRequest.Warehouse.getVendorList(data),
    }),
    onCreatePo: (data) =>
    dispatch({
      type: CREATE_PO,
      payload: AxiosRequest.Warehouse.createPoConfirm(data),
    }),
    onClear: () =>
    dispatch({
      type: CLEAR_PO
    }),
  onUpdateVendorList: (data) =>
    dispatch({
      type: UPDATE_VENDOR_LIST,
      data,
    }),
  onFromClear: () => dispatch(reset(VENDOR_ASSIGN)),
});

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
    <Row className="mr-0 border-none">
      <Col className="pd-0" lg="5">
        <label className="mr-0 border-none">
          {label} <span className="must">*</span>
        </label>
      </Col>
      <Col className="pd-0" lg="5">
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
  );
};

var today;

class VendorAssign extends React.Component {
  constructor() {
    super();
    this.state = {
      selected_proid: false,
      isLoading: false,
      isaddvendor: false,
      suplier: [],
      isconfirm: false,
      sPoList: [],
    };
  }

  UNSAFE_componentWillMount() {
    today = Moment().add(1, "days").format("YYYY-MM-DD");
    this.onGetPoWaitngList = this.onGetPoWaitngList.bind(this);
    this.onAddVendor = this.onAddVendor.bind(this);
    this.toggleAddVendorPopUp = this.toggleAddVendorPopUp.bind(this);
    this.toggleConfirmPopUp = this.toggleConfirmPopUp.bind(this);
    this.selectedSuplier = this.selectedSuplier.bind(this);
    this.startSelect = this.startSelect.bind(this);
    this.submitPo = this.submitPo.bind(this);
    this.createPo = this.createPo.bind(this);
    this.savePo = this.savePo.bind(this);
    this.confirmToAddVendor = this.confirmToAddVendor.bind(this);
    this.onGetPoWaitngList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetPoWaitngList();
    if(this.props.poCreated){
      this.props.onClear();
      this.props.history.push('/warehouse/po');
      store.dispatch({ type: WARE_HOUSE_SELECTED_TAB, tab_type: 2 });
    }
  }
  componentDidCatch() {}
  onGetPoWaitngList = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetPrWatingList({
        zone_id: 1,
      });
    }
  };
  toggleAddVendorPopUp = () => {
    this.setState({
      isaddvendor: !this.state.isaddvendor,
    });
  };
  toggleConfirmPopUp = () => {
    this.setState({
      isconfirm: !this.state.isconfirm,
    });
  };

  selectedSuplier = (item) => {
    this.setState({ suplier: item });
  };
  confirmToAddVendor = () => {};
  savePo = () => {};
  createPo = () => {
    var item = {
      zone_id: 1,
      polist: this.state.sPoList,
    };
    this.props.onCreatePo(item);
  };
  submitPo = () => {
    var poList = this.props.pocreatelist;
    var sPoList = [];
    //var isPoSelected = true;
    for (var i = 0; i < poList.length; i++) {
      if (poList[i].vendor_code) {
        var item = {
          prid: poList[i].prid,
          pid: poList[i].pid,
          vid: poList[i].vendor_code,
          qty: poList[i].quantity,
        };
        sPoList.push(item);
      } else {
       // isPoSelected = false;
      }
    }
    if (sPoList.length !== 0) {
      this.setState({ sPoList: sPoList });
      this.toggleConfirmPopUp();
    } else {
      notify.show(
        "Please add vendor after try again",
        "custom",
        3000,
        notification_color
      );
    }
  };

  onAddVendor = () => {
    var checkItem = this.state.selected_proid; //JSON.parse(JSON.stringify(this.state.selected_proid));
    //delete checkItem["selectall"];
    var Values = Object.keys(checkItem);
    console.log("Values-->", Values.length);
    if (Values.length > 0) {
      var indexof = Values.indexOf("selectall");
      if (indexof !== -1) Values.splice(indexof, 1);
      this.props.onGetVendorList({
        zone_id: 1,
        products: Values,
      });
      this.setState({ startdate: today, suplier: [] });
      this.props.onFromClear();
      this.toggleAddVendorPopUp();
    } else {
      notify.show(
        "Please select the Item after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };
  startSelect = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate });
  };
  submit = (values) => {
    console.log(values);
    var checkItem = this.state.selected_proid;
    var Values = Object.keys(checkItem);
    var data = {
      buyer_comment: values.buyer_comment,
      exp_date: this.state.startdate,
      suplier: this.state.suplier[0],
      pridList: Values,
    };
    this.props.onUpdateVendorList(data);
    this.toggleAddVendorPopUp();
    this.setState({
      selected_proid: [],
    });
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_proid || [];
    const pocreatelist = this.props.pocreatelist || [];
    if (name === "selectall") {
      if (value) {
        arvalue[name] = value;
        pocreatelist.map((item, i) => {
          arvalue[item.prid] = value;
        });
      } else {
        arvalue = {};
      }
    } else {
      if (value) {
        arvalue[name] = value;
        var allCheck = true;
        pocreatelist.map((item, i) => {
          if (!arvalue[item.prid]) {
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
      selected_proid: arvalue,
    });
  }
  render() {
    const pocreatelist = this.props.pocreatelist || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="pd-6">
            <Row>
              <Col lg="1">
                <div className="pd-6">
                  <div>
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name="selectall"
                        checked={this.state.selected_proid["selectall"]}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="font-size-12 mr-l-20">{" Select All "}</div>
                </div>
              </Col>
              <Col>
                <Button size="sm" onClick={this.onAddVendor}>
                  + Add Vendor Details
                </Button>
              </Col>
            </Row>
            <div className="search-horizantal-scroll">
              <div className="search-v-scroll">
                <Table style={{ width: "2000px" }}>
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Vendor details Edit</th>
                      <th>Delete</th>
                      <th>Category</th>
                      <th>L1 Sub category</th>
                      <th>L2 Sub category</th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Description</th>
                      <th>Supplier Name</th>
                      <th>Supplier code</th>
                      <th>UOM</th>
                      <th>Quantity</th>
                      <th>Rate</th>
                      <th>Expected Date/Time</th>
                      <th>Other charges</th>
                      <th>Amount</th>
                      <th>Buyer Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pocreatelist.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <label className="container-check">
                            <input
                              type="checkbox"
                              name={"" + item.prid}
                              checked={this.state.selected_proid[item.prid]}
                              onChange={(e) => this.handleChange(e)}
                            />
                            <span className="checkmark"></span>{" "}
                          </label>
                        </td>
                        <td>
                          <FaRegEdit
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <FaTrashAlt
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>{item.catagory_name}</td>
                        <td>{item.subcatL1name}</td>
                        <td>{item.subcatL2name || "-"}</td>
                        <td>{item.pid}</td>
                        <td>{item.Productname}</td>
                        <td>{item.productdetails || "-"}</td>
                        <td>{item.vendor_name || "-"}</td>
                        <td>{item.vendor_code || "-"}</td>
                        <td>{item.uom_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.rate || "-"}</td>
                        <td>
                          {Moment(item.exp_date).format(
                            "DD-MMM-YYYY/hh:mm a"
                          ) || "-"}
                        </td>
                        <td>{item.other_charges || "-"}</td>
                        <td>{item.amount || "-"}</td>
                        <td>{item.buyer_comment || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <div className="txt-align-right width-84 mr-b-10">
          <Button size="sm"  onClick={()=>this.props.history.goBack()}>
            Back
          </Button>
          <Button size="sm" className="mr-l-10" onClick={this.submitPo}>
            Submit
          </Button>
        </div>
        <Modal
          isOpen={this.state.isaddvendor}
          toggle={this.toggleAddVendorPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleAddVendorPopUp}
            className="pd-10 border-none"
          >
            Add-Vendor
          </ModalHeader>
          <ModalBody className="pd-10">
            <form
              onSubmit={this.props.handleSubmit(this.submit)}
              style={{ width: "30vw" }}
            >
              <Field
                name="vendor"
                component={InputSearchDropDown}
                options={this.props.vendor_list}
                labelField="name"
                searchable={true}
                clearable={true}
                searchBy="name"
                valueField="vid"
                noDataLabel="No matches found"
                values={this.state.suplier}
                onSelection={this.selectedSuplier}
                label="Suplier Name"
              />
              <Row>
                <Col className="pd-0" lg="5">
                  Due Date{" "}
                </Col>
                <Col className="pd-0" lg="5">
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    maxDate={today}
                    drops="down"
                    onApply={this.startSelect}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                    {this.state.startdate}
                  </DateRangePicker>
                </Col>
              </Row>
              <Field
                name="buyer_comment"
                autoComplete="off"
                type="text"
                component={InputField}
                label="Buyer Comment"
                validate={[required, minLength2]}
                required={true}
              />
              <div className="float-right">
                <Button size="sm" onClick={this.toggleAddVendorPopUp}>
                  Cancel
                </Button>
                <Button size="sm" className="mr-l-10">
                  ADD
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isconfirm}
          toggle={this.toggleConfirmPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleConfirmPopUp}
            className="pd-10 border-none"
          >
            Confrim
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to create the PO ?
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={this.toggleConfirmPopUp}>No</Button>
            <Button size="sm" onClick={this.createPo}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
VendorAssign = reduxForm({
  form: VENDOR_ASSIGN, // a unique identifier for this form
})(VendorAssign);

export default connect(mapStateToProps, mapDispatchToProps)(VendorAssign);
