import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../../../env'
import { trackPromise } from 'react-promise-tracker';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import Title from 'antd/lib/typography/Title';
import {
    ToolOutlined,
    CloseOutlined,
    ZoomInOutlined,

} from '@ant-design/icons';

import moment from 'moment'
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
                    width: '30%',
                    render: (e) =>
                        <div className="btn-group">
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

    printData = () => {
        return (
            <div className='mt-1'>
                {this.state.data.length > 0 ?
                    <Table className="scripts" pagination={this.getlistpage(this.state.data) > 1 ? { pageSize: this.state.postsPerPage } : false} showHeader={false} rowKey="_id" columns={this.state.columns} dataSource={this.state.data}></Table> : null
                }
            </div>
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