import React from 'react';

class ItemIncrementButton extends React.Component {

  componentWillMount() {
  }

  render() {
    return (
      <div className="inc_dec_button">
          <span className="dec" onClick={this.props.down(this.props.item)}>-</span>
          <span className="count">{this.props.item.cartquantity}</span>
          <span className="inc" onClick={this.props.up(this.props.item)}>+</span>
      </div>
    );
  };
}

export default ItemIncrementButton;