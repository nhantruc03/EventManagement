import { Button } from 'antd';
import React, { Component } from 'react';
import ScriptItem from './item'
class list extends Component {
    printData = (data) => {
        console.log('listscript', data)
        return (
            data.map((e, key) => {
                return (
                    <ScriptItem onAdd={this.props.onAdd} data={e} key={key} onUpdate={this.props.onUpdate} onDelete={this.props.onDelete} />
                )
            })
        )
    }

    render() {
        return (
            <div style={{ width: '90%' }}>
                {this.printData(this.props.data)}
                <Button onClick={this.props.onAddWithoutApi} className="add-btn-scripdetail">
                    +
                </Button>
            </div>
        );
    }
}
export default list;