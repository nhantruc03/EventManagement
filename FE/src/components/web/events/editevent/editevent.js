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
import { w3cwebsocket } from 'websocket';
import * as XLSX from 'xlsx'
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
            data: null,
        }
    }

    addusertoevent = async (e) => {
        let temp_eventAssign = {
            userId: e,
            eventId: this.props.match.params.id,
        }
        await trackPromise(
            axios.post('/api/event-assign', [temp_eventAssign], {
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
                        notification: res.data.notification
                    }))

                    message.success('Thêm thành công')
                })
                .catch(err => {
                    message.error('Thêm thất bại')
                }))
    }

    addlistusertoevent = async (data) => {
        await trackPromise(
            axios.post('/api/event-assign', data, {
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
        console.log(values['startDate'].toDate())
        let data = {
            ...values,
            'startDate': moment(values['startDate'].toDate()).format('YYYY-MM-DD'),
            'startTime': values['startTime'].toDate(),
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

    updatelistgroup = (values) => {
        this.setState({
            listgroups: values,
        })
    }


    renderModel = () => {
        return (
            <SelectUser
                canDelete={false}
                // removeuserfromevent={(e) => this.removeuserfromevent(e)}
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

    render() {
        if (this.state.data) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }
                    }>
                        <Col span={8}>
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
                        </Col>
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
                                    <TabPane tab='Phòng hội thoại' key={4}>
                                        <GroupView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistgroup} data={this.state.listgroups}></GroupView>
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
                </Content >
            );
        }
        else {
            return null
        }

    }
}

export default editevent;
