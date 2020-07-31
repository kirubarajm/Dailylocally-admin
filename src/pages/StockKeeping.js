import React from "react";
import { connect } from "react-redux";
import { FaEye, FaRegEdit, FaTrashAlt } from "react-icons/fa";
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
  STOCK_KEEPING_LIST,
  ZONE_SELECT_ITEM,
  STOCK_KEEPING_DELETE,
  STOCK_KEEPING_VIEW,
  STOCK_KEEPING_EDIT,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SearchItem from "../components/SearchItem";
import { store } from "../store";
import StockAddFrom from "./StockAddFrom";

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
  ...state.stockkeeping,
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
  onGetStockKeepingList: (data) =>
    dispatch({
      type: STOCK_KEEPING_LIST,
      payload: AxiosRequest.StockKeeping.getStockKeepingList(data),
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

class StockKeeping extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      date: false,
      stock_type: false,
      category: [],
      l1category: [],
      search_refresh: false,
      selectedCatItem: false,
      selectedL1CatItem: false,
      today: Moment(new Date()),
      isConfrimModal: false,

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
    this.onStockKeepingList = this.onStockKeepingList.bind(this);
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
    this.onStockKeepingList();
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

    this.onStockKeepingList();
  }
  componentDidCatch() {}

  onStockKeepingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zoneid: this.props.zoneItem.id,
      };
      if (this.state.category.length > 0)
        data.cat_id = this.state.category[0].catid;
      if (this.state.l1category.length > 0)
        data.scl1_id = this.state.l1category[0].scl1_id;
      if (this.state.date) data.date = this.state.date;
      if (this.state.stock_type) data.type = this.state.stock_type;

      this.props.onGetStockKeepingList(data);
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
    var date = picker.startDate.format("YYYY-MM-DD");
    this.setState({ date: date });
  };

  addstockKeeping = () => {
    this.props.history.push("/stock-keeping-add");
  };

  onSearchItem = (e) => {
    const value = e.target.value || "";
    this.setState({ stock_type: value });
  };

  onSearch = () => {
    this.setState({ isLoading: false });
  };

  onReset = () => {
    this.setState({
      date: false,
      stock_type: "",
      category: [],
      l1category: [],
      search_refresh: true,
      isOpenAreaDropDown: false,
    });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    this.props.onGetStockKeepingList(data);
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

  render() {
    const stock_keeping_list = this.props.stock_keeping_list || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <Row className="width-84">
            <Col></Col>
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
          <div className="fieldset width-84">
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
                    singleDatePicker
                    maxDate={this.state.today}
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
                  {this.state.date
                    ? Moment(this.state.date).format("DD/MM/YYYY")
                    : "DD/MM/YYYY"}
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
                    Stock keeping type :{" "}
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
            <Row style={{ width: "85%" }}>
              <Col className="txt-align-right">
                <Button
                  size="sm"
                  onClick={this.addstockKeeping}
                  hidden={onActionHidden("stockadd")}
                >
                  + Stock keeping
                </Button>
              </Col>
            </Row>
            <div className="search-horizantal-scroll mr-t-10">
              <div className="search-vscroll">
                <Table style={{ width: "2500px" }}>
                  <thead>
                    <tr>
                      <th>View</th>
                      <th>Edit</th>
                      <th>Delete</th>
                      <th>Date</th>
                      <th>Stock type</th>
                      <th>Product Code</th>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>L1 Category</th>
                      <th>Actual qty</th>
                      <th>Actual Value</th>
                      <th>Wastage qty</th>
                      <th>Wastage Value</th>
                      <th>Missing qty</th>
                      <th>Missing Value</th>
                      <th>BOH qty</th>
                      <th>BOH value</th>
                      <th>In sorting</th>
                      <th>In sorting value</th>
                      <th>Comment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stock_keeping_list.map((item, i) => (
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
                        <td>
                          <Button
                            size="sm"
                            disabled={onActionHidden("stockedit")}
                            onClick={() => this.onEdit(item)}
                            color="link"
                          >
                            <FaRegEdit size="16" />
                          </Button>
                        </td>
                        <td>
                          <Button
                            size="sm"
                            color="link"
                            onClick={() => this.onDelete(item)}
                            disabled={item.delete_status !== 0||onActionHidden("stockdelete")}
                          >
                            <FaTrashAlt
                              size="16"
                            />
                          </Button>
                        </td>
                        <td>{Moment(item.created_at).format("DD-MMM-YYYY")}</td>
                        <td>{item.type === 0 ? "Daily" : "Weekly Audit"}</td>
                        <td>{item.vpid}</td>
                        <td>{item.product_name}</td>
                        <td>{item.category_name}</td>
                        <td>{item.subcategoryl1_name}</td>
                        <td>{item.actual_quantity}</td>
                        <td>{item.actual_quantity * item.price}</td>
                        <td>{item.wastage}</td>
                        <td>{item.wastage * item.price}</td>
                        <td>{item.missing_quantity}</td>
                        <td>{item.missing_quantity * item.price}</td>
                        <td>{item.boh}</td>
                        <td>{item.boh * item.price}</td>
                        <td>{item.in_sorting}</td>
                        <td>{item.in_sorting * item.price}</td>
                        <td>{item.commend}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(StockKeeping);
