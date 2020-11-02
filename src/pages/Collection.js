import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { CSVLink } from "react-csv";
import { getAdminId, onActionHidden } from "../utils/ConstantFunction";
import {
  ADD_COLLECTION,
  EDIT_COLLECTION,
  GET_COLLECTION,
  DELETE_COLLECTION_IMAGES,
  ACTIVE_COLLECTION,
  UPDATE_COLLECTION_IMAGES,
  GET_CLASSIFICATION,
  GET_CLASSIFICATION_DATA,
  SET_COLLECTION_IMAGES,
  FROMCLEAR,
  GET_COLLECTION_REPORT,
} from "../constants/actionTypes";
import { FaPencilAlt, FaDownload } from "react-icons/fa";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";
import PaginationComponent from "react-reactstrap-pagination";
import {
  Row,
  Col,
  Button,
  Table,
  ModalFooter,
  Card,
  CardImg,
  Modal,
  ModalBody,
  ModalHeader,
} from "reactstrap";
import SwitchButtonCommon from "../components/SwitchButtonCommon";
import { Field, reduxForm, reset } from "redux-form";
import { required, requiredTrim } from "../utils/Validation";
import { COLLECTION_FROM } from "../utils/constant";
import Select from "react-dropdown-select";
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
    <div className="flex-row mr-b-10">
      <label hidden={!label} className="mr-0 border-none">
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div className="border-none" style={{ marginLeft: "-90px" }}>
        <input {...input} placeholder={label} type={type} autoComplete="off" />
        <div
          style={{
            flex: "0",
            WebkitFlex: "0",
            height: "10px",
            fontSize: "12px",
            color: "red",
          }}
        >
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
      </div>
    </div>
  );
};

const InputFielddiv = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div className="flex-row mr-b-10">
      <label hidden={!label} className="mr-0 border-none width-200">
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div className="border-none">
        <input {...input} value={custom.mvalue} placeholder={label} type={type} autoComplete="off" onChange={(e) => input.onChange(e)}/>
        <div
          style={{
            flex: "0",
            WebkitFlex: "0",
            height: "10px",
            fontSize: "12px",
            color: "red",
          }}
        >
          {touched &&
            ((error && <span>{error}</span>) ||
              (warning && <span>{warning}</span>))}
        </div>
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
  hidden,
}) => {
  return (
    <div
      className="border-none"
      style={{ marginBottom: "10px" }}
      hidden={hidden}
    >
      <Row className="pd-0 mr-l-10 mr-r-10 border-none">
        <Col lg="5" className="pd-0">
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

const InputSearchDropDownMulti = ({
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
  hidden,
}) => {
  return (
    <div
      className="border-none"
      style={{ marginBottom: "10px" }}
      hidden={hidden}
    >
      <Row className="pd-0 mr-l-10 mr-r-10 border-none">
        <Col lg="5" className="pd-0">
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
            multi
            options={options}
            labelField={labelField}
            searchable={searchable}
            searchBy={searchBy}
            values={[...values]}
            noDataLabel={noDataLabel}
            dropdownPosition="auto"
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

const mapStateToProps = (state) => ({
  ...state.collection,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCollection: (data) =>
    dispatch({
      type: GET_COLLECTION,
      payload: AxiosRequest.Collection.getCollectionList(data),
    }),
  onGetCollectionReport: (data) =>
    dispatch({
      type: GET_COLLECTION_REPORT,
      payload: AxiosRequest.Collection.getCollectionList(data),
    }),
  onGetClassification: (data) =>
    dispatch({
      type: GET_CLASSIFICATION,
      payload: AxiosRequest.Collection.getClassificationList(data),
    }),
  onGetClassificationdata: (data) =>
    dispatch({
      type: GET_CLASSIFICATION_DATA,
      payload: AxiosRequest.Collection.getClassificationData(data),
    }),

  onSetImages: (image) =>
    dispatch({
      type: SET_COLLECTION_IMAGES,
      image,
    }),
  //GET_CLASSIFICATION
  onAddCollectionDetails: (data) =>
    dispatch({
      type: ADD_COLLECTION,
      payload: AxiosRequest.Collection.addCollection(data),
    }),
  onEditCollectionDetails: (data) =>
    dispatch({
      type: EDIT_COLLECTION,
      payload: AxiosRequest.Collection.editCollection(data),
    }),
  onUpdateCOllectionImages: (data, imgtype) =>
    dispatch({
      type: UPDATE_COLLECTION_IMAGES,
      imgtype,
      payload: AxiosRequest.Catelog.fileUpload(data),
    }),
  onDeleteImages: () =>
    dispatch({
      type: DELETE_COLLECTION_IMAGES,
    }),
  activeCollection: (data) =>
    dispatch({
      type: ACTIVE_COLLECTION,
      payload: AxiosRequest.Collection.activeCollection(data),
    }),
  onClear: () =>
    dispatch({
      type: FROMCLEAR,
    }),
  onFromClear: () => dispatch(reset(COLLECTION_FROM)),
});

class Collection extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isReport: false,
      isImageModal: false,
      imageItem: false,
      isNext: false,
      isNextDisable: true,
      isReport: false,
      collection_title: "",
      cardtype: [],
      classification: [],
      classficationdata: [],
      liveModal: false,
      selectCollection: false,
      stPrice:0,
      edPrice:0
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    const { path } = this.props.match;
    this.props.onGetCollection();
    this.props.onGetClassification();
  }
  UNSAFE_componentWillUpdate() {
    console.log("--componentWillUpdate-->");
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log("--componentWillReceiveProps-->next", nextProps.match);
    console.log("--componentWillReceiveProps-->", this.props.match);
  }
  componentWillUnmount() {
    console.log("--componentWillUnmount-->");
  }

  componentDidMount() {
    console.log("--componentDidMount-->");
  }
  componentDidUpdate(nextProps, nextState) {
    console.log("--componentDidUpdate-->");
    if (
      this.props.classification_Data.length !== 0 &&
      this.state.isNextDisable
    ) {
      this.setState({ isNextDisable: false });
    }

    if (this.props.isLive) {
      this.props.onClear();
      this.toggleLive();
      this.props.onGetCollection();
    }

    if (this.props.collectionreport.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    if (this.props.isUpdate) {
      this.props.onClear();
      this.props.onFromClear();
      this.setState({
        cardtype: [],
        classification: [],
        classficationdata: [],
        isNextDisable: true,
      });
      this.toggleNextPopup();
      this.props.onGetCollection();
    }
  }
  componentDidCatch() {
    console.log("--componentDidCatch-->");
  }

  onChangeStPrice =(e)=>{
    this.setState({stPrice:e.target.value});

  }

  onChangeEdPrice =(e)=>{
    this.setState({edPrice:e.target.value});
  }
  onEdit = (item) => {
    this.setState({ isEdit: true, selectCollection: item });
    var initData = {
      collection_title: item.name,
    };

    this.setState({
      isNextDisable: false,
      cardtype: [{ id: item.tile_type, name: item.tile_type_name }],
      classification: [
        { id: item.classification_type, name: item.classification_type_name },
      ],
      stPrice:item.start_price,
      edPrice:item.end_price,
      classficationdata:
        item.classification_type !== 5
          ? [{ id: item.classification_id, name: item.classification_id_name }]
          : item.collectionproducts,
    });
    this.props.onSetImages(item.img_url);
    this.props.initialize(initData);
    this.toggleCollectionAddPopup();
  };

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { report: 1 };
    this.props.onGetCollectionReport(data);
  };

  selectPickupImage = (item) => {
    this.setState({ imageItem: item });
    this.toggleImagePopUp();
  };
  toggleImagePopUp = () => {
    this.setState((prevState) => ({
      isImageModal: !prevState.isImageModal,
    }));
  };

  addCollection = () => {
    this.setState({ isEdit: false,stPrice:0,
      edPrice:0 });
    var initData = {
      collection_title: "",
    };
    this.props.initialize(initData);
    this.toggleCollectionAddPopup();
  };

  toggleCollectionAddPopup = () => {
    this.setState({
      collectionadd: !this.state.collectionadd,
    });
  };

  toggleNextPopup = () => {
    this.setState({
      collectionnext: !this.state.collectionnext,
    });
  };

  ImageDownload = (img) => {
    document.getElementById(img).click();
  };

  OnClickSwitch = () => (ev) => {
    if (ev) ev.stopPropagation();
  };
  Onlive = (item) => (ev) => {
    if (ev) ev.stopPropagation();
    this.setState({ selectCollection: item });
    this.toggleLive();
  };

  selectedCard = (item) => {
    this.setState({ cardtype: item });
  };

  selectedClassficationData = (item) => {
    this.setState({ classficationdata: item });
  };

  handleonRemove = () => {
    this.props.onDeleteImages();
  };

  handleCollectionimages = (newImageFile) => {
    var data = new FormData();
    data.append("file", newImageFile[0]);
    var type = 1;
    data.append("type", type);
    this.props.onUpdateCOllectionImages(data, type);
  };

  selectedClassification = (item) => {
    this.setState({
      classification: item,
      isNextDisable: false,
      classficationdata: [],
    });
    if (item[0]) this.props.onGetClassificationdata({ type: "" + item[0].id });
  };

  onNext = () => {
    this.setState({ isNext: true });
  };

  onBack = () => {
    this.setState({ isNext: false });
    this.toggleNextPopup();
    this.toggleCollectionAddPopup();
  };
  onClose = () => {
    this.setState({
      cardtype: [],
      classification: [],
      classficationdata: [],
      isNextDisable: true,
    });
    this.toggleCollectionAddPopup();
  };

  onCloseNext = () => {
    this.props.onClear();
    this.props.onFromClear();
    this.setState({
      cardtype: [],
      classification: [],
      classficationdata: [],
      isNextDisable: true,
    });
    this.toggleNextPopup();
  };

  updateCollection = (fdata) => {
    this.setState({ collection_title: fdata.collection_title });
    if (this.state.cardtype.length === 0) {
      notify.show("Please select type", "custom", 1000, notification_color);
    } else if (this.state.classification.length === 0) {
      notify.show(
        "Please select classification",
        "custom",
        1000,
        notification_color
      );
    } else {
      this.setState({ isNext: true });
      this.toggleCollectionAddPopup();
      this.toggleNextPopup();
    }
  };

  toggleLive = () => {
    this.setState((prevState) => ({
      liveModal: !prevState.liveModal,
    }));
  };

  MovetoLive = () => {
    this.props.activeCollection({
      cid: this.state.selectCollection.cid,
      zoneid: this.props.zoneItem.id,
      done_by: getAdminId(),
    });
  };
  sendCollection = () => {
    if (this.props.Collection_Img.length === 0) {
      notify.show("Please upload image", "custom", 1000, notification_color);
      return;
    } else if (this.state.classficationdata.length === 0 && this.state.classification[0].id!==6) {
      notify.show(
        "Please select " + this.state.classification[0].name,
        "custom",
        1000,
        notification_color
      );
      return;
    }
    var data = {};
    data.name = this.state.collection_title;
    data.tile_type = "" + this.state.cardtype[0].id;
    data.classification_type = "" + this.state.classification[0].id;
    if (this.state.classification[0].id === 5) {
      var pid = [];
      for (var i = 0; i < this.state.classficationdata.length; i++) {
        pid.push(this.state.classficationdata[i].id);
      }
      data.products = pid;
    }else if (this.state.classification[0].id === 6) {
      data.start_price = this.state.stPrice;
      data.end_price = this.state.edPrice;
    } else {
      data.classification_id = "" + this.state.classficationdata[0].id;
    }

    data.img_url = this.props.Collection_Img[0].img_url;
    data.done_by = getAdminId();
    data.zoneid = this.props.zoneItem.id;
    console.log("data-->", data);
    if (this.state.isEdit) {
      data.cid = this.state.selectCollection.cid;
      this.props.onEditCollectionDetails(data);
    } else {
      this.props.onAddCollectionDetails(data);
    }
  };

  render() {
    const collectionlist = this.props.collectionlist || [];
    return (
      <div className="width-full">
        <div className="pd-12">
          <Row>
            <Col lg="2" className="txt-align-right"></Col>
            <Col>
              <div className="float-right">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>
                <CSVLink
                  data={this.props.collectionreport}
                  filename={"collection_report.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>

                <Button size="sm" onClick={this.addCollection}>
                  Add New Collection
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="scroll-vendor mr-t-10">
          <Table style={{ width: "1200px" }}>
            <thead>
              <tr>
                <th>Edit</th>
                <th>Collection ID</th>
                <th>Collection title</th>
                <th>Classification</th>
                <th>Type</th>
                <th>Position in list</th>
                <th>Photo</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {collectionlist.map((item, i) => (
                <tr key={i}>
                  <td>
                    {
                      <Button
                        size="sm"
                        color="link"
                        disabled={onActionHidden("wh_order_view")}
                        onClick={() => this.onEdit(item)}
                      >
                        <FaPencilAlt size="15" />
                      </Button>
                    }
                  </td>
                  <td>{item.cid}</td>
                  <td>{item.name}</td>
                  <td>{item.classification_type_name || "-"}</td>
                  <td>{item.tile_type_name || "-"}</td>
                  <td>{item.category_Position}</td>
                  <td>
                    <Button
                      size="sm"
                      color="link"
                      disabled={!item.img_url}
                      onClick={() => this.selectPickupImage(item)}
                    >
                      <FaDownload size="20" />{" "}
                    </Button>
                  </td>
                  <td>
                    <SwitchButtonCommon
                      checked={item.active_status === "0" ? false : true}
                      handleClick={this.OnClickSwitch()}
                      handleSwitchChange={this.Onlive(item)}
                    ></SwitchButtonCommon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div
          className="float-right"
          //hidden={this.props.totalcount < this.props.pagelimit}
          hidden={true}
        >
          <PaginationComponent
            totalItems={this.props.totalcount}
            pageSize={this.props.pagelimit}
            onSelect={this.handleSelected}
            activePage={this.state.selectedPage}
            size="sm"
          />
        </div>

        <Modal
          isOpen={this.state.isImageModal}
          toggle={this.toggleImagePopUp}
          className={this.props.className}
          backdrop={true}
        >
          <ModalBody className="pd-10">
            <div className="fieldset">
              <div className="legend">
                Collection Image - Collection ID - #{this.state.imageItem.cid}
              </div>
              {this.state.imageItem ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    padding: "5px",
                  }}
                >
                  {this.state.imageItem.img_url ? (
                    <a
                      id="img1"
                      href={this.state.imageItem.img_url}
                      download
                      hidden
                      target="_blank"
                    ></a>
                  ) : (
                    ""
                  )}

                  <Card hidden={!this.state.imageItem.img_url}>
                    <CardImg
                      top
                      style={{ width: "200px", height: "200px" }}
                      src={this.state.imageItem.img_url}
                      alt="Collection Image"
                    />
                    <Button
                      size="sm"
                      onClick={() => this.ImageDownload("img1")}
                    >
                      View
                    </Button>
                  </Card>
                </div>
              ) : (
                ""
              )}
            </div>
          </ModalBody>
          <ModalFooter className="pd-10 border-none">
            <Button size="sm" onClick={this.toggleImagePopUp}>
              Close
            </Button>
          </ModalFooter>
        </Modal>

        <Modal
          isOpen={this.state.collectionadd}
          toggle={this.onClose}
          className={this.props.className}
          style={{ maxWidth: "700px" }}
          backdrop={true}
        >
          <ModalHeader toggle={this.onClose}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend" style={{ width: "150px" }}>
                {this.state.isEdit ? "Edit Collecton" : "Add Collection"}
              </div>
              <form onSubmit={this.props.handleSubmit(this.updateCollection)}>
                <div className="flex-column max-width-400">
                  <Field
                    name="collection_title"
                    autoComplete="off"
                    type="name"
                    component={InputField}
                    label="Collection Title"
                    validate={[required, requiredTrim]}
                    required={true}
                  />

                  <Field
                    name="cat_id"
                    component={InputSearchDropDown}
                    options={this.props.Card_type}
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.cardtype}
                    onSelection={this.selectedCard}
                    label="Type"
                  />

                  <Field
                    name="class_id"
                    component={InputSearchDropDown}
                    options={this.props.classification_list}
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.classification}
                    onSelection={this.selectedClassification}
                    label="Classification"
                  />
                </div>
                <div className="float-right">
                  <Button size="sm" disabled={this.state.isNextDisable}>
                    Next
                  </Button>
                </div>
              </form>
            </div>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.collectionnext}
          toggle={this.onCloseNext}
          className={this.props.className}
          style={{ maxWidth: "700px" }}
          backdrop={true}
        >
          <ModalHeader toggle={this.onCloseNext}></ModalHeader>
          <ModalBody>
            <div className="fieldset">
              <div className="legend" style={{ width: "150px" }}>
                {this.state.isEdit ? "Edit Collecton" : "Add Collection"}
              </div>
              <div className="flex-column max-width-500">
                <div className="flex-row border-none mr-b-20">
                  <label className="color-red font-size-12 border-none mr-l-20 mr-r-50">
                    Image size{" "}
                    {this.state.cardtype.length === 0
                      ? ""
                      : this.state.cardtype[0].id === 1
                      ? "480*640 px"
                      : "1000*540 px"}
                  </label>
                  <Field
                    name={"Collection"}
                    component={DropzoneFieldMultiple}
                    type="file"
                    imgPrefillDetail={
                      this.props.Collection_Img.length
                        ? this.props.Collection_Img[0]
                        : ""
                    }
                    label="Photogropy"
                    handleonRemove={() => this.handleonRemove()}
                    handleOnDrop={() => this.handleCollectionimages}
                  />
                </div>
                <div hidden={
                      (this.state.classification.length !== 0 &&
                        this.state.classification[0].id === 6)
                    }>
                  <Field
                    name="class_data"
                    component={InputSearchDropDown}
                    options={this.props.classification_Data}
                    labelField="name"
                    searchable={true}
                    hidden={
                      this.state.classification.length !== 0 &&
                      this.state.classification[0].id === 5
                    }
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.classficationdata}
                    onSelection={this.selectedClassficationData}
                    label={
                      this.state.classification.length === 0
                        ? ""
                        : this.state.classification[0].name
                    }
                  />

                  <Field
                    name="class_data"
                    component={InputSearchDropDownMulti}
                    options={this.props.classification_Data}
                    hidden={
                      (this.state.classification.length !== 0 &&
                        this.state.classification[0].id !== 5)
                    }
                    labelField="name"
                    searchable={true}
                    clearable={true}
                    searchBy="name"
                    valueField="id"
                    noDataLabel="No matches found"
                    values={this.state.classficationdata}
                    onSelection={this.selectedClassficationData}
                    label={
                      this.state.classification.length === 0
                        ? ""
                        : this.state.classification[0].name
                    }
                  />
                </div>
              
              <div hidden={
                      (this.state.classification.length !== 0 &&
                        this.state.classification[0].id !== 6)
                    }>
                      <form>
                <Field
                    name="st_price"
                    autoComplete="off"
                    type="number"
                    mvalue={this.state.stPrice}
                    component={InputFielddiv}
                    label="Start Price"
                    onChange={this.onChangeStPrice}
                    validate={[required]}
                    required={true}
                  />
                  <Field
                    name="ed_price"
                    autoComplete="off"
                    type="number"
                    mvalue={this.state.edPrice}
                    component={InputFielddiv}
                    label="End Price"
                    onChange={this.onChangeEdPrice}
                    validate={[required]}
                    required={true}
                  />
                  </form>
                  </div>
              </div>
              <div className="float-right mr-t-10">
                <Button
                  size="sm"
                  className="mr-r-20"
                  hidden={!this.state.isNext}
                  onClick={this.onBack}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  hidden={!this.state.isNext}
                  onClick={this.sendCollection}
                >
                  Submit
                </Button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.liveModal}
          toggle={this.toggleLive}
          className="add_live_modal"
          backdrop={"static"}
        >
          <ModalHeader>Confirmation </ModalHeader>
          <ModalBody>
            {this.state.selectCollection.active_status === "0"
              ? "Are you sure you want to active the '" +
                this.state.selectCollection.name +
                "' Collection"
              : "Are you sure you want to deactive the '" +
                this.state.selectCollection.name +
                "' Collection"}{" "}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.MovetoLive}>
              Yes
            </Button>{" "}
            <Button color="secondary" onClick={this.toggleLive}>
              NO
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

Collection = reduxForm({
  form: COLLECTION_FROM, // a unique identifier for this form
})(Collection);

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
