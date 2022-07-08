import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import {
    getFirstAndLastName,
    getDisabledOptions,
    CheckExactField,
    DateDropdownValues,
    getFormattedDate,
} from "../../../../../utils";
import { getFieldDropdowns, refineSearchButtons } from "../../../../../utils/search";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({
    width = "",
    USSocialDefaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitUSSocialSecurity,
}) => {
    const handleSubmit = (values, { setSubmitting }) => {
        handleSubmitUSSocialSecurity(values, { setSubmitting });
    };
    const showNameDiv = USSocialDefaultValues?.fm.t || USSocialDefaultValues?.ln.t;


    const getResidenceOptions = () => {
        if (USSocialDefaultValues.Res?.levelData) {
            return USSocialDefaultValues.Res.levelData.residenceLevel;
        }
        return {};
    };


    const getBirthDate = (setFieldValue) => {
        return <div className="refine-row border-b border-gray-200 pb-2 pt-2">
            <div className="label-wrap mb-2">
                <p className="text-gray-500 text-xs">Birth Date</p>
            </div>
            <div className="row flex content-row pb-1 items-center">
                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                    {getFormattedDate(USSocialDefaultValues?.b.y, USSocialDefaultValues?.b.m, USSocialDefaultValues?.b.d)}
                </div>
                <div className="ml-auto">
                    <Field
                        name={`b.s`}
                        options={DateDropdownValues(USSocialDefaultValues.b.y, USSocialDefaultValues.b.m, USSocialDefaultValues.b.d)}
                        component={TWDropDownComponent}
                        onChange={CheckExactField.bind(this, setFieldValue)}
                    />
                </div>
            </div>
        </div>
    }

    const getDeathDate = (setFieldValue) => {
        return <div className="refine-row border-b border-gray-200 pb-2 pt-2">
            <div className="label-wrap mb-2">
                <p className="text-gray-500 text-xs">Death Date</p>
            </div>
            <div className="row flex content-row pb-1 items-center">
                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                    {getFormattedDate(USSocialDefaultValues?.d.y, USSocialDefaultValues?.d.m, USSocialDefaultValues?.d.d)}
                </div>
                <div className="ml-auto">
                    <Field
                        name={`d.s`}
                        options={DateDropdownValues(USSocialDefaultValues.d.y, USSocialDefaultValues.d.m, USSocialDefaultValues.d.d)}
                        component={TWDropDownComponent}
                        onChange={CheckExactField.bind(this, setFieldValue)}
                    />
                </div>
            </div>
        </div>
    }

    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={USSocialDefaultValues}
                onSubmit={handleSubmit}
            >
                {({ dirty, isSubmitting, isValid, setFieldValue }) => (
                    <Form name="wwiiForm" className="w-full">
                        <div className="flex flex-wrap mb-3 md:mb-2.5">
                            <div className={`w-full ${width} pt-1 mb-3`}>
                                {/** First name Last Name **/}
                                {showNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Name</p>
                                        </div>
                                        {USSocialDefaultValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {USSocialDefaultValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameOptions,
                                                            USSocialDefaultValues.fm.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {USSocialDefaultValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${USSocialDefaultValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {USSocialDefaultValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameOptions,
                                                            USSocialDefaultValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {USSocialDefaultValues?.b.y && (
                                    getBirthDate(setFieldValue)
                                )}

                                {USSocialDefaultValues?.d.y && (
                                    getDeathDate(setFieldValue)
                                )}

                                {USSocialDefaultValues?.r?.l?.l && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs"> Residence</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {USSocialDefaultValues.r?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getFieldDropdowns(
                                                    USSocialDefaultValues.r?.li?.i,
                                                    "r.li.s",
                                                    "r.l.s",
                                                    USSocialDefaultValues.Res,
                                                    setFieldValue,
                                                    getResidenceOptions
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                        {/** SSDI Form Button **/}
                        {refineSearchButtons(isSubmitting, isValid, dirty, buttonTitle, handleShowModal)}
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default RefineSearch;
