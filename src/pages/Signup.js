import React from "react";
import { connect } from "react-redux";
import { Card, Button } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import { SIGN_UP_FORM } from "../utils/constant";
import renderInputField from "../components/renderInputField";
import { email, required } from "../utils/Validation";
import { LOGIN,HOME_REDIRECT, LOGIN_PAGE_UNLOADED} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (data) =>
  dispatch({ type: LOGIN,payload: AxiosRequest.Admin.login(data)}),
  onRedirect: (redirectTo) =>
  dispatch({ type: HOME_REDIRECT,redirectTo}),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED }),
});

class Signup extends React.Component {
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate() {
    this.submit = this.submit.bind(this);
  }
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {
    this.props.onUnload();
  }

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.loginsuccess&&this.props.isRedirect) {
      this.props.onRedirect('/dashboard');
    }
  }
  componentDidCatch() {}

  submit = (values) => {
    console.log("values---", values);
    const push_token = window.localStorage.getItem("push_token");
    if(push_token) values.push_token=push_token;
      console.log("push_token-->"+push_token);
    this.props.onSubmit(values);
  };
  render() {
    return (
      <div className="signup-bg">
        <Card className="signup-card">
          <form onSubmit={this.props.handleSubmit(this.submit)}>
            <Field
              name="email"
              type="eamil"
              component={renderInputField}
              placeholder="Email"
              validate={[required, email]}
              required={true}
            />
            <Field
              name="password"
              type="password"
              component={renderInputField}
              placeholder="Password"
              validate={[required]}
              required={true}
            />
            <Button type="submit" className="mr-r-10 float-right">
              Signin
            </Button>
          </form>
        </Card>
      </div>
    );
  }
}
Signup = reduxForm({
  form: SIGN_UP_FORM, // a unique identifier for this form
})(Signup);

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
