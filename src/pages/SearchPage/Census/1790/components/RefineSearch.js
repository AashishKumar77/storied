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
} from "../../../../../utils";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({
    width = "",
    defaultUSValues,
    handleShowModal,
    buttonTitle,
    handleSubmitUSCensus,
}) => {
    const handleUSCensusSubmit = (values, { setSubmitting }) => {
        handleSubmitUSCensus(values, { setSubmitting });
    };
    const showUSCensussetsNameDiv = defaultUSValues?.fm.t || defaultUSValues?.ln.t;
    const getResidenceOptions = () => {
        if (defaultUSValues.Res?.levelData) {
            return defaultUSValues.Res.levelData.residenceLevel;
        }
        return {};
    };

    const getResidenceFieldDropdown = (
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
                    options={getResidenceOptions()}
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
                onSubmit={handleUSCensusSubmit}
                initialValues={defaultUSValues}
            >
                {({ dirty, isSubmitting, isValid, setFieldValue }) => (
                    <Form name="uscensusForm" className="w-full">
                        <div className="flex flex-wrap mb-3 md:mb-2.5">
                            <div className={`w-full ${width} pt-1 mb-3`}>
                                {/** First name Last Name **/}
                                {showUSCensussetsNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Name</p>
                                        </div>
                                        {defaultUSValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {defaultUSValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameOptions,
                                                            defaultUSValues.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {defaultUSValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${defaultUSValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {defaultUSValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameOptions,
                                                            defaultUSValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {defaultUSValues?.r?.l?.l && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Residence</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {defaultUSValues?.r?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getResidenceFieldDropdown(
                                                    setFieldValue,
                                                    defaultUSValues.r?.li?.i,
                                                    "r.l.s",
                                                    "r.li.s",
                                                    defaultUSValues.Res
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {defaultUSValues?.g ? (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Gender</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm">{defaultUSValues.g}</div>
                                        </div>
                                    </div>
                                ) : null}
                                {defaultUSValues?.s ? (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Race/Nationality</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm">{defaultUSValues.s}</div>
                                        </div>
                                    </div>
                                ) : null}

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
                                    buttonType="submit"
                                    title={isSubmitting ? "Loading..." : buttonTitle}
                                    disabled={!dirty || isSubmitting || !isValid}
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
