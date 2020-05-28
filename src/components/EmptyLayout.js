import { Content } from '../components';
import React from 'react';
class EmptyLayout extends React.Component {
//const EmptyLayout = ({ children, ...restProps }) => (
  // close sidebar when
  handleContentClick = event => {
    // close sidebar if sidebar is open and screen size is less than `md`
    
  };
  
  render(){
    const { children } = this.props;
  return(<main className="cr-app">
    <Content fluid onClick={this.handleContentClick}>
      {children}
    </Content>
  </main>);
  }

}

export default EmptyLayout;
