import React from "react";
import { connect } from "react-redux";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import {
  PR_VENDOR_ASSIGN_LIST,
  GET_VENDOR_LIST,
  UPDATE_VENDOR_LIST,
  CREATE_PO,
  CLEAR_PO,
  WARE_HOUSE_SELECTED_TAB,
  PO_EDIT_COUNT_UPDATE,
  EDIT_QUANTITY_PO_LIST,
  EDIT_QUANTITY_BUTTON_ENABLE,
  CLEAR_VENDOR,
  DELETE_VENDOR_ITEM,
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color, VENDOR_ASSIGN } from "../utils/constant";
import { Field, reduxForm, reset } from "redux-form";
import Select from "react-dropdown-select";
import { required, minLength2 } from "../utils/Validation";
import { store } from "../store";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import Search from "../components/Search";
import Searchnew from "../components/Searchnew";
import SearchItem from "../components/SearchItem";

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div>
      <label className="pd-0 font-weight-normal" style={{ minWidth: "180px" }}>
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div>
        {" "}
        <input
          {...input}
          placeholder={label}
          type={type}
          autoComplete="off"
          onWheel={(event) => {
            event.preventDefault();
          }}
          style={{ width: "192px" }}
        />
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

function EditQuantity(props) {
  var Items = props.item;
  var isEdit = Items.isEdit === undefined ? false : Items.isEdit;
  var editQuantity =
    Items.editquantity === null
      ? Items.requested_quantity === null
        ? Items.actual_quantity
        : Items.requested_quantity
      : Items.editquantity;
  console.log("editQuantity-->", editQuantity);
  if (!isEdit) {
    editQuantity =
      Items.requested_quantity === null
        ? Items.actual_quantity
        : Items.requested_quantity;
    return (
      <div
        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        <div className="mr-r-10">{editQuantity}</div>
        <Button
          className="btn-close"
          onClick={props.action}
          disabled={onActionHidden("wh_vendor_qty_edit")}
        >
          Edit
        </Button>
      </div>
      // <Row className="mr-t-10">
      //   <Col style={{ display: "flex", alignItems: "center" }}>
      //     {editQuantity}
      //   </Col>
      //   <Col className="pd-0">
      //     <Button className="btn-close" onClick={props.action}>
      //       Edit
      //     </Button>
      //   </Col>
      // </Row>
    );
  } else if (isEdit) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", flexDirection: "row" }}
      >
        <div className="mr-r-10">
          <input
            type="number"
            value={editQuantity}
            style={{ width: "40px", height: "30px" }}
            onChange={(e) => props.onChangeQuantity(props.index, e)}
          />
        </div>
        <Button className="btn-close" onClick={props.action}>
          Done
        </Button>
      </div>
      // <Row className="mr-t-10 font-weight-bold">
      //   {/* <Col lg='8'>Live Quantity</Col> disabled={!props.quantity}*/}
      //   <Col style={{ display: "flex", alignItems: "center" }}>
      //     <input
      //       type="number"
      //       value={editQuantity}
      //       style={{ width: "40px", height: "30px" }}
      //       onChange={(e) => props.onChangeQuantity(props.index, e)}
      //     />
      //   </Col>
      //   <Col className="pd-0">
      //     <Button className="btn-close" onClick={props.action}>
      //       Done
      //     </Button>
      //   </Col>
      // </Row>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.vendorassign,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetPrWatingList: (data) =>
    dispatch({
      type: PR_VENDOR_ASSIGN_LIST,
      payload: AxiosRequest.Warehouse.getPrWaitingList(data),
    }),
  onGetVendorList: (data) =>
    dispatch({
      type: GET_VENDOR_LIST,
      payload: AxiosRequest.Warehouse.getVendorList(data),
    }),
  onCreatePo: (data) =>
    dispatch({
      type: CREATE_PO,
      payload: AxiosRequest.Warehouse.createPoConfirm(data),
    }),
  onEditPOQuantity: (data) =>
    dispatch({
      type: PO_EDIT_COUNT_UPDATE,
      payload: AxiosRequest.Warehouse.updateEditQuantity(data),
    }),
  editListOfPOQuantity: (index, quantity) =>
    dispatch({ type: EDIT_QUANTITY_PO_LIST, index, quantity }),
  onEditQuantityEnable: (index, isEdit) =>
    dispatch({ type: EDIT_QUANTITY_BUTTON_ENABLE, index, isEdit }),
  onClear: () =>
    dispatch({
      type: CLEAR_PO,
    }),
  onClearVendor: () =>
    dispatch({
      type: CLEAR_VENDOR,
    }),
  onUpdateVendorList: (data) =>
    dispatch({
      type: UPDATE_VENDOR_LIST,
      payload: AxiosRequest.Warehouse.updateVendorAssign(data),
    }),
  onGetDeleteItem: (data) =>
    dispatch({
      type: DELETE_VENDOR_ITEM,
      payload: AxiosRequest.Warehouse.VendorItemDelete(data),
    }),
  onFromClear: () => dispatch(reset(VENDOR_ASSIGN)),
});

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
    <Row className="mr-0 border-none">
      <Col className="pd-0" lg="5">
        <label className="mr-0 border-none">
          {label} <span className="must">*</span>
        </label>
      </Col>
      <Col className="pd-0" lg="5">
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
      </Col>
    </Row>
  );
};

var today;

class VendorAssign extends React.Component {
  constructor() {
    super();
    this.state = {
      selected_proid: false,
      isLoading: false,
      isaddvendor: false,
      suplier: [],
      isconfirm: false,
      sPoList: [],
      select_item: false,
      selected_vpid: [],
      isOpenAreaDropDown: false,
      today: Moment(new Date()),
    };
  }

  UNSAFE_componentWillMount() {
    today = Moment().add(1, "days").format("YYYY-MM-DD");
    this.onGetPoWaitngList = this.onGetPoWaitngList.bind(this);
    this.onAddVendor = this.onAddVendor.bind(this);
    this.toggleAddVendorPopUp = this.toggleAddVendorPopUp.bind(this);
    this.toggleDConfirmPopup = this.toggleDConfirmPopup.bind(this);
    this.selectedSuplier = this.selectedSuplier.bind(this);
    this.startSelect = this.startSelect.bind(this);
    this.submitPo = this.submitPo.bind(this);
    this.createPo = this.createPo.bind(this);
    this.savePo = this.savePo.bind(this);
    this.confirmToAddVendor = this.confirmToAddVendor.bind(this);
    this.onAction = this.onAction.bind(this);
    this.VendorEdit = this.VendorEdit.bind(this);
    this.toggleConfirmPopUp = this.toggleConfirmPopUp.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);

    this.onGetPoWaitngList();
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

    if (this.props.poCreated) {
      this.props.onClear();
      this.props.history.push("/warehouse/po");
      store.dispatch({ type: WARE_HOUSE_SELECTED_TAB, tab_type: 2 });
    }

    if (this.props.poEdittQuantity) {
      if (!this.props.poEditQuantityStatus) {
        this.props.onEditQuantityEnable(this.state.editIndex, false);
      } else {
        this.props.onEditQuantityEnable(this.state.editIndex, false);
        this.setState({ isLoading: false });
      }
    }

    if (this.props.vendor_assign_updated) {
      this.props.onClearVendor();
      this.setState({ isLoading: false });
    }

    if (this.props.poItemDelete) {
      this.props.onClear();
      this.setState({ isLoading: false });
    }

    this.onGetPoWaitngList();
  }
  componentDidCatch() {}
  onGetPoWaitngList = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zoneid: this.props.zoneItem.id };
      if (this.state.category) data.categorysearch = this.state.category;
      if (this.state.l1category)
        data.L1subcategorysearch = this.state.l1category;
      if (this.state.item_name) data.productsearch = this.state.item_name;
      this.props.onGetPrWatingList(data);
    }
  };
  toggleAddVendorPopUp = () => {
    this.setState({
      isaddvendor: !this.state.isaddvendor,
    });
  };
  toggleConfirmPopUp = () => {
    this.setState({
      isconfirm: !this.state.isconfirm,
    });
  };

  selectedSuplier = (item) => {
    this.setState({ suplier: item });
  };
  confirmToAddVendor = () => {};
  savePo = () => {};

  onDelete = (item) => {
    this.setState({ select_item: item });
    this.toggleDConfirmPopup();
  };
  toggleDConfirmPopup = () => {
    this.setState({
      isConfrimModal: !this.state.isConfrimModal,
    });
  };

  confirmTo = () => {
    var dData = {};
    dData.zoneid = this.props.zoneItem.id || 1;
    dData.temppoid = this.state.select_item.tempid;
    dData.done_by = getAdminId();
    this.props.onGetDeleteItem(dData);
    this.toggleDConfirmPopup();
  };

  VendorEdit = (item) => {
    var selected_vpid = [];
    selected_vpid.push(item.pid);
    var arvalue = {};
    arvalue[item.tempid] = true;

    this.setState({
      selected_proid: arvalue,
      selected_vpid: selected_vpid,
    });

    this.props.onGetVendorList({
      zoneid: this.props.zoneItem.id,
      products: [item.pid],
    });

    this.setState({ startdate: today, suplier: [] });
    this.props.onFromClear();
    this.toggleAddVendorPopUp();
  };

  createPo = () => {
    this.toggleConfirmPopUp();
    var item = {
      zoneid: this.props.zoneItem.id,
      templist: this.state.sPoList,
      done_by: getAdminId(),
    };
    this.props.onCreatePo(item);
  };
  submitPo = () => {
    var poList = this.props.pocreatelist;
    var sPoList = [];
    //var isPoSelected = true;
    for (var i = 0; i < poList.length; i++) {
      if (poList[i].vid) {
        sPoList.push(poList[i].tempid);
      } else {
        // isPoSelected = false;
      }
    }
    if (sPoList.length !== 0) {
      this.setState({ sPoList: sPoList });
      this.toggleConfirmPopUp();
    } else {
      notify.show(
        "Please add vendor after try again",
        "custom",
        3000,
        notification_color
      );
    }
  };

  onAddVendor = () => {
    var checkItem = this.state.selected_proid;
    var Values = Object.keys(checkItem); //JSON.parse(JSON.stringify(this.state.selected_proid));
    //delete checkItem["selectall"];
    var vpid = [];
    const pocreatelist = this.props.pocreatelist || [];
    pocreatelist.map((item, i) => {
      if (Values.indexOf("" + item.tempid) !== -1) {
        vpid.push(item.pid);
      }
    });
    var filtervpid = vpid
      .map((value) => value)
      .filter((value, index, _req) => _req.indexOf(value) === index);
    if (filtervpid.length > 0) {
      this.props.onGetVendorList({
        zoneid: this.props.zoneItem.id,
        products: filtervpid,
      });
      this.setState({ startdate: today, suplier: [] });
      this.props.onFromClear();
      this.toggleAddVendorPopUp();
    } else {
      notify.show(
        "Please select the Item after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };
  startSelect = (event, picker) => {
    event.preventDefault();
    var startdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ startdate: startdate });
  };
  submit = (values) => {
    console.log(values);
    var checkItem = this.state.selected_proid;
    var Values = Object.keys(checkItem);
    var indexof = Values.indexOf("selectall");
    if (indexof !== -1) {
      Values.splice(indexof, 1);
    }
    var data = {
      zoneid: this.props.zoneItem.id,
      buyer_comment: values.buyer_comment,
      due_date: this.state.startdate,
      vid: this.state.suplier[0].vid,
      tempid: Values,
      done_by: getAdminId(),
    };
    this.props.onUpdateVendorList(data);
    this.toggleAddVendorPopUp();
    this.setState({
      selected_proid: [],
      selected_vpid: [],
    });
  };
  onAction(item, index) {
    if (item.isEdit) {
      var liveq = this.state.lastliveQuantity;
      this.setState({
        lastliveQuantity: liveq
          ? liveq
          : item.requested_quantity || item.actual_quantity,
      });
      var tem = [item.tempid];
      this.props.onEditPOQuantity({
        zoneid: this.props.zoneItem.id,
        tempid: tem,
        done_by: getAdminId(),
        requested_quantity: item.editquantity || 0,
      });
    } else {
      this.setState({
        lastliveQuantity: item.requested_quantity || item.actual_quantity,
        editIndex: index,
      });
      this.props.onEditQuantityEnable(index, !item.isEdit);
    }
  }

  onChangeQuantity = (index, e) => {
    var str = e.target.value || "0";
    if (str.length > 1) {
      var nStr = str.startsWith("0", 0);
      if (nStr) {
        str = str.substr(1);
      }
    }
    this.props.editListOfPOQuantity(index, str);
  };
  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };
  handleChange(e, sitem) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_proid || [];
    var selected_vpid = this.state.selected_vpid || [];
    const pocreatelist = this.props.pocreatelist || [];
    if (name === "selectall") {
      if (value) {
        arvalue[name] = value;
        pocreatelist.map((item, i) => {
          arvalue[item.tempid] = value;
          selected_vpid.push(item.pid);
        });
      } else {
        arvalue = {};
        selected_vpid = [];
      }
    } else {
      if (value) {
        arvalue[name] = value;
        var allCheck = true;
        selected_vpid.push(sitem.pid);
        pocreatelist.map((item, i) => {
          if (!arvalue[item.tempid]) {
            allCheck = false;
          }
        });
        if (allCheck) arvalue["selectall"] = value;
      } else {
        if (arvalue["selectall"]) {
          delete arvalue["selectall"];
        }
        delete arvalue[name];
        if (selected_vpid.length > 0) {
          var indexof = selected_vpid.indexOf(sitem.pid);
          if (indexof !== -1) selected_vpid.splice(indexof, 1);
        }
      }
    }

    this.setState({
      selected_proid: arvalue,
      selected_vpid: selected_vpid,
    });
  }

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  onSearchCategory = (e) => {
    const value = e.target.value || "";
    this.setState({ category: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };
  onSearchL1Cat = (e) => {
    const value = e.target.value || "";
    this.setState({ l1category: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };

  onSearchItem = (e) => {
    const value = e.target.value || "";
    this.setState({ item_name: value });
    if (e.keyCode === 13 && (e.shiftKey === false || value === "")) {
      e.preventDefault();
      this.setState({ isLoading: false });
    }
  };

  onSuccessRefresh = () => {
    this.setState({ search_refresh: false });
  };

  onReset = () => {
    this.setState({
      category: "",
      l1category: "",
      item_name: "",
      search_refresh: true,
    });
    var data = {
      zoneid: this.props.zoneItem.id,
    };
    this.props.onGetPrWatingList(data);
  };

  onSearch = () => {
    this.setState({ isLoading: false });
  };

  render() {
    const pocreatelist = this.props.pocreatelist || [];
    return (
      <div className="pd-6 width-full mr-t-20" style={{ position: "fixed" }}>
        <div style={{ height: "75vh" }} className="width-85">
          <div className="pd-6">
            <Row className="mr-0 pd-b-10">
              <Col className="pd-0 mr-r-10">
                <div
                  className="float-right"
                  style={{ display: "flex", flexDirection: "row" }}
                >
                  <span className="mr-r-20">Zone</span>
                  <ButtonDropdown
                    className="max-height-30 mr-r-10"
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

                  <Button size="sm" onClick={() => this.props.history.goBack()}>
                    Back
                  </Button>
                </div>
              </Col>
            </Row>
            <div className="fieldset">
              <div className="legend">Search Criteri</div>
              <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
                <Col lg="4" className="pd-0">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className="mr-r-10 flex-row-vertical-center width-120">
                      Category :{" "}
                    </div>
                    <Search
                      onSearch={this.onSearchCategory}
                      type="text"
                      onRefreshUpdate={this.onSuccessRefresh}
                      isRefresh={this.state.search_refresh}
                    />
                  </div>
                </Col>
                <Col lg="4" className="pd-0">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className="mr-r-10 flex-row-vertical-center width-120">
                      Product Name :{" "}
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
              <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10 font-size-14">
                <Col lg="4" className="pd-0">
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className="mr-r-10 flex-row-vertical-center width-120">
                      L1 Category :
                    </div>
                    <Searchnew
                      onSearch={this.onSearchL1Cat}
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
            <Row className="mr-b-10">
              <Col className="pd-0 mr-l-20">
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div>
                    <div>
                      <label className="container-check">
                        <input
                          type="checkbox"
                          name="selectall"
                          checked={this.state.selected_proid["selectall"]}
                          onChange={(e) => this.handleChange(e, "All")}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>
                    <div className="font-size-12 mr-l-20">{" Select All "}</div>
                  </div>
                  <Button
                    size="sm"
                    onClick={this.onAddVendor}
                    className="mr-l-20"
                    hidden={onActionHidden("wh_vendor_add")}
                  >
                    + Add Supplier
                  </Button>
                </div>
              </Col>
              <Col className="txt-align-right">
                <Button
                  size="sm"
                  className="mr-r-10"
                  onClick={this.submitPo}
                  hidden={onActionHidden("wh_po_create")}
                >
                  Submit
                </Button>
              </Col>
            </Row>
            <div className="search-v-scroll">
              <Table style={{ width: "2000px" }}>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Supplier details Edit</th>
                    <th>Delete</th>
                    <th>Category</th>
                    <th>L1 Sub category</th>
                    <th>L2 Sub category</th>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Description</th>
                    <th>Supplier Name</th>
                    <th>Supplier code</th>
                    <th>UOM</th>
                    <th>BOH</th>
                    <th>Quantity</th>
                    <th>Rate</th>
                    <th>Expected Date/Time</th>
                    <th>Other charges</th>
                    <th>Amount</th>
                    <th>Buyer Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {pocreatelist.map((item, i) => (
                    <tr key={i}>
                      <td>
                        <label className="container-check">
                          <input
                            type="checkbox"
                            name={"" + item.tempid}
                            checked={this.state.selected_proid[item.tempid]}
                            onChange={(e) => this.handleChange(e, item)}
                          />
                          <span className="checkmark"></span>{" "}
                        </label>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          color="link"
                          className="pd-0"
                          onClick={() => this.VendorEdit(item)}
                          disabled={
                            !item.vid || onActionHidden("wh_vendor_edit")
                          }
                        >
                          <FaRegEdit
                            className={
                              item.vid ? "txt-color-theme" : "color-disable"
                            }
                            size="18"
                          />
                        </Button>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          onClick={() => this.onDelete(item)}
                          color="link"
                          disabled={onActionHidden("wh_vendor_delete")}
                        >
                          <FaTrashAlt size="15" />
                        </Button>
                      </td>
                      <td>
                        {item.catagory_name}
                      </td>
                      <td>
                        {item.subcatL1name}
                      </td>
                      <td>
                        {item.subcatL2name || "-"}
                      </td>
                      <td>{item.vpid}</td>
                      <td>
                        {item.Productname}
                      </td>
                      <td>
                        {item.product_productdetails || "-"}
                      </td>
                      <td>{item.vendor_name || "-"}</td>
                      <td>{item.vid || "-"}</td>
                      <td>{item.uom_name}</td>
                      <td>{item.boh || "-"}</td>
                      <td className="makeit-process-action">
                        <EditQuantity
                          action={() => this.onAction(item, i)}
                          index={i}
                          item={item}
                          onChangeQuantity={this.onChangeQuantity}
                        />
                      </td>
                      <td>{item.rate || "-"}</td>
                      <td>
                        {item.due_date
                          ? Moment(item.due_date).format("DD-MMM-YYYY/hh:mm a")
                          : "-"}
                      </td>
                      <td>{item.other_charges || "-"}</td>
                      <td>{item.amount || "-"}</td>
                      <td>{item.buyer_comment || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        <Modal
          isOpen={this.state.isaddvendor}
          toggle={this.toggleAddVendorPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleAddVendorPopUp}
            className="pd-10 border-none"
          >
            Add-Supplier
          </ModalHeader>
          <ModalBody className="pd-10">
            <form
              onSubmit={this.props.handleSubmit(this.submit)}
              style={{ width: "30vw" }}
            >
              <Field
                name="vendor"
                component={InputSearchDropDown}
                options={this.props.vendor_list}
                labelField="name"
                searchable={true}
                clearable={true}
                searchBy="name"
                valueField="vid"
                noDataLabel="No matches found"
                values={this.state.suplier}
                onSelection={this.selectedSuplier}
                label="Suplier Name"
              />
              <Row>
                <Col className="pd-0" lg="5">
                  Due Date{" "}
                </Col>
                <Col className="pd-0" lg="5">
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    minDate={this.state.today}
                    drops="down"
                    onApply={this.startSelect}
                  >
                    <Button
                      className="mr-r-10"
                      style={{ width: "30px", height: "30px", padding: "0px" }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                    {this.state.startdate}
                  </DateRangePicker>
                </Col>
              </Row>
              <Field
                name="buyer_comment"
                autoComplete="off"
                type="text"
                component={InputField}
                label="Buyer Comment"
                validate={[required, minLength2]}
                required={true}
              />
              <div className="float-right">
                <Button size="sm" onClick={this.toggleAddVendorPopUp}>
                  Cancel
                </Button>
                <Button size="sm" className="mr-l-10">
                  ADD
                </Button>
              </div>
            </form>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isconfirm}
          toggle={this.toggleConfirmPopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleConfirmPopUp}
            className="pd-10 border-none"
          >
            Confrim
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to create the PO ?
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={this.toggleConfirmPopUp}>
              No
            </Button>
            <Button size="sm" onClick={this.createPo}>
              Yes
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.isConfrimModal}
          toggle={this.toggleDConfirmPopup}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader
            toggle={this.toggleDConfirmPopup}
            className="pd-10 border-none"
          >
            Confirm
          </ModalHeader>
          <ModalBody className="pd-10">
            Are you sure you want to delete the Item?
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleDConfirmPopup}>
              NO
            </Button>
            <Button size="sm" onClick={this.confirmTo}>
              YES
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
VendorAssign = reduxForm({
  form: VENDOR_ASSIGN, // a unique identifier for this form
})(VendorAssign);

export default connect(mapStateToProps, mapDispatchToProps)(VendorAssign);
