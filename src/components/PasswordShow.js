import React from 'react';
export default class PasswordShow extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            show: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            show: !prevState.show
        }));
    }

    render() {
        if (!this.props.password) return (<div></div>);
        if (this.state.show) {
            return (<div className='pass-toggle'>
                <span className='pass-txt'>{this.props.password}</span>
                <span className='pass-btn' onClick={this.toggle}>Hide</span>
            </div>);
        } else {
            return (<div className='pass-toggle'>
                <span className='pass-txt'>******</span>
                <span className='pass-btn' onClick={this.toggle}>Show</span>
            </div>);
        }
    }
}
