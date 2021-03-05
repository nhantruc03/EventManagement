import React, { Component } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { BellOutlined } from '@ant-design/icons';
import { Badge, Button, Col, Dropdown, Form, Layout, Menu, Modal, Row } from 'antd';
import Title from 'antd/lib/typography/Title';
// import { connect } from 'react-redux';
const { Header } = Layout;

const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
};
class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal2Visible: false,
            model: { dondathang: [] },
            menu: (
                <Menu>
                    <Menu.Item style={{ backgroundColor: '#FFF3C4' }} onClick={() => { this.setModal2Visible(true, 1) }}>
                        <p>03/12/2020</p>
                        <p>Nhận hàng đơn hàng <span style={{ fontWeight: 'bold', fontSize: 20 }}>#1</span></p>
                    </Menu.Item>
                    <Menu.Item style={{ backgroundColor: '#B2F1BD' }} onClick={() => { this.setModal2Visible(true, 1) }}>
                        <p>03/12/2020</p>
                        <p>Thanh toán đơn hàng <span style={{ fontWeight: 'bold', fontSize: 20 }}>#1</span></p>
                    </Menu.Item>
                    <Menu.Item style={{ backgroundColor: '#FFF3C4' }} onClick={() => { this.setModal2Visible(true, 2) }}>
                        <p>12/3/2020</p>
                        <p>Nhận hàng đơn hàng <span style={{ fontWeight: 'bold', fontSize: 20 }}>#2</span></p>
                    </Menu.Item>
                    <Menu.Item style={{ backgroundColor: '#B2F1BD' }} onClick={() => { this.setModal2Visible(true, 2) }}>
                        <p>12/25/2020</p>
                        <p>Nhận hàng đơn hàng <span style={{ fontWeight: 'bold', fontSize: 20 }}>#2</span></p>
                    </Menu.Item>
                </Menu>
            ),
        }
    }
    setModal2Visible(modal2Visible, val) {
        console.log(val)
        this.setState({ modal2Visible });
        if (val !== undefined) {
            var temp = this.props.data.find(e => e.ID === val)
            console.log(temp)
            this.setState({
                model: temp
            })
        }
    }
    formRef = React.createRef();
    renderModel = (val) => {
        console.log(this.state.model)
        console.log(val)
        return (
            <Form
                ref={this.formRef}
                name="validate_other"
                {...formItemLayout}
                onFinish={(e) => this.onFinish(e)}
                layout="vertical"
                defaultValue={val}
            >

                <Row>
                    <Col span={24}>
                        <Title>Thông tin đơn mua hàng</Title>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Mã đơn hàng">
                            <p className="special">{val.ID}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Người phụ trách">
                            <p className="special">{val.nguoiphutrach}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Tên hàng">
                            <p className="special">{val.tensanpham}</p>
                        </Form.Item>
                    </Col>

                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Số lượng" >
                            <p className="special">{val.soluong}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Đơn giá" >
                            <p className="special">{val.dongia}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Thành tiền" >
                            <p className="special">{val.tongtien}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Ngày nhận hàng" >
                            <p className="special">{val.ngaynhanhang}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Thanh toán" >
                            <p className="special">{val.ngaythanhtoan}</p>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <Title>Thông tin nhà cung cấp</Title>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Nhà cung cấp">
                            <p className="special">{val.tennhacungcap}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Email">
                            <p className="special">{val.emailncc}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Số điện thoại">
                            <p className="special">{val.sdtncc}</p>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item wrapperCol={{ sm: 24 }} label="Người đại diện">
                            <p className="special">{val.nguoidaidien}</p>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
    render() {
        return (
            <Header className="site-layout-background" style={{ padding: 15 }} >

                <Avatar className="my-2" style={{ float: 'right', padding: 'auto', marginRight: 20 }} src='./user.png' />

                <div style={{ float: 'right', marginBottom: 20, marginRight: 20, display: 'inline-grid' }}>
                    <Dropdown overlayClassName='dropdown' overlay={this.state.menu} placement="bottomCenter" arrow>
                        <Badge count={4}>
                            <Button style={{ border: 'none' }}><BellOutlined /></Button>
                        </Badge>
                    </Dropdown>
                </div>
                <Modal
                    title='Chi tiết đơn mua hàng'
                    centered
                    visible={this.state.modal2Visible}
                    onOk={() => this.setModal2Visible(false)}
                    onCancel={() => this.setModal2Visible(false)}
                    width='30%'
                    footer={false}
                >
                    {/* {this.renderModel(this.state.model)} */}
                </Modal>

            </Header>
        );
    }
}

// const mapStateToProps = state => {
//     return {
//         data: state.DONMUAHANG
//     }
// }

// export default connect(mapStateToProps, null)(header);
export default header;