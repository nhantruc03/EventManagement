import { Avatar, Card, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import {
    EnvironmentOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
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
                <Link to={`/events/${this.props.data._id}`}>
                    <Card
                        hoverable
                        className="eventCard"
                        cover={<img alt="example" src={`api/images/${this.props.data.posterUrl}`} />}

                    >
                        <Meta title={this.props.data.name} description={this.props.data.description} />

                        <Row >
                            <ClockCircleOutlined />  {moment(this.props.data.startTime).format('HH:mm')} - {moment(this.props.data.startDate).format('DD/MM/YYYY')}
                        </Row>
                        <Row >
                            <EnvironmentOutlined />  {this.props.data.address}
                        </Row>
                        <Row className="eventCardFooter">
                            {this.props.data.tagId.map((value, key) => <Tag style={{ width: 'auto' }} key={key}>{value.name}</Tag>)}
                            <Avatar.Group
                                maxCount={2}
                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                            >
                                {this.renderAvailUser()}
                            </Avatar.Group>
                        </Row>
                    </Card>
                </Link>
            </div>
        );
    }
}

export default eventCard;