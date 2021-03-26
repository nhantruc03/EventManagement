import axios from 'axios';
import React, { Component } from 'react';
import { w3cwebsocket } from 'websocket';
import ChatMessage from './ChatMessage';
import Loader from 'react-loader-spinner';
import {
    VideoCameraOutlined,
    SendOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
const client = new w3cwebsocket('ws://localhost:3001');
class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: '',
            page: 1,
            limit: 12,
            messages: [],
            onRoll: false,
            lastDoc: null,
            onLoadMore: false,
            currentUser: {}
        }
    }
    getData = async () => {
        const temp = await axios.post('/api/chat-actions/getAll?page=1&limit=15', { actionId: this.props.roomId })
            .then((res) =>
                res.data.data
            )
        this.setState({
            messages: temp.reverse()
        })
    }

    async componentDidMount() {
        this._isMounted = true;
        if (this._isMounted) {
            client.onopen = () => {
                console.log('Connect to ws')
            }

            client.onmessage = (message) => {
                const dataFromServer = JSON.parse(message.data);
                if (dataFromServer.type === "sendMessage") {
                    if (dataFromServer.roomId === this.props.roomId) {
                        this.setState({
                            messages: [...this.state.messages, dataFromServer.message]
                        })
                        if (this.chatbox.current !== null) {
                            this.chatbox.current.scrollTo({ top: this.chatbox.current.scrollHeight, behavior: 'smooth' })
                        }
                    }
                }

            };
            const login = localStorage.getItem('login');
            const obj = JSON.parse(login);
            this.setState({
                currentUser: obj.id
            })
            await this.getData();

            if (this.chatbox.current !== null) {
                this.chatbox.current.scrollTo({ top: this.chatbox.current.scrollHeight, behavior: 'smooth' })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    sendMessage = async (e) => {
        e.preventDefault();
        // console.log(e)

        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        // console.log(obj)
        // console.log('adfasfsaf')
        var message = {
            text: this.state.formValue,
            userId: { _id: obj.id, photoUrl: obj.photoUrl },
            actionId: this.props.roomId
        }
        // console.log(message)
        // await this.props.firestore.collection('chats').doc(this.props.roomId).collection('messages').add(message)
        await axios.post('/api/chat-actions', message)
            .then((res) => {
                console.log(res.data.data)
            })
        // console.log(temp)

        client.send(JSON.stringify({
            type: "sendMessage",
            roomId: this.props.roomId,
            message
        }))

        this.setState({
            formValue: ''
        })

        if (this.chatbox.current !== null) {
            this.chatbox.current.scrollTo({ top: this.chatbox.current.scrollHeight, behavior: 'smooth' })
        }
    }

    handleScroll = async (e) => {
        console.log(e)
        if (e.target.scrollTop === 0) {
            if (!this.state.onLoadMore) {
                this.setState({
                    onLoadMore: true
                })

                await axios.post(`/api/chat-actions?page=${this.state.page + 1}&limit=15`, { actionId: this.props.roomId })
                    .then((res) => {
                        const temp = res.data.data;
                        this.setState({
                            onLoadMore: false,
                            page: this.state.page + 1,
                            messages: [...temp.reverse(), ...this.state.messages]
                        })
                    })
            }
        }
    }

    setFormValue = (e) => {
        this.setState({
            formValue: e
        })
    }

    renderMessage = () => {
        console.log(this.state.messages)
        return (
            this.state.messages.map((msg, index) => (
                <ChatMessage key={index} messageClass={msg.userId._id === this.state.currentUser ? 'sent' : 'received'} message={msg} />
            ))
        )
    }
    chatbox = React.createRef()
    render() {
        return (
            <div className="section">
                <div ref={this.chatbox} style={this.props.style} className="ChatBox" onScroll={this.handleScroll}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        {this.state.onLoadMore ? <Loader color="#10d8d8" type="ThreeDots" height="20" width="30" /> : null}
                    </div>

                    {this.renderMessage()}
                    <span ref="messagesEnd"></span>
                </div>
                <div className="flex-container-row">
                    <form className="chat-form" onSubmit={this.sendMessage}>
                        <input className="input-chat" value={this.state.formValue} onChange={(e) => this.setFormValue(e.target.value)} placeholder="Hãy chia sẻ ý kiến của bạn" />
                        <button className="chat-button"><Link to={`/action-videocall/${this.props.roomId}`} style={{ color: 'black' }} ><VideoCameraOutlined /></Link></button>
                        <button className="chat-button" type="submit" disabled={!this.state.formValue}><SendOutlined /></button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ChatRoom;