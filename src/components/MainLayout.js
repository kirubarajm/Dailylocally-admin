import { Content, Header, Sidebar } from "../components";
import React from "react";
import { LOGOUT } from "../constants/actionTypes";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { getAdminId } from "../utils/ConstantFunction";
const mapStateToProps = (state) => ({ ...state });

const mapDispatchToProps = (dispatch) => ({
  onLogout: (data) =>
    dispatch({ type: LOGOUT, payload: AxiosRequest.Admin.logout(data) }),
});

class MainLayout extends React.Component {
  state = {
    isFirst: false,
  };
  static isSidebarOpen() {
    return document
      .querySelector(".cr-sidebar")
      .classList.contains("cr-sidebar--open");
  }

  UNSAFE_componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  getViewport() {
    const width = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    if (width <= 576) return "xs";
    if (width <= 768) return "sm";
    if (width <= 992) return "md";
    if (width <= 1200) return "lg";
    return "xl";
  }

  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);
  }

  UNSAFE_componentWillMount() {
    this.Logout = this.Logout.bind(this);
  }

  componentDidUpdate(nextProps, nextState) {
    if (!this.state.isFirst) {
      this.setState({ isFirst: true });
      const myWidth = this.getViewport();
      console.log("Size----------", myWidth);
      if (myWidth === "sm") {
        this.openSidebar("close");
      } else if (myWidth === "xs") {
        this.openSidebar("close");
      } else if (myWidth === "md") {
        this.openSidebar("close");
      } else if (myWidth === "lg") {
        this.openSidebar("close");
      } else if (myWidth === "xl") {
        this.openSidebar("open");
      }
    }
  }

  Logout = (event) => {
    var data = { admin_userid: getAdminId() };
    this.props.onLogout(data);
  };
  // close sidebar when
  handleContentClick = (event) => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (
      MainLayout.isSidebarOpen() &&
      (this.props.breakpoint === "xs" ||
        this.props.breakpoint === "sm" ||
        this.props.breakpoint === "md")
    ) {
      this.openSidebar("close");
    }
  };

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case "xs":
      case "sm":
      case "md":
        return this.openSidebar("close");

      case "lg":
      case "xl":
      default:
        return this.openSidebar("open");
    }
  }

  openSidebar(openOrClose) {
    if (openOrClose === "open") {
      return document
        .querySelector(".cr-sidebar")
        .classList.add("cr-sidebar--open");
    }
    document.querySelector(".cr-sidebar").classList.remove("cr-sidebar--open");
  }

  render() {
    const { children } = this.props;
    return (
      <main className="cr-app">
        <Sidebar />
        <Content fluid onClick={this.handleContentClick}>
          <Header onLogout={this.Logout} />
          <div className="App-content">{children}</div>
        </Content>
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);
