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
            ],
            postsPerPage: 2
        }
    }
    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }
    renderView = () => {
        let temp = this.props.list.filter(e => e.guestTypeName === this.props.type)
        temp.forEach(e => {
            e.key = e.id
        });
        console.log(temp)
        return <Table pagination={this.getlistpage(temp) > 1 ? { pageSize: this.state.postsPerPage } : false} dataSource={temp} columns={this.state.columns} />;
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