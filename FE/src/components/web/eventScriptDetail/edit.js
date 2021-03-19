import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import Title from 'antd/lib/typography/Title';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment'
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
            data:{description:''}
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onFinish = async (e) => {
        let data = {
            ...e,
            '_id': this.props.data._id,
            'noinfo': false
        }
        
        this.props.onUpdate(data)
        this.props.onClose()
    }

    onClose = () => {
        if (this.props.data.noinfo) {
            this.props.onDelete(this.props.data._id);
        } else {
            this.props.onClose();
        }
    }

    UNSAFE_componentWillMount() {
        let temp = {
            _id: this.props.data._id,
            name: this.props.data.name,
            description: this.props.data.description,
            time: moment(this.props.data.time)
        }
        this.setState({
            data: temp
        })
    }

    rednderView = () => {
        return (
            <Form
                name={this.props.data._id}
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
                initialValues={ this.state.data}
            >
                <Row>
                    <Col span={18}>
                        <Row>
                            <Col sm={24} md={12}>
                                <Title level={5}>Mốc thời gian</Title>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    style={{ width: "90%" }}
                                    rules={[{ required: true, message: 'Cần chọn mốc thời gian!' }]}
                                    name="time"
                                >
                                    <TimePicker format="HH:mm" placeholder="Chọn giờ..." />
                                </Form.Item>
                            </Col>
                            <Col sm={24} md={12}>
                                <Title level={5}>Tiêu đề</Title>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    style={{ width: "90%" }}
                                    name="name"
                                    rules={[{ required: true, message: 'Cần nhập tên tên kịch bản' }]}
                                >
                                    <Input placeholder="Tên kịch bản..." />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Title level={5}>Nội dung</Title>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            style={{ width: "90%" }}
                            name="description"
                            rules={[{ required: true, message: 'Cần nhập mô tả kịch bản' }]}
                        >
                            <ReactQuill theme="snow" />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ margin: 'auto' }}>
                        <Form.Item wrapperCol={{ span: 24, offset: 9 }}>
                            <Button onClick={this.onClose} className="back">Hủy</Button>
                            <Button htmlType="submit" className="add">Lưu</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.rednderView()}
            </div>
        );
    }
}

export default edit;