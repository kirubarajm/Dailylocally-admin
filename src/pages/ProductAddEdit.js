import React from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import AxiosRequest from "../AxiosRequest";
import { PRODUCT_VIEW,UOM_LIST_VIEW } from "../constants/actionTypes";
import { PRODUCT_ADD_EDIT } from "../utils/constant";
import { Field, reduxForm, change } from "redux-form";
import renderInputField from "../components/renderInputField";
import { required, minLength2 } from "../utils/Validation";
import Select from "react-dropdown-select";

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
        <Col lg="5" className="pd-0">
          <label className="mr-0">
            {label} <span className="must">*</span>
          </label>
        </Col>
        <Col
          className="pd-0"
          style={{
            border: "1px solid #000",
            height: "30px",
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
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({ ...state.productaddedit });

const mapDispatchToProps = (dispatch) => ({
  onGetProduct: (data) =>
    dispatch({
      type: PRODUCT_VIEW,
      payload: AxiosRequest.Catelog.getProductDetail(data),
    }),
    onGetUOM: (data) =>
    dispatch({
      type: UOM_LIST_VIEW,
      payload: AxiosRequest.Catelog.getUOMList(data),
    }),
    onGetZone: (data) =>
    dispatch({
      type: UOM_LIST_VIEW,
      payload: AxiosRequest.Catelog.getZoneList(data),
    }),
    onGetBrand: (data) =>
    dispatch({
      type: UOM_LIST_VIEW,
      payload: AxiosRequest.Catelog.getBrandList(data),
    }),
});

class ProductAddEdit extends React.Component {
  constructor() {
    super();
    this.state = { uom: [],brand:[],zone:[] };
  }

  UNSAFE_componentWillMount() {
    var productIds = this.props.match.params.product_id;
    // this.props.onGetProduct({ product_id: productIds });
    this.props.onGetUOM({})
    this.props.onGetBrand({})
    this.submit = this.submit.bind(this);
    this.selectedUOM = this.selectedUOM.bind(this);
    this.selectedBrand=this.selectedBrand.bind(this);
    this.selectedZone=this.selectedZone.bind(this);
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}
  submit = (data) => {};
  selectedUOM = (data) => {};
  selectedBrand = (data) => {};
  selectedZone = (data) => {};
  render() {
    const productdetail = this.props.productdetail || false;
    //const vendorlist = this.props.productdetail.vendorlist || [];
    return (
      <div>
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Product Edit</div>
            <div>
              <form onSubmit={this.props.handleSubmit(this.submit)}>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="4">
                    <Field
                      name="productname"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Name"
                      validate={[required, minLength2]}
                      required={true}
                    />
                    <Field
                      name="pid"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Code"
                    />
                    <Field
                      name="weight"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Weight (kg)"
                      validate={[required]}
                      required={true}
                    />
                    {/* <Field
                      name="uom"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="UOM"
                      validate={[required]}
                      required={true}
                    /> */}

                    <Field
                      name="uom"
                      component={InputSearchDropDown}
                      options={this.props.UOMList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="uomid"
                      noDataLabel="No matches found"
                      values={this.state.uom}
                      onSelection={this.selectedUOM}
                      label="UOM"
                    />

                    <Field
                      name="packetsize"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="Packet Size"
                      validate={[required]}
                      required={true}
                    />
                  </Col>

                  <Col lg="4">
                  <Field
                      name="brand"
                      component={InputSearchDropDown}
                      options={this.props.BrandList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="uomid"
                      noDataLabel="No matches found"
                      values={this.state.brand}
                      onSelection={this.selectedBrand}
                      label="Brand"
                    />
                    <Field
                      name="short_desc"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Code"
                    />
                    <Field
                      name="productdetails"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Weight (kg)"
                      validate={[required]}
                      required={true}
                    />
                    <Field
                      name="uom"
                      component={InputSearchDropDown}
                      options={this.props.UOMList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="uomid"
                      noDataLabel="No matches found"
                      values={this.state.uom}
                      onSelection={this.selectedUOM}
                      label="UOM"
                    />
                    <Field
                      name="hsn_code"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Weight (kg)"
                      validate={[required]}
                      required={true}
                    />

<Field
                      name="tag"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Weight (kg)"
                      validate={[required]}
                      required={true}
                    />

<Field
                      name="Perishable"
                      component={InputSearchDropDown}
                      options={this.props.UOMList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="uomid"
                      noDataLabel="No matches found"
                      values={this.state.uom}
                      onSelection={this.selectedUOM}
                      label="UOM"
                    />


<Field
                      name="vegtype"
                      component={InputSearchDropDown}
                      options={this.props.UOMList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="uomid"
                      noDataLabel="No matches found"
                      values={this.state.uom}
                      onSelection={this.selectedUOM}
                      label="UOM"
                    />

                    <Field
                      name="basiccost"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="Packet Size"
                      validate={[required]}
                      required={true}
                    />
                  </Col>

                  <Col lg="4">
                    <Field
                      name="mrp"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Name"
                      validate={[required, minLength2]}
                      required={true}
                    />
                    <Field
                      name="gst"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Code"
                    />
                    <Field
                      name="discount_cost"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Weight (kg)"
                      validate={[required]}
                      required={true}
                    />
                  </Col>
                </Row>
                <Row className="mr-b-10">
                  <Col lg="10"></Col>

                  <Col className="txt-align-right">
                    <Button size="sm">Submit</Button>
                  </Col>
                  <Col className="txt-align-right">
                    <Button size="sm" className="mr-l-10 mr-r-10">
                      Back
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProductAddEdit = reduxForm({
  form: PRODUCT_ADD_EDIT, // a unique identifier for this form
})(ProductAddEdit);
export default connect(mapStateToProps, mapDispatchToProps)(ProductAddEdit);
