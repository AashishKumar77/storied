import React from "react";
import PropTypes from "prop-types";
import "./index.css";

// Local Components
import Columns from "./columns";
import Rows from "./rows";

const Table = (props) => {

    const { 
        id, type, columns, keys, data, handleUpdate, image, loading, person
    } = props;

    return (
        <div className="w-full">
            <table id={id} className="table-main">
                <thead>
                    <Columns columns={columns} />
                </thead>
                <tbody>
                    <Rows
                        id={id}
                        type={type}
                        columns={columns}
                        keys={keys}
                        data={data}
                        handleUpdate={handleUpdate}
                        image={image}
                        person={person}
                        loading={loading}
                        {...props}
                    />
                </tbody>
            </table>
        </div>
    )
};

Table.propTypes = {
    columns: PropTypes.array,
    keys: PropTypes.array,
    data: PropTypes.array
};

Table.defaultProps = {
    columns: ["A", "B", "C"],
    keys: ["a", "b", "c"],
    data: [
        {
            a: "1",
            b: "2",
            c: "3"
        }
    ]
}

export default Table;