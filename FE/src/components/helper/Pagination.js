import React, { Component } from 'react';

class Pagination extends Component {
    renderRow = () => {
        return (
            this.props.totalPosts.map(number => (
                <li key={number} className='page-item'>
                    <button onClick={() => this.props.paginate(number)} className='page-link'>
                        {number}
                    </button>
                </li>
            ))
        )
    }
    render() {
        return (
            <nav>
                <ul className='pagination'>
                    {this.renderRow()}
                </ul>
            </nav >
        );
    }
}

export default Pagination;