import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../../env';
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Col, Form, Input, message, Row } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import { v1 as uuidv1 } from 'uuid';
import ListScriptDetails from '../../eventScriptDetail/list'
import ReviewScriptDetail from '../../eventScriptDetail/withoutId/review'
import ApiFailHandler from '../../helper/ApiFailHandler'
import moment from 'moment'
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
        super(props);
        this.state = {
            listUser: [],
            listscriptdetails: [],
            data: {},
            script_name: ''

        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    UNSAFE_componentWillMount() {
        this.setState({
            data: {
                name: null,
                forId: null,
            }
        })
    }

    goBack = () => {
        this.props.history.goBack();
    }

    onFinish = async (values) => {
        let data = {
            ...values,
            'listscriptdetails': this.state.listscriptdetails,
            'eventId': this.props.match.params.id,
            'clone': true
        }
        await trackPromise(Axios.post('/api/scripts/start', data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                message.success('Tạo thành công');
                this.props.history.goBack()
            })
            .catch(err => {
                message.error('Tạo thất bại');
                ApiFailHandler(err.response?.data?.error)
            }))
    };

    onUpdateDetail = (value) => {
        let temp = this.state.listscriptdetails;
        temp.forEach(e => {
            if (e._id === value._id) {
                e.name = value.name
                e.time = value.time.toDate()
                e.description = value.description
                e.noinfo = value.noinfo
            }
        })
        this.setState({
            listscriptdetails: temp.sort((a, b) => {
                let temp_a = a.time.setFullYear(1, 1, 1);
                let temp_b = b.time.setFullYear(1, 1, 1);
                return temp_a > temp_b ? 1 : -1
            })
        })
    }

    onAddDetail = () => {
        let temp = {
            _id: uuidv1(),
            description: null,
            noinfo: true,
            time: moment(new Date()).utc(true)
        }
        this.setState({
            listscriptdetails: [...this.state.listscriptdetails, temp]
        })
    }

    onDeleteDetail = (value) => {
        let temp = this.state.listscriptdetails.filter(e => e._id !== value._id);
        this.setState({
            listscriptdetails: temp
        })
    }

    onChangeName = (e) => {
        this.setState({
            script_name: e.target.value
        })
    }

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <Col span={8}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item >
                                <Link to="/eventclones">Hồ sơ sự kiện</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                <Link to={`/eventclones/${this.props.match.params.id}`}>Chi tiết</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Thêm kịch bản
                          </Breadcrumb.Item>
                        </Breadcrumb>
                    </Col>
                </Row >

                <div className="add-scripts site-layout-background-main">
                    <Row>
                        <Col sm={24} xl={16}>
                            <Form
                                name="validate_other"
                                {...formItemLayout}
                                onFinish={(e) => this.onFinish(e)}
                                layout="vertical"
                                initialValues={this.state.data}
                            >
                                <Row>
                                    <Col sm={24} lg={24}>
                                        <Form.Item
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%" }}
                                            name="name"
                                            label="Tên kịch bản"
                                            rules={[{ required: true, message: 'Cần nhập tên tên kịch bản' }]}
                                        >
                                            <Input onChange={this.onChangeName} placeholder="Tên kịch bản..." />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <div style={{ marginTop: '30px', textAlign: 'center' }}>
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
                                </div>
                            </Form>
                            <Title style={{ marginTop: '20px' }} level={3}>Kịch bản chính</Title>
                            <ListScriptDetails data={this.state.listscriptdetails} onDelete={this.onDeleteDetail} onAddWithoutApi={this.onAddDetail} onUpdate={this.onUpdateDetail} />
                        </Col>
                        <Col sm={24} xl={8}>
                            <Title level={3}>Xem trước</Title>
                            <ReviewScriptDetail script_name={this.state.script_name} data={this.state.listscriptdetails} />
                        </Col>
                    </Row>

                </div>

            </Content >
        );
    }
}

export default add;