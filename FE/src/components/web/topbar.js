import { Nav, NavDropdown } from 'react-bootstrap';
import React, { Component } from 'react';
import { NavLink, Redirect,Link } from 'react-router-dom'
import auth from '../router/auth';

class topbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            role: '',
            logout: false,
            thongtincanhan: false
        }
    }
    async componentDidMount() {
        var login = localStorage.getItem('login');
        var obj = JSON.parse(login);
        this.setState({
            name: obj.name,
            role: obj.role
        })
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleSelect = (e) => {
        if (e === 'Logout') {
            auth.logout();
            this.setState({
                logout: true
            })
        } else {
            if (window.location.pathname !== '/thongtincanhan') {
                this.setState({
                    thongtincanhan: true
                })
            }
        }
    }

   

    renderData = () => {
        if (this.state.role === 'Admin') {
            return (
                <ul className="nav nav-mtd tabs-info z-depth-1">
                    {/* <li className="nav-item1"><NavLink className="nav-link active" to="/home" >Trang đăng kí</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/listpatients" >Bệnh nhân</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/listdepartments" >Phòng</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/listfalcuties" >Khoa</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/phongduocsi" >Phòng dược sĩ</NavLink></li> */}
                    <li className="nav-item1"><NavLink className="nav-link active" to="/listusers" >Người dùng</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/listroles" >Quyền</NavLink></li>
                    {/* <li className="nav-item1"><NavLink className="nav-link active" to="/listcredentials" >Phân quyền</NavLink></li> */}
                    {/* <li className="nav-item1"><NavLink className="nav-link active" to="/listservices" >Dịch vụ</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/doctor_listdepartments" >Phòng khám</NavLink></li>
                    <li className="nav-item1"><NavLink className="nav-link active" to="/sobanthuoc" >Sổ bán thuốc</NavLink></li> */}
                </ul>
            )
        }
    }

    render() {
        if (this.state.logout) {
            return (
                <Redirect to="login" />
            )
        }
        else if (this.state.thongtincanhan) {
            return (
                <Redirect to="thongtincanhan" />
            )
        }
        else {
            return (
                <div >
                    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow" >
                        {/* Sidebar Toggle (Topbar) */}
                        <div className="col-1">
                            <div className="logo"><Link to="/"><img src="/Logo.png" alt="Logo" style={{ maxWidth: '100%', cursor:'pointer' }} /></Link></div>
                        </div>
                        <div className="col-9" style={{maxWidth:'90%'}} >
                            {this.renderData()}
                        </div>
                        {/* Topbar Navbar */}
                        <div className="col">
                            <div className="navbar-nav ml-auto" style={{ float: 'right' }}>
                                <Nav variant="pills" activeKey="1" onSelect={this.handleSelect} style={{ width: '100%' }}>
                                    <NavDropdown title={this.state.name} id="nav-dropdown" style={{ width: '100%' }}>
                                        <NavDropdown.Item eventKey="user">Thông tin cá nhân</NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item eventKey="Logout">Đăng xuất</NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </div>
                        </div>
                    </nav>

                </div>
            );
        }
    }
}

export default topbar;