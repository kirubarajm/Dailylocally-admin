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
  VENDOR_LIST,
  VENDOR_REPORT,
  ZONE_ITEM_REFRESH,
  ZONE_SELECT_ITEM,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import SearchItem from "../components/SearchItem";
import { store } from "../store";
import { CSVLink } from "react-csv";
import PaginationComponent from "react-reactstrap-pagination";
import MapContainer from "../components/MapContainer";
import { Field, reduxForm, reset } from "redux-form";
import { COMMUNITY_FORM, VENDOR_REGISTER } from "../utils/constant";
import { required, requiredTrim } from "../utils/Validation";
import NewVendorAdd from "./NewVendorAdd";
const InputField = ({
  input,
  label,
  type,
  meta: { touched, error, warning },
  ...custom
  //
}) => {
  return (
    <div className="border-none width-250">
      <div className="flex-column">
        <input
          {...input}
          placeholder={label}
          type={type}
          autoComplete="off"
          disabled={custom.disabled}
        />
        <span
          style={{
            flex: "0",
            WebkitFlex: "0",
            width: "150px",
            height: "10px",
            fontSize: "12px",
            marginTop: "5px",
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
  ...state.vendor,
  zone_list: state.common.zone_list,
  zoneItem: state.common.zoneItem,
  zoneRefresh: state.common.zoneRefresh,
});

const mapDispatchToProps = (dispatch) => ({
  onGetVendorList: (data) =>
    dispatch({
      type: VENDOR_LIST,
      payload: AxiosRequest.Vendor.getVendorList(data),
    }),
  onGetVendorReport: (data) =>
    dispatch({
      type: VENDOR_REPORT,
      payload: AxiosRequest.Vendor.getVendorList(data),
    }),
});

class Vendor extends React.Component {
  csvLink = React.createRef();
  constructor() {
    super();
    this.state = {
      isLoading: false,
      vendoradd: false,
      selectVendor: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.toggleVendorAddPopup = this.toggleVendorAddPopup.bind(this);
    this.onVendorList();
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

    if (this.props.vendor_report.length > 0 && this.state.isReport) {
      this.setState({ isReport: false });
      this.csvLink.current.link.click();
    }
    this.onVendorList();
  }

  clickArea = (item) => {
    store.dispatch({ type: ZONE_SELECT_ITEM, zoneItem: item });
  };

  componentDidCatch() {}
  onVendorList = () => {
    if (!this.state.isLoading) {
      this.setState({ isLoading: true });
      var data = { zoneid: this.props.zoneItem.id };
      if (this.state.selectedPage) data.page = this.state.selectedPage;
      this.props.onGetVendorList(data);
    }
  };

  onReportDownLoad = () => {
    this.setState({ isReport: true });
    var data = { zoneid: this.props.zoneItem.id };
    data.report = 1;
    this.props.onGetVendorReport(data);
  };

  handleSelected = (selectedPage) => {
    this.setState({ selectedPage: selectedPage, isLoading: false });
  };

  dateConvert(date) {
    var datestr = Moment(date).format("DD-MMM-YYYY/hh:mm a");
    if (datestr !== "Invalid date") return datestr;
    else return " - ";
  }

  addVendor = () => {
    this.setState({isEdit: false });
    this.toggleVendorAddPopup();
  };

  editVendor = (item) => {
    this.setState({ selectVendor: item, isEdit: true });
    this.toggleVendorAddPopup();
  };

  onAddVendSu= () => {
    this.toggleVendorAddPopup();
    this.setState({ isEdit: false,isLoading:false});
  };

  toggleVendorAddPopup = () => {
    this.setState({
      vendoradd: !this.state.vendoradd,
    });
  };

  render() {
    const vendor_list = this.props.vendor_list || [];
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
                  data={this.props.vendor_report}
                  filename={"vendor_master_report.csv"}
                  className="mr-r-20"
                  ref={this.csvLink}
                  hidden={true}
                ></CSVLink>
                <Button
                  size="sm"
                  onClick={this.addVendor}
                  hidden={onActionHidden("stockadd")}
                >
                  Add Vendor
                </Button>
              </Col>
            </Row>
            <div className="scroll-vendor mr-t-10">
              <Table style={{ width: "1500px" }}>
                <thead>
                  <tr>
                    <th>vid</th>
                    <th>Vendor Name</th>
                    <th>Phone No</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>PAN</th>
                    <th>FSSAI</th>
                    <th>created_at</th>
                    <th>GST No</th>
                    <th>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {vendor_list.map((item, i) => (
                    <tr key={i}>
                      <td>{item.vid}</td>
                      <td>{item.name}</td>
                      <td>{item.phoneno}</td>
                      <td>{item.address}</td>
                      <td className="table-cloumn-overflow">{item.email}</td>
                      <td>{item.pan}</td>
                      <td>{item.fssai}</td>
                      <td> {this.dateConvert(item.created_at)}</td>
                      <td>{item.gst}</td>
                      <td>
                        <Button
                          size="sm"
                          className="pd-0"
                          disabled={onActionHidden("crm_view")}
                          onClick={() => this.editVendor(item)}
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
          isOpen={this.state.vendoradd}
          toggle={this.toggleVendorAddPopup}
          className={this.props.className}
          backdrop={true}
        >
          <ModalHeader toggle={this.toggleVendorAddPopup}>
          </ModalHeader>
          <ModalBody>
            <NewVendorAdd
              selectVendor={this.state.selectVendor}
              isEdit={this.state.isEdit}
              update={this.onAddVendSu}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Vendor);
