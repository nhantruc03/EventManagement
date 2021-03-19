import React, { Component } from 'react';

class pagelogin extends Component {
    render() {
        return (
            <React.Fragment>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default pagelogin;