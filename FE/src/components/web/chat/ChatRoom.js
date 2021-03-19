import axios from 'axios';
import React, { Component } from 'react';
import { w3cwebsocket } from 'websocket';
import ChatMessage from './ChatMessage';
import {
    SendOutlined
} from '@ant-design/icons';
import { trackPromise } from 'react-promise-tracker';
import Loader from 'react-loader-spinner';
const client = new w3cwebsocket('ws://localhost:3001');
class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formValue: '',
            page: 1,
            limit: 11,
            messages: [],
            onRoll: false,
            lastDoc: null,
            onLoadMore: false,
            currentUser: {},
        }
    }
    getData = async () => {
        console.log('getdata')
        const temp = await trackPromise(axios.post('/api/chat-message/getAll?page=1&limit=15', { groupID: this.props.roomId })
            .then((res) =>
                res.data.data
            ))
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
            this.setState({
                currentUser: obj.id
            })

            await this.getData();
        }

        // this.refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
        if (this.chatbox.current !== null) {
            this.chatbox.current.scrollTo({ top: this.chatbox.current.scrollHeight, behavior: 'smooth' })
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
            userID: { _id: obj.id, photoUrl: obj.photoUrl },
            groupID: this.props.roomId
        }
        // console.log(message)
        // await this.props.firestore.collection('chats').doc(this.props.roomId).collection('messages').add(message)
        await axios.post('/api/chat-message', message)
            .then((res) => {
                console.log(res.data.data)
            })
        // console.log(temp)

        client.send(JSON.stringify({
            type: "sendMessage",
            roomId: this.props.roomId,
            message
        }))

        // await this.getData();

        this.setState({
            formValue: ''
        })

        // this.refs.messagesEnd.scrollIntoView({ behavior: 'smooth' });
        // this.chatbox.current.scrollTop = this.chatbox.current.scrollHeight
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
                // console.log(this.state.onLoadMore)
                // const temp = await axios.post('/api/chat-message/getAll?page=1&limit=15', { groupID: this.props.roomId })
                // .then((res) =>
                //     res.data.data
                // )
                await axios.post(`/api/chat-message/getAll?page=${this.state.page + 1}&limit=15`, { groupID: this.props.roomId })
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
                <ChatMessage key={index} messageClass={msg.userID._id === this.state.currentUser ? 'sent' : 'received'} message={msg} />
            ))
        )
    }
    chatbox = React.createRef()
    render() {
        return (
            <div className="section">
                <div ref={this.chatbox} className="ChatBox" onScroll={this.handleScroll}>
                    <div style={{ width: '100%', textAlign: 'center' }}>
                        {this.state.onLoadMore ? <Loader color="#10d8d8" type="ThreeDots" height="20" width="30" /> : null}
                    </div>

                    {this.renderMessage()}
                    <span ref="messagesEnd"></span>
                </div>
                <form className="chat-form" onSubmit={this.sendMessage}>
                    <input className="input-chat" value={this.state.formValue} onChange={(e) => this.setFormValue(e.target.value)} placeholder="Hãy chia sẻ ý kiến của bạn" />
                    {/* <button className="chat-button" type="submit" disabled={!this.state.formValue}>🕊️</button> */}
                    <button className="chat-button" type="submit" disabled={!this.state.formValue}><SendOutlined /></button>
                </form>
            </div>
        );
    }
}

export default ChatRoom;