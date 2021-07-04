import { Button, Popconfirm } from 'antd';
import React, { Component } from 'react';
import EditUser from './EditRow';
import {
    ToolOutlined,
    CloseOutlined,
} from "@ant-design/icons";
class TableDataRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            onEditUser: false
        }
    }
    componentDidMount() {
        if (this.props.data.noinfo) {
            this.setState({
                onEditUser: true
            })
        }
    }
    editClick = () => {
        this.setState({
            onEditUser: true
        })
    }
    onClickEditUser = () => {
        this.setState({
            onEditUser: !this.state.onEditUser
        })
    }
    onEdit = () => {

        if (this.state.onEditUser === true) {
            return (<tr className="ant-table-row ant-table-row-level-0">
                <td className="ant-table-cell" style={{ padding: '10px 0' }} colSpan="5"><EditUser guestTypeId={this.props.guestTypeId} list={this.props.list} delete={(e) => this.props.deleteClick(e)} listguesttype={this.props.listguesttype} edit={(info) => this.props.edit(info)} data={this.props.data} onClickEditUser={() => this.onClickEditUser()} /></td></tr>)
        }
        else
            return (
                <tr className="ant-table-row ant-table-row-level-0">
                    <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data ? this.props.data.name : null}</td>
                    <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data ? this.props.data.phone : null}</td>
                    <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data ? this.props.data.email : null}</td>
                    <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data ? this.props.data.guestTypeId.name : null}</td>
                    <td style={{ width: '20%' }} className="ant-table-cell">
                        <div className="btn-group">
                            <Button onClick={() => this.editClick()} className="add"><ToolOutlined /></Button>
                            <Popconfirm
                                title="Bạn có chắc muốn xóa chứ?"
                                onConfirm={() => this.props.deleteClick(this.props.data._id)}
                                okText="Đồng ý"
                                cancelText="Hủy"
                            >
                                {this.props.canDelete ? <Button className="back"><CloseOutlined /></Button> : null}
                            </Popconfirm>

                        </div>
                    </td>
                </tr>
            );
    }
    render() {
        return (this.onEdit()
        );
    }
}

export default TableDataRow;