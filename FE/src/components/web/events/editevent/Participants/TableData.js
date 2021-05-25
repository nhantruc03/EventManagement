import React, { Component } from 'react';
import TableDataRow from './TableDataRow.js';

class TableData extends Component {
    mappingDataUser = () => this.props.data.map((value, key) => (
        <TableDataRow
            canEdit={this.props.canEdit}
            deleteClick={(id) => this.props.deleteClick(id)}
            onClickEdit={() => this.props.onClickEdit()}
            edit={(value) => this.props.edit(value)}
            key={key}
            data={value}
            canDelete={this.props.canDelete}
        />
    ))


    render() {
        return (
            <div className="ant-table">

                <div className="ant-table-container">
                    < div className="ant-table-content" >
                        <table className="table table-striped table-hover">
                            <thead className="ant-table-thead">
                                {this.props.canEdit ?
                                    <tr>
                                        <th style={{ width: `20%` }} className="ant-table-cell">Mssv</th>
                                        <th style={{ width: `20%` }} className="ant-table-cell">Tên</th>
                                        <th style={{ width: `20%` }} className="ant-table-cell">Điện thoại</th>
                                        <th style={{ width: `20%` }} className="ant-table-cell">Email</th>
                                        <th style={{ width: `20%` }} className="ant-table-cell">Thao tác</th>
                                    </tr> :
                                    <tr>
                                        <th style={{ width: `25%` }} className="ant-table-cell">Mssv</th>
                                        <th style={{ width: `25%` }} className="ant-table-cell">Tên</th>
                                        <th style={{ width: `25%` }} className="ant-table-cell">Điện thoại</th>
                                        <th style={{ width: `25%` }} className="ant-table-cell">Email</th>
                                    </tr>
                                }
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