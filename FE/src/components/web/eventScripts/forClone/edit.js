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
import ReviewScriptDetail from '../../eventScriptDetail/withId/review'
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
class edit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listscriptdetails: [],
            data: null,
            currentUser: JSON.parse(localStorage.getItem('login')),
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
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
        ]))
        const [scriptdetails] = await trackPromise(Promise.all([
            Axios.post('/api/script-details/getAll', { scriptId: this.props.match.params.id }, {
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
        ]));

        if (script !== null && scriptdetails !== null) {
            if (this._isMounted) {
                this.setState({
                    name: script.name,
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

    goBack = (e) => {
        e.preventDefault()
        this.props.history.goBack();
    }

    onFinish = async (values) => {
        let data = {
            ...values,
            'listscriptdetails': this.state.listscriptdetails,
            'clone': true
            // updateUserId: this.state.currentUser.id
        }

        await trackPromise(Axios.put('/api/scripts/' + this.props.match.params.id, data, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then(res => {
                // Message('Tạo thành công', true, this.props);
                message.success("Cập nhật thành công")
            })
            .catch(err => {
                // Message('Tạo thất bại', false);
                message.error("Cập nhật thất bại")
                ApiFailHandler(err.response?.data?.error)
            }))
    };

    onUpdateDetail = async (value) => {
        let temp = {
            name: value.name,
            time: value.time.utc(true).toDate(),
            description: value.description,
            scriptId: this.props.match.params.id,
            clone: true
        }

        await trackPromise(
            Axios.put("/api/script-details/" + value._id, temp, {
                headers: {
                    'Authorization': AUTH()
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
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
        )

    }

    onAddDetail = async (value) => {
        value.scriptId = this.props.match.params.id
        let temp = {
            ...value,
            scriptId: this.props.match.params.id,
            updateUserId: this.state.currentUser.id,
            clone: true
        }

        this.setState({
            listscriptdetails: this.state.listscriptdetails.filter(e => e._id !== value._id)
        })
        await trackPromise(
            Axios.post("/api/script-details", temp, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) => {
                    let temp = res.data.data[0];

                    this.setState({
                        listscriptdetails: [...this.state.listscriptdetails, temp]
                    })
                    message.success("Thêm chi tiết kịch bản thành công")
                })
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
        )
    }

    onAddDetailWithoutApi = () => {
        let temp = {
            _id: uuidv1(),
            scriptId: this.props.match.params.id,
            onAdd: true,
            name: '',
            description: '',
            time: moment(new Date()).utc(true),
            noinfo: true
        }
        this.setState({
            listscriptdetails: [...this.state.listscriptdetails, temp],
        })
    }

    onDeleteDetail = async (value) => {
        if (value.noinfo || value.onAdd) {
            this.setState({
                listscriptdetails: this.state.listscriptdetails.filter(e => e._id !== value._id)
            })
        } else {
            await trackPromise(
                Axios.delete("/api/script-details/" + value._id + "?clone=true", {
                    headers: {
                        'Authorization': AUTH()
                    }
                })
                    .then((res) => {
                        let temp = this.state.listscriptdetails.filter(e => e._id !== value._id);
                        this.setState({
                            listscriptdetails: temp
                        })
                        message.success("Xóa chi tiết kịch bản thành công")
                    })
                    .catch(err => {
                        ApiFailHandler(err.response?.data?.error)
                    })
            )
        }
    }

    export = async () => {
        await trackPromise(
            Axios.post("/api/scripts/genDoc", { scriptId: this.props.match.params.id }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) => {
                    console.log(res)
                    // FileDownload(res.data, 'report.docx');
                    var win = window.open(res.data.url, '_blank');
                    win.focus();
                    message.success("tạo file thành công")
                })
                .catch(err => {
                    // console.log(err)
                    message.error("Tạo file thất bại")
                    ApiFailHandler(err.response?.data?.error)
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
                        <div style={{ width: '100%', padding: '0 10px' }} className="flex-container-row">
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/eventclones">Hồ sơ sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to="/#" onClick={this.goBack}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Sửa kịch bản
                                </Breadcrumb.Item>
                            </Breadcrumb>

                            <Button className="flex-row-item-right add" onClick={this.export}>Xuất file</Button>
                        </div>
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
                                        <Col sm={24} lg={24}>
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
                                <ListScriptDetails onEdit={true} data={this.state.listscriptdetails} onDelete={this.onDeleteDetail} onAddWithoutApi={this.onAddDetailWithoutApi} onAdd={this.onAddDetail} onUpdate={this.onUpdateDetail} />
                            </Col>
                            <Col sm={24} xl={8}>
                                <Title level={3}>Xem trước</Title>
                                <ReviewScriptDetail script_name={this.state.name} data={this.state.listscriptdetails} />
                            </Col>
                        </Row>
                    </div>
                </Content >
            );
        }
    }
}

export default edit;