import React from "react";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";
import {
  MOBILE_OTP_VERIFY,
  MOBILE_OTP_SEND,
  MOBILE_OTP_CLEAR
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import { Button } from "reactstrap";
import { reset } from "redux-form";
import { required, maxLength6, number } from "../utils/Validation";
import { MOBILE_NUMBER_VERIFY } from "../utils/constant";

const mapStateToProps = state => ({ ...state.mobileverify });

const mapDispatchToProps = dispatch => ({
  onOTPSend: (data, roleType) =>
    dispatch({
      type: MOBILE_OTP_SEND,
      payload: AxiosRequest.MobileNumberVerify.MobileOtpSend(data, roleType)
    }),
  onOTPVerify: (otpdata, roleType) =>
    dispatch({
      type: MOBILE_OTP_VERIFY,
      payload: AxiosRequest.MobileNumberVerify.MobileOtpVerify(otpdata, roleType)
    }),
  onFromClear: () => dispatch(reset(MOBILE_NUMBER_VERIFY)),
  onClear: () => dispatch({ type: MOBILE_OTP_CLEAR })
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
    <div>
      <label>
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
          onWheel={event => {
            event.preventDefault();
          }}
          style={{ width: "250px" }}
        />
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

var mobilenumber, roleType;
class MobileVerifyForm extends React.Component {
  UNSAFE_componentWillMount() {
    mobilenumber = this.props.mobilenumber;
    roleType = this.props.roleType;
    this.submitMobile = this.submitMobile.bind(this);
    this.props.onOTPSend({ phoneno: mobilenumber }, roleType);
  }
  componentDidUpdate(nextProps, nextState) {
    if (this.props.otp_status) {
      this.props.onFromClear();
      this.props.onClear();
      this.props.update(true);
    }else if(!this.props.otp_send_status){
      this.props.onClear();
      this.props.update(false);
    }
  }

  submitMobile = values => {
    var data = {
      phoneno: mobilenumber,
      otp: values.OTP,
      oid: this.props.Otp_id
    };
    console.log("values-->", data);
    this.props.onOTPVerify(data,roleType);
  };

  render() {
    const pristine = this.props.pristine;
    const submitting = this.props.submitting;
    const handleSubmit = this.props.handleSubmit;
    return (
      <form onSubmit={handleSubmit(this.submitMobile)}>
        <Field
          name="OTP"
          type="number"
          component={InputField}
          label="Enter your otp"
          validate={[required, number, maxLength6]}
        />
        <div className="float-right">
          <Button type="submit" disabled={pristine || submitting}>
            Verify
          </Button>
          <Button
            type="button"
            disabled={pristine || submitting}
            onClick={this.props.onFromClear}
            className="mr-l-10"
          >
            Clear
          </Button>
        </div>
      </form>
    );
  }
}

// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
MobileVerifyForm = reduxForm({
  form: MOBILE_NUMBER_VERIFY // a unique identifier for this form
})(MobileVerifyForm);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobileVerifyForm);
