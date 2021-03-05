import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow';
import Tooltip from '@material-ui/core/Tooltip';

class tablerow_hosobenhnhan extends Component {
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
                        <Tooltip title='Xem hồ sơ khám bệnh' arrow>
                        <Link className="link" to={`/danhsachhosokhambenh/${this.props.data._id}`} >
                            <div className="btn btn-link"><i className="fa fa-eye" /></div>
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

export default tablerow_hosobenhnhan;