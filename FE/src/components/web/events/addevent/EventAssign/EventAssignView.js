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
                    title: 'MSSV',
                    dataIndex: 'userId',
                    key: 'userId',
                    render: (e) => <div>{e.mssv}</div>
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
            ],
            postsPerPage: 2
        }
    }
    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }

    renderView = () => {
        let temp = this.props.data
        temp.forEach(e => {
            e.key = e.userId._id
        });
        if (temp.length > 0) {
            return <Table pagination={this.getlistpage(temp) > 1 ? { pageSize: this.state.postsPerPage } : false} dataSource={temp} columns={this.state.columns} />;
        }else{
            return null
        }

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