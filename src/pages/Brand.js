import React from "react";
import { connect } from "react-redux";
import { FaPencilAlt, FaDownload } from "react-icons/fa";
import { onActionHidden, getAdminId } from "../utils/ConstantFunction";
import {
  Row,
  Col,
  Table,
  Button,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "reactstrap";
import {
  BRAND_LIST,
  BRAND_REPORT,
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
  ADD_BRAND,
  EDIT_BRAND,
  ADDCLEAR_BRAND,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { store } from "../store";
import { CSVLink } from "react-csv";
import PaginationComponent from "react-reactstrap-pagination";
import { required, requiredTrim } from "../utils/Validation";
import { Field, reduxForm } from "redux-form";
import { BRAND_FROM } from "../utils/constant";

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
  ...state.brand,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetBrandList: (data) =>
    dispatch({
      type: BRAND_LIST,
      payload: AxiosRequest.Brand.getBrandList(data),
    }),
  onGetBrandReport: (data) =>
    dispatch({
      type: BRAND_REPORT,
      payload: AxiosRequest.Brand.getBrandList(data),
    }),
    onAddBrandDetails: (data) =>
    dispatch({
      type: ADD_BRAND,
      payload: AxiosRequest.Brand.addBrand(data),
    }),
  onEditBrandDetails: (data) =>
    dispatch({
      type: EDIT_BRAND,
      payload: AxiosRequest.Brand.editBrand(data),
    }),
  onClear: () =>
    dispatch({
      type: ADDCLEAR_BRAND,
    }),
});

class Brand extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      brandadd: false,
      selectBrand: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.toggleBrandAddPopup = this.toggleBrandAddPopup.bind(this);
    this.onBrandList();
  }
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

    if (this.props.brand_report.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }

    if(this.props.isBrandUpdate){
      this.toggleBrandAddPopup();
      this.setState({isEdit:false,isLoading:false});
      this.props.onClear();
    }

    this.onBrandList();
  }

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  componentDidCatch() {}
  onBrandList = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zoneid: this.props.zoneItem.id };
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      this.props.onGetBrandList(data);
    }
  };

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { zoneid: this.props.zoneItem.id };
    data.report = 1;
    this.props.onGetBrandReport(data);
  };

  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

  addBrand = () => {
    this.setState({isEdit: false });
    var initData = {
      brand_name: "",
    };
    this.props.initialize(initData);
    this.toggleBrandAddPopup();
  };

  editBrand = (item) => {
    this.setState({ selectBrand: item, isEdit: true });
    var initData = {
      brand_name: item.brandname,
    };
    this.props.initialize(initData);
    this.toggleBrandAddPopup();
  };

  onAddBrandSu= () => {
    this.toggleBrandAddPopup();
    this.setState({ isEdit: false,isLoading:false});
  };

  toggleBrandAddPopup = () => {
    this.setState({
      brandadd: !this.state.brandadd,
    });
  };

  updateBrand = (fdata) => {
    var data = {};
    data.brandname = fdata.brand_name;
    data.done_by = getAdminId();
    data.zoneid = this.props.zoneItem.id;
    if (this.state.isEdit) {
      data.id=this.state.selectBrand.id;
      this.props.onEditBrandDetails(data);
    } else {
      this.props.onAddBrandDetails(data);
    }
  };

  render() {
    const brand_list = this.props.brand_list || [];
    return (
      <div className="width-full">
        <div style={{ height: "75vh" }} className="pd-6">
          <div className="pd-6">
            <Row>
              <Col className="txt-align-right">
                <Button
                  size="sm"
                  color="link"
                  className="mr-r-20"
                  hidden={onActionHidden("stockexport_catalog_master_report")}
                  onClick={() => this.onReportDownLoad()}
                >
                  <FaDownload size="15" />
                </Button>
                <CSVLink
                  data={this.props.brand_report}
                  filename={"brand_master_report.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
                <Button
                  size="sm"
                  onClick={this.addBrand}
                  hidden={onActionHidden("stockadd")}
                >
                  Add Brand
                </Button>
              </Col>
            </Row>
            <div className="scroll-vendor mr-t-10">
              <Table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>Brand Name</th>
                    <th>Created at</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {brand_list.map((item, i) => (
                    <tr key={i}>
                      <td>{item.id}</td>
                      <td>{item.brandname}</td>
                      <td> {this.dateConvert(item.created_at)}</td>
                      <td>
                        <Button
                          size="sm"
                          className="pd-0"
                          disabled={onActionHidden("crm_view")}
                          onClick={() => this.editBrand(item)}
                          color="link"
                        >
                          <FaPencilAlt size="16" />
                        </Button>
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
          </div>
        </div>

        <Modal
          isOpen={this.state.brandadd}
          toggle={this.toggleBrandAddPopup}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={this.toggleBrandAddPopup}>
          </ModalHeader>
          <ModalBody>
          <div className="fieldset">
          <div className="legend" style={{ width: "100px" }}>
            {this.state.isEdit ? "Edit Brand" : "Add Brand"}
          </div>
          <form onSubmit={this.props.handleSubmit(this.updateBrand)}>
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
Brand = reduxForm({
  form: BRAND_FROM, // a unique identifier for this form
})(Brand);
export default connect(mapStateToProps, mapDispatchToProps)(Brand);
