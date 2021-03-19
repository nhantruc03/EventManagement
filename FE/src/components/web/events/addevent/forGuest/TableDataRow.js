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
                <td className="ant-table-cell" colSpan="5"><EditUser list={this.props.list} delete={(e)=>this.props.deleteClick(e)} listguesttype={this.props.listguesttype} getUserEditInfo={(info) => this.props.getUserEditInfo(info)} userEditObject={this.props.data} onClickEditUser={() => this.onClickEditUser()} /></td></tr>)
        }
        else
            return (
            <tr className="ant-table-row ant-table-row-level-0">
                <td className="ant-table-cell">{this.props.data.name}</td>
                <td className="ant-table-cell">{this.props.data.phone}</td>
                <td className="ant-table-cell">{this.props.data.email}</td>
                <td className="ant-table-cell">{this.props.data.guestTypeName}</td>
                <td className="ant-table-cell">
                    <div className="btn-group">
                        <div onClick={() => this.editClick()} className="btn btn-warning sua"><i className="fa fa-edit" />Sửa</div>
                        <div onClick={() => this.props.deleteClick(this.props.data.id)} className="btn btn-danger xoa"> <i className="fa fa-remove" />Xóa</div>
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