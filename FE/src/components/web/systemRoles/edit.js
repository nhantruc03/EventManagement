import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Form, Input, message, Row } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import ApiFailHandler from '../helper/ApiFailHandler'
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

    onSubmit = async (e) => {
        await trackPromise(
            Axios.put('/api/system-roles/' + this.props.match.params.id, e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    message.success('Cập nhật thành công')
                    // Message('Sửa thành công', true, this.props);
                })
                .catch(err => {
                    message.error('Cập nhật thất bại')
                    ApiFailHandler(err.response?.data?.error)
                    // Message('Sửa thất bại', false);
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
            Axios.get('/api/system-roles/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err=>{
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]));


        if (data !== null) {
            if (this._isMounted) {
                this.setState({
                    data: data,
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
    render() {
        if (this.state.data !== null) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item >
                                <Link to="/listeventtypes">Sự kiện</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Chỉnh sửa sự kiện
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