import React, { Component } from 'react';
import { Button, Row, Col } from "antd";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import Search from "../../helper/search";
import { Link } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../env'
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
        // console.log('ngay hom nay', moment(new Date()).format('DD/MM/YYYY'))

        console.log(events)
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

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                <Title
                    style={{ marginLeft: 30, color: "#002140", marginTop: 15 }}
                    level={3}
                >
                    Sự kiện
              </Title>

                <Row style={{ marginLeft: 30, marginRight: 30 }}>
                    <Col span={12}>
                        <Search
                            target="tieude"
                            data={this.props.data}
                            getSearchData={(e) => this.getSearchData(e)}
                        />
                    </Col>
                    <Col span={12}>
                        <Button className="add" style={{ float: "right" }}>
                            <Link to="/addevents">Thêm sự kiện</Link>
                        </Button>
                    </Col>
                </Row>

                <div className="site-layout-background-main">
                    <Row>
                        <Col span={8} style={{padding:20}}>
                            <Title level={2}>Sắp diễn ra</Title>
                            {this.state.data_future.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col>
                        <Col span={8} style={{padding:20}}>
                            <Title level={2}>Đang diễn ra</Title>
                            {this.state.data_ongoing.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col>
                        <Col span={8} style={{padding:20}}>
                            <Title level={2}>Đã diễn ra</Title>
                            {this.state.data_past.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col>
                    </Row>

                </div>
            </Content>
        );
    }
}

export default listevents;