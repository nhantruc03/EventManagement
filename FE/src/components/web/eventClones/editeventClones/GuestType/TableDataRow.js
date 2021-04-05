import { Button } from 'antd';
import React, { Component } from 'react';
import EditUser from './EditRow';

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
            return (
                <tr className="ant-table-row ant-table-row-level-0">
                    <td className="ant-table-cell">{this.props.data.name}</td>
                    <td className="ant-table-cell">
                        <div className="btn-group">
                            {this.props.canDelete ? <Button onClick={() => this.props.deleteClick(this.props.data._id)} className="back">Xóa</Button> : null}
                            <Button onClick={() => this.editClick()} className="add">Sửa</Button>
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