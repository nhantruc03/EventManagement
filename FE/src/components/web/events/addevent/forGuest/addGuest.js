import React, { Component } from 'react';
import TableData from './TableData';

import { v1 as uuidv1 } from 'uuid';
import { Button, Col, Row } from 'antd';
import Search from '../../../helper/search';
class addGuest extends Component {
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

    onClickEditUser = () => {
        this.setState({
            onEditUser: !this.state.onEditUser
        })
    }

    getUserEditInfo = (info) => {
        let temp_data = this.state.data;
        temp_data.forEach((value) => {
            if (value.id === info.id) {
                value.name = info.name;
                value.phone = info.phone;
                value.email = info.email;
                value.guestTypeName = info.guestTypeName;
                value.guestTypeId = info.guestTypeName;
                value.noinfo = false;
            }
        });
        // cap nhat du lieu
        this.setState({
            data: temp_data
        })
        this.props.updateguest(temp_data);
    }

    deleteClick = (id) => {
        this.props.deleteguest(id)
        this.setState({
            data: this.state.data.filter(item => item.id !== id)
        })
    }

    TaoKM = () => {
        let temp = {
            id: uuidv1(),
            noinfo: true
        }
        this.props.addGuest(temp)
        this.setState({
            data: [...this.state.data, temp]
        })
    }

    getSearchData = (data) => {
        this.setState({
            data: data
        })
    }


    render() {
        return (
            <div>
                <Row >
                    <Col span={20}>
                        <Search target={["name", "phone", "email"]} multi={true} data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    </Col>
                    <Col span={4}>
                        <Button className="add" style={{ float: "right" }} onClick={() => this.TaoKM()}>Tạo khách mời</Button>
                    </Col>
                </Row>
                <TableData listguesttype={this.props.listguesttype} getUserEditInfo={(info) => this.getUserEditInfo(info)} deleteClick={(id) => this.deleteClick(id)} onClickEditUser={() => this.onClickEditUser()} dataUser={this.state.data} />
            </div>
        );
    }
}

export default addGuest;