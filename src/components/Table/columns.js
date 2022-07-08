import React from "react";

const Columns = ({ columns }) => {
    return (
        <tr>
            {
                columns && columns.map((col, idx) =>
                    <th key={idx} className="text-gray-400 text-sm border text-left border-gray-200 px-3 py-2 typo-font-medium">{col}</th>
                )
            }
        </tr>
    )
}

export default Columns;