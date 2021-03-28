import { Image, Tooltip } from 'antd';
import React, { Component } from 'react';

class ChatMessage extends Component {
  renderIcon = (extension) => {
    switch (extension) {
      case 'doc': case 'docx':
        return (
          <img style={{ maxWidth: '30px' }} alt="icon" src='/word-icon.png'></img>
        )
      case 'pdf':
        return (
          <img style={{ maxWidth: '30px' }} alt="icon" src="/pdf-icon.png"></img>
        )
      case 'png':
        return (
          <img style={{ maxWidth: '30px' }} alt="icon" src={`/api/resources/${this.props.resourcePath}/${this.props.data.url}`}></img>
        )
      default:
        return (null)
    }
  }
  renderMessage = () => {
    if (this.props.message.text) {
      return (
        <p className="chat-message">{this.props.message.text}</p>
      )
    } else {
      if (this.props.message.resourceUrl) {
        let temp_resourceUrl = this.props.message.resourceUrl
        let extension = temp_resourceUrl.substring(temp_resourceUrl.length - 3, temp_resourceUrl.length)
        let realName = temp_resourceUrl.substring(14, temp_resourceUrl.length)
        if (["png", "svg"].includes(extension)) {
          return (
            // <p className="chat-message">{this.props.message.text}</p>
            <Image style={{ marginBottom: '12px' }} alt="resource" src={`/api/resources/${this.props.roomId}/${temp_resourceUrl}`} />
          )
        } else if (extension === 'mp4') {
          return (
            <video style={{ marginBottom: '12px' }} alt='resource' src={`/api/resources/${this.props.roomId}/${temp_resourceUrl}`} />
          )
        } else {
          return (
            <div style={{ marginTop: 'unset', maxWidth: '150px', marginBottom: '12px' }} className="flex-container-row resource-card">
              {this.renderIcon(extension)}
              <Tooltip title={realName} placement="top" >
                <a className="cut-text" target="_blank" rel="noreferrer" href={`/api/resources/${this.props.roomId}/${temp_resourceUrl}`} style={{ marginLeft: '10px' }} >{realName}</a>
              </Tooltip>
            </div>
          )
        }
      }
    }
  }

  render() {
    return (
      <div className={`message ${this.props.messageClass}`}>
        <Tooltip title={this.props.message.userId.name} placement="top">
          <img className="img-chat" alt="avatar" src={this.props.message.userId.photoUrl ? `/api/images/${this.props.message.userId.photoUrl}` : 'https://thumbs.dreamstime.com/b/creative-vector-illustration-default-avatar-profile-placeholder-isolated-background-art-design-grey-photo-blank-template-mo-118823351.jpg'} />
        </Tooltip>
        
        {this.renderMessage()}
      </div>
    );
  }
}

export default ChatMessage;