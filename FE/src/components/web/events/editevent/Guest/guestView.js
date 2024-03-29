import React, { Component } from 'react';
import TableData from './TableData';
import { Button, Col, message, Row } from 'antd';
import Search from '../../../helper/search';
import { AUTH } from '../../../../env'
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import Pagination from '../../../helper/Pagination';
import ApiFailHandler from '../../../helper/ApiFailHandler'
class guestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentPage: 1,
            postsPerPage: 5,
        }
    }

    edit = async (info) => {

        await trackPromise(axios.put('/api/guests/' + info._id, info, {
            headers: {
                'Authorization': AUTH()
            }
        })
            .then(res => {

                console.log(res.data.data)
                let temp_data = this.state.data;
                temp_data.forEach((value) => {
                    if (value._id === info._id) {
                        value.name = info.name;
                        value.phone = info.phone;
                        value.email = info.email;
                        value.guestTypeId = {
                            name: info.guestTypeName,
                            _id: info.guestTypeId
                        }
                        value.noinfo = false
                    }
                });


                // cap nhat du lieu
                this.setState({
                    data: temp_data
                })
                this.props.update(temp_data);
                message.success('Sửa thành công');

            })
            .catch(err => {
                message.error('Sửa thất bại');
                ApiFailHandler(err.response?.data?.error)
            }))


    }

    deleteClick = async (id) => {
        console.log(id)
        await trackPromise(
            axios.delete('/api/guests/' + id, {
                headers: {
                    'Authorization': AUTH()
                }
            })
                .then(res => {

                    let temp = this.props.data.filter(e => e._id !== id)

                    this.setState({
                        data: temp
                    })
                    this.props.update(temp)

                    message.success('Xóa thành công');
                })
                .catch(err => {
                    message.error('Xóa thất bại');
                    ApiFailHandler(err.response?.data?.error)
                }))
    }

    TaoKM = async () => {
        if (this.props.listguesttype) {
            let temp = {
                guestTypeId: this.props.listguesttype[0]._id
            }
            await trackPromise(
                axios.post('/api/guests', temp, {
                    headers: {
                        'Authorization': AUTH()
                    }
                })
                    .then(res => {

                        let data = {
                            ...res.data.data,
                            noinfo: true
                        }
                        console.log('data', data)
                        let temp = [...this.state.data, data]

                        this.setState({
                            data: temp
                        })
                        this.props.update(temp)

                        message.success('Tạo thành công');
                    })
                    .catch(err => {
                        message.err('Tạo thất thất bại');
                        ApiFailHandler(err.response?.data?.error)
                    }))
        }
    }

    getSearchData = (data) => {
        this.setState({
            data: data
        })
    }
    componentDidMount() {
        this.setState({
            data: this.props.data,
        })
    }
    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }

    paginate = (pageNumber) => {
        this.setState(
            {
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
            <div>
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={20}>
                        <Search target={["name", "phone", "email"]} multi={true} data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    </Col>
                    <Col span={4}>
                        <Button className="back" style={{ float: "right" }} onClick={() => this.TaoKM()}>Tạo khách mời</Button>
                    </Col>
                </Row>
                <TableData guestTypeId={this.props.guestTypeId} canDelete={this.props.canDelete} listguesttype={this.props.listguesttype} edit={(info) => this.edit(info)} deleteClick={(id) => this.deleteClick(id)} data={this.state.data} />
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

export default guestView;