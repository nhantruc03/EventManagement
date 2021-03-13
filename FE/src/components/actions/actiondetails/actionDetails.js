import { Avatar, Breadcrumb, Button, Checkbox, Col, Image, message, Modal, Row, Tabs, Tag, Tooltip, Upload } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { AUTH } from '../../env'
import moment from 'moment';
import ChatRoom from './chat/ChatRoom';
import {
    UploadOutlined,
    EyeOutlined
} from '@ant-design/icons';
import ResourceCard from './resourceCard/resourceCard';
import AddSubAction from './subActions/add'
import EditSubAction from './subActions/edit'
const { TabPane } = Tabs;
class actionDetails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null,
            actionAssign: null,
            manager: null,
            resources: [],
            modalAddSubActionVisible: false,
            modalEditSubActionVisible: false,
            subActions: [],
            currentSubAction: null
        }
    }

    setModalAddSubActionVisible = (modalAddSubActionVisible) => {
        this.setState({
            modalAddSubActionVisible: modalAddSubActionVisible
        })
    }

    setModalEditSubActionVisible = (EditSubActionVisible, modal) => {
        this.setState({
            modalEditSubActionVisible: EditSubActionVisible,
            currentSubAction: modal
        })
    }

    addSubAction = (e) => {
        this.setState({
            subActions: [...this.state.subActions, e]
        })
        this.setModalAddSubActionVisible(false)
    }

    editSubAction = (e) => {
        let temp = this.state.subActions;
        temp.forEach(x => {
            if (x._id === e._id) {
                x.name = e.name
                x.description = e.description
                x.startDate = e.startDate
                x.endDate = e.endDate
            }
        })
        this.setState({
            subActions: temp
        })
        this.setModalEditSubActionVisible(false)
    }

    renderModalAddSubAction = () => {
        return (
            <AddSubAction actionId={this.props.match.params.id} add={(e) => this.addSubAction(e)} />
        )
    }
    renderModalEditSubAction = () => {
        if (this.state.currentSubAction) {
            let data = {
                ...this.state.currentSubAction,
                'startDate': moment(this.state.currentSubAction.startDate),
                'endDate': moment(this.state.currentSubAction.endDate),
            }
            return (
                <EditSubAction edit={(e) => this.editSubAction(e)} data={data} />
            )
        } else {
            return null
        }

    }


    async componentDidMount() {
        this._isMounted = true;

        const [action, actionAssign, resources, subActions] = await trackPromise(Promise.all([
            axios.get('/api/actions/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/action-assign/getAll', { actionId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/action-resources/getAll', { actionId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/sub-actions/getAll', { actionId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));


        if (action !== null) {
            if (this._isMounted) {
                this.setState({
                    data: action,
                    actionAssign: actionAssign.filter(e => e.role === 2),
                    manager: actionAssign.filter(e => e.role === 1)[0],
                    resources: resources,
                    subActions: subActions
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
    renderAvailUser = () => {
        return (
            this.state.data.availUser.map((value, key) => {
                return (
                    <div className="flex-container-row" key={key}>
                        <Tooltip title={value.name} placement="top" >
                            <Avatar src={`/api/images/${value.photoUrl}`} />
                        </Tooltip >
                        {value.name}
                    </div>

                )
            })
        )
    }

    uploadResources = async (e) => {
        let data = {
            ...e,
            actionId: this.props.match.params.id
        }
        await trackPromise(
            axios.post('/api/action-resources', data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    message.success(`${res.data.data.url} tải lên thành công`);
                    this.setState({
                        resources: [...this.state.resources, res.data.data]
                    })
                })
                .catch(err => {
                    console.log(err)
                }),
        )
    }

    deleteResources = async (e) => {
        await trackPromise(
            axios.delete('/api/action-resources/' + e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    message.success(`${res.data.data.url} xóa thành công`);
                    let temp = this.state.resources.filter(x => x._id !== e)
                    this.setState({
                        resources: temp
                    })
                })
                .catch(err => {
                    console.log(err)
                }),
        )
    }

    onChange = async (e) => {
        await trackPromise(
            axios.put('/api/sub-actions/' + e.target.value, { status: e.target.checked }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    message.success(`${res.data.data.name} Cập nhật thành công`);
                    let temp = this.state.subActions
                    temp.forEach(x => {
                        if (x._id === e.target.value) {
                            x.status = e.target.checked
                        }
                    })
                    this.setState({
                        subActions: temp
                    })
                })
                .catch(err => {
                    console.log(err)
                }),
        )

    }

    renderSubActions = () => {
        return (
            <div style={{ marginTop: '10px' }}>
                { this.state.subActions.map((e, key) =>
                    <div className="flex-container-row" style={{ marginTop: '10px' }} key={key}>
                        <Checkbox onChange={this.onChange} checked={e.status} value={e._id} >{e.name}</Checkbox>
                        <Button onClick={() => this.setModalEditSubActionVisible(true, e)} className="flex-row-item-right no-border"><EyeOutlined /></Button>
                    </div>
                )}
            </div>
        )
    }

    render() {
        if (this.state.data) {
            return (
                <Content style={{ margin: "0 16px" }}>
                    <Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/actions">Danh sách</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Chi tiết
                            </Breadcrumb.Item>
                            </Breadcrumb>
                            <Button onClick={() => { this.props.history.push(`/editevent/${this.props.match.params.id}`) }} className="flex-row-item-right">Chỉnh sửa</Button>
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
                        <Row>
                            <Col span={6} className="event-detail">
                                <div className="flex-container-row">
                                    <Title level={3}>Cần làm</Title>
                                    <Button onClick={() => this.setModalAddSubActionVisible(true)} className="flex-row-item-right add">Thêm</Button>
                                </div>
                                {this.renderSubActions()}


                                <div className="flex-container-row" style={{ marginTop: '20px' }}>
                                    <Title className="event-detail-title" level={3}>File đính kèm</Title>
                                    {/* <Button className="flex-row-item-right add">Thêm</Button> */}
                                    <Upload
                                        className="flex-row-item-right"
                                        fileList={this.state.fileList}
                                        action={`/api/upload-resources/${this.props.match.params.id}`}
                                        showUploadList={false}
                                        onChange={(info) => {
                                            // file.status is empty when beforeUpload return false
                                            if (info.file.status === 'done') {
                                                this.uploadResources(info.file.response)
                                            }
                                        }}
                                        maxCount={1}
                                    >
                                        <Button className="add" style={{ width: "100%" }} icon={<UploadOutlined />}>Tải lên</Button>
                                    </Upload>
                                </div>
                                {this.state.resources.map((e, key) => <ResourceCard delete={(e) => this.deleteResources(e)} key={key} resourcePath={this.props.match.params.id} data={e}></ResourceCard>)}
                            </Col>
                            <Col span={10} className="event-detail">
                                <div className="flex-container-row" style={{ width: '80%' }}>
                                    <Tag className="event-detail-status">{this.state.data.actionTypeId.name}</Tag>
                                    <p>Bắt đầu: {moment(this.state.data.startTime).format("DD/MM/YYYY")}</p>
                                    <p className="flex-row-item-right">{this.state.data.priorityId.name}</p>
                                </div>

                                <Title level={1}>{this.state.data.name}</Title>
                                {this.state.data.description}

                                <Title className="event-detail-title" level={3}>Sự kiện</Title>
                                {this.state.data.eventId.name}

                                <Row>
                                    <Col span={10}>
                                        <Title className="event-detail-title" level={3}>Người quản lý</Title>
                                        {this.state.manager.userId.name}
                                    </Col>

                                    <Col span={8}>
                                        <div className="vl"></div>
                                        <Title className="event-detail-title" level={3}>Kết thúc</Title>
                                        {moment(this.state.data.endDate).format("DD/MM/YYYY")}
                                    </Col>
                                    <Col span={6}>
                                        <div className="vl"></div>
                                        <Title className="event-detail-title" level={3}>Ban</Title>
                                        <Tag >{this.state.data.facultyId.name}</Tag>

                                    </Col>
                                </Row>

                                <Title className="event-detail-title" level={3}>Phân công</Title>
                                <Avatar.Group
                                    maxCount={3}
                                    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                >
                                    {this.renderAvailUser()}
                                </Avatar.Group>

                                <Title level={3}>Cover</Title>
                                <Image style={{ maxWidth: '150px' }} src={`/api/images/${this.state.data.coverUrl}`}></Image>

                                <Title level={3}>Tags</Title>
                                {/* <Image style={{ maxWidth: '300px' }} src={`/api/images/${this.state.data.coverUrl}`}></Image> */}
                                {this.state.data.tagsId.map((e, key) => <Tag style={{ width: 'auto' }} key={key}>{e.name}</Tag>)}
                            </Col>
                            <Col span={8} className="event-detail">
                                {/* <div className="vl"></div> */}
                                <Tabs className="chat-tabs" defaultActiveKey="1" >
                                    <TabPane tab="Bình luận" key="1"><ChatRoom roomId={this.props.match.params.id} /></TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </div>
                    <Modal
                        title="Thêm việc cần làm"
                        centered
                        visible={this.state.modalAddSubActionVisible}
                        onOk={() => this.setModalAddSubActionVisible(false)}
                        onCancel={() => this.setModalAddSubActionVisible(false)}
                        width="70%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModalAddSubAction()}
                    </Modal>
                    <Modal
                        title="Thêm việc cần làm"
                        centered
                        visible={this.state.modalEditSubActionVisible}
                        onOk={() => this.setModalEditSubActionVisible(false)}
                        onCancel={() => this.setModalEditSubActionVisible(false)}
                        width="70%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModalEditSubAction()}
                    </Modal>
                </Content >
            );
        }
        else {
            return null
        }

    }
}

export default actionDetails;