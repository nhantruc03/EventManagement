import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow';
import Tooltip from '@material-ui/core/Tooltip';
class tablerow_hoadonkham extends Component {
    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }
    renderAction = () => {
        return (
            <td>
                <div className="btn-group">
                    <Tooltip title="Xem hóa đơn khám bệnh" arrow>
                        <Link className="link" to={`/xemhoadon/${this.props.data._id}`} >
                            <button className="btn btn-link" data-toggle="tooltip" data-placement="top" title="Xem hóa đơn khám bệnh"><i className="fa fa-file-invoice-dollar"></i></button>
                        </Link>
                    </Tooltip>
                </div>
            </td>
        )
    }

    render() {
        return (

            <tr style={{ textAlign: "center" }}>
                { this.renderData()}
                { this.renderAction()}
            </tr >
        );
    }
}

export default tablerow_hoadonkham;