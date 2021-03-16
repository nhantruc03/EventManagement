import { Button, Col, DatePicker, Form, Input, message, Row, TimePicker } from 'antd';
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
            actionId: this.props.actionId,
            startTime: e['startTime'].toDate(),
            endTime: e['endTime'].toDate(),
        }

        await trackPromise(
            axios.put('/api/sub-actions/' + this.props.data._id, data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Cập nhật thành công');
                    console.log(res.data.data)
                    this.props.edit(res.data.data)
                })
                .catch(err => {
                    message.error('Cập nhật thất bại');
                }))
    }

    UNSAFE_componentWillReceiveProps(e) {
        console.log('startTime',e.data.startTime)
        console.log('endTime',e.data.endTime)
        this.form.current.setFieldsValue({
            name: e.data.name,
            description: e.data.description,
            startDate: e.data.startDate,
            endDate: e.data.endDate,
            startTime: e.data.startTime,
            endTime: e.data.endTime,
        });
        // console.log(e.data)
        // let data = {
        //     ...e.data,
        //     startTime: moment(e.data.startTime),
        //     endTime: moment(e.data.endTime),
        // }
        // this.setState({
        //     data: data
        // })
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
                                        label="Ngày bắt đầu"
                                        rules={[{ required: true, message: 'Cần chọn ngày bắt đầu!' }]}
                                        name="startDate"
                                    >
                                        <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu..." />
                                    </Form.Item>
                                </Col>
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
                            </Row>
                        </Col>
                        <Col span={24}>
                            <Row>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        label="Giờ bắt đầu"
                                        rules={[{ required: true, message: 'Cần chọn ngày bắt đầu!' }]}
                                        name="startTime"
                                    >
                                        {/* <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu..." /> */}
                                        <TimePicker format="HH:mm" placeholder="Chọn giờ bắt đầu"></TimePicker>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        label="Giờ kết thúc"
                                        rules={[{ required: true, message: 'Cần chọn ngày kết thức!' }]}
                                        name="endTime"
                                    >
                                        {/* <DatePicker format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc..." /> */}
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