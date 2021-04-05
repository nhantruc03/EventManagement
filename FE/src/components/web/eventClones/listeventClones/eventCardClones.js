import { Avatar, Card, Col, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
const { Meta } = Card;
class eventCard extends Component {
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
    render() {
        return (
            <div className="event-card-container">
                <Link to={`/eventclones/${this.props.data._id}`}>
                    <Card
                        hoverable
                        className="eventCard"
                        cover={<img className="cover" alt="example" src={`api/images/${this.props.data.posterUrl}`} />}

                    >
                        <Tooltip title={this.props.data.description} placement="top">
                            <Meta title={this.props.data.name} />
                        </Tooltip>

                        <Row >
                            <img style={{ marginRight: '20px' }} alt="clock icon" src="/clock.png" />  {moment(this.props.data.startTime).format('HH:mm')} - {moment(this.props.data.startDate).format('DD/MM/YYYY')}
                        </Row>
                        <Row >
                            <img style={{ marginRight: '20px' }} alt="location icon" src="/location.png" />  {this.props.data.address}
                        </Row>
                        <Row className="eventCardFooter">
                            <Col span={20}>
                                {this.props.data.tagId.map((value, key) => <Tag id={value.name} style={{ width: 'auto' }} key={key}>{value.name}</Tag>)}
                            </Col>
                            <Col span={4}>
                                <Avatar.Group
                                    maxCount={2}
                                    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                >
                                    {this.renderAvailUser()}
                                </Avatar.Group>
                            </Col>
                        </Row>
                    </Card>
                </Link>
            </div>
        );
    }
}

export default eventCard;