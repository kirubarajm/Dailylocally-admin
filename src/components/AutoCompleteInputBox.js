import React from 'react'
import ReactAutocomplete from 'react-autocomplete'
class AutoCompleteInputBox extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        value: '',
      }
    }
    componentWillMount() {
    }
    render() {
      var placeholder= this.props.placeholder ||""
      var Items = this.props.Items || []
      return (
        <ReactAutocomplete placeholder={placeholder}
          items={Items}
          shouldItemRender={(item, value) => item.name?item.name.toLowerCase().indexOf(value.toLowerCase()) > -1:false}
          getItemValue={item => item.name}
          renderItem={(item, highlighted) =>
            <div
              key={item.id}
              style={{ backgroundColor: highlighted ? '#eee' : 'transparent'}}
            >
              {item.name}
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

  
export default AutoCompleteInputBox;