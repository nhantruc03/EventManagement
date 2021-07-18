import React, { Component } from 'react';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../env'
import { Col, Divider, Row, Tooltip } from 'antd';
import { PaperClipOutlined, CheckSquareOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ApiFailHandler from '../../helper/ApiFailHandler'
class ActionItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            totalSubAction: [],
            completeSubAction: [],
            resources: []
        }
    }
    async componentDidMount() {
        this._isMounted = true;

        // const login = localStorage.getItem('login');
        // const obj = JSON.parse(login);

        const [subActions, resources] = await trackPromise(Promise.all([
            axios.post('/api/sub-actions/getAll', { actionId: this.props.data._id }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                ).catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
            axios.post('/api/action-resources/getAll', { actionId: this.props.data._id }, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                ).catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                }),
        ]));


        if (subActions !== null) {
            if (this._isMounted) {
                subActions.forEach(e => {
                    if (e.status) {
                        this.setState({
                            completeSubAction: [...this.state.completeSubAction, e]
                        })
                    }
                })
                this.setState({
                    totalSubAction: subActions,
                    resources: resources
                })
            }
        }
    }
    componentWillUnmount() {
        this._isMounted = false;
    }
    render() {
        return (
            <Link style={{ color: 'black' }} to={`/actions/${this.props.data._id}`}>
                <Row style={{ padding: '15px' }}>
                    <Col span={3}>
                        {this.props.stt + 1}
                    </Col>
                    <Col span={12}>
                        <Tooltip title={this.props.data.name} placement="top">
                            <p className="cut-text" style={this.state.completeSubAction.length === this.state.totalSubAction.length ? { textDecoration: 'line-through' } : null}>{this.props.data.name}</p>
                        </Tooltip>
                    </Col>
                    <Col span={9}>
                        <div className="flex-container-row" style={{ color: 'grey' }}>
                            <PaperClipOutlined style={{ marginLeft: '5px' }} />
                            <p style={{ marginLeft: '5px' }}>{this.state.resources.length}</p>

                            <CheckSquareOutlined style={{ marginLeft: '5px' }} />
                            <p style={{ marginLeft: '5px' }}>{this.state.completeSubAction.length}/{this.state.totalSubAction.length}</p>

                            <img className="flex-row-item-right" src={this.state.completeSubAction.length === this.state.totalSubAction.length ? "/Checked.png" : "/Unchecked.png"} alt="checked" />
                        </div>
                    </Col>
                </Row>
                <Divider />
            </Link >
        );
    }
}

export default ActionItem;