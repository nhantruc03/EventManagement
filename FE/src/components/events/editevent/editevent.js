import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../env"
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
} from "antd";
import {
    UploadOutlined,
} from "@ant-design/icons";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import SelectUser from '../addevent/forAvailUser/selectUsers'
import AddTagType from "../addevent/add_TagType";
import { Message } from "../../service/renderMessage";
import { Link } from "react-router-dom";
import moment from 'moment'
import EventAssign from "../details/EventAssign/EventAssign";
import GuestTypeView from "./GuestType/guestTypeView";
import GuestView from "./Guest/guestView";
import GroupView from "./Group/groupView";
const { Option } = Select;
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
        let temp_user = this.state.listusersforevent.filter(x => x._id === b)[0];
        this.setState({
            listEventAssign: a,
            listusers: [...this.state.listusers, temp_user],
            listusersforevent: this.state.listusersforevent.filter(x => x._id !== temp_user._id),
        })
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
            'posterUrl': this.state.posterUrl,
        }

        console.log('Received values of form: ', data);

        await trackPromise(axios.put('/api/events/' + this.state.data._id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                Message('Sửa thành công', true, this.props);
            })
            .catch(err => {
                Message('Sửa thất bại', false);
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
                removeuserfromevent={(e) => this.removeuserfromevent(e)}
                addusertoevent={(e) => this.addusertoevent(e)}
                listusers={this.state.listusers}
                listusersforevent={this.state.listusersforevent}
            />
        );
    };

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

                        <Row>
                            <Col span={6} style={{ padding: 20 }}>
                                <Form
                                    name="validate_other"
                                    {...formItemLayout}
                                    onFinish={(e) => this.onFinish(e)}
                                    layout="vertical"
                                    initialValues={this.state.data}
                                >
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="eventTypeId"
                                        label={<Title level={4}>Hình thức</Title>}
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
                                        label={<Title level={4}>Tags</Title>}
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
                                        <Input.TextArea rows={6} placeholder="Eg.mô tả yêu cầu" />
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
                                    <Title className="normalLabel" level={4}>Ảnh đại diện hiện tại</Title>
                                    <Image src={`/api/images/${this.state.data.posterUrl}`}></Image>
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
                                                    fileList: info.fileList.filter(file => { file.url = `api/images/${this.state.posterUrl}`; return !!file.status })
                                                })

                                            }}
                                            maxCount={1}
                                        >
                                            <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                        </Upload>
                                    </Form.Item>

                                    <br></br>
                                    <div >
                                        <Button
                                            onClick={this.goBack}
                                            className="back"
                                            style={{ marginRight: 20 }}
                                        >
                                            Hủy
                                        </Button>
                                        <Button htmlType="submit" className="add" >
                                            Tạo mới
                                        </Button>
                                    </div>
                                </Form>
                            </Col>
                            <Col span={12} style={{ padding: 20 }}>
                                <div >
                                    <Title level={4}>Ban tổ chức</Title>
                                    <Row>
                                        <Col span={18}>
                                            <Select
                                                id="1"
                                                mode="multiple"
                                                allowClear
                                                style={{ width: '100%' }}
                                                placeholder="Chọn ban tổ chức..."
                                                filterOption={(input, option) =>
                                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                maxTagCount='responsive'
                                                value={this.state.listusersforevent.reduce((a, o) => { a.push(o._id); return a }, [])}
                                                disabled={true}
                                            >
                                                {this.state.listusersforevent.map((e) => <Option key={e._id}>{e.name}</Option>)}
                                            </Select>
                                        </Col>

                                        <Col span={6}>
                                            <Button style={{ width: '100%', height: '40px', borderRadius: '6px' }} onClick={() => this.setModal2Visible(true)}>Thêm</Button>
                                        </Col>
                                    </Row>
                                </div>
                                <div >
                                    <Title level={4}>Phân công</Title>
                                    <EventAssign canDelete={true} update={this.updateEventAssign} eventId={this.props.match.params.id} listRole={this.state.listRole} listFaculty={this.state.listFaculty} data={this.state.listEventAssign}
                                        availUser={this.state.listusersforevent}
                                    />
                                </div>
                                <div >
                                    <Title level={4}>Loại khách mời</Title>
                                    <GuestTypeView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistguesttype} data={this.state.listguesttype} />
                                </div>
                                <div >
                                    <Title level={4}>Khách mời</Title>
                                    <GuestView canDelete={true} data={this.state.listguest} listguesttype={this.state.listguesttype} update={this.updateguest} />
                                </div>
                            </Col>
                            <Col span={6}>
                                <Title level={4}>Phòng hội thoại</Title>
                                {/* <AddTagType update={(e) => this.updatelistgroup(e)} /> */}
                                <GroupView canDelete={true} eventId={this.props.match.params.id} update={this.updatelistgroup} data={this.state.listgroups}></GroupView>
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
