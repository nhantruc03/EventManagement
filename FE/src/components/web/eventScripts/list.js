import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import {
    ToolOutlined,
    CloseOutlined,
    ZoomInOutlined,

} from '@ant-design/icons';
import moment from 'moment'
import * as constants from "../constant/actions"
import checkPermission from "../helper/checkPermissions"
import { w3cwebsocket } from 'websocket';
import * as PushNoti from '../helper/pushNotification'
import ApiFailHandler from '../helper/ApiFailHandler'
const client = new w3cwebsocket('ws://localhost:3001');
class list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            postsPerPage: 2,
            listPage: [],
            columns: [
                {
                    title: 'Tên',
                    dataIndex: '',
                    key: 'x',
                    render: (e) => {
                        return (
                            <div>
                                <Title level={2}>{e.name}</Title>
                                <p style={{ color: '#AAB0B6' }}>Tạo lúc: {moment(e.createdAt).format('HH:mm')} | {moment(e.createdAt).format('DD/MM/YYY')} bởi <span style={{ color: '#2A9D8F' }}>{e.writerId ? e.writerId.name : null}</span></p>
                            </div>
                        )
                    }
                },
                {
                    title: 'Hành động',
                    dataIndex: '_id',
                    key: '_id',
                    width: '30%',
                    render: (e) =>
                        <div className="btn-group">
                            {checkPermission(this.props.currentPermissions, constants.QL_KICHBAN_PERMISSION) ?
                                <>
                                    <Tooltip title="Chỉnh sửa" arrow>
                                        <Link to={`/editscripts/${e}`} >
                                            <Button className="add"><ToolOutlined /></Button>
                                        </Link>
                                    </Tooltip>
                                    <Tooltip title="Xóa" arrow>
                                        <Button onClick={() => this.deleteClick(e)} className="add" ><CloseOutlined /></Button>
                                    </Tooltip>
                                </>
                                : null}
                            < Tooltip title="Xem" arrow >
                                <Link to={`/viewscripts/${e}`} >
                                    <Button className="add" ><ZoomInOutlined /></Button>
                                </Link>
                            </Tooltip >
                        </div >
                }
            ]
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [scripts] = await trackPromise(Promise.all([
            Axios.post('/api/scripts/getAll', { eventId: this.props.eventId }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err=>{
                    ApiFailHandler(err.response?.data?.error)
                })
        ]));

        if (scripts !== null) {
            if (this._isMounted) {
                this.setState({
                    data: scripts.reverse(),
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    onAddClick = () => {
        this.setState({
            onAdd: true
        })
    }

    deleteClick = async (e) => {

        await trackPromise(
            Axios.delete("/api/scripts/" + e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    client.send(JSON.stringify({
                        type: "sendNotification",
                        notification: res.data.notification
                    }))
                    PushNoti.sendPushNoti(res.data.notification)
                    this.setState({
                        data: this.state.data.filter(o => o._id !== e)
                    })
                })
                .catch(err=>{
                    ApiFailHandler(err.response?.data?.error)
                })
        )
    }
    getlistpage = (e) => {
        return Math.ceil(e.length / this.state.postsPerPage);
    }

    printData = () => {
        return (
            <div className='mt-1'>
                <Table className="scripts" pagination={this.getlistpage(this.state.data) > 1 ? { pageSize: this.state.postsPerPage } : false} showHeader={false} rowKey="_id" columns={this.state.columns} dataSource={this.state.data}></Table>
            </div>
        )
    }

    render() {
        return (
            <div>
                {this.printData()}
            </div>
        );
    }
}
export default list;