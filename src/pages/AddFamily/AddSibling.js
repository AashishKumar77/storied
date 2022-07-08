import React, { useEffect, useState } from "react";

// Components
import Dialog from "../../components/Dialog";
import Input from "../../components/Input";
import Loader from "../../components/Loader";
import DialogDropdown from "../../components/Dropdown/DialogDropdown";
import { titleCase } from "../../components/utils/titlecase";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { FEMALE, MALE, modalType, OTHER } from "../../utils";

const { ADD_SIBLING } = modalType;

const AddSibling = ({ personLoading, modalPerson, dropDownPayload, handleCancel, handleSave, handleSaveParents, ...props }) => {
    const [option, setOption] = useState(null);
    const [disableDropdown, setDisableDropdown] = useState(false);
    const [optiongender, setGender] = useState(null);
    const [showBottomSection, setShowBottomSection] = useState(false);
    const blankId = "00000000-0000-0000-0000-000000000000";

    useEffect(() => {
        if (dropDownPayload && dropDownPayload.length > 0 && modalPerson && !showBottomSection) {
            modalPerson.parents = dropDownPayload
            setShowBottomSection(true);
        }
    }, [dropDownPayload, modalPerson, showBottomSection])

    useEffect(() => {
        if (modalPerson && modalPerson.parents && modalPerson.parents.length > 0) {
            const { parents } = modalPerson;
            if (parents && parents.length === 1) {
                const singleParent = parents[0];
                setOption(singleParent);
                setDisableDropdown(true);
                if (!modalPerson.existingParentIds) {
                    const gender = singleParent.gender;
                    switch (gender) {
                        case MALE: setGender("Mother's")
                            handleSaveParents(singleParent, FEMALE);
                            break;
                        case FEMALE: setGender("Father's")
                            handleSaveParents(singleParent, MALE);
                            break;
                        default: setGender("Unknown Parent's")
                            handleSaveParents(singleParent, OTHER);
                            break;
                    }
                }
            }
            if (parents && parents.length === 3 && !modalPerson.existingParentIds) {
                const bothParents = parents.filter(i => i.spouseId !== blankId);
                const bothParentOption = bothParents[0];
                setOption(bothParentOption);
                handleSaveParents(bothParentOption, null);
            }
        }
    }, [modalPerson, handleSaveParents])

    const handleSaveSibling = () => {
        handleSave(ADD_SIBLING)
    }

    const handleOnChange = (event, newValue) => {
        if (event.target.textContent !== null || event.target.textContent !== "") {
            setOption(newValue)
            if (event.target.textContent.includes("Unknown")) {
                if (event.target.textContent.includes("Father")) {
                    setGender("Father's")
                    handleSaveParents(newValue, MALE);
                }
                else if (event.target.textContent.includes("Mother")) {
                    setGender("Mother's");
                    handleSaveParents(newValue, FEMALE);
                }
                else {
                    setGender("Unknown Parent's");
                    handleSaveParents(newValue, OTHER);
                }
            }
            else {
                handleSaveParents(newValue, null);
                setGender(null)
            }
        }

    }

    const checkDisable = () => {
        if (modalPerson) {
            const { firstName, lastName, existingParentIds } = modalPerson
            if ((firstName || lastName) && (existingParentIds)) {
                return false
            }
        }
        return true;
    }

    
    return (
        <Dialog
            open={true}
            actions={modalPerson ? true : false}
            header={modalPerson && `Sibling of ${titleCase(modalPerson.selectedName)}`}
            content={
                modalPerson ?
                    <>
                        <PersonForm modalPerson={modalPerson} {...props} />
                        {showBottomSection && modalPerson.parents && modalPerson.parents.length > 0 && <BottomSection
                            modalPerson={modalPerson}
                            option={option}
                            disableDropdown={disableDropdown}
                            optiongender={optiongender}
                            handleOnChange={handleOnChange}
                            {...props}
                        />}
                    </>
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={handleCancel}
            handleCancel={handleCancel}
            handleSave={handleSaveSibling}
            disabled={checkDisable()}
            loading={personLoading}
            saveButton="Add Person"
            hideCancelButton
        />
    )
}
const BottomSection = ({ modalPerson: { pfirstName, plastName, parents }, disableDropdown, handleOnChange, handleChange, optiongender, option }) => {
    let middleName = ""
    if (optiongender === "Mother's")
        middleName = "Maiden"
    else
        middleName = "Last"
    return (
        <>
            <div className="modal-row w-full mb-3 smm:mb-0">
                <DialogDropdown label="Parents" isDisabled={disableDropdown} selected={option} handleOnChange={handleOnChange} options={parents} />
            </div>

            {optiongender &&
                <div className="modal-res-row mt-3">
                    <div className="w-full smm:w-3/5 smm:mb-0">
                        <Input
                            id="pfirstName"
                            label={`${optiongender} First & Middle Name(s)`}
                            type="text"
                            name="pfirstName"
                            value={pfirstName}
                            placeholder={""}
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="w-full smm:w-2/5 ml-0 smm:ml-2">
                        <Input
                            id="plastName"
                            label={`${optiongender} ${middleName} Name(s)`}
                            type="text"
                            name="plastName"
                            value={plastName}
                            placeholder={""}
                            handleChange={handleChange}
                        />
                    </div>
                </div>}
        </>
    )
}
export default AddSibling;
