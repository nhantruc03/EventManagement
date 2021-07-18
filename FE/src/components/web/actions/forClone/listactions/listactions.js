import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import React, { Component } from 'react';
import AddAction from '../addactions/addactions'
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../../env'
import axios from 'axios';
import Search from "../../../helper/search";
import ActionColumn from './actionColumn';
import ApiFailHandler from '../../../helper/ApiFailHandler'
import * as constants from "../../../constant/actions";
import checkPermisson from "../../../helper/checkPermissions";
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
            currentActions: [],
            temp_data: [],
            modalEditActionTypeVisible: false,
            ActionTypeForEdit: {}
        }
    }

    setModalEditActionTypeVisible(modalEditActionTypeVisible) {
        this.setState({
            modalEditActionTypeVisible
        })
    }

    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }
    setModalVisible2(modalVisible2) {
        this.setState({ modalVisible2 });
    }

    deleteActionTypes = async (value) => {
        const result = await trackPromise(axios.delete(`/api/action-types/${value._id}`, {
            headers: {
                Authorization: AUTH(),
            },
        })
            .then((res) => {
                message.success("Xóa thành công")
                return res.data.data;
            })
            .catch(err => {
                message.error("Xóa thất bại")
                ApiFailHandler(err.response?.data?.error)
            })
        )
        if (result) {
            this.setState({
                currentActionTypes: this.state.currentActionTypes.filter(x => x._id !== result._id)
            })
        }
    }

    onEditActionType = (ActionTypeForEdit) => {
        // console.log(e)
        this.setState({
            ActionTypeForEdit,
        })
        if (this.formEditActionType.current) {
            this.formEditActionType.current.setFieldsValue(ActionTypeForEdit)
        }
        this.setModalEditActionTypeVisible(true)
    }

    onFinishEditActionType = async (e) => {
        let data = {
            ...e,
            eventId: this.state.currentEvent._id,
        }

        const result = await trackPromise(axios.put(`/api/action-types/${this.state.ActionTypeForEdit._id}`, data, {
            headers: {
                Authorization: AUTH(),
            },
        })
            .then((res) => {
                message.success("Cập nhật thành công")
                return res.data.data;
            })
            .catch(err => {
                message.error("Cập nhật thất bại")
                ApiFailHandler(err.response?.data?.error)
            })
        )
        if (result) {
            let temp = this.state.currentActionTypes
            temp.forEach(x => {
                if (x._id === result._id) {
                    x.name = result.name
                }
            })
            this.setState({
                currentActionTypes: temp
            })
            this.setModalEditActionTypeVisible(false)
        }
    }

    formEditActionType = React.createRef()
    renderModelEditActionType = () => {
        return (
            <Form
                ref={this.formEditActionType}
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinishEditActionType(e)}
                layout="vertical"
                initialValues={this.state.ActionTypeForEdit}
            >
                <Form.Item
                    wrapperCol={{ sm: 24 }}
                    name="name"
                    rules={[{ required: true, message: "Cần nhập tên loại công việc" }]}
                >
                    <Input placeholder="Tên loại công việc..." />
                </Form.Item>
                <br></br>
                <div className="flex-container-row">
                    <div className="flex-container-row flex-row-item-right">
                        <Button onClick={() => this.setModalEditActionTypeVisible(false)} style={{ marginRight: 5 }} className="back">
                            Hủy
              </Button>
                        <Button htmlType="submit" className="add">
                            Cập nhật
            </Button>
                    </div>
                </div>
            </Form>
        );
    }

    onFinish = async (e) => {
        let data = {
            ...e,
            eventId: this.props.eventId
        }
        await trackPromise(
            axios.post('/api/action-types', data, {
                headers: {
                    'Authorization': AUTH()
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
                    ApiFailHandler(err.response?.data?.error)
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
                    rules={[{ required: true, message: 'Cần nhập tên loại công việc' }]}
                >
                    <Input placeholder="Tên loại công việc..." />
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

        const [event, actionTypes, falcuties, actions] = await trackPromise(Promise.all([
            axios.get('/api/events/' + this.props.eventId, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/action-types/getAll', { eventId: this.props.eventId }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/faculties/getAll', { eventId: this.props.eventId }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/actions/getAll', { eventId: this.props.eventId }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]))


        if (actionTypes !== null && falcuties !== null && actions !== null) {
            if (this._isMounted) {
                this.setState({
                    currentEvent: event,
                    currentActionTypes: actionTypes,
                    currentFaculties: falcuties,
                    currentActions: actions,
                    temp_data: actions
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    renderActionsView = (value, keyCol) => {
        let temp_listActions = this.state.currentActions.filter(e => e.actionTypeId._id === value._id)
        return (
            <Col sm={24} xl={24 / this.state.currentActionTypes.length} key={keyCol} style={{ padding: "10px 0" }}>
                <ActionColumn canEdit={checkPermisson(this.props.currentPermissions, constants.QL_CONGVIEC_PERMISSION)} onDeleteActionType={() => this.deleteActionTypes(value)} onEditActionType={() => { this.onEditActionType(value) }} title={value.name} listActions={temp_listActions} />
            </Col>
        )
    }

    renderView = () => {
        if (this.state.currentEvent) {
            return (
                <div className="flex-container-row" style={{ alignItems: 'unset' }}>
                    <div className="flex-container-row horizontal-container" style={{ width: "100%" }}>
                        {this.state.currentActionTypes.map((e, key) => {
                            return this.renderActionsView(e, key)
                        })}
                    </div>

                    <Button className="add flex-row-item-right" onClick={() => this.setModalVisible2(true)}>
                        +
                    </Button>
                </div>
            )
        } else {
            return null;
        }
    }

    getSearchData = (data) => {
        console.log('data', data)
        this.setState({
            currentActions: data
        })
    }

    render() {
        return (
            <Content>
                <Row>
                    <div style={{ width: '100%' }} className="flex-container-row">
                        <Title
                            id="home-top-header"
                            level={2}
                        >
                            Công việc
                        </Title>
                        <div className="flex-row-item-right">
                            <div className="flex-container-row">
                                <Search
                                    target={["name", "description"]}
                                    multi={true}
                                    data={this.state.temp_data}
                                    getSearchData={(e) => this.getSearchData(e)}
                                />
                                <Button className="add" style={{ marginLeft: '20px' }} onClick={() => this.setModalVisible(true)}>
                                    Thêm công việc
                                </Button>
                            </div>
                        </div>
                    </div>
                </Row>

                <div style={{ padding: "10px 30px" }}>{this.renderView()}</div>


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
                <Modal
                    title="Sửa loại công việc"
                    centered
                    visible={this.state.modalEditActionTypeVisible}
                    onOk={() => this.setModalEditActionTypeVisible(false)}
                    onCancel={() => this.setModalEditActionTypeVisible(false)}
                    width="30%"
                    pagination={false}
                    footer={false}
                >
                    {this.renderModelEditActionType()}
                </Modal>
            </Content >
        );

    }
}

export default listactions;