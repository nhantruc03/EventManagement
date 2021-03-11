import { Avatar, Card, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import {
    ClockCircleOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { Meta } = Card;

class actionCard extends Component {
    renderAvailUser = () => {
        return (
            this.props.data.availUser.map((value, key) => {
                console.log(value.photoUrl)
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
                <Link to={`/#`}>
                    <Card
                        hoverable
                        className="eventCard"
                        cover={<img alt="example" src={`api/images/${this.props.data.coverUrl}`} />}

                    >
                        <Meta title={this.props.data.name} description={this.props.data.description} />

                        <Row >
                            <ClockCircleOutlined />  {moment(this.props.data.startTime).format('DD/MM/YYYY')} - {moment(this.props.data.startDate).format('DD/MM/YYYY')}
                        </Row>

                        <div className="flex-container-row" style={{marginTop:'10px'}}>
                            <div>Độ ưu tiên</div>
                            <div className="flex-row-item-right">{this.props.data.priorityId.name}</div>
                        </div>


                        <Row className="eventCardFooter">
                            {this.props.data.tagsId.map((value, key) => <Tag style={{ width: 'auto' }} key={key}>{value.name}</Tag>)}
                            <Avatar.Group
                                maxCount={2}
                                maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                            // className="flex-row-item-right"
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

export default actionCard;