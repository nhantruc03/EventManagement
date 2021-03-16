import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../env';
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Col, Form, Input, Row, Select } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import { v1 as uuidv1 } from 'uuid';
import ListScriptDetails from '../eventScriptDetail/list'
import ReviewScriptDetail from '../eventScriptDetail/withId/review'

const { Option } = Select;
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
            writerName: '',
            writerId: '',
            listUser: [],
            listscriptdetails: [],
            data: null
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async componentDidMount() {
        this._isMounted = true;
        const [script] = await trackPromise(Promise.all([
            Axios.get('/api/scripts/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]))
        const [event, scriptdetails] = await trackPromise(Promise.all([
            Axios.get('/api/events/' + script.eventId, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            Axios.post('/api/script-details/getAll', { scriptId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));

        if (event !== null && script !== null && scriptdetails !== null) {
            if (this._isMounted) {
                this.setState({
                    listUser: event.availUser,
                    name: script.name,
                    writerName: script.writerId.name,
                    writerId: script.writerId._id,
                    forId: script.forId._id,
                    listscriptdetails: scriptdetails.sort((a, b) => {
                        let temp_a = new Date(a.time).setFullYear(1, 1, 1);
                        let temp_b = new Date(b.time).setFullYear(1, 1, 1);
                        return temp_a > temp_b ? 1 : -1
                    })
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

    onFinish = async (values) => {
        let data = {
            ...values,
            'writerId': this.state.data.writerId,
            'listscriptdetails': this.state.listscriptdetails,
            'eventId': this.props.match.params.id
        }

        console.log('Received values of form: ', data);
        await trackPromise(Axios.post('/api/scripts/start', data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                Message('Tạo thành công', true, this.props);
            })
            .catch(err => {
                Message('Tạo thất bại', false);
            }))
    };

    onUpdateDetail = async (value) => {
        let temp = {
            name: value.name,
            time: value.time.toDate(),
            description: value.description,
            scriptId: this.props.match.params.id
        }

        await trackPromise(
            Axios.put("/api/script-details/" + value._id, temp, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    let temp = res.data.data;
                    let temp_list = this.state.listscriptdetails;
                    temp_list.forEach(e => {
                        if (e._id === temp._id) {
                            e.name = value.name
                            e.time = value.time.toDate()
                            e.description = value.description
                            e.noinfo = value.noinfo
                        }
                    })
                    this.setState({
                        listscriptdetails: temp_list.sort((a, b) => {
                            let temp_a = new Date(a.time).setFullYear(1, 1, 1);
                            let temp_b = new Date(b.time).setFullYear(1, 1, 1);
                            return temp_a > temp_b ? 1 : -1
                        })
                    })
                })
        )

    }

    onAddDetail = async () => {
        await trackPromise(
            Axios.post("/api/script-details", { name: uuidv1(), description: 'Hãy nhập thông tin chi tiết', time: new Date(), scriptId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    let temp = res.data.data[0];
                    temp.noinfo = true;
                    this.setState({
                        listscriptdetails: [...this.state.listscriptdetails, temp]
                    })
                })
        )

    }

    onDeleteDetail = async (value) => {
        await trackPromise(
            Axios.delete("/api/script-details/" + value, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    let temp = this.state.listscriptdetails.filter(e => e._id !== value);
                    this.setState({
                        listscriptdetails: temp
                    })
                })
        )

    }

    render() {
        if (!this.state.name) {
            return null;
        }
        else {
            return (
                <Content style={{ margin: "0 16px" }}>
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <Col span={8}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/events">Sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item onClick={this.goBack}>
                                    Chi tiết
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Kịch bản
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                    </Row >

                    <div className="site-layout-background-main">

                        <Row>
                            <Col sm={24} xl={18}>
                                <Form
                                    name="validate_other"
                                    {...formItemLayout}
                                    onFinish={(e) => this.onFinish(e)}
                                    layout="vertical"
                                    initialValues={this.state}
                                >
                                    <Row>
                                        <Col sm={24} lg={8}>
                                            <Form.Item
                                                wrapperCol={{ sm: 24 }}
                                                style={{ width: "90%" }}
                                                name="name"
                                                label="Tên kịch bản"
                                                rules={[{ required: true, message: 'Cần nhập tên tên kịch bản' }]}
                                            >
                                                <Input placeholder="Tên kịch bản..." />
                                            </Form.Item>
                                        </Col>
                                        <Col sm={24} lg={8}>
                                            <Form.Item
                                                wrapperCol={{ sm: 24 }}
                                                style={{ width: "90%" }}
                                                name="writerName"
                                                label="Người viết"
                                            >
                                                <Input disabled={true} />
                                            </Form.Item>
                                        </Col>

                                        <Col sm={24} lg={8}>
                                            <Form.Item
                                                wrapperCol={{ sm: 24 }}
                                                style={{ width: "90%" }}
                                                name="forId"
                                                label="Dành cho"
                                                rules={[{ required: true, message: 'Cần đối tượng thực hiện' }]}
                                            >
                                                <Select
                                                    showSearch
                                                    placeholder=""
                                                    optionFilterProp="children"
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {this.state.listUser.map((e) => <Option key={e._id}>{e.name}</Option>)}
                                                </Select>
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
                                            Cập nhật
                                        </Button>
                                    </div>
                                </Form>
                                <Title style={{ marginTop: '20px' }} level={3}>Kịch bản chính</Title>
                                <ListScriptDetails onEdit={true} data={this.state.listscriptdetails} onDelete={this.onDeleteDetail} onAdd={this.onAddDetail} onUpdate={this.onUpdateDetail} />
                            </Col>
                            <Col sm={24} xl={6}>
                                <Title level={3}>Xem trước</Title>
                                <ReviewScriptDetail data={this.state.listscriptdetails} />
                            </Col>
                        </Row>
                    </div>
                </Content >
            );
        }
    }
}

export default edit;