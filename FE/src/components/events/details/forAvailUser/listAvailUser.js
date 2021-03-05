import { Table } from 'antd';
import React, { Component } from 'react';
import Search from '../../../helper/search';

class listAvailUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsTable1: [
                { title: 'Tên', dataIndex: 'name', key: 'name' },
                { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
            ],
            SearchData1: [],
            data: []
        }
    }

    componentDidMount() {
        let temp_listusers = this.props.listusers.map(obj => ({ ...obj, key: obj._id }))
        this.setState({
            data: temp_listusers,
            SearchData1: temp_listusers,
        })
    }

    getSearchData1 = (data) => {
        this.setState({
            SearchData1: data
        })
    }

    render() {
        return (
            <div>
                <Search multi={true} target={["name", "phone", "email"]} data={this.state.data} getSearchData={(e) => this.getSearchData1(e)} />
                <Table
                    columns={this.state.columnsTable1}
                    dataSource={this.state.SearchData1}
                    pagination={false}
                />
            </div>
        );
    }
}

export default listAvailUser;