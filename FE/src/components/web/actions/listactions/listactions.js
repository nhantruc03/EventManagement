import { Button, Col, Form, Input, Modal, Row, Select } from "antd";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import React, { Component } from "react";
import AddAction from "../addactions/addactions";
import { trackPromise } from "react-promise-tracker";
import { AUTH } from "../../../env";
import axios from "axios";
import Search from "../../helper/search";
import ActionColumn from "./actionColumn";
import * as constants from "../../constant/actions";
import checkPermisson from "../../helper/checkPermissions";
import getPermisson from "../../helper/Credentials";
const { Option } = Select;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
class listactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalVisible2: false,
      events: null,
      currentEvent: null,
      currentActionTypes: [],
      currentFaculties: null,
      currentActions: [],
      temp_data: [],
      currentPermissons: [],
    };
  }

  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }
  setModalVisible2(modalVisible2) {
    this.setState({ modalVisible2 });
  }

  onFinish = async (e) => {
    let data = {
      ...e,
      eventId: this.state.currentEvent._id,
    };
    await trackPromise(
      axios
        .post("/api/action-types", data, {
          headers: {
            Authorization: { AUTH }.AUTH,
          },
        })
        .then((res) => {
          this.setState({
            currentActionTypes: [
              ...this.state.currentActionTypes,
              res.data.data,
            ],
          });
          this.form.current.resetFields();
          this.setModalVisible2(false);
        })
        .catch((err) => {
          console.log(err);
        })
    );
  };

  form = React.createRef();
  renderModel2 = () => {
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
          rules={[{ required: true, message: "Cần nhập tên phòng hội thoại" }]}
        >
          <Input placeholder="Tên phòng hội thoại..." />
        </Form.Item>
        <br></br>
        <div className="flex-container-row">
          <Button htmlType="submit" className="flex-row-item-right add">
            Tạo mới
          </Button>
        </div>
      </Form>
    );
  };
  renderModel = () => {
    return (
      <AddAction
        done={(e) => this.doneAddAction(e)}
        event={this.state.currentEvent}
        actionTypes={this.state.currentActionTypes}
        faculties={this.state.currentFaculties}
      />
    );
  };

  doneAddAction = (e) => {
    this.setState({
      currentActions: [...this.state.currentActions, e],
    });
    this.setModalVisible(false);
  };

  async componentDidMount() {
    this._isMounted = true;
    const [events] = await trackPromise(
      Promise.all([
        axios
          .post(
            "/api/events/getAll",
            { isClone: false },
            {
              headers: {
                Authorization: { AUTH }.AUTH,
              },
            }
          )
          .then((res) => res.data.data),
      ])
    );
    if (events !== null) {
      if (this._isMounted) {
        this.setState({
          events: events,
        });
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onchangeEvent = async (value) => {
    let temp = this.state.events.filter((e) => e._id === value);
    this.setState({
      currentEvent: temp[0],
    });

    const [actionTypes, falcuties, actions, permissons] = await trackPromise(
      Promise.all([
        axios
          .post(
            "/api/action-types/getAll",
            { eventId: temp[0]._id },
            {
              headers: {
                Authorization: { AUTH }.AUTH,
              },
            }
          )
          .then((res) => res.data.data),
        axios
          .post(
            "/api/faculties/getAll",
            { eventId: temp[0]._id },
            {
              headers: {
                Authorization: { AUTH }.AUTH,
              },
            }
          )
          .then((res) => res.data.data),
        axios
          .post(
            "/api/actions/getAll",
            { eventId: temp[0]._id },
            {
              headers: {
                Authorization: { AUTH }.AUTH,
              },
            }
          )
          .then((res) => res.data.data),
        getPermisson(temp[0]._id).then((res) => res),
      ])
    );

    if (actionTypes !== null && falcuties !== null && actions !== null) {
      this.setState({
        currentActionTypes: actionTypes,
        currentFaculties: falcuties,
        currentActions: actions,
        temp_data: actions,
        currentPermissons: permissons,
      });
    }
  };

  renderActionsView = (value, keyCol) => {
    let temp_listActions = this.state.currentActions.filter(
      (e) => e.actionTypeId._id === value._id
    );
    return (
      <Col sm={24} xl={6} key={keyCol} style={{ padding: "10px 0" }}>
        <ActionColumn title={value.name} listActions={temp_listActions} />
      </Col>
    );
  };

  renderView = () => {
    if (this.state.currentEvent) {
      return (
        <div className="flex-container-row" style={{ alignItems: "unset" }}>
          <div className="flex-container-row horizontal-container" style={{ width: "100%" }}>
            {this.state.currentActionTypes.map((e, key) => {
              return this.renderActionsView(e, key);
            })}
          </div>
          {checkPermisson(
            this.state.currentPermissons,
            constants.QL_CONGVIEC_PERMISSION
          ) ? (
            <Button
              className="add flex-row-item-right"
              onClick={() => this.setModalVisible2(true)}
            >
              +
            </Button>
          ) : null}
        </div>
      );
    } else {
      return null;
    }
  };

  getSearchData = (data) => {
    this.setState({
      currentActions: data,
    });
  };

  render() {
    if (this.state.events !== null) {
      return (
        <Content style={{ margin: "0 16px" }}>
          <Row style={{ marginLeft: 30, marginRight: 30 }}>
            <div style={{ width: "100%" }} className="flex-container-row">
              <Title id="home-top-header" style={{ marginTop: 15 }} level={2}>
                Công việc
              </Title>
              <div className="flex-row-item-right">
                <div className="flex-container-row">
                  <Search
                    target={["name", "description"]}
                    multi={true}
                    data={this.state.temp_data}
                    getSearchData={(e) => this.getSearchData(e)}
                  />
                  {checkPermisson(
                    this.state.currentPermissons,
                    constants.QL_CONGVIEC_PERMISSION
                  ) ? (
                    <Button
                      disabled={this.state.currentEvent ? false : true}
                      className="add"
                      style={{ marginLeft: "20px" }}
                      onClick={() => this.setModalVisible(true)}
                    >
                      Thêm công việc
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          </Row>
          <Row style={{ marginLeft: 30, marginRight: 30 }}>
            <Col span={24}>
              <div className="flex-container-row action-select-event">
                <Title id="home-top-header" style={{ marginTop: 15 }} level={3}>
                  Sự kiện
                </Title>
                <Select
                  className="flex-row-item-right"
                  showSearch
                  style={{ width: "80%" }}
                  onChange={this.onchangeEvent}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.events.map((e) => (
                    <Option key={e._id}>{e.name}</Option>
                  ))}
                </Select>
              </div>
            </Col>
          </Row>
          <div style={{ padding: "10px 30px" }}>{this.renderView()}</div>

          <Modal
            title="Tạo công việc mới"
            centered
            visible={this.state.modalVisible}
            onOk={() => this.setModalVisible(false)}
            onCancel={() => this.setModalVisible(false)}
            width="40%"
            pagination={false}
            footer={false}
          >
            {this.renderModel()}
          </Modal>
          <Modal
            title="Tạo loại công việc"
            centered
            visible={this.state.modalVisible2}
            onOk={() => this.setModalVisible2(false)}
            onCancel={() => this.setModalVisible2(false)}
            width="30%"
            pagination={false}
            footer={false}
          >
            {this.renderModel2()}
          </Modal>
        </Content>
      );
    } else {
      return null;
    }
  }
}

export default listactions;
