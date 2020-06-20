import React from "react";
import { connect } from "react-redux";
import { Row, Col, Table, Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { FaEye, FaRegFilePdf, FaTrashAlt } from "react-icons/fa";
import { PO_LIST } from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Search from "../components/Search";
import Searchnew from "../components/Searchnew";

const mapStateToProps = (state) => ({
  ...state.po,
  zoneItem: state.warehouse.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onGetPoList: (data) =>
    dispatch({
      type: PO_LIST,
      payload: AxiosRequest.Warehouse.getPoList(data),
    }),
});

class Po extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      search_refresh: false,
      pono: false,
      supplier_name: false,
      po_createdate: false,
      due_date: false,
      today: Moment(new Date()),
      isOpenRecevingDropDown:false,
      isOpenpoDropDown:false,
      recevingItem:{ id: -1, name: "All" },
      postatusItem:{ id: -1, name: "All" }
    };
  }

  UNSAFE_componentWillMount() {
    this.onGetPoList = this.onGetPoList.bind(this);
    this.pocreateDate = this.pocreateDate.bind(this);
    this.dueDate = this.dueDate.bind(this);
    this.onSearchPOno = this.onSearchPOno.bind(this);
    this.onSearchSupplier = this.onSearchSupplier.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.toggleRecevingDropDown = this.toggleRecevingDropDown.bind(this);
    this.togglePoDropDown = this.togglePoDropDown.bind(this);
    this.clickReceving = this.clickReceving.bind(this);
    this.clickPostatus = this.clickPostatus.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onGetPoList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetPoList();
  }
  componentDidCatch() {}

  onGetPoList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetPoList({
        zone_id: this.props.zoneItem.id,
      });
    }
  };
  onSearchPOno = (e) => {
    const value = e.target.value || "";
    this.setState({ pono: value });
  };
  onSearchSupplier = (e) => {
    const value = e.target.value || "";
    this.setState({ supplier_name: value });
  };

  pocreateDate = (event, picker) => {
    var po_createdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ po_createdate: po_createdate });
  };

  dueDate = (event, picker) => {
    var due_date = picker.startDate.format("YYYY-MM-DD");
    this.setState({ due_date: due_date });
  };
  toggleRecevingDropDown = () => {
    this.setState({
      isOpenRecevingDropDown: !this.state.isOpenRecevingDropDown,
    });
  };

  togglePoDropDown = () => {
    this.setState({
      isOpenpoDropDown: !this.state.isOpenpoDropDown,
    });
  };

  clickReceving = (item) => {
    this.setState({ recevingItem: item });
  };
  clickPostatus = (item) => {
    this.setState({ postatusItem: item });
  };
  

  onSearch = () => {
    var data = {
      zone_id: this.props.zoneItem.id,
    };
    if (this.state.po_createdate) data.date = this.state.po_createdate;
    if (this.state.supplier_name) data.vid = this.state.supplier_name;
    if (this.state.due_date) data.due_date = this.state.due_date;
    if (this.state.pono) data.poid = this.state.pono;
    if (this.state.postatusItem&&this.state.postatusItem.id!==-1) 
    data.po_status = this.state.postatusItem.id;
    if (this.state.recevingItem&&this.state.recevingItem.id!==-1) 
    data.pop_status = this.state.recevingItem.id;
    this.props.onGetPoList(data);
  };

  onReset = () => {
    this.setState({
      po_createdate: false,
      due_date: false,
      pono: "",
      supplier_name:"",
      search_refresh: true,
      recevingItem:{ id: -1, name: "All" },
      postatusItem:{ id: -1, name: "All" }
    });
    var data = {
      zone_id: this.props.zoneItem.id,
    };
    this.props.onGetPoList(data);
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };

  render() {
    const poList = this.props.poList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset width-84">
            <div className="legend">Purchase Order - Search</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    PO No :{" "}
                  </div>
                  <Search
                    onSearch={this.onSearchPOno}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.search_refresh}
                  />
                </div>
              </Col>
              <Col lg="3" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Date Created: </div>
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    maxDate={this.state.today}
                    drops="down"
                    onApply={this.pocreateDate}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                  </DateRangePicker>
                  {this.state.po_createdate
                    ? Moment(this.state.po_createdate).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                </div>
              </Col>

              <Col lg="3" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Receiving Status: </div>
                  <ButtonDropdown
                  className="max-height-30"
                  isOpen={this.state.isOpenRecevingDropDown}
                  toggle={this.toggleRecevingDropDown}
                  size="sm"
                >
                  <DropdownToggle caret>
                    {this.state.recevingItem
                    ? this.state.recevingItem.name: ""}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.receving.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.clickReceving(item)}
                        key={index}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
                </div>
              </Col>
            </Row>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    Supplier Name :{" "}
                  </div>
                  <Searchnew
                    onSearch={this.onSearchSupplier}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.search_refresh}
                  />
                </div>
              </Col>
              <Col lg="3" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Due Date: </div>
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    maxDate={this.state.today}
                    drops="down"
                    onApply={this.dueDate}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                  </DateRangePicker>
                  {this.state.due_date
                    ? Moment(this.state.due_date).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                </div>
              </Col>

              <Col lg="3" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Po Status: </div>
                  <ButtonDropdown
                  className="max-height-30"
                  isOpen={this.state.isOpenpoDropDown}
                  toggle={this.togglePoDropDown}
                  size="sm"
                >
                  <DropdownToggle caret>
                    {this.state.postatusItem
                    ? this.state.postatusItem.name: ""}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.postatus.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.clickPostatus(item)}
                        key={index}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
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
            <div className="search-horizantal-scroll">
              <div className="search-vscroll">
                <Table style={{ width: "2000px" }}>
                  <thead>
                    <tr>
                      <th>PDF</th>
                      <th>View</th>
                      <th>Delete</th>
                      <th>Close PO</th>
                      <th>PO No</th>
                      <th>Supplier Name</th>
                      <th>Supplier Code</th>
                      <th>Date Created</th>
                      <th>PO Line</th>
                      <th>Total Quantity</th>
                      <th>Open Quantity </th>
                      <th>Received Quantity </th>
                      <th>Amt </th>
                      <th>Due Date/Time</th>
                      <th>PO Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <FaRegFilePdf
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <FaEye
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <FaTrashAlt
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <Button className="btn-close">Close</Button>
                        </td>
                        <td>{item.poid}</td>
                        <td>{item.name}</td>
                        <td>{item.vid}</td>
                        <td>
                          {Moment(item.created_at).format(
                            "DD-MMM-YYYY/hh:mm a"
                          )}
                        </td>
                        <td>{item.open_quqntity}</td>
                        <td>{item.total_quantity}</td>
                        <td>{item.open_quqntity}</td>
                        <td>{item.received_quantity}</td>
                        <td>{item.cost}</td>
                        <td>
                          {Moment(item.due_date).format(
                            "DD-MMM-YYYY/hh:mm a"
                          )}
                        </td>
                        <td>{item.po_status===0?"Open":"Close"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Po);
