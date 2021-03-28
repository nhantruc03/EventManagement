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
const client = new w3cwebsocket('ws://localhost:3001');
const { Header } = Layout;

// const formItemLayout = {
//     labelCol: {
//         span: 6,
//     },
//     wrapperCol: {
//         span: 14,
//     },
// };

class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            modal2Visible: false,
            model: { dondathang: [] },
            notifications: [],
            logout: false,
            info_pass: false
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
                        // console.log(dataFromServer.message)
                        dataFromServer.notifications.forEach(e => {
                            if (e.userId === this.state.currentUser.id) {
                                this.setState({
                                    notifications: [...this.state.notifications, e]
                                })
                            }
                        })
                    }
                } else if (dataFromServer.type === "sendNotification") {
                    if (dataFromServer.notification.userId === this.state.currentUser.id) {
                        this.setState({
                            notifications: [...this.state.notifications, dataFromServer.notification]
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
            ]));

            if (notifications !== null) {
                if (this._isMounted) {
                    this.setState({
                        notifications: notifications,
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
    // formRef = React.createRef();
    // renderModel = (val) => {
    //     console.log(this.state.model)
    //     console.log(val)
    //     return (
    //         <Form
    //             ref={this.formRef}
    //             name="validate_other"
    //             {...formItemLayout}
    //             onFinish={(e) => this.onFinish(e)}
    //             layout="vertical"
    //             defaultValue={val}
    //         >

    //             <Row>
    //                 <Col span={24}>
    //                     <Title>Thông tin đơn mua hàng</Title>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Mã đơn hàng">
    //                         <p className="special">{val.ID}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Người phụ trách">
    //                         <p className="special">{val.nguoiphutrach}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Tên hàng">
    //                         <p className="special">{val.tensanpham}</p>
    //                     </Form.Item>
    //                 </Col>

    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Số lượng" >
    //                         <p className="special">{val.soluong}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Đơn giá" >
    //                         <p className="special">{val.dongia}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Thành tiền" >
    //                         <p className="special">{val.tongtien}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Ngày nhận hàng" >
    //                         <p className="special">{val.ngaynhanhang}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Thanh toán" >
    //                         <p className="special">{val.ngaythanhtoan}</p>
    //                     </Form.Item>
    //                 </Col>

    //                 <Col span={24}>
    //                     <Title>Thông tin nhà cung cấp</Title>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Nhà cung cấp">
    //                         <p className="special">{val.tennhacungcap}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Email">
    //                         <p className="special">{val.emailncc}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Số điện thoại">
    //                         <p className="special">{val.sdtncc}</p>
    //                     </Form.Item>
    //                 </Col>
    //                 <Col span={12}>
    //                     <Form.Item wrapperCol={{ sm: 24 }} label="Người đại diện">
    //                         <p className="special">{val.nguoidaidien}</p>
    //                     </Form.Item>
    //                 </Col>
    //             </Row>
    //         </Form>
    //     )
    // }

    renderNotificationContent = (e) => {
        if (e.eventId) {
            return (
                <Link to={`/events/${e.eventId}`}>
                    <Tooltip title={
                        <div>
                            <p>Sự kiện: {e.name}</p>
                            <br></br>
                            <p>Mô tả: {e.description}</p>
                        </div>
                    } placement="top">
                        <p style={{ fontWeight: 'bold' }} >{e.name}</p>
                        <p className="cut-text">{e.description}</p>
                    </Tooltip>
                </Link>
            )
        }
        else if (e.actionId) {
            return (
                <Link to={`/actions/${e.actionId}`}>
                    <Tooltip title={
                        <div>
                            <p>Công việc: {e.name}</p>
                            <br></br>
                            <p>Mô tả: {e.description}</p>
                        </div>
                    } placement="top">
                        <p style={{ fontWeight: 'bold' }}>{e.name}</p>
                        <p className="cut-text">{e.description}</p>
                    </Tooltip>
                </Link >
            )
        }
    }

    renderNotifications = () => {
        return (
            <Menu>
                {this.state.notifications.reverse().map((e, key) =>
                    <Menu.Item key={key} >
                        {this.renderNotificationContent(e)}
                    </Menu.Item>
                )}
            </Menu>
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
        else {

            return (
                <Header className="site-layout-background" style={{ padding: 15 }} >
                    <div className="flex-container-row">
                        {/* <div style={{ float: 'right', marginBottom: 20, marginRight: 20, display: 'inline-grid' }}> */}
                        <div className="flex-row-item-right">

                            <Dropdown overlayClassName='dropdown' overlay={this.renderNotifications} placement='bottomRight'>
                                <Badge count={this.state.notifications.filter(e => e.status === false).length}>
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
                                    <Button id="button-account" >
                                        {this.state.currentUser.name} <Avatar style={{ marginLeft: '10px' }} className="my-2" src={`/api/images/${this.state.currentUser.photoUrl}`} />
                                    </Button>
                                </Dropdown>
                                : null}
                        </div>
                    </div>
                    {/* <Modal
                            title='Chi tiết đơn mua hàng'
                            centered
                            visible={this.state.modal2Visible}
                            onOk={() => this.setModal2Visible(false)}
                            onCancel={() => this.setModal2Visible(false)}
                            width='30%'
                            footer={false}
                        >
                             {this.renderModel(this.state.model)}
                        </Modal>  */}

                </Header >
            );
        }
    }
}

// const mapStateToProps = state => {
//     return {
//         data: state.DONMUAHANG
//     }
// }

// export default connect(mapStateToProps, null)(header);
export default header;