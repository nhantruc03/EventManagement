import { Table } from 'antd';
import React, { Component } from 'react';
import {
    CheckCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';
class guestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    width: '20%',
                    render: (e) => <div className="btn-group">
                        {e ? <CheckCircleOutlined /> : <StopOutlined />}
                    </div>,
                },
            ],
            postsPerPage: 2
        }
    }
    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }
    renderView = () => {
        let temp = this.props.list.filter(e => e.guestTypeId._id === this.props.type)

        return temp.length > 0 ? <Table className="guest" rowKey="_id" showHeader={false} key={this.props.key} pagination={this.getlistpage(temp) > 1 ? { pageSize: this.state.postsPerPage } : false} dataSource={temp} columns={this.state.columns} /> : null;
    }
    render() {
        return (
            <div>
                {this.renderView()}
            </div>
        );
    }
}

export default guestView;