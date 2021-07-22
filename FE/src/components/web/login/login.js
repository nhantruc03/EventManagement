import Axios from 'axios';
import React, { Component } from 'react';
import auth from '../../../router/auth';
import { trackPromise } from 'react-promise-tracker';
import { Button, Form, Input, message } from 'antd';
import Title from 'antd/lib/typography/Title';

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isFail: false,
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = async (e) => {
        await trackPromise(Axios.post('/api/users/login', e)
            .then(res => {
                if (res.data.success === true) {
                    auth.login(res.data.data);
                    if (auth.isAuthenticatedAdmin() === true || auth.isAuthenticatedStaff() === true) {
                        var login = localStorage.getItem('login');
                        if (JSON.parse(login).token !== null) {
                            this.props.history.push("/");
                        }
                    }
                    else {
                        this.setState({
                            isFail: true
                        })
                    }
                } else {
                    message.error("Đăng nhập thất bại")
                }
            })
            .catch(err => {
                console.log(err);

            }))

    }
    handleFail = () => {
        if (this.state.isFail) {
            return <p style={{ color: "red", textAlign: "center" }}>Đăng nhập thất bại!</p>
        }
    }
    render() {
        return (
            <>
                <Title className="title" level={2}>Đăng nhập</Title>
                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={(e) => this.onSubmit(e)}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        wrapperCol={{ sm: 24 }}
                        name="username"
                        label={<Title level={4}>Tên tài khoản</Title>}
                        rules={[{ required: true, message: 'Cần nhập tên tài khoản!' }]}
                    // requiredmark='optional'
                    >
                        <Input onChange={(e) => { this.setState({ username: e.target.value }) }} placeholder="Nhập tên tài khoản..."></Input>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ sm: 24 }}
                        name="password"
                        label={<Title level={4}>Mật khẩu</Title>}
                        rules={[{ required: true, message: 'Cần mật khẩu!' }]}
                    // requiredmark='optional'
                    >
                        <Input.Password onChange={(e) => { this.setState({ password: e.target.value }) }} placeholder="Nhập địa chỉ..."></Input.Password>
                    </Form.Item>

                    <div style={{ marginTop: '30px' }}>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button disabled={(this.state.username !== '' && this.state.password !== '') ? false : true} htmlType="submit" className="add">
                                Đăng nhập
                            </Button>
                            <Button onClick={() => {
                                this.props.history.push('/forgot-password')
                            }} style={{ width: '100%', marginTop: 10 }} className="back">
                                Quên mật khẩu
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </>
        );
    }
}

export default login;