import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../env'
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';

class editroles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            isDone: false
        }
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
        };
        await trackPromise(Axios.put('/api/roles/' + this.props.match.params.id, data, {
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
        const [role] = await trackPromise(Promise.all([
            Axios.get('/api/roles/' + this.props.match.params.id, {
                headers: {
                    'Authorization': { AUTH }.AUTH
                }
            })
                .then((res) =>
                    res.data.data
                ),
        ]));


        if (role !== null) {
            if (this._isMounted) {
                this.setState({
                    name: role.name,
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
                                    <li className="fas fa-role"></li> Thông tin
                                    </div>
                                <div className="row mt-3">
                                    <div className="col">
                                        <label htmlFor="name"  >Tên</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="name" placeholder="Tên quyền" value={this.state.name} required={true} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}

export default editroles;