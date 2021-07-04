import { Breadcrumb, Row, Tabs } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import VideoCall from '../VideoCall/VideoCall';
import ChatRoom from './ChatRoom';
const { TabPane } = Tabs
class VideoCallRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentChat: true
        }
    }
    onChange = () => {
        if (this.state.currentChat) {
            this.closeNav()
        } else {
            this.openNav()
        }
        this.setState({
            currentChat: !this.state.currentChat
        })
    }
    openNav = () => {
        this.mySidepanel.current.style.width = "35%"
    }

    closeNav = () => {
        this.mySidepanel.current.style.width = "0"
    }
    mySidepanel = React.createRef()
    render() {
        return (
            <Content >
                <Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
                    <div style={{ width: '100%', padding: '0 10px' }}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item >
                                <Link to="/events">Sự kiện</Link>
                            </Breadcrumb.Item>
                            <Breadcrumb.Item>
                                Phòng hội thoại
                        </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>
                </Row >

                <div className="site-layout-background-main" style={{ padding: 'unset' }}>
                    <Row style={{ height: '95%' }}>
                        <div className="flex-container-row" style={{ width: '100%', alignItems: 'unset' }}>
                            <VideoCall StatusChatRoom={this.state.currentChat} changeStatusChatRoom={this.onChange} roomId={this.props.match.params.id} />
                            {/* <Button className="flex-row-item-right openbtn" onClick={}><CommentOutlined /> </Button> */}
                            <div style={{ height: '100%', padding: '10px', maxHeight: '890px' }} ref={this.mySidepanel} id="mySidepanel" className="sidepanel">
                                <Tabs className="chat-tabs" defaultActiveKey="1" >
                                    <TabPane style={{ paddingBottom: '20px' }} tab="Kênh chat" key={1}>
                                        <ChatRoom style={{ maxHeight: 'unset' }} roomId={this.props.match.params.id} />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </Row>
                </div>
            </Content >
        );
    }
}

export default VideoCallRoom;