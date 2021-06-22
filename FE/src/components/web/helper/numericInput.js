import React, { Component } from 'react';
import { Input } from 'antd';

class numeric_input extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: ''
        }
    }
    Check = (e) => {
        const { value } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;

        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.props.onChange(value);
            this.setState({
                data: value
            })
        } else {
            if(this.state.data === ''){
                this.props.onChange('')
            }
        }
    };

    render() {
        return (
            <Input
                {...this.props}
                onChange={this.Check}
                placeholder={this.props.placeholder}
                maxLength={25}
            />
        );
    }
}

export default numeric_input;