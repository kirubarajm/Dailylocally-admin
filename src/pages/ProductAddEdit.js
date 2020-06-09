import React from "react";
import { connect } from "react-redux";
import { Row, Col, Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import {
  PRODUCT_VIEW,
  UOM_LIST_VIEW,
  UPDATE_PRODUCT_IMAGES,
  ZONE_LIST_VIEW,
  BRAND_LIST_VIEW,
  TAG_LIST_VIEW,
  DELETE_PRODUCT_IMAGES,
  PRODUCT_CATEGORY_LIST,
  PRODUCT_SUBCATEGORY_L1_LIST,
  PRODUCT_SUBCATEGORY_L2_LIST,
  SET_PRODUCT_IMAGES,
  PRODUCT_ADD,
  PRODUCT_EDIT,
  CLEAR_PRODUCT_DATA,
} from "../constants/actionTypes";
import { PRODUCT_ADD_EDIT } from "../utils/constant";
import { Field, reduxForm, change } from "redux-form";
import renderInputField from "../components/renderInputField";
import { required, minLength2 } from "../utils/Validation";
import Select from "react-dropdown-select";
import { history } from "../store";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import VendorEdit from "./VendorEdit";

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
    <div className="border-none" style={{ marginBottom: "10px" }}>
      <Row className="mr-0">
        <Col lg="5" className="pd-0">
          <label className="mr-0">
            {label} <span className="must">*</span>
          </label>
        </Col>
        <Col
          className="pd-0"
          style={{
            border: "1px solid #000",
            height: "30px",
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
        </Col>
      </Row>
    </div>
  );
};

function CardRowColVendor(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item font-size-14">
        <Col lg="7" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="1" className="color-grey pd-0">
          {":"}
        </Col>
        <Col lg="4" style={{ color: color }} className="pd-l-0">
          {props.value}
        </Col>
      </Row>
    );
  }

  return <div />;
}

const mapStateToProps = (state) => ({
  ...state.productaddedit,
  cat: state.catalog.selected_cat,
  l1cat: state.catalog.selected_cat_sub1,
  l2cat: state.catalog.selected_cat_sub2,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCategory: (data) =>
    dispatch({
      type: PRODUCT_CATEGORY_LIST,
      payload: AxiosRequest.Catelog.getCategory(data),
    }),
  onGetSubCat1: (data) =>
    dispatch({
      type: PRODUCT_SUBCATEGORY_L1_LIST,
      payload: AxiosRequest.Catelog.getSubCate1(data),
    }),
  onGetSubCat2: (data) =>
    dispatch({
      type: PRODUCT_SUBCATEGORY_L2_LIST,
      payload: AxiosRequest.Catelog.getSubCate2(data),
    }),
  onGetProduct: (data) =>
    dispatch({
      type: PRODUCT_VIEW,
      payload: AxiosRequest.Catelog.getProductDetail(data),
    }),
  onGetUOM: (data) =>
    dispatch({
      type: UOM_LIST_VIEW,
      payload: AxiosRequest.Catelog.getUOMList(data),
    }),
  onGetZone: (data) =>
    dispatch({
      type: ZONE_LIST_VIEW,
      payload: AxiosRequest.Catelog.getZoneList(data),
    }),
  onGetBrand: (data) =>
    dispatch({
      type: BRAND_LIST_VIEW,
      payload: AxiosRequest.Catelog.getBrandList(data),
    }),
  onGetTag: (data) =>
    dispatch({
      type: TAG_LIST_VIEW,
      payload: AxiosRequest.Catelog.getTagList(data),
    }),
  onUpdateMenuImages: (data,imgtype) =>
    dispatch({
      type: UPDATE_PRODUCT_IMAGES,imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onSetImages: (image) =>
    dispatch({
      type: SET_PRODUCT_IMAGES,
      image,
    }),
  onDeleteMenuImages: () =>
    dispatch({
      type: DELETE_PRODUCT_IMAGES,
    }),
  onAddProductDetails: (data) =>
    dispatch({
      type: PRODUCT_ADD,
      payload: AxiosRequest.Catelog.onAddProduct(data),
    }),
  onEditProductDetails: (data) =>
    dispatch({
      type: PRODUCT_EDIT,
      payload: AxiosRequest.Catelog.onEditProduct(data),
    }),
  onClearProduct: () =>
    dispatch({
      type: CLEAR_PRODUCT_DATA,
    }),
});
var isEdit = false;
var kitchenSignatureImg = [1];
class ProductAddEdit extends React.Component {
  constructor() {
    super();
    var ptname = window.location.pathname;
    isEdit = false;
    if (ptname.includes("/product_edit")) {
      isEdit = true;
    }

    this.state = {
      category: [],
      sub1Cat: [],
      sub2Cat: [],
      vendor: [],
      uom: [],
      brand: [],
      zone: [],
      perishable: [],
      tag: [],
      productType: [],
      selected_cat: -1,
      isEdit: isEdit,
      selected_cat_sub1: -1,
      selected_cat_sub2: -1,
      is_loading: true,
      vendorEdit: false,
      selectedVendor: {},
    };
  }

  UNSAFE_componentWillMount() {
    var productIds = this.props.match.params.product_id;
    this.props.onGetCategory({ zone_id: 1 });
    if (isEdit) {
      this.props.onGetProduct({ product_id: productIds });
    }else{
      
    }
    
    this.props.onGetUOM({});
    this.props.onGetBrand({});
    this.props.onGetTag({});
    this.submit = this.submit.bind(this);
    this.selectedUOM = this.selectedUOM.bind(this);
    this.selectedBrand = this.selectedBrand.bind(this);
    this.selectedZone = this.selectedZone.bind(this);
    this.selectedPer = this.selectedPer.bind(this);
    this.selectedPrType = this.selectedPrType.bind(this);
    this.handleonRemove = this.handleonRemove.bind(this);
    this.selectedCat = this.selectedCat.bind(this);
    this.selectedSub1Cat = this.selectedSub1Cat.bind(this);
    this.selectedSub2Cat = this.selectedSub2Cat.bind(this);
    this.selectedTag = this.selectedTag.bind(this);
    this.toggleVendorEditPopup = this.toggleVendorEditPopup.bind(this);
    this.onEditVendor = this.onEditVendor.bind(this);
    this.handleKitchenSignatureimages = this.handleKitchenSignatureimages.bind(
      this
    );
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (
      this.props.productdetail &&
      this.state.is_loading &&
      this.state.isEdit
    ) {
      var productDe = this.props.productdetail;
      var initData = {
        productname: productDe.productname,
        pid: productDe.pid,
        weight: productDe.weight,
        packetsize: productDe.packetsize || 0,
        short_desc: productDe.short_desc,
        productdetails: productDe.productdetails,
        hsn_code: productDe.hsn_code || 0,
        tag: productDe.tag,
        targetedbaseprice: productDe.targetedbaseprice || 0,
        mrp: productDe.mrp,
        gst: productDe.gst,
        discount_cost: productDe.discount_cost,
        //discountedamount: productDe.discountedamount,
      };

      if (productDe && productDe.catid) {
        var cat = [{ catid: productDe.catid, name: productDe.category_name }];
        this.setState({ category: cat, is_loading: false });
      }

      if (productDe && productDe.scl1_id) {
        var subcat = [
          { scl1_id: productDe.scl1_id, name: productDe.subcategoryl1_name },
        ];
        this.setState({ sub1Cat: subcat });
      }

      if (productDe && productDe.scl1_id) {
        var subcat2 = [
          { scl2_id: productDe.scl2_id, name: productDe.subcategory2_name },
        ];
        this.setState({ sub2Cat: subcat2 });
      }

      if (productDe && productDe.uomid) {
        var uom = [{ uomid: productDe.uomid, name: productDe.uom }];
        this.setState({ uom: uom });
      }

      if (productDe && productDe.brand_id) {
        var brand = [
          { id: productDe.brand_id, brandname: productDe.brandname },
        ];
        this.setState({ brand: brand });
      }
      if (productDe && productDe.tag_id) {
        var tag = [{ tagid: productDe.tag_id, name: productDe.tagname }];
        this.setState({ tag: tag });
      }

      if (productDe) {
        var perishable = productDe.Perishable === 1 ? "Yes" : "No";
        var Perishable = [{ id: productDe.Perishable, name: perishable }];
        this.setState({ perishable: Perishable });
      }

      if (productDe) {
        var vegName =
          productDe.vegtype === 0
            ? "Veg"
            : productDe.vegtype === 1
            ? "Non Veg"
            : "Vegan";
        var productType = [{ id: productDe.vegtype, name: vegName }];
        this.setState({ productType: productType });
      }
      if (productDe.image) {
        this.props.onSetImages(productDe.image);
      }

      if (productDe.vendorlist) {
        var vendors = productDe.vendorlist;
        for (var i = 0; i < vendors.length; i++) {
          vendors[i].isEdit = false;
        }
        this.setState({ vendor: vendors });
      }

      this.setState({ is_loading: false });
      this.props.initialize(initData);
    }
    if (this.props.isProductUpdated) {
      this.props.onClearProduct();
      this.props.history.goBack();
    }

    if(!this.state.isEdit && this.state.is_loading){
      this.setState({ is_loading: false});
      if (this.props.cat) {
        var addcat = [{ catid: this.props.cat.catid, name: this.props.cat.name }];
        this.setState({ category: addcat});
      }

      if (this.props.l1cat) {
        var addsubcat = [
          { scl1_id: this.props.l1cat.scl1_id, name: this.props.l1cat.name },
        ];
        this.setState({ sub1Cat: addsubcat });
      }

      if (this.props.l2cat) {
        var addsubcat2 = [
          { scl2_id: this.props.l2cat.scl2_id, name: this.props.l2cat.name },
        ];
        this.setState({ sub2Cat: addsubcat2 });
      }
    }
  }
  componentDidCatch() {}
  submit = (data) => {
    // if (this.state.category.length>0) {
    //   data.catid = this.state.category[0].catid;
    // }
if(data.KSI0){
  delete data.KSI0;
}

    if (this.state.sub1Cat.length > 0) {
      data.scl1_id = this.state.sub1Cat[0].scl1_id;
    }
    if (this.state.sub2Cat.length > 0) {
      data.scl2_id = this.state.sub2Cat[0].scl2_id;
    }

    if (this.state.uom.length > 0) {
      data.uom = this.state.uom[0].uomid;
    }

    if (this.state.brand.length > 0) {
      data.brand = this.state.brand[0].id;
    }

    if (this.state.zone.length > 0) {
      data.zone = this.state.zone[0].id;
    }

    if (this.state.perishable.length > 0) {
      data.Perishable = this.state.perishable[0].id;
    }

    if (this.state.productType.length > 0) {
      data.vegtype = this.state.productType[0].id;
    }
    if (this.state.tag.length > 0) {
      data.tag = this.state.tag[0].tagid;
    }

    if (this.props.Signature.length > 0) {
      data.image = this.props.Signature[0].img_url;
    }
    if (this.state.isEdit) {
      var productDe = this.props.productdetail;
      data.pid = productDe.pid;
      this.props.onEditProductDetails(data);
    } else this.props.onAddProductDetails(data);
  };
  selectedCat = (item) => {
    // this.setState({ selected_cat: item[0] });
    this.setState({ category: item });
    this.props.onGetSubCat1({ catid: item[0].catid, zone_id: 1 });
  };
  selectedSub1Cat = (item) => {
    //this.setState({ selected_cat_sub1: item[0] });
    this.setState({ sub1Cat: item });
    this.props.onGetSubCat2({ scl1_id: item[0].scl1_id, zone_id: 1 });
  };
  selectedSub2Cat = (item) => {
    // this.setState({ selected_cat_sub2: item[0] });
    this.setState({ sub2Cat: item });
  };
  selectedUOM = (item) => {
    this.setState({ uom: item });
  };
  selectedBrand = (item) => {
    this.setState({ brand: item });
  };
  selectedZone = (item) => {
    this.setState({ zone: item });
  };
  selectedPer = (item) => {
    this.setState({ perishable: item });
  };
  selectedPrType = (item) => {
    this.setState({ productType: item });
  };
  selectedTag = (item) => {
    this.setState({ tag: item });
  };
  toggleVendorEditPopup = () => {
    this.setState({
      vendorEdit: !this.state.vendorEdit,
    });
  };

  onEditVendor = (Item) => {
    this.setState({
      selectedVendor: Item,
    });
    this.toggleVendorEditPopup();
  };

  handleonRemove = (imgid, imgType, index) => {
    const { removeimages } = this.state;
    this.props.onDeleteMenuImages(imgType, index);
    if (imgid) {
      removeimages.push(imgid);
      this.setState({
        removeimages,
      });
    }
  };

  handleKitchenSignatureimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    data.append("type", 4);
    this.props.onUpdateMenuImages(data,4);
  };

  render() {
    return (
      <div>
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Product Add</div>
            <div>
              <form onSubmit={this.props.handleSubmit(this.submit)}>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="4">
                    <Field
                      name="cat_id"
                      component={InputSearchDropDown}
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
                    <Field
                      name="scl1_id"
                      component={InputSearchDropDown}
                      options={this.props.subcat_L1}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="scl1_id"
                      noDataLabel="No matches found"
                      values={this.state.sub1Cat}
                      onSelection={this.selectedSub1Cat}
                      label="L1 Category"
                    />
                    <Field
                      name="scl2_id"
                      component={InputSearchDropDown}
                      options={this.props.subcat_L2}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="scl2_id"
                      noDataLabel="No matches found"
                      values={this.state.sub2Cat}
                      onSelection={this.selectedSub2Cat}
                      label="L2 Category"
                    />
                    <Field
                      name="productname"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Name"
                      validate={[required, minLength2]}
                      required={true}
                    />
                    <Field
                      name="pid"
                      autoComplete="off"
                      type="text"
                      disabled={true}
                      component={renderInputField}
                      label="Product Code"
                    />
                    <Field
                      name="weight"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="Weight (kg)"
                      validate={[required]}
                      required={true}
                    />
                    <Field
                      name="uom"
                      component={InputSearchDropDown}
                      options={this.props.UOMList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="uomid"
                      noDataLabel="No matches found"
                      values={this.state.uom}
                      onSelection={this.selectedUOM}
                      label="UOM"
                    />

                    <Field
                      name="packetsize"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="Packet Size"
                    />
                  </Col>

                  <Col lg="4">
                    <Field
                      name="brand"
                      component={InputSearchDropDown}
                      options={this.props.BrandList}
                      labelField="brandname"
                      searchable={true}
                      clearable={true}
                      searchBy="brandname"
                      valueField="id"
                      noDataLabel="No matches found"
                      values={this.state.brand}
                      onSelection={this.selectedBrand}
                      label="Brand"
                    />
                    <Field
                      name="short_desc"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Short Description"
                    />
                    <Field
                      name="productdetails"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Product Details"
                      validate={[required]}
                      required={true}
                    />
                    {/* <Field
                      name="zone"
                      component={InputSearchDropDown}
                      options={this.props.ZoneList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="zoneid"
                      noDataLabel="No matches found"
                      values={this.state.zone}
                      onSelection={this.selectedZone}
                      label="Zone Mapping"
                    /> */}
                    <Field
                      name="hsn_code"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="HSN Code"
                      validate={[required]}
                      required={true}
                    />

                    {/* <Field
                      name="tag"
                      autoComplete="off"
                      type="text"
                      component={renderInputField}
                      label="Tag"
                      validate={[required]}
                      required={true}
                    /> */}

                    <Field
                      name="tag"
                      component={InputSearchDropDown}
                      options={this.props.TagList}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="tagid"
                      noDataLabel="No matches found"
                      values={this.state.tag}
                      onSelection={this.selectedTag}
                      label="Tag"
                    />
                    <Field
                      name="Perishable"
                      component={InputSearchDropDown}
                      options={this.props.Perishable}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="id"
                      noDataLabel="No matches found"
                      values={this.state.perishable}
                      onSelection={this.selectedPer}
                      label="Perishable"
                    />

                    <Field
                      name="vegtype"
                      component={InputSearchDropDown}
                      options={this.props.ProductType}
                      labelField="name"
                      searchable={true}
                      clearable={true}
                      searchBy="name"
                      valueField="id"
                      noDataLabel="No matches found"
                      values={this.state.productType}
                      onSelection={this.selectedPrType}
                      label="Product Type"
                    />

                    <Field
                      name="targetedbaseprice"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="Targeted Base Price"
                      validate={[required]}
                      required={true}
                    />
                  </Col>

                  <Col lg="4">
                    {kitchenSignatureImg.map((item, i) => (
                      <div key={i} className="border-none">
                        <Field
                          name={"KSI" + i}
                          index={i}
                          component={DropzoneFieldMultiple}
                          type="file"
                          imgPrefillDetail={
                            this.props.Signature.length
                              ? this.props.Signature[i]
                              : ""
                          }
                          label="Photogropy"
                          handleonRemove={this.handleonRemove}
                          handleOnDrop={() => this.handleKitchenSignatureimages}
                        />
                      </div>
                    ))}
                    <Field
                      name="mrp"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="MRP"
                      validate={[required, minLength2]}
                      required={true}
                    />
                    <Field
                      name="gst"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="GST"
                      validate={[required]}
                      required={true}
                    />
                    <Field
                      name="discount_cost"
                      autoComplete="off"
                      type="number"
                      component={renderInputField}
                      label="Discount amount"
                    />
                  </Col>
                </Row>
                <Row className="mr-b-10">
                  <Col lg="10"></Col>

                  <Col className="txt-align-right">
                    <Button size="sm">Submit</Button>
                  </Col>
                  <Col className="txt-align-right">
                    <Button
                      size="sm"
                      className="mr-l-10 mr-r-10"
                      onClick={history.goBack}
                    >
                      Back
                    </Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>

          <div className="mr-t-20" hidden={this.state.vendor.length == 0}>
            <div className="fieldset">
              <div className="legend">
                Cost Comparison (PO/ PA- Active/PA - Expired)
              </div>
              <div>
                <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10">
                  {this.state.vendor.map((item, i) => (
                    <Col lg="4" className="pd-0">
                      <div className="fieldset">
                        <div className="legend">
                          {item.vendorname}-{item.vendorid}-
                          {Moment(item.expiry_date).format("DD/MM/YYYY")}
                        </div>
                        <Row className="pd-0 mr-l-10 pd-b-10">
                          <Col lg="11">
                            <CardRowColVendor
                              lable="Base Price"
                              value={item.base_price}
                            />
                            <CardRowColVendor
                              lable="Cost Price (Calculated field)"
                              value={item.cost_price}
                              disabled={true}
                            />
                            <CardRowColVendor
                              lable="Other charges (%)"
                              value={item.other_charges}
                            />
                            <Row>
                              <Col></Col>
                              <Col className="txt-align-right">
                                <Button
                                  size="sm"
                                  color="primary"
                                  onClick={() => this.onEditVendor(item)}
                                >
                                  Edit
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.vendorEdit}
          toggle={this.toggleVendorEditPopup}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={this.toggleVendorEditPopup}>
            Vendor Detail
          </ModalHeader>
          <ModalBody>
            <VendorEdit
              vendor={this.state.selectedVendor}
              pid={this.props.match.params.product_id}
              update={this.toggleVendorEditPopup}
            />
            {/* <div className="mr-t-20 txt-align-center">
              <Button onClick={this.updateVendor} size="sm">
                Done
              </Button>{" "}
              <Button
                onClick={this.togglePaymentPopup}
                size="sm"
                className="color-black border-color-black mr-l-10"
              >
                Cancel
              </Button>
            </div> */}
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

ProductAddEdit = reduxForm({
  form: PRODUCT_ADD_EDIT, // a unique identifier for this form
})(ProductAddEdit);
export default connect(mapStateToProps, mapDispatchToProps)(ProductAddEdit);
