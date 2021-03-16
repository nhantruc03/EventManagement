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
                    <Col span={18}>
                        <Row>
                            <Col sm={24} md={12}>
                                <Title level={5}>Mốc thời gian</Title>
                                <div className="flex-container-row" style={{ width: '50%' }}>
                                    {moment(this.props.data.time).format("HH:mm")}
                                    <ClockCircleOutlined className="flex-row-item-right" />
                                </div>
                            </Col>
                            <Col sm={24} md={12}>
                                <Title level={5}>Tiêu đề</Title>
                                {this.props.data.name}
                            </Col>
                        </Row>
                        <Title level={5}>Nội dung</Title>
                        <div style={{ padding: 10 }} dangerouslySetInnerHTML={{ __html: this.props.data.description }} />
                    </Col>
                    <Col span={6} style={{ margin: 'auto' }}>
                        <Button onClick={() => this.props.onDelete(this.props.data._id)}>Xóa</Button>
                        <Button onClick={() => { this.setState({ current: 'edit' }) }}>Chỉnh sửa</Button>
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