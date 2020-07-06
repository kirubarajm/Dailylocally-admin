import React from "react";
import { connect } from "react-redux";
import { TRACK_ORDER_VIEW } from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import {
  Card,
  CardBody,
  Row,
  Col,
  Collapse,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  CardImg,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import Moment from "moment";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ORDER_VIEW_FORM } from "../utils/constant";
import { reduxForm, Field } from "redux-form";
import { required, minLength5, maxLength160 } from "../utils/Validation";

const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div className="flex-column">
      <textarea
        {...input}
        placeholder={label}
        type={type}
        autoComplete="off"
        cols={custom.cols}
        rows={custom.rows}
      />
      <span className="font-size-12 must">
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </span>
    </div>
  );
};

const mapStateToProps = (state) => ({ ...state.orderview });

const mapDispatchToProps = (dispatch) => ({
  onGetOrdersDetail: (data) =>
    dispatch({
      type: TRACK_ORDER_VIEW,
      payload: AxiosRequest.Warehouse.dayorderlist(data),
    }),
});

function CardRowCol(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item font-size-14">
        <Col lg="4" className="color-grey">
          {lable}
        </Col>
        <Col lg="1">:</Col>
        <Col style={{ color: color }}>{props.value}</Col>
      </Row>
    );
  }

  return <div />;
}

class OrderView extends React.Component {
  constructor() {
    super();
    this.state = {
      today: Moment(new Date()),
      isCollapseOrderDetail: true,
      isCollapseProductDetail: true,
      isCollapseLogDetail: false,
      isCollapseDriverDetail: false,
      isOpenActionDropDown: false,
      actionItem: { id: -1, name: "Action" },
      cancelItem: { id: 1, name: "Enter Cancellation reason" },
      isCancelModal: true,
      isCancelReasonModal: false,
      selected_product: [],
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({ orderid: this.props.match.params.id });
    this.onCollapseOrderDetail = this.onCollapseOrderDetail.bind(this);
    this.onCollapseProductDetail = this.onCollapseProductDetail.bind(this);
    this.onCollapseDriverDetail = this.onCollapseDriverDetail.bind(this);
    this.onCollapseLogDetail = this.onCollapseLogDetail.bind(this);
    this.toggleAction = this.toggleAction.bind(this);
    this.clickAction = this.clickAction.bind(this);
    this.ImageDownload = this.ImageDownload.bind(this);
    this.toggleCancel = this.toggleCancel.bind(this);
    this.toggleCancelReason = this.toggleCancelReason.bind(this);
    this.clickCancelReason = this.clickCancelReason.bind(this);
    this.cancelConfirm = this.cancelConfirm.bind(this);
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}
  onCollapseOrderDetail = () => {
    this.setState({
      isCollapseOrderDetail: !this.state.isCollapseOrderDetail,
    });
  };

  onCollapseProductDetail = () => {
    this.setState({
      isCollapseProductDetail: !this.state.isCollapseProductDetail,
    });
  };

  onCollapseLogDetail = () => {
    this.setState({
      isCollapseLogDetail: !this.state.isCollapseLogDetail,
    });
  };

  onCollapseDriverDetail = () => {
    this.setState({
      isCollapseDriverDetail: !this.state.isCollapseDriverDetail,
    });
  };
  toggleAction = () => {
    this.setState({
      isOpenActionDropDown: !this.state.isOpenActionDropDown,
    });
  };
  clickAction = (item) => {
    this.toggleCancel();
  };

  toggleCancel = () => {
    this.setState({
      isCancelModal: !this.state.isCancelModal,
    });
  };
  toggleCancelReason = () => {
    this.setState({
      isCancelReasonModal: !this.state.isCancelReasonModal,
    });
  };
  clickCancelReason = (item) => {
    this.setState({
      cancelItem: item,
    });
  };
  cancelConfirm = value => {
    console.log(value);
  };

  ImageDownload = (img) => {
    if (document.getElementById(img)) document.getElementById(img).click();
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_product || [];
    const cartItem = this.props.orderview.items || [];
    if (name === "selectall") {
      if (value) {
        arvalue[name] = value;
        cartItem.map((item, i) => {
          arvalue[item.pid] = value;
        });
      } else {
        arvalue = {};
      }
    } else {
      if (value) {
        arvalue[name] = value;
        var allCheck = true;
        cartItem.map((item, i) => {
          if (!arvalue[item.pid]) {
            allCheck = false;
          }
        });
        if (allCheck) arvalue["selectall"] = value;
      } else {
        if (arvalue["selectall"]) {
          delete arvalue["selectall"];
        }
        delete arvalue[name];
      }
    }

    this.setState({
      selected_product: arvalue,
    });
  }

  render() {
    const propdata = this.props.orderview;
    const cartItems = propdata.items || [];
    return (
      <div className="pd-15">
        <Row>
          <Col></Col>
          <Col>
            <div className="float-right mr-r-20">
              <ButtonDropdown
                className="max-height-30"
                isOpen={this.state.isOpenActionDropDown}
                toggle={this.toggleAction}
                size="sm"
              >
                <DropdownToggle caret>
                  {this.state.actionItem.name || ""}
                </DropdownToggle>
                <DropdownMenu>
                  {this.props.actionList.map((item, index) => (
                    <DropdownItem
                      onClick={() => this.clickAction(item)}
                      key={index}
                    >
                      {item.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
            </div>
          </Col>
        </Row>
        <div className="fieldset mr-b-10">
          <div className="legend">
            Order Detail - Order Id # {this.state.orderid}
          </div>
          <Row className="mr-lr-10 pd-8">
            <Col>
              <CardRowCol lable="Customer Name" value="M Basheer Ahamed" />
              <CardRowCol lable="Customer Id" value="# 420" />
              <CardRowCol lable="Phone NO" value="989500217" />
              <CardRowCol lable="Email" value="basheer@tovogroup.com" />
              <CardRowCol
                lable="Manual Entered address"
                value="NO: 24,Jaganatha Puram Bavani Amman Kovil Street Kunradhur Chennai - 600068"
              />
              <CardRowCol
                lable="Pinned google location"
                value="NO: 24,Jaganatha Puram Bavani Amman Kovil Street Kunradhur Chennai - 600068"
              />
            </Col>

            <Col>
              <CardRowCol lable="Order Id" value="#122400" />
              <CardRowCol lable="Order date/ time" value="12/12/2020" />
              <CardRowCol lable="Order Due date/ time" value="13/12/2020" />
              <CardRowCol lable="Delivered date/ time" value="14/12/2020" />
              <CardRowCol lable="Total items in order" value="10" />
              <CardRowCol lable="Total Quantity" value="25" />
              <CardRowCol lable="Packed Qty" value="10" />
              <CardRowCol lable="Total Value" value="10012" />
              <CardRowCol lable="order status" value="Delivered" />
            </Col>
          </Row>
        </div>
        <Card className="pd-tb-0 mr-t-10">
          <CardBody
            onClick={this.onCollapseProductDetail}
            className="bg-color-white pd-0"
          >
            <div className="replies_field_container pd-15 bg-color-white">
              <div style={{ width: "98%" }}>Product Detail</div>
              <div>
                {this.state.isCollapseProductDetail ? (
                  <FaChevronUp size={14} />
                ) : (
                  <FaChevronDown size={14} />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
        <Collapse
          isOpen={this.state.isCollapseProductDetail}
          style={{ padding: "0px" }}
        >
          <div className="mr-lr-10 border-block pd-8">
            <Row className="mr-lr-10 cart-item font-size-14">
              <Col>Product Name</Col>
              <Col className="txt-align-right">Quantity</Col>
              <Col className="txt-align-right">Price</Col>
              <Col className="txt-align-right">Amount</Col>
            </Row>
            <hr />
            {cartItems.map((item, i) => (
              <Row
                className="mr-lr-10 list-text cart-item font-size-14"
                key={i}
              >
                <Col>
                  <div>{item.product_name}</div>
                  <div className="color-red font-size-10">
                    {"product cancelled"}
                  </div>
                </Col>
                {/* <span className=''> (Price * Quantity) </span>  */}
                <Col className="txt-align-right">{item.quantity}</Col>
                <Col className="txt-align-right">{item.price}</Col>
                <Col className="txt-align-right">
                  <div className="font-size-14">
                    <i className="fas fa-rupee-sign font-size-12" />{" "}
                    {item.quantity * item.price}
                  </div>
                </Col>
              </Row>
            ))}
          </div>
        </Collapse>
        <Card className="pd-tb-0 mr-t-10">
          <CardBody
            onClick={this.onCollapseDriverDetail}
            className="bg-color-white pd-0"
          >
            <div className="replies_field_container pd-15 bg-color-white">
              <div style={{ width: "98%" }}>Rider Details</div>
              <div>
                {this.state.isCollapseDriverDetail ? (
                  <FaChevronUp size={14} />
                ) : (
                  <FaChevronDown size={14} />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
        <Collapse
          isOpen={this.state.isCollapseDriverDetail}
          style={{ padding: "0px" }}
        >
          <Row className="mr-lr-10 pd-8 border-block">
            <Col>
              <CardRowCol lable="Driver Name" value="M Basheer Ahamed" />
              <CardRowCol lable="Driver ID" value="#120" />
              <CardRowCol lable="Phone" value="9566239084" />
              <CardRowCol lable="Vehicle No" value="TN22 W 1411" />
            </Col>
            <Col>
              {propdata.order_pickup_img ? (
                <a
                  id="img1"
                  href={propdata.order_pickup_img}
                  download
                  hidden
                  target="_blank"
                ></a>
              ) : (
                ""
              )}
              {propdata.order_pickup_img2 ? (
                <a
                  id="img2"
                  href={propdata.order_pickup_img2}
                  download
                  hidden
                  target="_blank"
                ></a>
              ) : (
                ""
              )}
              <CardRowCol lable="Pickup Image" value="" />
              <div className="flex-row-vertical-center">
                <Card
                  style={{ width: "220px", height: "280px" }}
                  className="flex-row-vertical-center"
                >
                  <CardImg
                    style={{ width: "200px", height: "200px" }}
                    top
                    src={
                      "https://eattovo.s3.ap-south-1.amazonaws.com/upload/sales/makeit/1593750064752-lic"
                    }
                    alt="Pickup Image"
                    className="mr-t-20"
                  />
                  <Button
                    size="sm"
                    onClick={() => this.ImageDownload("img1")}
                    className="mr-t-10 mr-b-10"
                  >
                    View
                  </Button>
                </Card>
                <Card
                  style={{ width: "220px", height: "280px" }}
                  className="flex-row-vertical-center  mr-l-20"
                >
                  <CardImg
                    top
                    style={{ width: "200px", height: "200px" }}
                    src={
                      "https://eattovo.s3.ap-south-1.amazonaws.com/upload/sales/makeit/1593750064752-lic"
                    }
                    alt="Pickup Image"
                    className="mr-t-20"
                  />
                  <Button
                    size="sm"
                    onClick={() => this.ImageDownload("img1")}
                    className="mr-t-10 mr-b-10"
                  >
                    View
                  </Button>
                </Card>
              </div>
            </Col>
          </Row>
        </Collapse>
        <Card className="pd-tb-0 mr-t-10">
          <CardBody
            onClick={this.onCollapseLogDetail}
            className="bg-color-white pd-0"
          >
            <div className="replies_field_container pd-15 bg-color-white">
              <div style={{ width: "98%" }}>Log Details</div>
              <div>
                {this.state.isCollapseLogDetail ? (
                  <FaChevronUp size={14} />
                ) : (
                  <FaChevronDown size={14} />
                )}
              </div>
            </div>
          </CardBody>
        </Card>
        <Modal
          isOpen={this.state.isCancelModal}
          toggle={this.toggleCancel}
          backdrop={true}
          className="max-width-600"
        >
          <ModalBody className="pd-10">
            <div className="font-size-14 mr-l-10 mr-b-20">
              Select the products that have to be cancelled
            </div>
            <div className="fieldset mr-b-10">
              <div className="legend">Products in order</div>
              <div className="mr-lr-10">
                <Row className="mr-lr-10 cart-item font-size-14">
                  <Col className="flex-row" lg="1">
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name="selectall"
                        checked={this.state.selected_product["selectall"]}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </Col>
                  <Col>Product Name</Col>
                  <Col className="txt-align-right">Quantity</Col>
                  <Col className="txt-align-right" lg="2">
                    Price
                  </Col>
                  <Col className="txt-align-right" lg="2">
                    Amount
                  </Col>
                </Row>
                <hr className="mr-2" />
                {cartItems.map((item, i) => (
                  <Row
                    className="mr-lr-10 list-text cart-item font-size-14"
                    key={i}
                  >
                    <Col lg="1">
                      <label className="container-check">
                        <input
                          type="checkbox"
                          name={"" + item.pid}
                          checked={this.state.selected_product[item.pid]}
                          onChange={(e) => this.handleChange(e)}
                        />
                        <span className="checkmark"></span>{" "}
                      </label>
                    </Col>
                    <Col>{item.product_name}</Col>
                    <Col className="txt-align-right">{item.quantity}</Col>
                    <Col className="txt-align-right" lg="2">
                      {item.price}
                    </Col>
                    <Col className="txt-align-right" lg="2">
                      <div className="font-size-14">
                        <i className="fas fa-rupee-sign font-size-12" />{" "}
                        {item.quantity * item.price}
                      </div>
                    </Col>
                  </Row>
                ))}
              </div>
            </div>
            <Row className="mr-l-10">
              <Col>
                Cancellation reason <span className="must width-25">*</span>
              </Col>
              <Col>
                <ButtonDropdown
                  className="max-height-30"
                  isOpen={this.state.isCancelReasonModal}
                  toggle={this.toggleCancelReason}
                  size="sm"
                >
                  <DropdownToggle caret>
                    {this.state.cancelItem.name || ""}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.cancelList.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.clickCancelReason(item)}
                        key={index}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </Col>
            </Row>
            <Row className="mr-l-10 mr-t-10 mr-r-10">
              <Col className="pd-0">
                <form
                  onSubmit={this.props.handleSubmit(this.cancelConfirm)}
                  className="product_form"
                >
                  <Field
                    name="reason"
                    type="text"
                    component={InputField}
                    validate={[required, minLength5, maxLength160]}
                    cols="75"
                    rows="3"
                  />
                  <Row className="mr-b-10">
                    <Col className="pd-0 mr-r-10">
                      <Button size="sm" type="submit">Confirm</Button>
                    </Col>
                    <Col className="pd-0">
                      <Button size="sm" onClick={this.toggleCancel}>Close</Button>
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
OrderView = reduxForm({
  form: ORDER_VIEW_FORM, // a unique identifier for this form
})(OrderView);
export default connect(mapStateToProps, mapDispatchToProps)(OrderView);
