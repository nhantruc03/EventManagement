import { Avatar, Card, Col, Image, Row, Tag, Tooltip } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
const { Meta } = Card;
class eventCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showImage: false
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
    mouseHover = (value) => {
        this.setState({
            showImage: value
        })
    }
    render() {
        return (
            <div className="event-card-container">

                <Card
                    hoverable
                    className="eventCard"
                    cover={this.state.showImage ? <Image className="cover" alt="example" src={`api/images/${this.props.data.posterUrl}`} /> : null}
                    onMouseEnter={() => this.mouseHover(true)}
                    onMouseLeave={() => this.mouseHover(false)}
                >
                    <Link to={`/events/${this.props.data._id}`}>
                        <Tooltip title={`Mô tả: ${this.props.data.description}`} placement="bottom">
                            <Meta title={this.props.data.name} />
                        </Tooltip>

                        <Row >
                            <img style={{ marginRight: '20px' }} alt="clock icon" src="/clock.png" />  {moment(this.props.data.startTime).utcOffset(0).format('HH:mm')} - {moment(this.props.data.startDate).utcOffset(0).format('DD/MM/YYYY')}
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
