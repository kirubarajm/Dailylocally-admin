import React from "react";
import { connect } from "react-redux";
import { VENDOR_EDIT } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import { Button } from "reactstrap";
import { required } from "../utils/Validation";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import Select from "react-dropdown-select";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  ADD_PRODUCT_VENDOR,
  CLEAR_PRODUCT_VENDOR,
} from "../constants/actionTypes";
const mapStateToProps = (state) => ({ ...state.vendoredit });

const mapDispatchToProps = (dispatch) => ({
  onEditVentorDetails: (data) =>
    dispatch({
      type: ADD_PRODUCT_VENDOR,
      payload: AxiosRequest.Catelog.onAddVendor(data),
    }),
  onClear: () =>
    dispatch({
      type: CLEAR_PRODUCT_VENDOR,
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
    <div
      className="border-none"
      style={{ marginBottom: "10px", display: "flex", flexDirection: "row" }}
    >
      <div className="mr-0 width-150 border-none">
        <label className="mr-0 width-150">
          {label} <span className="must">*</span>
        </label>
      </div>
      <div
        className="mr-r-10 mr-l-10"
        style={{
          border: "1px solid #000",
          height: "auto",
          width: "210px",
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
          dropdownHeight={"200px"}
          disabled={disabled}
          onChange={(value) => {
            onSelection(value);
          }}
        />
      </div>
    </div>
  );
};

class VendorAdd extends React.Component {
  UNSAFE_componentWillMount() {
    this.updateVendor = this.updateVendor.bind(this);
    this.dateSelect = this.dateSelect.bind(this);
    this.selectedVendorList = this.selectedVendorList.bind(this);
    this.setState({
      addVendorItem: [],
      today: Moment(new Date()),
      expiry_date: false,
    });
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
  dateSelect = (event, picker) => {
    var expdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ expiry_date: expdate });
  };
  componentDidCatch() {}
  selectedVendorList = (item) => {
    this.setState({ addVendorItem: item });
  };
  updateVendor = (fdata) => {
    var data = {};
    if (this.state.addVendorItem.length > 0) {
      data.vid = this.state.addVendorItem[0].vid;
    } else {
      notify.show(
        "Please select the vendor after try this",
        "custom",
        3000,
        notification_color
      );
      return;
    }
    if (this.state.expiry_date) {
      data.expiry_date = this.state.expiry_date;
    } else {
      notify.show(
        "Please select the expiry date after try this",
        "custom",
        3000,
        notification_color
      );
      return;
    }
    if (this.props.pid) {
      data.price_agreement_approval = 1;
      data.pid = this.props.pid;
      data.base_price = fdata.base_price;
      data.other_charges = fdata.other_charges;
      this.props.onEditVentorDetails(data);
    }
  };

  render() {
    return (
      <div>
        <div className="fieldset">
          <div className="legend" style={{ width: "100px" }}>
            Add Vendor
          </div>
          <form onSubmit={this.props.handleSubmit(this.updateVendor)}>
            <div className="flex-column">
              <Field
                name="vendor"
                component={InputSearchDropDown}
                options={this.props.VendorList}
                labelField="name"
                searchable={true}
                clearable={true}
                searchBy="name"
                valueField="vid"
                noDataLabel="No matches found"
                values={this.state.addVendorItem}
                onSelection={this.selectedVendorList}
                label="Vendor"
              />
              <div className="border-none mr-b-10 flex-row">
                <label className="width-150 mr-0 border-none">
                  Exp Date
                  <span className="must">*</span>
                </label>
                <div className="mr-r-10 mr-l-10">
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    minDate={this.state.today}
                    drops="down"
                    onApply={this.dateSelect}
                  >
                    <Button
                      className="mr-r-10"
                      style={{
                        width: "30px",
                        height: "30px",
                        padding: "0px",
                      }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                    {this.state.expiry_date}
                  </DateRangePicker>
                </div>
              </div>

              <Field
                name="base_price"
                autoComplete="off"
                type="number"
                component={InputField}
                label="Base price"
                validate={[required]}
                required={true}
              />

              <Field
                name="other_charges"
                autoComplete="off"
                type="number"
                component={InputField}
                label="Other charges(%)"
                validate={[required]}
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
VendorAdd = reduxForm({
  form: VENDOR_EDIT, // a unique identifier for this form
})(VendorAdd);
export default connect(mapStateToProps, mapDispatchToProps)(VendorAdd);
