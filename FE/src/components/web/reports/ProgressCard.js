import { Progress } from 'antd';
import React, { Component } from 'react';

class NumCard extends Component {
    render() {
        const { percent, name, num, status } = this.props
        // let name = "test"
        // let unit = "test"
        // let num = "test"
        return (
            <div style={{ width: '100%', padding: '10px 20px' }}>
                <div style={{ ...this.props.style, width: '100%', borderRadius: '8px', padding: '10px 40px' }}>
                    <div className="flex-container-row">
                        <Progress status={status} strokeWidth={13} type="circle" percent={percent} />
                        <div style={{ marginLeft: '10px' }}>
                            <p style={{ fontSize: '32px' }}>{num}</p>
                            <p style={{ color: '#AAB0B6', fontSize: '22px' }}>{name}</p>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default NumCard;