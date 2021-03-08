import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../env'
import { trackPromise } from 'react-promise-tracker';
import { Button, Table, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

class list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            postsPerPage: 10,
            listPage: [],
            SearchData: [],
            columns: [
                {
                    title: 'Tên',
                    dataIndex: 'name',
                    key: 'name',
                },
                {
                    title: 'Người viết',
                    dataIndex: 'writerId',
                    key: 'writerId',
                    render: (e) => <div>{e.name}</div>
                },
                {
                    title: 'Dành cho',
                    dataIndex: 'forId',
                    key: 'forId',
                    render: (e) => <div>{e.name}</div>
                },
                {
                    title: 'Hành động',
                    dataIndex: '_id',
                    key: '_id',
                    render: (e) =>
                        <div className="btn-group">
                            <Tooltip title="Chỉnh sửa" arrow>
                                <Link to={`/editscripts/${e}`} >
                                    <Button className="add">Sửa</Button>
                                </Link>
                            </Tooltip>
                            <Tooltip title="Xóa" arrow>
                                <Button onClick={() => this.deleteClick(e)} className="back" > Xóa</Button>
                            </Tooltip>
                        </div>
                }
            ]
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [users] = await trackPromise(Promise.all([
            Axios.post('/api/scripts/getAll', { eventId: this.props.eventId }, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]));

        if (users !== null) {
            if (this._isMounted) {
                this.setState({
                    data: users,
                    SearchData: users
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


    printData = () => {
        return (
            <div className='mt-1'>
                <Table rowKey="_id" columns={this.state.columns} dataSource={this.state.data}></Table>
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