import { Button, Col, DatePicker, Form, Input, message, Row, TimePicker } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../../env'
import moment from "moment"
import ApiFailHandler from '../../../helper/ApiFailHandler'
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class add extends Component {
    onFinish = async (e) => {
        let data = {
            ...e,
            actionId: this.props.actionId,
            endTime: e.endTime.utc(true).toDate(),
            endDate: e.endDate.utc(true).toDate(),
        }


        await trackPromise(
            axios.post('/api/sub-actions', data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Tạo thành công');
                    this.form.current.resetFields();
                    let temp = res.data.data
                    temp.endTime = moment(temp.endTime).utcOffset(0)
                    temp.endDate = moment(temp.endDate).utcOffset(0)
                    this.props.add(temp)
                })
                .catch(err => {
                    message.error('Tạo thất bại');
                    ApiFailHandler(err.response?.data?.error)
                }))
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
                        // rules={[{ required: true, message: 'Cần nhập mô tả công việc!' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Nhập mô tả công việc..." />

                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label="Ngày kết thúc"
                                    name="endDate"
                                >
                                    <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc..." />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    label="Giờ kết thúc"
                                    name="endTime"
                                >
                                    <TimePicker format="HH:mm" placeholder="Chọn giờ kết thúc"></TimePicker>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className="flex-container-row" style={{ marginTop: '20px' }}>
                            <Button htmlType="submit" className="flex-row-item-right add">Tạo mới</Button>
                        </div>
                    </Col>
                </Row>
            </Form>
        );
    }
}

export default add;