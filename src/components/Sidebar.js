import logo200Image from "../assets/img/logo/tovo_logo.png";
import sidebarBgImage from "../assets/img/sidebar/sidebar-14.png";
import SourceLink from "./SourceLink";
import React from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { NavLink } from "react-router-dom";
import {
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from "reactstrap";
import bn from "../utils/bemnames";
import { version } from "../../package.json";
import { SidebarSuperAdmin,navBarSuperAdminItems } from "../utils/SidebarSuperAdmin";
import { onActionHidden } from "../utils/ConstantFunction";
const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
};

var navItems = navBarSuperAdminItems;
const bem = bn.create("sidebar");

function NavItems(props) {
  if (props.submenu) {
    return (
      <div>
        <NavItem
          className={bem.e("nav-item")}
          onClick={props.handleClick(props.name)}
        >
          <BSNavLink className={bem.e("nav-item-collapse")}>
            <div className="d-flex">
              <props.Icon className={bem.e("nav-item-icon")} />
              <span className="text-uppercase align-self-start">
                {props.name}
              </span>
            </div>
            <MdKeyboardArrowDown
              className={bem.e("nav-item-icon")}
              style={{
                padding: 0,
                transform: props.state[`isOpen${props.name}`]
                  ? "rotate(0deg)"
                  : "rotate(-90deg)",
                transitionDuration: "0.3s",
                transitionProperty: "transform",
              }}
            />
          </BSNavLink>
        </NavItem>
        <Collapse isOpen={props.state[`isOpen${props.name}`]}>
          {props.submenuItem.map(({ to, name, exact, Icon }, index) => (
            <NavItem
              key={index}
              className={bem.e("nav-item")}
              onClick={props.handleColClick(props.name)}
            >
              <BSNavLink
                id={`navItem-${name}-${index}`}
                className="text-uppercase"
                tag={NavLink}
                to={to}
                activeClassName="active"
                exact={exact}
              >
                {/* <Icon className={bem.e('nav-item-icon')} /> */}
                <span className="nav-collapse-item">{name}</span>
              </BSNavLink>
            </NavItem>
          ))}
        </Collapse>
      </div>
    );
  }

  return (
    <NavItem
      className={bem.e("nav-item")}
      hidden={onActionHidden(props.enable_action)}
      onClick={props.handleColClick(props.name)}
    >
      <BSNavLink
        id={`navItem-${props.name}-${props.index}`}
        className="text-uppercase"
        tag={NavLink}
        to={props.to}
        activeClassName="active"
        exact={props.exact}
      >
        <props.Icon className={bem.e("nav-item-icon")} />
        <span className="">{props.name}</span>
      </BSNavLink>
    </NavItem>
  );
}

class Sidebar extends React.Component {
  state = {
    isOpenSales: false,
    isOpenMakeIt: false,
    isOpenMoveIt: false,
    isOpenEat: false,
    isOpenCommon: false,
    isOpenAccounts: false,
    isAutoOpen: true,
  };

  UNSAFE_componentWillMount() {}
  componentDidMount() {}

  componentDidUpdate(nextProps, nextState) {
    //var ptname = window.location.pathname;
  }

  handleClick = (name) => () => {
    this.setState((prevState) => {
      const isOpen = prevState[`isOpen${name}`];
      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
    this.setState({
      isAutoOpen: false,
    });
  };

  handleColClick = (name) => () => {
    this.setState({
      isAutoOpen: true,
    });
  };

  ongetSideBar() {
    var roleid = 0; //isLoggedInUser();
    switch (roleid) {
      default:
        return navBarSuperAdminItems;
    }
  }

  render() {
    navItems = SidebarSuperAdmin;
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e("background")} style={sidebarBackground} />
        <div className={bem.e("content")}>
          <Navbar>
            <SourceLink className="navbar-brand d-flex">
              <img
                src={logo200Image}
                width="40"
                height="30"
                className="pr-2"
                alt=""
              />
              <span className="text-white">DAILY LOCALLY</span>
            </SourceLink>
            <div className="admin-version">version - {version}</div>
          </Navbar>

          <Nav vertical>
            {navItems.map(
              ({ to, name, exact, Icon, submenu, submenuItem,enable_action }, index) => (
                <NavItems
                  key={index}
                  to={to}
                  name={name}
                  exact={exact}
                  Icon={Icon}
                  submenu={submenu}
                  submenuItem={submenuItem}
                  enable_action={enable_action}
                  index={index}
                  handleClick={this.handleClick}
                  state={this.state}
                  handleColClick={this.handleColClick}
                />
              )
            )}
          </Nav>
        </div>
      </aside>
    );
  }
}

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Sidebar);
export default Sidebar;
