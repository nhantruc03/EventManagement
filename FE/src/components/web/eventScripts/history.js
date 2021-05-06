import React, { Component } from 'react';
import moment from 'moment'
class history extends Component {

    renderView = () => {
        return (
            this.props.data.map((e, key) => {
                if (e.isChangeNameScript || e.isChangeForIdScript) {
                    if (e.isChangeNameScript && e.isChangeForIdScript) {
                        return (
                            <div key={key}>
                                <div>Người chỉnh sửa: {e.userId.name}</div>
                                <div>Thời gian chỉnh sửa: {moment(e.createdAt).format("DD/MM/YYYY - HH:mm")}</div>
                                <div>Mô tả: Chỉnh sửa kịch bản </div>
                                <div>Tên kịch bản cũ: {e.oldNameScript}</div>
                                <div>Tên kịch bản mới: {e.scriptId.name}</div>
                                <div>Tên người được phân công cũ: {e.oldForIdScript.name}</div>
                                <div>Tên người được phân công mới: {e.scriptId.forId.name}</div>
                            </div>
                        )
                    }
                    else if (e.isChangeNameScript) {
                        return (
                            <div key={key}>
                                <div>Người chỉnh sửa: {e.userId.name}</div>
                                <div>Thời gian chỉnh sửa: {moment(e.createdAt).format("DD/MM/YYYY - HH:mm")}</div>
                                <div>Mô tả: Chỉnh sửa chi tiết kịch bản </div>
                                <div>Tên kịch bản cũ: {e.oldNameScript}</div>
                                <div>Tên kịch bản mới: {e.scriptId.name}</div>
                            </div>
                        )
                    }
                    else if (e.isChangeForIdScript) {
                        return (
                            <div key={key}>
                                <div>Người chỉnh sửa: {e.userId.name}</div>
                                <div>Thời gian chỉnh sửa: {moment(e.createdAt).format("DD/MM/YYYY - HH:mm")}</div>
                                <div>Mô tả: Chỉnh sửa chi tiết kịch bản </div>
                                <div>Tên người được phân công cũ: {e.oldForIdScript.name}</div>
                                <div>Tên người được phân công mới: {e.scriptId.forId.name}</div>
                            </div>
                        )
                    }
                    else {
                        return null
                    }
                } else {
                    return null
                }
            })
        )
    }

    render() {
        return (
            <div className="timeline-container">
                {this.renderView()}
            </div>
        );
    }
}

export default history;