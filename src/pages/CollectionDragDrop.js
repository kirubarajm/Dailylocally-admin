import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { CSVLink } from "react-csv";
import { getAdminId, onActionHidden } from "../utils/ConstantFunction";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
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
import DragDropItem from "../components/DragDropItem";
import DropTargetItem from "../components/DropTargetItem";

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
    <div className="border-none" style={{ marginBottom: "10px" }}>
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

const mapStateToProps = (state) => ({
  ...state.collectionreorder,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetCollection: (data) =>
    dispatch({
      type: GET_COLLECTION,
      payload: AxiosRequest.Collection.getCollectionCurrentList(data),
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

class CollectionDragDrop extends React.Component {
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
    };
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
    const { path } = this.props.match;
    this.props.onGetCollection();
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
      classficationdata: [
        { id: item.classification_id, name: item.classification_id_name },
      ],
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
    this.setState({ isEdit: false });
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
    } else if (this.state.classficationdata.length === 0) {
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
    data.classification_id = "" + this.state.classficationdata[0].id;
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
    const customElem = (
      <button style={{ marginTop: 20, marginLeft: 20 }}>Bananas!!</button>
    );
    const collectionlist = this.props.collectionlist || [];
    const collectiondraglist = this.props.collectiondraglist || [];
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
          <div
            style={{
              float: "left",
              width: 300,
              height: "auto",
              marginTop: 40,
              marginLeft: 40,
              border: "1px solid black",
            }}
          >
            {collectionlist.map((item, i) => (
              <DragDropItem
                targetKey={item.tile_type}
                item={item}
                dragable={i === 0 ? true : false}
              />
            ))}
          </div>
          <div
            style={{
              float: "left",
              width: 300,
              height: "auto",
              marginTop: 40,
              marginLeft: 40,
              border: "1px solid black",
              flexFlow: "row wrap",
              display: "flex",
            }}
          >
            {collectiondraglist.map((item, i) => (
              <DropTargetItem
                targetKey={item.tile_type}
                citem={item}
                defult_item={i===0?item:""}
                image={i===0?"https://dailylocally.s3.amazonaws.com/upload/moveit/1599494008474-Home%20-%20DLE.jpg":""}
              ></DropTargetItem>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(CollectionDragDrop);
