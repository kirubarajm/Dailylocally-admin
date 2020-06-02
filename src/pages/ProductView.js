import React from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";

const mapStateToProps = (state) => ({ ...state.productview });

const mapDispatchToProps = (dispatch) => ({});

function CardRowCol(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item font-size-14">
        <Col lg="4" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="1" className="color-grey pd-0">
          {":"}
        </Col>
        <Col lg="6" style={{ color: color }} className="pd-l-0">
          {props.value}
        </Col>
      </Row>
    );
  }

  return <div />;
}

function CardRowColVendor(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item font-size-14">
        <Col lg="7" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="1" className="color-grey pd-0">
          {":"}
        </Col>
        <Col lg="4" style={{ color: color }} className="pd-l-0">
          {props.value}
        </Col>
      </Row>
    );
  }

  return <div />;
}

class ProductView extends React.Component {
  constructor() {
    super();
  }

  UNSAFE_componentWillMount() {}
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}

  render() {
    const productdetail = this.props.productdetail || false;
    return (
      <div>
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Product View</div>
            <div>
              <Row className="pd-0 mr-l-10 mr-r-10">
                <Col lg="4">
                  <CardRowCol lable="Category" value={productdetail.category} />
                  <CardRowCol
                    lable="L1 Category"
                    value={productdetail.subCategory1}
                  />
                  <CardRowCol
                    lable="L2 Category"
                    value={productdetail.subCategory2}
                  />
                  <CardRowCol
                    lable="Item Name"
                    value={productdetail.itemname}
                  />
                  <CardRowCol
                    lable="Item Code"
                    value={productdetail.itemcode}
                  />
                  <CardRowCol
                    lable="Weight (kg)"
                    value={productdetail.weight}
                  />
                  <CardRowCol lable="UOM" value={productdetail.uom} />
                  <CardRowCol
                    lable="Packet size"
                    value={productdetail.packet_size}
                  />
                </Col>
                <Col lg="4">
                  <CardRowCol lable="Brand" value={productdetail.category} />
                  <CardRowCol
                    lable="Short description"
                    value={productdetail.subCategory1}
                  />
                  <CardRowCol
                    lable="Product details"
                    value={productdetail.subCategory2}
                  />
                  <CardRowCol
                    lable="Zone area"
                    value={productdetail.itemname}
                  />
                  <CardRowCol lable="HSN code" value={productdetail.itemcode} />
                  <CardRowCol lable="Tag" value={productdetail.weight} />
                  <CardRowCol lable="Perishable" value={productdetail.uom} />
                  <CardRowCol
                    lable="Veg/Vegan/Non veg"
                    value={productdetail.packet_size}
                  />
                  <CardRowCol
                    lable="Targeted Base Price"
                    value={productdetail.uom}
                  />
                </Col>
                <Col lg="4">
                  <CardRowCol lable="MRP" value={productdetail.itemcode} />
                  <CardRowCol lable="GST %" value={productdetail.itemcode} />
                  <CardRowCol
                    lable="Discount amount"
                    value={productdetail.itemcode}
                  />
                  <CardRowCol
                    lable="Discounted amount"
                    value={productdetail.itemcode}
                  />
                </Col>
              </Row>
            </div>
          </div>

          <div className="mr-t-20">
            <div className="fieldset">
              <div className="legend">
                Cost Comparison (PO/ PA- Active/PA - Expired)
              </div>
              <div>
                <Row className="pd-0 mr-l-10 mr-r-10">
                  {this.props.productdetail.vendor_list.map((item, i) => (
                    <Col lg="4" className="pd-0">
                      <div className="fieldset">
                        <div className="legend">
                          {item.vendorname}-{item.vendorcode}-{item.expdate}
                        </div>
                        <Row className="pd-0 mr-l-10 pd-b-10">
                          <Col lg="11">
                            <CardRowColVendor
                              lable="Base Price"
                              value={item.baseprice}
                            />
                            <CardRowColVendor
                              lable="Cost Price (Calculated field)"
                              value={item.costprice}
                            />
                            <CardRowColVendor
                              lable="Other charges (%)"
                              value={item.othercharges}
                            />
                            <Row>
                              <Col></Col>
                              <Col className="txt-align-right">
                                <Button size="sm" color="primary">
                                  Edit
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductView);
