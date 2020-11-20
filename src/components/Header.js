import React from "react";
import bn from "../utils/bemnames";
import sidebarBgImage from "../assets/img/sidebar/sidebar-14.png";
import { getLoginDetail } from "../utils/ConstantFunction";

import {
  Navbar,
  Col,
  Nav,
  NavItem,
  Button,
  Row,
  DropdownToggle,
  ButtonDropdown,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { MdClearAll } from "react-icons/md";
import {
  WARE_HOUSE_ZONE_SELECTED,
  ZONE_SELECT_ITEM,
} from "../constants/actionTypes";
import { store } from "../store";
import { connect } from "react-redux";

const bem = bn.create("header");
const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

var LoginName = null;
var LoginEmail = null;
var loginDetail = null;
const mapStateToProps = (state) => ({
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
  title: state.common.title,
});

const mapDispatchToProps = (dispatch) => ({
  OnZoneItemSelect: (item) =>
    dispatch({
      type: WARE_HOUSE_ZONE_SELECTED,
      item,
    }),
});
class Header extends React.Component {
  state = {
    isOpenNotificationPopover: false,
    isOpenAreaDropDown: false,
    areaItem: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
  };

  UNSAFE_componentWillMount() {
    loginDetail = getLoginDetail();
    if (loginDetail) {
      LoginName = loginDetail.logindetail.name;
      LoginEmail = loginDetail.logindetail.email;
    }
    if (this.props.zone_list.length > 0 && !this.state.areaItem) {
      this.clickArea(this.props.zone_list[0]);
    }
  }

  componentDidMount(){
    document.querySelector(".cr-sidebar").classList.toggle("cr-sidebar--close");
  }
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.state.areaItem) {
      this.clickArea(this.props.zone_list[0]);
    }
  }

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  toggleNotificationPopover = () => {
    this.setState({
      isOpenNotificationPopover: !this.state.isOpenNotificationPopover,
    });

    if (!this.state.isNotificationConfirmed) {
      this.setState({ isNotificationConfirmed: true });
    }
  };

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  handleSidebarControlButton = (event) => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector(".cr-sidebar").classList.toggle("cr-sidebar--open");
  };

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
    this.setState({ areaItem: item });
  };

  render() {
    return (
      <div
        className={bem.e("background App-nav-fixed")}
        style={sidebarBackground}
      >
        <Navbar className="cr-header-bg">
          <Nav navbar className="mr-2">
            <NavItem className="flex-row">
              <Button
                outline
                onClick={this.handleSidebarControlButton}
                className="text-white"
              >
                <MdClearAll size={25} />
              </Button>
              <div className="mr-l-10 mr-t-10 text-white d-xl-none d-md-none">{this.props.title}</div>
            </NavItem>
          </Nav>
          {/* <Nav navbar>
          <SearchInput />
        </Nav> */}
          <Nav navbar className={"nav-right"}>
            <NavItem className="mr-r-10 d-xl-none d-md-none">
              <div className="float-right">
                {/* <span className="mr-r-20 text-white">Zone</span> */}
                <ButtonDropdown
                  className="max-height-30"
                  isOpen={this.state.isOpenAreaDropDown}
                  toggle={this.toggleAreaDropDown}
                  size="sm"
                >
                  <DropdownToggle caret>
                    {this.props.zoneItem.Zonename || ""}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.zone_list.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.clickArea(item)}
                        key={index}
                      >
                        {item.Zonename}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
            </NavItem>
          </Nav>
          <Nav navbar className={"nav-right d-none d-sm-block d-md-block"}>
            <NavItem className="mr-r-10">
              <Row>
                <Col className="text-white font-size-14">
                  <div>{LoginName}</div>
                  <div>{LoginEmail}</div>
                </Col>
                <Col>
                  <Button
                    className="position-relative"
                    onClick={this.props.onLogout}
                    size="sm"
                  >
                    LOGOUT
                  </Button>
                </Col>
              </Row>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
//export default Header;
