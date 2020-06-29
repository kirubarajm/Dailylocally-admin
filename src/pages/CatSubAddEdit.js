import React from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import AxiosRequest from "../AxiosRequest";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import {
  CATELOG_ADD_L1CAT,
  CATELOG_ADD_L2CAT,
  CATELOG_EDIT_L1CAT,
  CATELOG_EDIT_L2CAT,
  CATELOG_SUBCATEGORY_EDIT_L1_LIST,
  CATELOG_ADD_CAT,
  CATELOG_CLEAR_FROM,
  CATELOG_EDIT_CAT,
  DELETE_CAT_IMAGES,
  SET_CAT_IMAGES,
  UPDATE_CAT_IMAGES,
} from "../constants/actionTypes";
import { CAT_SUB_ADD_EDIT } from "../utils/constant";
import { Field, reduxForm } from "redux-form";
import { required, minLength2, requiredTrim } from "../utils/Validation";
import Select from "react-dropdown-select";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
// import { Button} from 'react-bootstrap';

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
      <Row className="pd-0 mr-l-10 mr-r-10 border-none">
        <Col lg="6" className="pd-0">
          <label className="mr-0 color-grey pd-0 ">
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

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div className="border-none">
      <div>
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        <span
          style={{
            flex: "0",
            WebkitFlex: "0",
            width: "100px",
            height: "10px",
            fontSize: "12px",
            color: "red",
          }}
        >
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </span>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  ...state.catsubaddedit,
  category_list: state.catalog.category_list,
  zoneItem:state.catalog.zoneItem
});

const mapDispatchToProps = (dispatch) => ({
  onGetSubCat1: (data) =>
    dispatch({
      type: CATELOG_SUBCATEGORY_EDIT_L1_LIST,
      payload: AxiosRequest.Catelog.getSubCate1(data),
    }),
  OnAddCategory: (data) =>
    dispatch({
      type: CATELOG_ADD_CAT,
      payload: AxiosRequest.Catelog.onAddCat(data),
    }),
  OnEditCategory: (data) =>
    dispatch({
      type: CATELOG_EDIT_CAT,
      payload: AxiosRequest.Catelog.onEditCat(data),
    }),
  OnAddL1Category: (data) =>
    dispatch({
      type: CATELOG_ADD_L1CAT,
      payload: AxiosRequest.Catelog.onAddL1Cat(data),
    }),
  OnEditL1Category: (data) =>
    dispatch({
      type: CATELOG_EDIT_L1CAT,
      payload: AxiosRequest.Catelog.onEditL1Cat(data),
    }),
  OnAddL2Category: (data) =>
    dispatch({
      type: CATELOG_ADD_L2CAT,
      payload: AxiosRequest.Catelog.onAddL2Cat(data),
    }),
  OnEditL2Category: (data) =>
    dispatch({
      type: CATELOG_EDIT_L2CAT,
      payload: AxiosRequest.Catelog.onEditL2Cat(data),
    }),
  onUpdateCATImages: (data, imgtype) =>
    dispatch({
      type: UPDATE_CAT_IMAGES,
      imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onSetImages: (image) =>
    dispatch({
      type: SET_CAT_IMAGES,
      image,
    }),
    onDeleteImages: () =>
    dispatch({
      type: DELETE_CAT_IMAGES,
    }),
  onClear: () =>
    dispatch({
      type: CATELOG_CLEAR_FROM,
    }),
});
var isEdit = false;
var kitchenSignatureImg = [1];
class CatSubAddEdit extends React.Component {
  constructor() {
    super();

    this.state = {
      isCat: false,
      isSubCat1: false,
      isSubCat2: false,
      category: [],
      sub1Cat: [],
      sub2Cat: [],
      selected_cat: -1,
      selected_cat_sub1: -1,
      selected_cat_sub2: -1,
      is_loading: true,
    };
  }

  UNSAFE_componentWillMount() {
    this.props.onDeleteImages();
    this.selectedCat = this.selectedCat.bind(this);
    this.selectedSub1Cat = this.selectedSub1Cat.bind(this);
    //this.selectedSub2Cat = this.selectedSub2Cat.bind(this);
    isEdit = this.props.isEdit;
    this.setState({
      isCat: this.props.isCat,
      isSubCat1: this.props.isSubCat1,
      isSubCat2: this.props.isSubCat2,
      isEdit: isEdit,
    });
    if (this.props.isEdit && this.props.isCat) {
      var data = { categoryname: this.props.edit_cat_item.name };
      this.props.initialize(data);
      if (this.props.edit_cat_item.image)
        this.props.onSetImages(this.props.edit_cat_item.image);
    }

    if (this.props.isSubCat1) {
      // this.props.onGetCategory({ zone_id: 1 });
      var cat = [
        {
          catid: this.props.selected_cat.catid,
          name: this.props.selected_cat.name,
        },
      ];
      this.setState({ category: cat });

      if (this.props.isEdit) {
        var datal1 = { l1scname: this.props.edit_cat_sub1_item.name };
        this.props.initialize(datal1);
        if (this.props.edit_cat_sub1_item.image)
          this.props.onSetImages(this.props.edit_cat_sub1_item.image);
      }
    }

    if (this.props.isSubCat2) {
      // this.props.onGetCategory({ zone_id: 1 });
      this.props.onGetSubCat1({
        catid: this.props.selected_cat.catid,
        zone_id: this.props.zoneItem.id,
      });
      var catadd = [
        {
          catid: this.props.selected_cat.catid,
          name: this.props.selected_cat.name,
        },
      ];
      this.setState({ category: catadd });
      var subcat = [
        {
          scl1_id: this.props.selected_cat_sub1.scl1_id,
          name: this.props.selected_cat_sub1.name,
        },
      ];
      this.setState({ sub1Cat: subcat });

      if (this.props.isEdit) {
        var datal2 = { l2scname: this.props.edit_cat_sub2_item.name };
        this.props.initialize(datal2);
        if (this.props.edit_cat_sub2_item.image)
          this.props.onSetImages(this.props.edit_cat_sub2_item.image);
      }
    }
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isCatUpdate) {
      this.props.onClear();
      this.props.update();
    }
  }
  componentDidCatch() {}
  submit = (data) => {
    if(this.props.Signature.length===0){
      notify.show(
        "Please upload the photo. after try again",
        "custom",
        3000,
        notification_color
      );
      return;
    }
    if (this.props.isCat && this.props.isEdit) {
      var editCat = {
        name: data.categoryname,
        catid: this.props.edit_cat_item.catid,
        image:
          this.props.Signature.length === 0
            ? ""
            : this.props.Signature[0].img_url,
      };
      this.props.OnEditCategory(editCat);
    } else if (this.props.isCat && !this.props.isEdit) {
      var addCat = {
        name: data.categoryname,
        image:
          this.props.Signature.length === 0
            ? ""
            : this.props.Signature[0].img_url,
      };
      this.props.OnAddCategory(addCat);
    } else if (this.props.isSubCat1 && this.props.isEdit) {
      var editL1Cat = {
        catid: this.state.category[0].catid,
        scl1_id: this.props.edit_cat_sub1_item.scl1_id,
        name: data.l1scname,
        image:
          this.props.Signature.length === 0
            ? ""
            : this.props.Signature[0].img_url,
      };
      this.props.OnEditL1Category(editL1Cat);
    } else if (this.props.isSubCat1 && !this.props.isEdit) {
      var addL1Cat = {
        catid: this.state.category[0].catid,
        name: data.l1scname,
        image:
          this.props.Signature.length === 0
            ? ""
            : this.props.Signature[0].img_url,
      };
      this.props.OnAddL1Category(addL1Cat);
    } else if (this.props.isSubCat2 && this.props.isEdit) {
      var editL2Cat = {
        scl1_id: this.state.sub1Cat[0].scl1_id,
        scl2_id: this.props.edit_cat_sub2_item.scl2_id,
        name: data.l2scname,
        image:
          this.props.Signature.length === 0
            ? ""
            : this.props.Signature[0].img_url,
      };
      this.props.OnEditL2Category(editL2Cat);
    } else if (this.props.isSubCat2 && !this.props.isEdit) {
      var addL2Cat = {
        scl1_id: this.state.sub1Cat[0].scl1_id,
        name: data.l2scname,
        image:
          this.props.Signature.length === 0
            ? ""
            : this.props.Signature[0].img_url,
      };
      this.props.OnAddL2Category(addL2Cat);
    }
  };
  selectedCat(item) {
    this.setState({ category: item, sub1Cat: [] });
    this.props.onGetSubCat1({ catid: item[0].catid, zone_id: this.props.zoneItem.id });
  }
  selectedSub1Cat(item) {
    this.setState({ sub1Cat: item });
  }
  selectedSub2Cat = (item) => (e) => {
    // this.setState({ selected_cat_sub2: item[0] });
    this.setState({ sub2Cat: item });
  };

  handleonRemove = (imgid, imgType, index) => {
    this.props.onDeleteImages(imgType, index);
  };

  handleCATimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    var type = 1;
    if (this.state.isSubCat1) type = 2;
    if (this.state.isSubCat2) type = 3;
    data.append("type", type);
    this.props.onUpdateCATImages(data, type);
  };

  render() {
    return (
      <div>
        <div
          style={{
            height: this.state.isCat
              ? "55vh"
              : this.state.isSubCat1
              ? "60vh"
              : "65vh",
          }}
          className="pd-6"
        >
          <div className="fieldset" hidden={!this.state.isCat}>
            <div className="legend">
              {this.props.isEdit ? "Category Edit" : "Category Add"}
            </div>
            <div>
              <form onSubmit={this.props.handleSubmit(this.submit)}>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="5" className="color-grey pd-0">
                    <div className="border-none">Category Name <span className="must width-25">*</span></div>
                  </Col>
                  <Col lg="7">
                    <Field
                      name="categoryname"
                      autoComplete="off"
                      type="text"
                      component={InputField}
                      validate={this.state.isCat ? [required, minLength2,requiredTrim] : []}
                      required={true}
                    />
                  </Col>
                </Row>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="5" className="color-grey pd-0">
                    <div className="border-none">Category Photo <span className="must width-25">*</span></div> 
                  </Col>
                  <Col lg="7">
                    {kitchenSignatureImg.map((item, i) => (
                      <div key={i} className="border-none">
                        <Field
                          name={"CAT" + i}
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
                          handleOnDrop={() => this.handleCATimages}
                        />
                      </div>
                    ))}
                  </Col>
                </Row>
                <Row className="mr-b-10">
                  <Col lg="8"></Col>
                  <Col className="txt-align-right">
                    <Button size="sm">Submit</Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
          <div className="fieldset" hidden={!this.state.isSubCat1}>
            <div className="legend">
              {this.props.isEdit ? "L1 SC Edit" : "L1 SC Add"}
            </div>
            <div>
              <form onSubmit={this.props.handleSubmit(this.submit)}>
                <Row className="pd-0">
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
                </Row>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="5" className="color-grey pd-0">
                    <div className="border-none">L1 SC Name <span className="must width-25">*</span></div>
                  </Col>
                  <Col lg="7">
                    <Field
                      name="l1scname"
                      autoComplete="off"
                      type="text"
                      component={InputField}
                      validate={
                        this.state.isSubCat1 ? [required, minLength2,requiredTrim] : []
                      }
                      required={true}
                    />
                  </Col>
                </Row>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="5" className="color-grey pd-0">
                    <div className="border-none">L1 SC Photo <span className="must width-25">*</span></div>
                  </Col>
                  <Col lg="7">
                    {kitchenSignatureImg.map((item, i) => (
                      <div key={i} className="border-none">
                        <Field
                          name={"L1SC" + i}
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
                          handleOnDrop={() => this.handleCATimages}
                        />
                      </div>
                    ))}
                  </Col>
                </Row>
                <Row className="mr-b-10">
                  <Col lg="8"></Col>
                  <Col className="txt-align-right">
                    <Button size="sm">Submit</Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>

          <div className="fieldset" hidden={!this.state.isSubCat2}>
            <div className="legend">
              {this.props.isEdit ? "L2 SC Edit" : "L2 SC Add"}
            </div>
            <div>
              <form onSubmit={this.props.handleSubmit(this.submit)}>
                <Row className="pd-0">
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
                </Row>
                <Row className="pd-0">
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
                    label="L1 SC"
                  />{" "}
                </Row>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="5" className="color-grey pd-0">
                    <div className="border-none">L2 SC Name <span className="must width-25">*</span></div>
                  </Col>
                  <Col lg="7">
                    <Field
                      name="l2scname"
                      autoComplete="off"
                      type="text"
                      component={InputField}
                      validate={
                        this.state.isSubCat2 ? [required, minLength2,requiredTrim] : []
                      }
                      required={true}
                    />
                  </Col>
                </Row>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  <Col lg="5" className="color-grey pd-0">
                    <div className="border-none">L2 SC Photo <span className="must width-25">*</span></div>
                  </Col>
                  <Col lg="7">
                    {kitchenSignatureImg.map((item, i) => (
                      <div key={i} className="border-none">
                        <Field
                          name={"L2SC" + i}
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
                          handleOnDrop={() => this.handleCATimages}
                        />
                      </div>
                    ))}
                  </Col>
                </Row>
                <Row className="mr-b-10">
                  <Col lg="8"></Col>
                  <Col className="txt-align-right">
                    <Button size="sm">Submit</Button>
                  </Col>
                </Row>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CatSubAddEdit = reduxForm({
  form: CAT_SUB_ADD_EDIT, // a unique identifier for this form
})(CatSubAddEdit);
export default connect(mapStateToProps, mapDispatchToProps)(CatSubAddEdit);
