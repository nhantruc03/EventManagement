import { Card, Row, Tag } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
class EventMiniCard extends Component {
    render() {
        return (
            <div className="event-mini-card-container">
                <Link to={`/events/${this.props.data._id}`}>
                    <Card
                        hoverable
                    >
                        <div className="flex-container-row">
                            <img style={{ maxWidth: '129px' }} src={`/api/images/${this.props.data.posterUrl}`} alt="event posterUrl"></img>
                            <div style={{ display: 'grid', marginLeft: '10px', width: '100%' }}>
                                <Title className="cut-text" level={3}>{this.props.data.name}</Title>

                                <Tag className="status-tag">{this.props.onGoing ? "Đang diễn ra" : "Sắp diễn ra"}</Tag>

                                <Row >
                                    <div className="flex-container-row">
                                        <img style={{ marginRight: '20px' }} alt="clock icon" src="/clock.png"></img>
                                        {this.props.onGoing ? "Hôm nay" : moment(this.props.data.startDate).format('DD/MM/YYYY')} - {moment(this.props.data.startTime).format('HH:mm')}
                                    </div>
                                </Row>
                                <Row >
                                    <div className="flex-container-row">
                                        <img style={{ marginRight: '20px' }} alt="location icon" src="/location.png" ></img>
                                        {this.props.data.address}
                                    </div>
                                </Row>

                                <p id="home-link-in-card" className="flex-row-item-right">Xem chi tiết</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>
        );
    }
}

export default EventMiniCard;