import React from "react";
import { connect } from "react-redux";
import {
  STOCK_PRODUCT_LIST,
  UPDATE_WASTAGE_IMAGES,
  SET_WASTAGE_IMAGES,
  DELETE_WASTAGE_IMAGES,
} from "../constants/actionTypes";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import AxiosRequest from "../AxiosRequest";
import {
  Row,
  Col,
  Button,
} from "reactstrap";
import {
  STOCK_UPDATE_CLEAR,
  STOCK_UPDATE_PRODUCT_STOCK,
} from "../constants/actionTypes";
import Select from "react-dropdown-select";
import { Field, reduxForm, reset } from "redux-form";
import { required } from "../utils/Validation";
import { STOCK_ADD_FORM } from "../utils/constant";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import { getAdminId } from "../utils/ConstantFunction";

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
    <div className="pd-0 border-none">
      <div className="pd-0 border-grey mr-r-50">
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
  );
};

const mapStateToProps = (state) => ({
  ...state.stockkeepingadd,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetProductList: (data) =>
    dispatch({
      type: STOCK_PRODUCT_LIST,
      payload: AxiosRequest.StockKeeping.getProductList(data),
    }),
  onUpdateStockList: (data) =>
    dispatch({
      type: STOCK_UPDATE_PRODUCT_STOCK,
      payload: AxiosRequest.StockKeeping.addStockKeeping(data),
    }),
    onEditStockList: (data) =>
    dispatch({
      type: STOCK_UPDATE_PRODUCT_STOCK,
      payload: AxiosRequest.StockKeeping.editStockKeeping(data),
    }),
  onUpdateWastageImages: (data, imgtype) =>
    dispatch({
      type: UPDATE_WASTAGE_IMAGES,
      imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onSetImages: (image) =>
    dispatch({
      type: SET_WASTAGE_IMAGES,
      image,
    }),
  onDeleteImages: () =>
    dispatch({
      type: DELETE_WASTAGE_IMAGES,
    }),
  onClear: () =>
    dispatch({
      type: STOCK_UPDATE_CLEAR,
    }),
  onFromClear: () => dispatch(reset(STOCK_ADD_FORM)),
});

var kitchenSignatureImg = [1];
class StockAddFrom extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenAreaDropDown: false,
      validateModal: false,
      stocktype: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.submit = this.submit.bind(this);
    this.handleWastageimages = this.handleWastageimages.bind(this);
    this.handleonRemove = this.handleonRemove.bind(this);
    this.selectedType = this.selectedType.bind(this);
    this.props.onFromClear();
    this.setState({ stocktype: [] });
    this.props.onDeleteImages();
    if (this.props.isEdit) {
      var initData = {
        actual: this.props.selectedItem.actual_quantity,
        missing: this.props.selectedItem.missing_quantity,
        wastage: this.props.selectedItem.wastage,
        // data1.type = this.state.stocktype[0].id;
        // data1.wastage_image =
        //   this.props.Signature.length === 0 ? "" : this.props.Signature[0].img_url;
      };
      var typearray = [];
      typearray.push(this.props.stock_list[this.props.selectedItem.type]);
      this.setState({ stocktype: typearray });
      if(this.props.selectedItem.wastage_image)this.props.onSetImages(this.props.selectedItem.wastage_image);
      this.props.initialize(initData);
    }
  }

  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}
  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isStackupdated) {
      this.props.onClear();
      if(this.props.isEdit){
        this.props.onUpdate();
      }
    }
  }
  componentDidCatch() {}

  submit = (data) => {
    if(this.state.stocktype.length===0){
      notify.show(
        "Please select type after try this",
        "custom",
        3000,
        notification_color
      );
      return;
    }else if(!data.wastage&&!data.missing){
      notify.show(
        "Please enter wastage or missing quantity",
        "custom",
        3000,
        notification_color
      );
      return;
    }
    var data1 = {
      zoneid: this.props.zoneItem.id,
      done_by:getAdminId()
    };
    data1.actual_quantity = data.actual;
    data1.missing_quantity = data.missing;
    data1.wastage = data.wastage;
    data1.type = this.state.stocktype[0].id;
    data1.wastage_image =
      this.props.Signature.length === 0 ? "" : this.props.Signature[0].img_url;
      if (this.props.isEdit) {
        data1.skid = this.props.selectedItem.skid;
        this.props.onEditStockList(data1);
      } else {
        data1.stockid = this.props.selectedItem.stockid;
        data1.vpid = this.props.selectedItem.vpid;
        this.props.onUpdateStockList(data1);
      }
    this.props.onValidationModal();
  };
  handleonRemove = (imgid, imgType, index) => {
    this.props.onDeleteImages(imgType, index);
  };

  handleWastageimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    var type = 4;
    data.append("type", type);
    this.props.onUpdateWastageImages(data, type);
  };
  selectedType = (item) => {
    this.setState({ stocktype: item });
  };

  render() {
    return (
      <div>
        <div className="fieldset">
          <div className="legend">Variance validation</div>
          <div className="mr-r-20 mr-l-20">
            <form onSubmit={this.props.handleSubmit(this.submit)}>
              <Row className="pd-0 mr-l-10 mr-r-10">
                <Col lg="5" className="color-grey pd-0">
                  <div className="border-none">
                    Stock keeping type <span className="must">*</span>
                  </div>
                </Col>
                <Col lg="7" className="mr-l-10">
                  <Field
                    name="stock_id"
                    component={InputSearchDropDown}
                    options={this.props.stock_list}
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.stocktype}
                    onSelection={this.selectedType}
                    label="Stock keeping type"
                  />
                </Col>
              </Row>

              <Row className="pd-0">
                <Col lg="5" className="color-grey pd-0">
                  <div className="border-none">
                    Actual qty <span className="must">*</span>
                  </div>
                </Col>
                <Col lg="7">
                  <Field
                    name="actual"
                    autoComplete="off"
                    type="number"
                    component={InputField}
                    validate={[required]}
                    required={true}
                  />
                </Col>
              </Row>

              <Row className="pd-0">
                <Col lg="5" className="color-grey pd-0">
                  <div className="border-none">Missing qty</div>
                </Col>
                <Col lg="7">
                  <Field
                    name="missing"
                    autoComplete="off"
                    type="number"
                    component={InputField}
                  />
                </Col>
              </Row>

              <Row className="pd-0">
                <Col lg="5" className="color-grey pd-0">
                  <div className="border-none">Wastage qty</div>
                </Col>
                <Col lg="7">
                  <Field
                    name="wastage"
                    autoComplete="off"
                    type="number"
                    component={InputField}
                  />
                </Col>
              </Row>

              <Row className="pd-0 mr-l-10 mr-r-10">
                <Col lg="5" className="color-grey pd-0">
                  <div className="border-none">Upload Proof</div>
                </Col>
                <Col lg="7">
                  {kitchenSignatureImg.map((item, i) => (
                    <div key={i} className="border-none">
                      <Field
                        name={"wst" + i}
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
                        handleOnDrop={() => this.handleWastageimages}
                      />
                    </div>
                  ))}
                </Col>
              </Row>

              <Row className="pd-10">
                <Col className="txt-align-center">
                  <Button size="sm">Submit</Button>
                </Col>
                <Col className="txt-align-center">
                  <Button
                    size="sm"
                    className="border-grey color-grey"
                    onClick={this.props.onValidationModal}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
StockAddFrom = reduxForm({
  form: STOCK_ADD_FORM, // a unique identifier for this form
})(StockAddFrom);

export default connect(mapStateToProps, mapDispatchToProps)(StockAddFrom);
