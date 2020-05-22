import React from 'react'
import ReactAutocomplete from 'react-autocomplete'
class AutoCompleteInput extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        value: '',
      }
    }
    

    componentWillMount() {
    }
  
    render() {
      return (
        <ReactAutocomplete placeholder='Add Item'
          items={this.props.Items}
          shouldItemRender={(item, value) => item.menuitem_name.toLowerCase().indexOf(value.toLowerCase()) > -1}
          getItemValue={item => item.menuitem_name}
          renderItem={(item, highlighted) =>
            <div
              key={item.menuitemid}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
            >
              {item.menuitem_name}
            </div>
          }
          value={this.state.value}
          onChange={e => this.setState({ value: e.target.value })}
          onSelect={(value, item) => {
            this.setState({ value:'' })
            this.props.addItem(item);
          }}
        />
      )
    }
  }

  
export default AutoCompleteInput;