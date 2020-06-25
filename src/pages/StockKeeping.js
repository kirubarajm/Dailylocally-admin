import React from "react";
import { connect } from "react-redux";
import { FaEye, FaRegEdit, FaTrashAlt } from "react-icons/fa";
import {
  Row,
  Col,
  Table,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Select from "react-dropdown-select";
import { STOCK_L1CATEGORY_LIST, STOCK_CATEGORY_LIST,RECEIVING_CLEAR,ZONE_ITEM_REFRESH,STOCK_KEEPING_LIST, ZONE_SELECT_ITEM } from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SearchItem from "../components/SearchItem";
import { store } from "../store";

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
        {/* <div
          className="mr-0 border-none pd-0"
          style={{
            height: "auto",
            width: "175px",
          }}
        >
          <label className="mr-0 color-grey">
            {label} <span className="must">*</span>
          </label>
        </div> */}
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
  zoneRefresh:state.common.zoneRefresh
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
    onClear: () =>
    dispatch({
      type: RECEIVING_CLEAR
    }),
});

class StockKeeping extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      date: false,
      stock_type:false,
      category:[],
      l1category:[],
      search_refresh:false,
      selectedCatItem: false,
      selectedL1CatItem: false,
      today: Moment(new Date()),

      poid_refresh: false,
      recevingModal: false,
      receivingSelection: [],
      pono: false,
      supplier_name: false,
      item_name:false,
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
    this.props.onGetCategory({zone_id:this.props.zoneItem.id||1});
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickArea = this.clickArea.bind(this);

    this.onStockKeepingList();

    this.onReceivingModal = this.onReceivingModal.bind(this);
    this.selectedReceiving = this.selectedReceiving.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.submit = this.submit.bind(this);
    this.onSearchPOno = this.onSearchPOno.bind(this);
    this.onSearchSupplier = this.onSearchSupplier.bind(this);
    
    
    
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {

    if (this.props.zone_list.length > 0 && !this.props.zoneItem) {
        this.clickArea(this.props.zone_list[0]);
    }

    if(this.props.zoneRefresh){
      store.dispatch({ type: ZONE_ITEM_REFRESH});
      this.setState({ isLoading: false });
    }

    this.onStockKeepingList();
  }
  componentDidCatch() {}

  onStockKeepingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = {
        zone_id: this.props.zoneItem.id,
      };
      if (this.state.category.length>0) data.category = this.state.category[0].catid;
      if (this.state.l1category.length>0) data.l1category = this.state.l1category[0].scl1_id;
      if (this.state.date) data.date = this.state.date;
      if (this.state.stock_type) data.stock_type = this.state.stock_type;
  
      //this.props.onGetStockKeepingList(data);
    }
  };
  selectedCat = (item) => {
    this.setState({ category: item });
    if(item.length>0) this.props.onGetSubCat1({ catid: item[0].catid, zone_id: this.props.zoneItem.id||1 });
  };

  selectedL1Cat = (item) => {
    this.setState({ l1category: item });
  };

  stockDate = (event, picker) => {
    var date = picker.startDate.format("YYYY-MM-DD");
    this.setState({ date: date });
  };

  addstockKeeping = () => {
    this.props.history.push('/stock-keeping-add')
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
      l1category:[],
      search_refresh:true,
      isOpenAreaDropDown:false
    });
    var data = {
      zone_id: this.props.zoneItem.id,
    };
    //this.props.onGetStockKeepingList(data);
  };
  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM,zoneItem:item});
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
  submit = (data) => {
    var data1={
      zone_id:this.props.zoneItem.id,
      popid:this.state.selectedItem.popid,
      vpid:this.state.selectedItem.vpid,
      quantity:data.item_quantity,
      delivery_note:data.delivery_note,
    }
    if(this.state.receivingSelection.length>0){
      data1.action_id=this.state.receivingSelection[0].id
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
          <div className="fieldset width-84">
            <div className="legend">Cycle count classification search criteria</div>
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
          <Row style={{ width: "85%"}}>
          <Col className="txt-align-right">
                <Button size="sm" onClick={this.addstockKeeping}>
                  + Stock keeping
                </Button>
              </Col>
            </Row>
            <div className="search-horizantal-scroll mr-t-10">
              <div className="search-vscroll">
                <Table style={{ width: "1500px" }}>
                  <thead>
                    <tr>
                    <th>View</th>
                    <th>Edit</th>
                      <th>Delete</th>
                      <th>Date</th>
                      <th>Stock type</th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Missing qty</th>
                      <th>Loss Value</th>
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
                        <FaEye
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                        <FaRegEdit
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
                        <td>{Moment(item.created_at).format("DD-MMM-YYYY")}</td>
                        <td>{item.vpid}</td>
                        <td>{item.Productname}</td>
                        <td>{item.short_desc}</td>
                        <td>{item.uom}</td>
                        <td>{item.boh}</td>
                        <td>{item.open_quqntity}</td>
                        <td>{item.received_quantity}</td>
                        <td>
                          <Button
                            className="btn-close"
                            disabled={item.received_quantity}
                            onClick={this.onActionClick(item)}
                          >
                            Action
                          </Button>
                        </td>
                        <td>
                          PO#{item.poid} - {item.name}
                        </td>
                        <td>{item.po_status}</td>
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

export default connect(mapStateToProps, mapDispatchToProps)(StockKeeping);
