import React from "react";
import { connect } from "react-redux";
import PaginationComponent from "react-reactstrap-pagination";
import MapContainer from "../components/MapContainer";
import { onActionHidden } from "../utils/ConstantFunction";
import {
  Row,
  Col,
  Table,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ButtonDropdown,
  Modal,
  ModalBody,
  ModalFooter,
  ButtonGroup,
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
  USER_CLEAR,
  USER_ADD_ADDRESS,
} from "../constants/actionTypes";
import { Field, reduxForm } from "redux-form";
import { requiredTrim, minLength2, required } from "../utils/Validation";
import { ADDRESS_FORM } from "../utils/constant";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";

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
  onPostAddress: (data) =>
    dispatch({
      type: USER_ADD_ADDRESS,
      payload: AxiosRequest.CRM.postUserAddress(data),
    }),
  onSetUserFilters: (userfilter) =>
    dispatch({
      type: USER_FILTER,
      userfilter,
    }),
  onClear: () =>
    dispatch({
      type: USER_CLEAR,
    }),
});

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div className="border-none width-250">
      <div className="flex-column">
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        <span
          style={{
            flex: "0",
            WebkitFlex: "0",
            width: "150px",
            height: "10px",
            fontSize: "12px",
            marginTop: "5px",
            color: "red",
          }}
        >
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </span>
      </div>
    </div>
  );
};

const defultPage = 1;
var geocoder = null;
var adPage = null;
class UserList extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenAreaDropDown: false,
      user_search: false,
      isLoading: false,
      user_refresh: false,
      isAddressModal: false,
      mapRefresh: false,
      addressItem: false,
      editAddressItem: false,
      address_type: 1,
      lat: 0,
      lng: 0,
    };
  }

  UNSAFE_componentWillMount() {
    adPage = this;
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

    if (this.props.address_updated) {
      this.props.onClear();
      this.toggleAddressPopUp();
      this.setState({
        isLoading: false,
        editAddressItem: false,
        addressItem: false,
        address_type: 1,
        lat: 0,
        lng: 0,
      });
    }
    this.onGetUsers();
  }
  componentDidCatch() {}

  onSetAddress(address_geo, zipcode_geo) {
    this.setState({ editAddressItem: address_geo, zipcode: zipcode_geo });
  }

  handleLatlng = (lat1, lng1) => {
    this.setState({ lat: lat1, lng: lng1, mapRefresh: false });
    geocoder = new window.google.maps.Geocoder();
    var latlng = { lat: parseFloat("" + lat1), lng: parseFloat("" + lng1) };
    if (geocoder) {
      geocoder.geocode({ location: latlng }, function (results, status) {
        if (status === "OK") {
          if (results[0]) {
            console.log(results[0].formatted_address);
            var pin = 0;
            for (var i = 0; i < results[0].address_components.length; i++) {
              var component = results[0].address_components[i];
              var addressType = component.types[0];
              switch (addressType) {
                case "postal_code":
                  pin = component.long_name;
                  break;
              }
            }
            if (adPage) adPage.onSetAddress(results[0].formatted_address, pin);
          }
        }
      });
    }
  };

  handleViewLatlng = (lat1, lng1) => {};

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

  clickBuildType = (buildtype) => {
    this.setState({ address_type: buildtype });
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

  onViewAddress = (item) => {
    this.setState({ addressItem: item });
    this.toggleAddressPopUp();
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

  toggleAddressPopUp = () => {
    this.setState((prevState) => ({
      isAddressModal: !prevState.isAddressModal,
    }));
  };

  submit = (data) => {
    data.address_type = this.state.address_type;
    data.google_address = this.state.editAddressItem;
    data.lat = this.state.lat;
    data.lon = this.state.lng;
    data.aid = this.state.addressItem.address_details[0].aid;
    console.log("data-->", data);
    if (this.state.editAddressItem) {
      this.props.onPostAddress(data);
    } else {
      notify.show(
        "Please click the map after try again",
        "custom",
        2000,
        notification_color
      );
    }
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

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
                      <td>{this.dateConvert(item.created_at)}</td>
                      <td>
                        <Button
                          size="sm"
                          className="font-size-12"
                          disabled={
                            item.address_details.length === 0 ||
                            onActionHidden("user_address_btn")
                          }
                          onClick={() => this.onViewAddress(item)}
                        >
                          Address
                        </Button>
                      </td>
                      <td>
                        <div className="flex-row">
                          <Button
                            size="sm"
                            className="mr-r-10 font-size-12"
                            disabled={onActionHidden("user_dayorder_btn")}
                            onClick={() => this.onViewDayorders(item)}
                          >
                            Dayorder List
                          </Button>{" "}
                          <Button
                            size="sm"
                            disabled={onActionHidden("user_trans_btn")}
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
            <div
              className="float-right mr-t-20"
              hidden={this.props.totalcount < this.props.pagelimit}
            >
              <PaginationComponent
                totalItems={this.props.totalcount}
                pageSize={this.props.pagelimit}
                onSelect={this.handleSelected}
                activePage={this.props.selectedPage}
                size="sm"
              />
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.isAddressModal}
          toggle={this.toggleAddressPopUp}
          style={onActionHidden("user_edit_address")?{ maxWidth: "600px" }:{ maxWidth: "1200px" }}
          backdrop={true}
        >
          <ModalBody className="pd-10">
            {this.state.addressItem ? (
              <div className="font-size-14 mr-t-20">
                <div className="flex-row mr-t-10">
                  <div className="mr-r-20 width-200">Pin Location</div>
                  <MapContainer
                    className="mr-t-10"
                    handleLatlng={this.handleLatlng}
                    editMap={true}
                    address={"You"}
                    clocation={false}
                    zonearea={[]}
                    lat={this.state.lat}
                    lng={this.state.lng}
                    current_lat={this.state.addressItem.address_details[0].lat}
                    current_lng={this.state.addressItem.address_details[0].lon}
                    refresh={this.state.mapRefresh}
                  />
                </div>
                <Row className="mr-t-10">
                  <Col>
                    <div className="flex-column">
                      <div className="font-size-14 font-weight-bold">
                        Current address
                      </div>
                      <div className="flex-row mr-t-10">
                        <div className="mr-r-20 width-200">
                          Pinned google location
                        </div>
                        <div
                          className="border-block pd-10 font-size-12"
                          style={{ width: "350px" }}
                        >
                          {
                            this.state.addressItem.address_details[0]
                              .google_address
                          }
                        </div>
                      </div>
                      <div className="font-size-14 font-weight-bold">
                        Manual Entered address
                      </div>
                      <div
                        className="flex-column border-block pd-10"
                        style={{ width: "570px" }}
                      >
                        <div className="flex-row mr-t-10 font-size-12">
                          <Button
                            size="sm"
                            className="mr-r-10 font-size-12"
                            disabled={
                              this.state.addressItem.address_details[0]
                                .address_type !== 1
                            }
                          >
                            Apartment
                          </Button>
                          <Button
                            size="sm"
                            className="mr-r-10 font-size-12"
                            disabled={
                              this.state.addressItem.address_details[0]
                                .address_type !== 2
                            }
                          >
                            Individual house
                          </Button>
                        </div>
                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">
                            Apartment Name :
                          </div>
                          <div>
                            {this.state.addressItem.address_details[0]
                              .apartment_name || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">House no</div>
                          <div>
                            {this.state.addressItem.address_details[0]
                              .flat_house_no || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">Floor</div>
                          <div>
                            {this.state.addressItem.address_details[0].floor ||
                              "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">Block name</div>
                          <div>
                            {this.state.addressItem.address_details[0]
                              .block_name || "-"}
                          </div>
                        </div>

                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">Address</div>
                          <div>
                            {this.state.addressItem.address_details[0]
                              .complete_address || "-"}
                          </div>
                        </div>

                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">City</div>
                          <div>
                            {this.state.addressItem.address_details[0].city ||
                              "-"}
                          </div>
                        </div>

                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">Pincode</div>
                          <div>
                            {this.state.addressItem.address_details[0]
                              .pincode || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-12">
                          <div className="mr-r-10 width-120">Landmark</div>
                          <div>
                            {this.state.addressItem.address_details[0]
                              .landmark || "-"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col hidden={onActionHidden("user_edit_address")}>
                    <div className="flex-column">
                      <div className="font-size-14 font-weight-bold">
                        Edit address
                      </div>

                      <div className="flex-row mr-t-10">
                        <div className="mr-r-20 width-200">
                          Pinned google location
                        </div>
                        <div
                          className="border-grey pd-10 font-size-12"
                          style={{ width: "350px" }}
                        >
                          {this.state.editAddressItem ? (
                            this.state.editAddressItem
                          ) : (
                            <span className="color-grey">
                              please click the map getting address
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="font-size-14 font-weight-bold mr-t-10">
                        Manual Entered address
                      </div>
                      <div
                        className="flex-column border-block pd-10"
                        style={{ width: "570px" }}
                      >
                        <div className="flex-row mr-t-10 font-size-12">
                          <ButtonGroup className="mr-r-10 font-size-12">
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() => this.clickBuildType(1)}
                              active={this.state.address_type === 1}
                            >
                              Apartment
                            </Button>
                            <Button
                              size="sm"
                              color="primary"
                              onClick={() => this.clickBuildType(2)}
                              active={this.state.address_type === 2}
                            >
                              Individual house
                            </Button>
                          </ButtonGroup>
                        </div>
                        <form onSubmit={this.props.handleSubmit(this.submit)}>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-75">
                              <div className="pd-0 border-none font-size-12">
                                Apartment Name :{" "}
                                <span className="must width-25">*</span>
                              </div>
                            </div>
                            <div>
                              <Field
                                name="apartment_name"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-120">
                              <div className="pd-0 border-none font-size-12">
                                House no :{" "}
                                <span className="must width-25">*</span>
                              </div>
                            </div>
                            <div>
                              <Field
                                name="flat_house_no"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                                validate={[required, requiredTrim]}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-120">
                              <div className="pd-0 border-none font-size-12">
                                Floor : <span className="must width-25">*</span>
                              </div>
                            </div>
                            <div>
                              <Field
                                name="floor"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                                validate={[required, requiredTrim]}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-120">
                              <div className="pd-0 border-none font-size-12">
                                Block name :{" "}
                                <span className="must width-25">*</span>
                              </div>
                            </div>

                            <div>
                              <Field
                                name="block_name"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-120">
                              <div className="pd-0 border-none font-size-12">
                                Address :{" "}
                                <span className="must width-25">*</span>
                              </div>
                            </div>
                            <div>
                              <Field
                                name="complete_address"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                                validate={[required, minLength2, requiredTrim]}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-120">
                              <div className="pd-0 border-none font-size-12">
                                City : <span className="must width-25">*</span>
                              </div>
                            </div>
                            <div>
                              <Field
                                name="city"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                                validate={[required, minLength2, requiredTrim]}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10">
                            <div className="mr-r-10 width-120 flex-row">
                              <div className="pd-0 border-none font-size-12">
                                Pincode <span className="must width-25">*</span>
                              </div>
                            </div>
                            <div>
                              <Field
                                name="pincode"
                                autoComplete="off"
                                type="number"
                                component={InputField}
                                validate={[required, minLength2, requiredTrim]}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-10 font-size-12">
                            <div className="mr-r-10 width-120">Landmark</div>
                            <div>
                              <Field
                                name="landmark"
                                autoComplete="off"
                                type="text"
                                component={InputField}
                              />
                            </div>
                          </div>
                          <div className="flex-row mr-t-20 font-size-12 float-right">
                            <Button size="sm" type="submit">
                              {" "}
                              Submit{" "}
                            </Button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleAddressPopUp}>
              CLOSE
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
UserList = reduxForm({
  form: ADDRESS_FORM, // a unique identifier for this form
})(UserList);
export default connect(mapStateToProps, mapDispatchToProps)(UserList);
