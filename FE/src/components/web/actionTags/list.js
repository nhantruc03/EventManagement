import Axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Search from '../helper/search';
import { AUTH } from '../../env'
import { trackPromise } from 'react-promise-tracker';
import { Content } from 'antd/lib/layout/layout';
import { Button, Popconfirm, Table, Tag } from 'antd';
import Title from 'antd/lib/typography/Title';
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
                {
                    title: 'Tên', dataIndex: '', key: 'k',
                    render: (e) => <Tag style={{ background: e.background, color: `${e.color}` }}>{e.name}</Tag>
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
            <Button className="add"><Link to={`/admin/admin/editactiontags/${e._id}`}>Sửa</Link></Button >
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
            Axios.post('/api/action-tags/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
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
            Axios.delete("/api/action-tags/" + e._id, {
                headers: {
                    'Authorization': AUTH()
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

    printData = (SearchData) => {
        return (
            <div >
                <Title level={4}>Danh sách action-tags</Title>
                <div className="flex-container-row" style={{ marginBottom: 20 }}>
                    <Search target="name" data={this.state.data} getSearchData={(e) => this.getSearchData(e)} />
                    <Button className="flex-row-item-right add">
                        <Link to={`/admin/addactiontags`} >
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
                    {this.printData(this.state.SearchData)}
                </div>
            </Content>
        );
    }
}
export default list;