import React, { Component } from "react";
import Switch from "react-switch";
 
export default class SwitchButtonCommon extends Component {
  constructor() {
    super();
    //this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange() {
   // this.setState({ checked });
    this.props.handleSwitchChange();
  }
 
  render() {
    return (
      <div className='txt-align-center'>
      <Switch onChange={this.handleChange} checked={this.props.checked} height={15} width={30}/>
      </div>
    );
  }
}