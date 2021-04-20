import React, { Component } from 'react';
import TableDataRow from './TableDataRow';

class TableData extends Component {
    mappingDataUser = () => this.props.dataUser.map((value, key) => (
        <TableDataRow
            listCredentials={this.props.listCredentials}
            onClickEditUser={() => this.props.onClickEditUser()}
            getUserEditInfo={(value) => this.props.getUserEditInfo(value)}
            key={key}
            data={value}
        />
    ))


    render() {
        return (
            <div className="ant-table">

                <div className="ant-table-container">
                    < div className="ant-table-content" >
                        <table className="table table-striped table-hover">
                            <thead className="ant-table-thead">
                                <tr>
                                    <th style={{ width: `20%` }} className="ant-table-cell">Tên</th>
                                    <th style={{ width: `20%` }} className="ant-table-cell">MSSV</th>
                                    <th style={{ width: `40%` }} className="ant-table-cell">Quyền</th>
                                    <th style={{ width: `20%` }} className="ant-table-cell">Thao tác</th>
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