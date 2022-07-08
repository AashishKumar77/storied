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
    getFormattedDate,
    DateDropdownValues,
} from "../../../../../utils";

const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
    width = "",
    ohioDefaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitOhio,
}) => {
    const handleOhioSubmit = (values, { setSubmitting }) => {
        handleSubmitOhio(values, { setSubmitting });
    };
    const showMassachussetsNameDiv = ohioDefaultValues?.fm.t || ohioDefaultValues?.ln.t;


    const getOhioDeathOptions = () => {
        if (ohioDefaultValues.Death?.levelData) {
            return ohioDefaultValues.Death.levelData.residenceLevel;
        }
        return {};
    };

    const getDeathFieldDropdowns = (
        name,
        nameId,
        locationfield,
        setFieldValue,
        bool,
    ) => {
        if (bool) {
            return (
                <Field
                    name={nameId}
                    component={TWDropDownComponent}
                    options={getOhioDeathOptions()}
                    onChange={CheckExactFieldLocation.bind(
                        this,
                        setFieldValue,
                        locationfield
                    )}
                />
            );
        } else {
            return (
                <Field
                    name={name}
                    onChange={CheckExactField.bind(this, setFieldValue)}
                    component={TWDropDownComponent}
                    options={getResidenceText()}
                />
            );
        }
    };


    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleOhioSubmit}
                initialValues={ohioDefaultValues}
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
                                        {ohioDefaultValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {ohioDefaultValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            ohioDefaultValues.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {ohioDefaultValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${ohioDefaultValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {ohioDefaultValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            ohioDefaultValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {ohioDefaultValues?.d?.y?.y && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Death Date</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {getFormattedDate(ohioDefaultValues?.d.y.y, ohioDefaultValues?.d.y.m, ohioDefaultValues?.d.y.d)}
                                            </div>
                                            <div className="ml-auto">
                                                <Field
                                                    name={`d.y.s`}
                                                    options={DateDropdownValues(ohioDefaultValues.d.y.y, ohioDefaultValues.d.y.m, ohioDefaultValues.d.y.d)}
                                                    component={TWDropDownComponent}
                                                    onChange={CheckExactField.bind(this, setFieldValue)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {ohioDefaultValues?.d?.l?.l && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs"> Death Place</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {ohioDefaultValues.d?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getDeathFieldDropdowns(
                                                    "d.l.s",
                                                    "d.li.s",
                                                    ohioDefaultValues.Death,
                                                    setFieldValue,
                                                    ohioDefaultValues.d?.li?.i,
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        {/**Ohio's Form Button **/}
                        <div className="mb-2 md:pt-6 flex justify-between w-full">
                            <div className="buttons ml-auto flex">
                                <div className="mr-1.5">
                                    <Button
                                        title="Edit Search"
                                        type="default"
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowModal(true);
                                        }}
                                    />
                                </div>
                                <Button
                                    title={isSubmitting ? "Loading..." : buttonTitle}
                                    disabled={!dirty || !isValid || isSubmitting}
                                    buttonType="submit"
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
