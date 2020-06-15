import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  ModalBody,
  ModalHeader,
  Modal,
  ModalFooter,
} from "reactstrap";
import Moment from "moment";
import AxiosRequest from "../AxiosRequest";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { FaEye } from "react-icons/fa";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
import {
  PROCUREMENT_LIST,
  MOVE_TO_PO_WAITING,
  ON_CLEAR_PO_WAITING,
  WARE_HOUSE_SELECTED_TAB,
} from "../constants/actionTypes";

const mapStateToProps = (state) => ({
  ...state.procurement,
  zoneItem: state.warehouse.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onGetProcurement: (data) =>
    dispatch({
      type: PROCUREMENT_LIST,
      payload: AxiosRequest.Warehouse.procurementwaitinglist(data),
    }),
  onCreatePo: (data) =>
    dispatch({
      type: MOVE_TO_PO_WAITING,
      payload: AxiosRequest.Warehouse.createPo(data),
    }),
  onClear: () =>
    dispatch({
      type: ON_CLEAR_PO_WAITING,
    }),
});

var today;
class Procurement extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      selected_procument: false,
      pr_createdate: false,
      enddate: false,
      search: "",
      itemid: false,
      isprocur: false,
      itemid_refresh: false,
    };
  }

  UNSAFE_componentWillMount() {
    today = Moment(new Date()).format("YYYY-MM-DD");
    this.startSelect = this.startSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.movetopo = this.movetopo.bind(this);
    this.togglePoPopUp = this.togglePoPopUp.bind(this);
    this.confirmTopo = this.confirmTopo.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.onGetProcumentList=this.onGetProcumentList.bind(this);
    this.onGetProcumentList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetProcumentList();

    if (this.props.movetopo) {
      this.props.onClear();
      this.props.history.push("/warehouse/po");
      store.dispatch({ type: WARE_HOUSE_SELECTED_TAB, tab_type: 2 });
    }
  }
  componentDidCatch() {}
  onGetProcumentList =()=>{
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetProcurement({
        zoneid: this.props.zoneItem.id,
      });
    }
  }
  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_procument || [];
    const procurmentlist = this.props.procurmentlist || [];
    if (name === "selectall") {
      if (value) {
        arvalue[name] = value;
        procurmentlist.map((item, i) => {
          arvalue[item.prid] = value;
        });
      } else {
        arvalue = {};
      }
    } else {
      if (value) {
        arvalue[name] = value;
        var allCheck = true;
        procurmentlist.map((item, i) => {
          if (!arvalue[item.prid]) {
            allCheck = false;
          }
        });
        if (allCheck) arvalue["selectall"] = value;
      } else {
        if (arvalue["selectall"]) {
          delete arvalue["selectall"];
        }
        delete arvalue[name];
      }
    }

    this.setState({
      selected_procument: arvalue,
    });
  }

  startSelect = (event, picker) => {
    var pr_createdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ pr_createdate: pr_createdate });
  };

  togglePoPopUp = () => {
    this.setState({
      isprocur: !this.state.isprocur,
    });
  };

  confirmTopo = () => {
    var checkItem = this.state.selected_procument;
    delete checkItem["selectall"];
    var Values = Object.keys(checkItem);
    this.props.onCreatePo({
      pridlist: Values,
      zoneid: this.props.zoneItem.id,
    });
  };
  movetopo = () => {
    var checkItem = this.state.selected_procument;
    var Values = Object.keys(checkItem);
    if (Values.length > 0) {
      this.togglePoPopUp();
    } else {
      notify.show(
        "Please select the Items after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };
  onSearchInput = (e) => {
    const value = e.target.value || "";
    this.setState({ itemcode: value });
  };

  onSearch = () => {
    var data = {
      zoneid: this.props.zoneItem.id,
      starting_date: this.state.pr_createdate,
    };
    if (this.state.itemcode) data.itemcode = this.state.itemcode;
    this.props.onGetProcurement(data);
  };

  onReset = () => {
    this.setState({
      pr_createdate: "",
      itemid: "",
      itemid_refresh: true,
    });
  };

  onSuccessRefresh = () => {
    this.setState({ itemid_refresh: false });
  };

  render() {
    const procurmentlist = this.props.procurmentlist || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Procurement - Search</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="2" className="pd-0">
                Date/Time:{" "}
                <DateRangePicker
                  opens="right"
                  singleDatePicker
                  maxDate={today}
                  drops="down"
                  onApply={this.startSelect}
                >
                  <Button
                    className="mr-r-10"
                    style={{ width: "30px", height: "30px", padding: "0px" }}
                  >
                    <i className="far fa-calendar-alt"></i>
                  </Button>
                </DateRangePicker>
              </Col>
              <Col lg="1" className="pd-0">
                <span className="mr-l-10">
                  {this.state.pr_createdate
                    ? Moment(this.state.pr_createdate).format("DD/MM/YYYY")
                    : ""}
                </span>
              </Col>
              <Col lg="2">
                <div>Item/Item Code : </div>{" "}
              </Col>
              <Col lg="3">
                <Search
                  onSearch={this.onSearchInput}
                  type="text"
                  onRefreshUpdate={this.onSuccessRefresh}
                  isRefresh={this.state.itemid_refresh}
                />
              </Col>
              <Col lg="2"></Col>
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
              <Col>
                <div className="pd-6">
                  <div>
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name="selectall"
                        checked={this.state.selected_procument["selectall"]}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>
                  <div className="font-size-12 mr-l-20">{" Select All "}</div>
                </div>
              </Col>
              <Col className="txt-align-right">
                <Button size="sm" onClick={this.movetopo}>
                  + Purchase order
                </Button>
              </Col>
            </Row>
            <div className="search-scroll">
              <Table>
                <thead>
                  <tr>
                    <th>View</th>
                    <th>Select</th>
                    <th>Date/Time</th>
                    <th>Item name</th>
                    <th>Item code</th>
                    <th>UOM</th>
                    <th>BOH</th>
                    <th>required quantity</th>
                    <th>Procurement quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {procurmentlist.map((item, i) => (
                    <tr key={i}>
                      <td>
                        {
                          <FaEye
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        }
                      </td>
                      <td>
                        <label className="container-check">
                          <input
                            type="checkbox"
                            name={"" + item.prid}
                            checked={this.state.selected_procument[item.prid]}
                            onChange={(e) => this.handleChange(e)}
                          />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </td>
                      <td>
                        {Moment(item.created_at).format("DD-MMM-YYYY/hh:mm a")}
                      </td>
                      <td>{item.Productname}</td>
                      <td>{item.vpid}</td>
                      <td>{item.unit_name}</td>
                      <td>{item.boh}</td>
                      <td>{item.quantity}</td>
                      <td>{item.procurement_quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.isprocur}
          toggle={this.togglePoPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.togglePoPopUp}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to selected items move to the purchase?
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.togglePoPopUp}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmTopo}>
              YES
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Procurement);
