import React, { Component } from 'react';
import TableDataRow from './TableDataRow';

class TableData extends Component {
    mappingDataUser = () => this.props.data.map((value, key) => {
        return (
            <TableDataRow
                deleteClick={(id) => this.props.deleteClick(id)}
                onClickEditUser={() => this.props.onClickEditUser()}
                edit={(value) => this.props.edit(value)}
                listguesttype={this.props.listguesttype}
                key={key}
                data={value}
                list={this.props.data}
                canDelete={this.props.canDelete}
                guestTypeId={this.props.guestTypeId}
            />
        )
    })


    render() {
        return (
            <div className="ant-table">
                <div className="ant-table-container">
                    < div className="ant-table-content" >
                        <table className="table table-striped table-hover">
                            <thead className="ant-table-thead">
                                <tr>
                                    <th style={{ width: '20%' }} className="ant-table-cell">Tên</th>
                                    <th style={{ width: '20%' }} className="ant-table-cell">Số điện thoại</th>
                                    <th style={{ width: '20%' }} className="ant-table-cell">Email</th>
                                    <th style={{ width: '20%' }} className="ant-table-cell">Loại khách mời</th>
                                    <th style={{ width: '20%' }} className="ant-table-cell">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="ant-table-tbody">
                                {this.mappingDataUser()}
                            </tbody>
                        </table>
                    </div >
                </div >
            </div >
        );
    }
}

export default TableData;