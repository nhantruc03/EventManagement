import { Layout, Menu } from 'antd';
import React from 'react';
import {
    HomeOutlined,
    FireOutlined,
    FileDoneOutlined,
    BlockOutlined

} from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import { Link, withRouter } from 'react-router-dom';
const { Sider } = Layout;

class SiderDemo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: JSON.parse(localStorage.getItem('login'))
        }

    }

    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    getM = () => {
        // eslint-disable-next-line
        const { innerWidth: width, innerHeight: height } = window;
        return width
    }


    render() {
        const { collapsed } = this.state;
        return (
            <Sider
                breakpoint="sm"
                collapsedWidth={this.getM() < 576 ? '0' : undefined}
                collapsible
                collapsed={collapsed}
                onCollapse={this.onCollapse}
                style={{
                    backgroundColor: '#002B6D',
                    // overflow: 'auto',
                    // height: '100vh',
                    left: 0,
                }}>
                <Title className="logo" level={3}>EM!</Title>
                <Menu selectedKeys={[this.props.location.pathname]} mode="inline" >
                    <Menu.Item key="/" icon={<HomeOutlined />}>
                        <Link to="/" className="nav-text">Trang chủ</Link>
                    </Menu.Item>
                    <Menu.Item key="/events" icon={<FireOutlined />}>
                        <Link to="/events" className="nav-text">Sự kiện</Link>
                    </Menu.Item>
                    <Menu.Item key="/actions" icon={<FileDoneOutlined />}>
                        <Link to="/actions" className="nav-text">Công việc</Link>
                    </Menu.Item>
                    <Menu.Item key="/eventclones" icon={<BlockOutlined />}>
                        <Link to="/eventclones" className="nav-text">Bản sao</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}
export default withRouter(SiderDemo);

