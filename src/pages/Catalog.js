import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ ...state.catalog });

const mapDispatchToProps = (dispatch) => ({

});

class Catalog extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {
    console.log("--componentWillMount-->");
  }
  componentWillUpdate() {
    console.log("--componentWillUpdate-->");
  }
  componentWillReceiveProps() {
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
    return <div></div>;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Catalog);
