import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env';
import { trackPromise } from 'react-promise-tracker';
import { Breadcrumb, Button, Form, Input, message, Row } from 'antd';
import { Link } from 'react-router-dom';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class add extends Component {
    onSubmit = async (e) => {
        await trackPromise(Axios.post('/api/roles', e, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                message.success('Tạo thành công')
                // Message('Tạo thành công', true, this.props);
            })
            .catch(err => {
                message.error('Tạo thất bại')
                // Message('Tạo thất bại', false);
            }))
    }

    goBack = () => {
        this.props.history.goBack();
    }

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item >
                            <Link to="/listroles">Danh sách</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Chỉnh sửa quyền
                            </Breadcrumb.Item>
                    </Breadcrumb>
                </Row>
                <div className="site-layout-background-main">
                    <Form
                        name="validate_other"
                        {...formItemLayout}
                        onFinish={(e) => this.onSubmit(e)}
                        layout="vertical"
                    >
                        <Form.Item
                            wrapperCol={{ sm: 24 }}
                            name="name"
                            label={<Title level={4}>Tên quyền</Title>}
                            hasFeedback
                            rules={[{ required: true, message: 'Cần nhập tên quyền!' }]}
                        >
                            <Input placeholder="Nhập tên quyền..."></Input>
                        </Form.Item>
                        <br></br>
                        <Form.Item wrapperCol={{ span: 24, offset: 9 }}>
                            <Button
                                onClick={this.goBack}
                                className="back"
                                style={{ width: 150, marginRight: 20 }}
                            >
                                Hủy
                            </Button>
                            <Button htmlType="submit" className="add" style={{ width: 150 }}>
                                Tạo mới
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>

        );
    }
}

export default add;