import { Button, Carousel } from 'antd';
import React, { Component } from 'react';
import Peer from "simple-peer";
import { w3cwebsocket } from 'websocket';
import Video from './Video';
import {
    VideoCameraOutlined,
    SoundOutlined,
    MessageOutlined,
} from '@ant-design/icons';
const client = new w3cwebsocket('ws://localhost:3001');


const videoConstraints = {
    height: window.innerHeight / 2,
    width: window.innerWidth / 2
};


class VideoCall extends Component {
    constructor(props) {
        super(props)
        this.state = {
            peers: [],
            peersRef: [],
            video: true,
            audio: true,
            stream: null
        }
    }
    componentDidMount() {
        this._ismounted = true
        if (this._ismounted) {
            client.onopen = () => {
                console.log('connected ws')
            }

            navigator.mediaDevices.getUserMedia({ video: this.state.video ? videoConstraints : false, audio: this.state.audio }).then(stream => {

                this.setState({
                    stream: stream
                })
                this.userVideo.current.srcObject = this.state.stream;
                client.send(JSON.stringify({
                    type: "join room",
                    message: this.props.roomId
                }))

                client.onmessage = (message) => {
                    const dataFromServer = JSON.parse(message.data);

                    switch (dataFromServer.type) {
                        case 'all users':
                            const peers = [];
                            dataFromServer.message.forEach(userID => {
                                const peer = this.createPeer(userID, dataFromServer.currentId, this.state.stream);
                                let temp_peersRef = {
                                    peerID: userID,
                                    peer,
                                }
                                this.setState({
                                    peersRef: [...this.state.peersRef, temp_peersRef]
                                })
                                peers.push(peer);
                            })
                            this.setState({
                                peers: peers
                            })
                            break;
                        case 'user joined':
                            const peer = this.addPeer(dataFromServer.message.signal, dataFromServer.message.callerID, this.state.stream);
                            let temp_peersRef2 = {
                                peerID: dataFromServer.message.callerID,
                                peer,
                            }
                            this.setState({
                                peers: [...this.state.peers, peer],
                                peersRef: [...this.state.peersRef, temp_peersRef2]
                            })
                            break;
                        case 'receiving returned signal':
                            const item = this.state.peersRef.find(p => p.peerID === dataFromServer.message.id);
                            item.peer.peer.signal(dataFromServer.message.signal);
                            break;
                        case 'room full':
                            alert("room is full");
                            break;
                        case 'user disconnected':
                            let temp = this.state.peers
                            let need_delete = temp.filter(p => p.Id === dataFromServer.message)
                            if (need_delete.length > 0) {
                                need_delete[0].peer.destroy()
                                let temp1 = this.state.peers.filter(p => p.Id !== dataFromServer.message)
                                let temp2 = this.state.peersRef.filter(p => p.peerID !== dataFromServer.message)
                                this.setState({
                                    peers: temp1,
                                    peersRef: temp2
                                })
                            }
                            break;
                        default:
                            break;
                    }
                }
            })
        }
    }
    componentWillUnmount() {
        this._ismounted = false
    }


    createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream,
        });


        peer.on("signal", signal => {
            client.send(JSON.stringify({
                type: "sending signal",
                message: { userToSignal, callerID, signal }
            }))
        })

        const result = {
            peer: peer,
            Id: userToSignal
        }
        return result;
    }

    addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream,
        })
        peer.on("signal", signal => {
            client.send(JSON.stringify({
                type: "returning signal",
                message: { signal, callerID }
            }))
        })

        peer.signal(incomingSignal);
        const result = {
            peer: peer,
            Id: callerID
        }
        return result;
    }

    stopVideo = () => {
        let temp_video = !this.state.video
        let temp = this.state.stream
        try {
            if (temp.getVideoTracks()[0]) {
                temp.getVideoTracks()[0].enabled = !(temp.getVideoTracks()[0].enabled);
            } else {

                navigator.mediaDevices.getUserMedia({ video: temp_video ? videoConstraints : false, audio: this.state.audio }).then(stream => {
                    temp = stream
                })
            }
            this.setState({
                stream: temp,
                video: !this.state.video
            })
        }
        catch (err) {
            console.log(err)
        }
    }

    stopAudio = () => {
        let temp = this.state.stream;
        temp.getAudioTracks()[0].enabled = !(temp.getAudioTracks()[0].enabled);
        this.setState({
            stream: temp,
            audio: !this.state.audio
        })
    }

    render1pageofListVideo = (i) => {
        let temp = (4 * i)
        return (
            this.state.peers.slice(i === 0 ? temp : temp - 1, i === 0 ? temp + 2 : temp + 3).map((peer, index) => {
                return (
                    <Video
                        style={{
                            width: '25%',
                            padding: 5
                        }}
                        key={index}
                        peer={peer.peer}
                        show={this.show}
                    />
                )
            })
        )
    }

    show = (e) => {
        this.ref_For_Show.current.srcObject = e.current.srcObject
    }

    renderListVideo = () => {
        let temp = this.state.peers.length
        let pagecount = temp % 4;
        let arr = []
        for (var i = 0; i < pagecount; i++) {
            arr.push(i)
        }
        if (arr.length > 0) {
            return (
                arr.map((i, index) => {
                    return (
                        <div key={index}>
                            {i === 0 ? <video
                                onClick={() => { this.show(this.userVideo) }}
                                style={{
                                    width: '25%',
                                    padding: 5
                                }} className="styled-video" ref={this.userVideo} muted={true} autoPlay playsInline /> : null}
                            {this.render1pageofListVideo(i)}
                        </div>
                    )
                })
            )
        } else {
            return (
                <div>
                    <video
                        onClick={() => { this.show(this.userVideo) }}
                        style={{
                            width: '25%',
                            padding: 5
                        }} className="styled-video" ref={this.userVideo} muted={true} autoPlay playsInline />
                </div>
            )
        }

    }

    ref_For_Show = React.createRef()
    userVideo = React.createRef()
    render() {
        return (
            <div className="video-container">
                <video style={{
                    width: '100%',
                    height: '100%'
                }} ref={this.ref_For_Show} muted={true} autoPlay playsInline />



                <div className="list-video-carousel">
                    <div className="video-controller">
                        <Button className="openbtn" onClick={this.stopVideo}>{this.state.video ? null : <div className="red-slash" />}<VideoCameraOutlined /></Button>
                        <Button className="openbtn" onClick={this.stopAudio}>{this.state.audio ? null : <div className="red-slash" />}<SoundOutlined /></Button>
                        <Button className="openbtn" onClick={this.props.changeStatusChatRoom}>{this.props.StatusChatRoom ? null : <div className="red-slash" />}<MessageOutlined /></Button>
                    </div>
                    <Carousel style={{ width: '100%' }} arrows={true} autoplay={false}>
                        {this.renderListVideo()}
                    </Carousel>
                </div>
            </div >
        );

    }
}

export default VideoCall;