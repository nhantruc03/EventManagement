import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Col, DatePicker, Form, Image, Input, message, Row, Select, Upload } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import moment from 'moment'
import {
    UploadOutlined,
} from "@ant-design/icons";
import ApiFailHandler from '../helper/ApiFailHandler'
import NumericInput from '../helper/numericInput'
// var Roles = [
//     { value: 'admin', label: 'Quản trị viên' },
//     { value: 'doctor', label: 'Bác sĩ' },
//     { value: 'pharmacist', label: 'Dược sĩ' },
//     { value: 'staff', label: 'Nhân viên' }
// ];

// var Genders = [
//     { value: 'male', label: 'Nam' },
//     { value: 'female', label: 'Nữ' }
// ]
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class thongtincanhan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            listRoles: [],
            fileList: []
        }
    }

    onSubmit = async (e) => {
        let data = {
            ...e,
            phone: e.phone.toString(),
            birthday: e.birthday.utc(true).toDate()
        }

        if (this.state.fileList.length > 0) {
            data = {
                ...data,
                photoUrl: this.state.fileList[0].response.url
            }
        }

        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        await trackPromise(
            Axios.put('/api/users/' + obj.id, data, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then(res => {
                    let data_from_res = res.data.data
                    obj.photoUrl = data_from_res.photoUrl
                    obj.name = data_from_res.name
                    localStorage.setItem('login', JSON.stringify(obj));
                    message.success('Cập nhật thành công')
                    this.goBack()
                })
                .catch(err => {
                    message.error('Cập nhật thất bại')
                    ApiFailHandler(err.response?.data?.error)
                }))
    }

    onDone = () => {
        this.setState({
            isDone: !this.state.isDone
        })
    }

    async componentDidMount() {
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);

        this._isMounted = true;
        const [data, roles] = await trackPromise(Promise.all([
            Axios.get('/api/users/' + obj.id, {
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
            Axios.post('/api/system-roles/getAll', {}, {
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
        ]));

        if (data !== null && roles !== null) {
            if (this._isMounted) {
                this.setState({
                    data: {
                        ...data,
                        phone: data.phone,
                        birthday: moment(data.birthday)
                    },
                    listRoles: roles
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    goBack = () => {
        this.props.history.push("/");
    }
    render() {
        if (this.state.data) {
            return (
                <Content className="action-details" style={{ margin: "0 16px" }}>
                    <Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/actions">Danh sách</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chi tiết
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <Button onClick={() => this.setModalEditActionVisible(true)} className="flex-row-item-right add">Chỉnh sửa</Button>
                        </div>
                    </Row >
                    <div className="site-layout-background-main">
                        <Form
                            name="validate_other"
                            {...formItemLayout}
                            onFinish={(e) => this.onSubmit(e)}
                            layout="vertical"
                            className="event-form"
                            initialValues={this.state.data}
                        >

                            <Form.Item
                                style={{ padding: '0 10px' }}
                                wrapperCol={{ sm: 24 }}
                                name="name"
                                label={<Title className="normalLabel" level={4}>Tên người dùng</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập tên người dùng!' }]}
                            >
                                <Input placeholder="Nhập tên người dùng..."></Input>
                            </Form.Item>
                            <Form.Item
                                style={{ padding: '0 10px' }}
                                wrapperCol={{ sm: 24 }}
                                name="email"
                                label={<Title className="normalLabel" level={4}>Email</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần email!' }, { type: 'email', message: 'Email phải có dạng xx@xx.xx' }]}
                            >
                                <Input placeholder="Nhập email..."></Input>
                            </Form.Item>
                            <Form.Item
                                style={{ padding: '0 10px' }}
                                wrapperCol={{ sm: 24 }}
                                name="phone"
                                label={<Title className="normalLabel" level={4}>Số điện thoại</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập số điện thoại!' }, { type: 'number' }]}
                            >
                                {/* <InputNumber style={{ width: '100%' }} minLength={9} maxLength={11} placeholder="Nhập số điện thoại..."></InputNumber> */}
                                <NumericInput placeholder="Nhập số điện thoại..." />
                            </Form.Item>
                            <Row>
                                <Col span={12} style={{ padding: '0 10px' }}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="birthday"
                                        label={<Title className="normalLabel" level={4}>Ngày sinh</Title>}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Cần nhập ngày sinh!' }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" placeholder="Cần nhập ngày sinh" />
                                    </Form.Item>

                                </Col>
                                <Col span={12} style={{ padding: '0 10px' }}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="gender"
                                        label={<Title className="normalLabel" level={4}>Giới tính</Title>}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Cần chọn giới tính!' }]}
                                    >
                                        <Select placeholder="Chọn giới tính">
                                            <Option key="nam">Nam</Option>
                                            <Option key="nữ">Nữ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                style={{ padding: '0 10px' }}
                                wrapperCol={{ sm: 24 }}
                                name="address"
                                label={<Title className="normalLabel" level={4}>Địa chỉ</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Nhập địa chỉ..."></Input>
                            </Form.Item>

                            <Form.Item
                                style={{ padding: '0 10px' }}
                                wrapperCol={{ sm: 24 }}
                                name="roleId"
                                label={<Title className="normalLabel" level={4}>Quyền</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần chọn quyền!' }]}
                            >
                                <Select placeholder="Chọn quyền">
                                    {this.state.listRoles.map((e, key) => <Option key={e._id}>{e.name}</Option>)}
                                </Select>
                            </Form.Item>
                            <Row>
                                <Col span={12} style={{ padding: '0 10px' }}>
                                    <Title className="normalLabel" level={4}>Ảnh đại diện hiện tại</Title>
                                    <div style={{ widht: '100%', textAlign: 'center' }}>
                                        {/* <Image style={{ maxWidth: '110px' }} src={"https://event-go.s3.us-east-2.amazonaws.com/1624966695834-470527781-image.jpeg"}></Image> */}
                                        <Image style={{ maxWidth: '110px' }} src={`${window.resource_url}${this.state.data.photoUrl}`}></Image>
                                    </div>
                                </Col>
                                <Col span={12} style={{ padding: '0 10px' }}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="posterUrl"
                                        label={<Title className="normalLabel" level={4}>Ảnh đại diện</Title>}
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
                                                        photoUrl: info.file.response.url
                                                    })

                                                }
                                                this.setState({
                                                    fileList: info.fileList.filter(file => { file.url = `${window.resource_url}${this.state.data.photoUrl}`; return !!file.status })
                                                })

                                            }}
                                            maxCount={1}
                                        >
                                            <Button style={{ width: "100%" }} icon={<UploadOutlined />}>Tải ảnh lên</Button>
                                        </Upload>
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
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content >
            )
        }
        else {
            return null
        }
    }
}

export default thongtincanhan;