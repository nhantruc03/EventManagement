import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../env"
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
    EnvironmentOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import ListAvailUser from './forAvailUser/listAvailUser'
import ListGuest from './forGuest/listGuest'
import GuestView from "./forGuest/guestView";
import { Message } from "../../service/renderMessage";
import { Link } from "react-router-dom";
import moment from 'moment';
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
            status: ''
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

        const [event, guestTypes] = await trackPromise(Promise.all([
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
        ]));
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
                console.log('event', event)
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
                    status: status
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

    onFinish = async (values) => {
        let data = {
            ...values,
            'availUser': this.state.listusersforevent.reduce((a, o) => { a.push(o._id); return a }, []),
            'startDate': values['startDate'].format('YYYY-MM-DD'),
            'startTime': values['startTime'].format('HH:mm'),
            // .toDate
            'posterUrl': values['posterUrl'].fileList[0].response.url,
            'guestTypes': this.state.listguesttype,
            'guests': this.state.listguest,
            'groups': this.state.listgroups,
        }

        console.log('Received values of form: ', data);

        await trackPromise(axios.post('/api/events/start', data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                // Message('Tạo thành công', true, this.props);
            })
            .catch(err => {
                Message('Tạo thất bại', false);
            }))
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

    renderModel = () => {
        return (
            <ListAvailUser listusers={this.state.data.availUser} />
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
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <Col span={8}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/events">Sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chi tiết
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row >

                    <div className="site-layout-background-main">
                        <Row>
                            <Col span={6} className="event-detail">
                                <Title className="event-detail-title" level={3}>Hình thức</Title>
                                {this.state.data.eventTypeId.name}

                                <Title level={3}>Ban tổ chức</Title>
                                <div className="event-detail-user-container">
                                    <Avatar.Group
                                        maxCount={2}
                                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                    >
                                        {this.renderAvailUser()}
                                    </Avatar.Group>
                                    <Button className="event-detail-user" onClick={() => this.setModal2Visible(true)}>Xem</Button>
                                </div>

                                <Title className="event-detail-title" level={3}>Tags</Title>
                                {this.state.data.tagId.map((value, key) => <Tag style={{ width: 'auto' }} key={key}>{value.name}</Tag>)}

                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                    <Title className="event-detail-title" level={3}>Khách mời</Title>
                                    <Button style={{ marginLeft: 'auto' }} onClick={() => this.setModal2Visible2(true)}>Chỉnh sửa</Button>
                                </div>

                                <Tabs defaultActiveKey="1" >
                                    {this.renderguest()}
                                </Tabs>
                            </Col>
                            <Col span={10} className="event-detail">
                                <Tag className="event-detail-status">{this.state.status}</Tag>
                                <Title level={1}>{this.state.data.name}</Title>
                                {this.state.data.description}

                                <div className="event-detail-time-date-address">
                                    <ClockCircleOutlined className="event-detail" />  {this.state.data.startTime} - {moment(this.state.data.startDate).format('DD/MM/YYYY')}
                                    <EnvironmentOutlined className="event-detail right" />  {this.state.data.address}
                                </div>

                                <Title className="event-detail-title" level={3}>Poster</Title>
                                <Image src={`/api/images/${this.state.data.posterUrl}`} alt="poster"></Image>
                            </Col>
                            <Col span={8} className="event-detail">
                                <Title className="event-detail-title" level={3}>Phòng hội thoại</Title>
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
                        title="Thêm khách mời"
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