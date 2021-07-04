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
                        <Avatar src={`${window.resource_url}${value.photoUrl}`} />
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
                    cover={<Image className="cover" alt="example" src={`${window.resource_url}${this.props.data.posterUrl}`} />}

                >
                    <Link to={`/eventclones/${this.props.data._id}`}>
                        <Tooltip title={this.props.data.description} placement="top">
                            <Meta title={this.props.data.name} />
                        </Tooltip>

                        <Row >
                            <img style={{ marginRight: '20px' }} alt="clock icon" src="/clock.png" />  {moment(this.props.data.startTime).utcOffset(0).format('HH:mm')} - {moment(this.props.data.startDate).utcOffset(0).format('DD/MM/YYYY')}
                        </Row>
                        <Row >
                            <img style={{ marginRight: '20px' }} alt="location icon" src="/location.png" />  {this.props.data.address}
                        </Row>
                        <Row className="eventCardFooter">
                            <Col span={20}>
                                {this.props.data.tagId.map((value, key) => <Tag id={value.name} style={{ width: 'auto', background: value.background, color: value.color }} key={key}>{value.name}</Tag>)}
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
                    </Link>
                </Card>
            </div >
        );
    }
}

export default eventCard;