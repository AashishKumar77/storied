import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FileDrop } from "react-file-drop";
import "./index.css";
import Translator from "../Translator";

// Components
import Icon from "../Icon";
import ProgressBar from "../ProgressBar";

// Utils
import { generateRandomNumber } from "../utils";

const Uploader = ({ fileReady, handleFileReady, handleSelectedFile, uploading, progress, homePersons, handleCheck, handleNextStep }) => {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [toggleClass, setClassName] = useState("file-drop")
    const [disabled, setDisabled] = useState(false);
    const [iconColor, setIconColor] = useState("default");
    const [fakeProgress, setFakeProgress] = useState(0);
    let progressTimer;
    let timer;

    const callInterval = () => {
        timer = setInterval(() => {
            setFakeProgress((oldProgress) => {
                if (homePersons.length > 0) {
                    clearInterval(timer);
                    return 100;
                } else if (homePersons.length === 0 && oldProgress > 70 && oldProgress < 100) {
                    clearInterval(timer);
                } else {
                    let randomNumber = generateRandomNumber(1, 10);
                    return Math.min(oldProgress + randomNumber, 100);
                }
            });
        }, 500);
    }

    useEffect(() => {
        if (progress > 0 || homePersons.length > 0) callInterval();
        if (fakeProgress === 0) setFakeProgress(1);
    }, [progress, homePersons]);

    useEffect(() => {
        if (fakeProgress === 100) {
            progressTimer = setTimeout(() => {
                handleNextStep();
            }, 1000)
        }

        return () => {
            clearTimeout(progressTimer);
            clearInterval(timer);
        }
    }, [fakeProgress]);

    // Select/Drag/Drop File
    const handleChange = (event) => {
        handleFile(event.target.files)
    }

    const handleDrop = (files) => {
        handleFile(files)
    }

    const onTargetClick = (e) => {
        if (e.target.tagName !== "svg") fileInputRef.current.click()
    }

    const handleFile = (files) => {
        if (files[0] && files[0].name !== undefined) {
            handleFileReady(true);
            setSelectedFile(files[0]);
            handleSelectedFile(files[0]);
            setClassName("drop-complete");
            setDisabled(true);
        }
    }

    // Cancel File
    const handleCancel = () => {
        handleFileReady(false);
        setSelectedFile(null);
        handleSelectedFile(null);
        setClassName("file-drop");
        setDisabled(false);
        handleCheck();
        fileInputRef.current.value = null;
    }

    const handleMouseOver = () => {
        setIconColor("primary");
    }

    const handleMouseLeave = () => {
        setIconColor("default");
    }

    const getRenderderedState = () => {
        if (uploading) {
            return <Translator tkey="family.stepper.step3.upload.btn.uploadinggedcom" />
        }
        else
            return <Translator tkey="family.stepper.step3.upload.btn.ugedcom" />
    }

    return (
        <div className="w-full md:w-80 h-14" onMouseOver={handleMouseOver} onMouseLeave={handleMouseLeave} >
            <input
                onChange={handleChange}
                ref={fileInputRef}
                type="file"
                className="hidden"
                disabled={disabled}
            />
            <FileDrop
                className={uploading ? `${toggleClass} file-uploading` : toggleClass}
                onDrop={handleDrop}
                onTargetClick={onTargetClick}
            >
                <div className="flex justify-center items-center text-base mr-7 ml-6 my-1">
                    <div className="my-auto flex mr-2">
                        <Icon type="uploadFile" color={iconColor} />
                    </div>
                    <div className="typo-font-medium block whitespace-nowrap overflow-hidden overflow-ellipsis max-w-vxs truncate ">
                        {selectedFile === null ? getRenderderedState() : selectedFile.name}
                    </div>
                </div>
                {
                    fileReady &&
                    <div className="icon-cross">
                        <Icon type="delete" handleClick={handleCancel} />
                    </div>
                }

                {
                    uploading &&
                    <div className="mx-8" >
                        <ProgressBar progress={fakeProgress} />
                    </div>
                }
            </FileDrop>
        </div>
    );
}

Uploader.propTypes = {
    isProgress: PropTypes.bool
};

Uploader.defaulProps = {
    isProgress: false
}

export default Uploader;
