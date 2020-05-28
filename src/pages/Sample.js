import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state) => ({ ...state.sample });

const mapDispatchToProps = (dispatch) => ({});

class Sample extends React.Component {
  constructor() {
    super();
  }

  componentWillMount() {}
  componentWillUpdate() {}
  componentWillReceiveProps() {}
  componentWillUnmount() {}

  componentDidMount() {}
  componentDidUpdate(nextProps, nextState) {}
  componentDidCatch() {}

  
  render() {
    return <div></div>;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Sample);
