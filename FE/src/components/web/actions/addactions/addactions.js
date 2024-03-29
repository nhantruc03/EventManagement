import { Button, Col, DatePicker, Form, Input, message, Row, Select, Steps, TimePicker } from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
import {
    InboxOutlined
} from "@ant-design/icons";
import Dragger from 'antd/lib/upload/Dragger';
import { w3cwebsocket } from 'websocket';
import moment from 'moment'
import * as PushNoti from '../../helper/pushNotification'
import ApiFailHandler from '../../helper/ApiFailHandler'
import { WebSocketServer } from '../../../env'
const client = new w3cwebsocket(WebSocketServer);
const { Step } = Steps;
const { Option } = Select;
const steps = [
    {
        title: 'Tổng quát',
    },
    {
        title: 'Chi tiết',
    },
];

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class addactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            data1: null,
            coverUrl: null,
            listTags: null,
            listPriorities: null
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [tags, priorities] = await trackPromise(Promise.all([
            axios.post('/api/action-tags/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/action-priorities/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]))

        if (tags !== null && priorities !== null) {
            this.setState({
                listTags: tags,
                listPriorities: priorities
            })
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    next = () => {
        this.setState({
            current: this.state.current < 1 ? this.state.current + 1 : this.state.current
        })
    }

    back = () => {
        this.setState({
            current: this.state.current > 0 ? this.state.current - 1 : this.state.current
        })
    }

    onFinish_Form1 = async (e) => {
        let data = {
            ...e,
            endTime: e.endTime.utc(true).toDate(),
            endDate: e.endDate.utc(true).format('YYYY-MM-DD'),
            eventId: this.props.event._id
        }


        if (this.state.coverUrl !== null) {
            data = {
                ...data,
                coverUrl: this.state.coverUrl
            }
        }

        let expireEventDate = moment(this.props.event.expireDate).utcOffset(0)
        let beginEventDate = moment(this.props.event.beginDate).utcOffset(0)
        
        if (new Date(data.endDate) > new Date(expireEventDate.format('YYYY-MM-DD'))) {
            message.error(`Hạn chót công việc phải trước hạn chót sự kiện ${expireEventDate.format('DD/MM/YYYY')}`);
        }
        else if (new Date(data.endDate) < new Date(beginEventDate.format('YYYY-MM-DD'))) {
            message.error(`Hạn chót công việc phải sau thời gian bắt đầu sự kiện ${beginEventDate.format('DD/MM/YYYY')}`);
        }
        else {
            this.setState({
                data1: data
            })

            this.next()
        }
    }

    onFinish_Form2 = async (e) => {
        let data = {
            ...this.state.data1,
            ...e,
        }

        await trackPromise(axios.post('/api/actions/start', data, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then(res => {
                message.success('Tạo thành công');


                client.send(JSON.stringify({
                    type: "sendListNotifications",
                    notifications: res.data.Notifications
                }))
                PushNoti.sendListPushNoti(res.data.Notifications)
                let temp = res.data.action
                temp.endTime = moment(temp.endTime).utcOffset(0)
                temp.endDate = moment(temp.endDate).utcOffset(0)
                try {
                    this.form2.current.resetFields()
                    this.back()
                    this.form1.current.resetFields()
                    this.setState({
                        coverUrl: null
                    })
                }
                catch (ex) {
                    console.log(ex)
                }
                this.props.done(temp)
            })
            .catch(err => {
                message.error('Tạo thất bại');
                ApiFailHandler(err.response?.data?.error)
            }))

    }

    form1 = React.createRef();
    form2 = React.createRef();
    renderView = () => {
        if (this.state.listTags !== null) {
            if (this.state.current === 0) {
                return (
                    <Form
                        ref={this.form1}
                        name="validate_other"
                        {...formItemLayout}
                        onFinish={(e) => this.onFinish_Form1(e)}
                        layout="vertical"
                        className="form"
                    >
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={24} style={{ padding: '15px' }}>
                                <Title style={{ color: '#017567' }} level={5}>Tên sự kiện</Title>
                                <p>{this.props.event.name}</p>
                            </Col>

                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="name"
                                    label="Tên công việc"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Cần nhập tên công việc!' }]}
                                >
                                    <Input placeholder="Nhập tên công việc..."></Input>

                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="description"
                                    label="Mô tả"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Cần nhập mô tả công việc!' }]}
                                >
                                    <Input.TextArea rows={4} placeholder="Nhập mô tả công việc..." />

                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Row>
                                    <Col sm={24} md={8}>
                                        <Form.Item
                                            wrapperCol={{ sm: 24 }}
                                            label="Ngày kết thúc"
                                            rules={[{ required: true, message: 'Cần chọn ngày kết thức!' }]}
                                            name="endDate"
                                        >
                                            <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc..." />
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={8}>
                                        <Form.Item
                                            wrapperCol={{ sm: 24 }}
                                            label="Giờ kết thúc"
                                            rules={[{ required: true, message: 'Cần chọn ngày bắt đầu!' }]}
                                            name="endTime"
                                        >
                                            {/* <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu..." /> */}
                                            <TimePicker format="HH:mm" placeholder="Chọn giờ kết thúc"></TimePicker>
                                        </Form.Item>
                                    </Col>
                                    <Col sm={24} md={8}>
                                        <Form.Item
                                            wrapperCol={{ sm: 24 }}
                                            label="Ban"
                                            rules={[{ required: true, message: 'Cần chọn ban!' }]}
                                            name="facultyId"
                                        >
                                            <Select>
                                                {this.props.faculties.map(e => <Option key={e._id}>{e.name}</Option>)}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="coverUrl"
                                    label={<Title className="normalLabel" level={4}>Ảnh đại diện</Title>}
                                    rules={[{ required: true, message: 'Cần tải lên poster' }]}
                                >
                                    <Dragger
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
                                                message.success(`${info.file.response.url} tải lên thành công`);
                                                this.setState({
                                                    coverUrl: info.file.response.url
                                                })

                                            }
                                            this.setState({
                                                fileList: info.fileList.filter(file => { file.url = `${window.resource_url}${this.state.posterUrl}`; return !!file.status })
                                            })

                                        }}
                                        maxCount={1}
                                    >
                                        <p className="ant-upload-text">Thả ảnh vào đây hoặc chọn từ trình duyệt</p>
                                        {/* <p className="ant-upload-hint">
                                            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                                            band files
                                        </p> */}
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                    </Dragger>
                                </Form.Item>
                                <div className="flex-container-row" style={{ marginTop: '20px' }}>
                                    <Button htmlType="submit" className="flex-row-item-right add">Tiếp theo</Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                )
            }
            else {
                return (
                    <Form
                        ref={this.form2}
                        name="validate_other"
                        {...formItemLayout}
                        onFinish={(e) => this.onFinish_Form2(e)}
                        layout="vertical"
                        className="form"
                    // ref={this.form2}
                    // ref={(r) => { this.form2 = r }}
                    >
                        <Row style={{ marginTop: '20px' }}>
                            <Col span={24}>
                                <Col span={24}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="managerId"
                                        label="Phân công quản lý"
                                        hasFeedback
                                        rules={[{ required: true, message: 'Cần chọn người quản lý!' }]}
                                    >
                                        <Select
                                            showSearch
                                            allowClear
                                            style={{ width: '100%' }}
                                            placeholder="Chọn người phân công..."
                                            filterOption={(input, option) =>
                                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {/* {this.state.listtags.map((e) => <Option key={e._id}>{e.name}</Option>)} */}
                                            {this.props.event.availUser.map(e => <Option key={e._id}>{e.name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="availUser"
                                    label="Phân công cho"
                                    hasFeedback
                                    rules={[{ required: true, message: 'Cần chọn người được phân công!' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Chọn người phân công..."
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {/* {this.state.listtags.map((e) => <Option key={e._id}>{e.name}</Option>)} */}
                                        {this.props.event.availUser.map(e => <Option key={e._id}>{e.name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label="Loại công việc"
                                    rules={[{ required: true, message: 'Cần chọn loại công việc!' }]}
                                    name="actionTypeId"
                                >
                                    <Select>
                                        {this.props.actionTypes.map(e => <Option key={e._id}>{e.name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="tagsId"
                                    label="Tags"
                                    hasFeedback
                                // rules={[{ message: 'Cần chọn người được phân công!' }]}
                                >
                                    <Select
                                        mode="multiple"
                                        name="tagId"
                                        allowClear
                                        style={{ width: '100%' }}
                                        placeholder="Chọn tags..."
                                        filterOption={(input, option) =>
                                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {this.state.listTags.map((e) => <Option key={e._id}>{e.name}</Option>)}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label="Ưu tiên"
                                    rules={[{ required: true, message: 'Cần chọn độ ưu tiên!' }]}
                                    name="priorityId"
                                >
                                    <Select>
                                        {this.state.listPriorities.map((e) => <Option key={e._id}>{e.name}</Option>)}
                                    </Select>
                                </Form.Item>
                                <div className="flex-container-row" style={{ marginTop: '20px' }}>
                                    <div className="flex-row-item-right">
                                        <Button onClick={this.back} className="back">Quay về</Button>
                                        <Button htmlType="submit" className="add">Tạo</Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                )
            }
        }
        else {
            return null
        }

    }

    render() {
        return (
            <div className="add-action-container">
                <Steps current={this.state.current}>
                    {steps.map(item => (
                        <Step key={item.title} title={item.title} />
                    ))}
                </Steps>
                {this.renderView()}
            </div>
        );
    }
}

export default addactions;