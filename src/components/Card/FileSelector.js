import React from "react";

const FileSelector = ({ handleUploader }) => {
    return (
        <>
            <label id="getFileLabel" htmlFor="getFile"></label>
            <input type="file" id="getFile" onChange={handleUploader} accept="image/*"/>
        </>
    )
}

export default FileSelector;