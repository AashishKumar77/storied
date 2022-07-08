import React, { useState, useEffect } from "react";

// Components
import Dialog from "../../components/Dialog";
import Input from "../../components/Input";
import Loader from "../../components/Loader";
import DialogDropdown from "../../components/Dropdown/DialogDropdown";
import { titleCase } from "../../components/utils/titlecase"
// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { FEMALE, MALE, modalType, OTHER } from "../../utils";

const { ADD_CHILD } = modalType;

const AddChild = ({ personLoading, modalPerson, dropDownPayload, handleCancel, handleSave, handleSaveSpouses, ...props }) => {
    const [option, setOption] = useState(null);
    const [optiongender, setGender] = useState(null);
    const [disableDropdown, setDisableDropdown] = useState(false);
    const [showBottomSection, setShowBottomSection] = useState(false);
    const blankId = "00000000-0000-0000-0000-000000000000";
    useEffect(() => {
        if (dropDownPayload && dropDownPayload.spouses && dropDownPayload.spouses.length > 0 && modalPerson && !showBottomSection) {
            modalPerson.spouses = dropDownPayload.spouses
            setShowBottomSection(true);
        }
    }, [dropDownPayload, modalPerson, showBottomSection])

    const handleSaveChild = () => {
        handleSave(ADD_CHILD)
    }

    useEffect(() => {
        if (modalPerson && modalPerson.spouses && modalPerson.spouses.length > 0) {
            const { spouses, nodeGender } = modalPerson;
            if (spouses && spouses.length === 1) {
                const unknownSpouse = spouses[0]
                setOption(unknownSpouse);
                setDisableDropdown(true);
                if (!modalPerson.existingParentIds) {
                    switch (nodeGender) {
                        case MALE: setGender("Mother's")
                            handleSaveSpouses(unknownSpouse, FEMALE);
                            break;
                        case FEMALE: setGender("Father's")
                            handleSaveSpouses(unknownSpouse, MALE);
                            break;
                        default: setGender("Unknown Parent's")
                            handleSaveSpouses(unknownSpouse, OTHER);
                            break;
                    }
                }
            }
            if (spouses && spouses.length === 2 && !modalPerson.existingParentIds) {
                const bothSpouses = spouses.filter(i => i.spouseId !== blankId);
                const bothSpousesOption = bothSpouses[0];
                setOption(bothSpousesOption);
                handleSaveSpouses(bothSpousesOption, null);
            }
        }
    }, [modalPerson, handleSaveSpouses])

    const handleOnChange = (event, newValue) => {
        if (
            event.target.textContent !== null ||
            event.target.textContent !== ""
        ) {
            setOption(newValue);
            if (event.target.textContent.includes("Unknown")) {
                if (event.target.textContent.includes("Father")) {
                    setGender("Father's");
                    handleSaveSpouses(newValue, MALE);
                } else if (event.target.textContent.includes("Mother")) {
                    setGender("Mother's");
                    handleSaveSpouses(newValue, FEMALE);
                }
                else {
                    setGender("Unknown Parent's");
                    handleSaveSpouses(newValue, OTHER);
                }
            } else {
                handleSaveSpouses(newValue, null);
                setGender(null);
            }
        }
    };

    const checkDisable = () => {
        if (modalPerson) {
            const { firstName, lastName, existingParentIds } = modalPerson
            if ((firstName || lastName) && (existingParentIds)) {
                return false
            }
        }
        return true
    }

    
    return (
        <Dialog
            open={true}
            actions={true}
            header={modalPerson && `Child of ${titleCase(modalPerson.selectedName)}`}
            content={
                modalPerson ?
                    <>
                        <PersonForm modalPerson={modalPerson} {...props} />
                        {showBottomSection && modalPerson.spouses && modalPerson.spouses.length > 0 && <BottomSection
                            modalPerson={modalPerson}
                            optiongender={optiongender}
                            option={option}
                            disableDropdown={disableDropdown}
                            handleOnChange={handleOnChange}
                            {...props}
                        />}
                    </>
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={handleCancel}
            handleCancel={handleCancel}
            handleSave={handleSaveChild}
            loading={personLoading}
            disabled={checkDisable()}
            saveButton="Add Person"
            hideCancelButton
        />
    )
}

const BottomSection = ({ modalPerson: { pfirstName, plastName, spouses }, disableDropdown, handleOnChange, handleChange, optiongender, option }) => {
    let middleName = ""
    if (optiongender === "Mother's")
        middleName = "Maiden"
    else
        middleName = "Last"
    return (
        <>
            <div className="modal-row w-full mb-3 smm:mb-0">
                <DialogDropdown label="Parents" handleOnChange={handleOnChange} isDisabled={disableDropdown} options={spouses} selected={option} />
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
export default AddChild;