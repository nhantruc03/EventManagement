import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { render } from '../service/renderTableRow';
import { AUTH } from '../env';
import Tooltip from '@material-ui/core/Tooltip';
class tablerow_khamdakhoa extends Component {
    deleteClick = () => {
        Axios.delete(this.props.deleteUrl)
            .then((res) => {
                console.log(res.data);
            })
        this.props.onDelete(this.props.data._id);
    }

    renderData = () => {
        return (
            render(this.props.keydata, this.props.data)
        )
    }

    onComplete = async () => {
        await Axios.delete('/api/departments/' + this.props.departmentId + '/remove-patient/' + this.props.data._id, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })

        this.props.onDelete(this.props.data._id);
    }

    renderAction = () => {
        if (!this.props.noaction) {
            return (
                <td>
                    <div className="btn-group">
                        <Tooltip title='Xem hồ sơ' arrow>
                            <Link className="link" to={`/xemhoso/${this.props.data._id}`} >
                                <div className="btn btn-link"><i className="fas fa-user" /></div>
                            </Link>
                        </Tooltip>
                        <Tooltip title='Danh sách khám chuyên khoa' arrow>
                            <Link className="link" to={`/khamdakhoa/danhsachketquachuyenkhoa/${this.props.data._id}`} >
                                <div className="btn btn-link"><i className="fa fa-list" /></div>
                            </Link>
                        </Tooltip>
                        <Tooltip title='Tạo đơn thuốc'>
                            <Link className="link" to={`/khamdakhoa/taodonthuoc/${this.props.data._id}`} >
                                <div className="btn btn-link"><i className="fas fa-pills" /></div>
                            </Link>
                        </Tooltip>
                        <Tooltip title='Xem đơn thuốc'>
                            <Link className="link" to={`/xemdonthuocbs/${this.props.data._id}`} >
                                <div className="btn btn-link"><i className="fa fa-eye" /></div>
                            </Link>
                        </Tooltip>
                        <Tooltip title='Hoàn thành khám bệnh' arrow>
                            <div onClick={() => this.onComplete()} className="btn btn-link"><i className="fa fa-check" style={{ color: 'green' }} /></div>
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

export default tablerow_khamdakhoa;