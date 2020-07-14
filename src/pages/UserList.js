import React from "react";
import { connect } from "react-redux";
import PaginationComponent from "react-reactstrap-pagination";
import {
  Row,
  Col,
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
} from "reactstrap";
import Moment from "moment";
import Searchnew from "../components/Searchnew";
import AxiosRequest from "../AxiosRequest";
import { store } from "../store";
import {
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  USER_FILTER,
  USER_LIST,
} from "../constants/actionTypes";

const mapStateToProps = (state) => ({
  ...state.userlist,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  ongetUserList: (data) =>
    dispatch({
      type: USER_LIST,
      payload: AxiosRequest.CRM.getUserList(data),
    }),
  onSetUserFilters: (userfilter) =>
    dispatch({
      type: USER_FILTER,
      userfilter,
    }),
});

const defultPage = 1;
const pagelimit = 20;

class UserList extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenAreaDropDown: false,
      user_search: false,
      isLoading: false,
      user_refresh: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.clickArea = this.clickArea.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }
    this.onGetUsers();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }
    this.onGetUsers();
  }
  componentDidCatch() {}
  onGetUsers = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zoneid: this.props.zoneItem.id };
      if (this.props.userfilter) {
        data = this.props.userfilter;
        this.setState({
          user_search: data.search,
        });
      } else {
        data.page = defultPage;
        if (this.state.user_search) data.search = this.state.user_search;
      }

      this.props.ongetUserList(data);
      this.props.onSetUserFilters(data);
    }
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };
  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  onSearchUser = (e) => {
    const value = e.target.value || "";
    this.setState({ user_search: value });
  };
  onSuccessRefresh = () => {
    this.setState({ user_refresh: false });
  };
  onSearch = () => {
    this.props.onSetUserFilters(false);
    this.setState({ isLoading: false });
  };
  onReset = () => {
    this.setState({
      user_search: "",
      user_refresh: true,
    });
    this.props.onSetUserFilters(false);
    this.setState({ isLoading: false });
  };
  onViewDayorders = (item) => {
    this.props.history.push("/crm/" + item.userid);
  };
  onViewTransaction = (item) => {
    this.props.history.push("/transaction/" + item.userid);
  };

  handleSelected = (selectedPage) => {
    var data = { zoneid: this.props.zoneItem.id };
    if (this.props.userfilter) {
      data = this.props.userfilter;
    }
    data.page = selectedPage;
    this.props.ongetUserList(data);
    this.props.onSetUserFilters(data);
  };

  render() {
    const Userlist = this.props.Userlist || [];
    return (
      <div className="pd-6 width-full mr-t-20" style={{ position: "fixed" }}>
        <div style={{ height: "85vh" }} className="width-85">
          <Row hidden={true}>
            <Col></Col>
            <Col>
              <div className="float-right mr-r-20">
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
          <div className="fieldset">
            <div className="legend">User List</div>
            <div className="replies_field_container mr-b-10 font-size-14">
              <div className="width-200 mr-l-20 align_self_center">
                User id/phone/name :
              </div>
              <div className="width-200 mr-l-10">
                <Searchnew
                  onSearch={this.onSearchUser}
                  type="text"
                  value={this.state.user_search}
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.user_refresh}
                />
              </div>
            </div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14 txt-align-right">
              <Col lg="10"></Col>
              <Col className="txt-align-right">
                <Button size="sm" className="mr-r-10" onClick={this.onReset}>
                  Reset
                </Button>
                <Button size="sm" onClick={this.onSearch}>
                  Search
                </Button>
              </Col>
            </Row>
          </div>
          <div className="pd-6">
            <div className="scroll-crm">
              <Table>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Id</th>
                    <th>phone number</th>
                    <th>Email</th>
                    <th>Registration date </th>
                    <th>Addresses</th>
                    <th>Order history</th>
                  </tr>
                </thead>
                <tbody>
                  {Userlist.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>

                      <td>{item.name}</td>
                      <td>{item.userid}</td>
                      <td>{item.phoneno}</td>
                      <td>{item.email}</td>
                      <td>
                        {Moment(item.createdat).format("DD-MMM-YYYY/hh:mm a")}
                      </td>
                      <td>
                        <Button size="sm" className="font-size-12">
                          Address
                        </Button>
                      </td>
                      <td>
                        <div className="flex-row">
                          <Button
                            size="sm"
                            className="mr-r-10 font-size-12"
                            onClick={() => this.onViewDayorders(item)}
                          >
                            Dayorder List
                          </Button>{" "}
                          <Button
                            size="sm"
                            className="mr-r-10 font-size-12"
                            onClick={() => this.onViewTransaction(item)}
                          >
                            Transaction view
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="float-right mr-t-20">
              <PaginationComponent
                totalItems={this.props.totalcount}
                pageSize={pagelimit}
                onSelect={this.handleSelected}
                activePage={this.props.selectedPage}
                size="sm"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(UserList);
