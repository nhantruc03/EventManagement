import axios from 'axios';
import React, { Component } from 'react';
import { w3cwebsocket } from 'websocket';
import ChatMessage from './ChatMessage';
import {
    SendOutlined
} from '@ant-design/icons';
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
        const temp = await axios.post('/api/chat-actions/getAll?page=1&limit=12', { actionId: this.props.roomId })
            .then((res) =>
                res.data.data
            )
        this.setState({
            messages: temp.reverse()
        })
    }

    async componentDidMount() {
        this._isMounted = true;

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
                    this.refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
                }
            }

        };
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        this.setState({
            currentUser: obj.id
        })
        await this.getData();
    }

    componentWillUnmount() {
        this._isMounted = false;
        client.close()
    }

    sendMessage = async (e) => {
        e.preventDefault();
        console.log(e)

        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        console.log(obj)
        console.log('adfasfsaf')
        var message = {
            text: this.state.formValue,
            userId: { _id: obj.id, photoURL: obj.photoUrl },
            actionId: this.props.roomId
        }
        console.log(message)
        // await this.props.firestore.collection('chats').doc(this.props.roomId).collection('messages').add(message)
        const temp = await axios.post('/api/chat-actions', message)
            .then((res) =>
                res.data.data
            )
        console.log(temp)

        client.send(JSON.stringify({
            type: "sendMessage",
            roomId: this.props.roomId,
            message
        }))

        await this.getData();

        this.setState({
            formValue: ''
        })

        this.refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }

    handleScroll = async (e) => {
        console.log(e)
        if (e.target.scrollTop === 0) {
            if (!this.state.onLoadMore) {
                this.setState({
                    onLoadMore: true
                })
                console.log(this.state.onLoadMore)
                await axios.get(`/api/chat-actions?page=${this.state.page + 1}&limit=12`, { actionId: this.props.roomId })
                    .then((res) => {
                        const temp = res.data.data;
                        this.setState({
                            onLoadMore: false,
                            page: this.state.page + 1,
                            messages: [...temp.reverse(), ...this.state.messages]
                        })
                    }

                    )

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

    render() {
        return (
            <div className="section">
                <div className="ChatBox" onScroll={this.handleScroll}>
                    {this.renderMessage()}
                    <span ref="messagesEnd"></span>
                </div>
                <form className="chat-form" onSubmit={this.sendMessage}>
                    <input className="input-chat" value={this.state.formValue} onChange={(e) => this.setFormValue(e.target.value)} placeholder="Hãy chia sẻ ý kiến của bạn" />
                    <button className="chat-button" type="submit" disabled={!this.state.formValue}><SendOutlined /></button>
                </form>
            </div>
        );
    }
}

export default ChatRoom;