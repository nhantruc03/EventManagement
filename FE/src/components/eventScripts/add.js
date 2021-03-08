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
import ReviewScriptDetail from '../eventScriptDetail/withoutId/review'

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
            data: {}
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
            noinfo: true
        }
        this.setState({
            listscriptdetails: [...this.state.listscriptdetails, temp]
        })
    }

    onDeleteDetail = (value) => {
        let temp = this.state.listscriptdetails.filter(e => e._id !== value);
        this.setState({
            listscriptdetails: temp
        })
    }

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <Col span={8}>
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
                    </Col>
                </Row >

                <div className="site-layout-background-main">

                    <Row>
                        <Col span={18}>
                            <Form
                                name="validate_other"
                                {...formItemLayout}
                                onFinish={(e) => this.onFinish(e)}
                                layout="vertical"
                                initialValues={this.state.data}
                            >
                                <Row>
                                    <Col span={8}>
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
                                    <Col span={8}>
                                        <Form.Item
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%" }}
                                            name="writerName"
                                            label="Người viết"
                                        >
                                            <Input disabled={true} />
                                        </Form.Item>
                                    </Col>

                                    <Col span={8}>
                                        <Form.Item
                                            wrapperCol={{ sm: 24 }}
                                            style={{ width: "90%" }}
                                            name="forId"
                                            label="Dành cho"
                                            rules={[{ required: true, message: 'Cần đối tượng thực hiện' }]}
                                        >
                                            <Select
                                                showSearch
                                                style={{ width: 200 }}
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
                                        Tạo mới
                                    </Button>
                                </div>
                            </Form>
                            <Title style={{ marginTop: '20px' }} level={3}>Kịch bản chính</Title>
                            <ListScriptDetails data={this.state.listscriptdetails} onDelete={this.onDeleteDetail} onAdd={this.onAddDetail} onUpdate={this.onUpdateDetail} />
                        </Col>
                        <Col span={6}>
                            <Title level={3}>Xem trước</Title>
                            <ReviewScriptDetail data={this.state.listscriptdetails} />
                        </Col>
                    </Row>

                </div>

            </Content >
        );
    }
}

export default add;