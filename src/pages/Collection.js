import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { CSVLink } from "react-csv";
import { getAdminId, onActionHidden } from "../utils/ConstantFunction";
import { ADD_COLLECTION, EDIT_COLLECTION, GET_COLLECTION } from "../constants/actionTypes";
import { FaPencilAlt, FaDownload } from "react-icons/fa";
import Moment from "moment";
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
  ModalBody,ModalHeader
} from "reactstrap";
import SwitchButtonCommon from "../components/SwitchButtonCommon";
import { Field, reduxForm } from "redux-form";
import { required, requiredTrim } from "../utils/Validation";
import { COLLECTION_FROM } from "../utils/constant";

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
      <label hidden={!label} className="width-150 mr-0 border-none">
        {label}{" "}
        <span className="must" hidden={!custom.required}>
          *
        </span>
      </label>
      <div className="border-none">
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
});

class Collection extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isReport: false,
      isImageModal: false,
      imageItem: false,
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
  }
  componentDidCatch() {
    console.log("--componentDidCatch-->");
  }

  onEdit = (item) => {};

  onReportDownLoad = () => {};

  selectPickupImage = (item) => {
    this.setState({ imageItem: item });
    this.toggleImagePopUp();
  };
  toggleImagePopUp = () => {
    this.setState((prevState) => ({
      isImageModal: !prevState.isImageModal,
    }));
  };

  addBrand = () => {
    this.setState({isEdit: false });
    var initData = {
      brand_name: "",
    };
    this.props.initialize(initData);
    this.toggleCollectionAddPopup();
  };

  toggleCollectionAddPopup = () => {
    this.setState({
      collectionadd: !this.state.collectionadd,
    });
  };

  ImageDownload = (img) => {
    document.getElementById(img).click();
  };

  OnClickSwitch = () => (ev) => {
    if (ev) ev.stopPropagation();
  };
  Onlive = (item, i, type) => (ev) => {
    if (ev) ev.stopPropagation();
  };

  updateCollection = (fdata) => {
    var data = {};
    data.brandname = fdata.brand_name;
    data.done_by = getAdminId();
    data.zoneid = this.props.zoneItem.id;
    if (this.state.isEdit) {
      data.id=this.state.selectBrand.id;
      this.props.onAddCollectionDetails(data);
    } else {
      this.props.onEditCollectionDetails(data);
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
                  hidden={onActionHidden("catexport_catalog_master_report")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>
                <CSVLink
                  data={this.props.collection_report}
                  filename={"product_master.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>

                <Button
                  size="sm"
                  onClick={this.addBrand}
                  hidden={onActionHidden("stockadd")}
                >
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
                  <td>{item.classification_type}</td>
                  <td>{item.tile_type}</td>
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
                      handleSwitchChange={this.Onlive(item, i, 1)}
                    ></SwitchButtonCommon>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div
          className="float-right"
          hidden={this.props.totalcount < this.props.pagelimit}
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
                      alt="Cpllection Image"
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
          toggle={this.toggleCollectionAddPopup}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={this.toggleCollectionAddPopup}>
          </ModalHeader>
          <ModalBody>
          <div className="fieldset">
          <div className="legend" style={{ width: "100px" }}>
            {this.state.isEdit ? "Edit Collecton" : "Add Collection"}
          </div>
          <form onSubmit={this.props.handleSubmit(this.updateCollection)}>
            <div className="flex-column">
              <Field
                name="brand_name"
                autoComplete="off"
                type="name"
                component={InputField}
                label="Brand Name"
                validate={[required,requiredTrim]}
                required={true}
              />
            </div>
            <div className="float-right">
              <Button size="sm">Submit</Button>
            </div>
          </form>
        </div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

Collection = reduxForm({
  form: COLLECTION_FROM, // a unique identifier for this form
})(Collection);

export default connect(mapStateToProps, mapDispatchToProps)(Collection);
