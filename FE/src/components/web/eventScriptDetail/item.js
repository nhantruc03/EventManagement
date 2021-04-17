import { Button, Col, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { Component } from 'react';
import Edit from './edit'
import {
    ClockCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment'

class item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: '',
        }
    }

    renderState = () => {
        if (this.state.current === 'edit' || this.props.data.noinfo) {
            return (
                <Edit data={this.props.data} onClose={() => { this.setState({ current: null }) }} onDelete={this.props.onDelete} onUpdate={this.props.onUpdate} />
            )
        }
        else {
            return (
                <Row>
                    <Col span={24}>
                        <Row>
                            <Col sm={24} lg={9} style={{ padding: '0 10px' }}>
                                <Title level={5}>Mốc thời gian</Title>
                                <div className="input-disable">
                                    <div className="flex-container-row">
                                        {moment(this.props.data.time).format("HH:mm")}
                                        <ClockCircleOutlined className="flex-row-item-right" />
                                    </div>
                                </div>
                            </Col>
                            <Col sm={24} lg={9} style={{ padding: '0 10px' }}>
                                <Title level={5}>Tiêu đề</Title>
                                <div className="input-disable">
                                    {this.props.data.name}
                                </div>
                            </Col>
                            <Col sm={24} lg={6} style={{ padding: '50px 0 0 0' }}>
                                <Button style={{ width: '50%' }} className="back" onClick={() => this.props.onDelete(this.props.data._id)}>Xóa</Button>
                                <Button style={{ width: '50%' }} className="add" onClick={() => { this.setState({ current: 'edit' }) }}>Sửa</Button>
                            </Col>
                        </Row>
                        <div style={{ padding: '0 10px' }}>
                            <Title level={5}>Nội dung</Title>
                            <div style={{ padding: 10 }} dangerouslySetInnerHTML={{ __html: this.props.data.description }} />
                        </div>
                    </Col>
                </Row>
            )
        }
    }

    render() {
        return (
            <div className="script-item-container">
                {this.renderState()}
            </div>
        );
    }
}

export default item;