import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../env"
import { v1 as uuidv1 } from 'uuid';
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
    Tabs,
    Breadcrumb,
} from "antd";
import {
    UploadOutlined,
} from "@ant-design/icons";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import SelectUser from './forAvailUser/selectUsers'
import AddGuest from './forGuest/addGuest'
import ListEventAssign from './EventAssign/ListEventAssign'
import AddTagType from "./add_TagType";
import GuestView from "./forGuest/guestView";
import EventAssignView from "./EventAssign/EventAssignView";
import { Link } from "react-router-dom";
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


class addevents extends Component {
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
        }
    }

    addusertoevent = (e) => {
        let temp_eventAssign = {
            userId: e,
            facultyId: {},
            roleId: {}
        }
        this.setState({
            listusers: this.state.listusers.filter(x => x._id !== e._id),
            listusersforevent: [...this.state.listusersforevent, e],
            listEventAssign: [...this.state.listEventAssign, temp_eventAssign]
        })
    }

    removeuserfromevent = (e) => {
        this.setState({
            listusers: [...this.state.listusers, e],
            listusersforevent: this.state.listusersforevent.filter(x => x._id !== e._id),
            listEventAssign: this.state.listEventAssign.filter(x => x.userId._id !== e._id)
        })
    }

    addguest = (e) => {
        this.setState({
            listguest: [...this.state.listguest, e]
        })
    }

    deleteguest = (e) => {
        this.setState({
            listguest: this.state.listguest.filter(x => x.id !== e)
        })
    }

    updateguest = (e) => {
        this.setState({
            listguest: e
        })
    }

    updateEventAssign = (e) => {
        console.log(e)
        this.setState({
            listEventAssign: e
        })
    }

    async componentDidMount() {
        this._isMounted = true;
        const [users, eventTypes, tags, faculties, roles] = await trackPromise(Promise.all([
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
                )
        ]));


        if (users !== null && eventTypes !== null && tags !== null && roles !== null && faculties !== null) {
            if (this._isMounted) {
                console.log(users)
                this.setState({
                    listRole: roles,
                    listFaculty: faculties,
                    listusers: users,
                    listeventtype: eventTypes,
                    listtags: tags
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
        let temp_listEventAssign = [];
        this.state.listEventAssign.forEach(e => {
            let temp = {
                userId: e.userId._id,
                facultyId: e.facultyId._id,
                roleId: e.roleId._id,
            }
            temp_listEventAssign.push(temp)
        })
        let data = {
            ...values,
            'availUser': this.state.listusersforevent.reduce((a, o) => { a.push(o._id); return a }, []),
            'startDate': values['startDate'].format('YYYY-MM-DD'),
            'startTime': values['startTime'].toDate(),
            // .toDate
            'posterUrl': values['posterUrl'].fileList[0].response.url,
            'guestTypes': this.state.listguesttype,
            'guests': this.state.listguest,
            'groups': this.state.listgroups,
            'eventAssigns': temp_listEventAssign
        }

        console.log('Received values of form: ', data);

        await trackPromise(axios.post('/api/events/start', data, {
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
    };

    setModal2Visible(modal2Visible) {
        this.setState({ modal2Visible });
    }
    setModal2Visible2(modal2Visible2) {
        this.setState({ modal2Visible2 });
    }
    setModal2Visible3(modal2Visible3) {
        this.setState({ modal2Visible3 });
    }

    updatelistguesttype = (values) => {
        let temp = this.state.listguest.filter(e => values.includes(e.guestTypeName))
        console.log('after delete', temp)
        this.setState({
            listguesttype: values,
            listguest: temp
        })
    }

    updatelistgroup = (values) => {
        this.setState({
            listgroups: values,
        })
    }

    renderguest = () => this.state.listguesttype.map((e, key) =>
        <TabPane tab={e} key={key}><GuestView type={e} list={this.state.listguest} /></TabPane>
    )

    renderModel = () => {
        return (
            <SelectUser
                removeuserfromevent={(e) => this.removeuserfromevent(e)}
                addusertoevent={(e) => this.addusertoevent(e)}
                listusers={this.state.listusers}
                listusersforevent={this.state.listusersforevent}
            />
        );
    };

    renderModel2 = () => {
        return (
            <AddGuest listguesttype={this.state.listguesttype} data={this.state.listguest} addGuest={(e) => this.addguest(e)} deleteguest={(e) => { this.deleteguest(e) }} updateguest={(e) => { this.updateguest(e) }} />
        )
    }

    renderModel3 = () => {
        return (
            <ListEventAssign listRole={this.state.listRole} listFaculty={this.state.listFaculty} data={this.state.listEventAssign} update={(e) => { this.updateEventAssign(e) }} />
        )
    }

    finishaddguesttype = (values) => {
        console.log(values)
        values._id = uuidv1();
        this.setState({
            listguesttype: [...this.state.listguesttype, values]
        })
        this.formcreateguesttype.current.resetFields();
        this.setModal2Visible3(false)
    }


    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <Col span={8}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item >
                                <Link to="/events">Sự kiện</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Thêm mới sự kiện
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row >

                <div className="site-layout-background-main">
                    <Form
                        name="validate_other"
                        {...formItemLayout}
                        onFinish={(e) => this.onFinish(e)}
                        layout="vertical"
                        className="event-form"
                    >
                        <Row>
                            <Col className="event-col" sm={24} lg={10}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="eventTypeId"
                                    label={<Title level={4}>Hình thức</Title>}
                                    hasFeedback
                                    rules={[{ required: true, message: 'Cần chọn hình thức sự kiện!' }]}
                                >
                                    <Select placeholder="Chọn hình thức sự kiện">
                                        {this.state.listeventtype.map((e) => <Option key={e._id}>{e.name}</Option>)}
                                    </Select>
                                </Form.Item>

                                <Title level={4}>Ban tổ chức</Title>
                                <div className="flex-container-row">
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


                                    <Button className="flex-row-item-right" onClick={() => this.setModal2Visible(true)}>Thêm</Button>
                                </div>

                                <div className="flex-container-row">
                                    <Title level={4}>Phân công</Title>
                                    <Button className="flex-row-item-right" onClick={() => this.setModal2Visible3(true)} >Phân công</Button>
                                </div>

                                <EventAssignView data={this.state.listEventAssign} />


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
                                        {this.state.listtags.map((e) => <Option key={e._id}>{e.name}</Option>)}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="guestTypes"
                                    label={<Title level={4}>Loại khách mời</Title>}
                                    hasFeedback
                                // rules={[{ message: 'Cần chọn ban tổ chức!' }]}
                                >
                                    <AddTagType update={(e) => this.updatelistguesttype(e)} />
                                </Form.Item>

                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="guests"
                                    label={<Title level={4}>Khách mời</Title>}
                                    hasFeedback
                                >
                                    <Button onClick={() => this.setModal2Visible2(true)} >Chỉnh sửa</Button>
                                </Form.Item>
                                <Tabs style={{ width: '90%' }} defaultActiveKey="1" >
                                    {this.renderguest()}
                                </Tabs>
                            </Col>
                            <Col className="event-col" sm={24} lg={10}>
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
                            </Col>
                            <Col className="event-col" sm={24} lg={4}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="chatRooms"
                                    label={<Title level={4}>Phòng hội thoại</Title>}
                                    hasFeedback
                                // rules={[{ message: 'Cần chọn ban tổ chức!' }]}
                                >
                                    <AddTagType update={(e) => this.updatelistgroup(e)} />
                                </Form.Item>

                            </Col>
                        </Row>
                        <br></br>
                        <Form.Item wrapperCol={{ span: 24, offset: 9 }}>
                            <Button
                                onClick={this.goBack}
                                className="back"
                                style={{ width: 150, marginRight: 20 }}
                            >
                                Hủy
                            </Button>
                            <Button htmlType="submit" className="add" style={{ width: 150 }}>
                                Tạo mới
                            </Button>
                        </Form.Item>
                    </Form>
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
                    title="Thêm khách mời"
                    centered
                    visible={this.state.modal2Visible2}
                    onOk={() => this.setModal2Visible2(false)}
                    onCancel={() => this.setModal2Visible2(false)}
                    width="70%"
                    pagination={false}
                    footer={false}
                >
                    {this.renderModel2()}
                </Modal>

                <Modal
                    title="Phân công"
                    centered
                    visible={this.state.modal2Visible3}
                    onOk={() => this.setModal2Visible3(false)}
                    onCancel={() => this.setModal2Visible3(false)}
                    width="70%"
                    pagination={false}
                    footer={false}
                >
                    {this.renderModel3()}
                </Modal>
            </Content >
        );
    }
}

export default addevents;
