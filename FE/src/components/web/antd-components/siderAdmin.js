import { Layout, Menu } from 'antd';
import React from 'react';
import {
    HomeOutlined,

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
                <Title className="logo" level={3}>EVENTGO</Title>
                <Menu selectedKeys={[this.props.location.pathname]} mode="inline" >
                    <Menu.Item key="/" icon={<HomeOutlined />}>
                        <Link to="/" className="nav-text">Trang chủ</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listusers">
                        <Link to="/admin/listusers" className="nav-text">Người dùng</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listroles">
                        <Link to="/admin/listroles" className="nav-text">Quyền</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listcredentials">
                        <Link to="/admin/listcredentials" className="nav-text">Quyền thực thi</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listsystemroles">
                        <Link to="/admin/listsystemroles" className="nav-text">Quyền hệ thống</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listfaculties">
                        <Link to="/admin/listfaculties" className="nav-text">Ban</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listEventTypes">
                        <Link to="/admin/listEventTypes" className="nav-text">Hình thức sự kiện</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listtags">
                        <Link to="/admin/listtags" className="nav-text">Tags sự kiện</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listactiontags">
                        <Link to="/admin/listactiontags" className="nav-text">Tags công việc</Link>
                    </Menu.Item>
                    <Menu.Item key="/admin/listactionpriorities">
                        <Link to="/admin/listactionpriorities" className="nav-text">Độ ưu tiên công việc</Link>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}
export default withRouter(SiderDemo);

