import React, { Component } from 'react';
import { Pagination } from 'antd';
class Paginations extends Component {
    renderRow = () => {
        return (
            <Pagination className="flex-row-item-right" pageSize={this.props.PageSize} total={this.props.totalPosts} onChange={(e) => this.props.paginate(e)} />
        )
    }
    render() {
        return (
            <div className='flex-container-row pagination'>
                {this.renderRow()}
            </div>
        );
    }
}

export default Paginations;