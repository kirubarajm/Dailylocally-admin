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
import StockAddFrom from "./StockAddFrom";
import { getAdminId } from "../utils/ConstantFunction";



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
});

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
      //this.onValidationModal();
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
      var data = { zoneid: this.props.zoneItem.id,done_by:1 };
      this.props.onGetProductList(data);
    }
  };

  submit = (data) => {
    var data1 = {
      zoneid: this.props.zoneItem.id,
      done_by:getAdminId()
    };
    data1.stockid = this.state.selectedItem.stockid;
    data1.vpid = this.state.selectedItem.vpid;
    data1.actual_quantity = data.actual;
    data1.missing_quantity = data.missing;
    data1.wastage = data.wastage;
    data1.type = this.state.stocktype[0].id;
    data1.wastage_image =
      this.props.Signature.length === 0 ? "" : this.props.Signature[0].img_url;
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
                  Close
                </Button>
              </div>
            </Col>
          </Row>
          <div className="mr-t-10">
            <div className="search-stock-add">
              <Table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>L1 Category</th>
                    <th>L2 Category</th>
                    <th>Product Code</th>
                    <th>Product Name</th>
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
            <StockAddFrom
              onValidationModal={this.onValidationModal}
              selectedItem={this.state.selectedItem}
              isEdit={false}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(StockKeepingAdd);
