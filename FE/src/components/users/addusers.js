import Axios from 'axios';
import React, { Component } from 'react';
import Select from 'react-select';
import { AUTH } from '../env';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';

var Genders = [
    { value: 'nam', label: 'Nam' },
    { value: 'nữ', label: 'Nữ' }
]
class addusers extends Component {
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
            gender: 'nam',
            list_roles: [],
            birthday: undefined
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
            password: this.state.password,
            birthday: this.state.birthday,
            gender: this.state.gender,
            email: this.state.email,
            roleId: this.state.roleId,
        };
        console.log(data)
        await trackPromise(Axios.post('/api/users', data, {
            headers: {
                'Authorization': { AUTH }.AUTH
            }
        })
            .then(res => {
                Message('Tạo thành công', true, this.props);
            })
            .catch(err => {
                Message('Tạo thất bại', false);
            }))
    }

    goBack = () => {
        this.props.history.goBack();
    }

    async componentDidMount() {
        this._isMounted = true;
        const [roles] = await trackPromise(Promise.all([
            Axios.post('/api/roles/getAll', {}, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));


        if (roles !== null) {
            if (this._isMounted) {
                var temp = [];
                roles.forEach(e => {
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

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="site-layout-background-main">
                    <div className="row">
                        <div className="col-9">
                            <div onClick={() => this.goBack()} className='subject'> {`<- Tạo người dùng mới`}</div>
                        </div>
                        <div className="col" style={{ paddingRight: '126px' }}>
                            {/* <button onClick={() => this.onDone()} className="btn btn-warning">Quay về</button> */}
                            <button type="submit" className="btn btn-createnew">Tạo mới</button>
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
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="username" placeholder="Tài khoản" required={true} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="name"  >Tên</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="name" placeholder="Tên người dùng" required={true} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="phone"  >Điện thoại</label>
                                        <input onChange={(e) => this.onChange(e)} type="number" className="form-control" name="phone" placeholder="Eg. 0919385172" required={true} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="address">Địa chỉ</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="address" placeholder="Eg. 37/10BIS" required={true} />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        {this.state.birthday && <label htmlFor="address">Ngày: {this.state.birthday.toLocaleDateString()}</label>}
                                        {!this.state.birthday && <label htmlFor="address">Ngày</label>}
                                        <DayPickerInput
                                            onDayChange={this.handleDayChange}
                                            dayPickerProps={{
                                                selectedDays: this.state.birthday
                                            }}
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="gender"  >Giới tính</label>
                                        <Select
                                            placeholder="Chọn giới tính ..."
                                            onChange={(e) => this.onSelectGender(e)}
                                            defaultValue={Genders[0]}
                                            options={Genders}
                                        />
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="email"  >Email</label>
                                        <input onChange={(e) => this.onChange(e)} type="email" className="form-control" name="email" placeholder="Eg. abc**@gmail.com" required={true} />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="roleId"  >Vai trò</label>
                                        <Select
                                            placeholder="Chọn quyền ..."
                                            onChange={(e) => this.onSelectRole(e)}
                                            options={this.state.list_roles}
                                            // isDisabled={true}
                                        />
                                    </div>
                                </div>

                                <hr></hr>

                                <label htmlFor="password"  >Mật khẩu</label>
                                <input onChange={(e) => this.onChange(e)} type="password" className="form-control" name="password" placeholder="Mật khẩu" required={true} />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default addusers;


// import Axios from 'axios';
// import React, { Component } from 'react';
// import Select from 'react-select';
// import { AUTH } from '../env';
// import DayPickerInput from 'react-day-picker/DayPickerInput';
// import 'react-day-picker/lib/style.css';
// import { trackPromise } from 'react-promise-tracker';
// import { Message } from '../service/renderMessage';

// var Genders = [
//     { value: 'nam', label: 'Nam' },
//     { value: 'nữ', label: 'Nữ' }
// ]
// class addusers extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             name: '',
//             address: '',
//             phone: '',
//             username: '',
//             password: '',
//             email: '',
//             gender: 'nam',
//             birthday: undefined
//         }
//     }

//     handleDayChange = (selectedDay) => {
//         this.setState({
//             birthday: selectedDay
//         })
//     }

//     onSelectGender = (e) => {
//         this.setState({
//             gender: e.value
//         })
//     }

//     onChange = (e) => {
//         this.setState({
//             [e.target.name]: e.target.value
//         })
//     }

//     onSubmit = async (e) => {
//         e.preventDefault();
//         var data = {
//             name: this.state.name,
//             address: this.state.address,
//             phone: this.state.phone,
//             username: this.state.username,
//             password: this.state.password,
//             birthday: this.state.birthday,
//             gender: this.state.gender,
//             email: this.state.email
//         };
//         console.log(data)
//         await trackPromise(Axios.post('/api/users', data, {
//             headers: {
//                 'Authorization': { AUTH }.AUTH
//             }
//         })
//             .then(res => {
//                 Message('Tạo thành công', true,this.props); 
//             })
//             .catch(err => {
//                 Message('Tạo thất bại', false); 
//             }))
//     }

//     goBack = () => {
//         this.props.history.goBack();
//     }

//     render() {
//         return (
//             <form onSubmit={this.onSubmit}>
//                 <div className="container-fluid" style={{paddingRight:'150px', paddingLeft:'150px', paddingBottom:'50px'}}>
//                     <div className="row">
//                         <div className="col-9">
//                             <div onClick={() => this.goBack()} className='subject'> {`<- Tạo người dùng mới`}</div>
//                         </div>
//                         <div className="col" style={{paddingRight:'126px'}}>
//                             {/* <button onClick={() => this.onDone()} className="btn btn-warning">Quay về</button> */}
//                             <button type="submit" className="btn btn-createnew">Tạo mới</button>
//                         </div>
//                     </div>

//                     <div className="container-fluid mt-3">
//                         <div className="row">
//                             <div className="col-12">
//                                 <div className="section">
//                                     <li className="fas fa-user"></li> Thông tin
//                                     </div>
//                                 <div className="row mt-3">
//                                     <div className="col">
//                                         <label htmlFor="username"  >Tài khoản</label>
//                                         <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="username" placeholder="Tài khoản" required={true} />
//                                     </div>
//                                     <div className="col">
//                                         <label htmlFor="name"  >Tên</label>
//                                         <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="name" placeholder="Tên người dùng" required={true} />
//                                     </div>
//                                 </div>
//                                 <div className="row mt-3">
//                                     <div className="col">
//                                         <label htmlFor="phone"  >Điện thoại</label>
//                                         <input onChange={(e) => this.onChange(e)} type="number" className="form-control" name="phone" placeholder="Eg. 0919385172" required={true} />
//                                     </div>
//                                     <div className="col">
//                                         <label htmlFor="address">Địa chỉ</label>
//                                         <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="address" placeholder="Eg. 37/10BIS" required={true} />
//                                     </div>
//                                 </div>
//                                 <div className="row mt-3">
//                                     <div className="col">
//                                         {this.state.birthday && <label htmlFor="address">Ngày: {this.state.birthday.toLocaleDateString()}</label>}
//                                         {!this.state.birthday && <label htmlFor="address">Ngày</label>}
//                                         <DayPickerInput
//                                             onDayChange={this.handleDayChange}
//                                             dayPickerProps={{
//                                                 selectedDays: this.state.birthday
//                                             }}
//                                         />
//                                     </div>
//                                     <div className="col">
//                                         <label htmlFor="gender"  >Giới tính</label>
//                                         <Select
//                                             onChange={(e) => this.onSelectGender(e)}
//                                             defaultValue={Genders[0]}
//                                             options={Genders}
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="row mt-3">
//                                     <div className="col">
//                                         <label htmlFor="email"  >Email</label>
//                                         <input onChange={(e) => this.onChange(e)} type="email" className="form-control" name="email" placeholder="Eg. abc**@gmail.com" required={true} />
//                                     </div>
//                                 </div>
//                                 <hr></hr>

//                                 <label htmlFor="password"  >Mật khẩu</label>
//                                 <input onChange={(e) => this.onChange(e)} type="password" className="form-control" name="password" placeholder="Mật khẩu" required={true} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         );
//     }
// }

// export default addusers;