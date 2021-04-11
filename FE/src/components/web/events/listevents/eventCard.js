import { Avatar, Card, Col, Image, Row, Tag, Tooltip } from 'antd';
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

                <Card
                    hoverable
                    className="eventCard"
                    cover={<Image className="cover" alt="example" src={`api/images/${this.props.data.posterUrl}`} />}
                >
                    <Link to={`/events/${this.props.data._id}`}>
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
                            <Col span={24}>
                                <div className="flex-container-row">
                                    <div>
                                        {this.props.data.tagId.map((value, key) => <Tag style={{ width: 'auto', background: value.background, color: value.color }} key={key}>{value.name}</Tag>)}
                                    </div>
                                    <Avatar.Group
                                        className="flex-row-item-right"
                                        maxCount={2}
                                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                                    >
                                        {this.renderAvailUser()}
                                    </Avatar.Group>
                                </div>
                            </Col>
                        </Row>
                    </Link>
                </Card>
            </div>
        );
    }
}

export default eventCard;