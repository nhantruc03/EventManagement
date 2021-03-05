import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow'
import Tooltip from '@material-ui/core/Tooltip';

class tablerow_chonphongkham extends Component {
    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }

    renderAction = () => {
        return (
            <td>
                <div className="btn-group">
                    <Tooltip title="Xem danh sách" arrow>
                        <Link className="link" to={`/departments-queue/${this.props.data._id}`} >
                            <button className="btn btn-link" ><i className="fas fa-list" /></button>
                        </Link>
                    </Tooltip>
                    <Tooltip title="Vào phòng" arrow>
                        <Link className="link" to={`/${this.props.obj}/${this.props.data._id}`} >
                            <button className="btn btn-link" ><i className="fas fa-door-open" /></button>
                            
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

                {this.renderAction()}

            </tr >
        );
    }
}

export default tablerow_chonphongkham;