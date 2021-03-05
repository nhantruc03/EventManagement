import { Button, Col, Row, Table } from 'antd';
import React, { Component } from 'react';
import Search from '../../helper/search';

class selectUsers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsTable1: [
                { title: 'Tên', dataIndex: 'name', key: 'name' },
                { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                {
                    title: 'Hành động',
                    dataIndex: '',
                    key: 'x',
                    render: (e) => <Button onClick={() => this.addusertoevent(e)} > Thêm</Button >,
                },
            ],
            columnsTable2: [
                { title: 'Tên', dataIndex: 'name', key: 'name' },
                { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                {
                    title: 'Hành động',
                    dataIndex: '',
                    key: 'x',
                    render: (e) => <Button onClick={() => this.removeuserfromevent(e)}>Xóa</Button>,
                },
            ],
            SearchData1: [],
            SearchData2: [],
        }
    }

    addusertoevent = (e) => {
        this.props.addusertoevent(e);
        this.setState({
            SearchData1: this.state.SearchData1.filter(x => x._id !== e._id),
            SearchData2: [...this.state.SearchData2, e]
        })
    }

    removeuserfromevent = (e) => {
        this.props.removeuserfromevent(e);
        this.setState({
            SearchData1: [...this.state.SearchData1, e],
            SearchData2: this.state.SearchData2.filter(x => x._id !== e._id)
        })
    }


    componentDidMount() {
        let temp_listusers = this.props.listusers.map(obj => ({ ...obj, key: obj._id }))
        let listusersforevent = this.props.listusersforevent.map(obj => ({ ...obj, key: obj._id }))
        this.setState({
            SearchData1: temp_listusers,
            SearchData2: listusersforevent,
        })
    }

    getSearchData1 = (data) => {
        this.setState({
            SearchData1: data
        })
    }

    getSearchData2 = (data) => {
        this.setState({
            SearchData2: data
        })
    }
    render() {
        return (
            <div>
                <Row>
                    <Col span={12} style={{ padding: 10 }}>
                        <Search target="name" data={this.props.listusers} getSearchData={(e) => this.getSearchData1(e)} />
                        <Table
                            columns={this.state.columnsTable1}
                            dataSource={this.state.SearchData1}
                            pagination={false}
                        />
                    </Col>
                    <Col span={12} style={{ padding: 10 }}>
                        <Search target="name" data={this.props.listusersforevent} getSearchData={(e) => this.getSearchData2(e)} />
                        <Table
                            columns={this.state.columnsTable2}
                            dataSource={this.state.SearchData2}
                            pagination={false}
                        />
                    </Col>
                </Row>

            </div>
        );
    }
}

export default selectUsers;