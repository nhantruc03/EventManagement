import { Content } from 'antd/lib/layout/layout';
import React, { Component } from 'react';
import { Row, Col, Carousel } from "antd";
import Title from 'antd/lib/typography/Title';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../env'
import EventMiniCard from './EventMiniCard/EventMiniCard';
import { Link } from 'react-router-dom';
import ActionItem from './ActionItem/ActionItem';
import CalendarSection from './CalendarSection/CalendarSection'

class home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: null,
            event_future: [],
            event_past: [],
            event_ongoing: [],
            listForCarousel: [],
        }
    }
    async componentDidMount() {
        this._isMounted = true;
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);

        const [events, actions] = await trackPromise(Promise.all([
            axios.post('/api/events/getAll', { isClone: false }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/actions/getAll', { availUser: obj.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));

        if (events !== null) {
            if (this._isMounted) {
                let today = new Date().setHours(0, 0, 0, 0);
                let temp_listForCarousel = []
                events.forEach(element => {
                    if (new Date(element.startDate).setHours(0, 0, 0, 0) > today) {
                        temp_listForCarousel.push(element)
                        this.setState({
                            event_future: [...this.state.event_future, element]
                        })
                    } else if (new Date(element.startDate).setHours(0, 0, 0, 0) < today) {
                        this.setState({
                            event_past: [...this.state.event_past, element]
                        })
                    } else {
                        temp_listForCarousel.push(element)
                        this.setState({
                            event_ongoing: [...this.state.event_ongoing, element]
                        })
                    }
                });
                this.setState({
                    events: events,
                    actions: actions
                })

                // prepare data for carousel
                temp_listForCarousel = temp_listForCarousel.sort((a, b) => {
                    return new Date(a.startDate).setHours(0, 0, 0, 0,) - new Date(b.startDate).setHours(0, 0, 0, 0,)
                })

                this.setState({
                    listForCarousel: temp_listForCarousel
                })
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    renderListAction = () => {
        return (
            this.state.actions.slice(0, 6).map((e, key) => {
                return (
                    <ActionItem data={e} stt={key} key={key} />
                )
            })
        )
    }

    renderEventCard1 = () => {
        return (
            this.state.listForCarousel.slice(0, 2).map((e, key) => {
                return (
                    <Col key={key} sm={24} xl={12} style={{ padding: '10px' }}>
                        <EventMiniCard onGoing={true} data={e} key={key} />
                    </Col>
                )
            }))
    }
    renderEventCard2 = () => {
        return (
            this.state.listForCarousel.slice(2, 4).map((e, key) => {
                return (
                    <Col key={key} sm={24} xl={12} style={{ padding: '10px' }}>
                        <EventMiniCard onGoing={true} data={e} key={key} />
                    </Col>
                )
            }))
    }


    render() {
        if (this.state.events) {
            return (
                <Content className="home">
                    <div style={{ height: '100%' }}>
                        <div style={{ padding: '10px' }}>
                            <Title
                                id="home-top-header"
                                level={3}
                            >
                                Trang chủ
                            </Title>
                        </div>
                        <Row>
                            <Col sm={24} xl={16}>
                                <Row className="status-event-row">
                                    <Col sm={24} md={8}>
                                        <div className="flex-container-row status-event-card">
                                            <p className="status-event-number">{this.state.event_ongoing.length}</p>
                                            <div className="status-event-info">
                                                <p>Sự kiện</p>
                                                <p>Đang diễn ra</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={24} md={8}>
                                        <div className="flex-container-row status-event-card">
                                            <p className="status-event-number">{this.state.event_future.length}</p>
                                            <div className="status-event-info">
                                                <p>Sự kiện</p>
                                                <p>Sắp diễn ra</p>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col sm={24} md={8}>
                                        <div className="flex-container-row status-event-card">
                                            <p className="status-event-number">{this.state.event_past.length}</p>
                                            <div className="status-event-info">
                                                <p>Sự kiện</p>
                                                <p>Đã kết thúc</p>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                                        <Title level={3}>Sự kiện</Title>
                                        <Link className="flex-row-item-right" to="/events">Xem tất cả</Link>
                                    </div>

                                    <Col lg={24}>
                                        <Carousel autoplay={false}>
                                            <div >
                                                <Row>
                                                    {this.renderEventCard1()}
                                                </Row>
                                            </div>
                                            <div>
                                                <Row>
                                                    {this.renderEventCard2()}
                                                </Row>
                                            </div>
                                        </Carousel>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={24} lg={24} style={{ padding: '10px' }}>
                                        <div className="flex-container-row" style={{ width: '100%' }}>
                                            <Title level={3}>Công việc</Title>
                                            <Link className="flex-row-item-right" to="/actions">Xem tất cả</Link>
                                        </div>
                                        <div className="home-list-action">
                                            {this.renderListAction()}
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col sm={24} xl={8}>
                                <div style={{ padding: '10px', height: '100%' }}>
                                    <CalendarSection listActions={this.state.actions} />
                                </div>

                            </Col>
                        </Row>
                    </div>
                </Content>
            );
        }
        else {
            return null
        }

    }
}

export default home;