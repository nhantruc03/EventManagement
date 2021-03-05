import { Col, Row } from 'antd';
import React, { Component } from 'react';
import Search from 'antd/lib/input/Search';
class ss extends Component {
    onChange = (e) => {
        var ketqua = [];
        if (this.props.data != null) {
            this.props.data.forEach((item) => {
                if (this.props.multi === true) {
                    this.props.target.every(x => {
                        if (item[x].toString().toLowerCase().indexOf(e.target.value) !== -1) {
                            console.log(item)
                            ketqua.push(item);
                            return false;
                        }
                        return true;
                    })
                } else {
                    if (this.props.targetParent == null) {
                        if (item[this.props.target].toString().toLowerCase().indexOf(e.target.value) !== -1) {
                            ketqua.push(item);
                        }
                    }
                    else {
                        if (item[this.props.targetParent][this.props.target].toString().toLowerCase().indexOf(e.target.value) !== -1) {
                            ketqua.push(item);
                        }
                    }
                }

            })
        }
        this.props.getSearchData(ketqua)
    }
    render() {
        return (
            <Row >
                <Col >
                    <Search placeholder="Tìm kiếm" style={{ width: '100%', marginBottom: 15, borderTopLeftRadius: '10px' }} onChange={(e) => this.onChange(e)}></Search>

                </Col>

            </Row>
        );
    }
}

export default ss;