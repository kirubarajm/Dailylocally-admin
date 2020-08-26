import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";
import { store } from "../store";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  ButtonGroup,
  Button,
} from "reactstrap";
import {
  WARE_HOUSE_ZONE_SELECTED,
  ZONE_SELECT_ITEM,
  STOCK_KEEP_SELECTED_TAB,
} from "../constants/actionTypes";
import DayOrders from "./DayOrders";
import Procurement from "./Procurement";
import Po from "./Po";
import Receiving from "./Receiving";
import Sorting from "./Sorting";
import QAPage from "./QAPage";
import ReturnPage from "./ReturnPage";
import StockKeeping from "./StockKeeping";
import Wastage from "./Wastage";
import Missing from "./Missing";

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
      type: STOCK_KEEP_SELECTED_TAB,
      tab_type,
    }),
});

const path = "/stock";
class StockKeepingTab extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenAreaDropDown: false,
      areaItem: false,
    };
  }

  UNSAFE_componentWillMount() {
    const { path } = this.props.match;
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.onWarehouseTabClick = this.onWarehouseTabClick.bind(this);
    if (this.props.zone_list.length > 0 && !this.state.areaItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (path.includes("/stock/keeping")) {
      this.props.onSelectTabType(0);
    } else if (path.includes("/stock/wastage")) {
      this.props.onSelectTabType(1);
    } else if (path.includes("/stock/missing")) {
      this.props.onSelectTabType(2);
    }
  }
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
  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
    this.setState({ areaItem: item });
  };
  onWarehouseTabClick = (tab) => {
    this.setState({ catalog_tab_type: tab });
    this.props.onSelectTabType(tab);
    if (tab === 0) {
      this.props.history.push("/stock/keeping");
    } else if (tab === 1) {
      this.props.history.push("/stock/wastage");
    } else if (tab === 2) {
      this.props.history.push("/stock/missing");
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
                    onClick={() => this.onWarehouseTabClick(0)}
                    active={this.props.stockkeeping_tab_type === 0}
                  >
                    Stock keeping
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onWarehouseTabClick(1)}
                    active={this.props.stockkeeping_tab_type === 1}
                  >
                    Wastage
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onWarehouseTabClick(2)}
                    active={this.props.stockkeeping_tab_type === 2}
                  >
                    Missing items
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
                  path={`${path}/keeping`}
                  exact
                  component={StockKeeping}
                />
                <Route path={`${path}/wastage`} component={Wastage} />
                <Route path={`${path}/missing`} component={Missing} />
                <Redirect to={`${path}/keeping`} />
              </Switch>
            </Row>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(StockKeepingTab);
