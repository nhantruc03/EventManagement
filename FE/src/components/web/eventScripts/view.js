import { Breadcrumb, Button, Col, message, Row, Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { AUTH } from '../../env'
import ReviewScriptDetail from './review'
import ChatRoom from '../chat/ChatRoom';
import History from './history';
import ApiFailHandler from '../helper/ApiFailHandler'
const { TabPane } = Tabs
class view extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: JSON.parse(localStorage.getItem('login')),
            scripts: null,
            scripts_details: [],
            onGoing: false
        }
    }


    async componentDidMount() {
        this._isMounted = true;

        const [scripts, scripts_details, history] = await trackPromise(Promise.all([
            axios.get('/api/scripts/' + this.props.match.params.id, {
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
            axios.post('/api/script-details/getAll', { scriptId: this.props.match.params.id }, {
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
            axios.post('/api/script-histories/getAll', { scriptId: this.props.match.params.id }, {
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

        if (scripts !== null) {
            if (this._isMounted) {
                let temp_onGoing = false
                let now = new Date()
                let event_date = new Date(scripts.eventId.startDate)
                let event_time = new Date(scripts.eventId.startTime)

                if (now.getFullYear() === event_date.getFullYear() && now.getMonth() === event_date.getMonth() && now.getDate() === event_date.getDate()
                    && now.getHours() >= (event_time.getHours() - 7)) {

                    temp_onGoing = true
                }
                this.setState({
                    scripts: scripts,
                    scripts_details: scripts_details,
                    onGoing: temp_onGoing,
                    history: history
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

    export = async () => {
        await trackPromise(
            axios.post("/api/scripts/genDoc", { scriptId: this.props.match.params.id }, {
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
        if (this.state.scripts) {
            return (
                <Content >
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/events">Danh sách sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to="/#" onClick={this.goBack}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Xem kịch bản
                                </Breadcrumb.Item>
                            </Breadcrumb>

                            <Button className="flex-row-item-right add" onClick={this.export}>Xuất file</Button>
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
                        <Row style={{ height: '90%' }}>
                            <Col sm={24} xl={16} className="event-detail">
                                <ReviewScriptDetail onGoing={this.state.onGoing} script_name={"Kịch bản"} data={this.state.scripts_details} />
                            </Col>
                            <Col sm={24} xl={8} className="event-detail">
                                <Tabs className="chat-tabs" defaultActiveKey="1" >
                                    <TabPane tab="Bình luận" key="1">
                                        <ChatRoom style={{ maxHeight: '75vh' }} roomId={this.props.match.params.id} />
                                    </TabPane>
                                    <TabPane tab="Lịch sử" key="2">
                                        <History data={this.state.history} />
                                    </TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                    </div>
                </Content >
            );
        } else {
            return null;
        }

    }
}

export default view;