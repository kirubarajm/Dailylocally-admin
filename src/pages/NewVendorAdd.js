import React from "react";
import { connect } from "react-redux";
import { VENDOR_REGISTER } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import { Button } from "reactstrap";
import { required, requiredTrim,email } from "../utils/Validation";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import {
  ADD_VENDOR,
  EDIT_VENDOR,
  ADDCLEAR_VENDOR,
} from "../constants/actionTypes";
import { getAdminId } from "../utils/ConstantFunction";
const mapStateToProps = (state) => ({
  ...state.newvendor,
  zoneItem: state.catalog.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onAddVentorDetails: (data) =>
    dispatch({
      type: ADD_VENDOR,
      payload: AxiosRequest.Vendor.addVendor(data),
    }),
  onEditVentorDetails: (data) =>
    dispatch({
      type: EDIT_VENDOR,
      payload: AxiosRequest.Vendor.editVendor(data),
    }),
  onClear: () =>
    dispatch({
      type: ADDCLEAR_VENDOR,
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
    <div className="flex-row mr-b-10">
      <label hidden={!label} className="width-150 mr-0 border-none">
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div className="border-none">
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        <div
          style={{
            flex: "0",
            WebkitFlex: "0",
            height: "10px",
            fontSize: "12px",
            color: "red",
          }}
        >
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
      </div>
    </div>
  );
};

class NewVendorAdd extends React.Component {
  UNSAFE_componentWillMount() {
    this.updateVendor = this.updateVendor.bind(this);
    this.setState({
      addVendorItem: [],
      today: Moment(new Date()),
      expiry_date: false,
    });
    if(this.props.isEdit){
      var initData = {
        vendor_name: this.props.selectVendor.name,
        phone_no: this.props.selectVendor.phoneno,
        address: this.props.selectVendor.address,
        email: this.props.selectVendor.email,
        pan: this.props.selectVendor.pan,
        fssai: this.props.selectVendor.fssai,
        gst_no: this.props.selectVendor.gst,
      };
      this.props.initialize(initData);
    }
    
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isVendorUpdate) {
      this.props.onClear();
      this.props.update();
    }
  }
  componentDidCatch() {}
  updateVendor = (fdata) => {
    var data = {};
    data.name = fdata.vendor_name;
    data.phoneno = fdata.phone_no;
    data.address = fdata.address;
    data.email = fdata.email;
    data.pan = fdata.pan;
    data.fssai = fdata.fssai;
    data.gst = fdata.gst_no;
    data.done_by = getAdminId();
    data.zoneid = this.props.zoneItem.id;
    if (this.props.isEdit) {
      data.vid=this.props.selectVendor.vid;
      this.props.onEditVentorDetails(data);
    } else {
      this.props.onAddVentorDetails(data);
    }
  };

  render() {
    return (
      <div>
        <div className="fieldset">
          <div className="legend" style={{ width: "100px" }}>
            {this.props.isEdit ? "Edit Vendor" : "Add Vendor"}
          </div>
          <form onSubmit={this.props.handleSubmit(this.updateVendor)}>
            <div className="flex-column">
              <Field
                name="vendor_name"
                autoComplete="off"
                type="name"
                component={InputField}
                label="Vendor Name"
                validate={[required,requiredTrim]}
                required={true}
              />

              <Field
                name="phone_no"
                autoComplete="off"
                type="name"
                component={InputField}
                label="Phone no"
                validate={[required]}
                required={true}
              />

              <Field
                name="address"
                autoComplete="off"
                type="name"
                component={InputField}
                label="Address"
                validate={[required,requiredTrim]}
                required={true}
              />

              <Field
                name="email"
                autoComplete="off"
                type="email"
                component={InputField}
                label="Email"
                validate={[required,requiredTrim,email]}
                required={true}
              />

              <Field
                name="gst_no"
                autoComplete="off"
                type="name"
                component={InputField}
                label="GST No"
                validate={[required,requiredTrim]}
                required={true}
              />
              <Field
                name="pan"
                autoComplete="off"
                type="name"
                component={InputField}
                label="PAN"
                validate={[required,requiredTrim]}
                required={true}
              />

              <Field
                name="fssai"
                autoComplete="off"
                type="name"
                component={InputField}
                label="FSSAI"
                validate={[required,requiredTrim]}
                required={true}
              />
            </div>
            <div className="float-right">
              <Button size="sm">Submit</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
NewVendorAdd = reduxForm({
  form: VENDOR_REGISTER, // a unique identifier for this form
})(NewVendorAdd);
export default connect(mapStateToProps, mapDispatchToProps)(NewVendorAdd);
