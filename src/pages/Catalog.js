import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { CATELOG_CATEGORY_LIST,CATELOG_SUBCATEGORY_L1_LIST,CATELOG_SUBCATEGORY_L2_LIST,CATELOG_PRODUCT_LIST } from "../constants/actionTypes";
import {
  Row,
  Col,
  ButtonGroup,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Area } from "../utils/constant";

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
});

class Catalog extends React.Component {
  constructor() {
    super();
    this.state = {
      catalog_tab_type: 0,
      isOpenAreaDropDown: false,
      areaItem: false,
      selected_cat: -1,
      selected_cat_sub1:-1,
      selected_cat_sub2:-1,
      selected_product:-1,
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    this.catList();
    this.onCatlogTabClick = this.onCatlogTabClick.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.clickCatItem = this.clickCatItem.bind(this);
    this.clickSubCat1Item=this.clickSubCat1Item.bind(this);
    this.clickSubCat2Item=this.clickSubCat2Item.bind(this);
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
  }
  componentDidCatch() {
    console.log("--componentDidCatch-->");
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
    if(item.l2_status)
    this.subCat2List(item.scl1_id);
    else  this.getProduct(item.scl1_id,0,this.state.areaItem.area_id);
  };
  clickSubCat2Item = (item) => {
    this.setState({ selected_cat_sub2: item });
    this.getProduct(this.state.selected_cat_sub1.scl1_id,item.scl2_id,this.state.areaItem.area_id);
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  catList() {
    this.props.onGetCategory({});
  }

  subCat1List(cat_id) {
    this.props.onGetSubCat1({catid:cat_id});
  }

  subCat2List(scl1_id) {
    this.props.onGetSubCat2({scl1_id:scl1_id});
  }

  getProduct(scl1_id,scl2_id,zone_id) {
    this.props.onGetProduct({scl1_id:scl1_id,scl2_id:scl2_id,zone_id:zone_id});
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
          <Row className="mr-t-20">
            <Col lg="2">
              <div className="cat-table-border">
                <div className="cat-title">Category</div>
                <div className="cat-table">
                  {category_list.map((item, i) => (
                    <div
                      className={
                        this.state.selected_cat.catid === item.catid
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      active={this.state.selected_cat.catid === item.catid}
                      onClick={() => this.clickCatItem(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg="2">
            <div className="cat-table-border">
                <div className="cat-title">L1 SC</div>
                <div className="cat-table">
                  {subcat_L1.map((item, i) => (
                    <div
                      className={
                        this.state.selected_cat_sub1.scl1_id === item.scl1_id
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      onClick={() => this.clickSubCat1Item(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg="2">
            <div className="cat-table-border">
                <div className="cat-title">L2 SC</div>
                <div className="cat-table">
                  {subcat_L2.map((item, i) => (
                    <div
                      className={
                        this.state.selected_cat_sub2.scl2_id === item.scl2_id
                          ? "cat-item-active"
                          : " cat-item"
                      }
                      onClick={() => this.clickSubCat2Item(item)}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </Col>
            <Col lg="6">
            <div className="cat-table-border">
                <div className="cat-title">Products</div>
                <div className="cat-table">
                  {product.map((item, i) => (
                    <Row className="product-item">
                      <Col lg="10">{item.Productname}</Col>
                      <Col className="float-right"> <Button size="sm" color="primary">Details</Button></Col>
                    </Row>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
