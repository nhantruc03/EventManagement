import { Layout, Menu } from 'antd';
import React from 'react';
import {
    CopyOutlined,
    HomeOutlined,
    FireOutlined,
    FileDoneOutlined,
    TeamOutlined,
    
} from '@ant-design/icons';
import Title from 'antd/lib/typography/Title';
import { Link, withRouter } from 'react-router-dom';
const { Sider } = Layout;

const { SubMenu } = Menu;

class SiderDemo extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };


    render() {
        const { collapsed } = this.state;
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} style={{ backgroundColor: '#002B6D' }}>
                <Title className="logo" level={3}>Event Management!</Title>
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
                    <Menu.Item key="/calender" icon={<TeamOutlined />}>
                        <Link to="/calender" className="nav-text">Hồ sơ</Link>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<CopyOutlined />} title="Admin quản lý">
                        <Menu.Item key="/listusers">
                            <Link to="/listusers">Người dùng</Link>
                        </Menu.Item>
                        <Menu.Item key="/listroles">
                            <Link to="/listroles">Quyền</Link>
                        </Menu.Item>
                        <Menu.Item key="/listfaculties">
                            <Link to="/listfaculties">Ban</Link>
                        </Menu.Item>
                        <Menu.Item key="/listEventTypes">
                            <Link to="/listEventTypes">Hình thức sự kiện</Link>
                        </Menu.Item>
                        <Menu.Item key="/listtags">
                            <Link to="/listtags">Tags sự kiện</Link>
                        </Menu.Item>
                        <Menu.Item key="/listactiontags">
                            <Link to="/listactiontags">Tags công việc</Link>
                        </Menu.Item>
                        <Menu.Item key="/listactionpriorities">
                            <Link to="/listactionpriorities">Độ ưu tiên công việc</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>
            </Sider>
        );
    }
}
export default withRouter(SiderDemo);

