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

const { ADD_PARENT } = modalType;

const AddParent = ({ personLoading, modalPerson, dropDownPayload, handleCancel, handleSave, handleSibling, ...props }) => {
    const [showBottomSection, setShowBottomSection] = useState(false);

    const handleSaveParent = () => {
        handleSave(ADD_PARENT)
    }

    useEffect(() => {
        if (dropDownPayload && dropDownPayload.length > 0 && modalPerson && !showBottomSection) {
            modalPerson.siblings = dropDownPayload
            setShowBottomSection(true);
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
            header={modalPerson && `Parent of ${titleCase(modalPerson.selectedName)}`}
            content={
                modalPerson ?
                    <>
                        <PersonForm modalPerson={modalPerson} {...props} />
                        {showBottomSection && modalPerson.siblings && modalPerson.siblings.length > 0
                            && <BottomSection siblings={modalPerson.siblings} handleSibling={handleSibling} />}
                    </>
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={handleCancel}
            handleCancel={handleCancel}
            handleSave={handleSaveParent}
            loading={personLoading}
            disabled={!checkDisable()}
            hideCancelButton={true}
            saveButton="Add Person"
        />
    )
}

export default AddParent;

const BottomSection = ({ siblings, handleSibling }) => {

    return (
        <div className="border-t border-gray-300 mt-4">

            <div className="modal-row mt-2">
                <Typography
                    text="secondary"
                    size={16}
                    weight="bold"
                >
                    Include these people as children of this parent:
                </Typography>
            </div>
            {
                siblings.map((ele, idx) =>
                    <div key={idx} className="modal-row mt-0.5 -m-3">
                        <Checkbox id={ele.id} obj={ele} checked={ele.check} color="primary" label={`${ele.firstName} ${ele.lastName}`} labelColor="secondary" handleChange={handleSibling} />
                    </div>
                )
            }
        </div>
    )
}