import React, { Component } from 'react';
import TableDataRow from './TableDataRow.js';

class TableData extends Component {
    mappingDataUser = () => this.props.data.map((value, key) => (
        <TableDataRow
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
                                <tr>
                                    <th className="ant-table-cell">Tên</th>
                                    <th className="ant-table-cell" style={{ width: '200px' }}>Thao tác</th>
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