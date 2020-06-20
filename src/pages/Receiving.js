import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import Select from "react-dropdown-select";
import { RECEIVING_LIST, RECEIVING_UPDATE, RECEIVING_CLEAR } from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { Field, reduxForm,reset } from "redux-form";
import { required, minLength2 } from "../utils/Validation";
import { CAT_SUB_ADD_EDIT, RECEIVING_FORM } from "../utils/constant";

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
    <Row className="pd-0">
      <div
        className="border-none"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div
          className="mr-0 border-none pd-0"
          style={{
            height: "auto",
            width: "175px",
          }}
        >
          <label className="mr-0 color-grey">
            {label} <span className="must">*</span>
          </label>
        </div>
        <div
          className="mr-0"
          style={{
            border: "1px solid #000",
            height: "auto",
            width: "210px",
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
        </div>
      </div>
    </Row>
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
  ...state.receiving,
  zoneItem: state.warehouse.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onGetReceivingList: (data) =>
    dispatch({
      type: RECEIVING_LIST,
      payload: AxiosRequest.Warehouse.getReceivingList(data),
    }),
  onUpdateList: (data) =>
    dispatch({
      type: RECEIVING_UPDATE,
      payload: AxiosRequest.Warehouse.updateReceiving(data),
    }),
    onClear: () =>
    dispatch({
      type: RECEIVING_CLEAR
    }),
    onFromClear: () => dispatch(reset(RECEIVING_FORM)),
});

class Receiving extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      poid_refresh: false,
      recevingModal: false,
      receivingSelection: [],
      selectedItem: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.onReceivingList = this.onReceivingList.bind(this);
    this.onReceivingModal = this.onReceivingModal.bind(this);
    this.selectedReceiving = this.selectedReceiving.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.submit = this.submit.bind(this);
    this.onReceivingList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onReceivingList();
    if(this.props.receving_update){
      this.props.onClear();
      this.onReceivingModal();
    }
  }
  componentDidCatch() {}

  onReceivingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetReceivingList({
        zone_id: this.props.zoneItem.id,
      });
    }
  };
  onActionClick = (item) => (ev) => {
    this.props.onFromClear();
    this.setState({ selectedItem: item });
    this.onReceivingModal();
  };
  selectedReceiving = (item) => {
    this.setState({ receivingSelection: item });
  };

  onReceivingModal = () => {
    this.setState((prevState) => ({
      recevingModal: !prevState.recevingModal,
    }));
  };
  submit = (data) => {
    var data1={
      zone_id:this.props.zoneItem.id,
      popid:this.state.selectedItem.popid,
      vpid:this.state.selectedItem.vpid,
      quantity:data.item_quantity,
      delivery_note:data.delivery_note,
    }
    if(this.state.receivingSelection.length>0){
      data1.action_id=this.state.receivingSelection[0].id
    }
    this.props.onUpdateList(data1);
  };
  render() {
    const recevingList = this.props.recevingList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Order search Criteria</div>
            <Row className="pd-0 mr-l-10 mr-r-10">
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </div>
          <div className="pd-6">
            <div className="search-horizantal-scroll">
              <div className="search-vscroll">
                <Table style={{ width: "1500px" }}>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Description</th>
                      <th>UOM</th>
                      <th>BOH</th>
                      <th>PO quantity</th>
                      <th>received quantity</th>
                      <th>Receive/Unreceive</th>
                      <th>PO No - Supplier name</th>
                      <th>PO Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recevingList.map((item, i) => (
                      <tr key={i}>
                        <td>{Moment(item.created_at).format("DD-MMM-YYYY")}</td>
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
        </div>
        <Modal
          isOpen={this.state.recevingModal}
          toggle={this.onReceivingModal}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.onReceivingModal}>
          </ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend">Receiving/Unreceiving</div>
              <div className="mr-r-20 mr-l-20">
                <form onSubmit={this.props.handleSubmit(this.submit)}>
                  <Row className="pd-0">
                    <Col lg="5" className="color-grey pd-0">
                      <div className="border-none">Item name</div>
                    </Col>
                    <Col lg="7">{this.state.selectedItem.Productname}</Col>
                  </Row>
                  <Field
                    name="ac_id"
                    component={InputSearchDropDown}
                    options={this.props.receivingAction}
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.receivingSelection}
                    onSelection={this.selectedReceiving}
                    label="Select Action"
                  />
                  <Row className="pd-0">
                    <Col lg="5" className="color-grey pd-0">
                      <div className="border-none">
                         Quantity 
                        <span className="must">*</span>
                      </div>
                    </Col>
                    <Col lg="7">
                      <Field
                        name="item_quantity"
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
                      <div className="border-none">Delivery Note</div>
                    </Col>
                    <Col lg="7">
                      <Field
                        name="delivery_note"
                        autoComplete="off"
                        type="text"
                        component={InputField}
                        validate={[required, minLength2]}
                        required={true}
                      />
                    </Col>
                  </Row>
                  <Row className="pd-10">
                    <Col className="txt-align-right">
                      <Button color="secondary">Submit</Button>
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
Receiving = reduxForm({
  form: RECEIVING_FORM, // a unique identifier for this form
})(Receiving);
export default connect(mapStateToProps, mapDispatchToProps)(Receiving);
