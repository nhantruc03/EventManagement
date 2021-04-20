import { Button, Select } from 'antd';
import React, { Component } from 'react';
import EditUser from './EditUser';
import {
    ToolOutlined,
    CloseOutlined,
} from "@ant-design/icons";
const { Option } = Select;
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


    renderSelect = (state) => {
        return (
            <Select
                disabled={!state}
                value={this.props.data.credentialsId}
                maxTagCount={1}
                mode="multiple"
                allowClear
                style={{ width: '90%' }}
                placeholder="Chọn quyền..."
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
            >
                {this.props.listCredentials.map((e) => <Option key={e._id}>{e.name}</Option>)}
            </Select>
        )
    }

    onEdit = () => {

        if (this.state.onEditUser === true) {
            return (<tr>
                <td colSpan="6"><EditUser listCredentials={this.props.listCredentials} getUserEditInfo={(info) => this.props.getUserEditInfo(info)} userEditObject={this.props.data} onClickEditUser={() => this.onClickEditUser()} /></td></tr>)
        }
        else
            return (<tr className="ant-table-row ant-table-row-level-0">
                <td style={{ width: `20%` }} className="ant-table-cell">{this.props.data.userId.name}</td>
                <td style={{ width: `20%` }} className="ant-table-cell">{this.props.data.userId.mssv}</td>
                <td style={{ width: `40%` }} className="ant-table-cell">{this.renderSelect(false)}</td>
                <td style={{ width: `20%` }} className="ant-table-cell">
                    <div className="btn-group">
                        <Button onClick={() => this.editClick()} className="add"><ToolOutlined /></Button>
                        {this.props.canDelete ? <Button onClick={() => this.props.deleteClick(this.props.data._id)} className="add"><CloseOutlined /></Button> : null}
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