import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React, { Component } from 'react';
import AddAction from '../addactions/addactions'
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../env'
import axios from 'axios';
import ActionCard from './actionCard';
const { Option } = Select;
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class listactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            modalVisible2: false,
            events: null,
            currentEvent: null,
            currentActionTypes: [],
            currentFaculties: null,
            currentActions: []
        }
    }

    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }
    setModalVisible2(modalVisible2) {
        this.setState({ modalVisible2 });
    }

    onFinish = async (e) => {
        let data = {
            ...e,
            eventId: this.state.currentEvent._id
        }
        await trackPromise(
            axios.post('/api/action-types', data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    console.log(res.data.data)
                    this.setState({
                        currentActionTypes: [...this.state.currentActionTypes, res.data.data]
                    })
                    this.form.current.resetFields();
                    this.setModalVisible2(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        )
    }

    form = React.createRef();
    renderModel2 = () => {
        return (
            <Form
                ref={this.form}
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
            >
                <Form.Item
                    wrapperCol={{ sm: 24 }}
                    name="name"
                    rules={[{ required: true, message: 'Cần nhập tên phòng hội thoại' }]}
                >
                    <Input placeholder="Tên phòng hội thoại..." />
                </Form.Item>
                <br></br>
                <div className="flex-container-row">
                    <Button htmlType="submit" className="flex-row-item-right add" >
                        Tạo mới
                </Button>
                </div>
            </Form>
        )
    }
    renderModel = () => {
        return (
            <AddAction done={(e) => this.doneAddAction(e)} event={this.state.currentEvent} actionTypes={this.state.currentActionTypes} faculties={this.state.currentFaculties} />
        )
    }

    doneAddAction = (e) => {
        console.log(e)
        this.setState({
            currentActions: [...this.state.currentActions, e]
        })
        this.setModalVisible(false)
    }

    async componentDidMount() {
        this._isMounted = true;
        const [events] = await trackPromise(Promise.all([
            axios.post('/api/events/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));

        console.log(events)

        if (events !== null) {
            if (this._isMounted) {
                this.setState({
                    events: events,
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    onchangeEvent = async (value) => {
        console.log(value)
        let temp = this.state.events.filter(e => e._id === value)
        console.log(temp[0])
        this.setState({
            currentEvent: temp[0]
        })

        const [actionTypes, falcuties, actions] = await trackPromise(Promise.all([
            axios.post('/api/action-types/getAll', { eventId: temp[0]._id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/faculties/getAll', { eventId: temp[0]._id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/actions/getAll', { eventId: temp[0]._id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),

        ]))
        console.log(actionTypes)
        console.log('actions', actions)
        if (actionTypes !== null && falcuties !== null && actions !== null) {
            this.setState({
                currentActionTypes: actionTypes,
                currentFaculties: falcuties,
                currentActions: actions
            })
        }
    }

    renderActionsView = (value, keyCol) => {
        return (
            <Col key={keyCol}>
                <Title level={4}>{value.name}</Title>
                {this.state.currentActions.map((e, key) => {
                    console.log(e)
                    console.log(value)
                    if (e.actionTypeId._id === value._id) {
                        return (
                            <ActionCard data={e} key={key} />
                        )
                    } else {
                        return null
                    }
                })}
            </Col>
        )
    }

    renderView = () => {
        if (this.state.currentEvent) {
            return (
                <div className="site-layout-background-main">
                    <div className="flex-container-row" style={{ alignItems: 'unset' }}>
                        <Row>
                            {this.state.currentActionTypes.map((e, key) => {
                                return (
                                    this.renderActionsView(e, key)
                                )
                            })}
                        </Row>

                        <Button className="add flex-row-item-right" onClick={() => this.setModalVisible2(true)}>
                            +
                        </Button>
                    </div>


                </div>
            )

        } else {
            return null
        }
    }

    render() {
        if (this.state.events !== null) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    <Row style={{ marginLeft: 30, marginRight: 30 }}>
                        <Col span={24}>
                            <Title
                                style={{ color: "#002140", marginTop: 15 }}
                                level={3}
                            >
                                Sự kiện
                            </Title>
                        </Col>
                    </Row>


                    <Row style={{ marginLeft: 30, marginRight: 30 }}>
                        <Col span={12}>
                            {/* <Search
                                target="tieude"
                                data={this.props.data}
                                getSearchData={(e) => this.getSearchData(e)}
                            /> */}
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                onChange={this.onchangeEvent}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {this.state.events.map((e) => <Option key={e._id}>{e.name}</Option>)}
                            </Select>
                        </Col>
                        <Col span={12}>
                            <Button disabled={this.state.currentEvent ? false : true} className="add" style={{ float: "right" }} onClick={() => this.setModalVisible(true)}>
                                Thêm công việc
                            </Button>
                        </Col>
                    </Row>
                    {this.renderView()}


                    <Modal
                        title="Tạo công việc mới"
                        centered
                        visible={this.state.modalVisible}
                        onOk={() => this.setModalVisible(false)}
                        onCancel={() => this.setModalVisible(false)}
                        width="40%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModel()}
                    </Modal>
                    <Modal
                        title="Tạo loại công việc"
                        centered
                        visible={this.state.modalVisible2}
                        onOk={() => this.setModalVisible2(false)}
                        onCancel={() => this.setModalVisible2(false)}
                        width="30%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModel2()}
                    </Modal>
                </Content>
            );
        }
        else {
            return null
        }

    }
}

export default listactions;