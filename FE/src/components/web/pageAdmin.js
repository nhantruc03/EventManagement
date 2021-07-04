import React, { Component } from 'react';
import { Layout } from 'antd';
import Sider from './antd-components/siderAdmin';
import Header from './antd-components/header';
import { LoadingIndicator } from './helper/Loading';

class pageAdmin extends Component {
    render() {
        return (
            <React.Fragment>
                <Layout className="site-drawer-render-in-current-wrapper">
                    <Sider />
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

export default pageAdmin;