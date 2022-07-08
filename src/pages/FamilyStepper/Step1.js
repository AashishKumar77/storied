import React, { useState } from "react";

// Components
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Input from "../../components/Input";
import SearchLocation from "../../components/SearchLocation";

import { tr } from "../../components/utils";
import { useTranslation } from 'react-i18next';

const Step1 = ({ handleBackStep, userForm, handleInputChange, checkDisabled, handleStartNewTree }) => {
    const [birthPlace, setBirthPlace] = useState({ id: null, name: userForm.birthPlace });
    const { t } = useTranslation();
    const handleBirthPlace = (value) => {
        if(value && value.name) {
            const { id, name } = value;
            setBirthPlace({ id, name });
            const e = {
                target: {
                    name: "birthPlace",
                    value: name,
                    birthLocationId: id || ""
                }
            }
            handleInputChange(e);
        }
    }

    return (
        <>
            <div className="mt-0">
                <Typography size={24}
                    weight="medium"
                    text="secondary"
                    tkey="family.stepper.startTree.step1.title"
                />
            </div>
            <div className="mt-2">
                <Typography
                    size={14}
                    weight="light"
                    text="secondary"
                    tkey="family.stepper.startTree.step1.desc"
                />
            </div>

            <div className="mt-6">
                <div className="flex flex-col">
                    <div className="mr-0">
                        <Input
                            id="firstName"
                            type="text"
                            handleChange={handleInputChange}
                            name="firstName"
                            value={userForm.firstName}
                            placeholder={tr(t,"f&mName")}
                            label="family.stepper.startTree.step1.labels.name"
                        />
                    </div>
                    <div className="mt-1">
                        <Input
                            id="lastName"
                            type="text"
                            handleChange={handleInputChange}
                            name="lastName"
                            value={userForm.lastName}
                            placeholder={tr(t,"LastName")}
                        />
                    </div>
                </div>

                <div className="mt-4 w-52">
                    <Input
                        id="birthDate"
                        type="text"
                        handleChange={handleInputChange}
                        name="birthDate"
                        value={userForm.birthDate}
                        placeholder="family.stepper.startTree.step1.placeHolders.birth"
                        label="family.stepper.startTree.step1.labels.birth"
                    />
                </div>
                <div className="mt-2">
                    <SearchLocation
                        placeholder="family.stepper.startTree.step1.placeHolders.birthPlace"
                        handleSelectedValue={handleBirthPlace}
                        value={birthPlace}
                        searchString={userForm.birthPlace}
                        freeSolo={true}
                    />
                </div>
            </div>
            
            <div className="start-tree-btn">
                <div className="mr-2">
                    <Button
                        type="default"
                        size="large"
                        tkey="family.stepper.startTree.step1.backButton"
                        handleClick={handleBackStep}
                    />
                </div>
                <div className="mr-0">
                    <Button
                        type="primary"
                        size="large"
                        handleClick={handleStartNewTree}
                        tkey="family.stepper.startTree.step1.nextButton"
                        disabled={checkDisabled()}
                    />
                </div>
            </div>
        </>
    );
}

export default Step1;