import React from "react";

// Local Components
import Cells from "./cells";
import Skeleton from "../Skeleton";

const Rows = (props) => {

    const {
        type,
        keys,
        data,
        image,
        columns,
        loading,
        getValue,
        getClasses,
        getCellId,
        handleCellClick,
        editTableData,
        handleBlur,
        handleChange,
        handleClose,
        handleKeyDown,
        inputWidth,
        nameDetails,
        handleNameDetails,
        handleNameBlur,
        handleNameKeyDown,
        handleNameCellClick,
        error
    } = props;

    if (loading) {
        return (
            <>
                <tr>
                    {columns.map((c, i) => {
                        return (
                            <td key={i}><Skeleton width="65%" /></td>
                        )
                    })}
                </tr>
            </>
        );
    } else {
        return (
            <>
                {
                    data && data.map((dataRow, dataIndex) => {
                        return (
                            <>
                                <tr style={{ background: dataRow.newRow && "#DAE3EF" }} key={dataIndex} className={dataRow.isFamily && "bg-gray-100"} >
                                    {
                                        keys && keys.map((keyValue, keyIndex) => {
                                            const actualValue = getValue(dataRow[keyValue], keyValue);
                                            const classNames = getClasses(dataRow[keyValue]);
                                            const cellId = getCellId(dataRow.tableType, dataIndex, keyIndex);

                                            return (
                                                <td
                                                    id={cellId}
                                                    key={cellId}
                                                    className={classNames}
                                                    onClick={() => !editTableData ?.editTable && handleCellClick({ tableType: type, dataRow, keyValue, dataIndex, keyIndex })}
                                                    style={{
                                                        padding: editTableData && editTableData.editTable && editTableData.cellId === cellId ? 0 : "",
                                                        border: editTableData && editTableData.editTable && editTableData.cellId === cellId ? "none" : "",
                                                    }}
                                                >
                                                    <Cells
                                                        dataIndex={dataIndex}
                                                        keyIndex={keyIndex}
                                                        dataRow={dataRow}
                                                        keyValue={keyValue}
                                                        cellId={cellId}
                                                        actualValue={actualValue}
                                                        editTableData={editTableData}
                                                        handleBlur={handleBlur}
                                                        handleChange={handleChange}
                                                        handleClose={handleClose}
                                                        handleKeyDown={handleKeyDown}
                                                        inputWidth={inputWidth}
                                                        image={keyIndex === 0 && image}
                                                        nameDetails={nameDetails}
                                                        handleNameDetails={handleNameDetails}
                                                        handleNameBlur={handleNameBlur}
                                                        handleNameKeyDown={handleNameKeyDown}
                                                        handleNameCellClick={handleNameCellClick}
                                                        error={error}
                                                    />
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            </>
                        )
                    })
                }
            </>
        );
    }
};

export default Rows;