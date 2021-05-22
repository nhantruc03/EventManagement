import React, { Component } from "react";
import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import Title from "antd/lib/typography/Title";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
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
            data: { description: "" },
        };
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    onFinish = async (e) => {
        let data = {
            ...e,
            time: e.time,
            _id: this.props.data._id,
            noinfo: false,
        };
        if (this.props.data.onAdd) {
            this.props.onAdd(data)
        } else {
            this.props.onUpdate(data);
        }
        this.props.onClose();
    };

    onClose = () => {
        if (this.props.data.noinfo) {
            this.props.onDelete(this.props.data);
        } else {
            this.props.onClose();
        }
    };

    UNSAFE_componentWillMount() {
        let temp = {
            _id: this.props.data._id,
            name: this.props.data.name,
            description: this.props.data.description,
            time: moment(this.props.data.time).utcOffset(0),
        };
        this.setState({
            data: temp,
        });
    }

    rednderView = () => {
        return (
            <Form
                name={this.props.data._id}
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
                initialValues={this.state.data}
            >
                <Row>
                    <Col span={24}>
                        <Row>
                            <Col sm={24} lg={9}>
                                <Title level={5}>Mốc thời gian</Title>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    style={{ width: "90%" }}
                                    rules={[
                                        { required: true, message: "Cần chọn mốc thời gian!" },
                                    ]}
                                    name="time"
                                >
                                    <TimePicker format="HH:mm" placeholder="Chọn giờ..." />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={9}>
                                <Title level={5}>Tiêu đề</Title>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    style={{ width: "90%" }}
                                    name="name"
                                    rules={[
                                        { required: true, message: "Cần nhập tên tên kịch bản" },
                                    ]}
                                >
                                    <Input placeholder="Tên kịch bản..." />
                                </Form.Item>
                            </Col>
                            <Col sm={24} lg={6} style={{ padding: "45px 0 0 0" }}>
                                <Button
                                    style={{ width: "50%" }}
                                    onClick={this.onClose}
                                    className="back"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    style={{ width: "50%" }}
                                    htmlType="submit"
                                    className="add"
                                >
                                    Lưu
                </Button>
                            </Col>
                        </Row>
                        <Title level={5}>Nội dung</Title>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            style={{ width: "100%" }}
                            name="description"
                            rules={[{ required: true, message: "Cần nhập mô tả kịch bản" }]}
                        >
                            <ReactQuill theme="snow" />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        );
    };

    render() {
        return <div>{this.rednderView()}</div>;
    }
}

export default edit;
