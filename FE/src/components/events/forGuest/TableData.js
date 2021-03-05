import React, { Component } from 'react';
import TableDataRow from './TableDataRow';

class TableData extends Component {
    mappingDataUser = () => this.props.dataUser.map((value, key) => (
        <TableDataRow
            deleteClick={(id) => this.props.deleteClick(id)}
            onClickEditUser={() => this.props.onClickEditUser()}
            getUserEditInfo={(value) => this.props.getUserEditInfo(value)}
            listguesttype={this.props.listguesttype}
            key={key}
            data={value}
            list={this.props.dataUser}
        />
    ))


    render() {
        return (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Tên</th>
                        <th>Điện thoại</th>
                        <th>Email</th>
                        <th>Loại khách mời</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {this.mappingDataUser()}
                </tbody>
            </table>
        );
    }
}

export default TableData;