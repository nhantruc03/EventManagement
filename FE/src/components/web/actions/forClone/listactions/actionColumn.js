import { Checkbox, Dropdown, Menu } from 'antd';
import Title from 'antd/lib/typography/Title';
import React, { Component } from 'react';
import ActionCard from './actionCard';
import {
    EllipsisOutlined
} from '@ant-design/icons';

class actionColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            filter: [],
            totalSubOfAction: [],
            menu: (
                <Menu>
                    <Menu.Item>
                        <Checkbox.Group onChange={this.onChange} >
                            <div className="flex-container-column">
                                <Checkbox value="Tên">Tên</Checkbox>
                                <Checkbox value="Số lượng công việc">Số lượng công việc</Checkbox>
                                <Checkbox value="Độ ưu tiên">Độ ưu tiên</Checkbox>
                                <Checkbox value="Ban">Ban</Checkbox>
                            </div>
                        </Checkbox.Group>
                    </Menu.Item>
                </Menu>
            ),
            data: []
        }
    }

    onChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        this.setState({
            filter: checkedValues
        })
    }

    addTotalSubOfAction = (e) => {
        this.setState({
            totalSubOfAction: [...this.state.totalSubOfAction, e]
        })
    }

    renderActions = () => {
        let temp_listActions = this.applyFilter(this.props.listActions)

        return (
            temp_listActions.map((e) => {
                return (
                    <ActionCard addTotalSubOfAction={this.addTotalSubOfAction} data={e} key={e._id} />
                )
            })
        )
    }

    applyFilter = (list) => {
        let result = list.slice()
        
        if (this.state.filter.includes('Tên')) {
            result = result.sort((a, b) => {
                let nameA = a.name.substring(0, 1).toLowerCase();
                let nameB = b.name.substring(0, 1).toLowerCase();
                return nameA < nameB ? 1 : -1
            })
        }

        if (this.state.filter.includes('Số lượng công việc')) {
            result = result.sort((a, b) => {
                let tempA = this.state.totalSubOfAction.filter(e => e._id === a._id)[0]
                let tempB = this.state.totalSubOfAction.filter(e => e._id === b._id)[0]

                return tempA.total < tempB.total ? 1 : -1
            })
        }

        if (this.state.filter.includes('Độ ưu tiên')) {
            result = result.sort((a, b) => {
                let tempA = this.getPriority(a.priorityId.name)
                let tempB = this.getPriority(b.priorityId.name)
                console.log('a', tempA)
                console.log('b', tempB)
                return tempA < tempB ? 1 : -1
            })
        }

        if (this.state.filter.includes('Ban')) {
            result = result.sort((a, b) => {

                return a.facultyId.name < b.facultyId.name ? 1 : -1
            })
        }
        console.log(result)
        return result
    }

    getPriority = (e) => {
        if (e === "Cao") {
            return 3
        }
        else if (e === "Vừa") {
            return 2
        }
        else {
            return 1
        }
    }

    render() {
        return (
            <>
                <div style={{ padding: '0 20px' }} className="flex-container-row">
                    <Title level={3}>{this.props.title}</Title>
                    <Dropdown className="flex-row-item-right" overlay={this.state.menu} placement="bottomRight" arrow >
                        <EllipsisOutlined style={{ fontSize: '30px', color: '#2A9D8F' }} />
                    </Dropdown>
                </div>
                {this.renderActions()}

            </>
        );
    }
}

export default actionColumn;