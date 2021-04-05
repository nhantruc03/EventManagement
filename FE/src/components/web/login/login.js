import Axios from 'axios';
import React, { Component } from 'react';
import auth from '../../../router/auth';
import { trackPromise } from 'react-promise-tracker';
import { LoadingIndicator } from '../helper/Loading';
// import { AUTH } from '../../env'
// import MaskGroup from './public/MaskGroup.png';
class login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isFail: false,
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    onSubmit = async (e) => {
        e.preventDefault();
        var data = new FormData();

        data.append("username", this.state.username);
        data.append("password", this.state.password);
        await trackPromise(Axios.post('/api/users/login', data)
            .then(res => {
                if (res.data.success === true) {
                    auth.login(res.data.data);
                    if (auth.isAuthenticatedAdmin() === true || auth.isAuthenticatedDoctor() === true || auth.isAuthenticatedPharmacist() === true || auth.isAuthenticatedStaff() === true) {
                        var login = localStorage.getItem('login');
                        if (login !== null) {
                            this.props.history.push("/");
                        }

                    }
                    else {
                        this.setState({
                            isFail: true
                        })
                    }
                }
            })
            .catch(err => {
                console.log(err);
            }))

    }
    handleFail = () => {
        if (this.state.isFail) {
            return <p style={{ color: "red", textAlign: "center" }}>Đăng nhập thất bại!</p>
        }
    }
    render() {
        return (
            <div className="bg-gradient-primary" style={{ height: '100vh', backgroundImage: `url(/img/MaskGroup.png)` }}>
                <div className="container" style={{ paddingTop: 200 }}>
                    {/* Outer Row */}
                    <div className="row justify-content-center">
                        <div className="col-xl-10 col-lg-12 col-md-9">
                            <div className="card o-hidden border-0 shadow-lg my-5">
                                <div className="card-body p-0">
                                    {/* Nested Row within Card Body */}
                                    <div className="row">
                                        <div className="col-3"></div>
                                        <div className="col-6">
                                            <div className="p-5" style={{ alignContent: 'center' }}>
                                                <div className="text-center">
                                                    <h1 className="h4 text-gray-900 mb-4" >Xin Chào!</h1>
                                                </div>
                                                <br></br>
                                                <br></br>
                                                <form className="user" onSubmit={(e) => this.onSubmit(e)}>
                                                    <div className="form-group">
                                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control form-control-user" name="username" placeholder="Nhập tài khoản..." required />
                                                    </div>
                                                    <div className="form-group">
                                                        <input onChange={(e) => this.onChange(e)} type="password" className="form-control form-control-user" name="password" placeholder="Mật khẩu" required />
                                                    </div>
                                                    {this.handleFail()}
                                                    <button type="submit" style={{ marginTop: 50 }} className="btn btn-primary btn-user btn-block">
                                                        Đăng nhập
                                                    </button>
                                                </form>
                                                <LoadingIndicator />
                                            </div>
                                        </div>
                                        <div className="col-3"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

export default login;