import React from "react";
import { connect } from "react-redux";
import {
  STOCK_PRODUCT_LIST,
  UPDATE_WASTAGE_IMAGES,
  SET_WASTAGE_IMAGES,
  DELETE_WASTAGE_IMAGES,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import { store } from "../store";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  ZONE_SELECT_ITEM,
  ZONE_ITEM_REFRESH,
  STOCK_UPDATE_CLEAR,
  STOCK_UPDATE_PRODUCT_STOCK,
} from "../constants/actionTypes";
import Select from "react-dropdown-select";
import { Field, reduxForm, reset } from "redux-form";
import { required, minLength2 } from "../utils/Validation";
import { STOCK_ADD_FORM } from "../utils/constant";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";

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
class StockKeepingAdd extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpenAreaDropDown: false,
      validateModal: false,
      stocktype: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.onStockProductList = this.onStockProductList.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.onValidationModal = this.onValidationModal.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.submit = this.submit.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.handleWastageimages = this.handleWastageimages.bind(this);
    this.handleonRemove = this.handleonRemove.bind(this);
    this.selectedType = this.selectedType.bind(this);
    this.onStockProductList();
  }

  onActionClick = (item) => (ev) => {
    this.setState({ selectedItem: item });
    this.onValidationModal();
  };
  onValidationModal = () => {
    this.setState((prevState) => ({
      validateModal: !prevState.validateModal,
    }));
  };
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

    if (this.props.isStackupdated) {
      this.props.onClear();
      this.onValidationModal();
    }

    this.onStockProductList();
  }
  componentDidCatch() {}

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  onStockProductList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zone_id: this.props.zoneItem.id };
      this.props.onGetProductList(data);
    }
  };

  submit = (data) => {
    var data1 = {
      zone_id: this.props.zoneItem.id
    };
    data1.stockid=this.state.selectedItem.stockid;
    data1.vpid=this.state.selectedItem.vpid;
    data1.actual_quantity=data.actual;
    data1.missing_quantity=data.missing;
    data1.wastage=data.wastage;
    data1.type=this.state.stocktype[0].id;
    data1.wastage_image=this.props.Signature.length === 0? "": this.props.Signature[0].img_url;
    this.props.onUpdateStockList(data1);
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
    const productList = this.props.productList || [];
    return (
      <div>
        <div className="pd-12">
          <Row>
            <Col></Col>
            <Col>
              <div
                className="float-right"
                style={{ display: "flex", flexDirection: "row" }}
              >
                <span className="mr-r-20">Area</span>
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
          <div className="mr-t-10">
            <div className="search-vscroll">
              <Table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>L1 Category</th>
                    <th>L2 Category</th>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>UOM</th>
                    <th>BOH</th>
                    <th>In sorting</th>
                    <th>Rate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item, i) => (
                    <tr key={i}>
                      <td>{item.catagory_name}</td>
                      <td>{item.subcatL1name}</td>
                      <td>{item.subcatL2name}</td>
                      <td>{item.vpid}</td>
                      <td>{item.Productname}</td>
                      <td>{item.uom_name}</td>
                      <td>{item.boh}</td>
                      <td>{item.insorting}</td>
                      <td>{item.mrp}</td>
                      <td>
                        <Button
                          className="btn-close"
                          disabled={item.received_quantity}
                          onClick={this.onActionClick(item)}
                        >
                          Action
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.validateModal}
          toggle={this.onValidationModal}
          backdrop={"static"}
          className="max-width-600"
        >
          <ModalBody>
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
                  <Row className="pd-0 mr-l-10 mr-r-10">
                    <Col lg="5" className="color-grey pd-0">
                      <div className="border-none">Wastage Image</div>
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
                      <Button size="sm">
                        Submit
                      </Button>
                    </Col>
                    <Col className="txt-align-center">
                      <Button
                        size="sm"
                        className="border-grey color-grey"
                        onClick={this.onValidationModal}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </form>
              </div>
            </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
StockKeepingAdd = reduxForm({
  form: STOCK_ADD_FORM, // a unique identifier for this form
})(StockKeepingAdd);

export default connect(mapStateToProps, mapDispatchToProps)(StockKeepingAdd);
