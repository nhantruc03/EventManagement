import React, { Component } from 'react';
import TableData from './TableData';
import { message } from 'antd';
import Search from '../../../helper/search';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../../env'
import Pagination from '../../../helper/Pagination';
import ApiFailHandler from '../../../helper/ApiFailHandler'
class EventAssign extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hienthiform: false,
            data: [],
            searchKey: '',
            onEditUser: false,
            currentPage: 1,
            postsPerPage: 3,
        }
    }

    getSearchKey = (key) => {
        this.setState({
            searchKey: key
        })
    }

    getUserEditInfo = async (info) => {
        let data = {
            _id: info._id,
            userId: info.userId._id,
            credentialsId: info.credentialsId,
            eventId: this.props.eventId
        }

        await trackPromise(axios.put('/api/event-assign/' + info._id, data, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then(res => {
                let temp_data = this.props.data;
                temp_data.forEach((value) => {
                    if (value.userId._id === info.userId._id) {
                        value.userId = info.userId;
                        value.credentialsId = info.credentialsId
                    }
                });
                this.props.update(temp_data);
                // Message('Sửa thành công', true);
                message.success('Sửa thành công')

            })
            .catch(err => {
                // Message('Sửa thất bại', false);
                message.error('Sửa thất bại')
                ApiFailHandler(err.response?.data?.error)
            }))

    }

    UNSAFE_componentWillReceiveProps(e) {
        this.setState({
            data: e.data
        })
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
        })
    }

    getSearchData = (data) => {
        this.setState({
            data: data
        })
    }


    getlistpage = (SearchData) => {
        // console.log('page', Math.ceil(SearchData.length / this.state.postsPerPage))
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }

    paginate = (pageNumber) => {
        this.setState({
            currentPage: pageNumber
        });
    }
    getCurData = (SearchData) => {
        var indexOfLastPost = this.state.currentPage * this.state.postsPerPage;
        var indexOfFirstPost = indexOfLastPost - this.state.postsPerPage;
        return SearchData.slice(indexOfFirstPost, indexOfLastPost);

    }

    render() {
        return (
            <div >
                <div className="flex-container-row" style={{ marginBottom: '20px' }}>
                    <Search targetParent="userId" target="name" data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                </div>
                <TableData canDelete={this.props.canDelete} listCredentials={this.props.listCredentials} getUserEditInfo={(info) => this.getUserEditInfo(info)} dataUser={this.getCurData(this.state.data)} />
                {this.getlistpage(this.state.data) > 1 ?
                    <Pagination
                        totalPosts={this.state.data.length}
                        paginate={(e) => this.paginate(e)}
                        PageSize={this.state.postsPerPage}
                    /> :
                    null
                }
            </div>

        );
    }
}

export default EventAssign;