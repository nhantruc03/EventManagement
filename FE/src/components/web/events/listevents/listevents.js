import React, { Component } from 'react';
import { Button, Row, Col, Dropdown, Menu, Checkbox } from "antd";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import Search from "../../helper/search";
import { Link } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
import axios from 'axios';
import EventCard from './eventCard';
import moment from 'moment'
import {
    MenuUnfoldOutlined
} from '@ant-design/icons';
import ApiFailHandler from '../../helper/ApiFailHandler'
class listevents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            data_future: [],
            data_past: [],
            data_ongoing: [],
            SearchData: [],
            currentUser: JSON.parse(localStorage.getItem('login')),
            tags: [],
        }
    }

    menu = () => (
        <Menu>
            <Menu.Item>
                <Checkbox.Group onChange={this.onChange} >
                    <div className="flex-container-column">
                        {this.renderFilterTags()}
                    </div>
                </Checkbox.Group>
            </Menu.Item>
        </Menu>
    )

    renderFilterTags = () =>
        this.state.tags.map((e, key) => {
            return (
                <Checkbox key={key} value={e._id}>{e.name}</Checkbox>
            )
        })


    onChange = (checkedValues) => {
        let temp
        if (checkedValues.length > 0) {
            temp = this.state.data.filter(e => {
                return e.tagId.some(x => checkedValues.includes(x._id))
            })
        } else {
            temp = this.state.data
        }
        this.getSearchData(temp)
    }


    async componentDidMount() {
        this._isMounted = true;
        let temp = moment(new Date()).utcOffset(0).format('YYYY-MM-DD')

        const [tags, future_event, ongoing_event, past_event] = await trackPromise(Promise.all([
            axios.post('/api/tags/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                ).catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post(`/api/events/getAll?gt=${temp}`, { isClone: false }, {
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
            axios.post(`/api/events/getAll?eq=${temp}`, { isClone: false }, {
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
            axios.post(`/api/events/getAll?lt=${temp}`, { isClone: false }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                ).catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]));

        if (future_event !== null && ongoing_event !== null && past_event !== null) {
            if (this._isMounted) {
                this.setState({
                    data: [...future_event, ...ongoing_event, ...past_event],
                    data_ongoing: ongoing_event,
                    data_past: past_event,
                    data_future: future_event,
                    tags: tags
                })
            }
            console.log(this.state.data)
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    getSearchData = (data) => {
        let list_future = []
        let list_past = []
        let list_ongoing = []
        let today = new Date().setHours(0, 0, 0, 0);
        data.forEach(element => {
            if (new Date(element.startDate).setHours(0, 0, 0, 0) > today) {
                list_future = [...list_future, element]
            } else if (new Date(element.startDate).setHours(0, 0, 0, 0) < today) {
                list_past = [...list_past, element]
            } else {
                list_ongoing = [...list_ongoing, element]
            }
        });
        this.setState({
            data_ongoing: list_ongoing,
            data_past: list_past,
            data_future: list_future
        })
    }

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                <Title
                    id="home-top-header"
                    style={{ marginLeft: 30, color: "#002140", marginTop: 15 }}
                    level={3}
                >
                    Sự kiện
                </Title>

                <Row style={{ marginLeft: 30, marginRight: 30 }}>
                    <Col span={12}>
                        <div className="flex-container-row" style={{ width: '50%' }}>
                            <Search
                                target={["name", "description"]}
                                multi={true}
                                data={this.state.data}
                                getSearchData={(e) => this.getSearchData(e)}
                                suffix={
                                    <Dropdown className="flex-row-item-right" overlay={this.menu} placement="bottomCenter" arrow >
                                        <MenuUnfoldOutlined />
                                    </Dropdown>}
                            />


                        </div>
                    </Col>
                    {this.state.currentUser.role === 'Admin' ?
                        <Col span={12}>
                            <Button className="add" style={{ float: "right" }}>
                                <Link to="/addevents">Thêm sự kiện</Link>
                            </Button>
                        </Col>
                        : null
                    }

                </Row>

                <Row style={{ overflowY: 'hidden' }}>
                    <Col xs={24} sm={24} lg={12} xl={8} className="list-events-col">
                        <div style={{ padding: '0 20px' }} className="flex-container-row">
                            <Title level={3}>Sắp diễn ra:</Title>
                            <div className="flex-row-item-right">
                                <Title level={3}>{this.state.data_future.length}</Title>
                            </div>
                        </div>
                        <div className="list-events-col-data">
                            {this.state.data_future.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </div>
                    </Col>

                    <Col xs={24} sm={24} lg={12} xl={8} className="list-events-col" >
                        <div style={{ padding: '0 20px' }} className="flex-container-row">
                            <Title level={3}>Đang diễn ra:</Title>
                            <div className="flex-row-item-right">
                                <Title level={3}>{this.state.data_ongoing.length}</Title>
                            </div>
                        </div>
                        <div className="list-events-col-data">
                            {this.state.data_ongoing.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </div>
                    </Col>

                    <Col xs={24} sm={24} lg={24} xl={8} className="list-events-col" >
                        <div style={{ padding: '0 20px' }} className="flex-container-row">
                            <Title level={3}>Đã diễn ra:</Title>
                            <div className="flex-row-item-right">
                                <Title level={3}>{this.state.data_past.length}</Title>
                            </div>
                        </div>
                        <div className="list-events-col-data">
                            {this.state.data_past.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </div>
                    </Col>
                    {/* {this.state.data_future.length > 0 ?
                        <Col lg={24} xl={8} className="list-events-col">
                            <div style={{ padding: '0 20px' }} className="flex-container-row">
                                <Title level={3}>Sắp diễn ra:</Title>
                                <div className="flex-row-item-right">
                                    <Title level={3}>{this.state.data_future.length}</Title>
                                </div>
                            </div>
                            <div className="list-events-col-data">
                                {this.state.data_future.map((value, key) =>
                                    <EventCard data={value} key={key} />
                                )}
                            </div>
                        </Col> : null
                    } */}
                    {/* {this.state.data_ongoing.length > 0 ?
                        <Col lg={24} xl={8} className="list-events-col" >
                            <div style={{ padding: '0 20px' }} className="flex-container-row">
                                <Title level={3}>Đang diễn ra:</Title>
                                <div className="flex-row-item-right">
                                    <Title level={3}>{this.state.data_ongoing.length}</Title>
                                </div>
                            </div>
                            <div className="list-events-col-data">
                                {this.state.data_ongoing.map((value, key) =>
                                    <EventCard data={value} key={key} />
                                )}
                            </div>
                        </Col> : null
                    } */}
                    {/* {this.state.data_past.length > 0 ?
                        <Col lg={24} xl={8} className="list-events-col" >
                            <div style={{ padding: '0 20px' }} className="flex-container-row">
                                <Title level={3}>Đã diễn ra:</Title>
                                <div className="flex-row-item-right">
                                    <Title level={3}>{this.state.data_past.length}</Title>
                                </div>
                            </div>
                            <div className="list-events-col-data">
                                {this.state.data_past.map((value, key) =>
                                    <EventCard data={value} key={key} />
                                )}
                            </div>
                        </Col> : null
                    } */}
                </Row>

            </Content>
        );
    }
}

export default listevents;