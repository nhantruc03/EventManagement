import Axios from 'axios';
import React, { Component } from 'react';
import TableData from '../table';
import Pagination from '../helper/Pagination';
import { Link } from 'react-router-dom';
import Search from '../helper/search';
import { AUTH } from '../env'
import { trackPromise } from 'react-promise-tracker';
const tablerow = ['Tên', 'Trạng thái', 'Thao tác']
const keydata = ['name', 'isDeleted']
const obj = "tags"

class list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            postsPerPage: 10,
            listPage: [],
            SearchData: []
        }
    }

    async componentDidMount() {
        this._isMounted = true;
        const [eventTypes] = await trackPromise(Promise.all([
            Axios.post('/api/tags/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]));

        if (eventTypes !== null) {
            if (this._isMounted) {
                this.setState({
                    data: eventTypes,
                    SearchData: eventTypes
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
        var listpage = [];
        for (let i = 1; i <= Math.ceil(SearchData.length / this.state.postsPerPage); i++) {
            listpage.push(i);
        }
        return listpage;
    }

    printData = (SearchData) => {
        if (this.state.data !== null) {
            return (
                <div className='mt-1'>
                    <div className="row">
                        <div className="col-9">
                            <div className='subject'>Danh sách hình thức sự kiện</div>
                        </div>
                        <div className="col">
                            <Link className="link" to={`/addtags`} >
                                <div className="btn btn-createnew">+ Tạo mới</div>
                            </Link>
                        </div>
                    </div>
                    <Search target="name" data={this.state.data} getSearchData={(e) => this.getSearchData(e)} />
                    <TableData obj={obj} dataRow={tablerow} data={this.getCurData(SearchData)} keydata={keydata} onDelete={(e) => this.onDelete(e)} />
                    <Pagination
                        postsPerPage={this.state.postsPerPage}
                        totalPosts={this.getlistpage(SearchData)}
                        paginate={(e) => this.paginate(e)}
                    />
                </div>
            )
        } else {
            return (
                <div className='mt-5'>
                    <h1 className='text-primary mb-3'>Danh sách hình thức sự kiện</h1>
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
export default list;