import React from 'react'

// Components
import Dialog from "../../components/Dialog";
import Translator from '../../components/Translator';
import Loader from "../../components/Loader";
import { titleCase } from "../../components/utils/titlecase";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { modalType, MALE, FEMALE, OTHER } from "../../utils";

const { ADD_FATHER_OR_MOTHER } = modalType;

const AddParentViaPlaceholder = ({ personLoading, modalPerson, handleCancel, handleSave, ...props }) => {
    const handleSaveParent = () => {
        handleSave(ADD_FATHER_OR_MOTHER)
    }

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

    const getHeader = () => {
        switch (true) {
            case (modalPerson && modalPerson.gender == MALE):
                return <span><Translator tkey="pedigree.dialog.header.father" />{` ${titleCase(props.childName)}`}</span>
            case (modalPerson && modalPerson.gender == FEMALE):
                return <span><Translator tkey="pedigree.dialog.header.mother" />{` ${titleCase(props.childName)}`}</span>
            case (modalPerson && modalPerson.gender == OTHER):
                return <span><Translator tkey="pedigree.dialog.header.other" />{` ${titleCase(props.childName)}`}</span>
        }
    }
    
    return (
        <Dialog
            open={true}
            actions={modalPerson ? true : false}
            header={getHeader()}
            content={
                modalPerson ?
                    <PersonForm modalPerson={modalPerson} {...props} />
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={handleCancel}
            handleCancel={handleCancel}
            handleSave={handleSaveParent}
            loading={personLoading}
            disabled={!checkDisable()}
            cancelButton="Cancel"
            saveButton="Save"
        />
    )
}

export default AddParentViaPlaceholder;