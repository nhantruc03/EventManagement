import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { Component } from 'react';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
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
            name: this.props.userEditObject.userId.name,
            mssv: this.props.userEditObject.userId.mssv,
            credentialsId: values.credentialsId
        }

        console.log(values.credentialsId)
        // console.log(values)
        await this.props.getUserEditInfo(values);
        this.props.onClickEditUser();
    };

    componentDidMount() {
        let data = {
            name: this.props.userEditObject.userId.name,
            mssv: this.props.userEditObject.userId.mssv,
            phone: this.props.userEditObject.userId.phone,
            email: this.props.userEditObject.userId.email,
            credentialsId: this.props.userEditObject.credentialsId ? this.props.userEditObject.credentialsId : null,
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
                    <Col span={5} style={{ padding: '0 5px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="name"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên!' }]}

                        >
                            <Input disabled={true} placeholder="Nhập tên..." />
                        </Form.Item>
                    </Col>
                    <Col span={5} style={{ padding: '0 5px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="mssv"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên!' }]}

                        >
                            <Input disabled={true} placeholder="Nhập tên..." />
                        </Form.Item>
                    </Col>
                    <Col span={8} style={{ padding: '0 5px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="credentialsId"
                            hasFeedback
                            // rules={[{ required: true, message: 'Cần chọn ban!' }]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Chọn quyền..."
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.props.listCredentials.map((e) => <Option key={e._id}>{e.name}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ textAlign: 'center' }}>
                        <Button onClick={() => this.cancle()} className="back" >
                            <CloseOutlined />
                        </Button>
                        <Button htmlType="submit" className="add" >
                            <CheckOutlined />
                        </Button>
                    </Col>
                </Row>
            </Form >
        );
    }
}

export default EditUser;