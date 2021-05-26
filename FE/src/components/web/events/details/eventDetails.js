import React, { Component } from "react";
import { Content } from "antd/lib/layout/layout";
import Title from "antd/lib/typography/Title";
import { AUTH } from "../../../env"
import ListScripts from '../../eventScripts/list'
import {
  Button,
  Row,
  Col,
  Modal,
  Tabs,
  Breadcrumb,
  Avatar,
  Tooltip,
  Tag,
  Image,
  Popconfirm,
  message,
} from "antd";
import {
  InsertRowAboveOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { trackPromise } from "react-promise-tracker";
import axios from "axios";
import ListAvailUser from './forAvailUser/listAvailUser'
import EventAssign from './EventAssign/EventAssign'
import ListGuest from './forGuest/listGuest'
import GuestView from "./forGuest/guestView";
// import ListParticipants from './Participants/list'
import ParticipantsView from "./Participants/View";
import ListParticipants from "../editevent/Participants/participantsView";
import { Link, Redirect } from "react-router-dom";
import moment from 'moment';
import ChatRoom from '../../chat/ChatRoom'
import * as constants from "../../constant/actions"
import getPermission from "../../helper/Credentials"
import checkPermisson from "../../helper/checkPermissions"
import ApiFailHandler from '../../helper/ApiFailHandler'
import * as XLSX from 'xlsx'
const { TabPane } = Tabs;

class eventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal2Visible: false,
      modal2Visible2: false,
      modalParticipantsVisible: false,
      listguest: [],
      listguesttype: [],
      listgroups: [],
      data: null,
      status: '',
      listEventAssign: [],
      listRole: [],
      listFaculty: [],
      listGroups: [],
      currentUser: JSON.parse(localStorage.getItem('login')),
      currentPermissions: [],
      doneDelete: false,
      currentUserInEvent: {},
      lissParticipants: [],
    }
  }

  updateguest = (e) => {
    this.setState({
      listguest: e
    })

  }

  async componentDidMount() {
    this._isMounted = true;
    const [event, guestTypes, listEventAssign, faculties, roles, groups, permissons, lissParticipants] = await trackPromise(Promise.all([
      axios.get('/api/events/' + this.props.match.params.id, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
      axios.post('/api/guest-types/getAll', { eventId: this.props.match.params.id }, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
      axios.post('/api/event-assign/getAll', { eventId: this.props.match.params.id }, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
      axios.post('/api/faculties/getAll', {}, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
      axios.post('/api/roles/getAll', {}, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
      axios.post('/api/groups/getAll', { eventId: this.props.match.params.id }, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
      getPermission(this.props.match.params.id).then(res => res),
      axios.post('/api/participants/getAll', { eventId: this.props.match.params.id }, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then((res) =>
          res.data.data
        )
        .catch(err => {
          ApiFailHandler(err.response?.data?.error)
        }),
    ]));


    let guests = null
    if (guestTypes !== undefined) {

      let listguesttype = guestTypes.reduce((list, e) => { list.push(e._id); return list }, []);

      const temp = await trackPromise(
        axios.post('/api/guests/getAll', { listguesttype: listguesttype }, {
          headers: {
            'Authorization': { AUTH }.AUTH
          }
        })
          .then((res) =>
            res.data.data
          )
          .catch(err => {
            ApiFailHandler(err.response?.data?.error)
          })
      )
      guests = temp;
    }

    if (event !== undefined) {
      if (this._isMounted) {

        // let status = '';
        // let today = new Date().setHours(0, 0, 0, 0)
        // if (new Date(event.startDate).setHours(0, 0, 0, 0) > today) {
        //   status = 'Sắp diễn ra';
        // } else if (new Date(event.startDate).setHours(0, 0, 0, 0) < today) {
        //   status = 'Đã diễn ra';
        // } else {
        //   status = 'Đang diễn ra';
        // }

        // let permissions = await getPermission(this.props.match.params.id)
        // console.log(permissons)
        let currentUserInEvent = listEventAssign.filter((e) => {
          return e.userId._id === this.state.currentUser.id
        })

        this.setState({
          data: event,
          listEventAssign: listEventAssign,
          listRole: roles,
          listFaculty: faculties,
          // status: status,
          listGroups: groups,
          currentPermissions: permissons,
          currentUserInEvent: currentUserInEvent[0],
          listParticipants: lissParticipants
        })
        if (guestTypes !== undefined) {
          this.setState({
            listguesttype: guestTypes
          })

          if (guests !== null) {
            this.setState({
              listguest: guests
            })
          }
        }
      }
    }
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  goBack = (e) => {
    e.preventDefault();
    this.props.history.goBack();
  };

  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }
  setModal2Visible2(modal2Visible2) {
    this.setState({ modal2Visible2 });
  }

  setModalParticipantsVisible(modalParticipantsVisible) {
    this.setState({ modalParticipantsVisible });
  }

  renderModalParticipants = () => {
    return (
      // <ListParticipants canEdit={checkPermisson(this.state.currentPermissions, constants.QL_NGUOITHAMGIA_PERMISSION)} list={this.state.listParticipants} uploadExcelFile={this.uploadExcelFile} />
      <ListParticipants canEdit={checkPermisson(this.state.currentPermissions, constants.QL_NGUOITHAMGIA_PERMISSION)} canDelete={true} eventId={this.props.match.params.id} data={this.state.listParticipants} uploadExcelFile={this.uploadExcelFile} update={this.updatelistparticipants} />
    )
  }
  updatelistparticipants = (e) => {
    this.setState({
      listParticipants: e
    })
  }

  renderguest = () => this.state.listguesttype.map((e, key) =>
    <TabPane tab={e.name} key={key}><GuestView type={e._id} list={this.state.listguest} /></TabPane>
  )

  renderParticipants = () => {
    return (
      <ParticipantsView list={this.state.listParticipants} />
    )
  }

  renderGroups = () => this.state.listGroups.map((e, key) =>
    <TabPane tab={e.name} key={key}><ChatRoom videocall={true} roomId={e._id} /></TabPane>
  )

  updateEventAssign = (e) => {
    this.setState({
      listEventAssign: e
    })
  }

  renderModel = () => {
    return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="Danh sách ban tổ chức" key="1"><ListAvailUser listusers={this.state.data.availUser} /></TabPane>
        {checkPermisson(this.state.currentPermissions, constants.QL_BANTOCHUC_PERMISSION) ?
          <TabPane tab="Phân nhóm" key="2">
            <EventAssign
              noBigAction={true}
              update={this.updateEventAssign}
              eventId={this.props.match.params.id}
              listRole={this.state.listRole}
              listFaculty={this.state.listFaculty}
              data={this.state.listEventAssign} />
          </TabPane>
          : null}
      </Tabs>

    );
  };

  renderModel2 = () => {
    return (
      <ListGuest listguesttype={this.state.listguesttype} listguest={this.state.listguest} updateGuest={(e) => { this.updateguest(e) }} />
    )
  }

  renderAvailUser = () => {
    return (
      this.state.data.availUser.map((value, key) => {
        return (
          <Tooltip title={value.name} placement="top" key={key}>
            <Avatar src={`/api/images/${value.photoUrl}`} />
          </Tooltip >
        )
      })
    )
  }

  deleteEvent = async () => {
    const result = await trackPromise(axios.delete(`/api/events/${this.props.match.params.id}`, {
      headers: {
        'Authorization': { AUTH }.AUTH
      }
    })
      .then(res => {
        message.success('Xóa sự kiện thành công')
        return res.data.data
      })
      .catch(err => {
        message.error('Xóa sự kiện thất bại')
        ApiFailHandler(err.response?.data?.error)
      })
    )
    if (result) {
      this.setState({
        doneDelete: true
      })
    }
  }

  uploadExcelFile = (file) => {
    const promise = new Promise((resolve, reject) => {

      const fileReader = new FileReader();

      fileReader.readAsArrayBuffer(file)
      fileReader.onload = (e) => {
        const bufferArray = e.target.result

        const wb = XLSX.read(bufferArray, { type: 'buffer' });

        const wsname = wb.SheetNames[0]

        const ws = wb.Sheets[wsname]

        const data = XLSX.utils.sheet_to_json(ws)

        resolve(data)
      }
      fileReader.onerror = (err) => {
        reject(err)
      }
    })

    promise.then((result) => {
      result.forEach(e => {
        e.eventId = this.props.match.params.id
      })
      this.CreateParticipants(result)
    })
  }

  CreateParticipants = async (data) => {
    let temp = {
      data,
      eventId: this.props.match.params.id
    }

    await trackPromise(
      axios.post('/api/participants', temp, {
        headers: {
          'Authorization': { AUTH }.AUTH
        }
      })
        .then(res => {
          let data = res.data.data

          this.setState({
            listParticipants: [...this.state.listParticipants, ...data]
          })


          message.success('Thêm thành công')
        })
        .catch(err => {
          message.error('Thêm thất bại')
        }))

  }

  renderCurrentUserInEvent = () => {
    return (
      // <Row>
      //   <Col>
      //     <div className="flex-container-row">
      //       <img className="event-user-avartar" alt="avatar" src={`/api/images/${this.state.currentUserInEvent.userId.photoUrl}`}></img>
      //       <div>
      //         <Title style={{ color: '#264653', margin: 'unset', fontSize: 20 }} level={3}>{this.state.currentUserInEvent.userId.name}</Title>
      //         <p style={{ color: '#AAB0B6' }}>{this.state.currentUserInEvent.userId.phone}</p>
      //       </div>
      //     </div>
      //   </Col>
      //   <Col>
      //     <Row>
      //       <Title className="event-detail-title" level={4}>Ban</Title>
      //     </Row>
      //     <Row>

      //     </Row>
      //   </Col>
      // </Row>
      <div className="flex-container-row" style={{ width: '100%' }}>
        <img className="event-user-avartar" alt="avatar" src={`/api/images/${this.state.currentUserInEvent.userId.photoUrl}`}></img>
        <div>
          <Title style={{ color: '#264653', margin: 'unset', fontSize: 20 }} level={3}>{this.state.currentUserInEvent.userId.name}</Title>
          <p style={{ color: '#AAB0B6' }}>{this.state.currentUserInEvent.userId.phone}</p>
        </div>
        <div className="flex-row-item-right" style={{ textAlign: 'right' }}>
          <Title style={{ color: '#AAB0B6', margin: 'unset' }} level={4}>Ban</Title>
          {/* <p>{this.state.currentUserInEvent.facultyId.name}</p> */}
          <Title style={{ color: '#264653', margin: 'unset' }} level={4}>{this.state.currentUserInEvent.facultyId?.name}</Title>
          <Title style={{ color: '#AAB0B6', margin: 'unset' }} level={4}>Vị trí</Title>
          {/* <p>{this.state.currentUserInEvent.roleId.name}</p> */}
          <Title style={{ color: '#264653', margin: 'unset' }} level={4}>{this.state.currentUserInEvent.roleId?.name}</Title>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.doneDelete) {
      return (
        <Redirect to="/events" />
      )
    } else {
      if (this.state.data) {
        return (
          <Content >
            < Row style={{ marginTop: 15, marginLeft: 30, marginRight: 30 }}>
              <div className="flex-container-row" style={{ width: '100%', padding: '0 10px' }}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item >
                    <Link to="/events">Sự kiện</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    Chi tiết
                  </Breadcrumb.Item>
                </Breadcrumb>
                {checkPermisson(this.state.currentPermissions, constants.QL_SUKIEN_PERMISSION) ?
                  <div className="flex-row-item-right">
                    <Popconfirm
                      title="Bạn có chắc muốn xóa chứ?"
                      onConfirm={this.deleteEvent}
                      okText="Đồng ý"
                      cancelText="Hủy"
                    >
                      <Button className="delete">Xóa</Button>
                    </Popconfirm>
                    <Button style={{ marginLeft: 10 }} onClick={() => { this.props.history.push(`/editevent/${this.props.match.params.id}`) }} className="add">Chỉnh sửa</Button>
                  </div>
                  : null
                }
              </div>


            </Row >

            <div className="site-layout-background-main">
              <Row style={{ height: '95%' }}>
                <Col sm={24} xl={7} className="event-detail">
                  <Title className="event-detail-title" level={3}>Theo dõi sự kiện</Title>

                  <div className="flex-container-row" style={{ marginTop: '10px' }}>
                    <Title level={4}>Khách mời</Title>
                    {checkPermisson(this.state.currentPermissions, constants.QL_KHACHMOI_PERMISSION) ?
                      <Button className="flex-row-item-right no-border" onClick={() => this.setModal2Visible2(true)}>Xem tất cả</Button>
                      : null}
                  </div>

                  <Tabs defaultActiveKey="1" >
                    {this.renderguest()}
                  </Tabs>

                  <div className="flex-container-row" style={{ marginBottom: 10, marginTop: 10 }}>
                    {/* <Title className="event-detail-title" level={3}>Kịch bản</Title> */}
                    <Title level={4}>Kịch bản</Title>
                    {checkPermisson(this.state.currentPermissions, constants.QL_KICHBAN_PERMISSION) ?
                      <Button className="flex-row-item-right add" ><Link to={`/addscripts/${this.props.match.params.id}`}>Thêm</Link></Button>
                      : null}
                  </div>
                  <ListScripts currentPermissions={this.state.currentPermissions} eventId={this.props.match.params.id} />

                  <div className="flex-container-row" style={{ marginBottom: 10, marginTop: 10 }}>
                    <Title level={4}>Người tham gia</Title>
                    {checkPermisson(this.state.currentPermissions, constants.QL_KICHBAN_PERMISSION) ?
                      <Button className="flex-row-item-right no-border" onClick={() => this.setModalParticipantsVisible(true)}>Xem tất cả</Button>
                      : null}
                  </div>
                  {this.renderParticipants()}
                  {/* <ListScripts currentPermissions={this.state.currentPermissions} eventId={this.props.match.params.id} /> */}
                </Col>
                <Col sm={24} xl={9} className="event-detail">
                  <div className="vl"></div>

                  <Title className="event-detail-title" level={3}>Thông tin sự kiện</Title>

                  <Title style={{ color: '#264653', margin: 'unset' }} level={1}>{this.state.data.name}</Title>
                  <Title style={{ margin: 'unset' }} level={4}>Mô tả</Title>
                  {this.state.data.description}

                  <div className="event-detail-time-date-address">
                    <div className="flex-container-row" style={{ justifyContent: 'space-between' }}>
                      <div>
                        <ClockCircleOutlined className="event-detail" />  {moment(this.state.data.startTime).utcOffset(0).format('HH:mm')}
                      </div>
                      <div>
                        <InsertRowAboveOutlined /> {moment(this.state.data.startDate).utcOffset(0).format('DD/MM/YYYY')}
                      </div>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <EnvironmentOutlined className="event-detail" />  {this.state.data.address}
                    </div>
                  </div>

                  <Title level={4}>Hình thức</Title>
                  {this.state.data.eventTypeId.name}

                  <Title level={4}>Ban tổ chức</Title>
                  <div className="event-detail-user-container">
                    <Avatar.Group
                      maxCount={2}
                      maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
                    >
                      {this.renderAvailUser()}
                    </Avatar.Group>
                    <Button className="event-detail-user" onClick={() => this.setModal2Visible(true)}>Xem</Button>
                  </div>

                  <Title level={4}>Tags</Title>
                  {this.state.data.tagId.map((value, key) => <Tag style={{ width: 'auto', background: value.background, color: value.color }} key={key}>{value.name}</Tag>)}

                  <div style={{ marginTop: 10 }}>
                    <Title level={4}>Poster</Title>
                    <Image style={{ maxWidth: '150px' }} src={`/api/images/${this.state.data.posterUrl}`} alt="poster"></Image>
                  </div>
                </Col>
                <Col sm={24} xl={8} className="event-detail">
                  <div className="vl"></div>
                  <Title className="event-detail-title" level={3}>Thông tin thành viên</Title>
                  {this.renderCurrentUserInEvent()}


                  <Title className="event-detail-title" level={3}>Phòng hội thoại</Title>
                  <Tabs className="chat-tabs" defaultActiveKey="1" >
                    {this.renderGroups()}
                  </Tabs>
                </Col>
              </Row>
            </div>


            <Modal
              title="Ban tổ chức"
              centered
              visible={this.state.modal2Visible}
              onOk={() => this.setModal2Visible(false)}
              onCancel={() => this.setModal2Visible(false)}
              width="80%"
              pagination={false}
              footer={false}
            >
              {this.renderModel(this.state.listusers)}
            </Modal>

            <Modal
              title="Cập nhật khách mời"
              centered
              visible={this.state.modal2Visible2}
              onOk={() => this.setModal2Visible2(false)}
              onCancel={() => this.setModal2Visible2(false)}
              width="70%"
              pagination={false}
              footer={false}
            >
              {this.renderModel2(this.state.listusers)}
            </Modal>
            <Modal
              title="Danh sách người tham gia"
              centered
              visible={this.state.modalParticipantsVisible}
              onOk={() => this.setModalParticipantsVisible(false)}
              onCancel={() => this.setModalParticipantsVisible(false)}
              width="70%"
              pagination={false}
              footer={false}
            >
              {this.renderModalParticipants(this.state.listusers)}
            </Modal>
          </Content >
        );
      } else {
        return null
      }
    }

  }
}

export default eventDetails;