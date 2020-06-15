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
} from "reactstrap";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import {
  PR_VENDOR_ASSIGN_LIST,
  GET_VENDOR_LIST,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color, VENDOR_ASSIGN } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import Select from "react-dropdown-select";

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
    <div className="border-none" style={{ marginBottom: "10px" }}>
      <Row className="mr-0">
        <Col className="pd-0" >
          <label className="mr-0">
            {label} <span className="must">*</span>
          </label>
        </Col>
        <Col>
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

class VendorAssign extends React.Component {
  constructor() {
    super();
    this.state = {
      selected_proid: false,
      isLoading: false,
      isaddvendor: false,
      suplier: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.onGetPoWaitngList = this.onGetPoWaitngList.bind(this);
    this.onAddVendor = this.onAddVendor.bind(this);
    this.toggleAddVendorPopUp = this.toggleAddVendorPopUp.bind(this);
    this.selectedSuplier = this.selectedSuplier.bind(this);
    this.onGetPoWaitngList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetPoWaitngList();
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

  selectedSuplier = (item) => {
    this.setState({ suplier: item });
  };

  onAddVendor = () => {
    var checkItem = this.state.selected_proid;
    var Values = Object.keys(checkItem);
    if (Values.length > 0) {
      this.props.onGetVendorList({
        zone_id: 1,
        products: Values,
      });
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
  submit = (values) => {};

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
              <div className="search-vscroll">
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
            Add- Vendor
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
            </form>
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleAddVendorPopUp}>
              Cancel
            </Button>
            <Button size="sm" onClick={this.confirmToprocurment}>
              ADD
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
