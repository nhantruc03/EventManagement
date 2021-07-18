import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../../env"
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
    Upload,
    message,
    Breadcrumb,
} from "antd";
import {
    UploadOutlined,
} from "@ant-design/icons";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import AddTagType from "./add_TagType";
import { Link } from "react-router-dom";
import ApiFailHandler from '../../helper/ApiFailHandler'
const { Option } = Select;
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
            listeventtype: [],
            listtags: [],
            fileList: [],
            posterUrl: null,
            listguesttype: [],
            listgroups: [],
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [eventTypes, tags] = await trackPromise(Promise.all([
            axios.post('/api/event-types/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err=>{
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/tags/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err=>{
                    ApiFailHandler(err.response?.data?.error)
                })
        ]));


        if (eventTypes !== null && tags !== null) {
            if (this._isMounted) {
                this.setState({
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
        let data = {
            ...values,
            'startDate': values['startDate'].utc(true).format('YYYY-MM-DD'),
            'startTime': values['startTime'].utc(true).toDate(),
            'posterUrl': values['posterUrl'].fileList[0].response.url,
            'guestTypes': this.state.listguesttype,
            'groups': this.state.listgroups,
            'isClone': true
        }

        await trackPromise(axios.post('/api/events/start', data, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then(res => {
                message.success('Tạo thành công');
            })
            .catch(err => {
                message.error('Tạo thất bại');
                ApiFailHandler(err.response?.data?.error)
            }))
    };

    updatelistguesttype = (values) => {
        this.setState({
            listguesttype: values
        })
    }

    updatelistgroup = (values) => {
        this.setState({
            listgroups: values,
        })
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
                            <Col className="event-col" sm={24} lg={12}>
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
                                >
                                    <AddTagType update={(e) => this.updatelistguesttype(e)} />
                                </Form.Item>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label={<Title level={4}>Phòng hội thoại</Title>}
                                    hasFeedback
                                >
                                    <AddTagType update={(e) => this.updatelistgroup(e)} />
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
                                                fileList: info.fileList.filter(file => { file.url = `${window.resource_url}${this.state.posterUrl}`; return !!file.status })
                                            })

                                        }}
                                        maxCount={1}
                                    >
                                        <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                            {/* <Col className="event-col" sm={24} lg={4}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label={<Title level={4}>Phòng hội thoại</Title>}
                                    hasFeedback
                                >
                                    <AddTagType update={(e) => this.updatelistgroup(e)} />
                                </Form.Item>

                            </Col> */}
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
            </Content >
        );
    }
}

export default addevents;
