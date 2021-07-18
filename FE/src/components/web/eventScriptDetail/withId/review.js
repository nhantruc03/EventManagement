import { Timeline } from 'antd';
import React, { Component } from 'react';
import moment from 'moment'
import Title from 'antd/lib/typography/Title';
class review extends Component {
    renderTime = (e) => {
        return (
            <div className="flex-container-column" style={{ lineHeight: 1 }}>
                <div>
                    <strong> {moment(e.time).utcOffset(0).format("HH:mm")}</strong>
                </div>
                <div className="timeline-name">
                    {e.name}
                </div>
            </div>
        )
    }

    renderView = () => {
        return (
            this.props.data.sort((a, b) => {
                if (!a.noinfo && !b.noinfo) {
                    let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
                    let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
                    return temp_b.isBefore(temp_a) ? 1 : -1;
                }
                else {
                    return null
                }
            }).map((e, key) => {
                if (!e.noinfo) {
                    return (
                        <Timeline.Item key={key} label={this.renderTime(e)}>
                            <div dangerouslySetInnerHTML={{ __html: e.description }} />
                        </Timeline.Item>
                    )
                }
                else {
                    return null
                }
            }
            )
        )
    }

    render() {
        return (
            <div className="timeline-container">
                <Title level={3}>{this.props.script_name}</Title>
                <Timeline mode="left">
                    <Title></Title>
                    {this.renderView()}
                </Timeline>
            </div>
        );
    }
}

export default review;