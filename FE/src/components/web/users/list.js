import Axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Search from '../helper/search';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Button, Popconfirm, Table } from 'antd';
import Title from 'antd/lib/typography/Title';
import moment from 'moment'
import ApiFailHandler from '../helper/ApiFailHandler'
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
                { title: 'Tên', dataIndex: 'name', key: 'name' },
                { title: 'MSSV', dataIndex: 'mssv', key: 'mssv' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
                {
                    title: 'Ngày sinh',
                    dataIndex: 'birthday',
                    key: 'birthday',
                    render: (e) => <div>{moment(e).format('DD/MM/YYYY')}</div>
                },
                { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
                { title: 'Giới tính', dataIndex: 'gender', key: 'gender' },
                { title: 'Điện thoại', dataIndex: 'phone', key: 'phone' },
                {
                    title: 'Vai trò',
                    dataIndex: 'roleId',
                    key: 'roleId',
                    render: (e) => <div>{e.name}</div>
                },
                {
                    title: 'Hành động',
                    dataIndex: '',
                    key: 'x',
                    render: (e) => this.renderAction(e),
                },
            ]
        }
    }

    renderAction = (e) =>
        <div className="center">
            <Button className="add"><Link to={`/editusers/${e._id}`}>Sửa</Link></Button >
            <Popconfirm
                title="Bạn có chắc muốn xóa chứ?"
                onConfirm={() => this.onDelete(e)}
                okText="Đồng ý"
                cancelText="Hủy"
            >
                <Button className="back" >Xoá</Button>
            </Popconfirm>
        </div>

    async componentDidMount() {
        this._isMounted = true;
        const [users] = await trackPromise(Promise.all([
            Axios.post('/api/users/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                })
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

    getSearchData = (data) => {
        this.setState({
            SearchData: data
        })
    }

    onDelete = async (e) => {
        await trackPromise(
            Axios.delete("/api/users/" + e._id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) => {
                    this.setState({
                        data: this.state.data.filter(o => o._id !== e._id),
                        SearchData: this.state.data.filter(o => o._id !== e._id)
                    })
                }))
            .catch(err => {
                ApiFailHandler(err.response?.data?.error)
            })

    }

    printData = () => {
        return (
            <div >
                <Title level={4}>Danh sách người dùng</Title>
                <div className="flex-container-row" style={{ marginBottom: 20 }}>
                    <Search target="name" data={this.state.data} getSearchData={(e) => this.getSearchData(e)} />
                    <Button className="flex-row-item-right add">
                        <Link to={`/addusers`} >
                            <div className="btn btn-createnew">Tạo mới</div>
                        </Link>
                    </Button>
                </div>
                <Table rowKey="_id" dataSource={this.state.SearchData} columns={this.state.columns} />
            </div>
        )
    }

    render() {
        return (
            <Content style={{ margin: "0 16px" }}>
                <div className="site-layout-background-main">
                    {this.printData()}
                </div>
            </Content>
        );
    }
}
export default list;