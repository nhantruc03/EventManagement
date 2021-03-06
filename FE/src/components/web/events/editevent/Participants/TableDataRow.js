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
    onClickEdit = () => {
        this.setState({
            onEditUser: !this.state.onEditUser
        })
    }
    onEdit = () => {

        if (this.state.onEditUser === true) {
            return (
                <tr>
                    <td colSpan="5"><EditUser edit={(info) => this.props.edit(info)} data={this.props.data} onClickEdit={() => this.onClickEdit()} /></td>
                </tr>
            )
        }
        else
            if (this.props.canEdit) {
                return (
                    <tr className="ant-table-row ant-table-row-level-0">
                        <td style={{ width: `20%` }} className="ant-table-cell">{this.props.data.mssv}</td>
                        <td style={{ width: `20%` }} className="ant-table-cell">{this.props.data.name}</td>
                        <td style={{ width: `20%` }} className="ant-table-cell">{this.props.data.phone}</td>
                        <td style={{ width: `20%` }} className="ant-table-cell">{this.props.data.email}</td>
                        <td style={{ width: `20%` }} className="ant-table-cell">
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
            else {
                return (
                    <tr className="ant-table-row ant-table-row-level-0">
                        <td style={{ width: `25%` }} className="ant-table-cell">{this.props.data.mssv}</td>
                        <td style={{ width: `25%` }} className="ant-table-cell">{this.props.data.name}</td>
                        <td style={{ width: `25%` }} className="ant-table-cell">{this.props.data.phone}</td>
                        <td style={{ width: `25%` }} className="ant-table-cell">{this.props.data.email}</td>
                    </tr>
                );
            }

    }
    render() {
        return (this.onEdit()
        );
    }
}

export default TableDataRow;