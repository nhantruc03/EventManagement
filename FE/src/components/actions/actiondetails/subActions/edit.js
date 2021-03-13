import { Button, Col, DatePicker, Form, Input, message, Row } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
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
    onFinish = async (e) => {
        let data = {
            ...e,
            actionId: this.props.actionId
        }

        await trackPromise(
            axios.put('/api/sub-actions/' + this.props.data._id, data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Cập nhật thành công');
                    this.form.current.resetFields();
                    this.props.edit(res.data.data)
                })
                .catch(err => {
                    message.error('Cập nhật thất bại');
                }))
    }

    UNSAFE_componentWillReceiveProps(e) {
        this.form.current.setFieldsValue({
            name: e.data.name,
            description: e.data.description,
            startDate: e.data.startDate,
            endDate: e.data.endDate
        });
    }

    form = React.createRef();
    render() {
        return (
            <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
                className="form"
                ref={this.form}
                initialValues={this.props.data}
            // defaultValue={this.props.data}
            >
                <Row >
                    <Col span={24}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="name"
                            label="Tên công việc"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên công việc!' }]}
                        >
                            <Input placeholder="Nhập tên công việc..."></Input>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="description"
                            label="Mô tả"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập mô tả công việc!' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả công việc..." />

                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label="Bắt đầu"
                                    rules={[{ required: true, message: 'Cần chọn ngày bắt đầu!' }]}
                                    name="startDate"
                                >
                                    <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu..." />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label="Kết thúc"
                                    rules={[{ required: true, message: 'Cần chọn ngày kết thức!' }]}
                                    name="endDate"
                                >
                                    <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc..." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="flex-container-row" style={{ marginTop: '20px' }}>
                            <Button htmlType="submit" className="flex-row-item-right add">Cập nhật</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default edit;