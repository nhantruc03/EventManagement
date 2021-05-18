import React, { Component } from 'react';
import { Button, Row, Col } from "antd";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import Search from "../../helper/search";
import { Link } from "react-router-dom";
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
import axios from 'axios';
import EventCard from './eventCardClones';
import ApiFailHandler from '../../helper/ApiFailHandler'
class listevents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            SearchData: [],
            currentUser: JSON.parse(localStorage.getItem('login'))
        }
    }
    async componentDidMount() {
        this._isMounted = true;
        const [events] = await trackPromise(Promise.all([
            axios.post('/api/events/getAll', { isClone: true }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err=>{
                    ApiFailHandler(err.response?.data?.error)
                })
        ]));

        if (events !== null) {
            if (this._isMounted) {
                this.setState({
                    data: events,
                    SearchData: events
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    getSearchData = (data) => {
        this.setState({
            SearchData: data
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
                    Hồ sơ sự kiện
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
                    {this.state.currentUser.role === 'Admin' ?
                        <Col span={12}>
                            <Button className="add" style={{ float: "right" }}>
                                <Link to="/addeventclones">Thêm hồ sơ sự kiện</Link>
                            </Button>
                        </Col>
                        : null
                    }
                </Row>

                <Row>
                    <Col sm={24} lg={8} style={{ padding: 20 }}>
                        {/* <Title level={3}>Sắp diễn ra</Title> */}
                        {this.state.SearchData.map((value, key) =>
                            <EventCard data={value} key={key} />
                        )}
                    </Col>
                </Row>

            </Content>
        );
    }
}

export default listevents;