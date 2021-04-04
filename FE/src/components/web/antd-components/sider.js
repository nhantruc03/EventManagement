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
                    <Menu.Item key="/eventclones" icon={<TeamOutlined />}>
                        <Link to="/eventclones" className="nav-text">Hồ sơ</Link>
                    </Menu.Item>
                    {this.state.currentUser.role === "Admin" ?
                        <SubMenu key="sub1" icon={<CopyOutlined />} title="Admin quản lý">
                            <Menu.Item key="/listusers">
                                <Link to="/listusers">Người dùng</Link>
                            </Menu.Item>
                            <Menu.Item key="/listroles">
                                <Link to="/listroles">Quyền</Link>
                            </Menu.Item>
                            <Menu.Item key="/listsystemroles">
                                <Link to="/listsystemroles">Quyền hệ thống</Link>
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
                        : null
                    }
                </Menu>
            </Sider>
        );
    }
}
export default withRouter(SiderDemo);

