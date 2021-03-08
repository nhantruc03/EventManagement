import React, { Component } from 'react';
import TableData from './TableData';
import { Col, Row } from 'antd';
import Search from '../../../helper/search';
class ListEventAssign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hienthiform: false,
            data: [],
            searchKey: '',
            onEditUser: false,
        }
    }

    getSearchKey = (key) => {
        this.setState({
            searchKey: key
        })
    }

    getUserEditInfo = (info) => {
        let temp_data = this.props.data;
        temp_data.forEach((value) => {
            if (value.userId._id === info.userId._id) {
                value.userId = info.userId;
                value.roleId = info.roleId;
                value.facultyId = info.facultyId;
            }
        });

        this.props.update(temp_data);
    }

    UNSAFE_componentWillReceiveProps(e) {
        this.setState({
            data: e.data
        })
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
        })
    }

    getSearchData = (data) => {
        this.setState({
            data: data
        })
    }

    render() {
        return (
            <div className="searchForm">
                <div className="container">
                    <div className="row">
                        <Row style={{ width: '100%', marginLeft: 30, marginRight: 30 }}>
                            <Col span={20}>
                                <Search targetParent="userId" target="name" data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                            </Col>
                        </Row>
                        <TableData listFaculty={this.props.listFaculty} listRole={this.props.listRole} getUserEditInfo={(info) => this.getUserEditInfo(info)} dataUser={this.state.data} />
                    </div>
                </div>
            </div>
        );
    }
}

export default ListEventAssign;