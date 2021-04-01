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
            currentScript: 0,
            nextScript: 1,
            currentTime: new Date(),
            data: []
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            let temp = this.props.data.sort((a, b) => {
                if (!a.noinfo && !b.noinfo) {
                    let temp_a = new Date(a.time).setFullYear(1, 1, 1);
                    let temp_b = new Date(b.time).setFullYear(1, 1, 1);
                    return temp_a > temp_b ? 1 : -1
                }
                else {
                    return null
                }
            })

            this.setState({
                data: temp
            })
            if (this.props.onGoing) {
                let intervalId = setInterval(this.timer, 1000);
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

    // renderIcon = (key) => {
    //     let result

    //     if (key < this.state.currentScript) {
    //         result = <CheckCircleOutlined />
    //     }
    //     else if (key > this.state.currentScript) {
    //         result = null
    //     }
    //     else if (key === this.state.currentScript) {
    //         result = <LoadingOutlined />
    //     }
    //     else if (key === this.state.nextScript) {
    //         result = <HourglassOutlined />
    //     }

    //     return result
    // }

    // renderTime = (e, key) => {
    //     return (
    //         <div className="flex-container-row">
    //             {/* {this.renderIcon(key)} */}

    //             <div className="flex-container-column" style={{ lineHeight: 1, marginLeft: '10px' }}>
    //                 <div>
    //                     <strong>{moment(new Date(e.time)).format('HH:mm')}</strong>
    //                 </div>
    //                 <div className="timeline-name">
    //                     {e.name}
    //                 </div>
    //             </div>
    //         </div>

    //     )
    // }

    // renderView = () => {
    //     return (
    //         this.state.data.map((e, key) => {
    //             return (
    //                 <Timeline.Item key={key} label={this.renderTime(e, key)}>
    //                     {this.state.currentScript === key ? <div>{key}</div> : null}
    //                     <div dangerouslySetInnerHTML={{ __html: e.description }} />
    //                 </Timeline.Item>
    //             )
    //         }))
    // }

    renderView2 = () => {
        return (
            this.state.data.map((e, key) => {
                return (
                    <Step key={key} title={e.name} subTitle={moment(new Date(e.time)).format('HH:mm')} icon={this.state.currentScript === key ? < LoadingOutlined /> : null}
                        description={<div dangerouslySetInnerHTML={{ __html: e.description }} />}
                    />
                )
            }))
    }

    render() {
        return (
            <div >
                <Title level={3}>{this.props.onGoing ? "Đang diễn ra" : "Chưa diễn ra"}</Title>
                {/* <Timeline mode="left">
                    <Title></Title>
                    {this.renderView()}
                </Timeline> */}

                <Steps className="scrips-view" current={this.state.currentScript} direction="vertical">
                    {this.renderView2()}
                </Steps>
            </div>
        );
    }
}

export default review;