import { Table } from 'antd';
import React, { Component } from 'react';
import Search from '../helper/search';
import moment from 'moment'
import Title from 'antd/lib/typography/Title';
class table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsTable: [
                {
                    title: 'Tên tệp đính kèm', dataIndex: '', key: 'x',
                    render: (e) => {
                        return (
                            <a className="cut-text" target="_blank" rel="noreferrer" href={`/api/resources/${e.actionId}/${e.url}`} >
                                {e.url.slice(14, e.url.length)}
                            </a>
                        )
                    }
                },
                {
                    title: 'Người đăng', dataIndex: '', key: 'y',
                    render: (e) => {
                        return (
                            e.userId.name
                        )
                    }
                },
                {
                    title: 'Ngày đăng', dataIndex: 'createdAt', key: 'createdAt',
                    render: (e) => {
                        return moment(e).format('DD/MM/YYYY')
                    }
                },
            ],
            SearchData: [],
            postsPerPage: 4
        }
    }

    UNSAFE_componentWillUpdate(e) {
        if (e.data !== this.props.data) {
            this.setState({
                SearchData: e.data
            })
        }
    }

    componentDidMount() {
        this.setState({
            SearchData: this.props.data,
        })
    }

    getSearchData = (data) => {
        this.setState({
            SearchData: data
        })
    }

    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }
    render() {
        return (
            <div style={{ marginTop: '20px' }}>
                <div className="flex-container-row" style={{ marginBottom: 20 }}>
                    <Title level={3}>Tài nguyên</Title>
                    <div className="flex-row-item-right">
                        <Search target={"url"} data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    </div>
                </div>
                <Table
                    rowKey={"_id"}
                    pagination={this.getlistpage(this.state.SearchData) > 1 ? { pageSize: this.state.postsPerPage } : false}
                    columns={this.state.columnsTable}
                    dataSource={this.state.SearchData}
                />
            </div>
        );
    }
}

export default table;