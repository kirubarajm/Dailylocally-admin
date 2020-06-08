import React,{useState} from "react";
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
  L1_SUB_CATEGORY_LIVE_POPUP_CLEAR
} from "../constants/actionTypes";
import { Link } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
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
import { Area } from "../utils/constant";



  // const [show, setShow] = useState(false);

  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);



const mapStateToProps = (state) => ({ ...state.catalog });

const mapDispatchToProps = (dispatch) => ({
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
   OncategoryLiveItem: (item,i) =>
    dispatch({
      type: CATEGORY_LIVE_ITEM,item,i
    }),

    OnPopupClear: () =>
    dispatch({
      type: CATEGORY_LIVE_POPUP_CLEAR
    }),


    OnL1SubcategoryLiveUnlive: (data) =>
    dispatch({
      type: L1_SUBCATEGORY_LIVE_UNLIVE,
      payload: AxiosRequest.Catelog.L1subcategoryLiveUnlive(data),
    }),
    OnL1SubcategoryLiveItem: (item,i) =>
    dispatch({
      type: L1_SUB_CATEGORY_LIVE_ITEM,item,i
    }),

    OnL1SubcategoryPopupClear: () =>
    dispatch({
      type: L1_SUB_CATEGORY_LIVE_POPUP_CLEAR
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
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    this.catList();
    this.onCatlogTabClick = this.onCatlogTabClick.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickCatItem = this.clickCatItem.bind(this);
    this.clickSubCat1Item = this.clickSubCat1Item.bind(this);
    this.clickSubCat2Item = this.clickSubCat2Item.bind(this);
    this.onSearch=this.onSearch.bind(this);
    this.toggleLive = this.toggleLive.bind(this);
    this.L1subcattoggleLive=this.L1subcattoggleLive.bind(this);
    this.MovetoLive= this.MovetoLive.bind(this);
    this.L1subcatMovetoLive= this.L1subcatMovetoLive.bind(this);
    this.toggleUnLive = this.toggleUnLive.bind(this);
    this.formClearAndClose = this.formClearAndClose.bind(this);
    this.setState({ areaItem: Area[0],liveItem:-1 });

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
    if(this.props.iscategorylive){
      this.props.OnPopupClear();
      this.toggleLive();
    }
    if(this.props.isL1subcategorylive){
      this.props.OnL1SubcategoryPopupClear();
      this.L1subcattoggleLive();
    }
  }
  componentDidCatch() {
    console.log("--componentDidCatch-->");
  }

  onSearch = e => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      
    }else if(e.target.value===''){
      e.preventDefault();
      
    }
  };

  toggleRemoveAll() {
    this.setState({
      liveModal: false,
    });
  }

  toggleLive = () => {
    this.setState(prevState => ({
      liveModal: !prevState.liveModal,
      countModal: false
    }));
  };

  L1subcattoggleLive = () => {
    this.setState(prevState => ({
      liveModal: !prevState.liveModal
    }));
  };

  Onlive = (item,i,type) =>{
    if (type===1) {
      this.props.OncategoryLiveItem(item,i);
      this.toggleLive();
    }else if (type===2) {
      this.props.OnL1SubcategoryLiveItem(item,i);
      this.toggleLive();
    }else{

    }
   
  }

 

  toggleUnLive = () => {
    this.setState(prevState => ({
      unliveModal: !prevState.unliveModal,
      countModal: false
    }));
  };

  
  MovetoLive = (item,i,type) => {

    this.props.OncategoryLiveUnlive({
      catid: this.props.iscategoryitem.catid,
      zone_id: 1
    });
   
  }


  L1subcatMovetoLive = () => {
  this.props.OnL1SubcategoryLiveUnlive({
      scl1_id: this.props.isL1subcategoryitem.scl1_id,
      zone_id: 1
    });
  
  }

  formClearAndClose= () => {
    this.toggleRemoveAll();
    this.props.OnPopupClear();
    
  }
  onCatlogTabClick = (tab) => {
    this.setState({ catalog_tab_type: tab });
  };

  clickArea = (item) => {
    this.setState({ areaItem: item });
  };

  clickCatItem = (item) => {
    this.setState({ selected_cat: item });
    this.subCat1List(item.catid);
  };

  clickSubCat1Item = (item) => {
    this.setState({ selected_cat_sub1: item });
    if (item.l2_status) this.subCat2List(item.scl1_id);
    else this.getProduct(item.scl1_id, 0, this.state.areaItem.area_id);
  };

  clickSubCat2Item = (item) => {
    this.setState({ selected_cat_sub2: item });
    this.getProduct(
      this.state.selected_cat_sub1.scl1_id,
      item.scl2_id,
      this.state.areaItem.area_id
    );
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  catList() {
    this.props.onGetCategory({zone_id:1});
  }

  subCat1List(cat_id) {
    this.props.onGetSubCat1({ catid: cat_id,zone_id:1 });
  }

  subCat2List(scl1_id) {
    this.props.onGetSubCat2({ scl1_id: scl1_id,zone_id:1});
  }

  getProduct(scl1_id, scl2_id, zone_id) {
    this.props.onGetProduct({
      scl1_id: scl1_id,
      scl2_id: scl2_id,
      zone_id: zone_id,
    });
  }

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
                  active={this.state.catalog_tab_type === 0}
                >
                  Catalog View
                </Button>
                <Button
                  color="primary"
                  onClick={() => this.onCatlogTabClick(1)}
                  active={this.state.catalog_tab_type === 1}
                >
                  Catalog Edit
                </Button>
              </ButtonGroup>
            </Col>
            <Col><SearchInput onSearch={this.onSearch} value={this.props.search} placeholder="Search category, L1SC, L2SC or Product"/></Col>
            <Col>
              <div className="float-right">
                Area{"  "}
                <ButtonDropdown
                  className="max-height-30"
                  isOpen={this.state.isOpenAreaDropDown}
                  toggle={this.toggleAreaDropDown}
                  size="sm"
                >
                  <DropdownToggle caret>
                    {this.state.areaItem.area_name || ""}
                  </DropdownToggle>
                  <DropdownMenu>
                    {Area.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.clickArea(item)}
                        key={index}
                      >
                        {item.area_name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>
            </Col>
          </Row>
          <Row className="mr-t-20 pd-6">
            <Col lg="3" className="pd-4">
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>Category</div>
                  <div
                    className="btn"
                    hidden={this.state.catalog_tab_type === 0}
                  >
                    <Button size="sm">
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
                        this.state.selected_cat.catid === item.catid
                          ? "cat-item-active"
                          : "cat-item"
                      }
                      active={this.state.selected_cat.catid === item.catid}
                      onClick={() => this.clickCatItem(item)}
                     
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col lg="4" className="txt-align-right pd-0 mr-r-5">
                        <div hidden={this.state.catalog_tab_type === 1}>
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.active_status === 1}
                            onClick={() => this.Onlive(item,i,1)}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.active_status === 0}
                             onClick={() => this.Onlive(item,i,1)}
                          >
                            Unlive
                          </Button>
                        </div>
                        <div hidden={this.state.catalog_tab_type === 0}>
                          <Button size="sm" className="bg-color-red btn-edit">
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg="3"
              hidden={
                this.state.catalog_tab_type == 1
                  ? this.state.selected_cat.catid == 0
                  : subcat_L1.length === 0
              }
              className="pd-4"
            >
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>L1 SC</div>
                  <div
                    className="btn"
                    hidden={this.state.catalog_tab_type === 0}
                  >
                    <Button size="sm">
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
                        this.state.selected_cat_sub1.scl1_id === item.scl1_id
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      onClick={() => this.clickSubCat1Item(item)}
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col lg="4" className="txt-align-right pd-0 mr-r-5">
                        <div hidden={this.state.catalog_tab_type === 1}>
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.active_status === 1}
                            onClick={() => this.Onlive(item,i,2)}
                            >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.active_status === 0}
                            onClick={() => this.Onlive(item,i,2)}
                            >
                            Unlive
                          </Button>
                        </div>
                        <div hidden={this.state.catalog_tab_type === 0}>
                          <Button size="sm" className="bg-color-red btn-edit">
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg="2" hidden={subcat_L2.length === 0} className="pd-4">
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>L2 SC</div>
                  <div
                    className="btn"
                    hidden={this.state.catalog_tab_type === 0}
                  >
                    <Button size="sm">
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
                        this.state.selected_cat_sub2.scl2_id === item.scl2_id
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      onClick={() => this.clickSubCat2Item(item)}
                    >
                      <Col lg="7">{item.name}</Col>
                      <Col lg="4" className="txt-align-right pd-0 mr-r-5">
                        <div hidden={this.state.catalog_tab_type === 1}>
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.active_status === 1}
                            onClick={this.toggleLive}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.active_status === 0}
                            onClick={this.toggleUnLive}
                          >
                            Unlive
                          </Button>
                        </div>
                        <div hidden={this.state.catalog_tab_type === 0}>
                          <Button size="sm" className="bg-color-red btn-edit">
                            Edit
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg="4" hidden={product.length === 0} className="pd-4">
              <div className="cat-table-border">
                <div className="cat-title">
                  <div>Products</div>
                  <div
                    className="btn"
                    hidden={this.state.catalog_tab_type === 0}
                  >
                    <Link to={`/product_add`}>
                    <Button size="sm">
                      Add New{" "}
                      <span className="vertical-align-center">
                        {" "}
                        <FaPlusCircle size={12} />
                      </span>
                    </Button></Link>
                  </div>
                </div>
                <div className="cat-table">
                  {product.map((item, i) => (
                    <Row className="product-item">
                      <Col lg="8">{item.Productname}</Col>
                      <Col className="txt-align-right pd-0 mr-r-5 pd-r-5">
                        <div hidden={this.state.catalog_tab_type === 1}>
                        <Link to={`/product_view/${item.pid}`}>
                          <Button
                            size="sm"
                            color="primary"
                            className="mr-r-10"
                            hidden={this.state.catalog_tab_type === 1}
                          >
                            Details
                          </Button></Link>
                          <Button
                            size="sm"
                            className="bg-color-green btn-live"
                            hidden={item.live_status === "1"}
                            onClick={this.toggleLive}
                          >
                            Live
                          </Button>
                          <Button
                            size="sm"
                            className="bg-color-red btn-unlive"
                            hidden={item.live_status === "0"}
                            onClick={this.toggleUnLive}
                          >
                            Unlive
                          </Button>
                        </div>

                        <div hidden={this.state.catalog_tab_type === 0}>
                        <Link to={`/product_view/${item.pid}`}>
                          <Button
                            size="sm"
                            className="bg-color-red btn-edit mr-r-10"
                          >
                            View
                          </Button></Link>
                          <Link to={`/product_edit/${item.pid}`}>
                          <Button size="sm" className="bg-color-red btn-edit">
                            Edit
                          </Button> </Link>
                        </div>
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <Modal isOpen={this.state.liveModal} toggle={this.toggleLive} className="add_live_modal" backdrop={"static"}>
          <ModalHeader>Conformation </ModalHeader>
                  <ModalBody>{this.props.iscategoryitem.active_status===1?'Are you sure you want to live Category':'Are you sure you want to unlive Category'} </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.MovetoLive}>
              Yes
            </Button>{" "}
            <Button color="secondary" onClick={this.formClearAndClose}>
              NO
            </Button>
          </ModalFooter>
        </Modal>

        <Modal isOpen={this.state.liveModal} toggle={this.toggleLive} className="add_live_modal" backdrop={"static"}>
          <ModalHeader>Conformation </ModalHeader>
                  <ModalBody>{this.props.isL1subcategoryitem.active_status===1?'Are you sure you want to live L1 sub Category':'Are you sure you want to unlive  L1 sub'} </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.L1subcatMovetoLive}>
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
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
