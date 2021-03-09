import { Button, Col, Form, Input, Row, Select, message } from 'antd';
import React, { Component } from 'react';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class EditRow extends Component {
    onFinish = (values) => {
        values._id = this.props.data._id
        this.props.listguesttype.forEach(e => {
            if (e._id === values.guestTypeId) {
                values.guestTypeName = e.name
            }
        })
        let success = true;
        this.props.list.forEach(e => {
            if (e._id !== values._id) {
                if (e.phone === values.phone) {
                    message.error(`Số điện thoại ${e.phone} bị trùng`);
                    success = false;
                }
                if (e.email === values.email) {
                    message.error(`Email ${e.email} bị trùng`);
                    success = false;
                }
            }
        })
        if (success) {
            // console.log('values', values)
            this.props.edit(values);
            this.props.onClickEditUser();
        }

    };

    componentDidMount() {
        console.log(this.props.data)
        let data = {
            ...this.props.data,
            'guestTypeId': this.props.guestTypeId
        }
        this.form.current.setFieldsValue(data)
    }
    cancle = () => {
        if (this.props.data.noinfo === true) {
            this.props.delete(this.props.data._id)
        }
        else {
            this.props.onClickEditUser()
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
                    <Col span={3}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="name"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên..." />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="phone"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập số điện thoại!' }, { min: 10, message: 'Số điện thoại phải có ít nhất 10 chữ số' }]}
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="email"
                            hasFeedback
                            rules={[{ required: true, type: 'email', message: 'Cần nhập email!' }]}
                        >
                            <Input placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                    <Col span={7}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="guestTypeId"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần chọn loại khách mời!' }]}
                        >
                            <Select placeholder="Chọn loại khách mời">
                                {this.props.listguesttype.map((e) => <Option key={e._id}>{e.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={4}>
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