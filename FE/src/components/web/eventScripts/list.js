import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Button, Popconfirm, Table, Tooltip } from 'antd';
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
import { WebSocketServer } from '../../env'
import Search from '../helper/search';
const client = new w3cwebsocket(WebSocketServer);
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
                                <p style={{ color: '#AAB0B6', fontSize: 13 }}>Tạo lúc: {moment(e.createdAt).format('HH:mm')} | {moment(e.createdAt).format('DD/MM/YYY')} bởi <span style={{ color: '#2A9D8F' }}>{e.writerId ? e.writerId.name : null}</span></p>
                            </div>
                        )
                    }
                },
                {
                    title: 'Hành động',
                    dataIndex: '_id',
                    key: '_id',
                    width: '40%',
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
                                        <Popconfirm
                                            title="Bạn có chắc muốn xóa chứ?"
                                            onConfirm={() => this.deleteClick(e)}
                                            okText="Đồng ý"
                                            cancelText="Hủy"
                                        >
                                            <Button className="add"><CloseOutlined /></Button>
                                        </Popconfirm>
                                        {/* <Button onClick={} className="add" ><CloseOutlined /></Button> */}
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
            ],
            SearchData: []
        }
    }
    UNSAFE_componentWillReceiveProps(e) {
        this.setState({
            SearchData: e.data
        })
    }
    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            if (this.props.data) {
                this.setState({
                    SearchData: this.props.data,
                })
            }

            if (this.props.postsPerPage) {
                console.log(this.props.postsPerPage)
                this.setState({
                    postsPerPage: this.props.postsPerPage
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
                    let temp_list = this.props.data.slice()
                    temp_list = temp_list.filter(o => o._id !== e)
                    this.setState({
                        SearchData: temp_list
                    })
                    this.props.updateListScripts(temp_list)
                })
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
        )
    }
    getlistpage = (e) => {
        return Math.ceil(e.length / this.state.postsPerPage);
    }

    getSearchData = (data) => {
        this.setState({
            SearchData: data
        })
    }
    renderHeader = () => {
        if (this.props.showHeader) {
            return (
                <div className="flex-container-row" style={{ marginBottom: 20 }}>
                    <Search target="name" data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    {checkPermission(this.props.currentPermissions, constants.QL_KICHBAN_PERMISSION) ?
                        <Button className="flex-row-item-right add" ><Link to={`/addscripts/${this.props.eventId}`}>Thêm</Link></Button>
                        : null}
                </div>
            )
        }
    }

    printData = () => {
        return (
            <div>
                {this.renderHeader()}
                {/* <Button className="flex-row-item-right add" ><Link to={`/addscripts/${this.props.match.params.id}`}>Thêm</Link></Button> */}
                <Table className="scripts" pagination={this.getlistpage(this.state.SearchData) > 1 ? { pageSize: this.state.postsPerPage } : false} showHeader={false} rowKey="_id" columns={this.state.columns} dataSource={this.state.SearchData}></Table>
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