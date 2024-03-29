import { Breadcrumb, Col, Row } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { Link } from 'react-router-dom';
import { AUTH } from '../../../env'
import ReviewScriptDetail from '../review'
import ApiFailHandler from '../../helper/ApiFailHandler'
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

        const [scripts, scripts_details] = await trackPromise(Promise.all([
            axios.get('/api/scripts/' + this.props.match.params.id, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err=>{
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
                .catch(err=>{
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
                    && now.getHours() >= event_time.getHours()) {

                    temp_onGoing = true
                }
                this.setState({
                    scripts: scripts,
                    scripts_details: scripts_details,
                    onGoing: temp_onGoing
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

    render() {
        if (this.state.scripts) {
            return (
                <Content >
                    < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                        <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                            <Breadcrumb separator=">">
                                <Breadcrumb.Item >
                                    <Link to="/eventclones">Hồ sơ sự kiện</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    <Link to="/#" onClick={this.goBack}>Chi tiết</Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item>
                                    Xem kịch bản
                                </Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </Row >

                    <div className="site-layout-background-main">
                        <Row style={{ height: '95%' }}>
                            <Col sm={24} xl={24} className="event-detail">
                                <ReviewScriptDetail onGoing={this.state.onGoing} script_name={"Kịch bản"} data={this.state.scripts_details} />
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