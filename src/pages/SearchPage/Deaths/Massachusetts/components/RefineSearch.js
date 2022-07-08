import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
    getFirstAndLastName,
    getDisabledOptions,
    CheckExactField,
    CheckExactFieldLocation,
    getResidenceText,
    getYearsOptions,
} from "../../../../../utils";
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
    width = "",
    massachusettsDefaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitMassachusetts,
}) => {
    const handleMassachusettsSubmit = (values, { setSubmitting }) => {
        handleSubmitMassachusetts(values, { setSubmitting });
    };
    const showMassachussetsNameDiv = massachusettsDefaultValues?.fm.t || massachusettsDefaultValues?.ln.t;


    const getDeathOptions = () => {
        if (massachusettsDefaultValues.Death?.levelData) {
            return massachusettsDefaultValues.Death.levelData.residenceLevel;
        }
        return {};
    };

    const getDeathFieldDropdowns = (
        setFieldValue,
        bool,
        name,
        nameId,
        locationfield
    ) => {
        if (bool) {
            return (
                <Field
                    name={nameId}
                    component={TWDropDownComponent}
                    onChange={CheckExactFieldLocation.bind(
                        this,
                        setFieldValue,
                        locationfield
                    )}
                    options={getDeathOptions()}
                />
            );
        } else {
            return (
                <Field
                    name={name}
                    component={TWDropDownComponent}
                    options={getResidenceText()}
                    onChange={CheckExactField.bind(this, setFieldValue)}
                />
            );
        }
    };


    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleMassachusettsSubmit}
                initialValues={massachusettsDefaultValues}
            >
                {({ dirty, isSubmitting, isValid, setFieldValue }) => (
                    <Form name="deathsForm" className="w-full">
                        <div className="flex flex-wrap mb-3 md:mb-2.5">
                            <div className={`w-full ${width} pt-1 mb-3`}>
                                {/** First name Last Name **/}
                                {showMassachussetsNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Name</p>
                                        </div>
                                        {massachusettsDefaultValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {massachusettsDefaultValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            massachusettsDefaultValues.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {massachusettsDefaultValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${massachusettsDefaultValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {massachusettsDefaultValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            massachusettsDefaultValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {massachusettsDefaultValues?.d?.y?.y && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Death Year</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {massachusettsDefaultValues?.d?.y?.y}
                                            </div>
                                            <div className="ml-auto">
                                                <Field
                                                    name={`d.y.s`}
                                                    component={TWDropDownComponent}
                                                    onChange={CheckExactField.bind(this, setFieldValue)}
                                                    options={getYearsOptions()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {massachusettsDefaultValues?.d?.l?.l && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs"> Death Place</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {massachusettsDefaultValues.d?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getDeathFieldDropdowns(
                                                    setFieldValue,
                                                    massachusettsDefaultValues.d?.li?.i,
                                                    "d.l.s",
                                                    "d.li.s",
                                                    massachusettsDefaultValues.Death
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        {/** Form Button **/}
                        <div className="mb-2 md:pt-6 flex justify-between w-full">
                            <div className="buttons ml-auto flex">
                                <div className="mr-1.5">
                                    <Button
                                        title="Edit Search"
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowModal(true);
                                        }}
                                        type="default"
                                    />
                                </div>
                                <Button
                                    disabled={!dirty || isSubmitting || !isValid}
                                    buttonType="submit"
                                    title={isSubmitting ? "Loading..." : buttonTitle}
                                />
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default RefineSearch;
