import Axios from 'axios';
import React, { Component } from 'react';
import Select from 'react-select';
import { AUTH } from '../env'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';
var Genders = [
    { value: 'nam', label: 'Nam' },
    { value: 'nữ', label: 'Nữ' }
]
class editusers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            phone: '',
            roleId: '',
            username: '',
            password: '',
            email: '',
            gender: '',
            birthday: new Date(),
            isDone: false,
            list_roles: []
        }
    }

    handleDayChange = (selectedDay) => {
        this.setState({
            birthday: selectedDay
        })
    }

    onSelectRole = (e) => {
        this.setState({
            roleId: e.value
        })
    }
    onSelectGender = (e) => {
        this.setState({
            gender: e.value
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        var data = {
            name: this.state.name,
            address: this.state.address,
            phone: this.state.phone,
            username: this.state.username,
            birthday: this.state.birthday,
            gender: this.state.gender,
            email: this.state.email,
            roleId: this.state.roleId
        };
        await trackPromise(Axios.put('/api/users/' + this.props.match.params.id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                Message('Sửa thành công', true, this.props);
            })
            .catch(err => {
                Message('Sửa thất bại', false);
            }))
    }

    onDone = () => {
        this.setState({
            isDone: !this.state.isDone
        })
    }

    async componentDidMount() {
        this.setState({
            isLoad: true
        })
        this.setState({
            isLoad: false
        })

        this._isMounted = true;
        const [user, listRoles] = await trackPromise(Promise.all([
            Axios.get('/api/users/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
            Axios.post('/api/roles/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));


        if (user !== null && listRoles !== null) {
            if (this._isMounted) {
                var day = new Date(user.birthday);
                this.setState({
                    name: user.name,
                    address: user.address,
                    phone: user.phone,
                    username: user.username,
                    password: user.password,
                    roleId: user.roleId,
                    birthday: day,
                    gender: user.gender,
                    email: user.email
                })

                var temp = [];
                listRoles.forEach(e => {
                    var o = {
                        value: e._id,
                        label: e.name
                    };
                    temp.push(o);
                })
                this.setState({
                    list_roles: temp
                })
            }
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    goBack = () => {
        this.props.history.goBack();
    }
    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="site-layout-background-main">
                    <div className="row">
                        <div className="col-9">
                            <div onClick={() => this.goBack()} className='subject'> {`<- Quay lại`}</div>
                        </div>
                        <div className="col" style={{ paddingRight: '126px' }}>
                            {/* <button onClick={() => this.onDone()} className="btn btn-warning">Quay về</button> */}
                            <button type="submit" className="btn btn-createnew">Sửa</button>
                        </div>
                    </div>

                    <div className="container-fluid mt-3">
                        <div className="row">
                            <div className="col-12">
                                <div className="section">
                                    <li className="fas fa-user"></li> Thông tin
                                    </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="username"  >Tài khoản</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="username" placeholder="Tài khoản" value={this.state.username} required={true} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="name"  >Tên</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="name" placeholder="Tên người dùng" value={this.state.name} required={true} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="phone"  >Điện thoại</label>
                                        <input onChange={(e) => this.onChange(e)} type="number" className="form-control" name="phone" placeholder="Eg. 0919385172" value={this.state.phone} required={true} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="address">Địa chỉ</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="address" placeholder="Eg. 37/10BIS" value={this.state.address} required={true} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-7">
                                        {this.state.birthday && <label htmlFor="birthday">Ngày: {this.state.birthday.toLocaleDateString()}</label>}
                                        {!this.state.birthday && <label htmlFor="birthday">Ngày</label>}
                                        <DayPickerInput
                                            onDayChange={this.handleDayChange}
                                            value={this.state.birthday}
                                            dayPickerProps={{
                                                selectedDays: this.state.birthday
                                            }}
                                        />
                                    </div>
                                    <div className="col-5">
                                        <label htmlFor="gender"  >Giới tính</label>
                                        <Select
                                            placeholder="Chọn giới tính ..."
                                            onChange={(e) => this.onSelectGender(e)}
                                            value={Genders.filter(({ value }) => value === this.state.gender)}
                                            options={Genders}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="email"  >Email</label>
                                        <input onChange={(e) => this.onChange(e)} type="email" className="form-control" name="email" placeholder="Eg. abc**@gmail.com" value={this.state.email} required={true} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="roleIdId"  >Vai trò</label>
                                        <Select
                                            placeholder="Chọn quyền ..."
                                            onChange={(e) => this.onSelectRole(e)}
                                            value={this.state.list_roles.filter(({ value }) => value === this.state.roleId)}
                                            options={this.state.list_roles}
                                        />
                                    </div>
                                </div>
                                <hr></hr>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default editusers;