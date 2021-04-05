import { Calendar, Divider } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../../env'
import moment from 'moment'
import { CarryOutOutlined } from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import SubActionItems from './SubActionItems';
import ActionItems from './ActionItem';
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
                ),
        ]));

        if (subActions !== null) {
            if (this._isMounted) {
                this.setState({
                    listSubActions: subActions
                })
                this.onSelect(moment(new Date()))
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getListData = (value) => {
        let listData = [];

        this.state.listSubActions.forEach(element => {
            if (moment(element.startDate).toDate().setHours(0, 0, 0, 0) === value.toDate().setHours(0, 0, 0, 0)) {
                listData.push(element)
            }
        });

        return listData
    }

    dateCellRender = (value) => {
        const listData = this.getListData(value);
        if (listData.length > 0) {
            return (
                <div style={{ backgroundColor: '#2A9D8F' }}>
                    <CarryOutOutlined />
                </div>
            );
        }
    }

    getMonthData = (value) => {
        let listData = [];
        this.props.listActions.forEach(element => {
            if (moment(element.startDate).month() === value.month() && moment(element.startDate).year() === value.year()) {
                listData.push(element)
            }
        })
        return listData
    }

    monthCellRender = (value) => {
        const listData = this.getMonthData(value);
        if (listData.length > 0) {
            return (
                <div style={{ backgroundColor: '#2A9D8F' }}>
                    <CarryOutOutlined />
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

    render() {
        if (this.state.listSubActions) {
            return (
                <div className="calender-section">
                    <Title level={3}>Lịch</Title>
                    <Calendar onPanelChange={this.onPanelChange} onSelect={this.onSelect} fullscreen={false} dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} />

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