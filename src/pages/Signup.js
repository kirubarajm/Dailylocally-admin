import React from "react";
import { connect } from "react-redux";
import { Card, Button } from "reactstrap";
import { Field, reduxForm } from "redux-form";
import { SIGN_UP_FORM } from "../utils/constant";
import renderInputField from "../components/renderInputField";
import { email, required } from "../utils/Validation";

const mapStateToProps = (state) => ({ ...state.auth });

const mapDispatchToProps = (dispatch) => ({});

class Signup extends React.Component {
  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate() {
    this.submit = this.submit.bind(this);
  }
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}

  submit = (values) => {
    console.log("values---", values);
    this.props.history.push("/dashboard");
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
