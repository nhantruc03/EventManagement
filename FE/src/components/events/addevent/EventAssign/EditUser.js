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
class EditUser extends Component {
    onFinish = async (values) => {
        values._id = this.props.userEditObject._id
        values.userId = {
            _id: this.props.userEditObject.userId._id,
            phone: this.props.userEditObject.userId.phone,
            email: this.props.userEditObject.userId.email,
            name: this.props.userEditObject.userId.name
        }

        // values.guestTypeId = values.guestTypeName
        this.props.listRole.forEach(e => {
            if (e._id === values.roleId) {
                values.roleId = {
                    _id: e._id,
                    name: e.name
                }
            }
        })
        this.props.listFaculty.forEach(e => {
            if (e._id === values.facultyId) {
                values.facultyId = {
                    _id: e._id,
                    name: e.name
                }
            }
        })
        console.log(values)
        await this.props.getUserEditInfo(values);
        this.props.onClickEditUser();
    };

    componentDidMount() {
        let data = {
            name: this.props.userEditObject.userId.name,
            phone: this.props.userEditObject.userId.phone,
            email: this.props.userEditObject.userId.email,
            roleId: this.props.userEditObject.roleId ? this.props.userEditObject.roleId._id : null,
            facultyId: this.props.userEditObject.facultyId ? this.props.userEditObject.facultyId._id : null
        }
        this.form.current.setFieldsValue(data)
    }
    cancle = () => {
        if (this.props.userEditObject.noinfo === true) {
            this.props.delete(this.props.userEditObject.id)
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
                    <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="name"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên!' }]}

                        >
                            <Input disabled={true} placeholder="Nhập tên..." />
                        </Form.Item>
                    </Col>
                    {/* <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="phone"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập số điện thoại!' }, { min: 10, message: 'Số điện thoại phải có ít nhất 10 chữ số' }]}
                        >
                            <Input disabled={true} placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col> */}
                    <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="email"
                            hasFeedback
                            rules={[{ required: true, type: 'email', message: 'Cần nhập email!' }]}
                        >
                            <Input disabled={true} placeholder="Nhập email" />
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="facultyId"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần chọn loại khách mời!' }]}
                        >
                            <Select placeholder="Chọn loại khách mời">
                                {this.props.listFaculty.map((e) => <Option key={e._id}>{e.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={5}>
                        <Form.Item
                            wrapperCol={{ sm: 20 }}
                            name="roleId"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần chọn loại khách mời!' }]}
                        >
                            <Select placeholder="Chọn loại khách mời">
                                {this.props.listRole.map((e) => <Option key={e._id}>{e.name}</Option>)}
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

export default EditUser;