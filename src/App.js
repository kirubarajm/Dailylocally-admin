import React from "react";
import "./App.css";
import EmptyLayout from "./components/EmptyLayout";
import "./styles/reduction.css";
import { Switch, withRouter, Redirect } from "react-router-dom";
import LayoutRoute from "./components/LayoutRoute";
import Signup from "./pages/Signup";
import { connect } from "react-redux";
import { loadProgressBar } from "axios-progress-bar";
import Notifications from "react-notify-toast";
const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => ({});
class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    loadProgressBar();
  }
  componentWillMount() {}

  render() {
    return (
      <div>
        <Notifications options={{ zIndex: 1052, top: "0px" }} />
        <Switch>
          <LayoutRoute
            exact
            path="/login"
            layout={EmptyLayout}
            component={Signup}
          />
          <Redirect to="/login" />
        </Switch>
      </div>
    );
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
