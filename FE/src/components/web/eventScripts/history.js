import React, { Component } from "react";
import moment from "moment";
import {
    Avatar,
    Col,
    Collapse,
    Row,
    Space,
    Tag,
    Timeline,
    Tooltip,
} from "antd";
import Title from "antd/lib/typography/Title";
const { Panel } = Collapse;
class history extends Component {
    renderDot = (e) => {
        return (
            <Tooltip title={e.name}>
                <Avatar src={`/api/images/${e.photoUrl}`} />
            </Tooltip>
        );
    };

    renderChangeScriptName = (e, style) => {
        return (
            <Row style={style}>
                <Col span={9}>
                    <div>Tên kịch bản:</div>
                </Col>
                <Col span={15}>
                    <div style={{ marginLeft: 5 }}>
                        <Tag className="old-tag">{e.oldNameScript}</Tag>
                        <Tag className="new-tag">{e.newNameScript}</Tag>
                    </div>
                </Col>
            </Row>
        );
    };

    renderChangeScriptForId = (e, style) => {
        return (
            <Row style={style}>
                <Col span={9}>
                    <div>Người được phân công:</div>
                </Col>
                <Col span={15}>
                    <div style={{ marginLeft: 5 }}>
                        <Tag className="old-tag">{e.oldForIdScript.name}</Tag>
                        <Tag className="new-tag">{e.newForIdScript.name}</Tag>
                    </div>
                </Col>
            </Row>
        );
    };

    renderChangeScriptDetailName = (e, style) => {
        return (
            <Row style={style}>
                <Col span={9}>
                    <div>Tiêu đề:</div>
                </Col>
                <Col span={15}>
                    <div style={{ marginLeft: 5 }}>
                        <Tag className="old-tag">{e.oldNameScriptDetail}</Tag>
                        <Tag className="new-tag">{e.newNameScriptDetail}</Tag>
                    </div>
                </Col>
            </Row>
        );
    };

    renderChangeScriptDetailTime = (e, style) => {
        return (
            <Row style={style}>
                <Col span={9}>
                    <div>Mốc thời gian:</div>
                </Col>
                <Col span={15}>
                    <div style={{ marginLeft: 5 }}>
                        <Tag className="old-tag">
                            {moment(e.oldTimeScriptDetail).utcOffset(0).format("HH:mm")}
                        </Tag>
                        <Tag className="new-tag">
                            {moment(e.newTimeScriptDetail).utcOffset(0).format("HH:mm")}
                        </Tag>
                    </div>
                </Col>
            </Row>
        );
    };

    renderChangeScriptDetailDescription = (e, style) => {
        return (
            <div style={style}>
                <p style={{ fontWeight: "bold" }}>Nội dung cũ:</p>
                <div
                    style={{ color: "#AAB0B6" }}
                    dangerouslySetInnerHTML={{ __html: e.oldDescriptionScriptDetail }}
                />
            </div>
        );
    };

    renderView = (e) => {
        let description = "";
        if (e.isChangeNameScript || e.isChangeForIdScript) {
            description = "Chỉnh sửa kịch bản";
            return (
                <div>
                    <Title level={4}>{description}</Title>
                    <p className="time">
                        Thay đổi lúc: {moment(e.createdAt).format("HH:mm")}
                    </p>
                    <p style={{ fontWeight: "bold" }}>{e.updateScriptDetailName}</p>
                    {e.isChangeNameScript ? this.renderChangeScriptName(e) : null}
                    {e.isChangeForIdScript ? this.renderChangeScriptForId(e) : null}
                </div>
            );
        } else if (
            e.isChangeNameScriptDetail ||
            e.isChangeTimeScriptDetail ||
            e.isChangeDescriptionScriptDetail
        ) {
            description = "Chỉnh sửa chi tiết kịch bản";
            return (
                <div>
                    <Title level={4}>{description}</Title>
                    <p className="time">
                        Thay đổi lúc: {moment(e.createdAt).format("HH:mm")}
                    </p>
                    <p style={{ fontWeight: "bold" }}>{e.updateScriptDetailName}</p>
                    {e.isChangeNameScriptDetail
                        ? this.renderChangeScriptDetailName(e)
                        : null}
                    {e.isChangeTimeScriptDetail
                        ? this.renderChangeScriptDetailTime(e)
                        : null}
                    {e.isChangeDescriptionScriptDetail
                        ? this.renderChangeScriptDetailDescription(e)
                        : null}
                </div>
            );
        } else if (e.isCreateDetail) {
            description = "Tạo mới";
            return (
                <div>
                    <Title level={4}>{description}</Title>
                    <p className="time">Tạo lúc: {moment(e.createdAt).format("HH:mm")}</p>
                    <Row>
                        <Col span={9}>
                            <div>Chi tiết kịch bản:</div>
                        </Col>
                        <Col span={15}>
                            <div style={{ marginLeft: 5 }}>
                                <Tag className="new-tag">{e.nameCreateDetail}</Tag>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        } else if (e.isDeleteDetail) {
            description = "Xóa";
            return (
                <div>
                    <Title level={4}>{description}</Title>
                    <p className="time">Xóa lúc: {moment(e.createdAt).format("HH:mm")}</p>
                    <Row>
                        <Col span={9}>
                            <div>Chi tiết kịch bản:</div>
                        </Col>
                        <Col span={15}>
                            <div style={{ marginLeft: 5 }}>
                                <Tag className="old-tag">{e.nameDeleteDetail}</Tag>
                            </div>
                        </Col>
                    </Row>
                </div>
            );
        }
    };

    renderTimeLine = (data) => {
        return data.map((e, key) => {
            if (
                e.isChangeNameScript ||
                e.isChangeForIdScript ||
                e.isChangeNameScriptDetail ||
                e.isChangeTimeScriptDetail ||
                e.isChangeDescriptionScriptDetail ||
                e.isCreateDetail ||
                e.isDeleteDetail
            ) {
                return (
                    <Timeline.Item dot={this.renderDot(e.userId)} key={key}>
                        {this.renderView(e)}
                    </Timeline.Item>
                );
            } else {
                return null;
            }
        });
    };

    renderCollapse = () => {
        let data = this.props.data;
        let list_data = data.reduce((list, item) => {
            let temp_list = list.filter(
                (e) =>
                    e.title === moment(item.createdAt).utcOffset(0).format("DD/MM/YYYY")
            ); //điều kiện gom nhóm
            let temp_O =
                temp_list.length > 0
                    ? temp_list[0]
                    : {
                        title: moment(item.createdAt).utcOffset(0).format("DD/MM/YYYY"),
                        data: [],
                    }; // check cần tạo mới hay đã có trong result

            if (list.indexOf(temp_O) !== -1) {
                list[list.indexOf(temp_O)].data.push(item);
            } else {
                temp_O.data.push(item);
                list.push(temp_O);
            }
            return list;
        }, []);
        return list_data.map((e, key) => {
            return (
                <Panel className="history-panel" header={e.title} key={key}>
                    <Timeline mode="left">{this.renderTimeLine(e.data)}</Timeline>
                </Panel>
            );
        });
    };

    render() {
        return (
            <div className="timeline-container">
                <Space style={{ width: "100%" }} direction="vertical">
                    <Collapse
                        style={{ borderRadius: "8px" }}
                        expandIconPosition={"right"}
                        defaultActiveKey={["0"]}
                    >
                        {this.renderCollapse()}
                    </Collapse>
                </Space>
            </div>
        );
    }
}

export default history;
