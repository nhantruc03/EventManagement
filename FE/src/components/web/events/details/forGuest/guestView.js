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
                    render: (e) => e ? <CheckCircleOutlined /> : <StopOutlined />,
                },
            ]
        }
    }
    renderView = () => {
        let temp = this.props.list.filter(e => e.guestTypeId._id === this.props.type)
        temp.forEach(e => {
            e.key = e._id
        });
        return <Table key={this.props.key} pagination={{ pageSize: 5 }} dataSource={temp} columns={this.state.columns} />;
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