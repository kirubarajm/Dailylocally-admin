import React from "react";
import { connect } from "react-redux";
import { STOCK_PRODUCT_LIST } from "../constants/actionTypes";
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
import { Field, reduxForm, reset } from "redux-form";
import { required, minLength2 } from "../utils/Validation";
import { STOCK_ADD_FORM } from "../utils/constant";

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
      payload: AxiosRequest.StockKeeping.getProductList(data),
    }),
  onClear: () =>
    dispatch({
      type: STOCK_UPDATE_CLEAR,
    }),
  onFromClear: () => dispatch(reset(STOCK_ADD_FORM)),
});

class StockKeepingAdd extends React.Component {
  constructor() {
    super();
    this.state = { isOpenAreaDropDown: false, validateModal: false };
  }

  UNSAFE_componentWillMount() {
    this.onStockProductList = this.onStockProductList.bind(this);
    this.toggleAreaDropDown = this.toggleAreaDropDown.bind(this);
    this.onValidationModal = this.onValidationModal.bind(this);
    this.clickArea = this.clickArea.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
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
      var data = { zone_id: this.props.zoneItem.id };
      //this.props.onGetProductList(data);
    }
  };

  submit = (data) => {
    var data1 = {
      zone_id: this.props.zoneItem.id,
      missing: data.missing,
      wastage: data.wastage,
    };

    // this.props.onUpdateStockList(data1);
  };

  render() {
    const productList = this.props.productList || [];
    return (
      <div>
        <div className="pd-12">
          <Row>
            <Col></Col>
            <Col>
              <div className="float-right" style={{ display: "flex", flexDirection: "row" }}>
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
                    <th>Actual</th>
                    <th>Comment</th>
                    <th>Rate</th>
                    <th>Stock keeping type</th>
                  </tr>
                </thead>
                <tbody>
                  {productList.map((item, i) => (
                    <tr key={i}>
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
        <Modal
          isOpen={this.state.validateModal}
          toggle={this.onValidationModal}
          backdrop={"static"}
        >
          <ModalBody>
            <div className="fieldset">
              <div className="legend">Variance validation</div>
              <div className="mr-r-20 mr-l-20">
                <form onSubmit={this.props.handleSubmit(this.submit)}>
                  <Row className="pd-0">
                    <Col lg="5" className="color-grey pd-0">
                      <div className="border-none">Wastage</div>
                    </Col>
                    <Col lg="7">
                      <Field
                        name="wastage"
                        autoComplete="off"
                        type="number"
                        component={InputField}
                        validate={[required, minLength2]}
                        required={true}
                      />
                    </Col>
                  </Row>
                  <Row className="pd-0">
                    <Col lg="5" className="color-grey pd-0">
                      <div className="border-none">Missing</div>
                    </Col>
                    <Col lg="7">
                      <Field
                        name="missing"
                        autoComplete="off"
                        type="number"
                        component={InputField}
                        validate={[required, minLength2]}
                        required={true}
                      />
                    </Col>
                  </Row>
                  <Row className="pd-10">
                    <Col className="txt-align-center">
                      <Button color="secondary" size="sm">
                        Update
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
