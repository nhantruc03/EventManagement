import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Form, Input, message, Row } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class updatePass extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            listRoles: [],
            fileList: []
        }
    }

    onSubmit = async (e) => {

        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        await trackPromise(
            Axios.put('/api/users/updatePass/' + obj.id, e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Cập nhật thành công')
                    // Message('Sửa thành công', true, this.props);
                })
                .catch(err => {
                    message.error('Cập nhật thất bại')
                    // Message('Sửa thất bại', false);
                }))
    }

    onDone = () => {
        this.setState({
            isDone: !this.state.isDone
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <Content className="action-details" style={{ margin: "0 16px" }}>
                <Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <div className="flex-container-row" style={{ width: '100%' }}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item >
                                <Link to="/actions">Danh sách</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Cập nhật mật khẩu
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
                    >

                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="currentPass"
                            label={<Title className="normalLabel" level={4}>Mật khẩu hiện tại</Title>}
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập mật khẩu hiện tại!' }]}
                        >
                            <Input.Password placeholder="Nhập mật khẩu hiện tại..." />
                        </Form.Item>

                        <Form.Item
                            name="newPass"
                            wrapperCol={{ sm: 24 }}
                            label={<Title className="normalLabel" level={4}>Mật khẩu mới</Title>}
                            rules={[
                                {
                                    required: true,
                                    message: 'Cần nhập mật khẩu mới!',
                                },
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="Nhập mật khẩu mới..." />
                        </Form.Item>

                        <Form.Item
                            name="newCheckPass"
                            wrapperCol={{ sm: 24 }}
                            label={<Title className="normalLabel" level={4}>Xác nhận mật khẩu mới</Title>}
                            dependencies={['newPass']}
                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Cận xác nhận mật khẩu mới!',
                                },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPass') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Xác nhận mật khẩu không chính xác!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Xác nhận mật khẩu mới" />
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
            </Content >
        )
    }
}

export default updatePass;