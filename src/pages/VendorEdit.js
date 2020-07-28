import React from "react";
import { connect } from "react-redux";
import { VENDOR_EDIT } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import { Row, Col, Button } from "reactstrap";
import { required } from "../utils/Validation";
import AxiosRequest from "../AxiosRequest";
import { EDIT_PRODUCT_VENDOR, CLEAR_PRODUCT_VENDOR } from "../constants/actionTypes";
import { getAdminId } from "../utils/ConstantFunction";
const mapStateToProps = (state) => ({ ...state.vendoredit,
  zoneItem: state.catalog.zoneItem });

const mapDispatchToProps = (dispatch) => ({
  onEditVentorDetails: (data) =>
    dispatch({
      type: EDIT_PRODUCT_VENDOR,
      payload: AxiosRequest.Catelog.onEditVendor(data),
    }),
    onClear: () =>
    dispatch({
      type: CLEAR_PRODUCT_VENDOR
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

function CardRowColVendorEdit(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item font-size-14">
        <Col lg="5" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="5" style={{ color: color }} className="pd-l-0">
          <Field
            name={props.fname}
            autoComplete="off"
            type="text"
            label={""}
            value={props.value}
            disabled={props.disabled}
            component={InputField}
            validate={props.required ? [required] : []}
            required={props.required}
          />
        </Col>
      </Row>
    );
  }

  return <div />;
}

class VendorEdit extends React.Component {
  
  UNSAFE_componentWillMount() {
    this.updateVendor = this.updateVendor.bind(this);
    this.setState({ selectedVendor: this.props.vendor });
    var initData = {
      base_price: this.props.vendor.base_price,
      cost_price: this.props.vendor.cost_price,
      other_charges: this.props.vendor.other_charges,
    };
    this.props.initialize(initData);
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if(this.props.isVendorUpdate){
      this.props.onClear();
      this.props.update();
    }
  }
  componentDidCatch() {}
  updateVendor = (fdata) => {
    var data={}
    console.log("data-->", fdata);
    var vendor =this.props.vendor;
    console.log("vendor-->", vendor);
    if(this.props.pid){
      data.vpmid=vendor.vpmid;
      data.pid=this.props.pid;
      data.vid=vendor.vendorid;
      data.base_price= fdata.base_price;
      data.other_charges= fdata.other_charges;
      data.done_by=getAdminId();
      data.zoneid=this.props.zoneItem.id
      this.props.onEditVentorDetails(data);
    }
    //this.state.onEditVentorDetails();
  };

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.updateVendor)}>
          <CardRowColVendorEdit
            lable="Base Price"
            value={this.state.selectedVendor.base_price || "-"}
            fname="base_price"
            required={true}
          />
          {/* <CardRowColVendorEdit
            lable="Cost Price (Calculated field)"
            value={this.state.selectedVendor.cost_price || "-"}
            fname="cost_price"
            required={false}
            disabled={true}
          /> */}
          <CardRowColVendorEdit
            lable="Other charges (%)"
            value={this.state.selectedVendor.other_charges || "-"}
            fname="other_charges"
            required={true}
          />

          <div className="float-right">
            <Button type="submit" size="sm">
              Submit
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
VendorEdit = reduxForm({
  form: VENDOR_EDIT, // a unique identifier for this form
})(VendorEdit);
export default connect(mapStateToProps, mapDispatchToProps)(VendorEdit);
