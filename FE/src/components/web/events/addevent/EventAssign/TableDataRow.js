import { Button } from 'antd';
import React, { Component } from 'react';
import EditUser from './EditUser';

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
            return (<tr>
                <td colSpan="5"><EditUser listRole={this.props.listRole} listFaculty={this.props.listFaculty} getUserEditInfo={(info) => this.props.getUserEditInfo(info)} userEditObject={this.props.data} onClickEditUser={() => this.onClickEditUser()} /></td></tr>)
        }
        else
            return (<tr className="ant-table-row ant-table-row-level-0">
                <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data.userId.name}</td>
                {/* <td>{this.props.data.userId.phone}</td> */}
                <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data.userId.email}</td>
                <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data.facultyId ? this.props.data.facultyId.name : null}</td>
                <td style={{ width: '20%' }} className="ant-table-cell">{this.props.data.roleId ? this.props.data.roleId.name : null}</td>
                <td style={{ width: '20%' }} className="ant-table-cell">
                    <div className="btn-group">
                        {this.props.canDelete ? <Button onClick={() => this.props.deleteClick(this.props.data._id)} className="back">Xóa</Button> : null}
                        <Button onClick={() => this.editClick()} className="add">Sửa</Button>
                    </div>
                </td>
            </tr>);
    }
    render() {
        return (this.onEdit()
        );
    }
}

export default TableDataRow;