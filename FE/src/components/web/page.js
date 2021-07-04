import React, { Component } from 'react';
import { Layout } from 'antd';
import SiderDemo from './antd-components/sider';
import Header from './antd-components/header';
import { LoadingIndicator } from './helper/Loading';

class page extends Component {
    render() {
        return (
            <React.Fragment>
                <Layout className="site-drawer-render-in-current-wrapper">
                    <SiderDemo />
                    <Layout className="site-layout">
                        <Header />
                        {React.cloneElement(this.props.children, { showDrawer: () => this.showDrawer() })}
                        <LoadingIndicator />
                    </Layout>
                </Layout>
            </React.Fragment>
        );
    }
}

export default page;