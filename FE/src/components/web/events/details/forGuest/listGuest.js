import { Button, Table, message, } from 'antd';
import React, { Component } from 'react';
import Search from '../../../helper/search';
import { AUTH } from '../../../../env'
import {
    CheckCircleOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
class listGuest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsTable1: [
                { title: 'Tên', dataIndex: 'name', key: 'name' },
                { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                {
                    title: 'Loại khách mời',
                    dataIndex: 'guestTypeId',
                    key: 'guestTypeId',
                    render: (e) => e.name
                },
                {
                    title: 'Trạng thái',
                    dataIndex: 'status',
                    key: 'status',
                    render: (e) => e ? <CheckCircleOutlined /> : <StopOutlined />,
                },
                {
                    title: 'Hành động',
                    dataIndex: '',
                    key: 'x',
                    render: (e) => <Button onClick={() => this.changeStatus(e)} >Đổi trạng thái</Button >,
                }
            ],
            SearchData1: [],
        }
    }

    changeStatus = async (e) => {
        await trackPromise(axios.put('/api/guests/' + e._id, { name: e.name, guestTypeId: e.guestTypeId, status: !e.status }, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(() => {
                let temp_data = this.state.data
                temp_data.forEach(element => {
                    if (element._id === e._id) {
                        element.status = !e.status
                    }
                });
                this.setState({
                    data: temp_data,
                    SearchData1: temp_data
                })
                this.props.updateGuest(temp_data)
                console.log(temp_data)
                message.success(`Trạng thái của khách mời ${e.name} cập nhật thành công`);
            })
            .catch(() => {
                message.error(`Trạng thái của khách mời ${e.name} cập nhật thất bại`);
            }))

    }

    componentDidMount() {
        let temp_listguest = this.props.listguest.map(obj => ({ ...obj, key: obj._id }))
        console.log(temp_listguest)
        this.setState({
            data: temp_listguest,
            SearchData1: temp_listguest,
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
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Search multi={true} target={["name", "phone", "email"]} data={this.state.data} getSearchData={(e) => this.getSearchData1(e)} />
                    <Button style={{ marginLeft: 'auto' }} onClick={() => this.updateGuest()}>Chỉnh sửa</Button>
                </div>
                <Table
                    columns={this.state.columnsTable1}
                    dataSource={this.state.SearchData1}
                    pagination={false}
                />
            </div>
        );
    }
}

export default listGuest;