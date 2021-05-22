import { Button, Popconfirm, Tooltip } from 'antd';
import React, { Component } from 'react';
import {
    DeleteOutlined,
} from '@ant-design/icons';
class resourceCard extends Component {



    renderIcon = () => {
        switch (this.props.data.extension) {
            case 'doc': case 'docx':
                return (
                    <img style={{ maxWidth: '30px' }} alt="icon" src='/word-icon.png'></img>
                )
            case 'pdf':
                return (
                    <img style={{ maxWidth: '30px' }} alt="icon" src="/pdf-icon.png"></img>
                )
            case 'png':
                return (
                    <img style={{ maxWidth: '30px' }} alt="icon" src={`/api/resources/${this.props.resourcePath}/${this.props.data.url}`}></img>
                )
            default:
                return (null)
        }
    }
    render() {
        return (
            <div className="flex-container-row resource-card">
                {this.renderIcon()}
                <Tooltip title={this.props.data.url} placement="top" >
                    <a className="cut-text" target="_blank" rel="noreferrer" href={`/api/resources/${this.props.resourcePath}/${this.props.data.url}`} style={{ marginLeft: '10px' }} >{this.props.data.url}</a>
                </Tooltip>
                <Popconfirm
                    title="Bạn có chắc muốn xóa chứ?"
                    onConfirm={() => this.props.delete(this.props.data._id)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                >
                    <Button className="flex-row-item-right no-border"><DeleteOutlined /></Button>
                </Popconfirm>

            </div>
        );
    }
}

export default resourceCard;