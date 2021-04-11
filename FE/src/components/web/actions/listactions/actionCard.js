import { Avatar, Card, Col, Image, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import {
    PaperClipOutlined,
    CheckSquareOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../env'
const { Meta } = Card;

class actionCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            completeSubAction: [],
            totalSubAction: [],
            resources: []
        }
    }
    renderAvailUser = () => {
        return (
            this.props.data.availUser.map((value, key) => {
                return (
                    <Tooltip title={value.name} placement="top" key={key}>
                        <Avatar src={`api/images/${value.photoUrl}`} />
                    </Tooltip >
                )
            })
        )
    }

    async componentDidMount() {
        this._isMounted = true;

        const [subActions, resources] = await trackPromise(Promise.all([
            axios.post('/api/sub-actions/getAll', { actionId: this.props.data._id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            axios.post('/api/action-resources/getAll', { actionId: this.props.data._id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));


        if (subActions !== null) {
            if (this._isMounted) {
                subActions.forEach(e => {
                    if (e.status) {
                        this.setState({
                            completeSubAction: [...this.state.completeSubAction, e]
                        })
                    }
                })
                this.setState({
                    totalSubAction: subActions,
                    resources: resources
                })

                let temp = {
                    _id: this.props.data._id,
                    total: subActions.length
                }
                this.props.addTotalSubOfAction(temp)
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        return (
            <div className="event-card-container">

                <Card
                    hoverable
                    className="eventCard"
                    // cover={<img className="cover" alt="example" src={`api/images/${this.props.data.coverUrl}`} />}
                    cover={<Image className="cover" alt="example" src={`api/images/${this.props.data.coverUrl}`} />}

                >
                    <Link to={`/actions/${this.props.data._id}`}>
                        <Tooltip title={this.props.data.description} placement="top">
                            <Meta title={this.props.data.name} />
                        </Tooltip>

                        <Row >
                            <img style={{ marginRight: '20px' }} alt="clock icon" src="/clock.png" />  {moment(this.props.data.startTime).format('DD/MM/YYYY')} - {moment(this.props.data.startDate).format('DD/MM/YYYY')}
                        </Row>

                        <Row>
                            <div className="flex-container-row">
                                <PaperClipOutlined style={{ marginLeft: '5px' }} />
                                <p>{this.state.resources.length}</p>

                                <CheckSquareOutlined style={{ marginLeft: '20px' }} />
                                <p >{this.state.completeSubAction.length}/{this.state.totalSubAction.length}</p>
                            </div>
                        </Row>

                        <Row className="eventCardFooter">
                            <div style={{ width: '100%' }} className="flex-container-row">
                                {this.props.data.tagsId.map((value, key) => <Tag style={{ width: 'auto', background: value.background, color: value.color }} key={key}>{value.name}</Tag>)}
                                <Avatar.Group
                                    className="flex-row-item-right"
                                    maxCount={2}
                                    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                // className="flex-row-item-right"
                                >
                                    {this.renderAvailUser()}
                                </Avatar.Group>
                            </div>
                            <Col span={20}>

                            </Col>
                            <Col span={4}>
                            </Col>
                        </Row>
                    </Link>
                </Card>

            </div >
        );
    }
}

export default actionCard;