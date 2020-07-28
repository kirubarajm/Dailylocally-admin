import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import { SEARCH_TRIP } from "../utils/constant";
const searchInputField = ({
  input,
  placeholder,
  type,
  onkeydown,
  onkeyup,
  onClose,
}) => {
  return (
    <div className="input-icon-wrap">
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        autoComplete="off"
        onWheel={(event) => {
          event.stopPropagation();
        }}
        onKeyDown={onkeydown}
        onKeyUp={onkeyup}
      />
    </div>
  );
};

class SearchTrip extends Component {
  state = {
    query: "",
  };
  UNSAFE_componentWillMount() {
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUp = this.handleUp.bind(this);
  }
  componentDidMount() {
    console.log("this.props.value-->", this.props.value);
    if (this.props.value) {
      this.setState({ query: this.props.value });
      var initData = { search: this.props.value };
      this.props.initialize(initData);
    }
  }
  componentDidUpdate(nextProps, nextState) {
    if(this.props.isRefresh){
      this.setState({ query: "" });
      var initData = { search: "" };
      this.props.initialize(initData);
      if(this.props.onRefreshUpdate)this.props.onRefreshUpdate();
    }
  }

  handleInputChange = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      if(this.props.onSearch) this.props.onSearch(e);
    }
  };
  handleUp = (e) => {
    const value = e.target.value || "";
    //console.log("--->",value)
    this.setState({ query: value });
    //if (value === "") {
      if(this.props.onSearch) this.props.onSearch(e);
    //}
  };
  onClose = (e) => {
    if(this.props.onClose) this.props.onClose(e);
    var initData = { search: ""};
    this.props.initialize(initData);
  };

  render() {
    const placeholder = this.props.placeholder || " Search...";
    const type = this.props.type || "text";
    return (
      <div className="cr-search-form width-200">
        <form>
          <Field
            name="search"
            type={type}
            component={searchInputField}
            placeholder={placeholder}
            onkeydown={this.handleInputChange}
            onkeyup={this.handleUp}
            onClose={this.onClose}
          />
        </form>
      </div>
    );
  }
}

SearchTrip = reduxForm({
  form: SEARCH_TRIP,
  enableReinitialize: true, // a unique identifier for this form
})(SearchTrip);

export default SearchTrip;
//export default SearchInput
