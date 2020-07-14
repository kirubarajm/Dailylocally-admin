import React from "react";
import { connect } from "react-redux";
import {
  TRACK_ORDER_VIEW,
  ORDER_CANCEL_REASON,
  POST_ORDER_CANCEL,
  ORDER_ACTION_CLEAR,
  ORDER_REORDER_REASON,
  POST_RE_ORDER,
  DELETE_PROOF_IMAGES,
  UPDATE_PROOF_IMAGES,
  ORDER_RETURN_REASON,
  POST_RETURN_ORDER,
  POST_MESSAGE_TO_CUSTOMER,
  ORDER_ZENDESK_ISSUES,
  POST_ZENDESK_TICKET,
  TRACK_ORDER_LOGS,
} from "../constants/actionTypes";
import DateRangePicker from "react-bootstrap-daterangepicker";
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
  ModalFooter,
} from "reactstrap";
import Moment from "moment";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ORDER_VIEW_FORM } from "../utils/constant";
import { reduxForm, Field } from "redux-form";
import { required, minLength5, maxLength160 } from "../utils/Validation";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import Select from "react-dropdown-select";
import CommentEditBox from "./CommentEditBox";

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
    <div>
      <label>
        {label} <span className="must">*</span>
      </label>
      <div>
        <Select
          multi
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
      <span className="font-size-12 must mr-t-10">
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
      payload: AxiosRequest.CRM.getOrderDetail(data),
    }),
  onGetOrdersLogs: (data) =>
    dispatch({
      type: TRACK_ORDER_LOGS,
      payload: AxiosRequest.CRM.getOrderLogs(data),
    }),
  onGetCancelReason: () =>
    dispatch({
      type: ORDER_CANCEL_REASON,
      payload: AxiosRequest.CRM.getCancelReason(),
    }),
  onPostOrderCancel: (data) =>
    dispatch({
      type: POST_ORDER_CANCEL,
      payload: AxiosRequest.CRM.postOrderCancel(data),
    }),
  onGetReorderReason: () =>
    dispatch({
      type: ORDER_REORDER_REASON,
      payload: AxiosRequest.CRM.getReorderReason(),
    }),
  onPostReOrder: (data) =>
    dispatch({
      type: POST_RE_ORDER,
      payload: AxiosRequest.CRM.postReOrder(data),
    }),
  onGetReturnReason: () =>
    dispatch({
      type: ORDER_RETURN_REASON,
      payload: AxiosRequest.CRM.getReturnReason(),
    }),
  onPostReturnOrder: (data) =>
    dispatch({
      type: POST_RETURN_ORDER,
      payload: AxiosRequest.CRM.postReturnOrder(data),
    }),
  onPostZendeskTicket: (data) =>
    dispatch({
      type: POST_ZENDESK_TICKET,
      payload: AxiosRequest.CRM.postZendeskCreation(data),
    }),
  onPostMessageToCustomer: (data) =>
    dispatch({
      type: POST_MESSAGE_TO_CUSTOMER,
      payload: AxiosRequest.CRM.postMessageToCustomer(data),
    }),
  onGetZendeskIssuse: (data) =>
    dispatch({
      type: ORDER_ZENDESK_ISSUES,
      payload: AxiosRequest.CRM.getRaiseTicketIssues(data),
    }),
  onDeleteImages: () =>
    dispatch({
      type: DELETE_PROOF_IMAGES,
    }),
  onUpdateProofImages: (data, imgtype) =>
    dispatch({
      type: UPDATE_PROOF_IMAGES,
      imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onClear: (data) =>
    dispatch({
      type: ORDER_ACTION_CLEAR,
    }),
});

function CardRowCol(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  var hidden = props.hidden || false;
  if (props.lable !== null) {
    return (
      <Row className="list-text cart-item font-size-14" hidden={hidden}>
        <Col lg="4" className="color-grey">
          {lable}
        </Col>
        <Col lg="1">:</Col>
        {/* className="text-decoration-underline txt-cursor" */}
        {props.isHyper ? (
          <Col style={{ color: color }} onClick={props.onClick}>
            {props.value || "-"}
          </Col>
        ) : (
          <Col style={{ color: color }}>{props.value || "-"}</Col>
        )}
      </Row>
    );
  }

  return <div />;
}

var defualtReturnReason = { rid: -1, reason: "Select reason" };
var defualtReordeReason = { rrid: -1, reason: "Select reason" };
var defualtCancelReason = { crid: -1, reason: "Enter Cancellation reason" };
class OrderView extends React.Component {
  constructor() {
    super();
    var nextday = Moment().add(1, "days");
    this.state = {
      today: Moment(new Date()),
      nextday: nextday,
      reorderdate: Moment().add(1, "days").format("DD-MM-YYYY"),
      isCollapseOrderDetail: true,
      isCollapseProductDetail: true,
      isCollapseLogDetail: false,
      isCollapseDriverDetail: false,
      isOpenActionDropDown: false,
      actionItem: { id: -1, name: "Action" },
      cancelItem: defualtCancelReason,
      reorderItem: defualtReordeReason,
      returnorderItem: defualtReturnReason,
      zendeskReasonItem: [],
      isCancelModal: false,
      isCancelReasonModal: false,
      selected_product: [],
      isReorderModal: false,
      isReturnorderModal: false,
      isReturnorderReasonModal: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.setState({ orderid: this.props.match.params.id });
    this.getOrderDetail();
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
    this.handleonRemove = this.handleonRemove.bind(this);
    this.handleProofimages = this.handleProofimages.bind(this);
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isCanceled) {
      this.props.onClear();
      this.toggleCancel();
      this.getOrderDetail();
    }

    if (this.props.isReordered) {
      this.props.onClear();
      this.toggleReorder();
      this.getOrderDetail();
    }

    if (this.props.isReturnordered) {
      this.props.onClear();
      this.toggleReturnorder();
      this.getOrderDetail();
    }
    if (this.props.isMessageSented) {
      this.props.onClear();
      this.toggleMessage();
    }

    if (this.props.isTicketCreated) {
      this.props.onClear();
      this.toggleZendeskModal();
      this.getOrderDetail();
    }
  }

  getOrderDetail() {
    this.props.onGetOrdersDetail({ id: this.props.match.params.id });
    this.props.onGetOrdersLogs({ doid: this.props.match.params.id });
  }
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
    if (item.id === 1) {
      this.setState({ cancelItem: defualtCancelReason });
      this.props.onGetCancelReason();
      this.toggleCancel();
    } else if (item.id === 2) {
      this.setState({ reorderItem: defualtReordeReason });
      this.props.onGetReorderReason();
      this.toggleReorder();
    } else if (item.id === 3) {
      this.setState({ returnorderItem: defualtReturnReason });
      this.props.onGetReturnReason();
      this.toggleReturnorder();
    } else if (item.id === 6) {
      this.props.initialize({ message: "" });
      this.toggleMessage();
    } else if (item.id === 7) {
      this.props.onGetZendeskIssuse({ type: 2 });
      this.toggleZendeskModal();
    }
  };

  toggleMessage = () => {
    this.setState({
      isCustMessageModal: !this.state.isCustMessageModal,
    });
  };
  toggleZendeskModal = () => {
    this.setState({
      isZendeskModal: !this.state.isZendeskModal,
    });
  };

  toggleReturnorder = () => {
    this.setState({
      isReturnorderModal: !this.state.isReturnorderModal,
    });
  };
  toggleReorder = () => {
    this.setState({
      isReorderModal: !this.state.isReorderModal,
    });
  };
  toggleReorderReason = () => {
    this.setState({
      isReorderReasonModal: !this.state.isReorderReasonModal,
    });
  };
  toggleReturnReason = () => {
    this.setState({
      isReturnorderReasonModal: !this.state.isReturnorderReasonModal,
    });
  };

  toggleZendeskReason = () => {
    this.setState({
      isZendeskReasonModal: !this.state.isZendeskReasonModal,
    });
  };

  clickReorderReason = (item) => {
    this.setState({
      reorderItem: item,
    });
  };

  clickReturnorderReason = (item) => {
    this.setState({
      returnorderItem: item,
    });
  };

  clickZendeskReason = (item) => {
    this.setState({
      zendeskReasonItem: item,
    });
  };
  tiketCreateConfirm = () => {
    if (this.state.zendeskReasonItem.length === 0) {
      notify.show(
        "Please select the issues",
        "custom",
        3000,
        notification_color
      );
    } else {
      const orderview = this.props.orderview;
      var data = {
        userid: orderview.userid,
        doid: orderview.id,
        issues: this.state.zendeskReasonItem,
        done_by: 1,
      };
      console.log("data-->", data);
      this.toggleZendeskModal();
      //this.props.onPostZendeskTicket(data);
    }
  };
  retrunorderConfirm = () => {
    if (this.state.returnorderItem.rid === -1) {
      notify.show(
        "Please select the return order reason",
        "custom",
        3000,
        notification_color
      );
    } else {
      const orderview = this.props.orderview;
      var data = {
        doid: orderview.id,
        return_reason: this.state.returnorderItem.rid,
        done_by: 1,
      };
      this.props.onPostReturnOrder(data);
    }
  };
  reorderConfirm = () => {
    var checkItem = this.state.selected_product;
    var Values = Object.keys(checkItem);
    var pindex = Values.indexOf("selectall");
    if (pindex !== -1) {
      Values.splice(pindex, 1);
    }
    if (Values.length === 0) {
      notify.show(
        "Please select the product",
        "custom",
        3000,
        notification_color
      );
    } else if (this.state.reorderItem.rrid === -1) {
      notify.show(
        "Please select the reorder reason",
        "custom",
        3000,
        notification_color
      );
    } else {
      const orderview = this.props.orderview;
      console.log("Values-->", Values);
      var data = {
        orderitems: Values,
        userid: orderview.userid,
        doid: orderview.id,
        zoneid: orderview.zoneid,
        reorder_reason: this.state.reorderItem.reason,
        done_by: 1,
        date: Moment("" + this.state.reorderdate, "DD-MM-YYYY").format(
          "YYYY-MM-DD"
        ),
      };
      if (this.props.ProofImage.length > 0) {
        data.Img1 = this.props.ProofImage[0].img_url;
      }
      console.log("data-->", data);
      this.props.onPostReOrder(data);
    }
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
    this.props.initialize({ reason: item.reason });
  };
  messageConfirm = (value) => {
    const orderview = this.props.orderview;
    var data = { message: value.message, phoneno: orderview.phoneno };
    this.props.onPostMessageToCustomer(data);
  };
  cancelConfirm = (value) => {
    console.log(value);
    var checkItem = this.state.selected_product;
    var Values = Object.keys(checkItem);
    var pindex = Values.indexOf("selectall");
    if (pindex !== -1) {
      Values.splice(pindex, 1);
    }
    if (Values.length === 0) {
      notify.show(
        "Please select the product",
        "custom",
        3000,
        notification_color
      );
    } else {
      const orderview = this.props.orderview;
      console.log("Values-->", Values);
      var data = {
        id: Values,
        doid: orderview.id,
        product_cancel_reason: value.reason,
        cancel_by: 1,
        cancel_type: 2,
      };
      this.props.onPostOrderCancel(data);
    }
  };

  onView = (Item) => {
    this.props.history.push("/orderview/" + Item);
    window.location.reload();
  };

  OnCommentUpdate= () => {
    this.props.onGetOrdersLogs({ doid: this.props.match.params.id });
  }

  ImageDownload = (img) => {
    if (document.getElementById(img)) document.getElementById(img).click();
  };

  dateSelect = (event, picker) => {
    var expdate = picker.startDate.format("DD-MM-YYYY");
    this.setState({ reorderdate: expdate });
  };
  handleonRemove = () => {
    this.props.onDeleteImages();
  };
  handleProofimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    var type = 1;
    data.append("type", type);
    this.props.onUpdateProofImages(data, type);
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_product || [];
    const cartItem = this.props.orderview.Products || [];
    if (name === "selectall") {
      if (value) {
        arvalue[name] = value;
        cartItem.map((item, i) => {
          arvalue[item.id] = value;
        });
      } else {
        arvalue = {};
      }
    } else {
      if (value) {
        arvalue[name] = value;
        var allCheck = true;
        cartItem.map((item, i) => {
          if (!arvalue[item.id]) {
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

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return "";
  }

  render() {
    const propdata = this.props.orderview;
    const cartItems = propdata.Products || [];
    return (
      <div className="pd-15">
        <Row>
          <Col></Col>
          <Col>
            <div className="float-right mr-r-20 flex-row">
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
                      disabled={propdata.dayorderstatus === 11 && item.id === 1}
                    >
                      {item.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </ButtonDropdown>
              <Button
                size="sm"
                onClick={this.props.history.goBack}
                className="mr-l-10"
              >
                Back
              </Button>
            </div>
          </Col>
        </Row>
        <div className="fieldset mr-b-10">
          <div className="legend">
            Order Detail - Order Id # {this.state.orderid}
          </div>
          <Row className="mr-lr-10 pd-8">
            <Col>
              <CardRowCol lable="Customer Name" value={propdata.name} />
              <CardRowCol lable="Customer Id" value={propdata.userid} />
              <CardRowCol lable="Phone NO" value={propdata.phoneno} />
              <CardRowCol lable="Email" value={propdata.email} />
              <CardRowCol
                lable="Manual Entered address"
                value={propdata.complete_address}
              />
              <CardRowCol
                lable="Pinned google location"
                value={propdata.google_address}
              />
            </Col>

            <Col>
              <CardRowCol lable="Order Id" value={"#" + propdata.id} />
              <CardRowCol
                lable="Reorder placed"
                value={"#" + propdata.reorder_placed_id}
                hidden={propdata.reorder_placed_id ? false : true}
                color="red"
                isHyper={true}
                onClick={() => this.onView(propdata.reorder_placed_id)}
              />
              <CardRowCol
                lable="This is a reorder for "
                value={"#" + propdata.reorder_id}
                hidden={propdata.reorder_id ? false : true}
                color="red"
                isHyper={true}
                onClick={() => this.onView(propdata.reorder_id)}
              />
              <CardRowCol
                lable="Reorder Reason"
                value={propdata.reorder_reason}
                hidden={propdata.reorder_id ? false : true}
                color="red"
              />
              <CardRowCol
                lable="Order date/ time"
                value={this.dateConvert(propdata.created_at)}
              />
              <CardRowCol
                lable="Order Due date/ time"
                value={this.dateConvert(propdata.date)}
              />
              <CardRowCol
                lable="Delivered date/ time"
                value={this.dateConvert(propdata.deliver_date)}
              />
              <CardRowCol
                lable="Total items in order"
                value={propdata.u_product_count}
              />
              <CardRowCol
                lable="Total Quantity"
                value={propdata.order_quantity}
              />
              {/* <CardRowCol lable="Packed Qty" value="10" />
              <CardRowCol lable="Total Value" value="10012" /> */}
              <CardRowCol
                lable="order status"
                value={propdata.dayorderstatus_msg}
              />
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
                  <div>{item.productname}</div>
                  <div
                    className="color-red font-size-10"
                    hidden={item.scm_status !== 11}
                  >
                    {/* {"product cancelled"} */}
                    {item.scm_status_msg}
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
        <Collapse
          isOpen={this.state.isCollapseLogDetail}
          style={{ padding: "0px" }}
        >
          <Row className="mr-lr-10 pd-8 border-block">
            <Col>
              {this.props.OrderLogs.map((item, i) => (
                <div className="width-full">
                  <Row
                    className="font-size-12 font-weight-bold pd-8"
                    style={{ background: "#dddddd" }}
                  >
                    <Col lg="11">
                      {item.Dashboard_type} - via {item.done_type}
                    </Col>
                    <Col lg="1" className="txt-align-right">
                      {item.isCollapse ? (
                        <FaChevronUp size={14} hidden={true} />
                      ) : (
                        <FaChevronDown size={14} hidden={true} />
                      )}
                    </Col>
                  </Row>
                  <Row className="mr-lr-5 pd-8 font-size-12">
                    <Col className="flex-row pd-8">
                      <div className="mr-r-10">
                        Date/ Time stamp - {this.dateConvert(item.created_at)}
                      </div>
                      <div className="mr-r-10">
                        Created By -{item.name}-{item.usertype}
                      </div>
                      <div className="mr-r-10">{item.comments}</div>
                    </Col>
                  </Row>
                </div>
              ))}
            </Col>
          </Row>
        </Collapse>


        <Row className="mr-lr-10 mr-b-20 mr-t-20">
          <Col className="border-block pd-5">
            <CommentEditBox dayorderdata={propdata} update={this.OnCommentUpdate}/>{" "}
          </Col>
        </Row>

        
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
                          name={"" + item.id}
                          checked={this.state.selected_product[item.id]}
                          onChange={(e) => this.handleChange(e)}
                        />
                        <span className="checkmark"></span>{" "}
                      </label>
                    </Col>
                    <Col>{item.productname}</Col>
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
              <Col className="font-size-14">
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
                    {this.state.cancelItem.reason || ""}
                  </DropdownToggle>
                  <DropdownMenu>
                    {this.props.cancelList.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.clickCancelReason(item)}
                        key={index}
                      >
                        {item.reason}
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
                      <Button size="sm" type="submit">
                        Confirm
                      </Button>
                    </Col>
                    <Col className="pd-0">
                      <Button size="sm" onClick={this.toggleCancel}>
                        Close
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.isReorderModal}
          toggle={this.toggleReorder}
          backdrop={true}
          className="max-width-800"
        >
          <ModalBody className="pd-10">
            <Row className="mr-l-10 mr-b-10">
              <Col className="flex-row">
                <div className="width-250 font-size-14">
                  Reorder Reason
                  <span className="must width-25">*</span>
                </div>
                <div className="mr-l-10">
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isReorderReasonModal}
                    toggle={this.toggleReorderReason}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.state.reorderItem.reason || ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.reorderList.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickReorderReason(item)}
                          key={index}
                        >
                          {item.reason}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </Col>
            </Row>
            <Row className="mr-l-10 mr-b-10">
              <Col className="flex-row">
                <div className="mr-r-10 width-250 font-size-14">
                  Attach proof of reason
                </div>
                <div>
                  <form className="width-250">
                    <Field
                      name={"CAT"}
                      type="file"
                      component={DropzoneFieldMultiple}
                      imgPrefillDetail={
                        this.props.ProofImage.length
                          ? this.props.ProofImage[0]
                          : ""
                      }
                      handleonRemove={this.handleonRemove}
                      handleOnDrop={() => this.handleProofimages}
                    />
                  </form>
                </div>
              </Col>
            </Row>
            <Row className="mr-l-10">
              <Col className="flex-row">
                <div className="mr-r-10 width-250 font-size-14">
                  Select reorder date <span className="must width-25">*</span>
                </div>
                <div className="border-grey pd-4">
                  <DateRangePicker
                    opens="right"
                    singleDatePicker
                    minDate={this.state.nextday}
                    drops="down"
                    onApply={this.dateSelect}
                  >
                    <Button
                      className="mr-r-10"
                      style={{
                        width: "30px",
                        height: "30px",
                        padding: "0px",
                      }}
                    >
                      <i className="far fa-calendar-alt"></i>
                    </Button>
                    {this.state.reorderdate}
                  </DateRangePicker>
                </div>
              </Col>
            </Row>
            <div className="font-size-14 mr-l-20 mr-b-20">
              Select the products to redeliver
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
                          name={"" + item.id}
                          checked={this.state.selected_product[item.id]}
                          onChange={(e) => this.handleChange(e)}
                        />
                        <span className="checkmark"></span>{" "}
                      </label>
                    </Col>
                    <Col>{item.productname}</Col>
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
            <Row className="mr-b-10 mr-r-10">
              <Col lg="8"></Col>
              <Col className="pd-0 mr-r-10 txt-align-right">
                <Button size="sm" type="submit" onClick={this.reorderConfirm}>
                  Confirm
                </Button>
                <Button
                  size="sm"
                  className="mr-l-10"
                  onClick={this.toggleReorder}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.isReturnorderModal}
          toggle={this.toggleReturnorder}
          backdrop={true}
          className="max-width-800"
        >
          <ModalBody className="pd-10">
            <Row className="mr-l-10 mr-b-10">
              <Col className="flex-row">
                <div className="width-250 font-size-14">
                  Return order Reason
                  <span className="must width-25">*</span>
                </div>
                <div className="mr-l-10">
                  <ButtonDropdown
                    className="max-height-30"
                    isOpen={this.state.isReturnorderReasonModal}
                    toggle={this.toggleReturnReason}
                    size="sm"
                  >
                    <DropdownToggle caret>
                      {this.state.returnorderItem.reason || ""}
                    </DropdownToggle>
                    <DropdownMenu>
                      {this.props.returnReasonList.map((item, index) => (
                        <DropdownItem
                          onClick={() => this.clickReturnorderReason(item)}
                          key={index}
                        >
                          {item.reason}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                </div>
              </Col>
            </Row>
            <Row className="mr-b-10 mr-r-10">
              <Col lg="8"></Col>
              <Col className="pd-0 mr-r-10 txt-align-right">
                <Button
                  size="sm"
                  type="submit"
                  onClick={this.retrunorderConfirm}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  className="mr-l-10"
                  onClick={this.toggleReturnorder}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.isCustMessageModal}
          toggle={this.toggleMessage}
          backdrop={true}
          className="max-width-600"
        >
          <ModalBody className="pd-10">
            <Row className="mr-l-10 mr-t-10 mr-r-10">
              <Col>Message</Col>
            </Row>
            <Row className="mr-l-10 mr-t-10 mr-r-10">
              <Col className="pd-0">
                <form
                  onSubmit={this.props.handleSubmit(this.messageConfirm)}
                  className="product_form"
                >
                  <Field
                    name="message"
                    type="text"
                    component={InputField}
                    validate={[required, minLength5, maxLength160]}
                    cols="75"
                    rows="3"
                  />
                  <Row className="mr-b-10">
                    <Col lg="6"></Col>
                    <Col className="pd-0 flex-row" lg="6">
                      <Button size="sm" type="submit" className="mr-r-10">
                        Confirm
                      </Button>
                      <Button size="sm" onClick={this.toggleMessage}>
                        Close
                      </Button>
                    </Col>
                  </Row>
                </form>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.isZendeskModal}
          toggle={this.toggleZendeskModal}
          backdrop={true}
        >
          <ModalHeader>Raise Ticket</ModalHeader>
          <ModalBody>
            <InputSearchDropDown
              labelField="issues"
              searchable={true}
              clearable={true}
              searchBy="issues"
              valueField="id"
              values={[]}
              noDataLabel="No matches found"
              options={this.props.zendeskissuesList}
              onSelection={this.clickZendeskReason}
              label="Select Issues"
            />
          </ModalBody>
          <ModalFooter>
            <Row className="mr-b-10 mr-r-10">
              <Col lg="8"></Col>
              <Col className="pd-0 mr-r-10 txt-align-right">
                <Button
                  size="sm"
                  type="submit"
                  onClick={this.tiketCreateConfirm}
                >
                  Confirm
                </Button>
                <Button
                  size="sm"
                  className="mr-l-10"
                  onClick={this.toggleZendeskModal}
                >
                  Close
                </Button>
              </Col>
            </Row>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
OrderView = reduxForm({
  form: ORDER_VIEW_FORM, // a unique identifier for this form
})(OrderView);
export default connect(mapStateToProps, mapDispatchToProps)(OrderView);
