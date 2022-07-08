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
    NYCDefaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitNYC,
}) => {
    const handleNYCSubmit = (values, { setSubmitting }) => {
        handleSubmitNYC(values, { setSubmitting });
    };
    const showNYCNameDiv = NYCDefaultValues?.fm.t || NYCDefaultValues?.ln.t;
    const showSpouseNameDiv = NYCDefaultValues?.s?.fm?.t || NYCDefaultValues?.s?.ln?.t ;


    const getMarriageOptions = () => {
        if (NYCDefaultValues.Marriage?.levelData) {
            return NYCDefaultValues.Marriage.levelData.residenceLevel;
        }
        return {};
    };

    const getMarriageFieldDropdowns = (
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
                    options={getMarriageOptions()}
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
                onSubmit={handleNYCSubmit}
                initialValues={NYCDefaultValues}
            >
                {({ dirty, isSubmitting, isValid, setFieldValue }) => (
                    <Form name="NYCForm" className="w-full">
                        <div className="flex flex-wrap mb-3 md:mb-2.5">
                            <div className={`w-full ${width} pt-1 mb-3`}>
                                {/** First name Last Name **/}
                                {showNYCNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Name</p>
                                        </div>
                                        {NYCDefaultValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {NYCDefaultValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            NYCDefaultValues.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {NYCDefaultValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${NYCDefaultValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {NYCDefaultValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            NYCDefaultValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {NYCDefaultValues?.g && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Gender</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm">{NYCDefaultValues.g}</div>
                                        </div>
                                    </div>
                                )}


                                  {/**Spouse First name Last Name **/}
                                  {showSpouseNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Spouse Name</p>
                                        </div>
                                        {NYCDefaultValues?.s?.fm?.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {NYCDefaultValues.s.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="s.fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            NYCDefaultValues.s.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {NYCDefaultValues?.s?.ln?.t && (
                                            <div
                                                className={`row flex content-row items-center ${NYCDefaultValues.s.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {NYCDefaultValues.s.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="s.ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            NYCDefaultValues.s.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/**Spouse First name Last Name **/}

                                {NYCDefaultValues?.m?.y?.y && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Marriage Year</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {NYCDefaultValues?.m?.y?.y}
                                            </div>
                                            <div className="ml-auto">
                                                <Field
                                                    name={`m.y.s`}
                                                    component={TWDropDownComponent}
                                                    onChange={CheckExactField.bind(this, setFieldValue)}
                                                    options={getYearsOptions()}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {NYCDefaultValues?.m?.l?.l && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs"> Marriage Place</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {NYCDefaultValues.m?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getMarriageFieldDropdowns(
                                                    setFieldValue,
                                                    NYCDefaultValues.m?.li?.i,
                                                    "m.l.s",
                                                    "m.li.s",
                                                    NYCDefaultValues.Marriage
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>


                        {/**NYC Form Button **/}
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
                                    buttonType="submit"
                                    disabled={!dirty || isSubmitting || !isValid}
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
