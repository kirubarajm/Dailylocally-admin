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
import { FaDownload } from "react-icons/fa";
import Moment from "moment";
import AxiosRequest from "../AxiosRequest";
import DateRangePicker from "react-bootstrap-daterangepicker";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import { store } from "../store";
import Search from "../components/Search";
import {
  PROCUREMENT_LIST,
  PROCUREMENT_REPORT,
  MOVE_TO_PO_WAITING,
  ON_CLEAR_PO_WAITING,
  WARE_HOUSE_SELECTED_TAB,
  ZONE_ITEM_REFRESH,
  MOVE_TO_PO_STOCK,
} from "../constants/actionTypes";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import PaginationComponent from "react-reactstrap-pagination";
import { CSVLink } from "react-csv";

const mapStateToProps = (state) => ({
  ...state.procurement,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetProcurement: (data) =>
    dispatch({
      type: PROCUREMENT_LIST,
      payload: AxiosRequest.Warehouse.procurementwaitinglist(data),
    }),
    onGetProcurementReport: (data) =>
    dispatch({
      type: PROCUREMENT_REPORT,
      payload: AxiosRequest.Warehouse.procurementwaitingreport(data),
    }),
    
  onCreatePo: (data) =>
    dispatch({
      type: MOVE_TO_PO_WAITING,
      payload: AxiosRequest.Warehouse.createPo(data),
    }),
  onMovetoStock: (data) =>
    dispatch({
      type: MOVE_TO_PO_STOCK,
      payload: AxiosRequest.Warehouse.movetoStock(data),
    }),
  onRemovePr: (data) =>
    dispatch({
      type: MOVE_TO_PO_STOCK,
      payload: AxiosRequest.Warehouse.movetoPRRemove(data),
    }),
  onClear: () =>
    dispatch({
      type: ON_CLEAR_PO_WAITING,
    }),
});

class Procurement extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      selected_procument: false,
      selectedPage: 1,
      pr_createdate: false,
      enddate: false,
      search: "",
      itemid: false,
      today: Moment(new Date()),
      isprocur: false,
      itemid_refresh: false,
      isReport:false
    };
  }

  UNSAFE_componentWillMount() {
    this.startSelect = this.startSelect.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchInput = this.onSearchInput.bind(this);
    this.movetopo = this.movetopo.bind(this);
    this.togglePoPopUp = this.togglePoPopUp.bind(this);
    this.confirmTopo = this.confirmTopo.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.onGetProcumentList = this.onGetProcumentList.bind(this);
    this.onGetProcumentList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }
    if (this.props.movetoStock) {
      this.setState({ isLoading: false });
      this.props.onClear();
    }

    if (this.props.procurementreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }
    this.onGetProcumentList();

    if (this.props.movetopo) {
      this.props.onClear();
      this.props.history.push("/vendor-assign");
      store.dispatch({ type: WARE_HOUSE_SELECTED_TAB, tab_type: 2 });
    }
  }
  componentDidCatch() {}
  onGetProcumentList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.itemcode) data.vpid = this.state.itemcode;
      if (this.state.pr_createdate) data.from_date = this.state.pr_createdate;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      if (this.state.enddate) data.to_date = this.state.enddate;
      this.props.onGetProcurement(data);
    }
  };
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
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ pr_createdate: startdate, enddate: enddate });
  };

  togglePoPopUp = () => {
    this.setState({
      isprocur: !this.state.isprocur,
    });
  };
  toggleStockPopUp = () => {
    this.setState({
      isstock: !this.state.isstock,
    });
  };

  confirmTopo = () => {
    var checkItem = this.state.selected_procument;
    delete checkItem["selectall"];
    var Values = Object.keys(checkItem);
    this.props.onCreatePo({
      pridlist: Values,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  };

  confirmToStock = () => {
    this.toggleStockPopUp();
    if (this.state.isAutoStock) {
      this.props.onMovetoStock({
        zoneid: this.props.zoneItem.id,
        done_by: getAdminId(),
      });
    } else {
      this.props.onRemovePr({
        zoneid: this.props.zoneItem.id,
        done_by: getAdminId(),
      });
    }
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

  movetoStock = (isStock) => {
    this.setState({ isAutoStock: isStock });
    this.toggleStockPopUp();
  };

  onSearchInput = (e) => {
    const value = e.target.value || "";
    this.setState({ itemcode: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };

  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
  };
  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };

  onReset = () => {
    this.setState({
      pr_createdate: false,
      selectedPage: 1,
      search: "",
      enddate: false,
      itemcode: "",
      itemid_refresh: true,
    });
    this.setState({ isLoading: false });
  };

  onSuccessRefresh = () => {
    this.setState({ itemid_refresh: false });
  };

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    if (this.state.itemcode) data.vpid = this.state.itemcode;
    if (this.state.pr_createdate) data.from_date = this.state.pr_createdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
      data.report=1;

    this.props.onGetProcurementReport(data);
  };

  render() {
    const procurmentlist = this.props.procurmentlist || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Procurement - Search</div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10">Date/Time: </div>
                  <DateRangePicker
                    opens="right"
                    maxDate={this.state.today}
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
                  {this.state.pr_createdate
                    ? Moment(this.state.pr_createdate).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
                  {this.state.pr_createdate
                    ? " - " + Moment(this.state.enddate).format("DD/MM/YYYY")
                    : ""}
                </div>
              </Col>
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center">
                    Product Name/Code :{" "}
                  </div>
                  <Search
                    onSearch={this.onSearchInput}
                    type="text"
                    onRefreshUpdate={this.onSuccessRefresh}
                    isRefresh={this.state.itemid_refresh}
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
            <Row className="mr-r-5">
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
              <Col className="txt-align-right pd-0">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("wh_procurement_export")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>

                <CSVLink
                  data={this.props.procurementreport}
                  filename={"ProcurementReport.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>

                <Button
                  size="sm"
                  hidden={onActionHidden("wh_moveto_st")}
                  onClick={() => this.movetoStock(true)}
                  className="mr-r-20"
                >
                  Use existing stock
                </Button>
                <Button
                  size="sm"
                  onClick={() => this.movetoStock(false)}
                  hidden={onActionHidden("wh_remove_proc")}
                  className="mr-r-20"
                >
                  Remove Procurement
                </Button>
                <Button
                  size="sm"
                  onClick={this.movetopo}
                  hidden={onActionHidden("wh_purchase_order")}
                >
                  + Purchase order
                </Button>
              </Col>
            </Row>
            <div className="search-scroll-pr">
              <Table>
                <thead>
                  <tr>
                    {/* <th>View</th> */}
                    <th>Select</th>
                    <th>Date/Time</th>
                    <th>Product name</th>
                    <th>Product code</th>
                    <th>UOM</th>
                    <th>BOH remaining</th>
                    <th>BOH mapped</th>
                    <th>required quantity</th>
                    <th>Procurement quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {procurmentlist.map((item, i) => (
                    <tr key={i}>
                      {/* <td>
                        {
                          <FaEye
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        }
                      </td> */}
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
                      <td>{item.productname}</td>
                      <td>{item.vpid}</td>
                      <td>{item.uom_name}</td>
                      <td>{item.boh_remaining}</td>
                      <td>{item.boh_mapped}</td>
                      <td>{item.required_quantity}</td>
                      <td>{item.procurement_quantity}</td>
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

        <Modal
          isOpen={this.state.isstock}
          toggle={this.toggleStockPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleStockPopUp}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            {this.state.isAutoStock
              ? "Are you sure you want to move to auto stock?"
              : "Are you sure you want to remove procurment?"}
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleStockPopUp}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmToStock}>
              YES
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Procurement);
