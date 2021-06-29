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
    Popconfirm,
    Modal,
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
import ApiFailHandler from '../../helper/ApiFailHandler'
import getPermission from "../../helper/Credentials"
import { WebSocketServer } from '../../../env'
const client = new w3cwebsocket(WebSocketServer);
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
            currentUser: JSON.parse(localStorage.getItem('login')),
            currentPermissions: [],
            modalVisible: false
        }
    }

    setModalVisible = (modalVisible) => {
        this.setState({
            modalVisible
        })
    }

    form = React.createRef()
    renderModel = () => {
        return (
            <Form
                ref={this.form}
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinishClone(e)}
                layout="vertical"
                initialValues={this.state.ActionTypeForEdit}
            >
                <Form.Item
                    wrapperCol={{ sm: 24 }}
                    name="name"
                    rules={[{ required: true, message: "Cần nhập tên sự kiện" }]}
                >
                    <Input placeholder="Tên sự kiện..." />
                </Form.Item>
                <br></br>
                <div className="flex-container-row">
                    <div className="flex-container-row flex-row-item-right">
                        <Button onClick={() => this.setModalVisible(false)} style={{ marginRight: 5 }} className="back">
                            Hủy
                        </Button>
                        <Button htmlType="submit" className="add">
                            Tạo
                        </Button>
                    </div>
                </div>
            </Form>
        )
    }

    onFinishClone = async (e) => {
        let data = {
            ...e,
            eventId: this.props.match.params.id
        }

        const result = await trackPromise(
            axios.post('/api/events/start-clone', data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Tạo thành công');
                    return true
                })
                .catch(err => {
                    message.error('Tạo thất bại');
                    ApiFailHandler(err.response?.data?.error)
                    return false
                })
        )
        if (result) {
            this.form.current.resetFields()
            this.setModalVisible(false)
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
        const [users, eventTypes, tags, faculties, roles, event, listeventassign, guesttypes, groups, permissons] = await trackPromise(Promise.all([
            axios.post('/api/users/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/event-types/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/tags/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/faculties/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/roles/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.get('/api/events/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/event-assign/getAll', { eventId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/guest-types/getAll', { eventId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/groups/getAll', { eventId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            getPermission(this.props.match.params.id).then(res => res)

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
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })

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
                    'startTime': moment(event.startTime).utcOffset(0),
                    'startDate': moment(event.startDate).utcOffset(0),
                    'eventTypeId': event.eventTypeId._id,
                    'tagId': temp_tagId
                }


                let temp_userForEvent = [];
                listeventassign.forEach(e => {
                    temp_userForEvent.push(e.userId._id)
                })
                let temp_userNotInEvent = users.filter(e => !temp_userForEvent.includes(e._id))
                console.log('permission', permissons)
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
                    listgroups: groups,
                    currentPermissions: permissons
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
            'startDate': values['startDate'].utc(true).format('YYYY-MM-DD'),
            'startTime': values['startTime'].utc(true).toDate(),
        }
        if (this.state.posterUrl !== null) {
            data = {
                ...data,
                'posterUrl': this.state.posterUrl,
            }
        }

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
                ApiFailHandler(err.response?.data?.error)
            }))
    };

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

    deleteEvent = async () => {
        const result = await trackPromise(axios.delete(`/api/events/${this.props.match.params.id}`, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                message.success('Xóa sự kiện thành công')
                return res.data.data
            })
            .catch(err => {
                message.error('Xóa sự kiện thất bại')
                ApiFailHandler(err.response?.data?.error)
            })
        )
        if (result) {
            this.setState({
                doneDelete: true
            })
        }
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
                ApiFailHandler(err.response?.data?.error)
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
                                    <Link to="/eventclones">Hồ sơ sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chi tiết
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            {this.state.currentUser.role === 'Admin' ?
                                <div className="flex-row-item-right">
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa chứ?"
                                        onConfirm={this.deleteEvent}
                                        okText="Đồng ý"
                                        cancelText="Hủy"
                                    >
                                        <Button className="delete">Xóa</Button>
                                    </Popconfirm>
                                    <Button style={{ marginLeft: 10 }} onClick={() => this.setModalVisible(true)} className="add ">Tạo sự kiện</Button>
                                </div>
                                : null
                            }
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
                        <Tabs defaultActiveKey="1" >
                            <TabPane style={{ padding: '0 15px' }} tab='Thông tin' key={1}>
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
                                                        <Image style={{ maxWidth: '110px' }} src={`${window.resource_url}${this.state.data.posterUrl}`}></Image>
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
                                                                    fileList: info.fileList.filter(file => { file.url = `${window.resource_url}${this.state.posterUrl}`; return !!file.status })
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

                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col span={24} style={{ marginTop: '20px' }}>
                                                    <div style={{ textAlign: 'center' }}>
                                                        <div >
                                                            {/* <Button
                                                                onClick={this.goBack}
                                                                className="back"
                                                                style={{ marginRight: 20 }}
                                                            >
                                                                Hủy
                                                            </Button> */}
                                                            <Button htmlType="submit" className="add" >
                                                                Cập nhật
                                                            </Button>
                                                        </div>
                                                    </div>
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
                            <TabPane style={{ padding: '0 15px' }} tab='Kịch bản' key={2}>
                                <ListScripts eventId={this.props.match.params.id} currentPermissions={this.state.currentPermissions} />
                            </TabPane>
                            <TabPane style={{ padding: '0 15px' }} tab='Công việc' key={3}>
                                <ListActionsClone eventId={this.props.match.params.id} currentPermissions={this.state.currentPermissions} />
                            </TabPane>
                        </Tabs>
                    </div>

                    <Modal
                        title="Tạo sự kiện"
                        centered
                        visible={this.state.modalVisible}
                        onOk={() => this.setModalVisible(false)}
                        onCancel={() => this.setModalVisible(false)}
                        width="30%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModel()}
                    </Modal>
                </Content >
            );
        }
        else {
            return null
        }

    }
}

export default editevent;