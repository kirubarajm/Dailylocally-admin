import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import SearchInput from "../components/SearchInput";
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
  ZONE_SELECTED
} from "../constants/actionTypes";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
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

  OnProductPopupClear: () =>
    dispatch({
      type: PRODUCT_LIVE_UNLIVE_LIVE_POPUP_CLEAR,
    }),
    OnZoneItemSelect: (item) =>
    dispatch({
      type: ZONE_SELECTED,item
    }),
});

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
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    //if (this.props.category_list.length === 0) this.catList();
    if (this.props.zone_list.length === 0)  this.props.onGetZone();
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
    this.onCancel = this.onCancel.bind(this);
    this.setState({
      liveItem: -1,
      L1subcattoggleliveModal: false,
      liveModal: false,
      L2subcattoggleliveModal: false,
      productoggleliveModal: false,
    });
    this.productClick = this.productClick.bind(this);
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
    }

    if(this.props.isLoadingZone&&!this.state.areaItem){
      this.clickArea(this.props.zone_list[0]);
    }

    if (this.props.isL1subcategorylive) {
      this.props.OnL1SubcategoryPopupClear();
      this.L1subcattoggleLive();
    }

    if (this.props.isL2subcategorylive) {
      this.props.OnL2SubcategoryPopupClear();
      this.L2subcattoggleLive();
    }

    if (this.props.isProductlive) {
      this.props.OnProductPopupClear();
      this.producttoggleLive();
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
      this.props.onCatelogSearch({ search: e.target.value, zone_id: this.props.zoneItem.id });
      this.setState({ isSearch: true });
    } else if (e.target.value === "") {
      e.preventDefault();
      if (this.state.isSearch) {
        this.setState({ isSearch: false });
        this.catList();
      }
    }
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

  Onlive = (item, i, type) => {
    if (type === 1) {
      this.props.OncategoryLiveItem(item, i);
      this.toggleLive();
    } else if (type === 2) {
      this.props.OnL1SubcategoryLiveItem(item, i);
      this.L1subcattoggleLive();
    } else if (type === 3) {
      this.props.OnL2SubcategoryLiveItem(item, i);
      this.L2subcattoggleLive();
    } else if (type === 4) {
      this.props.OnProductLiveItem(item, i);
      this.producttoggleLive();
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
      zone_id: this.props.zoneItem.id,
    });
  };

  L1subcatMovetoLive = () => {
    this.props.OnL1SubcategoryLiveUnlive({
      scl1_id: this.props.isL1subcategoryitem.scl1_id,
      zone_id: this.props.zoneItem.id,
    });
  };

  L2subcatMovetoLive = () => {
    this.props.OnL2SubcategoryLiveUnlive({
      scl2_id: this.props.isL2subcategoryitem.scl2_id,
      zone_id: this.props.zoneItem.id,
    });
  };

  productMovetoLive = () => {
    this.props.OnProductLiveUnlive({
      pid: this.props.isProductitem.pid,
      zone_id: this.props.zoneItem.id,
    });
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
    this.props.onGetCategory({ zone_id: item.id });
  };

  clickCatItem = (item) => (ev) => {
    this.setState({ selected_cat: item });
    this.props.onSelectedCat(item);
    this.subCat1List(item.catid);
  };

  clickSubCat1Item = (item) => {
    this.setState({ selected_cat_sub1: item });
    this.props.onSelectedL1Cat(item);
    this.subCat2List(item.scl1_id);
    // if (item.l2_status) this.subCat2List(item.scl1_id);
    // else this.getProduct(item.scl1_id, 0, this.state.areaItem.area_id);
  };

  clickSubCat2Item = (item) => {
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
    this.props.onGetCategory({ zone_id: this.props.zoneItem.id });
  }

  subCat1List(cat_id) {
    this.props.onGetSubCat1({ catid: cat_id, zone_id: this.props.zoneItem.id });
  }

  subCat2List(scl1_id) {
    this.props.onGetSubCat2({ scl1_id: scl1_id, zone_id: this.props.zoneItem.id });
  }

  getProduct(scl1_id, scl2_id, zone_id) {
    this.props.onGetProduct({
      scl1_id: scl1_id,
      scl2_id: scl2_id,
      zone_id: zone_id,
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
              <ButtonGroup size="sm">
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
                <spna className="mr-r-20">Area</spna>
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
                      onClick={() => this.catAddEditClick(false)}
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
                  {category_list.map((item, i) => (
                    <Row
                      className={
                        this.props.selected_cat.catid === item.catid
                          ? "cat-item-active"
                          : "cat-item"
                      }
                      onClick={this.clickCatItem(item)}
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col lg="4" className="txt-align-right pd-0 mr-r-5">
                        <div hidden={this.props.catalog_tab_type === 1}>
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.active_status === 0}
                            onClick={() => this.Onlive(item, i, 1)}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.active_status === 1}
                            onClick={() => this.Onlive(item, i, 1)}
                          >
                            Unlive
                          </Button>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Button
                            size="sm"
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
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.active_status === 0}
                            onClick={() => this.Onlive(item, i, 2)}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.active_status === 1}
                            onClick={() => this.Onlive(item, i, 2)}
                          >
                            Unlive
                          </Button>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Button
                            size="sm"
                            className="bg-color-red btn-edit"
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
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.active_status === 0}
                            onClick={() => this.Onlive(item, i, 3)}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.active_status === 1}
                            onClick={() => this.Onlive(item, i, 3)}
                          >
                            Unlive
                          </Button>
                        </div>
                        <div hidden={this.props.catalog_tab_type === 0}>
                          <Button
                            size="sm"
                            className="bg-color-red btn-edit"
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
                      <Button size="sm" onClick={this.productClick}>
                        Add New{" "}
                        <span className="vertical-align-center">
                          {" "}
                          <FaPlusCircle size={12} />
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="cat-table">
                  {product.map((item, i) => (
                    <Row className="product-item">
                      <Col lg="8">{item.Productname}</Col>
                      <Col className="txt-align-right pd-0 mr-r-5 pd-r-5">
                        <div hidden={this.props.catalog_tab_type === 1}>
                          <Link to={`/product_view/${item.pid}`}>
                            <Button
                              size="sm"
                              color="primary"
                              className="mr-r-10"
                              hidden={this.props.catalog_tab_type === 1}
                            >
                              Details
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.live_status ==="0"}
                            onClick={() => this.Onlive(item, i, 4)}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.live_status ==="1"}
                            onClick={() => this.Onlive(item, i, 4)}
                          >
                            Unlive
                          </Button>
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
                ? "Are you sure you want to live Category"
                : "Are you sure you want to unlive Category"}{" "}
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
                ? "Are you sure you want to live L1 sub Category"
                : "Are you sure you want to unlive  L1 sub Category"}{" "}
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
              {this.props.isL1subcategoryitem.active_status === 0
                ? "Are you sure you want to live L2 sub Category"
                : "Are you sure you want to unlive  L2 sub Category"}{" "}
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
              {this.props.isL1subcategoryitem.active_status === 0
                ? "Are you sure you want to live product"
                : "Are you sure you want to unlive  product"}{" "}
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
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
