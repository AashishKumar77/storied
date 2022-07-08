import React, { useRef, useEffect, useState } from "react";

// Components
import Select from "../Select";
import TableLocation from "../SearchLocation/TableLocation";
import Tooltip from "../Tooltip";
import { boldAllLifeEventsTitles } from "../Table/helpers";

// Local Components
import OutSideDetector from "./OutSideDetector";

// Utils
import { cardGender, tableTypes } from "../utils";
import { titleCase } from "../utils/titlecase";

import { tr } from "../../components/utils";
import { useTranslation } from 'react-i18next';

// Images
import men from "./../../assets/images/maleVectoriconlg.svg";
import women from "./../../assets/images/femaleVectoriconlg.svg";
import defaultImage from "./../../assets/images/otherVectoriconlg.svg";

const { PERSONAL_INFO, LIFE_EVENTS } = tableTypes;

const MAX_WIDTH = 512;

const { MALE, FEMALE, OTHER } = cardGender;

const genderOptions = [MALE, FEMALE, OTHER];

let location = "";

let isLocationChange = false;

const getImage = (data) => {
    switch (true) {
        case (data.imgsrc === "" && data.gender === MALE): return men;
        case (data.imgsrc === "" && data.gender === FEMALE): return women;
        case (data.imgsrc === ""): return defaultImage;
        default: return data.imgsrc;
    }
}

const Cells = ({
    dataRow,
    cellId,
    actualValue,
    editTableData,
    handleBlur,
    handleChange,
    handleClose,
    handleKeyDown,
    inputWidth,
    image,
    nameDetails,
    handleNameDetails,
    handleNameBlur,
    handleNameKeyDown,
    handleNameCellClick,
    error
}) => {
    const inputRef = useRef(null);
    const inputFirstNameRef = useRef(null);
    const inputLastNameRef = useRef(null);
    const [startpos, setStartpos] = useState(1);

    useEffect(() => {
        let cursorPosition = startpos;
        if (inputRef.current) {
            inputRef.current.selectionStart = cursorPosition
            inputRef.current.selectionEnd = cursorPosition
        }
        if (inputFirstNameRef.current) {
            inputFirstNameRef.current.selectionStart = cursorPosition
            inputFirstNameRef.current.selectionEnd = cursorPosition
        }
        if (inputLastNameRef.current) {
            inputLastNameRef.current.selectionStart = cursorPosition
            inputLastNameRef.current.selectionEnd = cursorPosition
        }
    }, [editTableData?.value, nameDetails?.firstName, nameDetails?.lastName]);

    const handleLocation = (value) => {
        isLocationChange = true;
        if (value && value.name) {
            const { name, id } = value;
            location = {
                target: {
                    name: editTableData.name,
                    value: name,
                    locationId: id || ""
                }
            }
        } else {
            location = {
                target: {
                    name: editTableData.name,
                    value: ""
                }
            }
        }
    }

    const handleLocationClose = (e) => {
        if (e.type === "blur") {
            if (isLocationChange) {
                isLocationChange = false;
                handleChange(location);
            }
            else handleBlur()
        }
    }

    const handleLocationBlur = () => {
        if (isLocationChange) {
            isLocationChange = false;
            handleChange(location);
        }
        else handleBlur()
    }

    const handleLocationKeyDown = (e) => {
        isLocationChange = true;
        if (e.keyCode === 13 || e.keyCode === 9) {
            if (isLocationChange) {
                e.preventDefault();
                isLocationChange = false;
                location = {
                    target: {
                        name: editTableData.name,
                        value: e.target.value
                    }
                }
                handleChange(location);
            }
            else handleBlur()
        }
        else handleKeyDown(e);
    }

    const handleEmptyValue = () => {
        location = {
            target: {
                name: editTableData.name,
                value: ""
            }
        }
    }

    const handleTitleCase = (e) => {
        const str = e.target.value
        setStartpos(str.length === 0 ? 1 : e.target.selectionStart);
        const updatedstr = titleCase(str)
        return {
            target: {
                name: e.target.name,
                value: updatedstr
            }
        }
    }

    const handleChangeVal = (e) => {
        const event = handleTitleCase(e)
        handleChange(event)
    }

    const handleNameDetailsChange = (e) => {
        const event = handleTitleCase(e)
        handleNameDetails(event)
    }

    const getInputStyle = () => {
        const width = {
            width: inputWidth > MAX_WIDTH ? MAX_WIDTH : inputWidth,
            border: null
        }
        const nullWidth = {
            width: null
        }
        if (editTableData.tableType === PERSONAL_INFO) return width;
        else return nullWidth;
    }

    const getMultiInputStyle = () => {
        return {
            border: null
        }
    }
    const { t } = useTranslation();
    if (editTableData && editTableData.editTable && editTableData.cellId === cellId) {
        if (editTableData.type === "select") {
            return (
                <div className="edit-cell shadow-1x">
                    <Select
                        open={true}
                        id="selectGender"
                        name={editTableData.name}
                        options={genderOptions}
                        value={editTableData.value}
                        handleChange={handleChange}
                        handleClose={handleClose}
                        familyTable={editTableData.tableType === PERSONAL_INFO ? false : true}
                    />
                </div>
            )
        } else if (editTableData.type === "location") {
            return (
                <div className="w-full shadow-1x" style={{ minWidth: "340px" }}>
                    <TableLocation
                        handleSelectedValue={handleLocation}
                        searchString={editTableData.value}
                        handleBlur={handleBlur}
                        placeholder="search.unisearchform.autocomplete"
                        freeSolo={true}
                        inputRef={true}
                        handleClose={handleLocationClose}
                        handleBlur={handleLocationBlur}
                        handleKeyDown={handleLocationKeyDown}
                        handleEmptyValue={handleEmptyValue}
                    />
                </div>
            )
        } else if (editTableData.type === "multiInput") {
            return (
                <div className="fullname-box">
                    <OutSideDetector handleNameBlur={handleNameBlur}>
                        <div className="fullname-control">
                            <input
                                ref={inputFirstNameRef}
                                id="firstName"
                                name="firstName"
                                autoFocus={true}
                                value={nameDetails.firstName}
                                onChange={handleNameDetailsChange}
                                placeholder={tr(t, "f&mName")}
                                onKeyDown={handleNameKeyDown}
                                onClick={() => handleNameCellClick("firstName")}
                                style={getMultiInputStyle()}
                            />
                            <input
                                ref={inputLastNameRef}
                                id="lastName"
                                name="lastName"
                                value={nameDetails.lastName}
                                onChange={handleNameDetailsChange}
                                placeholder={tr(t, "LastName")}
                                onKeyDown={handleNameKeyDown}
                                onClick={() => handleNameCellClick("lastName")}
                                style={getMultiInputStyle()}
                            />
                        </div>
                    </OutSideDetector>
                </div>
            )
        } else {
            return (
                <div className="w-full shadow-1x">
                    <input
                        ref={inputRef}
                        id={editTableData.id}
                        type={editTableData.type}
                        autoFocus={editTableData.autoFocus}
                        name={editTableData.name}
                        value={editTableData.value}
                        onBlur={handleBlur}
                        onChange={handleChangeVal}
                        onKeyDown={handleKeyDown}
                        style={getInputStyle()}
                    />
                </div>
            )
        }
    } else {
        return (
            <>
                {image && <img src={getImage(dataRow)} alt="profile-img" className="mr-1.5 avtar-square-small" />}
                <Tooltip type="ellipses" placement="top" title={actualValue}>
                    {
                        dataRow.tableType === LIFE_EVENTS && boldAllLifeEventsTitles.includes(actualValue)
                            ? <div><b>{actualValue}</b></div>
                            : <div>{actualValue}</div>
                    }
                </Tooltip>
            </>
        )
    }
}

export default Cells;