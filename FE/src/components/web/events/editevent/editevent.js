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
    Modal,
    Upload,
    message,
    Breadcrumb,
    Image,
    Tabs,
    Popconfirm,
} from "antd";
import {
    UploadOutlined,
} from "@ant-design/icons";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import SelectUser from '../addevent/forAvailUser/selectUsers'
import { Link } from "react-router-dom";
import moment from 'moment'
import EventAssign from "../details/EventAssign/EventAssign";
import GuestTypeView from "./GuestType/guestTypeView";
import GuestView from "./Guest/guestView";
import GroupView from "./Group/groupView";
import ParticipantsView from "./Participants/participantsView";
import { w3cwebsocket } from 'websocket';
import * as XLSX from 'xlsx'
import Credentials from "./Credentials/Credentials";
import * as constants from "../../constant/actions"
import checkPermission from "../../helper/checkPermissions"
import getPermission from "../../helper/Credentials"
import * as PushNoti from "../../helper/pushNotification"
import ApiFailHandler from '../../helper/ApiFailHandler'
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
            modal2Visible: false,
            modal2Visible2: false,
            modal2Visible3: false,
            listusers: [],
            listusersforevent: [],
            listeventtype: [],
            listtags: [],
            fileList: [],
            posterUrl: null,
            listguest: [],
            listguesttype: [],
            listgroups: [],
            listEventAssign: [],
            listRole: [],
            listFaculty: [],
            listCredentials: [],
            data: null,
            currentPermission: [],
            listparticipants: [],
            modalCloneVisible: false
        }
    }

    setModalCloneVisible = (modalCloneVisible) => {
        this.setState({
            modalCloneVisible
        })
    }

    formClone = React.createRef()
    renderModelClone = () => {
        return (
            <Form
                ref={this.formClone}
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
            this.formClone.current.resetFields()
            this.setModalCloneVisible(false)
        }
    }

    addusertoevent = async (e) => {
        let temp_eventAssign = {
            data: [{ userId: e, eventId: this.props.match.params.id }],
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
                        listEventAssign: [...this.state.listEventAssign, ...res.data.data]
                    })

                    client.send(JSON.stringify({
                        type: "sendListNotifications",
                        notifications: res.data.notification
                    }))

                    PushNoti.sendListPushNoti(res.data.notification)

                    message.success('Thêm thành công')
                })
                .catch(err => {
                    message.error('Thêm thất bại')
                }))
    }

    addlistusertoevent = async (data) => {
        let temp = {
            data: data,
            eventId: this.props.match.params.id
        }
        await trackPromise(
            axios.post('/api/event-assign', temp, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    let list_resultEA = res.data.data
                    let list_resultUserId = []
                    let list_resultUser = []
                    list_resultEA.forEach(e => {
                        list_resultUserId.push(e.userId._id)
                        list_resultUser.push(e.userId)
                    })
                    this.setState({
                        listusers: this.state.listusers.filter(x => !list_resultUserId.includes(x._id)),
                        listusersforevent: [...this.state.listusersforevent, ...list_resultUser],
                        listEventAssign: [...this.state.listEventAssign, ...res.data.data]
                    })

                    client.send(JSON.stringify({
                        type: "sendListNotifications",
                        notifications: res.data.notification
                    }))

                    PushNoti.sendListPushNoti(res.data.notification)

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
        const [users, eventTypes, tags, faculties, roles, event, listeventassign, guesttypes, groups, credentials, permissions, listparticipants] = await trackPromise(Promise.all([
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
            axios.post('/api/credentials/getAll', {}, {
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
            getPermission(this.props.match.params.id)
                .then(res => res),
            axios.post('/api/participants/getAll', { eventId: this.props.match.params.id }, {
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
        ]));

        let guests = []
        if (guesttypes !== null) {

            let listguesttype = guesttypes.reduce((list, e) => { list.push(e._id); return list }, []);

            guests = await trackPromise(
                axios.post('/api/guests/getAll', { listguesttype: listguesttype }, {
                    headers: {
                        'Authorization': { AUTH }.AUTH
                    }
                })
                    .then((res) =>
                        res.data.data
                    )
                    .catch(err => {
                        ApiFailHandler(err.response?.data?.error)
                    }))
        }


        if (users !== null && eventTypes !== null && tags !== null && roles !== null && faculties !== null && event !== null && groups !== null) {
            if (this._isMounted) {
                // prepare data
                let temp_tagId = event.tagId.reduce((list, e) => { list.push(e._id); return list }, [])

                let data = {
                    ...event,
                    'startTime': moment(event.startTime).utcOffset(0),
                    'startDate': moment(event.startDate).utcOffset(0),
                    'eventTypeId': event.eventTypeId._id,
                    'tagId': temp_tagId
                }


                let temp_userForEvent = listeventassign.reduce((list, e) => { list.push(e.userId._id); return list }, [])

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
                    listgroups: groups,
                    listCredentials: credentials,
                    currentPermission: permissions,
                    listparticipants: listparticipants
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
            'startDate': values['startDate'].utc(true).toDate(),
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

    updatelistparticipants = (values) => {
        this.setState({
            listparticipants: values
        })
    }


    updatelistgroup = (values) => {
        this.setState({
            listgroups: values,
        })
    }

    renderModel = () => {
        return (
            <SelectUser
                canDelete={false}
                addusertoevent={(e) => this.addusertoevent(e)}
                listusers={this.state.listusers}
                listusersforevent={this.state.listusersforevent}
            />
        );
    };

    uploadExcelFile = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (e) => {
                const bufferArray = e.target.result

                const wb = XLSX.read(bufferArray, { type: 'buffer' });

                const wsname = wb.SheetNames[0]

                const ws = wb.Sheets[wsname]

                const data = XLSX.utils.sheet_to_json(ws)

                resolve(data)
            }
            fileReader.onerror = (err) => {
                reject(err)
            }
        })

        promise.then((result) => {
            let temp_list_user = []
            result.forEach(e => {
                temp_list_user.push(e.mssv.toString())
            })

            let temp = this.state.listusers.filter(e => temp_list_user.includes(e.mssv))
            let exist_user = []
            temp.forEach(e => {
                exist_user.push(e.mssv)
            })

            let temp_EventAssign = []
            result.forEach(e => {
                if (exist_user.includes(e.mssv.toString())) {
                    let temp = {
                        userId: this.getUserByMSSV(e.mssv.toString()),
                        facultyId: this.getFacultyByName(e.ban),
                        roleId: this.getRoleByName(e['chức vụ']),
                        eventId: this.props.match.params.id
                    }
                    temp_EventAssign.push(temp)
                }
            })
            // this.updateEventAssign(temp_EventAssign)
            this.addlistusertoevent(temp_EventAssign)
        })
    }

    uploadExcelFileForParticipants = (file) => {
        const promise = new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file)
            fileReader.onload = (e) => {
                const bufferArray = e.target.result

                const wb = XLSX.read(bufferArray, { type: 'buffer' });

                const wsname = wb.SheetNames[0]

                const ws = wb.Sheets[wsname]

                const data = XLSX.utils.sheet_to_json(ws)

                resolve(data)
            }
            fileReader.onerror = (err) => {
                reject(err)
            }
        })

        promise.then((result) => {
            result.forEach(e => {
                e.eventId = this.props.match.params.id
            })
            this.CreateParticipants(result)
        })
    }

    CreateParticipants = async (data) => {
        let temp = {
            data,
            eventId: this.props.match.params.id
        }

        await trackPromise(
            axios.post('/api/participants', temp, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    let data = res.data.data

                    this.setState({
                        listparticipants: [...this.state.listparticipants, ...data]
                    })
                    message.success('Thêm thành công')
                })
                .catch(err => {
                    message.error('Thêm thất bại')
                }))

    }


    getUserByMSSV = (mssv) => {
        let result
        this.state.listusers.forEach(e => {
            if (e.mssv === mssv) {
                result = e._id
            }
        })
        return result
    }

    getFacultyByName = (name) => {
        let result
        this.state.listFaculty.forEach(e => {
            if (name.toLowerCase() === e.name.toLowerCase()) {
                result = e._id
            }
        })
        return result
    }

    getRoleByName = (name) => {
        let result
        this.state.listRole.forEach(e => {
            if (name.toLowerCase() === e.name.toLowerCase()) {
                result = e._id
            }
        })
        return result
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

    render() {
        if (this.state.data) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }
                    }>
                        <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/events">Sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={`/events/${this.props.match.params.id}`}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chỉnh sửa
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            {checkPermission(this.state.currentPermission, constants.QL_SUKIEN_PERMISSION) ?
                                <div className="flex-row-item-right">
                                    <Popconfirm
                                        title="Bạn có chắc muốn xóa chứ?"
                                        onConfirm={this.deleteEvent}
                                        okText="Đồng ý"
                                        cancelText="Hủy"
                                    >
                                        <Button className="delete">Xóa</Button>
                                    </Popconfirm>
                                    <Button style={{ marginLeft: 10 }} onClick={() => this.setModalCloneVisible(true)} className="back">Tạo bản sao</Button>
                                    <Button style={{ marginLeft: 10 }} onClick={() => { this.props.history.push(`/eventreport/${this.props.match.params.id}`) }} className="back">Báo cáo</Button>
                                </div>
                                : null
                            }
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
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
                                        <Col className="event-col" sm={24} lg={12}>
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
                                                        if (!['image/jpeg', 'image/png'].includes(file.type)) {
                                                            message.error(`${file.name} không phải dạng ảnh`);
                                                        }
                                                        return ['image/jpeg', 'image/png'].includes(file.type);
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
                                        <Col className="event-col" sm={24} lg={12}>
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
                                    {checkPermission(this.state.currentPermission, constants.QL_SUKIEN_PERMISSION) ?
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
                                        : null}
                                </Form>
                            </Col>
                            <Col className="event-col" sm={24} lg={12}>
                                <Tabs defaultActiveKey="1" >
                                    <TabPane tab='Ban tổ chức' key={1}>
                                        <EventAssign uploadExcelFile={this.uploadExcelFile} onAddClick={() => this.setModal2Visible(true)} canDelete={true} update={this.updateEventAssign} eventId={this.props.match.params.id} listRole={this.state.listRole} listFaculty={this.state.listFaculty} data={this.state.listEventAssign}
                                            availUser={this.state.listusersforevent}
                                        />
                                    </TabPane>
                                    <TabPane tab='Loại khách mời' key={2}>
                                        <GuestTypeView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistguesttype} data={this.state.listguesttype} />
                                    </TabPane>
                                    <TabPane tab='Khách mời' key={3}>
                                        <GuestView canDelete={true} data={this.state.listguest} listguesttype={this.state.listguesttype} update={this.updateguest} />
                                    </TabPane>
                                    <TabPane tab='Người tham gia' key={4}>
                                        <ParticipantsView canEdit={true} canDelete={true} eventId={this.props.match.params.id} data={this.state.listparticipants} uploadExcelFile={this.uploadExcelFileForParticipants} update={this.updatelistparticipants} />
                                    </TabPane>
                                    <TabPane tab='Phòng hội thoại' key={5}>
                                        <GroupView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistgroup} data={this.state.listgroups}></GroupView>
                                    </TabPane>
                                    <TabPane tab='Phân quyền' key={6}>
                                        <Credentials canDelete={false} update={this.updateEventAssign} eventId={this.props.match.params.id} listCredentials={this.state.listCredentials} data={this.state.listEventAssign} />
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>

                    </div>

                    <Modal
                        title="Thêm ban tổ chức"
                        centered
                        visible={this.state.modal2Visible}
                        onOk={() => this.setModal2Visible(false)}
                        onCancel={() => this.setModal2Visible(false)}
                        width="80%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModel()}
                    </Modal>

                    <Modal
                        title="Tạo bản sao sự kiện"
                        centered
                        visible={this.state.modalCloneVisible}
                        onOk={() => this.setModalCloneVisible(false)}
                        onCancel={() => this.setModalCloneVisible(false)}
                        width="30%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModelClone()}
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
