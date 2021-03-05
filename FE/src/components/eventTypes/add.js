import Axios from 'axios';
import React, { Component } from 'react';
import { AUTH } from '../env';
import { trackPromise } from 'react-promise-tracker';
import { Message } from '../service/renderMessage';

class add extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        }
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
        console.log(data)
        await trackPromise(Axios.post('/api/event-types', data, {
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

    render() {
        return (
            <form onSubmit={this.onSubmit}>
                <div className="site-layout-background-main">
                    <div className="row">
                        <div className="col-9">
                            <div onClick={() => this.goBack()} className='subject'> {`<- Tạo hình thức sự kiện`}</div>
                        </div>
                        <div className="col" style={{ paddingRight: '126px' }}>
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
                                        <label htmlFor="name"  >Tên</label>
                                        <input onChange={(e) => this.onChange(e)} type="text" className="form-control" name="name" placeholder="Tên quyền" required={true} />
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

export default add;