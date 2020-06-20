import React from "react";
import { connect } from "react-redux";
import {
  Row,
  Col,
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { FaEye, FaRegFilePdf, FaTrashAlt } from "react-icons/fa";
import {
  SORTING_LIST,
  SORTING_SAVING_ITEM,
  SORTING_SUBMIT_ITEM,
  SORTING_CLEAR,
} from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";
import { notify } from "react-notify-toast";
import { notification_color } from "../utils/constant";

const mapStateToProps = (state) => ({
  ...state.sorting,
  zoneItem: state.warehouse.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onGetSortingList: (data) =>
    dispatch({
      type: SORTING_LIST,
      payload: AxiosRequest.Warehouse.getSortingList(data),
    }),
  onSaving: (data) =>
    dispatch({
      type: SORTING_SAVING_ITEM,
      payload: AxiosRequest.Warehouse.saveSorting(data),
    }),
  onSubmit: (data) =>
    dispatch({
      type: SORTING_SUBMIT_ITEM,
      payload: AxiosRequest.Warehouse.submitSorting(data),
    }),
  onClear: () =>
    dispatch({
      type: SORTING_CLEAR,
    }),
});

class Sorting extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      poid_refresh: false,
      sortingModal: false,
      selected_dopid: false,
      selectedItem: { products: [] },
    };
  }

  UNSAFE_componentWillMount() {
    this.onSortingList = this.onSortingList.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onSortingModal = this.onSortingModal.bind(this);
    this.onSortingSave = this.onSortingSave.bind(this);
    this.onSortingSubmit = this.onSortingSubmit.bind(this);
    this.onSortingList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    if (this.props.isSaving) {
      this.props.onClear();
      this.onSortingModal();
      this.setState({ isLoading: false });
    }

    if (this.props.isSubmiting) {
      this.props.onClear();
      this.onSortingModal();
      this.setState({ isLoading: false });
    }

    this.onSortingList();
  }
  componentDidCatch() {}
  onActionClick = (item) => (ev) => {
    if(item.products.length>0){
      var arvalue={};
      for(var i=0;i<item.products.length;i++){
        if(item.products[i].sorting_status===2)
        arvalue[item.products[i].dopid] = true;
      }
      this.setState({
        selected_dopid: arvalue,
      });
    }

    this.setState({ selectedItem: item });
    this.onSortingModal();
  };
  onSortingList = () => {
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetSortingList({
        zone_id: this.props.zoneItem.id,
      });
    }
  };
  onSortingModal = () => {
    this.setState((prevState) => ({
      sortingModal: !prevState.sortingModal,
    }));
  };
  onSortingSave = () => {
    var checkItem = this.state.selected_dopid;
    var Values = Object.keys(checkItem);
    if (Values.length > 0) {
      var data = {
        dopid_list: Values,
      };
      this.props.onSaving(data);
    } else {
      notify.show(
        "Please select quantity after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };
  onSortingSubmit = () => {
    var checkItem = this.state.selected_dopid;
    var Values = Object.keys(checkItem);
    var products= this.state.selectedItem.products || [];
    if (Values.length > 0 &&Values.length===products.length) {
      var data = {
        dopid_list: Values,
      };
      this.props.onSubmit(data);
    } else {
      notify.show(
        "Please select all quantity after try this",
        "custom",
        3000,
        notification_color
      );
    }
  };

  handleChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    var arvalue = this.state.selected_dopid || [];
    if (value) {
      arvalue[name] = value;
    } else {
      delete arvalue[name];
    }

    this.setState({
      selected_dopid: arvalue,
    });
  }

  render() {
    const sortingList = this.props.sortingList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Sorting / packing Search criteria</div>
            <Row className="pd-0 mr-l-10 mr-r-10">
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </div>
          <div className="pd-6">
            <div className="search-horizantal-scroll width-full">
              <div className="search-vscroll">
                <Table>
                  <thead>
                    <tr>
                      <th>Date/Time</th>
                      <th>Order ID</th>
                      <th>Order status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortingList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          {Moment(item.date).format("DD-MMM-YYYY/hh:mm a")}
                        </td>
                        <td>{item.doid}</td>
                        <td>
                          <Button size="sm" onClick={this.onActionClick(item)}>
                            Ready for Dispatch
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.sortingModal}
          toggle={this.onSortingModal}
          backdrop={"static"}
        >
          <ModalHeader toggle={this.onSortingModal}></ModalHeader>
          <ModalBody>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div className="width-150 pd-4">Quality</div>
              <div className="width-150 pd-4">Order details</div>
              <div className="width-150 pd-4">Available</div>
            </div>
            <hr />
            <div hidden={!this.state.selectedItem}>
              {this.state.selectedItem.products.map((item, i) => (
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className="width-150 pd-4">
                    <label className="container-check">
                      <input
                        type="checkbox"
                        name={"" + item.dopid}
                        checked={this.state.selected_dopid[item.dopid]}
                        onChange={(e) => this.handleChange(e)}
                      />
                      <span className="checkmark"></span>{" "}
                    </label>
                  </div>
                  <div className="width-150 pd-4">
                    {item.product_name} - {item.quantity}
                  </div>
                  <div className="width-150 pd-4">{item.received_quantity}</div>
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button size="sm" onClick={this.onSortingSave}>
              Save
            </Button>
            <Button size="sm" onClick={this.onSortingSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Sorting);
