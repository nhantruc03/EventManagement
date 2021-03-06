import { Button, Col, Form, Input, Row } from 'antd';
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
            name: this.props.data.name,
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
                    <Col span={19} style={{ padding: '0 10px' }}>
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="name"
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên!' }]}
                        >
                            <Input placeholder="Nhập tên..." />
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