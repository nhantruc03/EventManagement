import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env';
import { trackPromise } from 'react-promise-tracker';
import { Breadcrumb, Button, Col, Form, Input, message, Row, Tag } from 'antd';
import { Link } from 'react-router-dom';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import ReactAntColorPicker from '@feizheng/react-ant-color-picker';
import ApiFailHandler from '../helper/ApiFailHandler'
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class add extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: '',
            background: '#2A9D8F',
            color: '#282c34',
        }
    }

    onSubmit = async (e) => {
        let data = {
            ...e,
            background: this.state.background,
            color: this.state.color
        }
        await trackPromise(Axios.post('/api/action-tags', data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                message.success('Tạo thành công');
            })
            .catch(err => {
                message.error('Tạo thất bại')
                ApiFailHandler(err.response?.data?.error)
            }))
    }

    goBack = () => {
        this.props.history.goBack();
    }
    onChangeName = (e) => {
        // console.log(e.target.value)
        this.setState({
            name: e.target.value
        })
    }

    onChangeBackground = (e) => {
        this.setState({
            background: e.target.value
        })
    }
    onChangeColor = (e) => {
        this.setState({
            color: e.target.value
        })
    }

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item >
                            <Link to="/events">Sự kiện</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            Thêm mới sự kiện
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
                        <Row style={{ padding: '10px' }}>
                            <Col span={24}>
                                <Form.Item
                                    wrapperCol={{ sm: 24 }}
                                    name="name"
                                    label={<Title level={4}>Tên tags</Title>}
                                    hasFeedback
                                    rules={[{ required: true, message: 'Cần nhập tên tags công việc!' }]}
                                >
                                    <Input onChange={this.onChangeName} placeholder="Nhập tên tags công việc..."></Input>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '20px' }}>
                            <Col style={{ padding: '10px' }} span={12}>
                                <div className="flex-container-row">
                                    <Tag style={{ background: `${this.state.background}`, color: 'white' }}>{this.state.name}</Tag>
                                    <Button className="flex-row-item-right">
                                        <ReactAntColorPicker onChange={this.onChangeBackground} value={this.state.background} label="Màu nền" />
                                    </Button>

                                </div>
                            </Col>
                            <Col style={{ padding: '10px' }} span={12}>
                                <div className="flex-container-row">
                                    <Tag style={{ background: 'white', color: `${this.state.color}`, border: `1px solid black` }}>{this.state.name}</Tag>

                                    <Button className="flex-row-item-right">
                                        <ReactAntColorPicker onChange={this.onChangeColor} value={this.state.color} label="Màu chữ" />
                                    </Button>

                                </div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '20px', width: '100%', textAlign: 'center' }}>

                            <div style={{ width: '50%', margin: '0 auto' }} >
                                <Title level={4}>Kết quả</Title>
                                <Tag style={{ background: `${this.state.background}`, color: `${this.state.color}` }}>{this.state.name}</Tag>
                            </div>

                        </Row>
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