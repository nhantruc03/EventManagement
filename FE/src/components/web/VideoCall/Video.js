import React, { Component } from 'react';
class Video extends Component {
    componentDidMount() {
        this._ismounted = true
        if (this._ismounted) {
            this.props.peer.on("stream", stream => {
                this.ref.current.srcObject = stream;
            })
        }
    }

    componentWillUnmount() {
        this._ismounted = false
    }

    ref = React.createRef()
    render() {
        return (
            <video className="styled-video" playsInline autoPlay ref={this.ref} />
        );
    }
}

export default Video;