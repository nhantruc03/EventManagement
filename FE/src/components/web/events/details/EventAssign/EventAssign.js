import React, { Component } from 'react';
import TableData from '../../addevent/EventAssign/TableData';
import { Button, Col, message, Row } from 'antd';
import Search from '../../../helper/search';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../../env'
import Pagination from '../../../helper/Pagination';
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
                    console.log('temp', temp)
                    this.setState({
                        data: temp
                    })
                    this.props.update(temp, res.data.data.userId)

                    // Message('Xóa thành công', true);
                    message.success('Xóa thành công')
                })
                .catch(err => {
                    // Message('Xóa thất bại', false);
                    message.success('Xóa thất bại')
                }))
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
                <Row style={{ marginBottom: '20px' }}>

                    <Col span={24}>
                        <div className="flex-container-row">
                            <Search targetParent="userId" target="name" data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />

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
                        </div>
                    </Col>
                </Row>
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