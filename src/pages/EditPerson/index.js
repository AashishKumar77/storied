import React from 'react'

// Components
import Dialog from "../../components/Dialog";
import Loader from "../../components/Loader";

// Common
import PersonForm from "../Common/PersonForm";

// Utils
import { modalType } from "../../utils";
import { tr } from "../../components/utils";
import { titleCase } from "../../components/utils/titlecase";

import { useTranslation } from "react-i18next"

const { EDIT_PERSON } = modalType;

const EditPerson = ({ personLoading, modalPerson, handleCancel, handleSave, ...props }) => {
    const from = "quick-edit";

    const handleSaveEdit = () => {
        handleSave(EDIT_PERSON)
    }

    const { t } = useTranslation();

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
            header={modalPerson ? ` ${tr(t, "pedigree.dialog.header.edit")} ${titleCase(modalPerson.firstName)} ${titleCase(modalPerson.lastName)}` : ""}
            content={modalPerson ? <PersonForm modalPerson={modalPerson} from={from} {...props} /> : <div className="flex justify-center items-center h-52"><Loader /></div>}
            handleClose={handleCancel}
            handleCancel={handleCancel}
            handleSave={handleSaveEdit}
            loading={personLoading}
            disabled={!checkDisable()}
        />
    )
}

export default EditPerson;