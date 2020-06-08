import React from "react";
import { connect } from "react-redux";
import { Row, Col, Button } from "reactstrap";
import AxiosRequest from "../AxiosRequest";
import { Link } from "react-router-dom";
import { PRODUCT_VIEW } from "../constants/actionTypes";
import Moment from "moment";
import { history } from '../store';

const mapStateToProps = (state) => ({ ...state.productview });

const mapDispatchToProps = (dispatch) => ({
  onGetProduct: (data) =>
    dispatch({
      type: PRODUCT_VIEW,
      payload: AxiosRequest.Catelog.getProductDetail(data),
    }),
});

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

function CardRowColImage(props) {
  var lable = props.lable ? props.lable : "";
  var color = props.color ? props.color : "Black";
  if (props.value !== null) {
    return (
      <Row className="list-text cart-item font-size-14">
        <Col lg="4" className="color-grey pd-0">
          {lable}
        </Col>
        <Col lg="1" className="color-grey pd-0">
          {" "}
        </Col>
        <Col lg="6" className="pd-l-0">
          <img
            hidden={!props.value}
            src={props.value}
            className="product_detail_image"
            alt="product_image"
          ></img>
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

  UNSAFE_componentWillMount() {
    var productIds = this.props.match.params.product_id;
    this.props.onGetProduct({ product_id: productIds });
  }
  UNSAFE_componentWillUpdate() {}
  UNSAFE_componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}

  render() {
    const productdetail = this.props.productdetail || false;
    const vendorlist = this.props.productdetail.vendorlist || [];
    return (
      <div>
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Product View</div>
            <div>
              <Row className="pd-0 mr-l-10 mr-r-10">
                <Col lg="4">
                  <CardRowCol
                    lable="Category"
                    value={productdetail.category_name}
                  />
                  <CardRowCol
                    lable="L1 Category"
                    value={productdetail.subcategoryl1_name}
                  />
                  <CardRowCol
                    lable="L2 Category"
                    value={productdetail.subcategory2_name || "-"}
                  />
                  <CardRowCol
                    lable="Product Name"
                    value={productdetail.productname}
                  />
                  <CardRowCol
                    lable="Product Code"
                    value={productdetail.pid}
                  />
                  <CardRowCol
                    lable="Weight (kg)"
                    value={productdetail.weight}
                  />
                  <CardRowCol lable="UOM" value={productdetail.uom || "-"} />
                  <CardRowCol
                    lable="Packet size"
                    value={productdetail.packetsize || "-"}
                  />
                </Col>
                <Col lg="4">
                  <CardRowCol lable="Brand" value={productdetail.brandname} />
                  <CardRowCol
                    lable="Short description"
                    value={productdetail.short_desc}
                  />
                  <CardRowCol
                    lable="Product details"
                    value={productdetail.productdetails}
                  />
                  
                  <CardRowCol lable="HSN code" value={productdetail.hsn_code} />
                  <CardRowCol lable="Tag" value={productdetail.tagname} />
                  <CardRowCol
                    lable="Perishable"
                    value={productdetail.Perishable?"No":"Yes"}
                  />
                  <CardRowCol
                    lable="Veg/Vegan/Non veg"
                    value={productdetail.vegtype===0?"Veg":productdetail.vegtype===1?"Non veg":"Vegan"}
                  />
                  <CardRowCol
                    lable="Targeted Base Price"
                    value={productdetail.targetedbaseprice}
                  />
                </Col>
                <Col lg="4">
                  <CardRowColImage
                    lable="Photograph"
                    value={productdetail.image}
                  />
                  <CardRowCol lable="MRP" value={productdetail.mrp} />
                  <CardRowCol lable="GST %" value={productdetail.gst} />
                  <CardRowCol
                    lable="Discount amount"
                    value={productdetail.discount_cost}
                  />
                  <CardRowCol
                    lable="Discounted amount"
                    value={productdetail.discountedamount}
                  />
                </Col>
              </Row>
              <Row className="mr-b-10">
                <Col></Col>
                <Col className="txt-align-right">
                {/* <Link to={`/product_edit/${productdetail.pid}`}><Button size="sm">Edit</Button></Link> */}
                  <Button size="sm" className="mr-l-10 mr-r-10" onClick={history.goBack}>
                    Back
                  </Button>
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
                <Row className="pd-0 mr-l-10 mr-r-10 mr-b-10">
                  {vendorlist.map((item, i) => (
                    <Col lg="4" className="pd-0">
                      <div className="fieldset">
                        <div className="legend">
                          {item.vendorname}-{item.vendorid}-
                          {Moment(item.expiry_date).format("DD/MM/YYYY")}
                        </div>
                        <Row className="pd-0 mr-l-10 pd-b-10">
                          <Col lg="11">
                            <CardRowColVendor
                              lable="Base Price"
                              value={item.base_price}
                            />
                            <CardRowColVendor
                              lable="Cost Price (Calculated field)"
                              value={item.cost_price}
                            />
                            <CardRowColVendor
                              lable="Other charges (%)"
                              value={item.other_charges}
                            />
                            {/* <Row>
                              <Col></Col>
                              <Col className="txt-align-right">
                                <Button size="sm" color="primary">
                                  Edit
                                </Button>
                              </Col>
                            </Row> */}
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
