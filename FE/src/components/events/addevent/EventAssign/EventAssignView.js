import { Table } from 'antd';
import React, { Component } from 'react';

class guestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Tên',
                    dataIndex: 'userId',
                    key: 'userId',
                    render: (e) => <div>{e.name}</div>
                },
                {
                    title: 'Ban',
                    dataIndex: 'facultyId',
                    key: 'facultyId',
                    render: (e) => <div>{e.name}</div>
                },
                {
                    title: 'Vị trí',
                    dataIndex: 'roleId',
                    key: 'roleId',
                    render: (e) => <div>{e.name}</div>
                },
            ]
        }
    }
    renderView = () => {
        let temp = this.props.data
        temp.forEach(e => {
            e.key = e.userId._id
        });
        return <Table pagination={{ pageSize: 5 }} dataSource={temp} columns={this.state.columns} />;
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