import React, { Component } from 'react'

const Suggestions = (props) => {
    const options = props.results.map(r => (
      <li key={r.regionid}>
        {r.regionname}
      </li>
    ))
    return <ul>{options}</ul>
  }

class Search extends Component {
  state = {
    query: '',
    currentList: [],
    results:[],
    isLoad:false
  }
  
  UNSAFE_componentWillMount(){
    this.setState({results:this.props.List});
    this.handleInputChange=this.handleInputChange.bind(this);
  }
  componentDidUpdate(nextProps, nextState) {
      console.log(nextProps +"==nextProps==="+nextState);
      if(!this.state.isLoad&&this.props.List.length>0){
         this.setState({results:this.props.List,isLoad:true});
      }
      
  }

  getInfo = () => {
    var updatedList = this.state.currentList;
    updatedList = updatedList.filter(function(item){
      return item.toLowerCase().search(
        this.state.query.toLowerCase()) !== -1;
    });
    this.setState({
        results: updatedList
      });
  }

  handleInputChange=(e)=>{
    this.setState({
      query: e.target.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
          this.getInfo()
      } else if (!this.state.query) {
      }
    })
  }

  render() {
    return (
      <form>
        <div>
        <input {...this.props.input} placeholder={this.props.label} type={this.props.type} onChange={this.handleInputChange}/>
        {this.props.touched &&
          ((this.props.error && <span>{this.props.error}</span>) ||
            (this.props.warning && <span>{this.props.warning}</span>))}
      </div>
        <Suggestions results={this.state.results} />
      </form>
    )
  }
}

export default Search