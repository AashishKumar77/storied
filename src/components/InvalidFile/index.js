import React, { useState, useEffect } from "react";

// Components
import Dialog from "../../components/Dialog";
import Loader from "../../components/Loader";
import Icon from "../../components/Icon";
import Typography from "../Typography";
import Button from "../Button";

import "./index.css";


const InvalidFile = ({ selectedFile, selectedHeroFile, showInvalidModal, closeInvalidModal, retryFileUpload }) => {
    const [title, setTitle] = useState(null);
    const [message, setMessage] = useState(null);
    const [invalidFile, setInvalidFile] = useState(false);

    useEffect(() => {
        const ext = ['jpg', 'jpeg', 'gif', 'png'];
        if (selectedFile && selectedFile.file) {
            var sizeInMb = selectedFile.file.size / 1024;
            var sizeLimit = 1024 * 10; // if you want 10 MB
            let fileExt = selectedFile.file.type.split("/")[1];
            if (ext.includes(fileExt) && (sizeInMb > sizeLimit)) {
                const titleTxt = "Image is too large";
                const msgTxt = "The Image you're trying to use must be smaller than 10 MB. Resize your Image or choose a different one.";
                setTitle(titleTxt);
                setMessage(msgTxt);
            }
            else {
                const titleTxt = "Invalid File Type";
                const msgTxt = "Images must be JPGs or PNGs. Maximum file size: 10 MB";
                setTitle(titleTxt);
                setMessage(msgTxt);
                setInvalidFile(true);
            }
        }
        return () => {
           setInvalidFile(false);
        }
    },[selectedFile]);

    useEffect(() => {
        const ext = ['jpg', 'jpeg', 'gif', 'png'];
        if (selectedHeroFile && selectedHeroFile.file) {
            var sizeInMb = selectedHeroFile.file.size / 1024;
            var sizeLimit = 1024 * 10; // if you want 10 MB
            let fileExt = selectedHeroFile.file.type.split("/")[1];
            if (ext.includes(fileExt) && (sizeInMb > sizeLimit)) {
                const titleTxt = "Image is too large";
                const msgTxt = "The Image you're trying to use must be smaller than 10 MB. Resize your Image or choose a different one.";
                setTitle(titleTxt);
                setMessage(msgTxt);
            }
            else {
                const titleTxt = "Invalid File Type";
                const msgTxt = "Images must be JPGs or PNGs. Maximum file size: 10 MB";
                setTitle(titleTxt);
                setMessage(msgTxt);
                setInvalidFile(true);
            }
        }
        return () => {
           setInvalidFile(false);
        }
    },[selectedHeroFile]);

    return (
        <Dialog
            open={showInvalidModal}
            actions={false}
            size={invalidFile ? "xx-small" : "x-small"}
            header=""
            innerClasses="modal-sm"
            hideDividers
            content={
                showInvalidModal ?
                    <>
                        <ContentSection closeInvalidModal={closeInvalidModal} title={title} message={message} />
                    </>
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={closeInvalidModal}
            handleCancel={closeInvalidModal}
            handleSave={retryFileUpload}
            hideCancelButton={true}
        />
    )
}

const ContentSection = ({ closeInvalidModal, title , message }) => {

    return (
        <div className="error-box">
            <Icon color="default" type="uploadFileError"/>
            <div>
                <Typography
                    size={24}
                    weight="bold"
                    text="secondary"
                >
                    {title}</Typography>
            </div>
            <div className="leading-6 mt-2">
                <Typography
                    size={16}
                    text="secondary"
                >
                {message}
            </Typography>
            </div>
            <div className="file-upload">
            <Button
                type="maroon"
                size="medium"
                title="Change Image"
                handleClick={closeInvalidModal}
            />
            </div>
        </div>
    )
}

export default InvalidFile;