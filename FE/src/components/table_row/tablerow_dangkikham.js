import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow';
import Tooltip from '@material-ui/core/Tooltip';

class tablerow_dangkikham extends Component {
    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }
    renderAction = () => {
        return (
            <td>
                <div className="btn-group">
                    <Tooltip title="Đăng ký khám chuyên khoa" arrow>
                        <Link className="link" to={`/dangkikhamchuyenkhoa/${this.props.data._id}`} >
                            <button className="btn btn-link" >
                                <i className="fas fa-stethoscope" /></button>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Đăng ký dịch vụ" arrow>
                        <Link className="link" to={`/dangkidichvu/${this.props.data._id}`} >
                            <button className="btn btn-link" ><i className="fa fa-pager" /></button>
                        </Link>
                    </Tooltip>
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

export default tablerow_dangkikham;