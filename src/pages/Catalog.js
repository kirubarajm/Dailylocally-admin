import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import SearchInput from "../components/SearchInput";
import { onActionHidden,getAdminId } from "../utils/ConstantFunction";
import {
  CATELOG_CATEGORY_LIST,
  CATELOG_SUBCATEGORY_L1_LIST,
  CATELOG_SUBCATEGORY_L2_LIST,
  CATELOG_PRODUCT_LIST,
  CATEGORY_LIVE_UNLIVE,
  CATEGORY_LIVE_ITEM,
  CATEGORY_LIVE_POPUP_CLEAR,
  L1_SUBCATEGORY_LIVE_UNLIVE,
  L1_SUB_CATEGORY_LIVE_ITEM,
  L1_SUB_CATEGORY_LIVE_POPUP_CLEAR,
  CATELOG_SELECTED_CAT,
  CATELOG_SELECTED_L1CAT,
  CATELOG_SELECTED_L2CAT,
  CATELOG_SELECTED_TAB,
  CATELOG_PRODUCT_ADD_SELECT,
  CATELOG_SEARCH,
  CATELOG_SEARCH_SELECT,
  ZONE_LIST_VIEW,
  L2_SUBCATEGORY_LIVE_UNLIVE,
  L2_SUB_CATEGORY_LIVE_ITEM,
  L2_SUB_CATEGORY_LIVE_POPUP_CLEAR,
  PRODUCT_LIVE_UNLIVE,
  PRODUCT_LIVE_UNLIVE_LIVE_ITEM,
  PRODUCT_LIVE_UNLIVE_LIVE_POPUP_CLEAR,
  ZONE_SELECTED,
  PRODUCT_DELETE
} from "../constants/actionTypes";
import { Link } from "react-router-dom";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import {
  Row,
  Col,
  ButtonGroup,
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
import CatSubAddEdit from "./CatSubAddEdit";
import SwitchButtonCommon from "../components/SwitchButtonCommon";

// const [show, setShow] = useState(false);

// const handleClose = () => setShow(false);
// const handleShow = () => setShow(true);

const mapStateToProps = (state) => ({ ...state.catalog });

const mapDispatchToProps = (dispatch) => ({
  onSelectTabType: (tab_type) =>
    dispatch({
      type: CATELOG_SELECTED_TAB,
      tab_type,
    }),
  onGetCategory: (data) =>
    dispatch({
      type: CATELOG_CATEGORY_LIST,
      payload: AxiosRequest.Catelog.getCategory(data),
    }),
  onGetSubCat1: (data) =>
    dispatch({
      type: CATELOG_SUBCATEGORY_L1_LIST,
      payload: AxiosRequest.Catelog.getSubCate1(data),
    }),
  onGetSubCat2: (data) =>
    dispatch({
      type: CATELOG_SUBCATEGORY_L2_LIST,
      payload: AxiosRequest.Catelog.getSubCate2(data),
    }),
  onGetProduct: (data) =>
    dispatch({
      type: CATELOG_PRODUCT_LIST,
      payload: AxiosRequest.Catelog.getProduct(data),
    }),
  OncategoryLiveUnlive: (data) =>
    dispatch({
      type: CATEGORY_LIVE_UNLIVE,
      payload: AxiosRequest.Catelog.categoryLiveUnlive(data),
    }),
  OncategoryLiveItem: (item, i) =>
    dispatch({
      type: CATEGORY_LIVE_ITEM,
      item,
      i,
    }),
  OnPopupClear: () =>
    dispatch({
      type: CATEGORY_LIVE_POPUP_CLEAR,
    }),

  OnL1SubcategoryLiveUnlive: (data) =>
    dispatch({
      type: L1_SUBCATEGORY_LIVE_UNLIVE,
      payload: AxiosRequest.Catelog.L1subcategoryLiveUnlive(data),
    }),

  OnL1SubcategoryLiveItem: (item, i) =>
    dispatch({
      type: L1_SUB_CATEGORY_LIVE_ITEM,
      item,
      i,
    }),

  OnL1SubcategoryPopupClear: () =>
    dispatch({
      type: L1_SUB_CATEGORY_LIVE_POPUP_CLEAR,
    }),

  onSelectedCat: (Item) =>
    dispatch({
      type: CATELOG_SELECTED_CAT,
      Item,
    }),
  onSelectedL1Cat: (Item) =>
    dispatch({
      type: CATELOG_SELECTED_L1CAT,
      Item,
    }),
  onSelectedL2Cat: (Item) =>
    dispatch({
      type: CATELOG_SELECTED_L2CAT,
      Item,
    }),
  onSelectedAddProduct: () =>
    dispatch({
      type: CATELOG_PRODUCT_ADD_SELECT,
    }),
  onCatelogSearch: (data) =>
    dispatch({
      type: CATELOG_SEARCH,
      payload: AxiosRequest.Catelog.getSearch(data),
    }),
  onCatelogSearchSelected: (data) =>
    dispatch({
      type: CATELOG_SEARCH_SELECT,
      payload: AxiosRequest.Catelog.getSearchView(data),
    }),
  onGetZone: (data) =>
    dispatch({
      type: ZONE_LIST_VIEW,
      payload: AxiosRequest.Catelog.getZoneList(data),
    }),
  OnL2SubcategoryLiveUnlive: (data) =>
    dispatch({
      type: L2_SUBCATEGORY_LIVE_UNLIVE,
      payload: AxiosRequest.Catelog.L2subcategoryLiveUnlive(data),
    }),

  OnL2SubcategoryLiveItem: (item, i) =>
    dispatch({
      type: L2_SUB_CATEGORY_LIVE_ITEM,
      item,
      i,
    }),

  OnL2SubcategoryPopupClear: () =>
    dispatch({
      type: L2_SUB_CATEGORY_LIVE_POPUP_CLEAR,
    }),

  OnProductLiveUnlive: (data) =>
    dispatch({
      type: PRODUCT_LIVE_UNLIVE,
      payload: AxiosRequest.Catelog.ProductLiveUnlive(data),
    }),

  OnProductLiveItem: (item, i) =>
    dispatch({
      type: PRODUCT_LIVE_UNLIVE_LIVE_ITEM,
      item,
      i,
    }),

  OnDeletePrItem:(data)=>
  dispatch({
    type: PRODUCT_DELETE,
    payload: AxiosRequest.Catelog.ProductDelete(data),
  }),
  OnProductPopupClear: () =>
    dispatch({
      type: PRODUCT_LIVE_UNLIVE_LIVE_POPUP_CLEAR,
    }),
  OnZoneItemSelect: (item) =>
    dispatch({
      type: ZONE_SELECTED,
      item,
    }),
});

var liveClicked = false;
class Catalog extends React.Component {
  constructor() {
    super();
    this.state = {
      catalog_tab_type: 0,
      isOpenAreaDropDown: false,
      areaItem: false,
      selected_cat: -1,
      selected_cat_sub1: -1,
      selected_cat_sub2: -1,
      selected_product: -1,
      cat_edit_modal: false,
      isCat: false,
      edit_cat_item: -1,
      edit_cat_sub1_item: -1,
      edit_cat_sub2_item: -1,
      isSearch: false,
      isSearchView: false,
      isProductdelete:false
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    //if (this.props.category_list.length === 0) this.catList();
    if (this.props.zone_list.length === 0) this.props.onGetZone();
    this.onCatlogTabClick = this.onCatlogTabClick.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickCatItem = this.clickCatItem.bind(this);
    this.clickSubCat1Item = this.clickSubCat1Item.bind(this);
    this.clickSubCat2Item = this.clickSubCat2Item.bind(this);
    this.toggleLive = this.toggleLive.bind(this);
    this.L1subcattoggleLive = this.L1subcattoggleLive.bind(this);
    this.L2subcattoggleLive = this.L2subcattoggleLive.bind(this);
    this.producttoggleLive = this.producttoggleLive.bind(this);
    this.warningtoggleLive = this.warningtoggleLive.bind(this);
    this.MovetoLive = this.MovetoLive.bind(this);
    this.L1subcatMovetoLive = this.L1subcatMovetoLive.bind(this);
    this.L2subcatMovetoLive = this.L2subcatMovetoLive.bind(this);
    this.productMovetoLive = this.productMovetoLive.bind(this);
    this.toggleUnLive = this.toggleUnLive.bind(this);
    this.formClearAndClose = this.formClearAndClose.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onSearchItemClick = this.onSearchItemClick.bind(this);
    this.onClose = this.onClose.bind(this);
    this.toggleCatEditPopup = this.toggleCatEditPopup.bind(this);
    this.catAddEditClick = this.catAddEditClick.bind(this);
    this.sub1catAddEditClick = this.sub1catAddEditClick.bind(this);
    this.sub2catAddEditClick = this.sub2catAddEditClick.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.Onlive = this.Onlive.bind(this);
    this.OnClickSwitch = this.OnClickSwitch.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.setState({
      liveItem: -1,
      L1subcattoggleliveModal: false,
      liveModal: false,
      L2subcattoggleliveModal: false,
      productoggleliveModal: false,
      warningModal: false,
      warningmessage: "",
    });
    this.productClick = this.productClick.bind(this);

    if (this.props.isLoadingZone && !this.state.areaItem && this.props.zone_list.length!==0) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.isAddProduct && this.props.selected_cat_sub1)
      this.getProduct(
        this.props.selected_cat_sub1.scl1_id,
        this.props.selected_cat_sub2.scl2_id,
        this.props.zoneItem.id
      );
  }
  UNSAFE_componentWillUpdate() {
    console.log("--componentWillUpdate-->");
  }
  UNSAFE_componentWillReceiveProps() {
    console.log("--componentWillReceiveProps-->");
  }
  componentWillUnmount() {
    console.log("--componentWillUnmount-->");
  }

  componentDidMount() {
    console.log("--componentDidMount-->");
  }
  componentDidUpdate(nextProps, nextState) {
    console.log("--componentDidUpdate-->");
    if (this.props.iscategorylive) {
      this.props.OnPopupClear();
      this.toggleLive();
      if (this.state.selected_cat !== -1) {
        this.clickCatItem(this.props.updatedItem);
      }
    }

    if (this.props.isLoadingZone && !this.state.areaItem&& this.props.zone_list.length!==0) {
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.isL1subcategorylive) {
      this.props.OnL1SubcategoryPopupClear();
      this.L1subcattoggleLive();
      if (this.state.selected_cat_sub1 !== -1)
        this.clickSubCat1Item(this.props.updatedItem);
    }

    if (this.props.isL2subcategorylive) {
      this.props.OnL2SubcategoryPopupClear();
      this.L2subcattoggleLive();
      if (this.state.selected_cat_sub2 !== -1)
        this.clickSubCat2Item(this.props.updatedItem);
    }

    if (this.props.isProductlive) {
      liveClicked = false;
      this.props.OnProductPopupClear();
      this.producttoggleLive();
    }

    if(this.props.isDelete){
      this.props.OnProductPopupClear();
      this.getProduct(
        this.props.selected_cat_sub1.scl1_id,
        this.props.selected_cat_sub2.scl2_id,
        this.props.zoneItem.id
      );
    }
  }
  componentDidCatch() {
    console.log("--componentDidCatch-->");
  }
  onClose = (e) => {
    this.setState({ isSearch: false });
    if (this.state.isSearchView) {
      this.setState({ isSearchView: false });
      this.catList();
    }
  };
  onSearch = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      this.props.onCatelogSearch({
        search: e.target.value,
        zoneid: this.props.zoneItem.id,
        done_by: getAdminId(),
      });
      this.setState({ isSearch: true });
    } else if (e.target.value === "") {
      e.preventDefault();
      if (this.state.isSearch) {
        this.setState({ isSearch: false });
        this.catList();
      }
    }
  };

  onDelete =(item)=>{
    this.setState({isProductdelete:item});
    this.toggleDelete();
  }

  toggleDelete = () => {
    this.setState((prevState) => ({
      deleteModal: !prevState.deleteModal,
    }));
  };

  toggleRemoveAll() {
    this.setState({
      liveModal: false,
      L1subcattoggleliveModal: false,
      L2subcattoggleliveModal: false,
      productoggleliveModal: false,
    });
  }

  toggleLive = () => {
    this.setState((prevState) => ({
      liveModal: !prevState.liveModal,
    }));
  };

  L1subcattoggleLive = () => {
    this.setState((prevState) => ({
      L1subcattoggleliveModal: !prevState.L1subcattoggleliveModal,
    }));
  };

  L2subcattoggleLive = () => {
    this.setState((prevState) => ({
      L2subcattoggleliveModal: !prevState.L2subcattoggleliveModal,
    }));
  };

  producttoggleLive = () => {
    this.setState((prevState) => ({
      productoggleliveModal: !prevState.productoggleliveModal,
    }));
  };
  warningtoggleLive = () => {
    this.setState((prevState) => ({
      warningModal: !prevState.warningModal,
    }));
  };
  OnClickSwitch = () => (ev) => {
    if (ev) ev.stopPropagation();
  };
  Onlive = (item, i, type) => (ev) => {
    liveClicked = true;
    if (ev) ev.stopPropagation();
    if (type === 1) {
      this.props.OncategoryLiveItem(item, i);
      this.toggleLive();
    } else if (type === 2) {
      if (
        item.active_status === 0 &&
        this.props.selected_cat.active_status === 0
      ) {
        this.setState({
          warningmessage:
            "Please Category live after try to live the L1 Category",
        });
        this.warningtoggleLive();
      } else {
        this.props.OnL1SubcategoryLiveItem(item, i);
        this.L1subcattoggleLive();
      }
    } else if (type === 3) {
      if (
        item.active_status === 0 &&
        this.props.selected_cat_sub1.active_status === 0
      ) {
        this.setState({
          warningmessage:
            "Please L1 Category live after try to live the L2 Category",
        });
        this.warningtoggleLive();
      } else {
        this.props.OnL2SubcategoryLiveItem(item, i);
        this.L2subcattoggleLive();
      }
    } else if (type === 4) {
      if (
        item.live_status === "0" &&
        this.props.selected_cat_sub2.active_status === 0
      ) {
        this.setState({
          warningmessage:
            "Please L2 Category live after try to live the Product",
        });
        this.warningtoggleLive();
      } else if (
        item.live_status === "0" &&
        this.props.selected_cat_sub1.active_status === 0
      ) {
        this.setState({
          warningmessage:
            "Please L1 Category live after try to live the L2 Category",
        });
        this.warningtoggleLive();
      } else {
        this.props.OnProductLiveItem(item, i);
        this.producttoggleLive();
      }
    }
  };

  toggleUnLive = () => {
    this.setState((prevState) => ({
      unliveModal: !prevState.unliveModal,
      countModal: false,
    }));
  };

  MovetoLive = (item, i, type) => {
    this.props.OncategoryLiveUnlive({
      catid: this.props.iscategoryitem.catid,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  };

  L1subcatMovetoLive = () => {
    this.props.OnL1SubcategoryLiveUnlive({
      scl1_id: this.props.isL1subcategoryitem.scl1_id,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  };

  L2subcatMovetoLive = () => {
    this.props.OnL2SubcategoryLiveUnlive({
      scl2_id: this.props.isL2subcategoryitem.scl2_id,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  };

  productMovetoLive = () => {
    this.props.OnProductLiveUnlive({
      pid: this.props.isProductitem.pid,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  };

  productDelete = () => {
    var data={
      pid:this.state.isProductdelete.pid,
      done_by:getAdminId(),
      zoneid:this.props.zoneItem.id
    }
    this.props.OnDeletePrItem(data);
    this.toggleDelete();
  };

  formClearAndClose = () => {
    this.toggleRemoveAll();
  };
  onCatlogTabClick = (tab) => {
    this.setState({ catalog_tab_type: tab });
    this.props.onSelectTabType(tab);
  };

  clickArea = (item) => {
    this.props.OnZoneItemSelect(item);
    this.setState({ areaItem: item });
    this.props.onGetCategory({ zoneid: item.id });
  };

  clickCatItem = (item) => {
    if (liveClicked) {
      liveClicked = false;
      return;
    }
    this.setState({ selected_cat: item });
    this.props.onSelectedCat(item);
    this.subCat1List(item.catid);
  };

  clickSubCat1Item = (item) => {
    if (liveClicked) {
      liveClicked = false;
      return;
    }
    this.setState({ selected_cat_sub1: item });
    this.props.onSelectedL1Cat(item);
    this.subCat2List(item.scl1_id);
    // if (item.l2_status) this.subCat2List(item.scl1_id);
    // else this.getProduct(item.scl1_id, 0, this.state.areaItem.area_id);
  };

  clickSubCat2Item = (item) => {
    if (liveClicked) {
      liveClicked = false;
      return;
    }
    this.setState({ selected_cat_sub2: item });
    this.props.onSelectedL2Cat(item);
    this.getProduct(
      this.props.selected_cat_sub1.scl1_id,
      item.scl2_id,
      this.props.zoneItem.id
    );
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };
  catAddEditClick = (isEdit, item) => {
    this.setState({ isCat: true, isEdit: isEdit, edit_cat_item: item });
    this.toggleCatEditPopup();
  };
  sub1catAddEditClick = (isEdit, item) => {
    this.setState({
      isSubCat1: true,
      isEdit: isEdit,
      edit_cat_sub1_item: item,
    });
    this.toggleCatEditPopup();
  };

  sub2catAddEditClick = (isEdit, item) => {
    this.setState({
      isSubCat2: true,
      isEdit: isEdit,
      edit_cat_sub2_item: item,
    });
    this.toggleCatEditPopup();
  };
  productClick = () => {
    this.props.onSelectedAddProduct();
  };

  catList() {
    this.props.onGetCategory({ zoneid: this.props.zoneItem.id, done_by: getAdminId(), });
  }

  subCat1List(cat_id) {
    this.props.onGetSubCat1({
      catid: cat_id,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  }

  subCat2List(scl1_id) {
    this.props.onGetSubCat2({
      scl1_id: scl1_id,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  }

  getProduct(scl1_id, scl2_id, zoneid) {
    this.props.onGetProduct({
      scl1_id: scl1_id,
      scl2_id: scl2_id,
      zoneid: zoneid,
      done_by: getAdminId(),
    });
  }

  toggleCatEditPopup = () => {
    this.setState({
      cat_edit_modal: !this.state.cat_edit_modal,
    });
  };

  onUpdate = () => {
    if (this.state.isCat) {
      this.catList();
    }

    if (this.state.isSubCat1) {
      this.subCat1List(this.props.selected_cat.catid);
    }

    if (this.state.isSubCat2) {
      this.subCat2List(this.props.selected_cat_sub1.scl1_id);
    }
    this.setState({ isCat: false, isSubCat1: false, isSubCat2: false });
    this.toggleCatEditPopup();
  };

  onCancel = () => {
    this.setState({ isCat: false, isSubCat1: false, isSubCat2: false });
    this.toggleCatEditPopup();
  };
  onSearchItemClick = (Item) => {
    var data = { id: Item.catid, type: "pid" };
    if (Item.type === "categoty") data = { id: Item.catid, type: "catid" };
    if (Item.type === "l1subcategoty")
      data = { id: Item.catid, type: "scl1_id" };
    if (Item.type === "l2subcategoty")
      data = { id: Item.catid, type: "scl2_id" };
    this.setState({ isSearch: false, isSearchView: true });
    this.props.onCatelogSearchSelected(data);
  };

  render() {
    const category_list = this.props.category_list || [];
    const subcat_L1 = this.props.subcat_L1 || [];
    const subcat_L2 = this.props.subcat_L2 || [];
    const product = this.props.product || [];
    return (
      <div>
        <div className="pd-12">
          <Row>
            <Col>
              <ButtonGroup size="sm" hidden={onActionHidden('catview')}>
                <Button
                  color="primary"
                  onClick={() => this.onCatlogTabClick(0)}
                  active={this.props.catalog_tab_type === 0}
                >
                  Catalog View
                </Button>
                <Button
                  color="primary"
                  onClick={() => this.onCatlogTabClick(1)}
                  active={this.props.catalog_tab_type === 1}
                >
                  Catalog Edit
                </Button>
              </ButtonGroup>
            </Col>
            <Col>
              <SearchInput
                onSearch={this.onSearch}
                onClose={this.onClose}
                value={this.props.search}
                placeholder="Search category, L1SC, L2SC or Product"
              />
            </Col>
            <Col>
              <div className="float-right">
                <spna className="mr-r-20">Zone</spna>
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
          <div hidden={!this.state.isSearch} className="search-background">
            <div className="pd-4 search-container">
              {this.props.search_data.map((item, i) => (
                <Row
                  className="pd-6 txt-cursor"
                  onClick={() => this.onSearchItemClick(item)}
                >
                  <Col lg="9">{item.name}</Col>
                  <Col lg="3" className="color-grey font-size-12">
                    {item.type}
                  </Col>
                </Row>
              ))}
            </div>
          </div>
          <Row className="mr-t-20 pd-6">
            <Col lg="3" className="pd-4">
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>Category</div>
                  <div
                    className="btn"
                    hidden={this.props.catalog_tab_type === 0}
                  >
                    <Button
                      size="sm"
                      hidden={onActionHidden('catadd_product')}
                      onClick={() => this.catAddEditClick(false)}
                    >
                      Add New
                      <span className="vertical-align-center">
                        <FaPlusCircle size={12} />
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="cat-table">
                  {category_list.map((item, i) => (
                    <Row
                    key={i}
                      className={
                        this.props.selected_cat.catid === item.catid
                          ? "cat-item-active"
                          : "cat-item"
                      }
                      onClick={() => this.clickCatItem(item)}
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col lg="4" className="txt-align-right pd-0 mr-r-5">
                        <div hidden={this.props.catalog_tab_type === 1}>
                          <SwitchButtonCommon
                            hidden={onActionHidden('catlive_unlive')}
                            checked={item.active_status === 0 ? false : true}
                            handleClick={this.OnClickSwitch()}
                            handleSwitchChange={this.Onlive(item, i, 1)}
                          ></SwitchButtonCommon>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Button
                            size="sm"
                            hidden={onActionHidden('catedit_product')}
                            className="bg-color-red btn-edit"
                            onClick={() => this.catAddEditClick(true, item)}
                          >
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
            <Col
              lg="3"
              hidden={!this.props.selected_cat.catid}
              className="pd-4"
            >
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>L1 SC</div>
                  <div
                    className="btn"
                    hidden={this.props.catalog_tab_type === 0}
                  >
                    <Button
                      size="sm"
                      hidden={onActionHidden('catadd_product')}
                      onClick={() => this.sub1catAddEditClick(false)}
                    >
                      Add New{" "}
                      <span className="vertical-align-center">
                        {" "}
                        <FaPlusCircle size={12} />
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="cat-table">
                  {subcat_L1.map((item, i) => (
                    <Row
                      className={
                        this.props.selected_cat_sub1.scl1_id === item.scl1_id
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      onClick={() => this.clickSubCat1Item(item)}
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col lg="4" className="txt-align-right pd-0 mr-r-5">
                        <div hidden={this.props.catalog_tab_type === 1}>
                         
                          <SwitchButtonCommon
                          hidden={onActionHidden('catlive_unlive')}
                            checked={item.active_status === 0 ? false : true}
                            handleSwitchChange={this.Onlive(item, i, 2)}
                          ></SwitchButtonCommon>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Button
                            size="sm"
                            className="bg-color-red btn-edit"
                            hidden={onActionHidden('catedit_product')}
                            onClick={() => this.sub1catAddEditClick(true, item)}
                          >
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
            <Col
              lg="2"
              hidden={!this.props.selected_cat_sub1.scl1_id}
              className="pd-4"
            >
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>L2 SC</div>
                  <div
                    className="btn"
                    hidden={this.props.catalog_tab_type === 0}
                  >
                    <Button
                      size="sm"
                      hidden={onActionHidden('catadd_product')}
                      onClick={() => this.sub2catAddEditClick(false)}
                    >
                      Add New{" "}
                      <span className="vertical-align-center">
                        {" "}
                        <FaPlusCircle size={12} />
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="cat-table">
                  {subcat_L2.map((item, i) => (
                    <Row
                      className={
                        this.props.selected_cat_sub2.scl2_id === item.scl2_id
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      onClick={() => this.clickSubCat2Item(item)}
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col
                        lg="4"
                        className="txt-align-right pd-0 mr-r-5"
                        hidden={item.scl2_id === 0}
                      >
                        <div hidden={this.props.catalog_tab_type === 1}>
                          <SwitchButtonCommon
                          hidden={onActionHidden('catlive_unlive')}
                            checked={item.active_status === 0 ? false : true}
                            handleSwitchChange={this.Onlive(item, i, 3)}
                          ></SwitchButtonCommon>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Button
                            size="sm"
                            className="bg-color-red btn-edit"
                            hidden={onActionHidden('catedit_product')}
                            onClick={() => this.sub2catAddEditClick(true, item)}
                          >
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
            <Col
              lg="4"
              hidden={this.props.selected_cat_sub2 === -1}
              className="pd-4"
            >
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>Products</div>
                  <div
                    className="btn"
                    hidden={this.props.catalog_tab_type === 0}
                  >
                    <Link to={`/product_add`}>
                      <Button size="sm" onClick={this.productClick}
                      hidden={onActionHidden('catadd_product')}>
                        Add New
                        <span className="vertical-align-center">
                          <FaPlusCircle size={12} />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="cat-table">
                  {product.map((item, i) => (
                    <Row className="product-item">
                      <Col lg="6">{item.Productname}</Col>
                      <Col
                        lg="5"
                        className="txt-align-right pd-0 mr-r-5 pd-r-5"
                      >
                        <div
                          hidden={this.props.catalog_tab_type === 1}
                        >
                          <Button
                            size="sm"
                            color="link"
                            hidden={onActionHidden('catdelete_product')}
                            onClick={() => this.onDelete(item)}
                          >
                            <FaTrashAlt size="16" />
                          </Button>
                          <Link to={`/product_view/${item.pid}`}>
                            <Button
                              size="sm"
                              color="primary"
                              className="bg-color-red btn-edit mr-r-10"
                              hidden={this.props.catalog_tab_type === 1}
                            >
                              Details
                            </Button>
                          </Link>
                            <SwitchButtonCommon
                            hidden={onActionHidden('catlive_unlive')}
                              checked={item.live_status === "0" ? false : true}
                              className="mr-r-10 mr-t-10"
                              handleSwitchChange={this.Onlive(item, i, 4)}
                            ></SwitchButtonCommon>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Link to={`/product_view/${item.pid}`}>
                            <Button
                              size="sm"
                              className="bg-color-red btn-edit mr-r-10"
                            >
                              View
                            </Button>
                          </Link>
                          <Link to={`/product_edit/${item.pid}`}>
                            <Button
                              size="sm"
                              hidden={onActionHidden('catedit_product')}
                              className="bg-color-red btn-edit"
                              onClick={this.productClick}
                            >
                              Edit
                            </Button>{" "}
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <Modal
            isOpen={this.state.liveModal}
            toggle={this.toggleLive}
            className="add_live_modal"
            backdrop={"static"}
          >
            <ModalHeader>Conformation </ModalHeader>
            <ModalBody>
              {this.props.iscategoryitem.active_status === 0
                ? "Are you sure you want to live the '" +
                  this.props.iscategoryitem.name +
                  "' category"
                : "Are you sure you want to unlive the '" +
                  this.props.iscategoryitem.name +
                  "' category"}{" "}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.MovetoLive}>
                Yes
              </Button>{" "}
              <Button color="secondary" onClick={this.formClearAndClose}>
                NO
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.L1subcattoggleliveModal}
            toggle={this.L1subcattoggleLive}
            className="add_live_modal"
            backdrop={"static"}
          >
            <ModalHeader>Conformation </ModalHeader>
            <ModalBody>
              {this.props.isL1subcategoryitem.active_status === 0
                ? "Are you sure you want to live the '" +
                  this.props.isL1subcategoryitem.name +
                  "' L1 sub category"
                : "Are you sure you want to unlive the '" +
                  this.props.isL1subcategoryitem.name +
                  "' L1 sub category"}{" "}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.L1subcatMovetoLive}>
                Yes
              </Button>{" "}
              <Button color="secondary" onClick={this.formClearAndClose}>
                NO
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.L2subcattoggleliveModal}
            toggle={this.L2subcattoggleLive}
            className="add_live_modal"
            backdrop={"static"}
          >
            <ModalHeader>Conformation </ModalHeader>
            <ModalBody>
              {this.props.isL2subcategoryitem.active_status === 0
                ? "Are you sure you want to live the '" +
                  this.props.isL2subcategoryitem.name +
                  "' L2 sub category"
                : "Are you sure you want to unlive the '" +
                  this.props.isL2subcategoryitem.name +
                  "' L2 sub category"}{" "}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.L2subcatMovetoLive}>
                Yes
              </Button>{" "}
              <Button color="secondary" onClick={this.formClearAndClose}>
                NO
              </Button>
            </ModalFooter>
          </Modal>

          <Modal
            isOpen={this.state.productoggleliveModal}
            toggle={this.producttoggleLive}
            className="add_live_modal"
            backdrop={"static"}
          >
            <ModalHeader>Conformation </ModalHeader>
            <ModalBody>
              {this.props.isProductitem.live_status === "0"
                ? "Are you sure you want to live the '" +
                  this.props.isProductitem.Productname +
                  "' product"
                : "Are you sure you want to unlive the '" +
                  this.props.isProductitem.Productname +
                  "' product"}{" "}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.productMovetoLive}>
                Yes
              </Button>{" "}
              <Button color="secondary" onClick={this.formClearAndClose}>
                NO
              </Button>
            </ModalFooter>
          </Modal>

          {/* <Modal isOpen={this.state.unliveModal} toggle={this.toggleUnLive} className="add_live_modal" backdrop={"static"}>
          <ModalBody>ADD TO UNLIVE </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleCount}>
              Yes
            </Button>{" "}
            <Button color="secondary" onClick={this.formClearAndClose}>
              NO
            </Button>
          </ModalFooter>
        </Modal> */}
        </div>

        <Modal
          isOpen={this.state.cat_edit_modal}
          toggle={this.toggleCatEditPopup}
          className={this.props.className}
          backdrop={true}
        >
          <ModalBody>
            <Row className="mr-b-10">
              <Col lg="8"></Col>
              <Col className="txt-align-right">
                <Button
                  size="sm"
                  onClick={this.onCancel}
                  className="border-none"
                >
                  <IoIosClose size={25} />
                </Button>
              </Col>
            </Row>
            <CatSubAddEdit
              isCat={this.state.isCat}
              isEdit={this.state.isEdit}
              edit_cat_item={this.state.edit_cat_item}
              isSubCat1={this.state.isSubCat1}
              selected_cat={this.props.selected_cat}
              edit_cat_sub1_item={this.state.edit_cat_sub1_item}
              isSubCat2={this.state.isSubCat2}
              selected_cat_sub1={this.props.selected_cat_sub1}
              edit_cat_sub2_item={this.state.edit_cat_sub2_item}
              update={this.onUpdate}
            />
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.warningModal}
          toggle={this.warningtoggleLive}
          className="add_live_modal"
          backdrop={"static"}
        >
          <ModalHeader>Warning </ModalHeader>
          <ModalBody>{this.state.warningmessage}</ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.warningtoggleLive}>
              OK
            </Button>
          </ModalFooter>
        </Modal>


        <Modal
            isOpen={this.state.deleteModal}
            toggle={this.toggleDelete}
            className="add_live_modal"
            backdrop={"static"}
          >
            <ModalHeader>Conformation </ModalHeader>
            <ModalBody>
              {this.state.isProductdelete
                ? "Are you sure you want to delete the '" +
                  this.state.isProductdelete.Productname+"' ?":""}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" size="sm" onClick={this.productDelete}>
                Yes
              </Button>{" "}
              <Button color="secondary" size="sm"  onClick={this.toggleDelete}>
                NO
              </Button>
            </ModalFooter>
          </Modal>

      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
