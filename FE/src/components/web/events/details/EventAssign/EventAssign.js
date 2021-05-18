import React, { Component } from 'react';
import TableData from '../../addevent/EventAssign/TableData';
import { Button, message } from 'antd';
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
            roleId: info.roleId._id,
            facultyId: info.facultyId._id,
            eventId: this.props.eventId
        }

        await trackPromise(axios.put('/api/event-assign/' + info._id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                let temp_data = this.props.data;
                temp_data.forEach((value) => {
                    if (value.userId._id === info.userId._id) {
                        value.userId = info.userId;
                        value.roleId = info.roleId;
                        value.facultyId = info.facultyId;
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
    deleteClick = async (id) => {
        await trackPromise(
            axios.delete('/api/event-assign/' + id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {

                    let temp = this.props.data.filter(e => e._id !== res.data.data._id)
                    this.setState({
                        data: temp
                    })
                    this.props.update(temp, res.data.data.userId)
                    message.success('Xóa thành công')
                })
                .catch(err => {
                    ApiFailHandler(err.response?.data?.error)
                    let list_actions = err.response.data.list_actions.reduce((list, e) => { list.push(e.name); return list }, [])
                    let list_scripts = err.response.data.list_scripts.reduce((list, e) => { list.push(e.name); return list }, [])

                    if (list_actions.length > 0 || list_scripts.length > 0) {
                        let error = (
                            <div>
                                <p>Xóa thất bại, Người dùng đang được phân công vào các: </p>
                                {list_actions.length > 0 ? <p>Công việc: {list_actions}</p> : null}
                                {list_scripts.length > 0 ? <p>Kịch bản: {list_scripts}</p> : null}
                            </div>
                        )
                        message.error(error, 10)
                    } else {
                        message.error("Xóa thất bại")
                    }
                }))
    }

    getlistpage = (SearchData) => {
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
                    {!this.props.noBigAction ?
                        <>
                            <Button className="flex-row-item-right add" style={{ marginRight: '10px' }} onClick={() => this.props.onAddClick()}>Thêm ban tổ chức</Button>
                            <input
                                // ref={this.selectedFile}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                ref={input => this.selectedFile = input}
                                type="file"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    this.props.uploadExcelFile(file)
                                }}
                                style={{ display: 'none' }}
                            />
                            <Button className="add" onClick={() => this.selectedFile.click()} >Tải lên file</Button>
                        </> : null
                    }
                </div>
                <TableData deleteClick={(id) => this.deleteClick(id)} canDelete={this.props.canDelete} listFaculty={this.props.listFaculty} listRole={this.props.listRole} getUserEditInfo={(info) => this.getUserEditInfo(info)} dataUser={this.getCurData(this.state.data)} />
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