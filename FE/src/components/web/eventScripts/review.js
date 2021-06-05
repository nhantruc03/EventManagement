import { Steps } from 'antd';
import React, { Component } from 'react';
import moment from 'moment'
import Title from 'antd/lib/typography/Title';
import {
    LoadingOutlined,
} from '@ant-design/icons';
const { Step } = Steps
class review extends Component {
    constructor(props) {
        super(props)
        this.state = {
            intervalId: null,
            currentScript: -1,
            currentTime: new Date(),
            data: []
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            let temp = this.props.data.sort((a, b) => {
                if (!a.noinfo && !b.noinfo) {
                    let temp_a = moment(`0001-01-01 ${moment(a.time).utcOffset(0).format("HH:mm")}`)
                    let temp_b = moment(`0001-01-01 ${moment(b.time).utcOffset(0).format("HH:mm")}`)
                    return temp_b.isBefore(temp_a) ? 1 : -1;
                }
                else {
                    return null
                }
            })
            this.setState({
                data: temp
            })
            if (this.props.onGoing) {
                let intervalId = setInterval(this.timer, 5000);
                this.setState({
                    intervalId: intervalId,
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        clearInterval(this.state.intervalId);
    }


    timer = () => {
        let temp = new Date()
        let current = null
        this.state.data.forEach((e, i) => {
            if (temp.getTime() > new Date(e.time)) {
                current = i
            }
        })
        if (current !== null) {
            this.setState({ currentScript: current });
        }
    }

    renderView2 = () => {
        return (
            this.state.data.map((e, key) => {
                if (this.props.onGoing) {
                    return (
                        <Step key={key} title={e.name} subTitle={moment(new Date(e.time)).utcOffset(0).format('HH:mm')} icon={this.state.currentScript === key ? <LoadingOutlined /> : null}
                            description={<div dangerouslySetInnerHTML={{ __html: e.description }} />}
                        />
                    )
                } else {
                    return (
                        <Step key={key} title={e.name} subTitle={moment(new Date(e.time)).utcOffset(0).format('HH:mm')}
                            description={<div dangerouslySetInnerHTML={{ __html: e.description }} />}
                        />
                    )
                }
            }))
    }

    render() {
        return (
            <div className="script-view">
                <Title level={3}>{this.props.onGoing ? "Đang diễn ra" : "Chưa diễn ra"}</Title>
                <Steps className="scrips-view" current={this.state.currentScript} direction="vertical">
                    {this.renderView2()}
                </Steps>
            </div>
        );
    }
}

export default review;