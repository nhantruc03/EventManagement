import React, { Component } from 'react';
import TableDataRow from './table_row/tablerow_normal';
import Khamdakhoa from './table_row/tablerow_khamdakhoa'
import Dangkikham from './table_row/tablerow_dangkikham';
import Chonphongkham from './table_row/tablerow_chonphongkham';
import Khamchuyenkhoa from './table_row/tablerow_khamchuyenkhoa';
import Ketquachuyenkhoa from './table_row/tablerow_ketquachuyenkhoa';
import Taodonthuoc from './table_row/tablerow_taodonthuoc';
import Donthuoc from './table_row/tablerow_donthuoc';
import Phongduocsi from './table_row/tablerow_phongduocsi';
import Donthuoctuphongkham from './table_row/tablerow_donthuoctuphongkham';
import Hoadonthuoc from './table_row/tablerow_hoadonthuoc';
import Hosobenhnhan from './table_row/tablerow_hosobenhnhan';
import Hosokhambenh from './table_row/tablerow_hosokhambenh';
import Hoadonkham from './table_row/tablerow_hoadonkham';
import ReactAutoScroll from 'react-to-target-auto-scroll'
class TableData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tableType: ''
        }
    }
    mappingDataUser = () => {
        if (this.props.type === "chonphongkham") {
            return (
                this.props.data.map((value, key) => (
                    <Chonphongkham
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "khamdakhoa") {
            return (
                this.props.data.map((value, key) => (
                    <Khamdakhoa
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                        curRoom={this.props.curRoom}
                        departmentId={this.props.departmentId}
                        onDelete={(e) => this.props.onDelete(e)}
                        noaction={this.props.noaction}
                    />
                ))
            )
        }
        else if (this.props.type === "khamchuyenkhoa") {
            return (
                this.props.data.map((value, key) => (
                    <Khamchuyenkhoa
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                        curRoom={this.props.curRoom}
                        departmentId={this.props.departmentId}
                        onDelete={(e) => this.props.onDelete(e)}
                        noaction={this.props.noaction}
                    />
                ))
            )
        }
        else if (this.props.type === "dangkikham") {
            return (
                this.props.data.map((value, key) => (
                    <Dangkikham
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "ketquachuyenkhoa") {
            return (
                this.props.data.map((value, key) => (
                    <Ketquachuyenkhoa
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "taodonthuoc") {
            return (
                this.props.data.map((value, key) => (
                    <Taodonthuoc
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                        add={(e) => this.props.add(e)}
                    />
                ))
            )
        }
        else if (this.props.type === "donthuoc") {
            return (
                this.props.data.map((value, key) => (
                    <Donthuoc
                        noaction={this.props.noaction}
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                        quantity_change={(e) => this.props.quantity_change(e)}
                        delete={(e) => this.props.delete(e)}
                    />
                ))
            )
        }
        else if (this.props.type === "phongduocsi") {
            return (
                this.props.data.map((value, key) => (
                    <Phongduocsi
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "donthuoctuphongkham") {
            return (
                this.props.data.map((value, key) => (
                    <Donthuoctuphongkham
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "hoadonthuoc") {
            return (
                this.props.data.map((value, key) => (
                    <Hoadonthuoc
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "hosobenhnhan") {
            return (
                this.props.data.map((value, key) => (
                    <Hosobenhnhan
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "hosokhambenh") {
            return (
                this.props.data.map((value, key) => (
                    <Hosokhambenh
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else if (this.props.type === "hoadonkham") {
            return (
                this.props.data.map((value, key) => (
                    <Hoadonkham
                        obj={this.props.obj}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                    />
                ))
            )
        }
        else {
            return (
                this.props.data.map((value, key) => (
                    <TableDataRow
                        obj={this.props.obj}
                        onDelete={(e) => this.props.onDelete(e)}
                        key={key}
                        keydata={this.props.keydata}
                        data={value}
                        noaction={this.props.noaction}
                    />
                ))
            )
        }
    }

    printRow = () =>
        this.props.dataRow.map((value, key) => (
            <th key={key}>{value}</th>
        ))


    handleScroll = (e) => {
        const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
        if (bottom) {
            this.refs.test.scrollTo(0, 0)
        }
    }

    renderBlank = () => {
        if (this.props.autoScroll && this.props.data.length > 12) {
            return (
                <tr style={{ height: '200px' }}>
                  
                </tr>
            )
        }
    }

    componentDidMount() {
        if (this.props.autoScroll) {
            this.setState({
                tableType: 'AutoScrollTable'
            })
        }
    }

    render() {
        return (
            <div className="col mt-2">
                <ReactAutoScroll
                    targetPosition={700}
                    easeType={'linear'}
                    speed={2}
                    updateInterval={40}
                    onScrollingDone={() => this.refs.test.scrollTo(0, 0)}
                    scrollTargetRef={this.refs.test}
                    StopScrolling={false}
                    isEnabled={this.props.autoScroll}>
                    <div onScroll={this.handleScroll} ref="test" className={`${this.state.tableType}`}>
                        <table className="table table-striped table-hover">
                            <thead className="thead">
                                <tr style={{ textAlign: "center" }}>
                                    {this.printRow()}
                                </tr>
                            </thead>
                            <tbody>
                                {this.mappingDataUser()}
                                {this.renderBlank()}
                            </tbody>
                        </table>
                    </div>

                </ReactAutoScroll>

            </div>
        );
    }
}

export default TableData;