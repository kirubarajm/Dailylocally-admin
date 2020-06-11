import React from "react";
import { connect } from "react-redux";
import { Switch, Route, Link, Redirect } from "react-router-dom";
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
import AxiosRequest from "../AxiosRequest";
import {
  WARE_HOUSE_ZONE_SELECTED,
  WARE_HOUSE_SELECTED_TAB,
} from "../constants/actionTypes";
import DayOrders from "./DayOrders";
import Procurement from "./Procurement";
import Po from "./Po";

const mapStateToProps = (state) => ({
  ...state.warehouse,
  zone_list: state.common.zone_list,
});

const mapDispatchToProps = (dispatch) => ({
  OnZoneItemSelect: (item) =>
    dispatch({
      type: WARE_HOUSE_ZONE_SELECTED,
      item,
    }),
  onSelectTabType: (tab_type) =>
    dispatch({
      type: WARE_HOUSE_SELECTED_TAB,
      tab_type,
    }),
});

const path  = '/warehouse';
class Warehouse extends React.Component {
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

    if (path.includes("/warehouse/dayoders")) {
      this.props.onSelectTabType(0);
    } else if (path.includes("/warehouse/procurement")) {
      this.props.onSelectTabType(1);
    } else if (path.includes("/warehouse/po")) {
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
    this.props.OnZoneItemSelect(item);
    this.setState({ areaItem: item });
  };
  onWarehouseTabClick = (tab) => {
    this.setState({ catalog_tab_type: tab });
    this.props.onSelectTabType(tab);
  };
  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  render() {
    
    return (
      <div>
        {path}
        <div className="pd-12">
          <Row>
            <Col>
              <ButtonGroup size="sm">
                <Link to={`${path}/dayoders`}>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => this.onWarehouseTabClick(0)}
                    active={this.props.warehouse_tab_type === 0}
                  >
                    Day order
                  </Button>
                </Link>
                <Link to={`${path}/procurement`}>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.onWarehouseTabClick(1)}
                  active={this.props.warehouse_tab_type === 1}
                >
                  Procurement
                </Button> </Link>
                <Link to={`${path}/po`}>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.onWarehouseTabClick(2)}
                  active={this.props.warehouse_tab_type === 2}
                >
                  PO
                </Button> </Link>
                <Button
                  color="primary"
                  onClick={() => this.onWarehouseTabClick(3)}
                  active={this.props.warehouse_tab_type === 3}
                >
                  Receiving
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.onWarehouseTabClick(4)}
                  active={this.props.warehouse_tab_type === 4}
                >
                  Sorting
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.onWarehouseTabClick(5)}
                  active={this.props.warehouse_tab_type === 5}
                >
                  QA
                </Button>
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => this.onWarehouseTabClick(6)}
                  active={this.props.warehouse_tab_type === 6}
                >
                  Return order
                </Button>
              </ButtonGroup>
            </Col>
            <Col></Col>
            <Col>
              <div className="float-right">
                <span className="mr-r-20">Area</span>
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
                <Route path={`${path}/dayoders`} exact component={DayOrders} />
                <Route path={`${path}/procurement`} component={Procurement} />
                <Route path={`${path}/po`} component={Po} />
                <Redirect to={`${path}/dayoders`} />
              </Switch>
          </Row>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Warehouse);
