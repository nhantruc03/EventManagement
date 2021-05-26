import React, { Component } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Layout, Menu, Tooltip } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import auth from '../../../router/auth';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { AUTH } from '../../env'
import { w3cwebsocket } from 'websocket';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import ApiFailHandler from '../helper/ApiFailHandler'
const client = new w3cwebsocket('ws://localhost:3001');
const { Header } = Layout;
class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            modal2Visible: false,
            model: { dondathang: [] },
            notifications: [],
            logout: false,
            info_pass: false,
            onNoti: false,
            notiUrl: ''
        }
    }

    async componentDidMount() {
        this._isMounted = true
        if (this._isMounted) {
            var login = localStorage.getItem('login');
            var obj = JSON.parse(login);
            client.onopen = () => {
                console.log('Connect to ws')
            }

            client.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.type === "sendListNotifications") {
                    if (dataFromServer.notifications.length > 0) {
                        dataFromServer.notifications.forEach(e => {
                            if (e.userId._id === this.state.currentUser.id) {
                                this.setState({
                                    notifications: [e, ...this.state.notifications]
                                })
                            }
                        })
                    }
                } else if (dataFromServer.type === "sendNotification") {
                    if (dataFromServer.notification.userId._id === this.state.currentUser.id) {
                        this.setState({
                            notifications: [dataFromServer.notification, ...this.state.notifications]
                        })
                    }
                }
            };

            const [notifications] = await trackPromise(Promise.all([
                axios.post('/api/notifications/getAll', { userId: obj.id }, {
                    headers: {
                        'Authorization': { AUTH }.AUTH
                    }
                })
                    .then((res) =>
                        res.data.data
                    )
                    .catch(err => {
                        ApiFailHandler(err.response?.data?.error)
                    })
            ]));
            if (notifications) {
                if (this._isMounted) {
                    this.setState({
                        notifications: notifications.reverse(),
                        currentUser: obj
                    })
                }
            }
        }

    }

    handleButtonClick = (e) => {
        if (e.key === 'logout') {
            auth.logout();
            this.setState({
                logout: true
            })
        }
        else if (e.key === 'info') {
            this.setState({
                info: true
            })
        } else if (e.key === 'info-pass') {
            this.setState({
                info_pass: true
            })
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    setModal2Visible(modal2Visible, val) {
        this.setState({ modal2Visible });
        if (val !== undefined) {
            var temp = this.props.data.find(e => e.ID === val)
            this.setState({
                model: temp
            })
        }
    }

    updateNoti = (e, id, url) => {
        e.preventDefault()
        let data = {
            status: true,
            _id: id
        }
        axios.put('/api/notifications', data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then((res) => {
                let temp_list = this.state.notifications;
                temp_list.forEach(e => {
                    if (e._id === id) {
                        e.status = true
                    }
                })
                this.setState({
                    notifications: temp_list
                })

            })
        this.setState({
            notiUrl: url,
            onNoti: true
        })
    }

    renderNotificationContent = (e) => {
        if (e.eventId) {
            return (
                <Link className={e.status ? 'noti-watched' : 'noti'} onClick={(x) => this.updateNoti(x, e._id, `/events/${e.eventId}`)} to={'/#'}>
                    <Tooltip
                        title={
                            <div>
                                <p>Thông báo: {e.name}</p>
                                <br></br>
                                <p>Mô tả: {e.description}</p>
                            </div>
                        }
                        placement="top">
                        <div>
                            <p style={{ fontWeight: 'bold' }} >{e.name}</p>
                            <p className="cut-text">{e.description}</p>
                        </div>
                    </Tooltip>
                </Link>
            )
        }
        else if (e.actionId) {
            return (
                <Link className={e.status ? 'noti-watched' : 'noti'} onClick={(x) => this.updateNoti(x, e._id, `/actions/${e.actionId}`)} to={"/#"}>
                    <Tooltip title={
                        <div>
                            <p>Thông báo: {e.name}</p>
                            <br></br>
                            <p>Mô tả: {e.description}</p>
                        </div>
                    } placement="top">
                        <div >
                            <p style={{ fontWeight: 'bold' }}>{e.name}</p>
                            <p className="cut-text">{e.description}</p>
                        </div>
                    </Tooltip>
                </Link >
            )
        }
        else if (e.scriptId) {
            return (
                <Link className={e.status ? 'noti-watched' : 'noti'} onClick={(x) => this.updateNoti(x, e._id, `/viewscripts/${e.scriptId}`)} to={"/#"}>
                    <Tooltip title={
                        <div>
                            <p>Thông báo: {e.name}</p>
                            <br></br>
                            <p>Mô tả: {e.description}</p>
                        </div>
                    } placement="top">
                        <div>

                            <p style={{ fontWeight: 'bold' }}>{e.name}</p>
                            <p className="cut-text">{e.description}</p>
                        </div>
                    </Tooltip>
                </Link >
            )
        }
    }

    renderNotifications = () => {
        return (
            <Menu>
                {this.state.notifications.map((e, key) =>
                    <Menu.Item key={key} >
                        {this.renderNotificationContent(e)}
                    </Menu.Item>
                )}
            </Menu>
        )
    }

    onVisibleChange = (e) => {
        if (e) {
            axios.put('/api/notifications', { userId: this.state.currentUser.id, watch: true }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )

            let temp = this.state.notifications
            temp.map(e => e.watch = true)
            this.setState({
                notifications: temp,
                dropdownVisible: e
            })
        }else{
            this.setState({
                dropdownVisible: e
            })
        }
    }

    renderView = () => {
        return (
            <Header className="site-layout-background flex-container-row" >
                <div className="flex-row-item-right">
                    <div className="flex-container-row">
                        <Dropdown visible={this.state.dropdownVisible}  onVisibleChange={this.onVisibleChange} overlayClassName='dropdown' overlay={this.renderNotifications} placement='bottomRight'>
                            <Badge count={this.state.notifications.filter(e => e.watch === false).length}>
                                <Button style={{ border: 'none' }}><BellOutlined /></Button>
                            </Badge>
                        </Dropdown>
                        {this.state.currentUser ?
                            <Dropdown
                                overlay={
                                    <Menu onClick={(e) => this.handleButtonClick(e)}>
                                        <Menu.Item key="info" icon={<UserOutlined />}>
                                            Thông tin cá nhân
                                        </Menu.Item>
                                        <Menu.Item key="info-pass" icon={<UserOutlined />}>
                                            Cập nhật mật khẩu
                                        </Menu.Item>
                                        <Menu.Item key="logout" icon={<UserOutlined />}>
                                            Đăng xuất
                                        </Menu.Item>
                                    </Menu>
                                }>
                                <Button id="button-account">
                                    <div className="flex-container-row">
                                        <p className="top-name-user cut-text">{this.state.currentUser.name}</p> <Avatar style={{ marginLeft: '10px' }} className="my-2" src={`/api/images/${this.state.currentUser.photoUrl}`} />
                                    </div>
                                </Button>
                            </Dropdown>
                            : null}
                    </div>
                </div>
            </Header >
        )
    }

    render() {
        if (this.state.logout) {
            return (
                <Redirect to="/login" />
            )
        }
        else if (this.state.info) {
            return (
                <Redirect to="/thongtincanhan" />
            )
        }
        else if (this.state.info_pass) {
            return (
                <Redirect to="/updatePassword" />
            )
        }
        else if (this.state.onNoti) {
            if (window.location.pathname !== this.state.notiUrl) {
                return (
                    <Redirect to={this.state.notiUrl} />
                )
            } else {
                window.location.reload();
            }
        }
        else {
            return (
                this.renderView()
            )
        }
    }
}

export default header;