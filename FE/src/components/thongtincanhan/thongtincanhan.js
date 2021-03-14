import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../env'
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';
// var Roles = [
//     { value: 'admin', label: 'Quản trị viên' },
//     { value: 'doctor', label: 'Bác sĩ' },
//     { value: 'pharmacist', label: 'Dược sĩ' },
//     { value: 'staff', label: 'Nhân viên' }
// ];

// var Genders = [
//     { value: 'male', label: 'Nam' },
//     { value: 'female', label: 'Nữ' }
// ]
class thongtincanhan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            phoneNumber: '',
            role: '',
            username: '',
            password: '',
            list_faculties: [],
            list_departments: [],
            departmentId: '',
            facultyId: '',
            email: '',
            gender: '',
            birthday: new Date(),
            isDone: false
        }
    }

    handleDayChange = (selectedDay) => {
        this.setState({
            birthday: selectedDay
        })
    }

    onSelectRole = (e) => {
        this.setState({
            role: e.value
        })
    }
    onSelectGender = (e) => {
        this.setState({
            gender: e.value
        })
    }

    onSelectDepartment = (e) => {
        this.setState({
            departmentId: e.value
        })
    }

    onSelectFaculty = (e) => {
        this.setState({
            facultyId: e.value
        })
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async (e) => {
        e.preventDefault();
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);
        var data = {
            name: this.state.name,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            username: this.state.username,
            password: this.state.password,
            role: this.state.role,
            departmentId: this.state.departmentId,
            facultyId: this.state.facultyId,
            birthday: this.state.birthday,
            gender: this.state.gender,
            email: this.state.email
        };
        await trackPromise(Axios.put('/api/users/' + obj.id, data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                Message('Sửa thành công', true,this.props); 
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
        const login = localStorage.getItem('login');
        const obj = JSON.parse(login);

        this._isMounted = true;
        const [user] = await trackPromise(Promise.all([
            Axios.get('/api/users/' + obj.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                )
        ]));


        if (user !== null) {
            if (this._isMounted) {
                var day = new Date(user.birthday);
                this.setState({
                    name: user.name,
                    address: user.address,
                    phoneNumber: user.phoneNumber,
                    username: user.username,
                    password: user.password,
                    role: user.role,
                    birthday: day,
                    gender: user.gender,
                    email: user.email
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
            <div>

            </div>
            // <form onSubmit={this.onSubmit}>
            //     <div className="site-layout-background-main">
            //         <div className="row">
            //             <div className="col-9">
            //                 <div onClick={() => this.goBack()} className='subject'> {`<- Thông tin cá nhân`}</div>
            //             </div>
            //             <div className="col">
            //                 {/* <button onClick={() => this.onDone()} className="btn btn-warning">Quay về</button> */}
            //                 <button type="submit" className="btn btn-createnew">Sửa</button>
            //             </div>
            //         </div>

            //         <div className="container-fluid mt-3">
            //             <div className="row">
            //                 <div className="col-12">
            //                     <div className="section">
            //                         <li className="fas fa-user"></li> Thông tin
            //                         </div>
            //                     <div className="row mt-3">
            //                         <div className="col">
            //                             <label htmlFor="username"  >Tài khoản</label>
            //                             <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="username" placeholder="Tài khoản" value={this.state.username} required={true} />
            //                         </div>
            //                         <div className="col">
            //                             <label htmlFor="name"  >Tên</label>
            //                             <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="name" placeholder="Tên người dùng" value={this.state.name} required={true} />
            //                         </div>
            //                     </div>
            //                     <div className="row mt-3">
            //                         <div className="col">
            //                             <label htmlFor="phoneNumber"  >Điện thoại</label>
            //                             <input onChange={(e) => this.onChange(e)} type="number" className="form-control" name="phoneNumber" placeholder="Eg. 0919385172" value={this.state.phoneNumber} required={true} />
            //                         </div>
            //                         <div className="col">
            //                             <label htmlFor="address">Địa chỉ</label>
            //                             <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="address" placeholder="Eg. 37/10BIS" value={this.state.address} required={true} />
            //                         </div>
            //                     </div>
            //                     <div className="row mt-3">
            //                         <div className="col-7">
            //                             {this.state.birthday && <label htmlFor="birthday">Ngày: {this.state.birthday.toLocaleDateString()}</label>}
            //                             {!this.state.birthday && <label htmlFor="birthday">Ngày</label>}
            //                             <DayPickerInput
            //                                 onDayChange={this.handleDayChange}
            //                                 value={this.state.birthday}
            //                                 dayPickerProps={{
            //                                     selectedDays: this.state.birthday
            //                                 }}
            //                             />
            //                         </div>
            //                         <div className="col-5">
            //                             <label htmlFor="gender"  >Giới tính</label>
            //                             <Select
            //                                 onChange={(e) => this.onSelectGender(e)}
            //                                 value={Genders.filter(({ value }) => value === this.state.gender)}
            //                                 options={Genders}
            //                             />
            //                         </div>
            //                     </div>
            //                     <div className="row mt-3">
            //                         <div className="col">
            //                             <label htmlFor="email"  >Email</label>
            //                             <input onChange={(e) => this.onChange(e)} type="email" className="form-control" name="email" placeholder="Eg. abc**@gmail.com" value={this.state.email} required={true} />
            //                         </div>
            //                     </div>
            //                     <hr></hr>
            //                     <label htmlFor="password"  >Mật khẩu</label>
            //                     <input onChange={(e) => this.onChange(e)} type="password" className="form-control" name="password" placeholder="Mật khẩu" value={this.state.password} required={true} />
            //                     <br></br>
            //                 </div>

            //             </div>
            //         </div>
            //     </div>
            // </form>
        );
    }
}

export default thongtincanhan;