import React, { Component } from 'react';
import moment from 'moment'
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';

class SubActionItems extends Component {
    renderTime = () => {
        // if (new Datethis.props.data.startDate)
        if (moment(this.props.data.endDate).toDate().setHours(0, 0, 0, 0) === moment(new Date()).toDate().setHours(0, 0, 0, 0)) {
            return (
                <p>Hạn chót: Hôm nay - {moment(this.props.data.endTime).format('HH:mm')}</p>
            )
        } else {
            return (
                <div>
                    <p>Hạn chót: {moment(this.props.data.endDate).format('DD/MM')}-{moment(this.props.data.endTime).format('HH:mm')}</p>
                </div>
            )
        }
    }
    render() {
        return (
            <div className="calendar-sub-action flex-container-row">

                <div className="vl-sub-action"></div>
                <Link to={`/actions/${this.props.data.actionId}`}>
                    <div style={{ marginLeft: '20px', maxWidth: '100%' }}>
                        <Tooltip title={
                            <div>
                                <p>{this.props.data.name}</p>
                                <p>Mô tả: {this.props.data.description}</p>
                            </div>
                        } placement="top">
                            <p className="title cut-text">{this.props.data.name}</p>
                        </Tooltip>
                        {this.renderTime()}
                    </div>
                </Link>
            </div>
        );
    }
}

export default SubActionItems;