import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow';
import Tooltip from '@material-ui/core/Tooltip';

class tablerow_phongduocsi extends Component {
    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }

    renderAction = () => {
        return (
            <td>
                <Tooltip title="Xem Đơn Thuốc" arrow>
                <Link className="link" to={`/phongduocsi/xemdonthuoc/${this.props.data._id}`} >
                    <div className="btn btn-link"><i className="fas fa-capsules" /></div>
                </Link>
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

export default tablerow_phongduocsi;