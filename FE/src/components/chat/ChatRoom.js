import axios from 'axios';
import React, { Component } from 'react';
import { w3cwebsocket } from 'websocket';
import ChatMessage from './ChatMessage';
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
        }
    }
    getData = async () => { const temp = await axios.get('/api/chat-message?page=1&limit=12', { chatRoomID: this.props.roomId })
            .then((res) =>
                res.data.data
            )
        this.setState({
            messages: temp.reverse()
        })
    }

    async componentDidMount() {

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

        await this.getData();
        this.refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
    }


    sendMessage = async (e) => {
        e.preventDefault();

        var message = {
            text: this.state.formValue,
            userID: { _id: '5ff04a7ef72aa03a4cb6d8c5', photoURL: 'user1.png' },
            chatRoomID: this.props.roomId
        }
        // await this.props.firestore.collection('chats').doc(this.props.roomId).collection('messages').add(message)
        const temp = await axios.post('/api/chat-message', message)
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
        if (e.target.scrollTop === 0) {
            if (!this.state.onLoadMore) {
                this.setState({
                    onLoadMore: true
                })
                console.log(this.state.onLoadMore)
                await axios.get(`/api/chat-message?page=${this.state.page + 1}&limit=12`, { chatRoomID: this.props.roomId })
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
        return (
            this.state.messages.map((msg, index) => (
                <ChatMessage key={index} messageClass={msg.userID._id === '5ff04a7ef72aa03a4cb6d8c5' ? 'sent' : 'received'} message={msg} />
            ))
        )

    }


    render() {
        return (
            <>
                <main onScroll={this.handleScroll}>
                    {this.renderMessage()}
                    <span ref="messagesEnd"></span>
                </main>
                <form onSubmit={this.sendMessage}>
                    <input value={this.state.formValue} onChange={(e) => this.setFormValue(e.target.value)} placeholder="say something nice" />
                    <button type="submit" disabled={!this.state.formValue}>🕊️</button>
                </form>
            </>
        );
    }
}

export default ChatRoom;