import { Avatar, Breadcrumb, Button, Checkbox, Col, Image, message, Modal, Popconfirm, Row, Tag, Tooltip, Upload } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Title from 'antd/lib/typography/Title';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { AUTH } from '../../../../env'
import moment from 'moment';
import {
    UploadOutlined,
    DeleteOutlined,
    EyeOutlined
} from '@ant-design/icons';
import ResourceCard from './resourceCard/resourceCard';
import AddSubAction from './subActions/add'
import EditSubAction from './subActions/edit'
import EditAction from './editAction/editAction'
import ApiFailHandler from '../../../helper/ApiFailHandler'
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
            currentSubAction: null,
            modalEditActionVisible: false,
            currentStatus: '',
        }
    }

    setModalEditActionVisible = (modalEditActionVisible) => {
        this.setState({
            modalEditActionVisible: modalEditActionVisible
        })
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
                x.startTime = e.startTime
                x.endTime = e.endTime
            }
        })
        this.setState({
            subActions: temp
        })
        this.setModalEditSubActionVisible(false)
    }

    updateAction = (action) => {
        // console.log(e)
        this.setState({
            data: action,
        })
        this.setModalEditActionVisible(false)
    }

    renderModalEditAction = () => {
        return (
            <EditAction data={this.state.data} manager={this.state.manager} update={(action) => this.updateAction(action)} />
        )
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
                'startTime': moment(this.state.currentSubAction.startTime),
                'endTime': moment(this.state.currentSubAction.endTime),
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
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/action-assign/getAll', { actionId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/action-resources/getAll', { actionId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/sub-actions/getAll', { actionId: this.props.match.params.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]));


        if (action !== null) {
            if (this._isMounted) {
                console.log(action)
                let now = moment(new Date().setHours(0, 0, 0, 0))
                let data_Date = moment(new Date(action.startDate).setHours(0, 0, 0, 0))
                let temp_status = ''
                if (data_Date > now) {
                    temp_status = 'Sắp diễn ra'
                } else if (data_Date === now) {
                    temp_status = 'Đang diễn ra'
                }
                else {
                    temp_status = 'Đã diễn ra'
                }
                this.setState({
                    data: action,
                    actionAssign: actionAssign.filter(e => e.role === 2),
                    manager: actionAssign.filter(e => e.role === 1)[0],
                    resources: resources,
                    subActions: subActions,
                    currentStatus: temp_status
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
                    <Col lg={12} key={key}>
                        <div className="flex-container-row" >
                            <Tooltip title={value.name} placement="top" >
                                <Avatar src={`${window.resource_url}${value.photoUrl}`} />
                            </Tooltip >
                            <p style={{ marginLeft: '10px' }} className="black-2 flex-row-item-right">{value.name}</p>
                        </div>
                    </Col>
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
                    ApiFailHandler(err.response?.data?.error)
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
                    ApiFailHandler(err.response?.data?.error)
                }),
        )

    }

    deleteSubAction = async (e) => {
        await trackPromise(
            axios.delete('/api/sub-actions/' + e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    message.success(`${res.data.data.name} xóa thành công`);
                    let temp = this.state.subActions.filter(x => x._id !== e)
                    this.setState({
                        subActions: temp
                    })
                })
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        )
    }

    renderSubActions = () => {
        return (
            <div style={{ marginTop: '10px' }}>
                { this.state.subActions.map((e, key) =>
                    <div className="flex-container-row" style={{ marginTop: '10px' }} key={key}>
                        <Checkbox className="checkbox" onChange={this.onChange} checked={e.status} style={e.status ? { textDecoration: 'line-through' } : null} value={e._id} >{e.name}</Checkbox>
                        <Button onClick={() => this.setModalEditSubActionVisible(true, e)} className="flex-row-item-right no-border"><EyeOutlined /></Button>
                        <Popconfirm
                            title="Bạn có chắc muốn xóa chứ?"
                            onConfirm={() => this.deleteSubAction(e._id)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                        >
                            <Button className="no-border"><DeleteOutlined /></Button>
                        </Popconfirm>
                    </div>
                )}
            </div>
        )
    }

    goBack = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    }

    deleteAction = async () => {
        const result = await trackPromise(axios.delete('/api/actions/' + this.props.match.params.id, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then((res) => {
                message.success('Xóa công việc thành công')
                return res.data.data
            })
            .catch(err => {
                message.error('Xóa công việc thất bại')
                ApiFailHandler(err.response?.data?.error)
            })
        )
        if (result) {
            this.props.history.goBack();
        }
    }

    render() {
        if (this.state.data) {
            return (
                <Content className="action-details" style={{ margin: "0 16px" }}>
                    <Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/eventclones">Hồ sơ sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to="/#" onClick={this.goBack}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Công việc
                                </Breadcrumb.Item>
                            </Breadcrumb>
                            <div className="flex-row-item-right">
                                <Popconfirm
                                    title="Bạn có chắc muốn xóa chứ?"
                                    onConfirm={this.deleteAction}
                                    okText="Đồng ý"
                                    cancelText="Hủy"
                                >
                                    <Button className="delete">Xóa</Button>
                                </Popconfirm>
                                <Button style={{ marginLeft: 10 }} onClick={() => this.setModalEditActionVisible(true)} className="add">Chỉnh sửa</Button>
                            </div>
                            {/* <Button onClick={() => this.setModalEditActionVisible(true)} className="flex-row-item-right add">Chỉnh sửa</Button> */}
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
                        <Row style={{ height: '95%' }}>
                            <Col sm={24} xl={7} className="event-detail">
                                <div className="flex-container-row">
                                    <Title style={{ color: '#264653' }} level={3}>Cần làm</Title>
                                    <Button onClick={() => this.setModalAddSubActionVisible(true)} className="flex-row-item-right add">Thêm</Button>
                                </div>
                                {this.renderSubActions()}


                                <div className="flex-container-row" style={{ marginTop: '20px' }}>
                                    <Title style={{ color: '#264653' }} level={3}>File đính kèm</Title>
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
                            <Col sm={24} xl={14} className="event-detail">
                                <Image style={{ maxHeight: '200px' }} src={`${window.resource_url}${this.state.data.coverUrl}`}></Image>

                                <Title style={{ color: '#017567' }} level={1}>{this.state.data.name}</Title>

                                <div className="flex-container-row" style={{ width: '80%' }}>
                                    <Tag className="event-detail-status">{this.state.currentStatus}</Tag>
                                </div>


                                <Title level={4}>Mô tả</Title>
                                <p style={{ color: '#001529' }}>{this.state.data.description}</p>



                                <Title level={4}>Thuộc sự kiện</Title>
                                <p className="black-2">{this.state.data.eventId.name}</p>

                                <Row>
                                    <Col sm={24} md={12} style={{ textAlign: 'left' }}>
                                        <Title level={4}>Ban</Title>
                                        <p >{this.state.data.facultyId.name}</p>
                                    </Col>

                                    <Col sm={24} md={12} style={{ textAlign: 'right' }}>
                                        <Title level={4}>Hạn chót</Title>
                                        {moment(this.state.data.endDate).utcOffset(0).format("DD/MM/YYYY")} - {moment(this.state.data.endTime).utcOffset(0).format("HH:mm")}
                                    </Col>
                                </Row>


                                <Title className="event-detail-title" level={4}>Tags</Title>
                                {this.state.data.tagsId.map((e, key) => <Tag style={{ width: 'auto', background: e.background, color: e.color }} key={key}>{e.name}</Tag>)}
                            </Col>
                        </Row>
                    </div>
                    <Modal
                        title="Thêm việc cần làm"
                        centered
                        visible={this.state.modalAddSubActionVisible}
                        onOk={() => this.setModalAddSubActionVisible(false)}
                        onCancel={() => this.setModalAddSubActionVisible(false)}
                        width="30%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModalAddSubAction()}
                    </Modal>
                    <Modal
                        title="Sửa thông tin việc cần làm"
                        centered
                        visible={this.state.modalEditSubActionVisible}
                        onOk={() => this.setModalEditSubActionVisible(false)}
                        onCancel={() => this.setModalEditSubActionVisible(false)}
                        width="30%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModalEditSubAction()}
                    </Modal>

                    <Modal
                        title="Sửa thông tin công việc"
                        centered
                        visible={this.state.modalEditActionVisible}
                        onOk={() => this.setModalEditActionVisible(false)}
                        onCancel={() => this.setModalEditActionVisible(false)}
                        width="70%"
                        pagination={false}
                        footer={false}
                    >
                        {this.renderModalEditAction()}
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