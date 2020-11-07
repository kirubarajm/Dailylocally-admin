import React from "react";
import AxiosRequest from "../AxiosRequest";
import SearchInput from "../components/SearchInput";
import { Field, reduxForm } from "redux-form";
import Select from "react-dropdown-select";
import {
  PUSH_NOTIFICATION_SEND,
  PUSH_NOTIFICATION_CLEAR,
  UPDATE_PUSH_IMAGES,
  DELETE_PUSH_IMAGES,
} from "../constants/actionTypes";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import { connect } from "react-redux";
import { required, minLength5, is_url } from "../utils/Validation";
import { PUSH_NOTIFICATION_FROM } from "../utils/constant";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  Row,
  Col,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ButtonGroup,
  ModalHeader,
  ModalBody,
} from "reactstrap";

const senderFilterlist = [
  { apptype: 0, name: "All installed users" },
  { apptype: 1, name: "Andriod" },
  { apptype: 2, name: "ios" },
  { apptype: 3, name: "Users with 0 orders" },
];
const senderlist = {
  0: "All installed users",
  1: "Andriod",
  2: "ios",
  1: "Andriod",
  3: "Users with 0 orders",
};

const InputFieldTextArea = ({
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
        <textarea
          {...input}
          placeholder={label}
          type={type}
          autoComplete="off"
          cols={custom.cols}
          rows={custom.rows}
        />
        <span style={{ flex: "0", WebkitFlex: "0", height: "20px" }}>
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </span>
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
    <div className="border-none">
      <div>
        {" "}
        <input
          {...input}
          placeholder={label}
          type={type}
          autoComplete="off"
          onWheel={(event) => {
            event.preventDefault();
          }}
          style={{ width: "auto" }}
        />
        {touched &&
          ((error && <span>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({ ...state.pushnotificationlist });

const mapDispatchToProps = (dispatch) => ({
  onSendNotification: (data) =>
    dispatch({
      type: PUSH_NOTIFICATION_SEND,
      payload: AxiosRequest.Pushnotification.sendPushNotification(data),
    }),

  onClear: () =>
    dispatch({
      type: PUSH_NOTIFICATION_CLEAR,
    }),

  onUpdatePUSHImages: (data, imgtype) =>
    dispatch({
      type: UPDATE_PUSH_IMAGES,
      imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onDeleteImages: () =>
    dispatch({
      type: DELETE_PUSH_IMAGES,
    }),
});

const defultPage = 1;
class Pushnotification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // selectedPage: 1,
      dropdownOpen: false,
      selectedItem: { id: "0", name: "Select type" },
      dropdownname: senderlist[this.props.senderFilterlist],
    };
    //  this.handleSelected = this.handleSelected.bind(this);
    this.toggleDropDown = this.toggleDropDown.bind(this);
  }

  toggleDropDown() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  componentWillMount() {
    this.onSendPushNotification = this.onSendPushNotification.bind(this);

    this.setState({ apptype: 1 });
  }

  componentDidUpdate(nextProps, nextState) {
    if (this.props.sendpush) {
      this.props.onClear();
    }
  }

  onSendPushNotification(value) {
    var data = {};
    data.apptype = this.state.selectedItem.apptype;
    data.title = value.notification_titel;
    data.user_message = value.notification_message;

    if (this.props.Signature.length>0) data.image = this.props.Signature[0].img_url;
    console.log("data-->", data);
    this.props.onSendNotification(data);
  }

  filter = (item) => {
    this.setState({ selectedItem: item });
  };

  formClear = () => {
    this.setState({ selectedItem: { id: "0", name: "Select type" }, });
    this.props.onDeleteImages();
    var data={notification_titel:"",notification_message:""}
    this.props.initialize(data);
  };

  handleonRemove = () => {
    this.props.onDeleteImages();
  };

  handleCATimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    var type = 1;
    data.append("type", type);
    this.props.onUpdatePUSHImages(data, type);
  };

  render() {
    const submitting = this.props.submitting;
    const pristine = this.props.pristine;
    const handleSubmit = this.props.handleSubmit;

    return (
      <div className="pd-8">
        <Card>
          <CardHeader>
            Send Push Notification
            <Row className="float-right">
              {/* <Col><div className='font-size-12'>last 7 days user</div></Col> */}
              {/* <Col>
               

                <ButtonGroup size="sm" >
                  <Button color="primary"  onClick={()=>this.filter(1)} active={this.state.apptype === 1}>
                    Andriod
                  </Button>

                  <Button color="primary"  onClick={()=>this.filter(2)} active={this.state.apptype === 2}>
                    Ios
                  </Button>
                </ButtonGroup>
              </Col> */}
            </Row>
          </CardHeader>

          <CardBody className="scrollbar pd-0">
            <form
              onSubmit={handleSubmit(this.onSendPushNotification)}
              className="product_form"
            >
              <div className="width-75">
                <label>
                  Select user filter <span className="must">*</span>{" "}
                </label>

                <ButtonDropdown
                  isOpen={this.state.dropdownOpen}
                  toggle={this.toggleDropDown}
                >
                  <DropdownToggle caret>
                    {this.state.selectedItem.name}
                  </DropdownToggle>
                  <DropdownMenu>
                    {senderFilterlist.map((item, index) => (
                      <DropdownItem
                        onClick={() => this.filter(item)}
                        key={index}
                      >
                        {item.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </ButtonDropdown>
              </div>

              <div>
                <label>
                  TITLE <span className="must">*</span>{" "}
                </label>
                <div className="border-none">
                <Field
                  name="notification_titel"
                  type="text"
                  component={InputField}
                  validate={[required, minLength5]}
                  cols="40"
                  rows="2"
                />
                </div>
              </div>

              <div>
                <label>
                  Message <span className="must">*</span>{" "}
                </label>
                <div className="border-none">
                <Field
                  name="notification_message"
                  type="text"
                  component={InputFieldTextArea}
                  validate={[required, minLength5]}
                  cols="40"
                  rows="2"
                />
                </div>
              </div>

              <div style={{width:"425px"}}>
                <label>Image Upload</label>
                <div className="border-none">
                  <Field
                    name={"CAT"}
                    component={DropzoneFieldMultiple}
                    type="file"
                    imgPrefillDetail={
                      this.props.Signature.length ? this.props.Signature[0] : ""
                    }
                    label="Photogropy"
                    handleonRemove={() => this.handleonRemove()}
                    handleOnDrop={() => this.handleCATimages}
                  />
                </div>
              </div>

              <div className="float-right" >
              <Button  onClick={()=>this.formClear(1)}  disabled={pristine || submitting} className="mr-r-20">
                  Clear
                </Button>

                <Button type="submit" disabled={pristine || submitting} className="mr-r-20">
                  Submit
                </Button>
                
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }
}

Pushnotification = reduxForm({
  form: PUSH_NOTIFICATION_FROM, // a unique identifier for this form
})(Pushnotification);

export default connect(mapStateToProps, mapDispatchToProps)(Pushnotification);
