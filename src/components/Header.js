import React from 'react';
import bn from '../utils/bemnames'
import sidebarBgImage from '../assets/img/sidebar/sidebar-14.png';


import {
  Navbar,
  Col,
  Nav,
  NavItem,
  Button,
} from 'reactstrap';

import {
  MdClearAll,
} from 'react-icons/md';




const bem = bn.create('header');
const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

var LoginName=null;
var LoginEmail=null;
class Header extends React.Component {
  UNSAFE_componentWillMount() {
  }
  state = {
    isOpenNotificationPopover: false,
    isNotificationConfirmed: false,
    isOpenUserCardPopover: false,
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

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };


  
  render() {
    return (
      <div className={bem.e('background App-nav-fixed')} style={sidebarBackground}>
      <Navbar className="cr-header-bg">
        <Nav navbar className="mr-2">
          <Button outline onClick={this.handleSidebarControlButton} className="text-white">
            <MdClearAll size={25} />
          </Button>
        </Nav>
        {/* <Nav navbar>
          <SearchInput />
        </Nav> */}
        <Nav navbar className={bem.e('nav-right')}>
          <NavItem className="mr-r-10">
            <Col className="text-white font-size-14">
              <div>{LoginName}</div>
              <div>{LoginEmail}</div>
            </Col>
          </NavItem>
          <NavItem className="d-inline-flex">
          <Button className="position-relative" onClick={this.props.onLogout} size="sm">LOGOUT</Button>
          </NavItem>
        </Nav>
      </Navbar>
      </div>

    );
  }
}

export default Header;
