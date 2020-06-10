import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { store, history } from "./store";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
ReactDOM.render(
  <Provider store={store}>
    <Router history={history} basename="/d2admin/">
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </Provider>,

  document.getElementById("root")
);
