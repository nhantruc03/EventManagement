import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../../env"
import ListScripts from '../../eventScripts/list'
import {
    Button,
    Row,
    Col,
    Modal,
    Tabs,
    Breadcrumb,
    Avatar,
    Tooltip,
    Tag,
    Image,
} from "antd";
import {
    InsertRowAboveOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import ListAvailUser from './forAvailUser/listAvailUser'
import EventAssign from './EventAssign/EventAssign'
import ListGuest from './forGuest/listGuest'
import GuestView from "./forGuest/guestView";
import { Link } from "react-router-dom";
import moment from 'moment';
import ChatRoom from '../../chat/ChatRoom'
const { TabPane } = Tabs;

class eventDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal2Visible: false,
            modal2Visible2: false,
            listguest: [],
            listguesttype: [],
            listgroups: [],
            data: null,
            status: '',
            listEventAssign: [],
            listRole: [],
            listFaculty: [],
            listGroups: [],
            currentUser: JSON.parse(localStorage.getItem('login'))
        }
    }

    updateguest = (e) => {
        console.log(e);
        this.setState({
            listguest: e
        })

    }

    async componentDidMount() {
        this._isMounted = true;

        const [event, guestTypes, listEventAssign, faculties, roles, groups] = await trackPromise(Promise.all([
            axios.get('/api/events/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/guest-types/getAll', { eventId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/event-assign/getAll', { eventId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/faculties/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/roles/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/groups/getAll', { eventId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));

        console.log(event)

        let guests = null
        if (guestTypes !== null) {

            let listguesttype = [];
            guestTypes.forEach(e => {
                listguesttype.push(e._id)
            })

            const [temp] = await trackPromise(Promise.all([
                axios.post('/api/guests/getAll', { listguesttype: listguesttype }, {
                    headers: {
                        'Authorization': { AUTH }.AUTH
                    }
                })
                    .then((res) =>
                        res.data.data
                    ),
            ]))
            guests = temp;
        }


        if (event !== null) {
            if (this._isMounted) {

                console.log('groups', groups)
                let status = '';
                let today = new Date().setHours(0, 0, 0, 0)
                if (new Date(event.startDate).setHours(0, 0, 0, 0) > today) {
                    status = 'Sắp diễn ra';
                } else if (new Date(event.startDate).setHours(0, 0, 0, 0) < today) {
                    status = 'Đã diễn ra';
                } else {
                    status = 'Đang diễn ra';
                }
                this.setState({
                    data: event,
                    listEventAssign: listEventAssign,
                    listRole: roles,
                    listFaculty: faculties,
                    status: status,
                    listGroups: groups
                })
                if (guestTypes !== null) {
                    this.setState({
                        listguesttype: guestTypes
                    })

                    if (guests !== null) {
                        console.log('guest', guests)
                        this.setState({
                            listguest: guests
                        })
                    }
                }
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    goBack = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    };

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
    }
    setModal2Visible2(modal2Visible2) {
        this.setState({ modal2Visible2 });
    }

    renderguest = () => this.state.listguesttype.map((e, key) =>
        <TabPane tab={e.name} key={key}><GuestView type={e._id} list={this.state.listguest} /></TabPane>
    )

    renderGroups = () => this.state.listGroups.map((e, key) =>
        <TabPane tab={e.name} key={key}><ChatRoom videocall={true} roomId={e._id} /></TabPane>
    )

    updateEventAssign = (e) => {
        this.setState({
            listEventAssign: e
        })
    }

    renderModel = () => {
        return (
            <Tabs defaultActiveKey="1">
                <TabPane tab="Danh sách ban tổ chức" key="1"><ListAvailUser listusers={this.state.data.availUser} /></TabPane>
                <TabPane tab="Phân nhóm" key="2">
                    <EventAssign
                        noBigAction={true}
                        update={this.updateEventAssign}
                        eventId={this.props.match.params.id}
                        listRole={this.state.listRole}
                        listFaculty={this.state.listFaculty}
                        data={this.state.listEventAssign} />
                </TabPane>
            </Tabs>

        );
    };

    renderModel2 = () => {
        return (
            <ListGuest listguesttype={this.state.listguesttype} listguest={this.state.listguest} updateGuest={(e) => { this.updateguest(e) }} />
        )
    }

    renderAvailUser = () => {
        return (
            this.state.data.availUser.map((value, key) => {
                return (
                    <Tooltip title={value.name} placement="top" key={key}>
                        <Avatar src={`/api/images/${value.photoUrl}`} />
                    </Tooltip >
                )
            })
        )
    }

    render() {
        if (this.state.data) {
            return (
                <Content >
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/events">Sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chi tiết
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            {this.state.currentUser.role === 'Admin' ?
                                <Button onClick={() => { this.props.history.push(`/editevent/${this.props.match.params.id}`) }} className="add flex-row-item-right">Chỉnh sửa</Button>
                                : null
                            }
                        </div>


                    </Row >

                    <div className="site-layout-background-main">
                        <Row style={{ height: '95%' }}>
                            <Col sm={24} xl={6} className="event-detail">
                                <Title className="event-detail-title" level={4}>Hình thức</Title>
                                {this.state.data.eventTypeId.name}

                                <Title className="event-detail-title" level={4}>Ban tổ chức</Title>
                                <div className="event-detail-user-container">
                                    <Avatar.Group
                                        maxCount={2}
                                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                    >
                                        {this.renderAvailUser()}
                                    </Avatar.Group>
                                    <Button className="event-detail-user" onClick={() => this.setModal2Visible(true)}>Xem</Button>
                                </div>

                                <Title className="event-detail-title" level={4}>Tags</Title>
                                {this.state.data.tagId.map((value, key) => <Tag style={{ width: 'auto', background: value.background, color: value.color }} key={key}>{value.name}</Tag>)}

                                <div className="flex-container-row" style={{ marginTop: '10px' }}>
                                    <Title className="event-detail-title" level={4}>Khách mời</Title>
                                    <Button className="flex-row-item-right" onClick={() => this.setModal2Visible2(true)}>Chỉnh sửa</Button>
                                </div>

                                <Tabs defaultActiveKey="1" >
                                    {this.renderguest()}
                                </Tabs>
                            </Col>
                            <Col sm={24} xl={10} className="event-detail">
                                {/* <Tag className="event-detail-status" style={{ marginTop: '15px' }}>{this.state.status}</Tag> */}
                                <Title style={{ color: '#017567', margin: 'unset' }} level={1}>{this.state.data.name}</Title>
                                <Title style={{ margin: 'unset' }} level={4}>Mô tả</Title>
                                {this.state.data.description}

                                <div className="event-detail-time-date-address">
                                    <div className="flex-container-row" style={{ justifyContent: 'space-between' }}>
                                        <div>
                                            <ClockCircleOutlined className="event-detail" />  {moment(this.state.data.startTime).format('HH:mm')}
                                        </div>
                                        <div>
                                            <InsertRowAboveOutlined /> {moment(this.state.data.startDate).format('DD/MM/YYYY')}
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '10px' }}>
                                        <EnvironmentOutlined className="event-detail" />  {this.state.data.address}
                                    </div>
                                </div>


                                <Image style={{ maxWidth: '150px' }} src={`/api/images/${this.state.data.posterUrl}`} alt="poster"></Image>

                                <div className="flex-container-row" style={{ marginBottom: '10px' }}>
                                    {/* <Title className="event-detail-title" level={3}>Kịch bản</Title> */}
                                    <Title level={4}>Kịch bản</Title>
                                    <Button className="flex-row-item-right add" ><Link to={`/addscripts/${this.props.match.params.id}`}>Thêm</Link></Button>
                                </div>
                                <ListScripts eventId={this.props.match.params.id} />
                            </Col>
                            <Col sm={24} xl={8} className="event-detail">
                                {/* <Title className="event-detail-title" level={3}>Phòng hội thoại</Title> */}

                                <Tabs className="chat-tabs" defaultActiveKey="1" >
                                    {this.renderGroups()}
                                </Tabs>
                            </Col>
                        </Row>
                    </div>


                    <Modal
                        title="Ban tổ chức"
                        centered
                        visible={this.state.modal2Visible}
                        onOk={() => this.setModal2Visible(false)}
                        onCancel={() => this.setModal2Visible(false)}
                        width="80%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModel(this.state.listusers)}
                    </Modal>

                    <Modal
                        title="Cập nhật khách mời"
                        centered
                        visible={this.state.modal2Visible2}
                        onOk={() => this.setModal2Visible2(false)}
                        onCancel={() => this.setModal2Visible2(false)}
                        width="70%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModel2(this.state.listusers)}
                    </Modal>
                </Content >
            );
        } else {
            return null
        }

    }
}

export default eventDetails;