import React, { Component } from 'react';
import moment from 'moment'
import { Tooltip } from 'antd';
import { Link } from 'react-router-dom';

class ActionItem extends Component {
    render() {
        return (
            <div className="calendar-sub-action flex-container-row">
                <div className="vl-action"></div>
                <Link to={`/actions/${this.props.data._id}`}>
                    <div style={{ marginLeft: '20px', maxWidth: '100%' }}>
                        <Tooltip title={
                            <div>
                                <p>{this.props.data.name}</p>
                                <br></br>
                                <p>Mô tả: {this.props.data.description}</p>
                            </div>
                        } placement="top">
                            <p className="title cut-text">{this.props.data.name}</p>
                        </Tooltip>
                        <div>
                            {/* <p>Bắt đầu: {moment(this.props.data.startDate).format('DD/MM')}</p> */}
                            <p>Kết thúc: {moment(this.props.data.endDate).utcOffset(0).format('DD/MM')} - {moment(this.props.data.endTime).utcOffset(0).format('HH:mm')}</p>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default ActionItem;