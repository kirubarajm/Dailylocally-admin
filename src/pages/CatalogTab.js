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
  CATALOG_SELECTED_TAB, CATALOG_ZONE_SELECTED,
} from "../constants/actionTypes";
import Community from "./Community";
import StockKeeping from "./StockKeeping";
import CommunityUser from "./CommunityUser";

const mapStateToProps = (state) => ({
  ...state.catalogTab,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  OnZoneItemSelect: (item) =>
    dispatch({
      type: CATALOG_ZONE_SELECTED,
      item,
    }),
  onSelectTabType: (tab_type) =>
    dispatch({
      type: CATALOG_SELECTED_TAB,
      tab_type,
    }),
});

const path = "/catalog";
class CatalogTab extends React.Component {
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

    if (path.includes("/catalog/view")) {
      this.props.onSelectTabType(0);
    } else if (path.includes("/catalog/edit")) {
      this.props.onSelectTabType(1);
    } else if (path.includes("/vendors")) {
      this.props.onSelectTabType(2);
    } else if (path.includes("/brands")) {
      this.props.onSelectTabType(3);
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
  
  onCatalogTabClick = (tab) => {
    this.props.onSelectTabType(tab);
    if (tab === 0) {
      this.props.history.push("/catalog/view");
    } else if (tab === 1) {
      this.props.history.push("/catalog/edit");
    } else if (tab === 2) {
      this.props.history.push("/vendors");
    } else if (tab === 3) {
      this.props.history.push("/brands");
    }
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
                    active={this.props.catalog_tab_type === 0}
                  >
                    View Catalog
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(1)}
                    active={this.props.catalog_tab_type === 1}
                  >
                    Catalog editor
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(2)}
                    active={this.props.catalog_tab_type === 2}
                  >
                    Vendors
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onCommunityTabClick(2)}
                    active={this.props.catalog_tab_type === 2}
                  >
                    Brands
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
