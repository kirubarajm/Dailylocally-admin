import React from "react";
import AxiosRequest from "../AxiosRequest";
import SearchInput from "../components/SearchInput";
import { onActionHidden } from "../utils/ConstantFunction";
import {
  MOVEIT_USERS_LIST,
  MOVEIT_USERS_FILTER,
} from "../constants/actionTypes";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
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
  FaMoneyBillAlt,
  FaMixcloud,
  FaRegDotCircle,
  FaMapMarkedAlt,
} from "react-icons/fa";
import { store } from "../store";

const mapStateToProps = (state) => ({
  ...state.moveituserlist,
  zone_list: state.common.zone_list,
});
const mapDispatchToProps = (dispatch) => ({
  onGetUser: (data) =>
    dispatch({
      type: MOVEIT_USERS_LIST,
      payload: AxiosRequest.Moveit.getAll(data),
    }),
  onSetFilter: (search, online_status,item) =>
    dispatch({ type: MOVEIT_USERS_FILTER, search, online_status,item }),
});

class MoveitUserList extends React.Component {
  onSetZone(){
    var zone=[];
    zone.push({id:-1,Zonename:"All"});
    for (let i = 0; i < this.props.zone_list.length; i++) {
      zone.push(this.props.zone_list[i]);
    }
    this.setState({zone_list:zone});
  }
  componentWillMount() {
    this.setState({ isOpenAreaDropDown: false,zone_list:[]});
    this.onFiltersApply(
      this.props.search,
      this.props.online_status,
      this.props.zoneItem
    );

    this.onSearch = (e) => {
      // if (e.keyCode === 13 && e.shiftKey === false) {
      // e.preventDefault();
      this.props.onSetFilter(
        e.target.value,
        this.props.online_status,
        this.props.zoneItem
      );
      this.onFiltersApply(
        e.target.value,
        this.props.online_status,
        this.props.zoneItem
      );
      //}
    };
    this.filterUser = this.filterUser.bind(this);
    this.onNavigateToMap = this.onNavigateToMap.bind(this);
  }
  clickArea = (item) => {
    this.props.onSetFilter(this.props.search, this.props.online_status, item);
    this.onFiltersApply(this.props.search, this.props.online_status, item);
  };

  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && this.state.zone_list.length===0) {
      this.onSetZone();
    }
    
  }
  onFiltersApply(search, online_status, zone) {
    var filter = {
      moveit_search: search,
    };

    if (zone.id!== -1) {
      filter.zoneid = zone.id;
    }

    if (online_status !== -1) filter.livestatus = "" + online_status;
    this.props.onGetUser(filter);
  }
  filterUser(id) {
    this.props.onSetFilter(this.props.search, id, this.props.zoneItem);
    this.onFiltersApply(this.props.search, id, this.props.zoneItem);
  }
  onNavigateToMap = () => {
    this.props.history.push("/moveit-current-location");
    //this.props.history.push('/zone-draw')
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };
  render() {
    const moveituserlist = this.props.moveituserlist || [];
    const online_status = this.props.online_status;
    return (
      <div className="pd-8">
        <Card>
          <CardHeader>
            <Row>
              <Col lg="1">Drivers</Col>
              <Col>
                <Row className="float-right">
                  <Col className="txt-align-right pd-0">
                    <ButtonGroup size="sm" className="mr-r-10">
                      <Button
                        color="primary"
                        onClick={() => this.filterUser(-1)}
                        active={online_status === -1}
                      >
                        All
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => this.filterUser(1)}
                        active={online_status === 1}
                      >
                        Live
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => this.filterUser(0)}
                        active={online_status === 0}
                      >
                        Unlive
                      </Button>
                      
                    </ButtonGroup>
                    <Link to={`/moveit-add`} className="preview-link" hidden={onActionHidden('driver_add')}>
                      <Button size="sm">Driver add</Button>
                    </Link>
                  </Col>
                  <Col className="txt-align-right pd-0">
                    <div className="flex-row">
                      <div className="width-200 mr-r-10 mr-l-10">
                        <SearchInput
                          onSearch={this.onSearch}
                          value={this.props.search}
                        />
                      </div>
                      <div className="mr-r-10 width-120">
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
                            {this.state.zone_list.map((item, index) => (
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
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardHeader>
          <CardBody className="scrollbar pd-0">
            <Table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Online status</th>
                  <th>Zone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {moveituserlist.map((item, i) => (
                  <tr key={i}>
                    <th scope="row">{i + 1}</th>
                    <th scope="row">{item.userid}</th>
                    <td>{item.name}</td>
                    <td>{item.phoneno}</td>
                    <td>
                      {item.online_status == 1 ? (
                        <FaMixcloud color={"green"} size={20} />
                      ) : (
                        <FaRegDotCircle color={"red"} size={20} />
                      )}
                    </td>
                    <td>{item.Zonename}</td>
                    {/* <td>
                      <PasswordShow password={item.password} />
                    </td> */}
                    <td>
                      <Link
                        to={`/viewmoveituser/${item.userid}`}
                        className="preview-link"
                      >
                        <i className="fa fa-external-link-alt" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardBody>
        </Card>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(MoveitUserList);
