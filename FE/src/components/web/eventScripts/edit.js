import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env';
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Col, Form, Input, message, Row, Select, Tabs } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import { v1 as uuidv1 } from 'uuid';
import ListScriptDetails from '../eventScriptDetail/list'
import ReviewScriptDetail from '../eventScriptDetail/withId/review'
import { w3cwebsocket } from 'websocket';
import History from './history';
import * as PushNoti from '../helper/pushNotification'
const { TabPane } = Tabs;
const client = new w3cwebsocket('ws://localhost:3001');
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
            data: null,
            currentUser: JSON.parse(localStorage.getItem('login')),
            history: []
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    async componentDidMount() {
        this._isMounted = true;
        client.onopen = () => {
            console.log('Connect to ws at script')
        }
        const [script, history] = await trackPromise(Promise.all([
            Axios.get('/api/scripts/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            Axios.post('/api/script-histories/getAll', { scriptId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]))
        const [event, scriptdetails] = await trackPromise(Promise.all([
            Axios.get('/api/events/' + script.eventId._id, {
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
                    }),
                    history: history
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
            updateUserId: this.state.currentUser.id
        }

        console.log('Received values of form: ', data);
        await trackPromise(Axios.put('/api/scripts/' + this.props.match.params.id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                // Message('Tạo thành công', true, this.props);
                message.success("Cập nhật thành công")
                client.send(JSON.stringify({
                    type: "sendNotification",
                    notification: res.data.notification
                }))
                PushNoti.sendPushNoti(res.data.notification)
                this.setState({
                    history: [...this.state.history, res.data.history]
                })
            })
            .catch(err => {
                // Message('Tạo thất bại', false);
                message.error("Cập nhật thất bại")
            }))
    };

    onUpdateDetail = async (value) => {
        let temp = {
            name: value.name,
            time: value.time.utc(true).toDate(),
            description: value.description,
            scriptId: this.props.match.params.id,
            updateUserId: this.state.currentUser.id
        }

        await trackPromise(
            Axios.put("/api/script-details/" + value._id, temp, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    console.log(res.data)
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
                        }),
                        history: [...this.state.history, res.data.history]
                    })

                    client.send(JSON.stringify({
                        type: "sendNotification",
                        notification: res.data.notification
                    }))
                    PushNoti.sendPushNoti(res.data.notification)
                    message.success("Cập nhật chi tiết kịch bản thành công")
                })
                .catch(err => {
                    message.error("Cập nhật chi tiết kịch bản thất bại")
                })
        )
    }



    onAddDetail = async () => {
        await trackPromise(
            Axios.post("/api/script-details", { name: uuidv1(), description: '<p>Hãy nhập thông tin chi tiết<p>', updateUserId: this.state.currentUser.id, time: new Date(), scriptId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    let temp = res.data.data[0];
                    temp.noinfo = true;
                    this.setState({
                        listscriptdetails: [...this.state.listscriptdetails, temp],
                        history: [...this.state.history, res.data.history]
                    })
                    client.send(JSON.stringify({
                        type: "sendNotification",
                        notification: res.data.notification
                    }))
                    PushNoti.sendPushNoti(res.data.notification)
                    message.success("Thêm chi tiết kịch bản thành công")
                })
                .catch(err => {
                    message.error("Thêm chi tiết kịch bản thất bại")
                })
        )

    }

    onDeleteDetail = async (value) => {
        await trackPromise(
            Axios.delete("/api/script-details/" + value + `? updateUserId = ${this.state.currentUser.id}`, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    let temp = this.state.listscriptdetails.filter(e => e._id !== value);
                    this.setState({
                        listscriptdetails: temp,
                        history: [...this.state.history, res.data.history]
                    })
                    client.send(JSON.stringify({
                        type: "sendNotification",
                        notification: res.data.notification
                    }))
                    PushNoti.sendPushNoti(res.data.notification)
                    message.success("Xóa chi tiết kịch bản thành công")
                })
                .catch(err => {
                    message.error("Xóa chi tiết kịch bản thất bại")
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

                    <div className="add-scripts site-layout-background-main">

                        <Row style={{ height: '90%' }}>
                            <Col sm={24} xl={16}>
                                <Form
                                    name="validate_other"
                                    {...formItemLayout}
                                    onFinish={(e) => this.onFinish(e)}
                                    layout="vertical"
                                    initialValues={this.state}
                                >
                                    <Row>
                                        <Col sm={24} lg={12}>
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

                                        <Col sm={24} lg={12}>
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
                            <Col sm={24} xl={8}>
                                <Tabs defaultActiveKey="1" >
                                    <TabPane tab={"TimeLine"} key={1}>
                                        <ReviewScriptDetail script_name={this.state.name} data={this.state.listscriptdetails} />
                                    </TabPane>
                                    <TabPane tab={"Lịch sử"} key={2}>
                                        <History data={this.state.history} />
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </div>
                </Content >
            );
        }
    }
}

export default edit;