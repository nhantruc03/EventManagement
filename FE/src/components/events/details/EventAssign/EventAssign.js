import React, { Component } from 'react';
import TableData from '../../addevent/EventAssign/TableData';
import { Col, Row } from 'antd';
import Search from '../../../helper/search';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../env'
import { Message } from '../../../service/renderMessage';
class EventAssign extends Component {
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

    getUserEditInfo = async (info) => {
        let data = {
            _id: info._id,
            userId: info.userId._id,
            roleId: info.roleId._id,
            facultyId: info.facultyId._id,
            eventId: this.props.eventId
        }

        await trackPromise(axios.put('/api/event-assign/' + info._id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                let temp_data = this.props.data;
                temp_data.forEach((value) => {
                    if (value.userId._id === info.userId._id) {
                        value.userId = info.userId;
                        value.roleId = info.roleId;
                        value.facultyId = info.facultyId;
                    }
                });
                this.props.update(temp_data);
                Message('Sửa thành công', true);

            })
            .catch(err => {
                Message('Sửa thất bại', false);
            }))

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
    deleteClick = async (id) => {
        await trackPromise(
            axios.delete('/api/event-assign/' + id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {

                    let temp = this.props.data.filter(e => e._id !== res.data.data._id)
                    console.log('temp', temp)
                    this.setState({
                        data: temp
                    })
                    this.props.update(temp, res.data.data.userId)
                  
                    Message('Xóa thành công', true);
                })
                .catch(err => {
                    Message('Xóa thất bại', false);
                }))
    }
    render() {
        return (
            <div >
                <Row style={{ width: '100%' }}>
                    <Col span={20}>
                        <Search targetParent="userId" target="name" data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    </Col>
                </Row>
                <TableData deleteClick={(id) => this.deleteClick(id)} canDelete={this.props.canDelete} listFaculty={this.props.listFaculty} listRole={this.props.listRole} getUserEditInfo={(info) => this.getUserEditInfo(info)} dataUser={this.state.data} />
            </div>

        );
    }
}

export default EventAssign;