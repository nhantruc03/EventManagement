import { Button, Col, DatePicker, Form, Input, message, Row, TimePicker } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../../../env'
import moment from 'moment'
import ApiFailHandler from '../../../../helper/ApiFailHandler'
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
            actionId: this.props.actionId,
            endTime: e.endTime.utc(true).toDate(),
            endDate: e.endDate.utc(true).format('YYYY-MM-DD'),
        }

        let expireSubActionDate = moment(`${data.endDate} ${moment(data.endTime).utcOffset(0).format("HH:mm")}`)
        let expireActionDate = moment(`${moment(this.props.action.endDate).utcOffset(0).format("YYYY-MM-DD")} ${moment(this.props.action.endTime).utcOffset(0).format("HH:mm")}`)

        if (expireSubActionDate.isAfter(expireActionDate)) {
            message.error(`Hạn chót trước hạn chót công việc ${expireActionDate.format('DD/MM/YYYY')}`);
        }
        else {
            await trackPromise(
                axios.put('/api/sub-actions/' + this.props.data._id, data, {
                    headers: {
                        'Authorization': AUTH()
                    }
                })
                    .then(res => {
                        message.success('Cập nhật thành công');
                        let temp = res.data.data
                        temp.endTime = moment(e.endTime).utcOffset(0)
                        temp.endDate = moment(e.endDate).utcOffset(0)
                        this.props.edit(temp)
                    })
                    .catch(err => {
                        message.error('Cập nhật thất bại');
                        ApiFailHandler(err.response?.data?.error)
                    }))
        }
    }

    UNSAFE_componentWillReceiveProps(e) {
        console.log('startTime', e.data.startTime)
        console.log('endTime', e.data.endTime)
        this.form.current.setFieldsValue({
            name: e.data.name,
            description: e.data.description,
            endDate: e.data.endDate,
            endTime: e.data.endTime,
        });
    }

    componentDidMount() {
        let data = {
            ...this.props.data,
        }
        this.setState({
            data: data
        })
    }

    form = React.createRef();
    render() {
        if (this.state.data) {
            return (
                <Form
                    name="validate_other"
                    {...formItemLayout}
                    onFinish={(e) => this.onFinish(e)}
                    layout="vertical"
                    className="form"
                    ref={this.form}
                    initialValues={this.state.data}
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
                                        label="Ngày kết thúc"
                                        rules={[{ required: true, message: 'Cần chọn ngày kết thức!' }]}
                                        name="endDate"
                                    >
                                        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc..." />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        label="Giờ kết thúc"
                                        rules={[{ required: true, message: 'Cần chọn ngày kết thức!' }]}
                                        name="endTime"
                                    >
                                        <TimePicker format="HH:mm" placeholder="Chọn giờ kết thúc"></TimePicker>
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
        else {
            return null
        }

    }
}

export default edit;