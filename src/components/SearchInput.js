import React, { Component } from "react";
import { MdSearch } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { Field, reduxForm } from "redux-form";
import { SEARCH_INPUT } from "../utils/constant";
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
      <span className="input-icon">
        <MdSearch
          size="25"
          className="cr-search-form__icon-search text-secondary"
        />{" "}
      </span>
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
      <span className="input-icon">
        <IoIosClose
          size="30"
          className="cr-search-form__icon-close txt-cursor pd-4 text-secondary"
          hidden={input.value.length === 0}
          onClick={onClose}
        />{" "}
      </span>
    </div>
  );
};

class SearchInput extends Component {
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
  componentDidUpdate(nextProps, nextState) {}

  handleInputChange = (e) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      e.preventDefault();
      e.stopPropagation();
      //console.log("--->",e.target.value)
      if(this.props.onSearch) this.props.onSearch(e);
    }
  };
  handleUp = (e) => {
    const value = e.target.value || "";
    //console.log("--->",value)
    this.setState({ query: value });
    if (value === "") {
      if(this.props.onSearch) this.props.onSearch(e);
    }
  };
  onClose = (e) => {
    if(this.props.onClose) this.props.onClose(e);
    var initData = { search: ""};
    this.props.initialize(initData);
  };

  render() {
    const placeholder = this.props.placeholder || "Search...";
    return (
      <div className="cr-search-form">
        <form>
          <Field
            name="search"
            type="text"
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

SearchInput = reduxForm({
  form: SEARCH_INPUT,
  enableReinitialize: true, // a unique identifier for this form
})(SearchInput);

export default SearchInput;
//export default SearchInput
