import { Timeline } from 'antd';
import React, { Component } from 'react';
import moment from 'moment'
class review extends Component {


    renderTime = (e) => {
        return (
            <div className="flex-container-column" style={{ lineHeight: 1 }}>
                <div>
                    <strong>{moment(new Date(e.time)).format('HH:mm')}</strong>
                </div>
                <div style={{ fontSize: "17px" }}>
                    {e.name}
                </div>
            </div>
        )
    }

    renderView = () => {
        return (
            this.props.data.sort((a, b) => {
                if (!a.noinfo && !b.noinfo) {
                    let temp_a = new Date(a.time).setFullYear(1, 1, 1);
                    let temp_b = new Date(b.time).setFullYear(1, 1, 1);
                    return temp_a > temp_b ? 1 : -1
                }
                else{
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
            <div style={{ padding: 20 }}>
                <Timeline mode="left">
                    {this.renderView()}
                </Timeline>
            </div>
        );
    }
}

export default review;