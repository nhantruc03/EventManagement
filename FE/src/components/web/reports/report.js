import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../env"
import {
    Button,
    Row,
    Breadcrumb,
    Col,
} from "antd";
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
// import ListParticipants from './Participants/list'
import { Link, Redirect } from "react-router-dom";
import * as constants from "../constant/actions"
import getPermission from "../helper/Credentials"
import checkPermisson from "../helper/checkPermissions"
import ApiFailHandler from '../helper/ApiFailHandler'
import NumCard from "./NumCard";
import ProgressCard from "./ProgressCard";
import Table from './table'
class report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            currentUser: JSON.parse(localStorage.getItem('login')),
            currentPermissions: []
        }
    }


    async componentDidMount() {
        this._isMounted = true;
        const [report, permissons] = await trackPromise(Promise.all([
            axios.get('/api/event-reports/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            getPermission(this.props.match.params.id).then(res => res),
        ]));

        console.log(report)


        if (this._isMounted) {
            this.setState({
                data: report,
                currentPermissions: permissons,
            })
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    goBack = (e) => {
        e.preventDefault();
        this.props.history.goBack();
    };

    createReport = async () => {
        const data = await trackPromise(
            axios.post('/api/event-reports/', { eventId: this.props.match.params.id }, {
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
        )

        this.setState({
            data
        })
    }

    render() {
        if (this.state.doneDelete) {
            return (
                <Redirect to="/events" />
            )
        } else {
            if (this.state.data) {
                return (
                    <Content >
                        < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                            <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                                <Breadcrumb separator=">">
                                    <Breadcrumb.Item >
                                        <Link to="/events">Sự kiện</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item onClick={this.goBack}>
                                        Chi tiết
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item >
                                        Báo cáo
                                    </Breadcrumb.Item>
                                </Breadcrumb>
                                {checkPermisson(this.state.currentPermissions, constants.QL_SUKIEN_PERMISSION) ?
                                    <div className="flex-row-item-right">
                                        <Button style={{ marginLeft: 10 }} onClick={() => this.createReport()} className="add">Tạo / Cập nhật báo cáo</Button>
                                    </div>
                                    : null
                                }
                            </div>
                        </Row >

                        <div className="report-container">
                            <div>
                                <Title level={3}>Thống kê</Title>

                                <Row>
                                    <Col span={8}>
                                        <NumCard name="Ban tổ chức" unit="thành viên" num={this.state.data.eventAssigns} />
                                    </Col>
                                    <Col span={8}>
                                        <NumCard name="Khách mời" unit="người" num={this.state.data.guests} />
                                    </Col>
                                    <Col span={8}>
                                        <NumCard name="Người tham gia" unit="người" num={this.state.data.participants} />
                                    </Col>
                                </Row>

                                <div style={{ padding: '10px 20px' }}>
                                    <Row style={{ backgroundColor: 'white', borderRadius: '8px' }}>
                                        <Col span={8}>
                                            <ProgressCard percent={100} name="Công việc" num={this.state.data.actions} />
                                        </Col>
                                        <Col span={8}>
                                            <ProgressCard percent={(this.state.data.completeAction * 100) / this.state.data.actions} name="Công việc đã hoàn thành" num={this.state.data.completeAction} />
                                        </Col>
                                        <Col span={8}>
                                            <ProgressCard status="exception" percent={(this.state.data.uncompleteAction * 100) / this.state.data.actions} name="Công việc chưa hoàn thành" num={this.state.data.uncompleteAction} />
                                        </Col>

                                    </Row>
                                </div>

                                <div style={{ padding: '5px 20px' }}>
                                    <Table data={this.state.data.resources} />
                                </div>

                            </div>

                        </div>
                    </Content >
                );
            } else if (this.state.currentPermissions) {
                return (
                    <Content >
                        < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                            <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                                <Breadcrumb separator=">">
                                    <Breadcrumb.Item >
                                        <Link to="/events">Sự kiện</Link>
                                    </Breadcrumb.Item>
                                    <Breadcrumb.Item onClick={this.goBack}>
                                        Chi tiết
                                </Breadcrumb.Item>
                                    <Breadcrumb.Item >
                                        Báo cáo
                                </Breadcrumb.Item>
                                </Breadcrumb>
                                {checkPermisson(this.state.currentPermissions, constants.QL_SUKIEN_PERMISSION) ?
                                    <div className="flex-row-item-right">
                                        <Button style={{ marginLeft: 10 }} onClick={() => this.createReport()} className="add">Tạo / Cập nhật báo cáo</Button>
                                    </div>
                                    : null
                                }
                            </div>


                        </Row >
                    </Content >
                )
            } else {
                return null
            }
        }

    }
}

export default report;