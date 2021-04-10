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
        console.log('checked = ', checkedValues);
        let temp
        if (checkedValues.length > 0) {
            temp = this.state.data.filter(e => {
                console.log(e.tagId.some(x => checkedValues.includes(x._id)))
                return e.tagId.some(x => checkedValues.includes(x._id))
            })
        } else {
            temp = this.state.data
        }
        this.getSearchData(temp)
    }


    async componentDidMount() {
        this._isMounted = true;
        let temp = moment(new Date()).format('DD/MM/YYYY')
        console.log(temp)
        const [tags, future_event, ongoing_event, past_event] = await trackPromise(Promise.all([
            axios.post('/api/tags/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post(`/api/events/getAll?gt=${temp}`, { isClone: false }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post(`/api/events/getAll?eq=${temp}`, { isClone: false }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post(`/api/events/getAll?lt=${temp}`, { isClone: false }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));

        console.log('future', future_event)
        console.log('ongoing', ongoing_event)
        console.log('past', past_event)

        if (future_event !== null && ongoing_event !== null && past_event !== null) {
            if (this._isMounted) {
                // this.getSearchData(events)
                this.setState({
                    data: [...future_event, ...ongoing_event, ...past_event],
                    data_ongoing: ongoing_event,
                    data_past: past_event,
                    data_future: future_event,
                    tags: tags
                })
            }
          )
          .then((res) => res.data.data),
      ])
    );

    if (events !== null) {
      if (this._isMounted) {
        let today = new Date().setHours(0, 0, 0, 0);
        events.forEach((element) => {
          if (new Date(element.startDate).setHours(0, 0, 0, 0) > today) {
            this.setState({
              data_future: [...this.state.data_future, element],
            });
          } else if (new Date(element.startDate).setHours(0, 0, 0, 0) < today) {
            this.setState({
              data_past: [...this.state.data_past, element],
            });
          } else {
            this.setState({
              data_ongoing: [...this.state.data_ongoing, element],
            });
          }
        });
        this.setState({
          data: events,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

                <Row style={{ marginLeft: 30, marginRight: 30 }}>
                    <Col span={12}>
                        <div className="flex-container-row" style={{ width: '50%' }}>
                            <Search
                                target={["name", "description"]}
                                multi={true}
                                data={this.state.data}
                                getSearchData={(e) => this.getSearchData(e)}
                            />

                            <Dropdown className="flex-row-item-right" overlay={this.menu} placement="bottomCenter" arrow >
                                {/* <EllipsisOutlined style={{ fontSize: '30px', color: '#2A9D8F' }} /> */}
                                <Button className="add">Theo Tags</Button>
                            </Dropdown>
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

                <Row>
                    {this.state.data_future.length > 0 ?
                        <Col lg={24} xl={8} className="list-events-col">
                            <Title level={3}>Sắp diễn ra</Title>
                            {this.state.data_future.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col> : null
                    }
                    {this.state.data_ongoing.length > 0 ?
                        <Col lg={24} xl={8} className="list-events-col" >
                            <Title level={3}>Đang diễn ra</Title>
                            {this.state.data_ongoing.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col> : null
                    }
                    {this.state.data_past.length > 0 ?
                        <Col lg={24} xl={8} className="list-events-col" >
                            <Title level={3}>Đã diễn ra</Title>
                            {this.state.data_past.map((value, key) =>
                                <EventCard data={value} key={key} />
                            )}
                        </Col> : null
                    }
                </Row>

        <Row>
          {this.state.data_future.length > 0 ? (
            <Col sm={24} lg={8} style={{ padding: 20 }}>
              <Title level={3}>Sắp diễn ra</Title>
              {this.state.data_future.map((value, key) => (
                <EventCard data={value} key={key} />
              ))}
            </Col>
          ) : null}
          {this.state.data_ongoing.length > 0 ? (
            <Col sm={24} lg={8} style={{ padding: 20 }}>
              <Title level={3}>Đang diễn ra</Title>
              {this.state.data_ongoing.map((value, key) => (
                <EventCard data={value} key={key} />
              ))}
            </Col>
          ) : null}
          {this.state.data_past.length > 0 ? (
            <Col sm={24} lg={8} style={{ padding: 20 }}>
              <Title level={3}>Đã diễn ra</Title>
              {this.state.data_past.map((value, key) => (
                <EventCard data={value} key={key} />
              ))}
            </Col>
          ) : null}
        </Row>
      </Content>
    );
  }
}

export default listevents;
