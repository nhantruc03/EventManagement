import { Table } from 'antd';
import React, { Component } from 'react';

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
                    title: 'Điện thoại',
                    dataIndex: 'phone',
                    key: 'phone',
                },
                {
                    title: 'Email',
                    dataIndex: 'email',
                    key: 'email',
                },
            ]
        }
    }
    renderView = () => {
        let temp = this.props.list.filter(e => e.guestTypeName === this.props.type)
        temp.forEach(e => {
            e.key = e.id
        });
        console.log(temp)
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