import React, { Component } from 'react';
import TableData from './TableData';
import { Button, Col, Form, Input, message, Modal, Row } from 'antd';
import Search from '../../../helper/search';
import { trackPromise } from 'react-promise-tracker';
import axios from 'axios';
import { AUTH } from '../../../../env'
import Pagination from '../../../helper/Pagination';
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};

class groupView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            modalVisible: false,
            currentPage: 1,
            postsPerPage: 5,
        }
    }

    edit = async (info) => {
        console.log(info)
        await trackPromise(axios.put('/api/groups/' + info._id, info, {
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
            }))

    }
    setModalVisible(modalVisible) {
        this.setState({ modalVisible });
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
                    wrapperCol={{ sm: 24 }}
                    name="name"
                    rules={[{ required: true, message: 'Cần nhập tên phòng hội thoại' }]}
                >
                    <Input placeholder="Tên phòng hội thoại..." />
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
        console.log(this.state.data)
        let data = {
            ...e,
            eventId: this.props.eventId
        }
        console.log(data)
        await trackPromise(
            axios.post('/api/groups/', data, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then(res => {
                    let temp = [...this.state.data, res.data.data]
                    console.log(temp)
                    this.setState({
                        data: temp
                    })
                    this.props.update(temp)

                    message.success('Thêm thành công');
                    this.form.current.resetFields();
                    this.setModalVisible(false)
                })
                .catch(err => {
                    console.log(err)
                    message.error('Thêm thất bại');
                }))
    }

    getSearchData = (data) => {
        this.setState({
            data: data
        })
    }
    deleteClick = async (id) => {
        console.log(id)
        await trackPromise(
            axios.delete('/api/groups/' + id, {
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
                    this.props.update(temp)

                    message.success('Xóa thành công');
                })
                .catch(err => {
                    message.success('Xóa thất bại');
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
                <Row style={{ marginBottom: '20px' }}>
                    <Col span={20}>
                        <Search target="name" data={this.props.data} getSearchData={(e) => this.getSearchData(e)} />
                    </Col>
                    <Col span={4}>
                        <Button className="add" style={{ float: "right" }} onClick={() => this.setModalVisible(true)}>Tạo phòng hội thoại</Button>
                    </Col>
                </Row>
                <TableData deleteClick={(id) => this.deleteClick(id)} canDelete={this.props.canDelete} listFaculty={this.props.listFaculty} listRole={this.props.listRole} edit={(info) => this.edit(info)} data={this.getCurData(this.state.data)} />
                {this.getlistpage(this.state.data) > 1 ?
                    <Pagination
                        totalPosts={this.getlistpage(this.state.data)}
                        paginate={(e) => this.paginate(e)}
                        PageSize={this.state.postsPerPage}
                    /> :
                    null
                }
                <Modal
                    title="Tạo phòng hội thoại"
                    centered
                    visible={this.state.modalVisible}
                    onOk={() => this.setModalVisible(false)}
                    onCancel={() => this.setModalVisible(false)}
                    width="30%"
                    pagination={false}
                    footer={false}
                >
                    {this.renderModel()}
                </Modal>
            </div>

        );
    }
}

export default groupView;