import { Calendar, Divider } from 'antd';
import axios from 'axios';
import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import { AUTH } from '../../env'
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

        console.log(subActions)

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
            // if (newelement.startDate)
            // console.log('date subaction', element.startDate)
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
                // <div style={{backgroundColor:'green'}}></div>
                <div style={{ backgroundColor: 'green' }}>
                    <CarryOutOutlined />
                </div>
            );
        }
    }

    getMonthData = (value) => {
        console.log(this.props.listActions)
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
                <div style={{ backgroundColor: 'green' }}>
                    <CarryOutOutlined />
                </div>
            )
        }

    }

    onSelect = value => {
        let data = []
        if (this.state.mode === 'month') {
            data = this.getListData(value)
        } else {
            data = this.getMonthData(value)
        }

        this.setState({
            currentSubActions: data
        })
    };

    renderCurrentSubAction = () => {
        return (
            this.state.currentSubActions.map((e, key) => {
                if (!e.status) {
                    return (
                        <div key={key}>
                            {key !== 0 ? <Divider /> : null}
                            {this.state.mode === 'month' ? <SubActionItems data={e} stt={key} key={key} /> : <ActionItems data={e} stt={key} key={key} />}
                        </div>
                    )
                } else {
                    return (null)
                }

            })
        )
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