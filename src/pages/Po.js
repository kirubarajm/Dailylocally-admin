import React from "react";
import { connect } from "react-redux";
import { Row, Col, Table, Button } from "reactstrap";
import { FaEye, FaRegFilePdf, FaTrashAlt } from "react-icons/fa";
import { PO_LIST } from "../constants/actionTypes";
import AxiosRequest from "../AxiosRequest";
import Moment from "moment";

const mapStateToProps = (state) => ({
  ...state.po,
  zoneItem: state.warehouse.zoneItem,
});

const mapDispatchToProps = (dispatch) => ({
  onGetPoList: (data) =>
    dispatch({
      type: PO_LIST,
      payload: AxiosRequest.Warehouse.getPoList(data),
    }),
});

class Po extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      poid_refresh: false,
    };
  }

  UNSAFE_componentWillMount() {
    this.onGetPoList=this.onGetPoList.bind(this);
    this.onGetPoList();
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {
    this.onGetPoList();
  }
  componentDidCatch() {}

  onGetPoList=()=>{
    if (this.props.zoneItem && !this.state.isLoading) {
      this.setState({ isLoading: true });
      this.props.onGetPoList({
        zone_id: this.props.zoneItem.id,
      });
    }
  }
  render() {
    const poList = this.props.poList || [];
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Purchase Order - Search</div>
            <Row className="pd-0 mr-l-10 mr-r-10">
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
          </div>
          <div className="pd-6">
            <div className="search-horizantal-scroll">
              <div className="search-vscroll">
                <Table style={{ width: "2000px" }}>
                  <thead>
                    <tr>
                      <th>PDF</th>
                      <th>View</th>
                      <th>Delete</th>
                      <th>Close PO</th>
                      <th>PO No</th>
                      <th>Supplier Name</th>
                      <th>Supplier Code</th>
                      <th>Date Created</th>
                      <th>PO Line</th>
                      <th>Total Quantity</th>
                      <th>Open Quantity </th>
                      <th>Received Quantity </th>
                      <th>Amt </th>
                      <th>Due Date/Time</th>
                      <th>PO Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {poList.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <FaRegFilePdf
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <FaEye
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <FaTrashAlt
                            className="txt-color-theme txt-cursor pd-2"
                            size="20"
                          />
                        </td>
                        <td>
                          <Button className="btn-close">Close</Button>
                        </td>
                        <td>{item.poid}</td>
                        <td>{item.name}</td>
                        <td>{item.vid}</td>
                        <td>
                          {Moment(item.created_at).format(
                            "DD-MMM-YYYY/hh:mm a"
                          )}
                        </td>
                        <td>{item.open_quqntity}</td>
                        <td>{item.total_quantity}</td>
                        <td>{item.open_quqntity}</td>
                        <td>{item.received_quantity}</td>
                        <td>{item.cost}</td>
                        <td>
                          {Moment(item.created_at).format(
                            "DD-MMM-YYYY/hh:mm a"
                          )}
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
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Po);
