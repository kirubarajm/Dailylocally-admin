import { Content, Header, Sidebar } from '../components';
import React from 'react';
import {LOGOUT} from '../constants/actionTypes'
import { connect } from 'react-redux';
import AxiosRequest from "../AxiosRequest";
const mapStateToProps = state => ({ ...state 

});

const mapDispatchToProps = dispatch => ({
  onLogout: (data) => dispatch({ type: LOGOUT,payload: AxiosRequest.Admin.logout(data)}),
});

class MainLayout extends React.Component {
  static isSidebarOpen() {
    return document
      .querySelector('.cr-sidebar')
      .classList.contains('cr-sidebar--open');
  }

  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);
  }

  componentWillMount() {
    this.Logout=this.Logout.bind(this);
  }

  componentDidUpdate(nextProps, nextState) {
    if(!this.props.loginsuccess){

    }
  }
  
Logout = event =>{
  var data={admin_userid:0}
  this.props.onLogout(data);
}
  // close sidebar when
  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    if (
      MainLayout.isSidebarOpen() &&
      (this.props.breakpoint === 'xs' ||
        this.props.breakpoint === 'sm' ||
        this.props.breakpoint === 'md')
    ) {
      this.openSidebar('close');
    }
  };

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
        return this.openSidebar('close');

      case 'lg':
      case 'xl':
      default:
        return this.openSidebar('open');
    }
  }

  openSidebar(openOrClose) {
    if (openOrClose === 'open') {
      return document
        .querySelector('.cr-sidebar')
        .classList.add('cr-sidebar--open');
    }
    document.querySelector('.cr-sidebar').classList.remove('cr-sidebar--open');
  }

  render() {
    const { children } = this.props;
    return (
      <main className="cr-app">
        <Sidebar/>
        <Content fluid onClick={this.handleContentClick}>
          <Header onLogout={this.Logout}/>
          <div className="App-content">{children}</div>
        </Content>
      </main>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(MainLayout);
