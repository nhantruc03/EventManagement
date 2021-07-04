import { Col, Image, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { Component } from 'react';
import { LoadingIndicator } from '../helper/Loading';

class pagelogin extends Component {
    render() {
        return (

            <React.Fragment>
                <div className="login-page">
                    <div className="login-container">
                        <Row>
                            <Col span={12} className="login-container-col1">
                                <Title className="title" level={1}>EVENTGO</Title>
                                <div style={{ alignSelf: 'center' }}>
                                    <Image src="/login-asset.svg" preview={false} />
                                </div>
                            </Col>
                            <Col span={12} className="login-container-col2">
                                {this.props.children}
                            </Col>
                        </Row>

                    </div>
                    <LoadingIndicator />
                </div >

            </React.Fragment>
        );
    }
}

export default pagelogin;