import React, { useEffect, useState } from "react";

// Components
import Dialog from "../../components/Dialog";
import Loader from "../../components/Loader";
import Typography from "../../components/Typography";
import Checkbox from "../../components/Checkbox";
import { titleCase } from "../../components/utils/titlecase";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { modalType } from "../../utils";

const { ADD_SPOUSE } = modalType;

const AddSpouse = ({ personLoading, modalPerson, dropDownPayload, handleCancel, handleSave, handleChildren, ...props }) => {
    const [showBottomSection, setShowBottomSection] = useState(false);

    const handleSaveSpouse = () => {
        handleSave(ADD_SPOUSE)
    }

    useEffect(() => {
        if (dropDownPayload && dropDownPayload.children && modalPerson && !showBottomSection) {
            modalPerson.children = dropDownPayload.children
            setShowBottomSection(true)
        }
    }, [dropDownPayload, modalPerson, showBottomSection])

    const checkDisable = () => {
        if (modalPerson) {
            if (modalPerson.requiredGender) {
                return modalPerson.gender && (modalPerson.firstName || modalPerson.lastName)
            } else {
                return (modalPerson.firstName || modalPerson.lastName)
            }
        } else {
            return true;
        }
    }

    return (
        <Dialog
            open={true}
            actions={modalPerson ? true : false}
            header={modalPerson && `Spouse of ${titleCase(modalPerson.selectedName)}`}
            content={
                modalPerson ?
                    <>
                        <PersonForm modalPerson={modalPerson} {...props} />
                        {showBottomSection && modalPerson.children && modalPerson.children.length > 0 && <BottomSection children={modalPerson.children} handleChildren={handleChildren} />}
                    </>
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={handleCancel}
            handleCancel={handleCancel}
            handleSave={handleSaveSpouse}
            loading={personLoading}
            disabled={!checkDisable()}
            hideCancelButton={true}
            saveButton="Add Person"
        />
    )
}

export default AddSpouse;

const BottomSection = ({ children, handleChildren }) => {

    return (
        <div className="border-t border-gray-300 mt-4">

            <div className="modal-row mt-2">
                <Typography
                    text="secondary"
                    size={16}
                    weight="bold"
                >
                    Include these people as children of this spouse:
                </Typography>
            </div>
            {
                children.map((ele, idx) =>
                    <div key={idx} className="modal-row mt-0.5 -m-3">
                        <Checkbox id={ele.id} obj={ele} checked={ele.check} color="primary" label={`${ele.firstName} ${ele.lastName}`} labelColor="secondary" handleChange={handleChildren} />
                    </div>
                )
            }
        </div>
    )
}