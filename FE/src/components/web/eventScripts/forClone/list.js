import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../../env'
import { trackPromise } from 'react-promise-tracker';
import { Button, Row, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import Search from "../../helper/search";
import {
    ToolOutlined,
    CloseOutlined,
    ZoomInOutlined,

} from '@ant-design/icons';

import moment from 'moment'
import { Content } from 'antd/lib/layout/layout';
class list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            postsPerPage: 2,
            listPage: [],
            SearchData: [],
            columns: [
                {
                    title: 'Tên',
                    dataIndex: '',
                    key: 'x',
                    render: (e) => {
                        return (
                            <div>
                                <Title level={2}>{e.name}</Title>
                                <p style={{ color: '#AAB0B6' }}>Tạo lúc: {moment(e.createdAt).format('HH:mm')} | {moment(e.createdAt).format('DD/MM/YYYY')}</p>
                            </div>
                        )
                    }
                },
                {
                    title: 'Hành động',
                    dataIndex: '_id',
                    key: '_id',
                    width: '15%',
                    render: (e) =>
                        <div className="btn-group" style={{ textAlign: 'center' }}>
                            <Tooltip title="Chỉnh sửa" arrow>
                                <Link to={`/editscriptsclone/${e}`} >
                                    <Button className="add"><ToolOutlined /></Button>
                                </Link>
                            </Tooltip>
                            <Tooltip title="Xóa" arrow>
                                <Button onClick={() => this.deleteClick(e)} className="add" ><CloseOutlined /></Button>
                            </Tooltip>
                            <Tooltip title="Xem" arrow>
                                <Link to={`/viewscriptsclone/${e}`} >
                                    <Button className="add" ><ZoomInOutlined /></Button>
                                </Link>
                            </Tooltip>
                        </div>
                }
            ]
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [scripts] = await trackPromise(Promise.all([
            Axios.post('/api/scripts/getAll', { eventId: this.props.eventId }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]));
        console.log(scripts)
        if (scripts !== null) {
            if (this._isMounted) {
                this.setState({
                    data: scripts,
                    SearchData: scripts
                })
            }
        }

    }

    componentWillUnmount() {
        this._isMounted = false;
    }


    onAddClick = () => {
        this.setState({
            onAdd: true
        })
    }

    deleteClick = async (e) => {
        console.log(e)
        await trackPromise(
            Axios.delete("/api/scripts/" + e, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    this.setState({
                        data: this.state.data.filter(o => o._id !== e)
                    })
                })
        )
    }
    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }

    getSearchData = (data) => {
        this.setState({
            SearchData: data
        })
    }

    printData = () => {
        return (
            <Content>
                <Row style={{ marginBottom: '20px' }}>
                    <div style={{ width: '100%' }} className="flex-container-row">
                        <Title
                            id="home-top-header"
                            level={2}
                        >
                            Kịch bản
                    </Title>
                        <div className="flex-row-item-right">
                            <div className="flex-container-row">
                                <Search
                                    target={["name"]}
                                    multi={true}
                                    data={this.state.data}
                                    getSearchData={(e) => this.getSearchData(e)}
                                />
                                <Button className="add" style={{ marginLeft: '20px' }}>
                                    <Link to={`/addscriptsclone/${this.props.eventId}`}>Thêm kịch bản</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </Row>

                <div style={{ padding: '30px' }}>
                    {this.state.data.length > 0 ?
                        <Table className="scripts" pagination={this.getlistpage(this.state.SearchData) > 1 ? { pageSize: this.state.postsPerPage } : false} showHeader={false} rowKey="_id" columns={this.state.columns} dataSource={this.state.SearchData}></Table> : null
                    }
                </div>
            </Content>
        )
    }

    render() {
        return (
            <div>
                {this.printData()}
            </div>
        );
    }
}
export default list;