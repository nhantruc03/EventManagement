import Title from 'antd/lib/typography/Title';
import React, { Component } from 'react';

class NumCard extends Component {
    render() {
        const { name, unit, num } = this.props
        // let name = "test"
        // let unit = "test"
        // let num = "test"
        return (
            <div style={{ width: '100%', padding: '10px 20px' }}>
                <div style={{ ...this.props.style, width: '100%', backgroundColor: 'white', borderRadius: '8px', padding: '15px 40px' }}>
                    <Title style={{ color: '#AAB0B6', marginBottom: 'unset' }} level={3}>{name}</Title>
                    <p style={{ color: '#2A9D8F', fontSize: '32px' }}><span style={{ fontSize: '62px' }}>{num}</span> {unit}</p>

                </div>
            </div>
        );
    }
}

export default NumCard;