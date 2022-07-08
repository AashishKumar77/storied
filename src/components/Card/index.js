import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import "./index.css";
import { titleCase } from "../utils/titlecase"
// Local Components
import GetPopOver from "./GetPopOver";
import { CardContent } from "./CardContent";
import FileSelector from "./FileSelector";
import defaultImage from "./defaultImage.png";
import { validateForm, emptyErrors } from "./validations";
import { handlePanActions, getPanPopOver, setPanPopOver } from "./helpers";

// Utils
import { cardType } from "../utils";
import { showBirthandDeath } from "shared-logics";

const { FOCUSED_LIVING, FOCUSED_DECEASED, MEDIUM_IMG, MEDIUM_NEXT_GEN, SMALL_IMG, SMALL_NEXT_GEN } = cardType;

const Card = ({
    id,
    parentId,
    cFilialId,
    type,
    path,
    title,
    firstName,
    firstNameWithInitials,
    lastName,
    isLiving,
    gender,
    birth,
    birthPlace,
    death,
    deathPlace,
    imgsrc,
    relatedParentIds,
    ...props
}) => {
    const node = useRef();
    const formRef = useRef();
    const [myObj] = useState({ id, parentId, cFilialId, type, path, title, firstName,firstNameWithInitials, lastName, isLiving, gender, birth: birth?.RawDate, birthPlace, death: death?.RawDate, deathPlace, imgsrc, relatedParentIds });
    const [tooltip, setTooltip] = useState(type === MEDIUM_NEXT_GEN && path === "0" && localStorage.getItem("card-tooltip") === "true" ? true : false);
    const [formData, setFormData] = useState({ id, parentId, cFilialId, type, path, title, firstName,firstNameWithInitials, lastName, isLiving, gender, birth, birthPlace, death, deathPlace, imgsrc, relatedParentIds });
    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const [popId, setPopId] = useState(undefined);
    const [subMenu, setSubMenu] = useState(false);
    const [errorMessage, setErrorMessage] = useState({});
    const checkImageURL = (url) => {
        if (url.match(/\.(jpeg|jpg|gif|png|jfif)$/)) return url;
        else if (type === FOCUSED_LIVING || type === FOCUSED_DECEASED) return defaultImage;
        else return null;
    };
    const imageURL = checkImageURL(imgsrc);

    const getNextGen = () => {
        switch (type) {
            case MEDIUM_NEXT_GEN:
            case SMALL_NEXT_GEN: return true
            default: return false;
        }
    }
    const nextGen = getNextGen()

    const checkHideAddParent = (checkParentIds) => {
        const lengthOfKeys = checkParentIds ? Object.keys(checkParentIds).length : 0
        return lengthOfKeys === 2 ? true : false;
    }
    const hideAddParent = checkHideAddParent(relatedParentIds);

    const checkHideAddSibling = (checkParentIds) => {
        const lengthOfKeys = checkParentIds ? Object.keys(checkParentIds).length : 0
        return lengthOfKeys > 0 ? true : false;
    }
    const hideAddSibling = checkHideAddSibling(relatedParentIds);

    useEffect(() => {
        document.addEventListener("click", handleOutSide);

        return () => {
            document.removeEventListener("click", handleOutSide);
        };
    }, []);

    const handleOutSide = e => {
        if (node && node.current && node.current.contains(e.target)) {
            // Detect Inside
            return;
        }
        // Detect Outside
    };

    const handlePopOpen = (event) => {
        const openPop = event.currentTarget;
        setAnchorEl(openPop);
        setOpen(Boolean(openPop));
        setPopId("simple-popover");
    }

    const handlePopClose = () => {
        setAnchorEl(null);
        setOpen(false);
        setPopId(undefined);
        setSubMenu(false);
        setErrorMessage({});
        emptyErrors();
    }

    const handleOpen = (event) => {
        const clickedElementType = event.target.nodeName;
        if ((clickedElementType !== 'LABEL') && (clickedElementType !== 'INPUT')) {
            handlePanActions(event, props.handleViewBox, type);
            if (tooltip) handleCloseTour();
            else {
                handlePopOpen(event);
                setFormData({ id, parentId, cFilialId, type, path, title, firstName,firstNameWithInitials,lastName, isLiving, gender, birth, birthPlace, death, deathPlace, imgsrc, relatedParentIds });
            }
        }
    };
    //New approach to add father or mother via nodes
    const handleNextGeneration = () => {
        props.handleNextGeneration(myObj)
    }
    const resetPanning = () => {
        if (getPanPopOver()) {
            const popOver = document.getElementById("simple-popover");
            const nodeForm = document.getElementById("nodeForm");
            popOver.style.inset = "0px 0px 0px 0px";
            nodeForm.style.marginLeft = "0px";
            setPanPopOver(false);
        }
    }
    //Old approach to add father or mother
    const handleClose = async () => {
        if (formRef.current && formRef.current.isValid) {
            if (Object.keys(errorMessage).length > 0 || Object.keys(formRef.current.errors).length > 0) {
                handlePopClose();
            } else {
                if (formRef.current.values.firstName) {
                    const result = await props.handleSubmit(formRef.current.values);
                    if (result && result.status === 200) {
                        props.handleSaveParents();
                        handlePopClose();
                    } else {
                        handleErrors(formRef, result);
                    }
                } else {
                    handlePopClose();
                }
            }
        } else {
            handlePopClose();
        }
    };

    const handleChange = (e, setFieldValue) => {
        resetPanning();
        if (e.preventDefault) e.preventDefault();
        setFieldValue(e.target.name, e.target.value);
        const errors = validateForm(e.target.name, e.target.value);
        if (errors) handleErrors(formRef, errors);
        else handleErrors(formRef, null);
    }

    const handleErrors = (myFormRef, errors) => {
        if (errors) {
            myFormRef && myFormRef.current && myFormRef.current.setErrors(errors);
            setErrorMessage(errors);
        } else {
            myFormRef && myFormRef.current && myFormRef.current.setErrors(null);
            setErrorMessage({});
        }
    }

    const handleIsLiving = (value) => {
        resetPanning();
        if (value) {
            formRef.current.setFieldValue("isLiving", true);
            formRef.current.setFieldValue("death", "");
            formRef.current.setFieldValue("deathPlace", "");
        } else formRef.current.setFieldValue("isLiving", false);
        handleErrors(formRef, null);
    }

    const handleKeyDown = (e) => {
        switch (e.keyCode) {
            // Enter
            case 13:
                handleClose();
                break;

            // Tab
            case 27:
                handlePopClose();
                break;

            default:
                break;
        }
    }

    const handleMenu = (menu) => {
        if (menu === 3) {
            resetPanning();
            setSubMenu(true);
        } else {
            handlePopClose();
            props.handleCardMenu(menu, myObj);
        }
    }

    const handleUploader = (event) => {
        handlePopClose();
        var fileList = event.target.files;
        if (imageURL.includes("data:image/png;base64")) props.handleImageUploader(fileList, myObj);
    }

    const handleCloseTour = () => {
        setTooltip(false);
        localStorage.setItem("card-tooltip", false);
        localStorage.setItem("new-tree", false);
    }

    const getPropsForCardContent = () => {
        return { type, firstName,firstNameWithInitials,lastName, birth, birthPlace, death, deathPlace, isLiving, imageURL, checkFileSelector, handleUploader }
    }

    const getPropsForPopOver = (focusMenu) => {
        return {
            popId,
            open,
            anchorEl,
            handleClose,
            formData,
            handleChange,
            handleKeyDown,
            nextGen,
            type,
            handlePanActions,
            firstName,
            firstNameWithInitials,
            lastName,
            handleIsLiving,
            handleMenu,
            focusMenu,
            handleViewBox: props.handleViewBox,
            subMenu,
            hideAddParent,
            hideAddSibling,
            formRef,
            errorMessage
        }
    }

    const checkFileSelector = () => {
        return !imgsrc && imageURL.includes("data:image/png;base64");
    }

    switch (type) {
        case FOCUSED_LIVING:
            return (
                <div ref={node} className="wa-focused-card focused-card text-white">
                    <div className="flex living" aria-describedby={popId} onClick={handleOpen}>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="align-top w-12">
                                        {checkFileSelector() ? <FileSelector handleUploader={handleUploader} /> : <img src={imageURL} alt="card-pic-medium" className="w-full h-12 rounded-lg" />}
                                    </td>
                                    <td>
                                        <div className="flex focus-node-width p-0">
                                            <div className="pl-2">
                                                <div className="text-base typo-font-medium  max-w-xs mb-0.5 truncate">{`${titleCase(firstNameWithInitials)} ${titleCase(lastName)}`}</div>
                                                <div className="text-xs my-0 ml-3.92 max-w-city truncate">{`B: ${titleCase(birth.RawDate)}`}</div>
                                                <div className="text-xs focus:my-0 ml-3.92 max-w-city truncate">{`${titleCase(birthPlace)}`}</div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <GetPopOver {...getPropsForPopOver(false)} content={<CardContent {...getPropsForCardContent()} />} />
                </div>
            );

        case FOCUSED_DECEASED:
            return (
                <div ref={node} className="wa-focused-card focused-card text-white ">
                    <div className="flex deceased" aria-describedby={popId} onClick={handleOpen}>
                        <table className="w-full ">
                            <tbody>
                                <tr>
                                    <td className="align-top w-12">
                                        {checkFileSelector() ? <FileSelector handleUploader={handleUploader} /> : <img src={imageURL} alt="card-pic-xlarge" className="h-12 w-12 rounded-lg" />}
                                    </td>
                                    <td className="">
                                        <div className="flex focus-node-width">
                                            <div className="pl-2">
                                                <div className="text-base typo-font-medium  max-w-xs mb-0.5 truncate">{`${titleCase(firstNameWithInitials)} ${titleCase(lastName)}`}</div>
                                                <div className="mb-2">
                                                    <p className="text-xs my-0 ml-3.92 max-w-city truncate">{`B: ${titleCase(birth.RawDate)}`}</p>
                                                    <p className=" text-xs my-0 ml-3.92 max-w-city truncate">{`${titleCase(birthPlace)}`}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs my-0 ml-3.92 max-w-city truncate">{`D: ${titleCase(death.RawDate)}`}</p>
                                                    <p className="text-xs my-0 ml-3.92 max-w-city truncate">{`${titleCase(deathPlace)}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <GetPopOver {...getPropsForPopOver(false)} content={<CardContent {...getPropsForCardContent()} />} />
                </div>
            );

        case MEDIUM_NEXT_GEN:
                return (
                    <div ref={node} className="wa-card-nextGen">
                        <div className="flex" aria-describedby={popId} onClick={handleNextGeneration}>
                            <div className="px-4 py-3.5">
                                <div className="text-xs typo-font-medium truncate w-44 text-gray-600">+ {title}</div>
                            </div>
                        </div>
                        <GetPopOver {...getPropsForPopOver(true)} />
                    </div>
                );
        case SMALL_IMG:
            return (
                <div ref={node} className="wa-card-small">
                    <div className="flex" aria-describedby={popId} onClick={handleOpen}>
                        {imageURL && <span className="h-6 w-6" > <img src={imageURL} alt="card-pic-medium" className="w-5 h-5 m-0.5 rounded-l cardImage" /></span>}
                        <div className={`${imageURL ? 'px-2' : 'px-4'} py-1`}>
                            <div className={`w-44 text-xs typo-font-medium  truncate`}>{`${titleCase(firstNameWithInitials)} ${titleCase(lastName)}`}</div>
                        </div>
                    </div>
                    <GetPopOver {...getPropsForPopOver(true)} content={<CardContent {...getPropsForCardContent()} />} />
                </div>
            );

        case SMALL_NEXT_GEN:
            return (
                <div ref={node} className="wa-card-nextGen h-6.25 ">
                    <div className="flex" aria-describedby={popId} onClick={handleNextGeneration}>
                        <div className="px-4 py-0.5">
                            <div className="text-xs typo-font-medium  truncate w-44 text-gray-600">+ {title}</div>
                        </div>
                    </div>
                    <GetPopOver {...getPropsForPopOver(true)} />
                </div>
            );

        case MEDIUM_IMG:
        default:
            return (
                <div ref={node} className="wa-card-medium">
                    <div className="flex max-w-fitcontent" aria-describedby={popId} onClick={handleOpen}>
                        <span className="h-12">
                            {imageURL && <img src={imageURL} alt="card-pic-medium" className="h-11 w-11 m-0.5 rounded-l cardImage" />}
                        </span>
                        <div className={`${imageURL ? 'px-2' : 'px-4'} py-1 flex flex-col justify-center  max-w-fitcontent`}>
                            <div className={`${imageURL ? 'w-36' : 'w-46'} text-xs typo-font-medium max-h-fitcontent max-w-fitcontent truncate mb-0.5`}>{`${titleCase(firstNameWithInitials)} ${titleCase(lastName)}`}</div>
                            <p className="text-vs my-0 truncate w-36">{showBirthandDeath(birth.Year, death.Year, isLiving)}</p>
                        </div>
                    </div>
                    <GetPopOver {...getPropsForPopOver(true)} content={<CardContent {...getPropsForCardContent()} />} />
                </div>
            );
    }
}

Card.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    type: PropTypes.oneOf([FOCUSED_LIVING, FOCUSED_DECEASED, MEDIUM_IMG, MEDIUM_NEXT_GEN, SMALL_IMG, SMALL_NEXT_GEN]),
    title: PropTypes.string,
    firstName: PropTypes.string,
    firstNameWithInitials:PropTypes.string,
    lastName: PropTypes.string,
    isLiving: PropTypes.bool,
    gender: PropTypes.string,
    birth: PropTypes.string,
    birthPlace: PropTypes.string,
    death: PropTypes.string,
    deathPlace: PropTypes.string
};

Card.defaultProps = {
    id: "id",
    type: MEDIUM_IMG,
    title: "Kathryns Mother",
    firstName: "Kimberly Marie",
    firstNameWithInitials:"Kimberly M",
    lastName: "Walker",
    isLiving: true,
    gender: "Male",
    birth: "1 Jan 1940",
    birthPlace: "Los Angeles, California",
    death: "1 Dec 1990",
    deathPlace: "Los Angeles, California"
}

export default Card;