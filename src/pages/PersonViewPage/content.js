import React, { useState } from "react";
import KeyboardEventHandler from "react-keyboard-event-handler";

// Local Components
import Stories from "./stories";
import Details from "./details";
import Research from "./Research";
import { getShortGender } from "../../utils";
import { titleCase } from "../../components/utils/titlecase";
import { tableTypes, tr } from "../../components/utils";
import { getNextAndPrevTableCell, getTopAndBottomTableCell, nonEditTableCells, unKnownCases } from "../../components/Table/helpers";
import EventPopover from "../../components/Table/EventPopover";
import { addMessage } from "../../redux/actions/toastr";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import { trimString } from "shared-logics";

const { SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS } = tableTypes;
let topPos = 0
let pos
const MIN_WIDTH = 114;
let latestEditTable = "";
let directTyping = true;
let isChanged = false;
let firstCell = true;

let localNameDetails = {
    firstName: "",
    lastName: ""
}

const Content = (props) => {
    const { t } = useTranslation();
    const nameError = tr(t, "nameError");
    const [nameDetails, setNameDetails] = useState(null);
    const [editTableData, setEditTableData] = useState(null);
    const [freshData, setFreshData] = useState(null);
    const [inputWidth, setInputWidth] = useState(MIN_WIDTH);
    const [error, setError] = useState(false);
    const dispatch = useDispatch();

    const getValue = (value, keyValue) => {
        if (keyValue === "gender") return getShortGender(value);
        else if (keyValue === "description") return value;
        else if ((keyValue !== "description"))
            if (value) return titleCase(value.toString().replace(/-CHILDREN/g, "").replace(/-ISFOCUS/g, "").trim());
            else return titleCase(value);
    }

    const getClasses = (value) => {
        const cellCSS = `text-gray-700 text-sm cursor-pointer px-3 py-2`;
        if (isFocus(value) && isChildren(value)) return `${cellCSS} pl-6 left-border`;
        else if (isFocus(value)) return `${cellCSS} left-border`;
        else if (isChildren(value)) return `${cellCSS} pl-6`;
        else return cellCSS;
    }

    const getCellId = (tableType, dataIndex, keyIndex) => {
        return `${tableType}_${dataIndex}_${keyIndex}`;
    }

    const isFocus = (value) => {
        return value && value.includes("-ISFOCUS");
    }

    const isChildren = (value) => {
        return value && value.includes("-CHILDREN");
    }

    const getType = (keyValue) => {
        switch (keyValue) {
            case "name":
                return "multiInput";

            case "gender":
                return "select";

            case "birthLocation":
            case "deathLocation":
            case "location":
                return "location";

            default:
                return "text";
        }
    }

    const getEditTableData = ({ tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, direct, randomKeyValue }) => {
        const sameKeyBehave = editTableData && editTableData.cellId === getCellId(tableType, dataIndex, keyIndex) ? true : false;
        return {
            cellId: getCellId(tableType, dataIndex, keyIndex),
            id: dataRow.id,
            type: getType(keyValue),
            name: keyValue,
            value: direct ? trimString(randomKeyValue) : trimString(dataRow[keyValue]),
            locationId: '',
            autoFocus: true,
            editTable: sameKeyBehave,
            tableType,
            dataRow,
            keyValue,
            dataIndex,
            keyIndex,
            lastRow
        }
    }

    const getFreshData = (payload, changedKey) => {
        if (changedKey === "name") {
            return {
                ...freshData,
                dataRow: {
                    ...freshData.dataRow,
                    firstName: payload.nameDetails.firstName,
                    lastName: payload.nameDetails.lastName,
                }
            }
        } else {
            return {
                ...freshData,
                dataRow: payload,
                value: payload[changedKey]
            }
        }
    }

    const handleSelected = (cellData) => {
        if (!cellData.editTable) {
            directTyping = true;
            isChanged = false;

            const selectedCell = document.getElementById(cellData.cellId);
            if (selectedCell && cellData && (cellData.cellId.includes(SPOUSES_AND_CHILDREN) || cellData.cellId.includes(PARENTS_AND_SIBLINGS))) {
                selectedCell.classList.add("selected-cell-others");
            }
            else if (selectedCell) {
                selectedCell.classList.add("selected-cell");
            }
            pos = selectedCell.getBoundingClientRect()
            if (pos.bottom + 20 >= (window.innerHeight || document.documentElement.clientHeight)) {
                topPos = topPos + pos.bottom - window.innerHeight + 50
                window.scroll({
                    top: topPos,
                    behavior: 'smooth'
                });
            }
            if (pos.right >= (window.innerWidth || document.documentElement.clientWidth)) {
                window.scroll({
                    left: selectedCell.offsetLeft - pos.left + selectedCell.offsetWidth + 50,
                    behavior: 'smooth'
                });
            }
            if (pos.top - 196 <= 0) {
                let topval = pos.top
                if (pos.top < 196) topval = topval + 196
                let y = window.scrollY
                window.scroll({ top: y - topval, behavior: 'smooth' });
            }
            if (pos.left <= 0) {
                window.scroll({
                    left: selectedCell.offsetLeft + pos.left + 30,
                    behavior: 'smooth'
                });
            }
        }
    }

    const handleRemoveSelected = () => {
        let allElements = Array.from(document.querySelectorAll('.selected-cell'));
        for (let element of allElements) element.classList.remove("selected-cell");
        let allElementsOthers = Array.from(document.querySelectorAll('.selected-cell-others'));
        for (let element of allElementsOthers) element.classList.remove("selected-cell-others");
    }

    const handleCellClick = ({ tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, direct, randomKeyValue }) => {
        if (error) return;
        if (direct) isChanged = true;
        if (lastRow || unKnownCases.includes(dataRow.name)) return;
        if (editTableData && editTableData.editTable && (editTableData.type === "select" || editTableData.type === "location")) return;
        if (!nonEditTableCells[tableType].includes(keyValue)) {
            latestEditTable = tableType;
            const cellData = getEditTableData({ tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, direct, randomKeyValue });
            const widthOfInput = document.getElementById(cellData.cellId) ?.offsetWidth || MIN_WIDTH;
            setInputWidth(widthOfInput);
            setEditTableData(cellData);
            if (cellData ?.cellId !== freshData ?.cellId) setFreshData(cellData);
            handleRemoveSelected();
            handleSelected(cellData);
            setError(false);

            // Name Editing Details
            if (keyValue === "name") {
                localNameDetails = {
                    firstName: direct ? trimString(randomKeyValue) : trimString(dataRow.firstName),
                    lastName: direct ? "" : trimString(dataRow.lastName)
                }
                setNameDetails(localNameDetails);
                firstCell = true;
            }
        }
    }

    const handleKeyDown = async (e) => {
        if (editTableData) {

            const { tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, editTable } = editTableData;

            if (tableType === latestEditTable) {
                let newCell;

                if (e.shiftKey && e.keyCode === 9) {
                    e.preventDefault();
                    const err = await handleNameError();
                    if (!err) {
                        if(isChanged) handleSubmit(editTableData);
                        newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, false);
                        handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                    } else {
                        handleErrorSnackBar()
                    }
                } else if (e.shiftKey && !editTable && directTyping && e.keyCode >= 65 && e.keyCode <= 90) {
                    e.preventDefault();
                    handleCellClick({ tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, direct: directTyping, randomKeyValue: e.key });
                    directTyping = false;
                } else if (!e.shiftKey) {
                    switch (e.keyCode) {
                        // Backspace, ContextMenu, CapsLock, Page Up, Page Down, Home, Insert, Delete, Help, Alt, Ctrl, F1-F12, NumLock
                        case 8:
                        case 35: // End Key
                        case 93:
                        case 20:
                        case 33:
                        case 34:
                        case 36:
                        case 45:
                        case 46:
                        case 47:
                        case 17:
                        case 18:
                        case 112:
                        case 113:
                        case 114:
                        case 115:
                        case 116:
                        case 117:
                        case 118:
                        case 119:
                        case 120:
                        case 121:
                        case 122:
                        case 123:
                        case 144:
                        case 173: // Mute Key
                        case 174: // Volume Down
                        case 175: // Volumn Up
                        case 177: // Media Track Previous
                        case 179: // Media Play Pause
                        case 176: // Media Track Next
                        case 91: // Meta
                            break;

                        // Enter
                        case 13:
                            handleEnter();
                            break;

                        // Escape Key
                        case 27:
                            handleEscape();
                            break;

                        // Left Key
                        case 37:
                            if (!editTable) {
                                e.preventDefault();
                                newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, false);
                                handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                            }
                            break;

                        // Tab Key
                        case 9:
                            e.preventDefault();
                            const err = await handleNameError();
                            if (!err) {
                                if (isChanged) handleSubmit(editTableData);
                                newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, true);
                                handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                                break;
                            } else {
                                handleErrorSnackBar()
                            }

                        // Right Key
                        case 39:
                            if (!editTable) {
                                e.preventDefault();
                                newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, true);
                                handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                            }
                            break;

                        // Top Key
                        case 38:
                            if (!editTable) {
                                e.preventDefault();
                                newCell = getTopAndBottomTableCell(tableType, dataIndex, keyIndex, props.person, false);
                                handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                            }
                            break;

                        // Bottom Key
                        case 40:
                            if (!editTable) {
                                e.preventDefault();
                                newCell = getTopAndBottomTableCell(tableType, dataIndex, keyIndex, props.person, true);
                                handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                            }
                            break;

                        default:
                            if (!editTable && directTyping) {
                                e.preventDefault();
                                handleCellClick({ tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, direct: directTyping, randomKeyValue: e.key });
                                directTyping = false;
                            }
                            break;
                    }
                }
            }
        }
    }

    const handleKeyEvents = (key, e) => {
        handleKeyDown(e)
    }

    const handleNameCellClick = (cellName) => {
        if (cellName === "firstName") firstCell = true;
        else firstCell = false;
    }

    const handleNameKeyDown = async (e) => {
        if (editTableData) {

            const { tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, editTable } = editTableData;

            if (tableType === latestEditTable) {
                let newCell;

                if (e.shiftKey && e.keyCode === 9) {
                    if (firstCell && isChanged) {
                        handleNameSubmit(editTableData, localNameDetails);
                        e.preventDefault();
                        newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, false);
                        handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                    } else if (firstCell) {
                        e.preventDefault();
                        newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, false);
                        handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                    } else {
                        firstCell = true;
                    }
                } else if (!e.shiftKey) {
                    switch (e.keyCode) {
                        // Backspace, ContextMenu, CapsLock, Page Up, Page Down, Home, Insert, Delete, Help, Alt, Ctrl, F1-F12, NumLock
                        case 8:
                        case 35: // End Key
                        case 93:
                        case 20:
                        case 33:
                        case 34:
                        case 36:
                        case 45:
                        case 46:
                        case 47:
                        case 17:
                        case 18:
                        case 112:
                        case 113:
                        case 114:
                        case 115:
                        case 116:
                        case 117:
                        case 118:
                        case 119:
                        case 120:
                        case 121:
                        case 122:
                        case 123:
                        case 144:
                        case 173: // Mute Key
                        case 174: // Volume Down
                        case 175: // Volumn Up
                        case 177: // Media Track Previous
                        case 179: // Media Play Pause
                        case 176: // Media Track Next
                        case 91: // Meta
                        // Left Key
                        case 37:
                            break;
                        // Tab Key
                        case 9:
                            const err = await handleNameDetailsError();
                            if (!err) {
                                if (firstCell) {
                                    firstCell = false;
                                } else if (!firstCell && isChanged) {
                                    handleNameSubmit(editTableData, localNameDetails);
                                    e.preventDefault();
                                    newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, true);
                                    handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                                    break;
                                } else {
                                    e.preventDefault();
                                    newCell = getNextAndPrevTableCell(tableType, dataIndex, keyIndex, props.person, true);
                                    handleCellClick({ tableType: newCell.newTableType, dataRow: newCell.newDataRow, keyValue: newCell.newKeyValue, dataIndex: newCell.newDataIndex, keyIndex: newCell.newKeyIndex, lastRow: newCell.lastRow });
                                    break;
                                }
                            } else {
                                handleErrorSnackBar()
                            }

                        // Right Key
                        case 39:
                        // Top Key
                        case 38:
                        // Bottom Key
                        case 40:
                            break;

                        // Enter
                        case 13:
                            handleNameBlur();
                            break;

                        // Escape Key
                        case 27:
                            handleEscape();
                            break;

                        default:
                            if (!editTable && directTyping) {
                                e.preventDefault();
                                handleCellClick({ tableType, dataRow, keyValue, dataIndex, keyIndex, lastRow, direct: directTyping, randomKeyValue: e.key });
                                directTyping = false;
                            }
                            break;
                    }
                }

            }
        }
    }

    const handleEnter = async () => {
        const err = await handleNameError();
        if (!err) {
            let changedData = {
                ...editTableData,
                editTable: !editTableData.editTable
            }
            setEditTableData(changedData);
            if (isChanged) handleSubmit(changedData);
            if (!changedData.editTable) handleSelected(changedData);
            else handleRemoveSelected();
        } else {
            handleErrorSnackBar()
        }
    }

    const handleEscape = () => {
        let changedData = {
            ...freshData,
            editTable: false
        }
        localNameDetails = {
            firstName: freshData.dataRow ?.firstName,
            lastName: freshData.dataRow ?.lastName
        }
        setNameDetails(localNameDetails);
        setEditTableData(changedData);
        handleSelected(changedData);
        setError(false);
    }

    const handleChange = (e) => {
        if (e && e.target) {
            const selector = editTableData && (editTableData.type === "select" || editTableData.type === "location") ? true : false;
            isChanged = true;
            const updateCell = {
                ...editTableData,
                value: titleCase(e.target.value),
                editTable: selector ? false : editTableData.editTable,
                locationId : e.target.locationId || "" ,
            }
            setEditTableData(updateCell);
            setError(false);
            if (selector) handleSubmit(updateCell);
        } else {
            handleBlur()
        }
    }

    const handleNameDetails = (e) => {
        isChanged = true;
        localNameDetails = {
            ...nameDetails,
            [e.target.name]: e.target.value
        }
        setNameDetails(localNameDetails);
        setError(false);
    }

    const handleClose = () => {
        let changedData = {
            ...editTableData,
            editTable: false
        }
        setEditTableData(changedData);
        handleSelected(changedData);
    }

    const handleBlur = async () => {
        const err = await handleNameError();
        if (!err) {
            let changedData = {
                ...editTableData,
                editTable: false
            }
            setEditTableData(changedData)
            if (isChanged) handleSubmit(changedData)
            handleSelected(changedData);
        } else {
            handleErrorSnackBar()
        }
    }

    const handleNameError = () => {
        return new Promise((resolve) => {
            if ((editTableData.name === "givenName" && trimString(props.person.personalInfo.surname.surname) === "" && trimString(editTableData.value) === "") || (editTableData.name === "surname" && trimString(props.person.personalInfo.givenName.givenName) === "" && trimString(editTableData.value) === "")) {
                resolve(true)
            } else {
                resolve(false);
            }
        })
    }

    const handleNameDetailsError = () => {
        return new Promise((resolve) => {
            if (trimString(localNameDetails.firstName) || trimString(localNameDetails.lastName)) {
                resolve(false)
            } else {
                resolve(true);
            }
        })
    }

    const handleErrorSnackBar = () => {
        dispatch(addMessage(nameError, "error"));
        let oldData = {
            ...freshData,
            editTable: false,
            value: freshData.dataRow[freshData.name]
        }
        localNameDetails = {
            firstName: freshData.dataRow ?.firstName,
            lastName: freshData.dataRow ?.lastName
        }
        setNameDetails(localNameDetails);
        handleSelected(oldData);
        setEditTableData(oldData);
    }

    const handleNameBlur = async () => {
        const err = await handleNameDetailsError();
        if (!err) {
            let changedData = {
                ...editTableData,
                editTable: false
            }
            setEditTableData(changedData);
            if (isChanged) handleNameSubmit(changedData, localNameDetails)
            handleSelected(changedData);
        } else {
            handleErrorSnackBar()
        }
    }

    const handleNameSubmit = (updatedValues, updatedNameDetails) => {
        let existedData = editTableData.dataRow;
        let changedKey = updatedValues.name;

        const payload = {
            ...existedData,
            tableType: updatedValues.tableType,
            nameDetails: updatedNameDetails
        };

        // Updating Fresh Data
        const freshCellData = getFreshData(payload, changedKey);
        setFreshData(freshCellData);

        handleSelected(updatedValues);
        // Api Calling
        props.handleUpdate(payload, changedKey);
    }

    const handleSubmit = (updatedValues) => {
        let existedData = editTableData.dataRow;
        let changedKey = updatedValues.name;
        const payload = {
            ...existedData,
            tableType: updatedValues.tableType,
            locationId: updatedValues.locationId,
            [changedKey]: updatedValues.value
        };

        // Updating Fresh Data
        const freshCellData = getFreshData(payload, changedKey);
        setFreshData(freshCellData);

        handleSelected(updatedValues);
        // Api Calling
        props.handleUpdate(payload, changedKey);
    }

    const getPropsForDetail = () => {
        return {
            getValue,
            getClasses,
            getCellId,
            handleCellClick,
            editTableData,
            handleBlur,
            handleChange,
            handleClose,
            handleKeyDown,
            handleNameKeyDown,
            handleNameCellClick,
            inputWidth,
            nameDetails,
            handleNameDetails,
            handleNameBlur,
            error,
            ...props
        }
    }

    const getTabs = () => {
        switch (props.tab) {
            case 0:
                return <Stories {...props} />

            case 2:
                return <Research {...props} />

            case 1:
            default:
                return (
                    <>
                        <KeyboardEventHandler handleKeys={['all']} onKeyEvent={handleKeyEvents} />
                        <EventPopover
                            anchorEl={props.eventPop}
                            handleClose={props.closeEventPop}
                            value={props.newEvent ? props.newEvent.name : ''}
                            handleNewEvent={props.handleNewEvent}
                            loading={props.addingLifeEvent}
                        />
                        <Details {...getPropsForDetail()} />
                    </>
                )
        }
    }

    return getTabs();
}

export default Content;