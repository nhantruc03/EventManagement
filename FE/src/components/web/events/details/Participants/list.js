import { Button, Table } from 'antd';
import React, { Component } from 'react';
import Search from '../../../helper/search';
class list extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columnsTable1: [
                { title: 'MSSV', dataIndex: 'mssv', key: 'mssv' },
                { title: 'Tên', dataIndex: 'name', key: 'name' },
                { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
                { title: 'Email', dataIndex: 'email', key: 'email' },
            ],
            SearchData1: [],
            postsPerPage: 10
        }
    }

    UNSAFE_componentWillUpdate(e) {
        if (e.list !== this.props.list) {
            this.setState({
                SearchData1: e.list
            })
        }
    }

    componentDidMount() {
        this.setState({
            SearchData1: this.props.list,
        })
    }

    getSearchData1 = (data) => {
        this.setState({
            SearchData1: data
        })
    }

    getlistpage = (SearchData) => {
        return Math.ceil(SearchData.length / this.state.postsPerPage);
    }
    render() {
        return (
            <div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Search multi={true} target={["name", "phone", "email", 'mssv']} data={this.props.list} getSearchData={(e) => this.getSearchData1(e)} />
                    <input
                        // ref={this.selectedFile}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        ref={input => this.selectedFile = input}
                        type="file"
                        onChange={e => {
                            const file = e.target.files[0];
                            this.props.uploadExcelFile(file)
                            this.selectedFile.value = ""
                        }}
                        style={{ display: 'none' }}
                    />

                    {this.props.canEdit ? <Button className="add flex-row-item-right" onClick={() => this.selectedFile.click()} >Tải lên file</Button> : null}
                </div>
                <Table
                    rowKey={"_id"}
                    pagination={this.getlistpage(this.state.SearchData1) > 1 ? { pageSize: this.state.postsPerPage } : false}
                    columns={this.state.columnsTable1}
                    dataSource={this.state.SearchData1}
                // pagination={false}
                />
            </div>
        );
    }
}

export default list;