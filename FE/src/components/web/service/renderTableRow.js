import NumberFormat from 'react-number-format';

function isDate(val) {
    try {
        val = val.replaceAll(" ", "");
        var d = new Date(val);
        return !isNaN(d.valueOf());
    } catch {
        return false
    }

}

export const render = (keydata, data, edit) =>
    keydata.map((value, key) => {
        if (value === "isDeleted") {
            var stt;
            if (data[value] === true) {
                stt = "Disable";
                return (
                    <td key={key} ><div className="ant-table-cell disable">{stt}</div> </td>
                )
            }
            else {
                stt = "Enable";
                return (
                    <td key={key} ><div className="ant-table-cell enable">{stt}</div> </td>
                )
            }
        }
        if (value.includes('.')) {
            var list = value.split('.');
            if (isNaN(data[list[0]][list[1]])) {
                return <td className="ant-table-cell" key={key}>{data[list[0]][list[1]]}</td>
            } else {
                return <td className="ant-table-cell" key={key}><NumberFormat value={data[list[0]][list[1]]} displayType={'text'} thousandSeparator={true} /></td>
            }

        }
        if (data[value]) {
            if (isNaN(data[value])) {
                if (data[value].includes("image")) {
                    return (
                        <td className="ant-table-cell" key={key} ><img style={{ width: 150 }} src={`/images/${data[value]}`} alt="Logo" /> </td>
                    )
                }
                else {
                    if (isDate(data[value])) {
                        var temp = new Date(data[value]);
                        return (
                            <td className="ant-table-cell" key={key} > { temp.toLocaleDateString()}</td>
                        )
                    }
                    return (
                        <td className="ant-table-cell" key={key} > { data[value]}</td>
                    )
                }
            }
            else {
                return (
                    <td className="ant-table-cell" key={key} > {data[value]} </td>
                )
            }
        }
        else {
            return <td className="ant-table-cell" key={key}>null</td>;
        }
    })
