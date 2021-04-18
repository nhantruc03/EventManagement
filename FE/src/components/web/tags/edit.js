import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Col, Form, Input, Row, Tag } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import ReactAntColorPicker from '@feizheng/react-ant-color-picker';
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
            data: null,
            background: '',
            color: '',
            name: ''
        }
    }

    onSubmit = async (e) => {
        await trackPromise(
            Axios.put('/api/tags/' + this.props.match.params.id, e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    Message('Sửa thành công', true, this.props);
                })
                .catch(err => {
                    Message('Sửa thất bại', false);
                }))
    }

    onDone = () => {
        this.setState({
            isDone: !this.state.isDone
        })
    }

    async componentDidMount() {
        this._isMounted = true;
        const [data] = await trackPromise(Promise.all([
            Axios.get('/api/tags/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));


        if (data !== null) {
            if (this._isMounted) {
                this.setState({
                    data: data,
                    background: data.background,
                    color: data.color,
                    name: data.name
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
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
        if (this.state.data !== null) {
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
                            initialValues={this.state.data}
                        >
                            <Row style={{ padding: '10px' }}>
                                <Col span={24}>
                                    <Form.Item
                                        wrapperCol={{ sm: 24 }}
                                        name="name"
                                        label={<Title level={4}>Tên tags</Title>}
                                        hasFeedback
                                        rules={[{ required: true, message: 'Cần nhập tên tags!' }]}
                                    >
                                        <Input onChange={this.onChangeName} placeholder="Nhập tên tags..."></Input>
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
                                    Cập nhật
                            </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Content>
            );
        }
        else {
            return null
        }

    }
}

export default edit;