import React from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";

const mapStateToProps = (state) => ({ ...state.sample });

const mapDispatchToProps = (dispatch) => ({});

class Procurement extends React.Component {
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
    return (
      <div className="width-full">
        <div style={{ height: "85vh" }} className="pd-6">
          <div className="fieldset">
            <div className="legend">Procurement - Search</div>
              <Row className="pd-0 mr-l-10 mr-r-10">
                <Col></Col>
                <Col></Col>
                <Col></Col>
              </Row>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Procurement);
