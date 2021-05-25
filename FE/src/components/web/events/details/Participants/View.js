import { Table } from 'antd';
import React, { Component } from 'react';
class View extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                {
                    title: 'Tên',
                    dataIndex: 'mssv',
                    key: 'mssv',
                },
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    key: 'name',
                },
            ],
            postsPerPage: 5
        }
    }
    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }
    renderView = () => {
        let temp = this.props.list

        return temp?.length > 0 ? <Table className="guest" rowKey="_id" showHeader={false} key={this.props.key} pagination={this.getlistpage(temp) > 1 ? { pageSize: this.state.postsPerPage } : false} dataSource={temp} columns={this.state.columns} /> : null;
    }
    render() {
        return (
            <div>
                {this.renderView()}
            </div>
        );
    }
}

export default View;