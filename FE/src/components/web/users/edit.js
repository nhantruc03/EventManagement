import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Form, Input, message, Row, Select, Col, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import ApiFailHandler from '../helper/ApiFailHandler'
import NumericInput from '../helper/numericInput'
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
class edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        }
    }

    onSubmit = async (e) => {
        let data = {
            ...e,
            phone: e.phone.toString(),
            birthday: e.birthday.utc(true).toDate()
        }
        await trackPromise(
            Axios.put('/api/users/' + this.props.match.params.id, data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Sửa thành công');
                    this.props.history.goBack()
                })
                .catch(err => {
                    message.error('Sửa thất bại');
                    ApiFailHandler(err.response?.data?.error)
                }))
    }

    onDone = () => {
        this.setState({
            isDone: !this.state.isDone
        })
    }

    async componentDidMount() {
        this._isMounted = true;
        const [data, roles] = await trackPromise(Promise.all([
            Axios.get('/api/users/' + this.props.match.params.id, {
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
            Axios.post('/api/system-roles/getAll', {}, {
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
        this.props.history.goBack();
    }
    render() {
        if (this.state.data !== null) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item >
                                <Link to="/admin/listusers">Danh sách</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Chỉnh sửa người dùng
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </Row>
                    <div className="site-layout-background-main">
                        <Form
                            name="validate_other"
                            {...formItemLayout}
                            onFinish={(e) => this.onSubmit(e)}
                            layout="vertical"
                            initialValues={this.state.data}
                        >
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                name="name"
                                label={<Title level={4}>Tên người dùng</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập tên người dùng!' }]}
                            >
                                <Input placeholder="Nhập tên người dùng..."></Input>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                name="mssv"
                                label={<Title level={4}>Mã số sinh viên</Title>}
                                hasFeedback
                            >
                                <Input placeholder="Nhập mã số sinh viên..."></Input>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                name="email"
                                label={<Title level={4}>Email</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần email!' }, { type: 'email', message: 'Email phải có dạng xx@xx.xx' }]}
                            >
                                <Input placeholder="Nhập email..."></Input>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                name="phone"
                                label={<Title level={4}>Số điện thoại</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập số điện thoại!' }]}
                            >
                                {/* <InputNumber style={{ width: '100%' }} minLength={9} maxLength={11} placeholder="Nhập số điện thoại..."></InputNumber> */}
                                <NumericInput style={{ width: '100%' }} minLength={9} maxLength={11} placeholder="Nhập số điện thoại..."></NumericInput>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{ sm: 24 }}
                                name="address"
                                label={<Title level={4}>Địa chỉ</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần nhập địa chỉ!' }]}
                            >
                                <Input placeholder="Nhập địa chỉ..."></Input>
                            </Form.Item>
                            <Row>
                                <Col span={12} style={{ padding: '0 10px 0 0' }}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="birthday"
                                        label={<Title level={4}>Ngày sinh</Title>}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Cần nhập ngày sinh!' }]}
                                    >
                                        <DatePicker format="DD/MM/YYYY" placeholder="Cần nhập ngày sinh" />
                                    </Form.Item>

                                </Col>
                                <Col span={12} style={{ padding: '0 0 0 10px' }}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="gender"
                                        label={<Title level={4}>Giới tính</Title>}
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
                                wrapperCol={{ sm: 24 }}
                                name="roleId"
                                label={<Title level={4}>Quyền</Title>}
                                hasFeedback
                                rules={[{ required: true, message: 'Cần chọn quyền!' }]}
                            >
                                <Select placeholder="Chọn quyền">
                                    {this.state.listRoles.map((e, key) => <Option key={e._id}>{e.name}</Option>)}
                                </Select>
                            </Form.Item>
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
                </Content>
            );
        }
        else {
            return null
        }

    }
}

export default edit;