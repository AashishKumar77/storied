import React,{useState} from "react";
import "./index.css";

// Components
import Input from "../../components/Input";
import SelectButton from "../../components/SelectButton";
import Checkbox from "../../components/Checkbox";
import Typography from "../../components/Typography";
import Location from "../../components/SearchLocation/Location";


import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from "uuid";

//utlis
import { tr } from "../../components/utils"

import { MALE, FEMALE, OTHER } from '../../utils';

const PersonForm = ({ modalPerson: { firstName, lastName, isLiving, gender, birth, birthPlace, death, deathPlace }, setBirthLocation, setDeathLocation,
    handleIsLiving, handleChange, handleGender, clearOptions, birthPlaceOptions, deathPlaceOptions, pageRef, eventRef, refId, prevHeight, loadMoreBirthPlaces, loadMoreDeathPlaces }) => {
    const { t } = useTranslation();
    const [selectedBirthValue, setSelectedBirthValue] = useState({ id: null, name: birthPlace});
    const [selectedDeathValue, setSelectedDeathValue] = useState({ id: null, name: deathPlace});

    const handleCheck = (event) => {
        if(event.target.checked) setSelectedDeathValue({ id : null, name : ""})
        handleIsLiving(event.target.checked);
    }

    const handleBirthPlace = (value) => {
        if(value && value.name){
            const {id, name} = value
            setSelectedBirthValue({id, name})
        const e = {
            target: {
                name: "birthPlace",
                value: value.name,
                birthLocationId: id || "" 
            }
        }
        handleChange(e);
    } 
    else {
        clearOptions('birthPlace')
        setSelectedBirthValue({ id : null, name : ""})
        const e = {
            target: {
                name: "birthPlace",
                value: ""
            }
        }
        handleChange(e);
    }
    }

    const handleDeathPlace = (value) => {
        if (value && value.name) {
            const { id, name } = value
            setSelectedDeathValue({ id, name })
            const e = {
                target: {
                    name: "deathPlace",
                    value: value.name,
                    deathLocationId: id || "" 
                }
            }
            handleChange(e);
        }
        else {
            setSelectedDeathValue({ id : null, name : ""})
            clearOptions('deathPlace')
            const e = {
                target: {
                    name: "deathPlace",
                    value: ""
                }
            }
            handleChange(e);
        }
    }

    const handleBirthInputChange = (e, val, reason) => {
        if (reason !== 'reset') {
            setBirthLocation(val);
            handleBirthPlace({ id: null, name: val });
            pageRef.current = 1
            refId.current = uuidv4()
        }
    }

    const handleDeathInputChange = (e, val, reason) => {
        if (reason !== 'reset') {
            setDeathLocation(val);
            handleDeathPlace({ id: null, name: val });
            pageRef.current = 1
            refId.current = uuidv4()
        }
    }

    return (
        <>
            <div className="modal-res-row">
                <div className="w-full smm:w-3/5 mb-2 smm:mb-0">
                    <Input
                        id="firstName"
                        label={tr(t,"f&mName")}
                        type="text"
                        name="firstName"
                        value={firstName}
                        placeholder=""
                        autoFocus="autoFocus"
                        position = {firstName.length}
                        handleChange={handleChange}
                    />
                </div>
                <div className="w-full smm:w-2/5 ml-0 smm:ml-2">
                    <Input
                        id="lastName"
                        label={tr(t,"LastName")}
                        type="text"
                        name="lastName"
                        value={lastName}
                        placeholder=""
                        handleChange={handleChange}
                    />
                </div>
            </div>
            <div className="modal-row">
                <div className="mb-1">
                    <Typography
                        size={14}
                        text="default"
                        tkey="pedigree.dialog.form.gender"
                    >
                    </Typography>
                </div>
                <div className="flex">
                    <SelectButton
                        title={tr(t, "pedigree.dialog.gender.male")}
                        select={gender === MALE ? true : false}
                        handleSelect={handleGender}
                    />
                    <SelectButton
                        title={tr(t, "pedigree.dialog.gender.female")}
                        select={gender === FEMALE ? true : false}
                        handleSelect={handleGender}
                    />
                    <SelectButton
                        title={tr(t, "pedigree.dialog.gender.other")}
                        select={gender === OTHER ? true : false}
                        handleSelect={handleGender}
                    />
                </div>
            </div>
            <div className="modal-row modal-res-row">
                <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
                    <Input
                        id="birth"
                        label="pedigree.dialog.form.bdoy"
                        type="text"
                        name="birth"
                        value={birth}
                        placeholder=""
                        handleChange={handleChange}
                    />
                </div>
                <div className="w-full smm:w-2/3 ml-0 smm:ml-2">
                        <>
                            <Typography
                                size={14}
                                text="default"
                                tkey="pedigree.dialog.form.bplace"
                            >
                            </Typography>
                            <div className="mt-1">
                                <Location
                                    locationId="birthPlace"
                                    placeholder="pedigree.dialog.form.placeholder.bplace"
                                    value={selectedBirthValue}
                                    searchString={birthPlace}
                                    options={birthPlaceOptions}
                                    handleChange={(e, val) => handleBirthPlace(val)}
                                    handleInputChange={handleBirthInputChange}
                                    loadMore={loadMoreBirthPlaces}
                                    pageRef={pageRef}
                                    prevHeight={prevHeight}
                                    eventRef={eventRef}
                                />
                            </div>
                        </>
                </div>
            </div>

            {
                !isLiving &&
                <div className="modal-row modal-res-row">
                    <div className="w-full smm:w-1/3 mb-2 smm:mb-0">
                        <Input
                            id="death"
                            label="pedigree.dialog.form.ddoy"
                            type="text"
                            name="death"
                            value={death}
                            placeholder=""
                            handleChange={handleChange}
                        />
                    </div>
                    <div className="w-full smm:w-2/3 ml-0 smm:ml-2">
                            <>
                                <Typography
                                    size={14}
                                    text="default"
                                    tkey="pedigree.dialog.form.dplace"
                                >
                                </Typography>
                                <div className="mt-1">
                                    <Location
                                        locationId="deathPlace"
                                        placeholder="pedigree.dialog.form.placeholder.dplace"
                                        handleSelectedValue={handleDeathPlace}
                                        value={selectedDeathValue}
                                        searchString={deathPlace}
                                        options={deathPlaceOptions}
                                        handleChange={(e, val) => handleDeathPlace(val)}
                                        handleInputChange={handleDeathInputChange}
                                        loadMore={loadMoreDeathPlaces}
                                        pageRef={pageRef}
                                        prevHeight={prevHeight}
                                        eventRef={eventRef}
                                    />
                                </div>
                            </>
                    </div>
                </div>
            }
            <div className="modal-row -m-3">
                <Checkbox id="isLiving" obj={null} checked={isLiving} color="primary" label="pedigree.nodeform.living" labelColor="secondary" handleChange={handleCheck} />
            </div>
        </>
    )
}

export default PersonForm;