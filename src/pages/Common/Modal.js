import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Screens
import AddChild from "../AddFamily/AddChild";
import AddParent from "../AddFamily/AddParent";
import AddSibling from "../AddFamily/AddSibling";
import AddSpouse from "../AddFamily/AddSpouse";
import EditPerson from "../EditPerson";
import AddParentViaPlaceholder from "../AddFamily/AddParentViaPlaceholder";

// Actions
import { clearOptionsPayload, cancelModal, saveParent, saveSpouse, saveSibling, saveChild, getBirthAutoCompleteTest, getDeathAutoCompleteTest } from "../../redux/actions/family";

// Utils
import { OTHER, editPersonData, newPersonData, modalType } from "../../utils";

const { ADD_CHILD, ADD_PARENT, ADD_SIBLING, ADD_SPOUSE, EDIT_PERSON, ADD_FATHER_OR_MOTHER } = modalType;

const Modal = ({
    treeId,
    modalAction,
    setModalAction,
    redirectUrl,
    newParent,
    family: { personLoading, editPerson, newPerson, parentAdded, spouseAdded, updatedPerson, siblingAdded, childAdded, parentAddedViaPlaceholder, dropDownPayload, birthPlaceOptions, deathPlaceOptions, closeModalStatus },
    person: { refetchedData },
    dispatchCancelModal,
    dispatchSaveParent,
    dispatchSaveSpouse,
    dispatchSaveSibling,
    dispatchSaveChild,
    dispatchGetBirthAutoCompleteTest,
    dispatchGetDeathAutoCompleteTest,
    dispatchClearOptions,
    ...props
}) => {
    const [modalPerson, setModalPerson] = useState(null);
    const eventRef = useRef();
    const pageRef = useRef(1);
    const prevHeight = useRef(0);
    const refId = useRef();
    const [birthLocation, setBirthLocation] = useState();
    const [deathLocation, setDeathLocation] = useState();

    // Edit Person
    useEffect(() => {
        if (editPerson) {
            const editedDetails = editPersonData(editPerson);
            setModalPerson(editedDetails);
            setBirthLocation(editedDetails.birthPlace);
            setDeathLocation(editedDetails.deathPlace);
        }
    }, [setModalPerson, editPerson]);

    // New Person
    useEffect(() => {
        if (newPerson) {
            const newDetails = newPersonData(modalAction, newPerson);
            setModalPerson(newDetails);
        }
    }, [setModalPerson, newPerson, modalAction]);

    // Add Action Done
    useEffect(() => {
        if (parentAdded) redirectUrl(ADD_PARENT);
        if (spouseAdded) redirectUrl(ADD_SPOUSE);
        if (siblingAdded) redirectUrl(ADD_SIBLING);
        if (childAdded) redirectUrl(ADD_CHILD);
        if (parentAddedViaPlaceholder) redirectUrl(ADD_FATHER_OR_MOTHER);
        if (updatedPerson) redirectUrl(EDIT_PERSON);
    }, [parentAdded, spouseAdded, siblingAdded, childAdded, parentAddedViaPlaceholder, redirectUrl]);

    useEffect(() => {
        if (newParent) {
            const newDetails = newPersonData(modalAction, newParent);
            setModalPerson(newDetails);
        }
    }, [modalAction, newParent, setModalPerson])

    // Common Modal
    const handleCancel = async () => {
        setModalAction(null);
        setModalPerson(null);
        await dispatchCancelModal()
    }

    // Close Modal
    useEffect(() => {
        if (refetchedData) handleCancel()
        if (closeModalStatus) handleCancel()
    }, [setModalAction, setModalPerson, dispatchCancelModal, refetchedData, closeModalStatus])

    //Debounce on birth location change
    useEffect(() => {
        if (birthLocation) {
            const delayDebounce = setTimeout(() => {
                dispatchGetBirthAutoCompleteTest(birthLocation, refId.current);
            }, 250)

            return () => {
                return clearTimeout(delayDebounce)
            }
        }
    }, [birthLocation, dispatchGetBirthAutoCompleteTest])

    //Debounce on death location change
    useEffect(() => {
        if (deathLocation) {
            const delayDebounceFn = setTimeout(() => {
                dispatchGetDeathAutoCompleteTest(deathLocation, refId.current);
            }, 250)

            return () => {
                return clearTimeout(delayDebounceFn)
            }
        }
    }, [deathLocation, dispatchGetDeathAutoCompleteTest])

    useEffect(() => {
        if (pageRef.current > 1) {
            eventRef.current.target.scrollTop = prevHeight.current
        }
    }, [birthPlaceOptions, deathPlaceOptions])

    // Modal Form Handling
    const handleIsLiving = (value) => {
        if (value) {
            setModalPerson({
                ...modalPerson,
                isLiving: true,
                death: "",
                deathPlace: "",
                deathLocationId: ""
            })
        } else {
            setModalPerson({
                ...modalPerson,
                isLiving: false,
            })
        }
    }

    const handleChange = (e) => {
        const { name, value, birthLocationId, deathLocationId } = e.target;
        if (birthLocationId || birthLocation === "") {
            setModalPerson({
                ...modalPerson,
                [name]: value,
                birthLocationId: birthLocationId || ""
            })
        }
        else if(deathLocationId || deathLocationId === "") {
            setModalPerson({
                ...modalPerson,
                [name]: value,
                deathLocationId: deathLocationId || ""
            })
        }
        else {
            setModalPerson({
                ...modalPerson,
                [name]: value,
            })
        }
    }

    const handleGender = (value) => {
        setModalPerson({
            ...modalPerson,
            gender: value === OTHER ? OTHER : value
        })
    }

    const handleSibling = (e, sibling) => {
        let mySiblings = modalPerson.siblings.reduce((res, ele) => {
            if (ele.id === sibling.id) {
                res.push({
                    ...ele,
                    check: e.target.checked
                })
            } else {
                res.push(ele);
            }
            return res;
        }, []);
        setModalPerson({
            ...modalPerson,
            siblings: mySiblings
        })
    }

    // Save Parent Via Placeholder
    const handleSaveParentViaPlaceholder = async () => {
        await props.saveplaceholderParents(modalPerson);
    }

    // Save Parent
    const handleSaveParent = async () => {
        await dispatchSaveParent(modalPerson);
    }

    // Save Spouse
    const handleSaveSpouse = async () => {
        await dispatchSaveSpouse(newPerson, modalPerson);
    }

    // Save Sibling
    const handleSaveSibling = async () => {
        await dispatchSaveSibling(newPerson, modalPerson);
    }

    // Save Child
    const handleSaveChild = async () => {
        await dispatchSaveChild(newPerson, modalPerson);
    }

    const handleSaveParents = (option, gender) => {
        setModalPerson({
            ...modalPerson,
            existingParentIds: [
                option.id,
                option.spouseId,
            ],
            unknownGender: gender
        })
    }

    const handleSaveSpouses = (option, gender) => {
        setModalPerson({
            ...modalPerson,
            existingParentIds: [
                option.id,
                option.spouseId
            ],
            unknownGender: gender
        })
    }

    const handleChildren = (e, c) => {
        let myChildren = modalPerson.children.reduce((res, ele) => {
            if (ele.id === c.id) {
                res.push({
                    ...ele,
                    check: e.target.checked
                })
            } else {
                res.push(ele);
            }
            return res;
        }, []);
        setModalPerson({
            ...modalPerson,
            children: myChildren
        })
    }

    // Save Edit Modal
    const handleSaveEdit = () => {
        props.handleSaveEdit(editPerson, modalPerson, treeId);
        if(modalPerson.firstName.trim() !=="" || modalPerson.lastName.trim() !== "")
            handleCancel();
    }

    const handleSave = (modal) => {
        switch (modal) {
            case ADD_CHILD:
                handleSaveChild();
                break;

            case ADD_PARENT:
                handleSaveParent();
                break;

            case ADD_SIBLING:
                handleSaveSibling();
                break;

            case ADD_SPOUSE:
                handleSaveSpouse();
                break;

            case EDIT_PERSON:
                handleSaveEdit();
                break;

            case ADD_FATHER_OR_MOTHER:
                handleSaveParentViaPlaceholder();
                break;
            default:
                break;
        }
    }

    const loadMoreBirthPlaces = () => {
        const { birthPlace } = modalPerson
        dispatchGetBirthAutoCompleteTest(birthPlace, refId.current, pageRef.current);
    }

    const loadMoreDeathPlaces = () => {
        const { deathPlace } = modalPerson;
        dispatchGetBirthAutoCompleteTest(deathPlace, refId.current, pageRef.current);
    }

    const clearOptions = (type) => {
        dispatchClearOptions(type);
    }

    const getPropsForModal = () => {
        return {
            personLoading,
            modalPerson,
            handleCancel,
            handleSave,
            handleIsLiving,
            handleChange,
            handleGender,
            handleSibling,
            handleChildren,
            handleSaveParents,
            handleSaveSpouses,
            dropDownPayload,
            birthPlaceOptions,
            deathPlaceOptions,
            loadMoreBirthPlaces,
            loadMoreDeathPlaces,
            pageRef,
            eventRef,
            refId,
            prevHeight,
            setBirthLocation,
            setDeathLocation,
            clearOptions,
            ...props
        }
    }

    switch (modalAction) {
        case ADD_CHILD:
            return (
                <AddChild {...getPropsForModal()} />
            )

        case ADD_PARENT:
            return (
                <AddParent {...getPropsForModal()} />
            )

        case ADD_SIBLING:
            return (
                <AddSibling {...getPropsForModal()} />
            )

        case ADD_SPOUSE:
            return (
                <AddSpouse {...getPropsForModal()} />
            )

        case EDIT_PERSON:
            return (
                <EditPerson {...getPropsForModal()} />
            )

        case ADD_FATHER_OR_MOTHER:
            return (
                <AddParentViaPlaceholder {...getPropsForModal()} />
            )

        default:
            return null;

    }
}

Modal.propTypes = {
    family: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    family: state.family,
    person: state.person
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchSaveParent: (modalPerson) => dispatch(saveParent(modalPerson)),
        dispatchSaveSibling: (newPerson, modalPerson) => dispatch(saveSibling(newPerson, modalPerson)),
        dispatchSaveSpouse: (newPerson, modalPerson) => dispatch(saveSpouse(newPerson, modalPerson)),
        dispatchSaveChild: (newPerson, modalPerson) => dispatch(saveChild(newPerson, modalPerson)),
        dispatchCancelModal: () => dispatch(cancelModal()),
        dispatchGetBirthAutoCompleteTest: (value, reqId, page) => dispatch(getBirthAutoCompleteTest(value, null, reqId, page)),
        dispatchGetDeathAutoCompleteTest: (value, reqId, page) => dispatch(getDeathAutoCompleteTest(value, null, reqId, page)),
        dispatchClearOptions: (type) => dispatch(clearOptionsPayload(type)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Modal);
