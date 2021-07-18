import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { render } from '../service/renderTableRow';
import { AUTH } from '../env'
import Tooltip from '@material-ui/core/Tooltip';
import { trackPromise } from 'react-promise-tracker';
class TableDataRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectUrl: ''
        }
    }

    onAction = () => {
        this.setState({
            onAction: true
        })
    }

    deleteClick = async () => {
        await trackPromise(Axios.delete("/api/" + this.props.obj + "/" + this.props.data._id, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then((res) => {
                console.log(res.data);
            }))
        this.props.onDelete(this.props.data._id);
    }

    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }

    renderAction = () => {
        if (this.props.noaction) {

        } else {
            return (
                <td className="ant-table-cell">
                    <div className="btn-group">
                        <Tooltip title="Chỉnh sửa" arrow>
                            <Link className="link" to={`/edit${this.props.obj}/${this.props.data._id}`} >
                                <div className="btn btn-link"><i className="fa fa-edit" /></div>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Xóa" arrow>
                            <div onClick={() => this.deleteClick()} className="btn btn-link" style={{ color: 'red' }}> <i className="fa fa-trash-alt" /></div>
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

export default TableDataRow;