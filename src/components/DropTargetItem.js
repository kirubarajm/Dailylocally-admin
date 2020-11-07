import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import { IoIosUndo } from "react-icons/io";
import React from "react";

export default class DropTargetItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { thankYouMessage: "", image: "", item: "", ele: null };
  }

  UNSAFE_componentWillMount() {
    console.log("--DragWillMount-->", this.props.image);
    this.state = { image: this.props.image, item: this.props.defult_item };
  }
  undo = (e) => {
    this.props.onDropItem(this.state.item);
    this.state.ele.style.visibility = "visible";
    this.setState({
      ele: e.containerElem,
      image: "",
      item: "",
    });
  };
  dropped = (e) => {
    e.containerElem.style.visibility = "hidden";
    this.setState({
      ele: e.containerElem,
      image: e.dragData.image,
      item: e.dragData.item,
    });
    var it = e.dragData.item;
    it.index = this.props.index;
    this.props.dragArray(it);
    console.log({ "onHit event passed to target animal:": e });
  };

  render() {
    return this.state.image ? (
      <div style={{position:"relative"}}>
        <button
          onClick={this.undo}
          className="undo-btn"
          hidden={this.props.undo_hidden}
        >
          <IoIosUndo />
        </button>
        <img
          width={this.state.item.tile_type === 1 ? "138px" : "286px"}
          height={this.state.item.tile_type === 1 ? "200px" : "150px"}
          style={{
            margin: "5px",
            borderRadius: "10px",
            border: "2px white solid",
          }}
          src={this.state.image}
        ></img>
      </div>
    ) : (
      <DropTarget
        onHit={this.dropped}
        targetKey={this.props.targetKey}
        dropData={{ name: this.props.name }}
      >
        <div className="animal">
          <div
            style={{
              width: this.props.citem.tile_type === 1 ? "138px" : "286px",
              height: this.props.citem.tile_type === 1 ? "200px" : "150px",
              margin: "5px",
              borderRadius: "10px",
              border: this.state.image ? "2px white solid" : "2px black solid",
            }}
          >
            {this.state.image ? (
              <img
                width={this.state.item.tile_type === 1 ? "138px" : "286px"}
                height={this.state.item.tile_type === 1 ? "200px" : "150px"}
                style={{
                  borderRadius: "10px",
                  border: "2px white solid",
                }}
                src={this.state.image}
              ></img>
            ) : (
              <div></div>
            )}
          </div>
        </div>
      </DropTarget>
    );
  }
}
