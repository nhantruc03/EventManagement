import { Button } from 'antd';
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
                // console.log('connected ws')
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
                            // console.log('all user')
                            const peers = [];
                            dataFromServer.message.forEach(userID => {
                                // console.log('self', dataFromServer.currentId)
                                // console.log('other user in room', userID)
                                const peer = this.createPeer(userID, dataFromServer.currentId, this.state.stream);
                                let temp_peersRef = {
                                    peerID: userID,
                                    peer,
                                }
                                // console.log('add peersRef')
                                this.setState({
                                    peersRef: [...this.state.peersRef, temp_peersRef]
                                })
                                // this.peersRef.current.push({
                                //     peerID: userID,
                                //     peer,
                                // })
                                peers.push(peer);
                            })
                            this.setState({
                                peers: peers
                            })
                            break;
                        case 'user joined':
                            // console.log('user joined')
                            const peer = this.addPeer(dataFromServer.message.signal, dataFromServer.message.callerID, this.state.stream);
                            // this.peersRef.current.push({
                            //     peerID: dataFromServer.message.callerID,
                            //     peer,
                            // })
                            let temp_peersRef2 = {
                                peerID: dataFromServer.message.callerID,
                                peer,
                            }
                            // console.log('add peerRefs')
                            this.setState({
                                peers: [...this.state.peers, peer],
                                peersRef: [...this.state.peersRef, temp_peersRef2]
                            })
                            break;
                        case 'receiving returned signal':
                            // console.log('receiving returned signal')
                            const item = this.state.peersRef.find(p => p.peerID === dataFromServer.message.id);
                            item.peer.peer.signal(dataFromServer.message.signal);
                            break;
                        case 'room full':
                            // console.log('room full')
                            alert("room is full");
                            break;
                        case 'user disconnected':
                            // console.log('user disconnected')
                            // this.state.peersRef.current = this.peersRef.current.filter(p => p.peerID !== dataFromServer.message)
                            let temp = this.state.peers
                            let need_delete = temp.filter(p => p.Id === dataFromServer.message)
                            // console.log('need delete', dataFromServer.message)
                            temp.forEach(e => {
                                // console.log(e.Id)
                            })
                            console.log(need_delete.length)
                            if (need_delete.length > 0) {
                                need_delete[0].peer.destroy()
                                let temp1 = this.state.peers.filter(p => p.Id !== dataFromServer.message)
                                console.log('peers', temp1.length)
                                let temp2 = this.state.peersRef.filter(p => p.peerID !== dataFromServer.message)
                                console.log('peersRef', temp2.length)
                                this.setState({
                                    peers: temp1,
                                    peersRef: temp2
                                })
                            }
                            break;
                        default:
                            // console.log('default')
                            break;
                    }
                }

                // var video_button = document.createElement("video_button");
                // video_button.appendChild(document.createTextNode("Toggle hold"));

                // video_button.video_onclick = function () {
                //     stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
                // }

                // var audio_button = document.createElement("audio_button");
                // video_button.appendChild(document.createTextNode("Toggle hold"));

                // audio_button.audio_onclick = function () {
                //     stream.getAudioTracks()[0].enabled = !(stream.getAudioTracks()[0].enabled);
                // }
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
        let temp = this.state.stream
        temp.getVideoTracks()[0].enabled = !(temp.getVideoTracks()[0].enabled);
        this.setState({
            stream: temp
        })
    }
    stopAudio = () => {
        let temp = this.state.stream;
        temp.getAudioTracks()[0].enabled = !(temp.getAudioTracks()[0].enabled);
        this.setState({
            stream: temp
        })
    }

    userVideo = React.createRef()
    render() {
        return (
            <div className="video-container">
                {/* <Button onClick={this.stopVideo}>video</Button>
                <Button onClick={this.stopAudio}>audio</Button> */}
                {/* <div style={{ width: '100%', height: '80%' }}></div> */}
                <video className="styled-video" ref={this.userVideo} muted={true} autoPlay playsInline />
                {
                    this.state.peers.map((peer, index) => {
                        return (
                            <Video key={index} peer={peer.peer} />
                        );
                    })
                }

                <div className="video-controller">
                    <Button className="openbtn" onClick={this.stopVideo}><VideoCameraOutlined /></Button>
                    <Button className="openbtn" onClick={this.stopAudio}><SoundOutlined /></Button>
                    <Button className="openbtn" onClick={this.props.changeStatusChatRoom}><MessageOutlined /></Button>
                </div>
            </div >
        );
    }
}

export default VideoCall;