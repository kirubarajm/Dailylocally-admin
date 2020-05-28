import React from "react";
import { connect } from "react-redux";
import AxiosRequest from "../AxiosRequest";
import { CATELOG_CATEGORY_LIST } from "../constants/actionTypes";
import { Row, Col, ButtonGroup, Button } from "reactstrap";

const mapStateToProps = (state) => ({ ...state.catalog });

const mapDispatchToProps = (dispatch) => ({
  onGetCategory: (data) =>
    dispatch({
      type: CATELOG_CATEGORY_LIST,
      payload: AxiosRequest.Catelog.getCategory(data),
    }),
});

class Catalog extends React.Component {
  constructor() {
    super();
    this.state={catalog_tab_type:0}
  }

  UNSAFE_componentWillMount() {
    console.log("--componentWillMount-->");
  }
  UNSAFE_componentWillUpdate() {
    console.log("--componentWillUpdate-->");
  }
  UNSAFE_componentWillReceiveProps() {
    console.log("--componentWillReceiveProps-->");
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

  render() {
    return (
      <div>
        <div className="pd-12">
          <Row>
            <Col>
              <ButtonGroup size="sm">
                <Button>Catalog View</Button>
                <Button>Catalog Edit</Button>
              </ButtonGroup>
            </Col>
            <Col className="float-right"></Col>
          </Row>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
