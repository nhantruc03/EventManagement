import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow';
import Tooltip from '@material-ui/core/Tooltip';

class tablerow_hosokhambenh extends Component {
    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }

    renderAction = () => {
        if (this.props.noaction) {

        } else {
            return (
                <td>
                    <div className="btn-group">
                        <Tooltip title="Chi tiết khám bệnh" arrow>
                        <Link className="link" to={`/danhsachchitietkhambenh/${this.props.data._id}`} >
                            <div className="btn btn-link"><i className="fas fa-info-circle" /></div>
                        </Link>
                        </Tooltip>
                    </div>
                </td>
            )
        }
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

export default tablerow_hosokhambenh;