import React, { Component } from 'react';
import TableData from './TableData';
import { Button, Form, Input, InputNumber, message, Modal } from 'antd';
import Search from '../../../helper/search';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../../env'
import Pagination from '../../../helper/Pagination';
import ApiFailHandler from '../../../helper/ApiFailHandler'
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class guestTypeView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            onEditUser: false,
            modalVisible: false,
            currentPage: 1,
            postsPerPage: 5,
        }
    }

    edit = async (info) => {
        console.log(info)
        await trackPromise(axios.put('/api/guest-types/' + info._id, info, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                let temp_data = this.props.data;
                temp_data.forEach((value) => {
                    if (value._id === info._id) {
                        value.name = info.name;
                    }
                });
                this.props.update(temp_data);
                message.success('Sửa thành công');

            })
            .catch(err => {
                message.error('Sửa thất bại');
                ApiFailHandler(err.response?.data?.error)
            }))

    }
    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
    }

    UNSAFE_componentWillUpdate(e) {
        if (e.data !== this.props.data) {
            this.setState({
                data: e.data
            })
        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
        })
    }
    form = React.createRef();
    renderModel = () => {
        return (
            <Form
                ref={this.form}
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
            >
                <Form.Item
                    label="Mã số sinh viên"
                    wrapperCol={{ sm: 24 }}
                    name="mssv"
                >
                    <Input placeholder="Mã số sinh viên..." />
                </Form.Item>
                <Form.Item
                    label="Tên"
                    wrapperCol={{ sm: 24 }}
                    name="name"
                >
                    <Input placeholder="Tên người tham gia..." />
                </Form.Item>
                <Form.Item
                    label="Số điện thoại"
                    wrapperCol={{ sm: 24 }}
                    name="phone"
                    rules={[{ type: 'number', message: 'Số điện thoại phải là số' }]}
                >
                    <InputNumber style={{ width: '100%' }} placeholder="Số điện thoại người tham gia..." />
                </Form.Item>
                <Form.Item
                    label="Email"
                    wrapperCol={{ sm: 24 }}
                    name="email"
                    rules={[{ type: 'email', message: 'Email phải có ký tự @' }]}
                >
                    <Input placeholder="Email người tham gia..." />
                </Form.Item>
                <br></br>
                <div className="flex-container-row">
                    <Button htmlType="submit" className="flex-row-item-right add" >
                        Tạo mới
                    </Button>
                </div>
            </Form>
        )
    }

    onFinish = async (e) => {
        let temp = {
            ...e,
            eventId: this.props.eventId
        }
        let data = {
            data: [temp],
            eventId: this.props.eventId
        }
        await trackPromise(
            axios.post('/api/participants/', data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    let temp = [...this.state.data, ...res.data.data]

                    this.setState({
                        data: temp
                    })
                    this.props.update(temp)

                    message.success('Thêm thành công');
                    this.form.current.resetFields();
                    this.setModalVisible(false)
                })
                .catch(err => {
                    message.error('Thêm thất bại');
                    ApiFailHandler(err.response?.data?.error)
                }))
    }

    getSearchData = (data) => {
        this.setState({
            data: data
        })
    }
    deleteClick = async (id) => {

        await trackPromise(
            axios.delete('/api/participants/' + id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {

                    let temp = this.props.data.filter(e => e._id !== res.data.data._id)

                    this.setState({
                        data: temp
                    })
                    this.props.update(temp)

                    message.success('Xóa thành công');
                })
                .catch(err => {
                    message.success('Xóa thất bại');
                    ApiFailHandler(err.response?.data?.error)
                }))
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
            <div >
                <div className="flex-container-row" style={{ marginBottom: '20px' }}>
                    <Search multi={true} target={["name", "phone", "email", "mssv"]} data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    {this.props.canEdit ?
                        <>
                            <Button className="add flex-row-item-right" style={{ marginRight: '10px' }} onClick={() => this.setModalVisible(true)}>Thêm người tham gia</Button>
                            <input
                                // ref={this.selectedFile}
                                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                ref={input => this.selectedFile = input}
                                type="file"
                                onChange={e => {
                                    const file = e.target.files[0];
                                    this.props.uploadExcelFile(file)
                                    // console.log(tho)
                                    this.selectedFile.value = ""
                                }}
                                style={{ display: 'none' }}
                            />
                            <Button className="add" onClick={() => this.selectedFile.click()} >Tải lên file</Button>
                        </>
                        : null}
                </div>

                <TableData canEdit={this.props.canEdit} deleteClick={(id) => this.deleteClick(id)} canDelete={this.props.canDelete} edit={(info) => this.edit(info)} data={this.getCurData(this.state.data)} />
                {this.getlistpage(this.state.data) > 1 ?
                    <Pagination
                        totalPosts={this.state.data.length}
                        paginate={(e) => this.paginate(e)}
                        PageSize={this.state.postsPerPage}
                    /> :
                    null
                }
                <Modal
                    title="Tạo thông tin người tham gia"
                    centered
                    visible={this.state.modalVisible}
                    onOk={() => this.setModalVisible(false)}
                    onCancel={() => this.setModalVisible(false)}
                    width="50%"
                    pagination={false}
                    footer={false}
                >
                    {this.renderModel()}
                </Modal>
            </div>

        );
    }
}

export default guestTypeView;