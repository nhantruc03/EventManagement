import { Button, Col, DatePicker, Form, Image, Input, message, Row, Select } from 'antd';
import Title from 'antd/lib/typography/Title';
import Dragger from 'antd/lib/upload/Dragger';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../../env'
import {
    InboxOutlined
} from "@ant-design/icons";
import axios from 'axios';
import moment from 'moment'
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};


class editAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            data: null,
            coverUrl: undefined,
            listTags: null,
            listPriorities: null,
            listFaculties: null,
            event: null,
            actionTypes: null,
        }
    }
    async componentDidMount() {
        this._isMounted = true;
        const [event, tags, priorities, faculties, actionTypes] = await trackPromise(Promise.all([
            axios.get('/api/events/' + this.props.data.eventId._id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/action-tags/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/action-priorities/getAll', {}, {
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
            axios.post('/api/action-types/getAll', { eventId: this.props.data.eventId._id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]))

        if (tags !== null && priorities !== null) {
            console.log(event)
            this.setState({
                event: event,
                listTags: tags,
                listPriorities: priorities,
                listFaculties: faculties,
                actionTypes: actionTypes
            })
        }
        // prepare init data
        console.log('data', this.props.data)
        let temp_availUser = []
        this.props.data.availUser.forEach(e => {
            temp_availUser.push(e._id)
        })

        let temp_tagsId = []
        this.props.data.tagsId.forEach(e => {
            temp_tagsId.push(e._id)
        })
        let data = {
            ...this.props.data,
            facultyId: this.props.data.facultyId._id,
            managerId: this.props.manager.userId._id,
            actionTypeId: this.props.data.actionTypeId._id,
            availUser: temp_availUser,
            tagsId: temp_tagsId,
            startDate: moment(this.props.data.startDate),
            endDate: moment(this.props.data.endDate),
            priorityId: this.props.data.priorityId._id,
            coverUrl: undefined
        }
        this.setState({
            data: data,
            coverUrl: this.props.data.coverUrl
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onFinish = async (e) => {

        let data = {
            ...e,
            coverUrl: this.state.coverUrl,
            eventId: this.props.data.eventId._id,
        }
        await trackPromise(
            axios.put('/api/actions/' + this.props.data._id, data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {

                    let temp_Action = res.data.data
                    let temp_actionAssign = res.data.actionAssign.filter(e => e.role === 2)
                    let temp_manager = res.data.actionAssign.filter(e => e.role === 1)[0]
                    console.log('temp_manager', temp_manager)
                    // prepare init data
                    let temp_availUser = []
                    temp_Action.availUser.forEach(e => {
                        temp_availUser.push(e._id)
                    })

                    let temp_tagsId = []
                    temp_Action.tagsId.forEach(e => {
                        temp_tagsId.push(e._id)
                    })

                    let data = {
                        ...temp_Action,
                        facultyId: temp_Action.facultyId._id,
                        managerId: temp_manager.userId._id,
                        actionTypeId: temp_Action.actionTypeId._id,
                        availUser: temp_availUser,
                        tagsId: temp_tagsId,
                        startDate: moment(temp_Action.startDate),
                        endDate: moment(temp_Action.endDate),
                        priorityId: temp_Action.priorityId._id,
                        coverUrl: undefined
                    }
                    this.setState({
                        data: data,
                        coverUrl: temp_Action.coverUrl
                    })
                    message.success('Cập nhật thành công');
                    this.props.update(temp_Action, temp_manager, temp_actionAssign)

                })
                .catch(err => {
                    console.log(err)
                    message.error('Cập nhật thất bại');
                }))
        console.log(data)
    }

    renderView = () => {
        if (this.state.data !== null) {
            return (
                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={(e) => this.onFinish(e)}
                    layout="vertical"
                    className="form"

                    initialValues={this.state.data}
                >
                    <Row >
                        <Col sm={24} lg={12}>
                            <Row>
                                <Col span={12}>
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
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        label="Ban"
                                        rules={[{ required: true, message: 'Cần chọn ban!' }]}
                                        name="facultyId"
                                    >
                                        <Select>
                                            {this.state.listFaculties.map(e => <Option key={e._id}>{e.name}</Option>)}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                name="description"
                                label="Mô tả"
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập mô tả công việc!' }]}
                            >
                                <Input.TextArea rows={4} placeholder="Nhập mô tả công việc..." />

                            </Form.Item>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        label="Bắt đầu"
                                        rules={[{ required: true, message: 'Cần chọn ngày bắt đầu!' }]}
                                        name="startDate"
                                    >
                                        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        label="Kết thúc"
                                        rules={[{ required: true, message: 'Cần chọn ngày kết thức!' }]}
                                        name="endDate"
                                    >
                                        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc..." />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <Image style={{ maxWidth: '200px' }} src={`/api/images/${this.state.coverUrl}`}></Image>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="coverUrl"
                                        label={<Title className="normalLabel" level={4}>Ảnh đại diện</Title>}
                                    // rules={[{ required: true, message: 'Cần tải lên poster' }]}
                                    >
                                        <Dragger
                                            fileList={this.state.fileList}
                                            action='/api/uploads'
                                            listType="picture"
                                            showUploadList={false}
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
                                                        coverUrl: info.file.response.url
                                                    })

                                                }
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
                                </Col>
                            </Row>
                        </Col>
                        <Col sm={24} lg={12}>
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
                                    {this.state.event.availUser.map(e => <Option key={e._id}>{e.name}</Option>)}
                                </Select>
                            </Form.Item>
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
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {/* {this.state.listtags.map((e) => <Option key={e._id}>{e.name}</Option>)} */}
                                    {this.state.event.availUser.map(e => <Option key={e._id}>{e.name}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                label="Loại công việc"
                                rules={[{ required: true, message: 'Cần chọn loại công việc!' }]}
                                name="actionTypeId"
                            >
                                <Select>
                                    {this.state.actionTypes.map(e => <Option key={e._id}>{e.name}</Option>)}
                                </Select>
                            </Form.Item>
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
                                    <Button htmlType="submit" className="add">Cập nhật</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Form>
            )
        }
        else {
            return null
        }

    }
    render() {
        return (
            <div>
                {this.renderView()}
            </div>
        );

    }
}

export default editAction;