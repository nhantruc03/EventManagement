import React, { Component } from 'react';
import { render } from '../service/renderTableRow';
import Tooltip from '@material-ui/core/Tooltip';

class tablerow_taodonthuoc extends Component {
    addClick = () => {
        this.props.add(this.props.data)
    }

    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }

    renderAction = () => {
        return (
            <td>
                <Tooltip title="Thêm thuốc" arrow>
                <div className="btn-group">
                    <div onClick={() => this.addClick()} className="btn btn-link"><i className="fas fa-plus" /></div>
                </div>
                </Tooltip>
            </td>
        )
    }

    render() {
        return (

            <tr style={{ textAlign: "center" }}>
                { this.renderData()}

                {this.renderAction()}

            </tr >
        );
    }
}

export default tablerow_taodonthuoc;