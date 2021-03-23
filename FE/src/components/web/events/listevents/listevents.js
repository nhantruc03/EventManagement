import React, { Component } from 'react';
import { Button, Row, Col } from "antd";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import Search from "../../helper/search";
import { Link } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
import axios from 'axios';
import EventCard from './eventCard';
class listevents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data_future: [],
            data_past: [],
            data_ongoing: [],
            SearchData: []
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [events] = await trackPromise(Promise.all([
            axios.post('/api/events/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]));

        if (events !== null) {
            if (this._isMounted) {
                let today = new Date().setHours(0, 0, 0, 0);
                events.forEach(element => {
                    if (new Date(element.startDate).setHours(0, 0, 0, 0) > today) {
                        this.setState({
                            data_future: [...this.state.data_future, element]
                        })
                    } else if (new Date(element.startDate).setHours(0, 0, 0, 0) < today) {
                        this.setState({
                            data_past: [...this.state.data_past, element]
                        })
                    } else {
                        this.setState({
                            data_ongoing: [...this.state.data_ongoing, element]
                        })
                    }
                });
                this.setState({
                    data: events,
                })
            }
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
                        <Search
                            target={["name", "description"]}
                            multi={true}
                            data={this.state.data}
                            getSearchData={(e) => this.getSearchData(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <Button className="add" style={{ float: "right" }}>
                            <Link to="/addevents">Thêm sự kiện</Link>
                        </Button>
                    </Col>
                </Row>

                <Row>
                    {this.state.data_future.length > 0 ?
                        <Col sm={24} lg={8} style={{ padding: 20 }}>
                            <Title level={3}>Sắp diễn ra</Title>
                            {this.state.data_future.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col> : null
                    }
                    {this.state.data_ongoing.length > 0 ?
                        <Col sm={24} lg={8} style={{ padding: 20 }}>
                            <Title level={3}>Đang diễn ra</Title>
                            {this.state.data_ongoing.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col> : null
                    }
                    {this.state.data_past.length > 0 ?
                        <Col sm={24} lg={8} style={{ padding: 20 }}>
                            <Title level={3}>Đã diễn ra</Title>
                            {this.state.data_past.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col> : null
                    }
                </Row>

            </Content>
        );
    }
}

export default listevents;