import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import React, { Component } from 'react';
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class EditRow extends Component {
    onFinish = async (values) => {
        values._id = this.props.data._id


        await this.props.edit(values);
        this.props.onClickEdit();
    };

    componentDidMount() {
        let data = {
            ...this.props.data,
            phone: Number(this.props.data.phone)
        }
        this.form.current.setFieldsValue(data)
    }
    cancle = () => {
        if (this.props.data.noinfo === true) {
            this.props.delete(this.props.data.id)
        }
        else {
            this.props.onClickEdit()
        }

    }
    form = React.createRef();
    render() {
        return (
            <Form
                ref={this.form}
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
            >
                <Row>
                    <Col span={5} style={{ padding: '0 10px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="mssv"
                            
                        // rules={[{ required: true, message: 'Cần nhập tên!' }]}
                        >
                            <Input placeholder="Nhập mssv..." />
                        </Form.Item>
                    </Col>
                    <Col span={5} style={{ padding: '0 10px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="name"
                            
                        // rules={[{ required: true, message: 'Cần nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên..." />
                        </Form.Item>
                    </Col>
                    <Col span={4} style={{ padding: '0 10px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="phone"
                            
                            rules={[{ type: 'number', message: 'Số điện thoại phải là số' }]}
                        >
                            <InputNumber style={{ width: '100%' }} placeholder="Nhập số điện thoại..." />
                        </Form.Item>
                    </Col>
                    <Col span={5} style={{ padding: '0 10px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="email"
                            
                            rules={[{ type: 'email', message: 'Email phải có ký tự @' }]}
                        >
                            <Input placeholder="Nhập email..." />
                        </Form.Item>
                    </Col>
                    <Col span={5} style={{ textAlign: 'center' }}>
                        <Button onClick={() => this.cancle()} className="back" >
                            Hủy
                        </Button>
                        <Button htmlType="submit" className="add" >
                            Lưu
                        </Button>
                    </Col>
                </Row>
            </Form >
        );
    }
}

export default EditRow;