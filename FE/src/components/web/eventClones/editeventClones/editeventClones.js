import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../../env"
import {
    Form,
    Button,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    TimePicker,
    Upload,
    message,
    Breadcrumb,
    Image,
    Tabs,
} from "antd";
import {
    UploadOutlined,
} from "@ant-design/icons";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from 'moment'
import GuestTypeView from "./GuestType/guestTypeView";
import GroupView from "./Group/groupView";
import ListScripts from '../../eventScripts/forClone/list'
import ListActionsClone from '../../actions/forClone/listactions/listactions'
import { w3cwebsocket } from 'websocket';
const client = new w3cwebsocket('ws://localhost:3001');
const { Option } = Select;
const { TabPane } = Tabs;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};


class editevent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listeventtype: [],
            listtags: [],
            fileList: [],
            posterUrl: null,
            listguesttype: [],
            listgroups: [],
            data: null,
            currentUser: JSON.parse(localStorage.getItem('login'))
        }
    }

    addusertoevent = async (e) => {
        let temp_eventAssign = {
            userId: e,
            eventId: this.props.match.params.id,
        }

        await trackPromise(
            axios.post('/api/event-assign', temp_eventAssign, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    this.setState({
                        listusers: this.state.listusers.filter(x => x._id !== e._id),
                        listusersforevent: [...this.state.listusersforevent, e],
                        listEventAssign: [...this.state.listEventAssign, res.data.data]
                    })

                    client.send(JSON.stringify({
                        type: "sendNotification",
                        notification: res.data.notification
                    }))

                    message.success('Thêm thành công')
                })
                .catch(err => {
                    message.error('Thêm thất bại')
                }))
    }

    updateguest = (e) => {
        this.setState({
            listguest: e
        })
    }

    updateEventAssign = (a, b) => {
        console.log('updated', a)

        this.setState({
            listEventAssign: a,
        })

        if (b) {
            let temp_user = this.state.listusersforevent.filter(x => x._id === b)[0];
            this.setState({
                listusers: [...this.state.listusers, temp_user],
                listusersforevent: this.state.listusersforevent.filter(x => x._id !== temp_user._id),
            })
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [users, eventTypes, tags, faculties, roles, event, listeventassign, guesttypes, groups] = await trackPromise(Promise.all([
            axios.post('/api/users/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/event-types/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/tags/getAll', {}, {
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
            axios.get('/api/events/' + this.props.match.params.id, {
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
            axios.post('/api/guest-types/getAll', { eventId: this.props.match.params.id }, {
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
                )

        ]));

        let guests = []
        if (guesttypes !== null) {
            console.log(guesttypes)
            let temp_listtypes = []
            guesttypes.forEach(e => {
                temp_listtypes.push(e._id)
            })
            guests = await trackPromise(
                axios.post('/api/guests/getAll', { listguesttype: temp_listtypes }, {
                    headers: {
                        'Authorization': { AUTH }.AUTH
                    }
                }).then((res) =>
                    res.data.data
                ))

            console.log(guests)
        }


        if (users !== null && eventTypes !== null && tags !== null && roles !== null && faculties !== null && event !== null && groups !== null) {
            if (this._isMounted) {
                // prepare data
                let temp_tagId = [];
                event.tagId.forEach(e => {
                    temp_tagId.push(e._id)
                })
                let data = {
                    ...event,
                    'startTime': moment(event.startTime),
                    'startDate': moment(event.startDate),
                    'eventTypeId': event.eventTypeId._id,
                    'tagId': temp_tagId
                }


                let temp_userForEvent = [];
                listeventassign.forEach(e => {
                    temp_userForEvent.push(e.userId._id)
                })
                let temp_userNotInEvent = users.filter(e => !temp_userForEvent.includes(e._id))

                // prepare state
                this.setState({
                    listRole: roles,
                    listFaculty: faculties,
                    data: data,
                    listusersforevent: event.availUser,
                    listEventAssign: listeventassign,
                    listusers: temp_userNotInEvent,
                    listeventtype: eventTypes,
                    listtags: tags,
                    listguesttype: guesttypes,
                    listguest: guests,
                    listgroups: groups
                })
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
            'startDate': values['startDate'].toDate(),
            'startTime': values['startTime'].toDate(),
        }
        if (this.state.posterUrl !== null) {
            data = {
                ...data,
                'posterUrl': this.state.posterUrl,
            }
        }

        console.log('Received values of form: ', data);

        await trackPromise(axios.put('/api/events/' + this.state.data._id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                message.success('Cập nhật thành công');
            })
            .catch(err => {
                message.error('Cập nhật thất bại');
            }))
    };

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
    }

    updatelistguesttype = (values) => {
        this.setState({
            listguesttype: values,
        })
    }

    updatelistgroup = (values) => {
        this.setState({
            listgroups: values,
        })
    }

    onClickAddEvent = async () => {

        await trackPromise(axios.post('/api/events/start-clone', { eventId: this.props.match.params.id }, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                message.success('Tạo thành công');
            })
            .catch(err => {
                message.error('Tạo thất bại');
            }))
    }

    render() {
        if (this.state.data) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/eventclones">Sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chi tiết
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            {this.state.currentUser.role === 'Admin' ?
                                <Button onClick={this.onClickAddEvent} className="add flex-row-item-right">Tạo sự kiện</Button>
                                : null
                            }
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
                        <Tabs defaultActiveKey="1" >
                            <TabPane tab='Thông tin' key={1}>
                                <Row >
                                    <Col sm={24} lg={12}>
                                        <Form
                                            name="validate_other"
                                            {...formItemLayout}
                                            onFinish={(e) => this.onFinish(e)}
                                            layout="vertical"
                                            initialValues={this.state.data}
                                            className="event-form"
                                        >
                                            <Row>
                                                <Col className="event-col" sm={12} lg={12}>
                                                    <Form.Item
                                                        wrapperCol={{ sm: 24 }}
                                                        name="eventTypeId"
                                                        label={<Title className="normalLabel" level={4}>Hình thức</Title>}
                                                        hasFeedback
                                                        rules={[{ required: true, message: 'Cần chọn hình thức sự kiện!' }]}
                                                    >
                                                        <Select placeholder="Chọn hình thức sự kiện">
                                                            {this.state.listeventtype.map((e, key) => <Option key={e._id}>{e.name}</Option>)}
                                                        </Select>
                                                    </Form.Item>

                                                    <Form.Item
                                                        wrapperCol={{ sm: 24 }}
                                                        name="tagId"
                                                        label={<Title className="normalLabel" level={4}>Tags</Title>}
                                                        hasFeedback
                                                    // rules={[{ message: 'Cần chọn ban tổ chức!' }]}
                                                    >
                                                        <Select
                                                            id="2"
                                                            mode="multiple"
                                                            allowClear
                                                            style={{ width: '100%' }}
                                                            placeholder="Chọn Tags..."
                                                            filterOption={(input, option) =>
                                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                            }
                                                        >
                                                            {this.state.listtags.map((e, key) => <Option key={e._id}>{e.name}</Option>)}
                                                        </Select>
                                                    </Form.Item>

                                                    <Title className="normalLabel" level={4}>Ảnh đại diện hiện tại</Title>
                                                    <div style={{ widht: '100%', textAlign: 'center' }}>
                                                        <Image style={{ maxWidth: '110px' }} src={`/api/images/${this.state.data.posterUrl}`}></Image>
                                                    </div>

                                                    <Form.Item
                                                        wrapperCol={{ sm: 24 }}
                                                        name="posterUrl"
                                                        label={<Title className="normalLabel" level={4}>Ảnh đại diện</Title>}
                                                        rules={[{ required: true, message: 'Cần tải lên poster' }]}
                                                    >
                                                        <Upload
                                                            fileList={this.state.fileList}
                                                            action='/api/uploads'
                                                            listType="picture"
                                                            beforeUpload={file => {
                                                                if (file.type !== 'image/png') {
                                                                    message.error(`${file.name} is not a png file`);
                                                                }
                                                                return file.type === 'image/png';
                                                            }}
                                                            onChange={(info) => {
                                                                // file.status is empty when beforeUpload return false
                                                                if (info.file.status === 'done') {
                                                                    message.success(`${info.file.response.url} file uploaded successfully`);
                                                                    this.setState({
                                                                        posterUrl: info.file.response.url
                                                                    })

                                                                }
                                                                this.setState({
                                                                    fileList: info.fileList.filter(file => { file.url = `/api/images/${this.state.posterUrl}`; return !!file.status })
                                                                })

                                                            }}
                                                            maxCount={1}
                                                        >
                                                            <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                                        </Upload>
                                                    </Form.Item>
                                                </Col>
                                                <Col className="event-col" sm={12} lg={12}>
                                                    <Form.Item
                                                        wrapperCol={{ sm: 24 }}
                                                        name="name"
                                                        label={<Title className="normalLabel" level={4}>Tên sự kiện</Title>}
                                                        rules={[{ required: true, message: 'Cần nhập tên sự kiện' }]}
                                                    >
                                                        <Input placeholder="Tên sự kiện..." />
                                                    </Form.Item>

                                                    <Form.Item
                                                        wrapperCol={{ sm: 24 }}
                                                        name="description"
                                                        label={<Title className="normalLabel" level={4}>Thông tin</Title>}
                                                        rules={[{ required: true, message: 'Cần nhập thông tin' }]}
                                                    >
                                                        <Input.TextArea rows={5} placeholder="Eg.mô tả yêu cầu" />
                                                    </Form.Item>

                                                    <Row >
                                                        <Col span={12}>
                                                            <Form.Item
                                                                wrapperCol={{ sm: 22 }}
                                                                label={<Title className="normalLabel" level={4}>Ngày</Title>}
                                                                rules={[{ required: true, message: 'Cần chọn ngày bắt đầu!' }]}
                                                                name="startDate"
                                                            >
                                                                <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu..." />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={12}>
                                                            <Form.Item
                                                                wrapperCol={{ sm: 24 }}
                                                                label={<Title className="normalLabel" level={4}>Giờ</Title>}
                                                                rules={[{ required: true, message: 'Cần chọn giờ bắt đầu!' }]}
                                                                name="startTime"
                                                            >
                                                                <TimePicker format="HH:mm" placeholder="Chọn giờ..." />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <Form.Item
                                                        wrapperCol={{ sm: 24 }}
                                                        name="address"
                                                        label={<Title className="normalLabel" level={4}>Địa điểm</Title>}
                                                        rules={[{ required: true, message: 'Cần nhập địa điểm' }]}
                                                    >
                                                        <Input placeholder="Địa điểm..." />
                                                    </Form.Item>
                                                    <Row>
                                                        <Col span={24} style={{ marginTop: '20px' }}>
                                                            <div style={{ textAlign: 'center' }}>
                                                                <div >
                                                                    <Button
                                                                        onClick={this.goBack}
                                                                        className="back"
                                                                        style={{ marginRight: 20 }}
                                                                    >
                                                                        Hủy
                                                    </Button>
                                                                    <Button htmlType="submit" className="add" >
                                                                        Cập nhật
                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </Col>
                                    <Col className="event-col" sm={24} lg={12}>
                                        <Tabs defaultActiveKey="1" >
                                            <TabPane tab='Loại khách mời' key={2}>
                                                <GuestTypeView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistguesttype} data={this.state.listguesttype} />
                                            </TabPane>
                                            <TabPane tab='Phòng hội thoại' key={4}>
                                                <GroupView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistgroup} data={this.state.listgroups}></GroupView>
                                            </TabPane>
                                        </Tabs>
                                    </Col>
                                </Row>
                            </TabPane>
                            <TabPane tab='Kịch bản' key={2}>
                                <div className="flex-container-row">
                                    {/* <Title className="event-detail-title" level={3}>Kịch bản</Title> */}
                                    <Title level={4}>Kịch bản</Title>
                                    <Button className="flex-row-item-right" ><Link to={`/addscriptsclone/${this.props.match.params.id}`}>Thêm</Link></Button>
                                </div>
                                <ListScripts eventId={this.props.match.params.id} />
                            </TabPane>
                            <TabPane tab='Công việc' key={3}>
                                <ListActionsClone eventId={this.props.match.params.id} />
                            </TabPane>
                        </Tabs>
                    </div>


                </Content >
            );
        }
        else {
            return null
        }

    }
}

export default editevent;