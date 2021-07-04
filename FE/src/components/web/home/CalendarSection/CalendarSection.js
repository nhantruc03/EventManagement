import { Calendar, Col, Divider, Radio, Row, Select } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
import moment from 'moment'
import { MinusOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import SubActionItems from './SubActionItems';
import ActionItems from './ActionItem';
import ApiFailHandler from '../../helper/ApiFailHandler'
class CalendarSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listSubActions: null,
            currentSubActions: [],
            currentActions: [],
            mode: 'month'
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        const [subActions] = await trackPromise(Promise.all([
            axios.post('/api/sub-actions/getAllWithUserId', { availUser: obj.id }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]));
        if (subActions !== null) {
            if (this._isMounted) {

                this.setState({
                    listSubActions: subActions
                })
                this.onSelect(moment(new Date()).utcOffset(0))
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getListData = (value) => {
        let listData = [];
        this.state.listSubActions.forEach(element => {
            if (!element.status) {
                if (moment(element.endDate).utcOffset(0).format('YYYY-MM-DD') === value.utcOffset(0).format('YYYY-MM-DD')) {
                    listData.push(element)
                }
            }
        });
        return listData
    }

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        if (listData.length > 0) {
            return (
                <div className="data-date">
                    <MinusOutlined />
                </div>
            );
        }
    }

    getMonthData = (value) => {
        let listData = [];
        this.props.listActions.forEach(element => {
            if (moment(element.startDate).utcOffset(0).month() === value.month() && moment(element.startDate).utcOffset(0).year() === value.year()) {
                listData.push(element)
            }
        })
        return listData
    }

    monthCellRender = (value) => {
        const listData = this.getMonthData(value);
        if (listData.length > 0) {
            return (
                <div className="data-date">
                    <MinusOutlined />
                </div>
            )
        }
    }

    onSelect = value => {
        if (this.state.mode === 'month') {
            let data = this.getListData(value)
            this.setState({
                currentSubActions: data
            })
        } else {
            let data = this.getMonthData(value)
            this.setState({
                currentActions: data
            })
        }
    };

    renderCurrentSubAction = () => {
        if (this.state.mode === 'month') {
            return (
                this.state.currentSubActions.map((e, key) => {
                    if (!e.status) {
                        return (
                            <div key={key}>
                                {key !== 0 ? <Divider /> : null}
                                <SubActionItems data={e} stt={key} key={key} />
                            </div>
                        )
                    } else {
                        return (null)
                    }

                })
            )
        } else {
            return (
                this.state.currentActions.map((e, key) => {
                    if (!e.status) {
                        return (
                            <div key={key}>
                                {key !== 0 ? <Divider /> : null}
                                <ActionItems data={e} stt={key} key={key} />
                            </div>
                        )
                    } else {
                        return (null)
                    }

                })
            )
        }
    }
    onPanelChange = (value, mode) => {
        this.setState({
            mode: mode
        })
    }
    customHeader = ({ value, type, onChange, onTypeChange }) => {
        const start = 0;
        const end = 12;
        const monthOptions = [];
        const current = value.clone();
        const months = [];
        for (let i = 0; i < 12; i++) {
            current.month(i);
            months.push(`Tháng ${i + 1}`);
        }
        for (let index = start; index < end; index++) {
            monthOptions.push(
                <Select.Option className="month-item" key={`${index}`}>
                    {months[index]}
                </Select.Option>,
            );
        }
        const month = value.month();
        const year = value.year();
        const options = [];
        for (let i = year - 10; i < year + 10; i += 1) {
            options.push(
                <Select.Option key={i} value={i} className="year-item">
                    {i}
                </Select.Option>,
            );
        }
        return (
            <div style={{ display: 'flex', flexDirection: 'row', padding: 8 }}>
                <Row style={{ marginLeft: 'auto' }} gutter={8}>
                    <Col>
                        <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            className="my-year-select"
                            onChange={newYear => {
                                const now = value.clone().year(newYear);
                                onChange(now);
                            }}
                            value={String(year)}
                        >
                            {options}
                        </Select>
                    </Col>
                    <Col>
                        <Select
                            size="small"
                            dropdownMatchSelectWidth={false}
                            value={String(month)}
                            onChange={selectedMonth => {
                                const newValue = value.clone();
                                newValue.month(parseInt(selectedMonth, 10));
                                onChange(newValue);
                            }}
                        >
                            {monthOptions}
                        </Select>
                    </Col>
                    <Col>
                        <Radio.Group size="small" onChange={e => onTypeChange(e.target.value)} value={type}>
                            <Radio.Button value="month" className="calendar-label">Tháng</Radio.Button>
                            <Radio.Button value="year" className="calendar-label">Năm</Radio.Button>
                        </Radio.Group>
                    </Col>
                </Row>
            </div>
        );
    }

    render() {
        if (this.state.listSubActions) {
            return (
                <div className="calender-section">
                    <Title level={3}>Lịch</Title>
                    <Calendar headerRender={this.customHeader} onPanelChange={this.onPanelChange} onSelect={this.onSelect} fullscreen={false} dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} />

                    <Title level={3}>Lời nhắc</Title>
                    <div className="calender-subaction-section">
                        {this.renderCurrentSubAction()}
                    </div>
                </div>
            );
        } else {
            return null
        }
    }
}

export default CalendarSection;