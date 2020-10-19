import React from "react";
import { connect } from "react-redux";
import { FaEye, FaRegEdit, FaTrashAlt, FaDownload } from "react-icons/fa";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import PaginationComponent from "react-reactstrap-pagination";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import Select from "react-dropdown-select";
import {
  STOCK_L1CATEGORY_LIST,
  STOCK_CATEGORY_LIST,
  STOCK_KEEPING_CLEAR,
  ZONE_ITEM_REFRESH,
  WASTAGE_LIST,
  ZONE_SELECT_ITEM,
  STOCK_KEEPING_DELETE,
  STOCK_KEEPING_VIEW,
  STOCK_KEEPING_EDIT,
  WASTAGE_REPORT,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SearchItem from "../components/SearchItem";
import { store } from "../store";
import StockAddFrom from "./StockAddFrom";
import { CSVLink } from "react-csv";

function CardRowCol(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="font-size-14 mr-l-10 pd-4">
        <Col lg="4" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="1" className="color-grey pd-0">
          {":"}
        </Col>
        <Col lg="6" style={{ color: color }} className="pd-l-0">
          {props.value}
        </Col>
      </Row>
    );
  }

  return <div />;
}

function CardRowColImage(props) {
  var lable = props.lable ? props.lable : "";
  if (props.value !== null) {
    return (
      <Row className="mr-l-10 pd-4 font-size-14">
        <Col lg="4" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="1" className="color-grey pd-0">
          {" "}
        </Col>
        <Col lg="6" className="pd-l-0">
          <img
            hidden={!props.value}
            src={props.value}
            className="product_detail_image"
            alt="WastageImage"
          ></img>
        </Col>
      </Row>
    );
  }

  return <div />;
}

const InputSearchDropDown = ({
  onSelection,
  options,
  label,
  labelField,
  searchable,
  searchBy,
  values,
  disabled,
  clearable,
  noDataLabel,
  valueField,
}) => {
  return (
    <Row className="pd-0">
      <div
        className="border-none"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className="mr-0"
          style={{
            border: "1px solid #000",
            height: "auto",
            width: "210px",
            marginLeft: "-6px",
            marginRight: "12px",
          }}
        >
          <Select
            options={options}
            labelField={labelField}
            searchable={searchable}
            searchBy={searchBy}
            values={[...values]}
            noDataLabel={noDataLabel}
            valueField={valueField}
            dropdownHeight={"300px"}
            disabled={disabled}
            onChange={(value) => {
              onSelection(value);
            }}
          />
        </div>
      </div>
    </Row>
  );
};

const mapStateToProps = (state) => ({
  ...state.wastage,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetSubCat1: (data) =>
    dispatch({
      type: STOCK_L1CATEGORY_LIST,
      payload: AxiosRequest.Catelog.getSubCate1(data),
    }),
  onGetCategory: (data) =>
    dispatch({
      type: STOCK_CATEGORY_LIST,
      payload: AxiosRequest.Catelog.getCategory(data),
    }),
    onGetWastageList: (data) =>
    dispatch({
      type: WASTAGE_LIST,
      payload: AxiosRequest.StockKeeping.getWastageList(data),
    }),
  onGetWastageReport: (data) =>
    dispatch({
      type: WASTAGE_REPORT,
      payload: AxiosRequest.StockKeeping.getWastageList(data),
    }),
  onGetDeleteStock: (data) =>
    dispatch({
      type: STOCK_KEEPING_DELETE,
      payload: AxiosRequest.StockKeeping.deleteStockKeeping(data),
    }),
  onGetViewStock: (data) =>
    dispatch({
      type: STOCK_KEEPING_VIEW,
      payload: AxiosRequest.StockKeeping.viewStockKeeping(data),
    }),
  onGetEditStock: (data) =>
    dispatch({
      type: STOCK_KEEPING_EDIT,
      payload: AxiosRequest.StockKeeping.editStockKeeping(data),
    }),
  onClear: () =>
    dispatch({
      type: STOCK_KEEPING_CLEAR,
    }),
});

class Wastage extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      startdate: false,
      enddate: false,
      product_name: false,
      category: [],
      l1category: [],
      search_refresh: false,
      selectedCatItem: false,
      selectedL1CatItem: false,
      today: Moment(new Date()),
      isConfrimModal: false,
      selectedPage: 1,

      poid_refresh: false,
      recevingModal: false,
      receivingSelection: [],
      pono: false,
      supplier_name: false,
      item_name: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.selectedCat = this.selectedCat.bind(this);
    this.selectedL1Cat = this.selectedL1Cat.bind(this);
    this.onWastageList = this.onWastageList.bind(this);
    this.stockDate = this.stockDate.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onReset = this.onReset.bind(this);
    this.onSearchItem = this.onSearchItem.bind(this);
    this.addstockKeeping = this.addstockKeeping.bind(this);
    this.onSuccessRefresh = this.onSuccessRefresh.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onReceivingModal = this.onReceivingModal.bind(this);
    this.selectedReceiving = this.selectedReceiving.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.submit = this.submit.bind(this);
    this.onSearchPOno = this.onSearchPOno.bind(this);
    this.onSearchSupplier = this.onSearchSupplier.bind(this);
    this.toggleConfirmPopup = this.toggleConfirmPopup.bind(this);
    this.toggleOrderView = this.toggleOrderView.bind(this);
    this.onView = this.onView.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onValidationModal = this.onValidationModal.bind(this);
    this.props.onGetCategory({ zoneid: this.props.zoneItem.id || 1 });
    this.onWastageList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  onValidationModal = () => {
    this.setState((prevState) => ({
      validateModal: !prevState.validateModal,
    }));
  };

  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.zoneRefresh) {
      store.dispatch({ type: ZONE_ITEM_REFRESH });
      this.setState({ isLoading: false });
    }

    if (this.props.stock_keeping_delete) {
      this.props.onClear();
      this.setState({ isLoading: false });
    }

    if (this.props.wastage_report.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    this.onWastageList();
  }
  componentDidCatch() {}

  onWastageList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.category.length > 0)
        data.catagorysearch = this.state.category[0].catid;
      if (this.state.l1category.length > 0)
        data.subcategorysearch = this.state.l1category[0].scl1_id;
      if (this.state.startdate) data.from_date = this.state.startdate;
      if (this.state.enddate) data.to_date = this.state.enddate;
      if (this.state.product_name) data.productsearch = this.state.product_name;
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      this.props.onGetWastageList(data);
    }
  };
  selectedCat = (item) => {
    this.setState({ category: item });
    if (item.length > 0)
      this.props.onGetSubCat1({
        catid: item[0].catid,
        zoneid: this.props.zoneItem.id || 1,
      });
  };

  selectedL1Cat = (item) => {
    this.setState({ l1category: item });
  };

  stockDate = (event, picker) => {
    var startdate = picker.startDate.format("YYYY-MM-DD");
    var enddate = picker.endDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate,enddate:enddate });
  };

  addstockKeeping = () => {
    this.props.history.push("/stock-keeping-add");
  };

  onSearchItem = (e) => {
    const value = e.target.value || "";
    this.setState({ product_name: value });
  };

  onSearch = () => {
    this.setState({ isLoading: false, selectedPage: 1 });
  };

  onReset = () => {
    this.setState({
      startdate: false,
      enddate: false,
      product_name: "",
      selectedPage: 1,
      category: [],
      l1category: [],
      search_refresh: true,
      isOpenAreaDropDown: false,
    });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    
    this.props.onGetWastageList(data);
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };
  toggleOrderView = () => {
    this.setState({
      isViewModal: !this.state.isViewModal,
    });
  };

  onView = (Item) => {
    this.setState({ view_item: Item });
    this.props.onGetViewStock({
      zoneid: this.props.zoneItem.id,
      skid: Item.skid,
    });
    this.toggleOrderView();
  };

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  onDelete = (Item) => {
    this.setState({ select_item: Item });
    this.toggleConfirmPopup();
  };

  onEdit = (Item) => {
    this.setState({ select_edit_item: Item });
    this.onValidationModal();
  };

  onUpdate = () => {
    this.setState({ isLoading: false });
  };

  toggleConfirmPopup = () => {
    this.setState({
      isConfrimModal: !this.state.isConfrimModal,
    });
  };

  onActionClick = (item) => (ev) => {
    this.props.onFromClear();
    this.setState({ selectedItem: item });
    this.onReceivingModal();
  };
  selectedReceiving = (item) => {
    this.setState({ receivingSelection: item });
  };
  onSearchPOno = (e) => {
    const value = e.target.value || "";
    this.setState({ pono: value });
  };
  onSearchSupplier = (e) => {
    const value = e.target.value || "";
    this.setState({ supplier_name: value });
  };
  onReceivingModal = () => {
    this.setState((prevState) => ({
      recevingModal: !prevState.recevingModal,
    }));
  };
  confirmTo = () => {
    var dData = {};
    dData.zoneid = this.props.zoneItem.id;
    dData.skid = this.state.select_item.skid;
    dData.done_by = getAdminId();
    this.props.onGetDeleteStock(dData);
    this.toggleConfirmPopup();
  };

  submit = (data) => {
    var data1 = {
      zoneid: this.props.zoneItem.id,
      popid: this.state.selectedItem.popid,
      vpid: this.state.selectedItem.vpid,
      quantity: data.item_quantity,
      delivery_note: data.delivery_note,
      done_by: getAdminId(),
    };
    if (this.state.receivingSelection.length > 0) {
      data1.action_id = this.state.receivingSelection[0].id;
    }
    this.props.onUpdateList(data1);
  };

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    if (this.state.category.length > 0)
      data.catagorysearch = this.state.category[0].catid;
    if (this.state.l1category.length > 0)
      data.subcategorysearch = this.state.l1category[0].scl1_id;
    if (this.state.startdate) data.from_date = this.state.startdate;
    if (this.state.enddate) data.to_date = this.state.enddate;
    if (this.state.product_name) data.productsearch = this.state.product_name;

    data.report=1;

    this.props.onGetWastageReport(data);
  };
  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };
  render() {
    const wastage_list = this.props.wastage_list || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">
              Cycle count classification search criteria
            </div>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    Category :{" "}
                  </div>
                  <InputSearchDropDown
                    name="cat_id"
                    options={this.props.category_list}
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="catid"
                    noDataLabel="No matches found"
                    values={this.state.category}
                    onSelection={this.selectedCat}
                    label="Category"
                  />
                </div>
              </Col>
              <Col lg="4" className="pd-0">
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div className="mr-r-10 width-120">Date: </div>
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
            </Row>
            <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                    L1 Category :{" "}
                  </div>
                  <InputSearchDropDown
                    name="scl1_id"
                    options={this.props.subcat_L1}
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="scl1_id"
                    noDataLabel="No matches found"
                    values={this.state.l1category}
                    onSelection={this.selectedL1Cat}
                    label="Category"
                  />
                </div>
              </Col>

              <Col lg="4" className="pd-0">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="mr-r-10 flex-row-vertical-center width-120">
                  Product name :{" "}
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
                  data={this.props.wastage_report}
                  filename={"wastage_report.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
              </Col>
            </Row>
              <div className="search-vscroll mr-t-10">
                <Table style={{ width: "2000px" }}>
                  <thead>
                    <tr>
                      <th>Product id</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>L1 Category</th>
                      <th>Wastage source</th>
                      <th>UOM</th>
                      <th>Wastage</th>
                      <th>Cost of wastage (₹)</th>
                      <th>Entry date/time</th>
                      <th>Waste till now</th>
                      <th>Cost of waste till now (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wastage_list.map((item, i) => (
                      <tr key={i}>
                        
                        <td className="txt-align-center">{item.vpid}</td>
                        <td>{item.productname}</td>
                        <td>{item.category_name}</td>
                        <td>{item.subcategoryl1_name}</td>
                        <td>{item.from_type}</td>
                        <td>{item.uom}</td>
                        <td>{item.quantity}</td>
                        <td>{item.cost}</td>
                        <td>{Moment(item.created_at).format("DD-MMM-YYYY")}</td>
                        <td>{item.waste_tillnow}</td>
                        <td>{item.cost_tillnow}</td>
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
          isOpen={this.state.isConfrimModal}
          toggle={this.togglePoPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleConfirmPopup}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to delete the Stock Item?
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleConfirmPopup}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmTo}>
              YES
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.isViewModal}
          toggle={this.toggleOrderView}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleOrderView}
            className="pd-10 border-none"
          ></ModalHeader>
          <ModalBody className="pd-10">
            <CardRowCol
              lable={"Category Name"}
              value={this.props.stock_keeping_view.category_name}
            />
            <CardRowCol
              lable={"L1Category Name"}
              value={this.props.stock_keeping_view.subcategoryl1_name}
            />
            <CardRowCol
              lable={"L2Category Name"}
              value={this.props.stock_keeping_view.subcategoryl2_name}
            />
            <CardRowCol
              lable={"Product Name"}
              value={this.props.stock_keeping_view.product_name}
            />
            <CardRowCol
              lable={"Stockkeeping classification"}
              value={
                this.props.stock_keeping_view.type === 0
                  ? "Daily"
                  : "Weekly Audit"
              }
            />
            <CardRowCol
              lable={"Price"}
              value={this.props.stock_keeping_view.price}
            />
            <CardRowCol
              lable={"Missing Quantity"}
              value={this.props.stock_keeping_view.missing_quantity}
            />
            <CardRowCol
              lable={"Missing Value"}
              value={
                this.props.stock_keeping_view.missing_quantity *
                this.props.stock_keeping_view.price
              }
            />
            <CardRowCol
              lable={"BOH"}
              value={this.props.stock_keeping_view.boh}
            />
            <CardRowCol
              lable={"BOH Value"}
              value={
                this.props.stock_keeping_view.boh *
                this.props.stock_keeping_view.price
              }
            />
            <CardRowCol
              lable={"Actual Quantity"}
              value={this.props.stock_keeping_view.actual_quantity}
            />
            <CardRowCol
              lable={"Actual Value"}
              value={
                this.props.stock_keeping_view.actual_quantity *
                this.props.stock_keeping_view.price
              }
            />
            <CardRowCol
              lable={"Sorting Quantity"}
              value={this.props.stock_keeping_view.in_sorting}
            />
            <CardRowCol
              lable={"Sorting Value"}
              value={
                this.props.stock_keeping_view.in_sorting *
                this.props.stock_keeping_view.price
              }
            />
            <CardRowCol
              lable={"Wastage Quantity"}
              value={this.props.stock_keeping_view.wastage}
            />
            <CardRowCol
              lable={"Wastage Value"}
              value={
                this.props.stock_keeping_view.wastage *
                this.props.stock_keeping_view.price
              }
            />
            <CardRowCol
              lable={"Comment"}
              value={this.props.stock_keeping_view.commend}
            />
            <CardRowColImage
              lable={"Proof Image"}
              value={this.props.stock_keeping_view.wastage_image}
            />
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.validateModal}
          toggle={this.onValidationModal}
          backdrop={"static"}
          className="max-width-600"
        >
          <ModalBody>
            <StockAddFrom
              onValidationModal={this.onValidationModal}
              selectedItem={this.state.select_edit_item}
              isEdit={true}
              onUpdate={this.onUpdate}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wastage);
