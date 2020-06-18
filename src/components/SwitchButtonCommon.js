import React, { Component } from "react";
import Switch from "react-switch";
 
export default class SwitchButtonCommon extends Component {
  constructor() {
    super();
    //this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }
 
  handleChange() {
    this.props.handleSwitchChange();
  }
  handleClick(){
    this.props.handleClick();
  }
 
  render() {
    return (
      <div style={{width:"30px",float:"right"}}>
      <Switch onChange={this.handleChange} onClick={this.handleClick} checked={this.props.checked} height={15} width={30}/>
      </div>
    );
  }
}