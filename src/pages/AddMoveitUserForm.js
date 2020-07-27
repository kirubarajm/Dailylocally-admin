import React from "react";
import { Field, reduxForm } from "redux-form";
import renderInputField from "../components/renderInputField";
import InputForMobile from "../components/InputForMobile";
import DropzoneFieldMultiple from "../components/dropzoneFieldMultiple";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import {
  required,
  maxLength60,
  minLength2,
  phoneNumber,
  alphaNumeric,
  aol,
  email,
  passwordValidate,
  minLength5,
  imageIsRequired,
} from "../utils/Validation";
import { MOVEIT_REGISTRATION_FORM } from "../utils/constant";

import {
  MOVEIT_ADD_USER,
  MOVEIT_UPDATE_FIELD,
  MOVEIT_FORM_CLEAR,
  MOVEIT_CLEAR_IMAGE_FIELD,
  TOAST_SHOW,
  MOVEIT_USERS_EDIT,
  MOVEIT_USER_DETAIL,
  MOVEIT_UPDATE_IMAGE_FIELD,
} from "../constants/actionTypes";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { reset } from "redux-form";
import MobileVerifyForm from "../components/MobileVerifyForm";
import renderTextInputField from "../components/renderTextInputField";

const mapStateToProps = (state) => ({
  ...state.moveituser,
  zone_list: state.common.zone_list,
});

const mapDispatchToProps = (dispatch) => ({
  onSubmit: (formData) =>
    dispatch({
      type: MOVEIT_ADD_USER,
      local: formData,
      payload: AxiosRequest.Moveit.userAdd(formData),
    }),
  onEditSubmit: (formData) =>
    dispatch({
      type: MOVEIT_USERS_EDIT,
      local: formData,
      payload: AxiosRequest.Moveit.userUpdate(formData),
    }),
  onChangeInput: (key, data) =>
    dispatch({
      type: MOVEIT_UPDATE_FIELD,
      key,
      payload: AxiosRequest.Moveit.fileUpload(data),
    }),
  onProofImageLoad: (key, data) =>
    dispatch({ type: MOVEIT_UPDATE_IMAGE_FIELD, key, data }),
  onGetUser: (id) =>
    dispatch({
      type: MOVEIT_USER_DETAIL,
      payload: AxiosRequest.Moveit.getView(id),
    }),
  onFromClear: () => dispatch(reset(MOVEIT_REGISTRATION_FORM)),
  onClearImage: () => dispatch({ type: MOVEIT_CLEAR_IMAGE_FIELD }),
  onClearSuccess: () => dispatch({ type: MOVEIT_FORM_CLEAR }),
  ShowToast: (message) => dispatch({ type: TOAST_SHOW, message: message }),
});
class AddMoveitUserForm extends React.Component {
  state = {
    driverLicenceFile: [],
    vehicleInsuranceFile: [],
    rcBookFile: [],
    photoFile: [],
    legalDocumentFile: [],
    mobileVerifyModel: false,
    mobilenumber: 0,
    mobileVerifyStatus: false,
    isOpenAreaDropDown:false,
    checkBoxVal: 1,
    dob: false,
    Edit: false,
    zoneItem:false,
    today: Moment(new Date()),
  };
  componentWillMount() {
    var userid = this.props.match.params.userid;
    var edit = false;
    if (userid) {
      edit = true;
      this.setState({ userid: userid, Edit: true });
      this.props.onGetUser({ userid: userid });
    }
    this.onPhoneNoVerify = this.onPhoneNoVerify.bind(this);
    this.toggleMobileVerifyModal = this.toggleMobileVerifyModal.bind(this);
    this.otpStatus = this.otpStatus.bind(this);
  }
  componentDidUpdate(nextProps, nextState) {
    if (this.props.zone_list.length > 0 && !this.state.zoneItem) {
      this.clickArea(this.props.zone_list[0]);
    }
    if (this.props.userAddSuccess) {
      this.props.onFromClear();
      this.props.onClearSuccess();
      this.setState({
        driverLicenceFile: [],
        vehicleInsuranceFile: [],
        rcBookFile: [],
        photoFile: [],
        legalDocumentFile: [],
        mobileVerifyStatus: false,
        checkBoxVal: 1,
        dob: false,
        licenseExp: false,
      });
      this.props.onClearImage();
    }

    if (this.props.userEditSuccess) {
      this.props.onFromClear();
      this.props.onClearSuccess();
      this.setState({
        driverLicenceFile: [],
        vehicleInsuranceFile: [],
        rcBookFile: [],
        photoFile: [],
        legalDocumentFile: [],
        mobileVerifyStatus: false,
        checkBoxVal: 1,
        dob: false,
        licenseExp: false,
      });
      this.props.onClearImage();
      this.props.history.goBack();
    }

    if (
      this.state.Edit &&
      this.props.viewmoveittuser &&
      this.props.userPrefillSuccess
    ) {
      var userData = this.props.viewmoveittuser;
      var initData = {
        userid: userData.userid,
        email: userData.email,
        phoneno: userData.phoneno,
        name: userData.name,
        fathersname: userData.fathersname,
        Vehicle_no: userData.Vehicle_no,
        moveit_hub: userData.moveit_hub || 1,
        address: userData.address,

        bank_account_no: userData.bank_account_no,
        bank_name: userData.bank_name,
        bank_holder_name: userData.bank_holder_name,
        ifsc: userData.ifsc,
        pincode: userData.pincode,
        pannumber: userData.pannumber,
        languages: userData.languages,
        qualification: userData.qualification,
        area: userData.area,
        password: userData.password,

        driver_lic: userData.driver_lic,
        vech_insurance: userData.panphotograph,
        vech_rcbook: userData.aadharphotograph,
        photo: userData.bankdocument,
        legal_document: userData.contractdocument,
        zone: userData.zone,
      };

      if (userData.dob) {
        this.setState({ dob: userData.dob });
      }

      if(userData.zone){
        var zone={
          Zonename:userData.Zonename,
          id:userData.zone
        }
        this.setState({zoneItem:zone});
      }

      if (userData.licenseexpiry) {
        this.setState({ licenseExp: userData.licenseexpiry });
      }

      if (userData.gender) {
        this.setState({ checkBoxVal: userData.gender });
      }

      if (userData.licensephotograph) {
        this.setState({
          driverLicenceFile: [
            {
              name: userData.name,
              preview: userData.licensephotograph,
              size: 0,
              type: "image/jpeg",
            },
          ],
        });
        this.props.onProofImageLoad(
          "licensephotograph",
          userData.licensephotograph
        );
      }
      if (userData.panphotograph) {
        this.setState({
          vehicleInsuranceFile: [
            {
              name: userData.name,
              preview: userData.panphotograph,
              size: 0,
              type: "image/jpeg",
            },
          ],
        });
        this.props.onProofImageLoad("vech_insurance", userData.panphotograph);
      }
      if (userData.aadharphotograph) {
        this.setState({
          rcBookFile: [
            {
              name: userData.name,
              preview: userData.aadharphotograph,
              size: 0,
              type: "image/jpeg",
            },
          ],
        });
        this.props.onProofImageLoad("vech_rcbook", userData.aadharphotograph);
      }
      if (userData.bankdocument) {
        this.setState({
          photoFile: [
            {
              name: userData.name,
              preview: userData.bankdocument,
              size: 0,
              type: "image/jpeg",
            },
          ],
        });
        this.props.onProofImageLoad("photo", userData.bankdocument);
      }
      if (userData.contractdocument) {
        this.setState({
          legalDocumentFile: [
            {
              name: userData.name,
              preview: userData.contractdocument,
              size: 0,
              type: "image/jpeg",
            },
          ],
        });
        this.props.onProofImageLoad(
          "legal_document",
          userData.contractdocument
        );
      }

      if (userData.addressproofdocument) {
        this.setState({
          addressDocumentFile: [
            {
              name: userData.name,
              preview: userData.addressproofdocument,
              size: 0,
              type: "image/jpeg",
            },
          ],
        });
        this.props.onProofImageLoad(
          "address_document",
          userData.addressproofdocument
        );
      }

      //this.props.onProductImageLoad('driver_lic', productData.image);
      this.props.initialize(initData);
      this.props.onClearSuccess();
    }
  }

  toggleMobileVerifyModal() {
    this.setState((prevState) => ({
      mobileVerifyModel: !prevState.mobileVerifyModel,
    }));
  }

  onPhoneNoVerify = (values) => {
    this.setState({ mobilenumber: values });
    this.toggleMobileVerifyModal();
  };

  otpStatus = (status) => {
    this.toggleMobileVerifyModal();
    if (status) this.setState({ mobileVerifyStatus: status });
  };

  toggleAreaDropDown = () => {
    this.setState((prevState) => ({
      isOpenAreaDropDown: !prevState.isOpenAreaDropDown,
    }));
  };

  submit = (data) => {
    var initData = data;
    if (this.state.dob) initData.dob = this.state.dob;
    if (this.state.licenseExp) initData.licenseexpiry = this.state.licenseExp;
    if (this.state.checkBoxVal) initData.gender = this.state.checkBoxVal;
    if (this.props.licensephotograph)
      initData.licensephotograph = this.props.licensephotograph;
    if (this.props.vech_insurance)
      initData.panphotograph = this.props.vech_insurance;
    if (this.props.vech_rcbook)
      initData.aadharphotograph = this.props.vech_rcbook;
    if (this.props.photo) initData.bankdocument = this.props.photo;
    if (this.props.address_document) initData.addressproofdocument = this.props.address_document;
    if (this.props.legal_document)
      initData.contractdocument = this.props.legal_document;

      if(this.state.zoneItem){
        initData.zone=this.state.zoneItem.id;
      }else{
        this.props.ShowToast("Please select zone");
      }

    console.log("inti--", initData);
    if (this.state.Edit) {
      initData.userid = this.state.userid;
      this.props.onEditSubmit(initData);
    } else {
      if (this.state.mobileVerifyStatus) {
        initData.verified_status = 1;
        initData.online_status = 0;
        initData.login_status = 1;
        this.props.onSubmit(initData);
      } else
        this.props.ShowToast("Please verify the mobile number and try again");
    }
  };
  //state = { driverLicenceFile: [] ,vehicleInsuranceFile:[],rcBookFile:[]};
  handleDriverLicence = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    this.props.onChangeInput("licensephotograph", data);
    this.setState({ driverLicenceFile: newImageFile });
  };
  handleVehicleInsurance = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    this.props.onChangeInput("vech_insurance", data);
    this.setState({ vehicleInsuranceFile: newImageFile });
  };
  handleVechicleRcbook = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    this.props.onChangeInput("vech_rcbook", data);
    this.setState({ rcBookFile: newImageFile });
  };

  handlePhoto = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    this.props.onChangeInput("photo", data);
    this.setState({ photoFile: newImageFile });
  };
  handleLegalDocument = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    data.append("type", 1);
    this.props.onChangeInput("legal_document", data);
    this.setState({ legalDocumentFile: newImageFile });
  };

  handleAddressDocument = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    data.append("type", 1);
    this.props.onChangeInput("address_document", data);
    this.setState({ addressDocumentFile: newImageFile });
  };

  resetForm = () => {
    this.setState({
      driverLicenceFile: [],
      vehicleInsuranceFile: [],
      rcBookFile: [],
      photoFile: [],
      legalDocumentFile: [],
      dob: false,
      licenseExp: false,
      checkBoxVal: 1,
    });
    this.props.onFromClear();
    this.props.onClearImage();
  };
  startSelect = (event, picker) => {
    event.preventDefault();
    event.stopPropagation();
    var startdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ dob: startdate });
  };
  licenseSelect = (event, picker) => {
    event.preventDefault();
    event.stopPropagation();
    var startdate = picker.startDate.format("YYYY-MM-DD");
    this.setState({ licenseExp: startdate });
  };

  onCheckMoveit = () => {
    var radVal = document.radioForm.moveit_type.value;
    var checkVal = parseInt(radVal);
    this.setState({ checkBoxVal: checkVal });
  };

  clickArea = (item) => {
    this.setState({zoneItem:item});
  };

  render() {
    return (
      <div className="pd-8">
        <Card>
          <CardHeader>
            {this.state.Edit ? "EDIT DRIVER" : "ADD DRIVER"}
            <span className="float-right">
              <Button size="sm" onClick={() => this.props.history.goBack()}>
                Back
              </Button>
            </span>
          </CardHeader>
          <CardBody className="scrollbar pd-0">
            <form onSubmit={this.props.handleSubmit(this.submit)}>
              <Row>
                <Col>
                  <Field
                    name="name"
                    type="text"
                    component={renderTextInputField}
                    label="Name"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
                <Col>
                  <div className="border-none">
                    <div className="flex-row">
                      <div className="width-120 font-size-14">
                        DOB <span className="must">*</span>
                      </div>
                      <div className="border-grey width-170 flex-row pd-4 mr-l-30">
                        <DateRangePicker
                          singleDatePicker
                          maxDate={this.state.today}
                          opens="right"
                          drops="down"
                          onApply={this.startSelect}
                        >
                          <Button
                            className="mr-r-10"
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0px",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <i className="far fa-calendar-alt"></i>
                          </Button>
                        </DateRangePicker>
                        <span className="mr-l-10 font-size-14 align_self_center">
                          {this.state.dob
                            ? Moment(this.state.dob).format("DD/MM/YYYY")
                            : "DD/MM/YYYY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col>
                  {/* <Field
                    name="email"
                    type="email"
                    component={renderTextInputField}
                    label="Email"
                    disabled={this.state.Edit}
                    warn={aol}
                  /> */}
                  <div  className="border-none">
                    <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className="width-150">zone</div>
                    <ButtonDropdown
                      className="max-height-30"
                      isOpen={this.state.isOpenAreaDropDown}
                      toggle={this.toggleAreaDropDown}
                      size="sm"
                    >
                      <DropdownToggle caret className="width-170">
                        {this.state.zoneItem?this.state.zoneItem.Zonename : ""}
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
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className="border-none">
                    <div className="flex-row font-size-14">
                      <div className="width-120 align_self_center ">
                        Gender : <span className="must">*</span>
                      </div>
                      <div
                        className="width-200 mr-l-40 align_self_center"
                        onClick={this.onCheckMoveit}
                      >
                        <form
                          id="radioForm"
                          name="radioForm"
                          className="mr-t-10"
                        >
                          <input
                            type="radio"
                            name="moveit_type"
                            value="1"
                            checked={this.state.checkBoxVal === 1}
                            className="mr-r-5"
                          />
                          <label className="mr-r-10">Male</label>
                          <input
                            type="radio"
                            name="moveit_type"
                            value="2"
                            checked={this.state.checkBoxVal === 2}
                            className="mr-r-5"
                          />
                          <label className="mr-r-10">Female</label>
                        </form>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="phoneno"
                    type="number"
                    component={InputForMobile}
                    label="Phone Number"
                    validate={[required, phoneNumber]}
                    required={true}
                    maxLength={10}
                    disabled={this.state.mobileVerifyStatus || this.state.Edit}
                    onPhoneNoVerify={this.onPhoneNoVerify}
                  />
                </Col>
                <Col>
                  <Field
                    name="password"
                    type="text"
                    component={renderTextInputField}
                    label="Password"
                    validate={[required, passwordValidate]}
                    required={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="fathersname"
                    type="text"
                    component={renderTextInputField}
                    label="Fathers name"
                    validate={[required, maxLength60, minLength2]}
                    required={true}
                  />
                </Col>
                <Col>
                  <Field
                    name="qualification"
                    type="text"
                    component={renderTextInputField}
                    label="Qualification"
                    validate={[required, maxLength60, minLength2]}
                    required={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="driver_lic"
                    type="text"
                    component={renderTextInputField}
                    label="License number"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
                <Col>
                  <Field
                    name="languages"
                    type="text"
                    component={renderTextInputField}
                    label="Language"
                    validate={[required, maxLength60, minLength2]}
                    required={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <div className="border-none">
                    <div className="flex-row">
                      <div className="width-120 font-size-14">
                        License expiry <span className="must">*</span>
                      </div>
                      <div className="border-grey width-170 flex-row pd-4 mr-l-30">
                        <DateRangePicker
                          singleDatePicker
                          minDate={this.state.today}
                          opens="right"
                          drops="down"
                          onApply={this.licenseSelect}
                        >
                          <Button
                            className="mr-r-10"
                            style={{
                              width: "30px",
                              height: "30px",
                              padding: "0px",
                            }}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <i className="far fa-calendar-alt"></i>
                          </Button>
                        </DateRangePicker>
                        <span className="mr-l-10 font-size-14 align_self_center">
                          {this.state.licenseExp
                            ? Moment(this.state.licenseExp).format("DD/MM/YYYY")
                            : "DD/MM/YYYY"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col>
                  <Field
                    name="pannumber"
                    type="text"
                    component={renderTextInputField}
                    label="PAN Number"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
              </Row>

              <Row>
                <Col>
                  <Field
                    name="bank_name"
                    type="text"
                    component={renderTextInputField}
                    label="Bank name"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
                <Col>
                  <Field
                    name="bank_account_no"
                    type="text"
                    component={renderTextInputField}
                    label="Bank account no"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="ifsc"
                    type="text"
                    component={renderTextInputField}
                    label="IFSC Code"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
                <Col>
                  <Field
                    name="address"
                    type="address"
                    component={renderTextInputField}
                    label="Current address"
                    validate={[required, maxLength60, minLength2]}
                    required={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Field
                    name="pincode"
                    type="text"
                    component={renderTextInputField}
                    label="Pin code"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
                <Col>
                  <Field
                    name="area"
                    type="text"
                    component={renderTextInputField}
                    label="Area"
                    validate={[required, maxLength60, minLength2]}
                    warn={alphaNumeric}
                    required={true}
                  />
                </Col>
              </Row>

              <Row className="pd-0 mr-t-10 image-upload-parent">
                <label className="pd-0 mr-l-20 min-width-150">Proof</label>
                <Col lg="10" className="mr-0">
                  <Row className="pd-10 mr-t-10 image-upload-parent">
                    <Col>
                      <div className="header font-size-14">
                        Driving License <span className="must">*</span>
                      </div>
                      <Field
                        name="drivinglicense"
                        component={DropzoneFieldMultiple}
                        type="file"
                        imagefile={this.state.driverLicenceFile}
                        handleOnDrop={() => this.handleDriverLicence}
                      />
                    </Col>
                    <Col>
                      <div className="header font-size-14">
                        PAN <span className="must">*</span>
                      </div>
                      <Field
                        name="vehicleInsuranceProof"
                        component={DropzoneFieldMultiple}
                        type="file"
                        imagefile={this.state.vehicleInsuranceFile}
                        handleOnDrop={() => this.handleVehicleInsurance}
                      />
                    </Col>
                    <Col>
                      <div className="header font-size-14">
                        Aadhar <span className="must">*</span>
                      </div>
                      <Field
                        name="vehicleRcBookProof"
                        component={DropzoneFieldMultiple}
                        type="file"
                        imagefile={this.state.rcBookFile}
                        handleOnDrop={() => this.handleVechicleRcbook}
                      />
                    </Col>
                    <Col>
                      <div className="header font-size-14">
                        Bank doc <span className="must">*</span>
                      </div>
                      <Field
                        name="photoProof"
                        component={DropzoneFieldMultiple}
                        type="file"
                        imagefile={this.state.photoFile}
                        handleOnDrop={() => this.handlePhoto}
                      />
                    </Col>
                    <Col>
                      <div className="header font-size-14">
                        Contract doc <span className="must">*</span>
                      </div>
                      <Field
                        name="legalDocument"
                        component={DropzoneFieldMultiple}
                        type="file"
                        imagefile={this.state.legalDocumentFile}
                        handleOnDrop={() => this.handleLegalDocument}
                        // validate={[imageIsRequired]}
                      />
                    </Col>

                    <Col>
                      <div className="header font-size-14">
                        Address proof <span className="must">*</span>
                      </div>
                      <Field
                        name="addressDocument"
                        component={DropzoneFieldMultiple}
                        type="file"
                        imagefile={this.state.addressDocumentFile}
                        handleOnDrop={() => this.handleAddressDocument}
                        // validate={[imageIsRequired]}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="float-right">
                <Button
                  type="submit"
                  size="sm"
                  disabled={this.props.pristine || this.props.submitting}
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  size="sm"
                  disabled={this.props.pristine || this.props.submitting}
                  onClick={this.resetForm}
                  className="mr-l-10"
                >
                  Clear
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Modal
          isOpen={this.state.mobileVerifyModel}
          toggle={this.toggleMobileVerifyModal}
          className={this.props.className}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.toggleMobileVerifyModal}>
            OTP Verify
          </ModalHeader>
          <ModalBody>
            <MobileVerifyForm
              mobilenumber={this.state.mobilenumber}
              update={this.otpStatus}
              roleType={2}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

AddMoveitUserForm = reduxForm({
  form: MOVEIT_REGISTRATION_FORM, // a unique identifier for this form
})(AddMoveitUserForm);

export default connect(mapStateToProps, mapDispatchToProps)(AddMoveitUserForm);
