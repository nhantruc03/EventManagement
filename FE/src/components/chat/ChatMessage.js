import React, { Component } from 'react';

class ChatMessage extends Component {
    render() {
        return (
          <div className={`message ${this.props.messageClass}`}>
            <img alt="avatar" src={this.props.message.userID.photoURL ? `/api/images/${this.props.message.userID.photoURL}` : 'https://thumbs.dreamstime.com/b/creative-vector-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-118823351.jpg'} />
            <p>{this.props.message.text}</p>
          </div>
        );
      }
}

export default ChatMessage;