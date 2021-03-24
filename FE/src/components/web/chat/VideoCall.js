import axios from 'axios';
import React, { Component } from 'react';
import { w3cwebsocket } from 'websocket';
import ChatMessage from './ChatMessage';
import {
    SendOutlined
} from '@ant-design/icons';
import { trackPromise } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
import getUserMedia from 'getusermedia';
import { Col, Row } from 'antd';
const client = new w3cwebsocket('ws://localhost:3001');

const Peer = require('simple-peer');
class VideoCall extends Component {
    constructor(props) {
        super(props)
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            client.onopen = () => {
                console.log('Connect to ws')
                if (client.readyState === WebSocket.OPEN) {
                    console.log('sent')
                    client.send(JSON.stringify({
                        type: "videocall",
                        roomId: this.props.match.params.id,
                        userId: obj.id
                    }))
                }
            }

            client.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.type === "sendMessage") {
                    if (dataFromServer.roomId === this.props.roomId) {
                        // console.log(dataFromServer.message)
                        this.setState({
                            messages: [...this.state.messages, dataFromServer.message]
                        })
                        // this.refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
                        if (this.chatbox.current !== null) {
                            this.chatbox.current.scrollTo({ top: this.chatbox.current.scrollHeight, behavior: 'smooth' })
                        }
                    }
                }

            };

            const login = localStorage.getItem('login');
            const obj = JSON.parse(login);

            // if (client.readyState === WebSocket.OPEN) {
            //     console.log('sent')
            //     client.send(JSON.stringify({
            //         type: "videocall",
            //         roomId: this.props.match.params.id,
            //         userId: obj.id
            //     }))
            // }

            const video = this.refVideo.current;
            navigator.mediaDevices
                .getUserMedia({ video: false, audio: true })
                .then((stream) => {
                    this.refVideo.current.srcObject = stream;
                });
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    refVideo = React.createRef();
    render() {
        return (
            <>
                <Row style={{ height: '100%' }}>
                    <Col span={18} className='room__video-container'>
                        <Row>
                            <Col style={{ marginBottom: '20px' }} span={8}>
                                <video className='room__video-container--user-video' muted ref={this.refVideo} autoPlay playsInline />
                                {/* <div className='room__video-container--user-name'>{userDetail.name}</div> */}
                            </Col>
                        </Row>
                    </Col>
                    <Col span={6} className='room__left-bar'>
                        Chat Area
                </Col>
                </Row>

            </>
        );
    }
}

export default VideoCall;