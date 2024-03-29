import Axios from 'axios';
import React, { Component } from 'react';
import TableData from '../table';
import Pagination from '../helper/Pagination';
import { Link } from 'react-router-dom';
import Search from '../helper/search';
import { AUTH } from '../env'
import { trackPromise } from 'react-promise-tracker';
const tablerow = ['Tên', 'Email', 'Ngày sinh', 'Địa chỉ', 'Giới tính', 'Điện thoại', 'Vai trò', 'Trạng thái', 'Thao tác']
const keydata = ['name', 'email', 'birthday', 'address', 'gender', 'phone', 'roleId.name', 'isDeleted']
const obj = "users"

class listusers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            postsPerPage: 10,
            SearchData: [],
            columns:[
                
            ]
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [users] = await trackPromise(Promise.all([
            Axios.post('/api/users/getAll', {}, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]));

        console.log(users)
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

    getCurData = (SearchData) => {
        var indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
        var indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        return SearchData.slice(indexOfFirstPost, indexOfLastPost);

    }

    getSearchData = (data) => {
        this.setState({
            SearchData: data
        })
    }

    paginate = (pageNumber) => {
        this.setState(
            {
                currentPage: pageNumber
            });
    }

    onAddClick = () => {
        this.setState({
            onAdd: true
        })
    }

    onDelete = (e) => {
        this.setState({
            data: this.state.data.filter(o => o._id !== e),
            SearchData: this.state.data.filter(o => o._id !== e)
        })
    }
    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    getlistpage = (SearchData) => {
        return  Math.ceil(SearchData.length / this.state.postsPerPage);
    }

    printData = (SearchData) => {
        if (this.state.data !== null) {
            return (
                <div className='mt-1'>
                    <div className="row">
                        <div className="col-9">
                            <div className='subject'>List of users</div>
                        </div>
                        <div className="col">
                            <Link className="link" to={`/addusers`} >
                                <div className="btn btn-createnew">+ Tạo mới</div>
                            </Link>
                        </div>
                    </div>
                    <Search target="name" data={this.state.data} getSearchData={(e) => this.getSearchData(e)} />
                    <TableData obj={obj} dataRow={tablerow} data={this.getCurData(SearchData)} keydata={keydata} onDelete={(e) => this.onDelete(e)} />
                    <Pagination
                        totalPosts={this.getlistpage(this.state.data)}
                        paginate={(e) => this.paginate(e)}
                        PageSize={this.state.postsPerPage}
                    />
                </div>
            )
        } else {
            return (
                <div className='mt-5'>
                    <h1 className='text-primary mb-3'>Danh sách người dùng</h1>
                    <div onClick={() => this.onAddClick()} className="btn btn-block btn-success"><i className="fa fa-edit" />Thêm</div>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                <div className="site-layout-background-main">
                    {this.printData(this.state.SearchData)}
                </div>
            </div>
        );
    }
}
export default listusers;