import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import React from "react";

export default class DragDropItem extends React.Component {
  landedOn(e) {
    console.log("I was dropped on " + e.dropData.name);
    console.log({ "onDrop event passed back to Food": e });
  }

  render() {
    var item = this.props.item;
    var dragable = this.props.dragable;
    // note use of render prop below, rather than child element
    return (
      <DragDropContainer
        targetKey={this.props.targetKey}
        noDragging={dragable}
        dragClone={this.props.dragClone || false}
        dragData={{ label: item.name, image: item.image ,item:item}}
        customDragElement={this.props.customDragElement}
        onDrop={this.landedOn}
        render={() => {
          return (
            <div>
              {item.tile_type === 1 ? (
                <img
                  src={item.image}
                  height={200}
                  width={138}
                  style={{
                    margin: "5px",
                    borderRadius: "10px",
                    border: "2px white solid",
                  }}
                />
              ) : (
                <img
                  src={item.image}
                  height={150}
                  width={286}
                  style={{
                    margin: "5px",
                    borderRadius: "10px",
                    border: "2px white solid",
                  }}
                />
              )}
            </div>
          );
        }}
      />
    );
  }
}
