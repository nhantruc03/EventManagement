import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../env';
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Breadcrumb, Button, Col, Form, Input, message, Row, Select } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import { v1 as uuidv1 } from 'uuid';
import ListScriptDetails from '../eventScriptDetail/list'
import ReviewScriptDetail from '../eventScriptDetail/withoutId/review'
import moment from 'moment'
import ApiFailHandler from '../helper/ApiFailHandler'
const { Option } = Select;
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
            writerName: '',
            writerId: '',
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
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        this.setState({
            data: {
                name: null,
                writerName: obj.name,
                writerId: obj.id,
                forId: null,
            }
        })
    }

    async componentDidMount() {
        this._isMounted = true;
        const [event] = await trackPromise(Promise.all([
            Axios.get('/api/events/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
        ]));

        if (event !== null) {
            if (this._isMounted) {
                this.setState({
                    listUser: event.availUser
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
            'writerId': this.props.forClone ? undefined : this.state.data.writerId,
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
                message.success('Tạo thành công');
                this.props.history.goBack();
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
                e.time = value.time
                e.description = value.description
                e.noinfo = value.noinfo
            }
        })
        this.setState({
            listscriptdetails: temp.sort((a, b) => {
                let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
                let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
                return temp_b.isBefore(temp_a) ? 1 : -1;
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
        let temp_list = this.state.listscriptdetails
        temp_list = temp_list.sort((a, b) => {
            let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
            let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
            return temp_b.isBefore(temp_a) ? 1 : -1;
        })
        temp_list.push(temp)
        this.setState({
            listscriptdetails: temp_list
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
                        {this.props.forClone ?
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/eventclones">Hồ sơ sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={`/eventclones/${this.props.match.params.id}`}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Kịch bản
                          </Breadcrumb.Item>
                            </Breadcrumb>
                            :
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/events">Sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to={`/events/${this.props.match.params.id}`}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Kịch bản
                            </Breadcrumb.Item>
                            </Breadcrumb>
                        }

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
                                    <Col sm={24} lg={12}>
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
                                    {/* <Button
                                        onClick={this.goBack}
                                        className="back"
                                        style={{ width: 150, marginRight: 20 }}
                                    >
                                        Hủy
                                    </Button> */}
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