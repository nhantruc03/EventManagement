import React, { Component } from 'react';
import TableDataRow from './TableDataRow';

class TableData extends Component {
    mappingDataUser = () => this.props.dataUser.map((value, key) => (
        <TableDataRow
            listRole={this.props.listRole}
            listFaculty={this.props.listFaculty}
            deleteClick={(id) => this.props.deleteClick(id)}
            onClickEditUser={() => this.props.onClickEditUser()}
            getUserEditInfo={(value) => this.props.getUserEditInfo(value)}
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
                                <tr>
                                    <th className="ant-table-cell">Tên</th>
                                    {/* <th>Điện thoại</th> */}
                                    <th className="ant-table-cell">Email</th>
                                    <th className="ant-table-cell">Ban</th>
                                    <th className="ant-table-cell">Vị trí</th>
                                    <th className="ant-table-cell">Thao tác</th>
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