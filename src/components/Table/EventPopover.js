import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';

// Components
import Typography from "../Typography";
import Button from "../Button";
import TableLocation from "../SearchLocation/TableLocation";

// Utils
import { setLocationChanged } from "../utils/location";

const useStyles = makeStyles((theme) => ({
    paper: {
        background: "transparent",
        marginTop: "-3.25rem",
        '@media (max-width:1025px)': {
            maxWidth: "100%",
            left: "0 !important"
        }
    },
}));

const getEmptyForm = (value) => {
    return [
        {
            id: 'age',
            type: 'text',
            name: 'age',
            value: '',
            autoFocus: true,
            editMode: false
        },
        {
            id: 'type',
            type: 'text',
            name: 'type',
            value,
            autoFocus: true,
            editMode: false,
        },
        {
            id: 'date',
            type: 'text',
            name: 'date',
            value: '',
            autoFocus: true,
            editMode: true,
        },
        {
            id: 'location',
            type: 'text',
            name: 'location',
            value: '',
            autoFocus: true,
            editMode: false,
        },
        {
            id: 'description',
            type: 'text',
            name: 'description',
            value: '',
            autoFocus: true,
            editMode: false,
        }
    ]
}

const nonEditTableCells = ["age", "type"];
let location = {
    target: {
        name: "location",
        value: ""
    }
};
let isLocationChange = false;
let focusedButton = "";
const FOCUS_INTERVAL = 100;
const CANCEL_BUTTON = "CancelButton";
const SAVE_BUTTON = "SaveButton";

const EventPopover = ({ anchorEl, handleClose, ...props }) => {
    const classes = useStyles();
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const [formData, setFormData] = useState([]);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        setFormData(getEmptyForm(props.value));
    }, [props.value]);

    const handleCancel = () => {
        location = {
            target: {
                name: "location",
                value: ""
            }
        };
        isLocationChange = false;
        focusedButton = "";
        setFormData(getEmptyForm(props.value))
        handleClose();
    }
    const getDisabled = (newForm) => {
        const checkArr = ["date", "location", "description"];
        let disabled = true;
        for (let isDisableLoop of newForm) {
            if (isDisableLoop.value && checkArr.includes(isDisableLoop.name)) disabled = false;
        }
        return disabled;
    }

    const handleChange = (e) => {
        const { name, value, locationId  } = e.target;
        const newForm = JSON.parse(JSON.stringify(formData));
        const newItem = newForm.find(e1 => e1.name === name);
        newItem.value = value;
        const disableForm = getDisabled(newForm);
        setDisable(disableForm);
        setTimeout(() => {
            setFormData(newForm);
            if (name === "location") handleCellClick(newForm[4], value, locationId)
        }, 10)
    }

    const handleCellClick = (selectedCell, value, locationId) => {
        if (!nonEditTableCells.includes(selectedCell.name)) {
            handleHighLight(selectedCell.name);
            const newForm = formData;
            const newEditMode = newForm.reduce((res, ele) => {
                res.push({
                    ...ele,
                    editMode: selectedCell.name === ele.name ? true : false,
                    value: ele.name === "location" && value ? value : ele.value,
                    locationId:  ele.name === "location" && locationId ? locationId : ""
                });
                return res;
            }, []);
            setFormData(newEditMode);
        }
    }

    const handleSubmit = () => {
        props.handleNewEvent(formData);
        setDisable(true);
    }

    const handleLocation = (value) => {
        isLocationChange = true;
        if (value && value.name) {
            const { name } = value;
            location = {
                target: {
                    name: 'location',
                    value: name,
                    locationId: value.id || ""
                }
            }
        } else {
            location = {
                target: {
                    name: 'location',
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
        }
    }

    const handleLocationBlur = () => {
        if (isLocationChange) {
            isLocationChange = false;
            handleChange(location);
        }
    }

    const handleLocationKeyDown = (e) => {
        location = {
            target: {
                name: "location",
                value: e.target.value
            }
        }
        handleKeyDown(e);
    }

    const handleEmptyValue = () => {
        const newForm = JSON.parse(JSON.stringify(formData));
        const newItem = newForm.find(e1 => e1.name === "location");
        newItem.value = "";
        const disableForm = getDisabled(newForm);
        setDisable(disableForm);
        setTimeout(() => {
            setFormData(newForm);
        }, 10)
    }

    const handleKeyDown = (e) => {
        if (e.shiftKey && e.keyCode === 9) {
            const prevCell = getPrevInputCell();
            if (prevCell) {
                e.preventDefault();
                setNewInputCell(prevCell);
                return;
            } else if ((focusedButton === CANCEL_BUTTON && disable) || focusedButton === SAVE_BUTTON) {
                e.preventDefault();
                setNewInputCell("description");
                focusedButton = "";
                return;
            } else if (focusedButton === CANCEL_BUTTON && !disable) {
                e.preventDefault();
                setNewInputCell(prevCell);
                const saveButton = document.getElementById("table-modal-save");
                setTimeout(() => {
                    if (saveButton) saveButton.focus();
                }, FOCUS_INTERVAL);
                focusedButton = SAVE_BUTTON;
                return;
            } else if (focusedButton === "") {
                e.preventDefault();
                setNewInputCell(prevCell);
                const cancelButton = document.getElementById("table-modal-cancel");
                setTimeout(() => {
                    if (cancelButton) cancelButton.focus();
                }, FOCUS_INTERVAL);
                focusedButton = CANCEL_BUTTON;
                return;
            }
        } else if (!e.shiftKey) {
            if (e.keyCode === 9 || e.keyCode === 13) {
                if (e.keyCode === 13 && (focusedButton === SAVE_BUTTON || focusedButton === CANCEL_BUTTON)) return;
                const nextCell = getNextInputCell();
                if (nextCell) {
                    e.preventDefault();
                    setNewInputCell(nextCell);
                    return;
                } else if ((focusedButton === "" && disable) || focusedButton === SAVE_BUTTON) {
                    e.preventDefault();
                    setNewInputCell(nextCell);
                    const cancelButton = document.getElementById("table-modal-cancel");
                    setTimeout(() => {
                        if (cancelButton) cancelButton.focus();
                    }, FOCUS_INTERVAL);
                    focusedButton = CANCEL_BUTTON;
                    return;
                } else if (focusedButton === "" && !disable) {
                    e.preventDefault();
                    setNewInputCell(nextCell);
                    const saveButton = document.getElementById("table-modal-save");
                    setTimeout(() => {
                        if (saveButton) saveButton.focus();
                    }, FOCUS_INTERVAL);
                    focusedButton = SAVE_BUTTON;
                    return;
                } else if (focusedButton === CANCEL_BUTTON) {
                    e.preventDefault();
                    setNewInputCell("date");
                    focusedButton = "";
                    return;
                }
            }
        }
    }

    const getNextInputCell = () => {
        const currentCell = formData.find((ele) => ele.editMode);
        if (currentCell) {
            switch (currentCell.name) {
                case "date":
                    return "location";

                case "location":
                    return "description";

                default:
                    return null;
            }
        } else {
            return null;
        }
    }

    const getPrevInputCell = () => {
        const currentCell = formData.find((ele) => ele.editMode);
        if (currentCell) {
            switch (currentCell.name) {
                case "location":
                    return "date";

                case "description":
                    return "location";

                default:
                    return null;
            }
        } else {
            return null;
        }
    }

    const setNewInputCell = (nextName) => {
        if (nextName === "location") setLocationChanged(false);
        if (nextName === "description") handleChange(location);
        handleHighLight(nextName);
        let newFormData = formData;
        const updatedFormData = newFormData.reduce((res, ele) => {
            res.push({
                ...ele,
                editMode: ele.name === nextName && nextName !== null ? true : false,
            });
            return res;
        }, []);
        setFormData(updatedFormData);
    }

    const handleHighLight = (selectedId) => {
        setTimeout(() => {
            const highLight = document.getElementById(selectedId);
            if (highLight) highLight.select();
        }, FOCUS_INTERVAL)
    }

    return (
        <>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleCancel}
                elevation={0}
                classes={{
                    paper: classes.paper
                }}
            >
                <InputTable
                    handleCancel={handleCancel}
                    formData={formData}
                    disable={disable}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleCellClick={handleCellClick}
                    handleLocation={handleLocation}
                    handleLocationClose={handleLocationClose}
                    handleLocationBlur={handleLocationBlur}
                    handleLocationKeyDown={handleLocationKeyDown}
                    handleKeyDown={handleKeyDown}
                    handleEmptyValue={handleEmptyValue}
                    {...props}
                />
            </Popover>
        </>
    );
}

export default EventPopover;

const InputTable = ({ formData, handleCancel, ...props }) => {

    return (
        <div className="flex flex-col overflow-y-visible  overflow-x-hidden pl-0 pr-0 xl:pl-0 xl:pr-3 ">
            <div className="flex justify-end py-1 px-1 xl:px-3 xl:-mx-5" tabIndex={props.disable ? '0' : '1'} onKeyDown={props.handleKeyDown}>
                <Button
                    title="Cancel"
                    type="link-white"
                    size="large"
                    icon="delete"
                    disabled={false}
                    handleClick={handleCancel}
                    id="table-modal-cancel"
                />
            </div>
            <div className="allevent-table-responsive ">
                <div className="allevent-table ">
                    <div className="allevent-row t-head">
                        <div className="allevent-cell all-age">Age</div>
                        <div className="allevent-cell all-event">Event</div>
                        <div className="allevent-cell all-date">Date</div>
                        <div className="allevent-cell all-location">Location</div>
                        <div className="allevent-cell all-description">Description</div>
                    </div>
                    <div className="allevent-row t-body">
                        {formData && formData.map((data, idx) => {
                            return <InputTableCell data={data} idx={idx} {...props} />
                        })}
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap justify-between mt-4 px-4 xl:px-1 pb-1">
                <Typography
                    text="white-color"
                    weight="light"
                    size={14}
                >
                    You can tab or click through fields to edit
                </Typography>
                <div className="flex mt-3 smm:mt-0 w-full smm:w-auto ml-auto" tabIndex={props.disable ? '1' : '0'} onKeyDown={props.handleKeyDown}>
                    <Button
                        title="Save"
                        type="primary"
                        size="large"
                        disabled={props.disable}
                        loading={props.loading}
                        handleClick={props.handleSubmit}
                        id="table-modal-save"
                    />
                </div>
            </div>
        </div>
    )
}

const InputTableCell = ({ data, idx, ...props }) => {

    if (data.editMode) {
        return (
            <div key={idx} className="allevent-cell">
                <div className="allevent-box">
                    <div className="allevent-control">
                        {
                            data.name === "location" ?
                                <div className="w-full shadow-1x">
                                    <TableLocation
                                        handleSelectedValue={props.handleLocation}
                                        searchString={data.value}
                                        placeholder="search.unisearchform.autocomplete"
                                        freeSolo={true}
                                        inputRef={true}
                                        handleClose={props.handleLocationClose}
                                        handleBlur={props.handleLocationBlur}
                                        handleKeyDown={props.handleLocationKeyDown}
                                        highLight={true}
                                        handleEmptyValue={props.handleEmptyValue}
                                    />
                                </div>
                                :
                                <input
                                    id={data.id}
                                    type={data.type}
                                    name={data.name}
                                    value={data.value}
                                    autoFocus={data.autoFocus}
                                    onChange={props.handleChange}
                                    onKeyDown={props.handleKeyDown}
                                />
                        }
                    </div>
                </div>
            </div>
        )
    } else {
        return <div key={idx} className="allevent-cell" onClick={() => props.handleCellClick(data)}>
            <div className="allevent-cell-text">
                {data.value}
            </div>
        </div>
    }
}