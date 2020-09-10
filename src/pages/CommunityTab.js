import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { store } from "../store";
import {
  Row,
  Col,
  ButtonGroup,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  COMMUNITY_SELECTED_TAB, WARE_HOUSE_ZONE_SELECTED, ZONE_SELECT_ITEM,
} from "../constants/actionTypes";
import Community from "./Community";
import StockKeeping from "./StockKeeping";
import CommunityUser from "./CommunityUser";

const mapStateToProps = (state) => ({
  ...state.warehouse,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  OnZoneItemSelect: (item) =>
    dispatch({
      type: WARE_HOUSE_ZONE_SELECTED,
      item,
    }),
  onSelectTabType: (tab_type) =>
    dispatch({
      type: COMMUNITY_SELECTED_TAB,
      tab_type,
    }),
});

const path = "/community";
class CommunityTab extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenAreaDropDown: false,
      areaItem: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { path } = this.props.match;
    this.onCommunityTabClick = this.onCommunityTabClick.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickArea = this.clickArea.bind(this);
    if (this.props.zone_list.length > 0 && !this.state.areaItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (path.includes("/community/master")) {
      this.props.onSelectTabType(0);
    } else if (path.includes("/community/user")) {
      this.props.onSelectTabType(1);
    } else if (path.includes("/community/dashboard")) {
      this.props.onSelectTabType(2);
    }
  }

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
    this.setState({ areaItem: item });
  };
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.state.areaItem) {
      this.clickArea(this.props.zone_list[0]);
    }
  }
  componentDidCatch() {}
  
  onCommunityTabClick = (tab) => {
    if (tab===2){
      window.open('https://dashboard.getsocial.im/','_blank');
      return;
    }

    this.props.onSelectTabType(tab);
    if (tab === 0) {
      this.props.history.push("/community/master");
    } else if (tab === 1) {
      this.props.history.push("/community/user");
    }

    // else if (tab === 2) {
    //   this.props.history.push("/community/dashboard");
    // }
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  render() {
    return (
      <div className="pd-6 width-full" style={{ position: "fixed" }}>
        <div style={{ height: "85vh" }} className="width-84">
            <Row>
              <Col>
                <ButtonGroup size="sm">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(0)}
                    active={this.props.community_tab_type === 0}
                  >
                    Community Master
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(1)}
                    active={this.props.community_tab_type === 1}
                  >
                    User
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(2)}
                    active={this.props.community_tab_type === 2}
                  >
                    Dashboard
                  </Button>
                </ButtonGroup>
              </Col>
              <Col>
                <div className="float-right">
                  <span className="mr-r-20">Zone</span>
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
              </Col>
            </Row>
            <Row>
              <Switch>
                <Route
                  path={`${path}/master`}
                  exact
                  component={Community}
                />
                <Route path={`${path}/user`} component={CommunityUser} />
                <Redirect to={`${path}/master`} />
              </Switch>
            </Row>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CommunityTab);
