import React from "react";
import { connect } from "react-redux";
import { FaEye, FaRegEdit, FaTrashAlt, FaDownload } from "react-icons/fa";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import {
  Row,
  Col,
  Table,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import {
  COMMUNITY_USER_LIST,
  COMMUNITY_USER_REPORT,
  COMMUNITY_APPROVAL,
  COMMUNITY_UPDATE,
  COMMUNITY_CLEAR,
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SearchItem from "../components/SearchItem";
import { store } from "../store";
import { CSVLink } from "react-csv";
import PaginationComponent from "react-reactstrap-pagination";
import MapContainer from "../components/MapContainer";
import { Field, reduxForm } from "redux-form";
import { COMMUNITY_FORM } from "../utils/constant";
import { required, requiredTrim } from "../utils/Validation";
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
        <input
          {...input}
          placeholder={label}
          type={type}
          autoComplete="off"
          disabled={custom.disabled}
        />
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

const mapStateToProps = (state) => ({
  ...state.communityuser,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCommunityUserList: (data) =>
    dispatch({
      type: COMMUNITY_USER_LIST,
      payload: AxiosRequest.CommunityList.getUserList(data),
    }),
  onGetCommunityUserReport: (data) =>
    dispatch({
      type: COMMUNITY_USER_REPORT,
      payload: AxiosRequest.CommunityList.getUserList(data),
    }),
  onGetApproval: (data) =>
    dispatch({
      type: COMMUNITY_APPROVAL,
      payload: AxiosRequest.CommunityList.updateApproval(data),
    }),
  onGetSubmit: (data) =>
    dispatch({
      type: COMMUNITY_UPDATE,
      payload: AxiosRequest.CommunityList.updateCommunity(data),
    }),
  onGetClear: () =>
    dispatch({
      type: COMMUNITY_CLEAR,
    }),
});

class CommunityUser extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      startdate: false,
      enddate: false,
      search_refresh: false,
      today: Moment(new Date()),
      community_name: false,
      isConfrimModal: false,
      selectedPage: 1,
      poid_refresh: false,
      isOpenOrderStatus: false,
      recevingModal: false,
      receivingSelection: [],
      pono: false,
      supplier_name: false,
      item_name: false,
      addressItem: false,
      isEdit: false,
      isView: false,
      isApprove: false,
      isAddressModal: false,
      mapRefresh: false,
      select_status: {
        id: -1,
        status: "All",
      },
    };
  }

  UNSAFE_componentWillMount() {
    this.stockDate = this.stockDate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.submit = this.submit.bind(this);
    this.onSearchItem = this.onSearchItem.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.toggleOrderStatus = this.toggleOrderStatus.bind(this);
    this.onCommunityList();
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

    if (this.props.community_approval) {
      this.props.onGetClear();
      this.toggleCommunityView();
      this.setState({isLoading:false});
    }

    if (this.props.community_user_report.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }
    this.onCommunityList();

  }
  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };
  componentDidCatch() {}
  onCommunityList = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {zoneid: this.props.zoneItem.id};
      if (this.state.startdate) data.from_date = this.state.startdate;
      if (this.state.enddate) data.to_date = this.state.enddate;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      if (this.state.community_name)
        data.search = this.state.community_name;
      this.props.onGetCommunityUserList(data);
    }
  };

  stockDate = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate, enddate: enddate });
  };

  onView = (Item) => {
    this.onFormPrefill(Item);
    this.setState({
      addressItem: Item,
      lat: Item.lat,
      lng: Item.lon,
      isView: true,
    });
    this.toggleCommunityView();
  };

  onFormPrefill =(Item)=>{
    var initData = {
      community_name: Item.communityname,
      area: Item.area,
      noofapartments: Item.no_of_apartments,
      community_address: Item.community_address,
      whatsapp_link: Item.whatsapp_group_link,
    };
    this.props.initialize(initData);
  }
  onApproveView = (Item) => {
    this.onFormPrefill(Item);
    this.setState({
      addressItem: Item,
      lat: Item.lat,
      lng: Item.lon,
      isEdit: false,
      isView: false,
      isApprove: true,
    });
    this.toggleCommunityView();
  };

  toggleCommunityView = () => {
    this.setState((prevState) => ({
      isAddressModal: !prevState.isAddressModal,
    }));
  };

  onAccpect = (status) => {
    var data = {};
    data.userid = this.state.addressItem.userid;
    data.comid = this.state.addressItem.comid;
    data.status = status;
    //data.done_by = getAdminId();
    this.props.onGetApproval(data);
  };

  onSearchItem = (e) => {
    const value = e.target.value || "";
    this.setState({ community_name: value });
  };

  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
  };

  onReset = () => {
    this.setState({
      startdate: false,
      enddate: false,
      selectedPage: 1,
      search_refresh: true,
      community_name:""
    });
    var data = {zoneid: this.props.zoneItem.id};
    this.props.onGetCommunityUserList(data);
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };

  submit = (data) => {
    var cmupdatedata = {
      //done_by: getAdminId(),
      communityname: data.community_name,
      area: data.area,
      no_of_apartments: data.noofapartments,
      community_address: data.community_address,
      whatsapp_group_link: data.whatsapp_link,
    };

    if (this.state.isEdit) cmupdatedata.comid = this.state.addressItem.comid;
    else cmupdatedata.isaddadmin = true;

    this.props.onGetSubmit(cmupdatedata);
  };

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = {};
    if (this.state.startdate) data.from_date = this.state.startdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
    if (this.state.community_name)
      data.community_name = this.state.community_name;
    if (this.state.select_status && this.state.select_status.id !== -1)
      data.status = this.state.select_status.id;
    data.report = 1;

    this.props.onGetCommunityUserReport(data);
  };

  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };

  onCheckOrder = (item) => {
    if (item.status === 1) return true;
    else return false;
  };


  toggleOrderStatus = () => {
    this.setState({
      isOpenOrderStatus: !this.state.isOpenOrderStatus,
    });
  };

  clickOrderStatus = (Item) => {
    this.setState({ select_status: Item });
  };

  handleLatlng = (lat1, lng1) => {
    this.setState({ lat: lat1, lng: lng1, mapRefresh: false });
  };

  onCommunityView =()=>{
    this.setState({isCommView:true,isView: false});
  }

  onCommunityViewPopup =(Item)=>{
    this.setState({
      isCommView:true,
      isView: false, 
      addressItem: Item,
      lat: Item.lat,
      lng: Item.lon});
      this.toggleCommunityView();
  }
  // onEdit = () => {
  //   this.setState({
  //     isEdit: true,
  //     isView: false,
  //     isCommView:false,
  //     mapRefresh: true,
  //   });
  // };

  ImageDownload = (img) => {
    if (document.getElementById(img)) document.getElementById(img).click();
  };

  render() {
    const community_user_list = this.props.community_user_list || [];
    return (
      <div className="width-full">
        <div style={{ height: "75vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Filters</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Joining date: </div>
                  <DateRangePicker
                    opens="right"
                    drops="down"
                    onApply={this.stockDate}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                  </DateRangePicker>
                  {this.state.startdate
                    ? Moment(this.state.startdate).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                  {this.state.startdate
                    ? " - " + Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </div>
              </Col>
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-200">
                  User name/Community name :{" "}
                  </div>
                  <SearchItem
                    onSearch={this.onSearchItem}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.search_refresh}
                  />
                </div>
              </Col>
            </Row>
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
            <Row>
              <Col className="txt-align-right">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("stockexport_catalog_master_report")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>
                <CSVLink
                  data={this.props.community_user_report}
                  filename={"community_user_report.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
              </Col>
            </Row>
            <div className="search-cuser-scroll mr-t-10">
              <Table style={{ width: "1500px" }}>
                <thead>
                  <tr>
                    <th>View</th>
                    <th>User ID</th>
                    <th>User Name</th>
                    <th>Community Name</th>
                    <th>Apartment no</th>
                    <th>Joining Date</th>
                    <th>Area</th>
                    <th>Total orders</th>
                    <th>Total order value</th>
                  </tr>
                </thead>
                <tbody>
                  {community_user_list.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <Button
                          size="sm"
                          disabled={onActionHidden("stockview")}
                          onClick={() => this.onView(item)}
                          color="link"
                        >
                          <FaEye size="16" />
                        </Button>
                      </td>
                      <td>{item.userid}</td>
                      <td>{item.name}</td>
                      <td onClick={()=>this.onCommunityViewPopup(item)} className="text-decoration-underline">{item.communityname}</td>
                      <td>{item.flat_no}</td>
                      <td>{Moment(item.created_at).format("DD-MMM-YYYY/hh:mm a")}</td>
                      <td>{item.area}</td>
                      <td>{item.total_orders}</td>
                      <td>{item.total_Revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div
              className="float-right"
              hidden={this.props.totalcount < this.props.pagelimit}
            >
              <PaginationComponent
                totalItems={this.props.totalcount}
                pageSize={this.props.pagelimit}
                onSelect={this.handleSelected}
                activePage={this.state.selectedPage}
                size="sm"
              />
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.isAddressModal}
          toggle={this.toggleCommunityView}
          style={{ maxWidth: "800px" }}
          backdrop={true}
        >
          <ModalBody className="pd-10">
            {this.state.addressItem ? (
              this.state.isView ? (
                <div className="font-size-14 mr-t-20">
                  <Row className="mr-t-10">
                    <Col>
                      <div className="flex-column">
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                          User phone number :
                          </div>
                          <div>
                            {this.state.addressItem.phoneno || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">User email:</div>
                          <div>{this.state.addressItem.email || "-"}</div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                          Registered user name:
                          </div>
                          <div>
                            {this.state.addressItem.name || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                          User house number:
                          </div>
                          <div>
                            {this.state.addressItem.flat_no || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                          User Floor number:
                          </div>
                          <div>
                            {this.state.addressItem.floor_no || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                      <div className="mr-r-10 width-200">
                        User profile picture:
                      </div>

                      <div className="border-none">
                        {this.state.addressItem.profile_image ? (
                          <div>
                            <a
                              id="img1"
                              href={this.state.addressItem.profile_image}
                              download
                              hidden
                              target="_blank"
                            ></a>
                            <Button
                              size="sm"
                              color="link"
                              onClick={() => this.ImageDownload("img1")}
                            >
                              <FaDownload size="15" />
                            </Button>
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                          Community name:
                          </div>
                          <div>
                            <span onClick={()=>this.onCommunityView(this.state.addressItem)} className="text-decoration-underline">{this.state.addressItem.communityname || "-"}</span>
                            <span className="mr-l-10 font-weight-bold">{this.state.addressItem.status_msg||"-"}</span>
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                          Area:
                          </div>
                          <div>
                            {this.state.addressItem.area || "-"}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
              this.state.isCommView ? (
                <div className="font-size-14 mr-t-20">
                  <div className="flex-row mr-t-10">
                    <div className="mr-r-20 width-200">Location</div>
                    <MapContainer
                      className="mr-t-10"
                      handleLatlng={this.handleLatlng}
                      editMap={false}
                      address={"You"}
                      clocation={false}
                      zonearea={[]}
                      lat={parseFloat(this.state.lat)}
                      lng={parseFloat(this.state.lng)}
                    />
                  </div>
                  <Row className="mr-t-10">
                    <Col>
                      <div className="flex-column">
                        <div className="flex-row mr-t-10 font-size-14 ">
                          <div
                            className="mr-r-10 width-200"
                            style={{ flexGrow: "1" }}
                          >
                            Latitude,Longitude :
                          </div>
                          <div style={{ flexGrow: "2" }}>
                            {this.state.lat + "," + this.state.lng}
                          </div>
                          <div style={{ flexGrow: "1" }}>
                            <Button
                              size="sm"
                              hidden={true}
                              onClick={this.onEdit}
                              className="width-100"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Community name :
                          </div>
                          <div>
                            {this.state.addressItem.communityname || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">Area:</div>
                          <div>{this.state.addressItem.area || "-"}</div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            No. Of apartments:
                          </div>
                          <div>
                            {this.state.addressItem.no_of_apartments || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Community address:
                          </div>
                          <div>
                            {this.state.addressItem.community_address || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Community Whatsapp link:
                          </div>
                          <div>
                            {this.state.addressItem.whatsapp_group_link || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Converted user:
                          </div>
                          <div>
                            {this.state.addressItem.total_converted_user || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Total Revenue:
                          </div>
                          <div>
                            {this.state.addressItem.total_Revenue || "-"}
                          </div>
                        </div>
                        <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Total Orders From Community:
                          </div>
                          <div>
                            {this.state.addressItem.total_orders || "-"}
                          </div>
                        </div>

                        {/* <div className="flex-row mr-t-10 font-size-14">
                          <div className="mr-r-10 width-200">
                            Total Community Earnings:
                          </div>
                          <div>
                            {this.state.addressItem.community_earnings || "-"}
                          </div>
                        </div> */}
                      </div>
                    </Col>
                  </Row>
                </div>
              ) : (
                <form>
                  <div className="flex-row mr-t-10">
                    <div className="mr-r-20" style={{ flexGrow: "0.2" }}>
                      Location
                    </div>
                    <MapContainer
                      handleLatlng={this.handleLatlng}
                      style={{ flexGrow: "1" }}
                      editMap={this.state.isEdit || this.state.isadd}
                      address={"You"}
                      clocation={false}
                      zonearea={[]}
                      lat={parseFloat(this.state.lat)}
                      lng={parseFloat(this.state.lng)}
                      refresh={this.state.mapRefresh}
                    />
                  </div>
                  <div className="flex-row mr-t-10 font-size-14">
                    <div
                      className="mr-r-10 width-100"
                      style={{ flexGrow: "3.2" }}
                    >
                      <div className="pd-0 border-none">
                        Lat, Long:
                        <span className="must width-25">*</span>
                      </div>
                    </div>
                    <div style={{ flexGrow: "2" }} className="mr-r-10">
                      {this.state.lat + "," + this.state.lng}
                    </div>
                    <div style={{ flexGrow: "1" }}>
                      <Button
                        size="sm"
                        hidden={true}
                        onClick={this.onEdit}
                        className="width-100"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                  <div className="flex-row mr-t-10 font-size-14">
                    <div className="mr-r-10 width-100">
                      <div className="pd-0 border-none">
                        Community name :<span className="must width-25">*</span>
                      </div>
                    </div>
                    <div>
                      <Field
                        name="community_name"
                        autoComplete="off"
                        type="text"
                        disabled={this.state.isApprove}
                        component={InputField}
                        validate={[required, requiredTrim]}
                      />
                    </div>
                  </div>
                  <div className="flex-row mr-t-10 font-size-14">
                    <div className="mr-r-10 width-100">
                      <div className="pd-0 border-none">
                        Area : <span className="must width-25">*</span>
                      </div>
                    </div>
                    <div>
                      <Field
                        name="area"
                        autoComplete="off"
                        type="text"
                        disabled={this.state.isApprove}
                        component={InputField}
                        validate={[required, requiredTrim]}
                      />
                    </div>
                  </div>
                  <div className="flex-row mr-t-10 font-size-14">
                    <div className="mr-r-10 width-100">
                      <div className="pd-0 border-none">
                        No. Of apartments :
                        {/* <span className="must width-25">*</span> */}
                      </div>
                    </div>
                    <div>
                      <Field
                        name="noofapartments"
                        autoComplete="off"
                        type="numbr"
                        disabled={this.state.isApprove}
                        component={InputField}
                      />
                    </div>
                  </div>
                  <div className="flex-row mr-t-10 font-size-12">
                    <div className="mr-r-10 width-100">
                      <div className="pd-0 border-none">
                        Community address :
                        <span className="must width-25">*</span>
                      </div>
                    </div>
                    <div>
                      <Field
                        name="community_address"
                        autoComplete="off"
                        type="text"
                        disabled={this.state.isApprove}
                        component={InputField}
                        validate={[required,requiredTrim]}
                      />
                    </div>
                  </div>
                  <div
                    className="flex-row mr-t-10 font-size-12"
                    hidden={this.state.isadd}
                  >
                    <div className="mr-r-10 width-100">
                      <div className="pd-0 border-none">
                        Enter community WhatsApp group link :
                        {/* <span className="must width-25">*</span> */}
                      </div>
                    </div>
                    <div>
                      <Field
                        name="whatsapp_link"
                        autoComplete="off"
                        type="text"
                        disabled={this.state.isApprove}
                        component={InputField}
                      />
                    </div>
                  </div>
                  <div className="flex-row mr-t-10 font-size-14">
                      <div className="mr-r-10 width-200 border-none">
                        Community Created By:
                      </div>
                      <div className="border-none">
                        {this.state.addressItem.request_type===2?"User":"Admin"}
                      </div>
                    </div>
                  <div hidden={!this.state.isApprove || this.state.addressItem.request_type===2} className="flex-column">
                    <div className="flex-row mr-t-10 font-size-14">
                      <div className="mr-r-10 width-200 border-none">
                        Registered user name:
                      </div>
                      <div className="border-none">
                        {this.state.addressItem.name || "-"}
                      </div>
                    </div>

                    <div className="flex-row mr-t-10 font-size-14">
                      <div className="mr-r-10 width-200 border-none">
                        User house number:
                      </div>
                      <div className="border-none">
                        {this.state.addressItem.flat_no || "-"}
                      </div>
                    </div>

                    <div className="flex-row mr-t-10 font-size-14">
                      <div className="mr-r-10 width-200 border-none">
                        User Floor number:
                      </div>
                      <div className="border-none">
                        {this.state.addressItem.floor_no || "-"}
                      </div>
                    </div>

                    <div className="flex-row mr-t-10 font-size-14">
                      <div className="mr-r-10 width-200 border-none">
                        User profile picture:
                      </div>

                      <div className="border-none">
                        {this.state.addressItem.profile_image ? (
                          <div>
                            <a
                              id="img1"
                              href={this.state.addressItem.profile_image}
                              download
                              hidden
                              target="_blank"
                            ></a>
                            <Button
                              size="sm"
                              color="link"
                              onClick={() => this.ImageDownload("img1")}
                            >
                              <FaDownload size="15" />
                            </Button>
                          </div>
                        ) : (
                          "-"
                        )}
                      </div>
                    </div>
                  </div>
                </form>
              )
            )
            ) : (
              ""
            )}
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button
              size="sm"
              className="mr-r-10"
              onClick={this.props.handleSubmit(this.submit)}
              hidden={this.state.isView}
            >
              Submit
            </Button>
            <Button
              size="sm"
              onClick={this.toggleCommunityView}
              className="mr-r-10"
            >
              Close
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

CommunityUser = reduxForm({
  form: COMMUNITY_FORM,
})(CommunityUser);
export default connect(mapStateToProps, mapDispatchToProps)(CommunityUser);
