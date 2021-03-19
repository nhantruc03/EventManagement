import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { render } from '../service/renderTableRow';

class tablerow_ketquachuyenkhoa extends Component {
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
                        <Link className="link" to={`/khamdakhoa/chitietchuyenkhoa/${this.props.data._id}`} >
                            <div className="btn btn-link" ><i className="fa fa-eye"/>Xem kết quả</div>
                        </Link>
                    
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

export default tablerow_ketquachuyenkhoa;