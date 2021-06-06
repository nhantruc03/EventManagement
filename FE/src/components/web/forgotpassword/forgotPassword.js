import { Button, Form, Input, message } from 'antd';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import NumericInput from '../helper/numericInput'

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class forgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            phone: null,
            isFail: false,
        }
    }

    onSubmit = async (e) => {
        await trackPromise(axios.post('/api/users/forgot-password', e)
            .then(res => {
                if (res.data.success === true) {
                    message.success("Tạo mật khẩu mới thành công")
                    this.props.history.push('/login')
                } else {
                    message.error("Tạo mật khẩu mới thất bại")
                }
            })
            .catch(err => {
                message.error("Tạo mật khẩu mới thất bại")
            }))
    }

    render() {
        return (
            <>
                <Title className="title" level={2}>Quên mật khẩu</Title>
                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={(e) => this.onSubmit(e)}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        wrapperCol={{ sm: 24 }}
                        name="email"
                        label={<Title level={4}>Email</Title>}
                        rules={[{ required: true, message: 'Cận nhập email' }, { type: 'email', message: 'Email phải có ký tự @' }]}
                    >
                        <Input onChange={e => {
                            this.setState({
                                email: e.target.value
                            })
                        }} placeholder="Nhập email..."></Input>
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{ sm: 24 }}
                        name="phone"
                        label={<Title level={4}>Số điện thoại</Title>}
                        rules={[{ required: true, message: 'Cần nhập số điện thoại!' }]}
                    >
                        <NumericInput onChange={e => {
                            this.setState({
                                phone: e
                            })
                        }} placeholder="Nhập số điện thoại..." />
                    </Form.Item>

                    <div style={{ marginTop: '30px' }}>
                        <Form.Item wrapperCol={{ span: 24 }}>
                            <Button disabled={(this.state.email && this.state.phone) ? false : true} htmlType="submit" className="add">
                                Tạo mật khẩu mới
                            </Button>
                            <Button style={{ width: '100%', marginTop: 10 }} onClick={() => {
                                this.props.history.goBack()
                            }} className="back">
                                Quay lại
                            </Button>
                        </Form.Item>
                    </div>
                </Form>
            </>
        );
    }
}

export default forgotPassword;