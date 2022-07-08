import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
    getFirstAndLastName,
    getDisabledOptions,
    CheckExactField,
    DateDropdownValues,
    getFormattedDate,
} from "../../../../../utils";
import { getFieldDropdowns } from "../../../../../utils/search";
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
    width = "",
    WMDefaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitWashingtonMarriages,
}) => {
    const handleNYCSubmit = (values, { setSubmitting }) => {
        handleSubmitWashingtonMarriages(values, { setSubmitting });
    };
    const showWMNameDiv = WMDefaultValues?.fm.t || WMDefaultValues?.ln.t;
    const showSpouseNameDiv = WMDefaultValues?.s?.fm?.t || WMDefaultValues?.s?.ln?.t ;


    const getMarriagePlaceOptions = () => {
        if (WMDefaultValues.Marriage?.levelData) {
            return WMDefaultValues.Marriage.levelData.residenceLevel;
        }
        return {};
    };


    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleNYCSubmit}
                initialValues={WMDefaultValues}
            >
                {({ dirty, isSubmitting, isValid, setFieldValue }) => (
                    <Form name="NYCForm" className="w-full">
                        <div className="flex flex-wrap mb-3 md:mb-2.5">
                            <div className={`w-full ${width} pt-1 mb-3`}>
                                {/** First name Last Name **/}
                                {showWMNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Name</p>
                                        </div>
                                        {WMDefaultValues?.fm.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {WMDefaultValues.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            WMDefaultValues.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {WMDefaultValues?.ln.t && (
                                            <div
                                                className={`row flex content-row items-center ${WMDefaultValues.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {WMDefaultValues.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            WMDefaultValues.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/** First name Last Name **/}

                                {WMDefaultValues?.g && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Gender</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm">{WMDefaultValues.g}</div>
                                        </div>
                                    </div>
                                )}


                                  {/**Spouse First name Last Name **/}
                                  {showSpouseNameDiv && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Spouse Name</p>
                                        </div>
                                        {WMDefaultValues?.s?.fm?.t && (
                                            <div className="row flex content-row pb-1 items-center">
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {WMDefaultValues.s.fm.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="s.fm.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            WMDefaultValues.s.fm.t
                                                        )}
                                                        options={getFirstAndLastName()}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                        {WMDefaultValues?.s?.ln?.t && (
                                            <div
                                                className={`row flex content-row items-center ${WMDefaultValues.s.fm || "pb-1"
                                                    }`}
                                            >
                                                <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                    {WMDefaultValues.s.ln.t}
                                                </div>
                                                <div className="ml-auto">
                                                    <Field
                                                        name="s.ln.s"
                                                        component={TWDropDownComponent}
                                                        onChange={CheckExactField.bind(this, setFieldValue)}
                                                        options={getFirstAndLastName()}
                                                        getdisabledoptions={getDisabledOptions(
                                                            getFirstAndLastNameDeathOptions,
                                                            WMDefaultValues.s.ln.t
                                                        )}
                                                        defaultValue="0"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {/**Spouse First name Last Name **/}

                                {WMDefaultValues?.m?.y?.y && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs">Marriage Date</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                            {getFormattedDate(WMDefaultValues?.m.y.y , WMDefaultValues?.m.y.m , WMDefaultValues?.m.y.d)}
                                            </div>
                                            <div className="ml-auto">
                                                <Field
                                                    name={`m.y.s`}
                                                    options={DateDropdownValues(WMDefaultValues.m.y.y, WMDefaultValues.m.y.m, WMDefaultValues.m.y.d)}
                                                    component={TWDropDownComponent}
                                                    onChange={CheckExactField.bind(this, setFieldValue)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {WMDefaultValues?.m?.l?.l && (
                                    <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                        <div className="label-wrap mb-2">
                                            <p className="text-gray-500 text-xs"> Marriage Place</p>
                                        </div>
                                        <div className="row flex content-row pb-1 items-center">
                                            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                                {WMDefaultValues.m?.l?.l}
                                            </div>
                                            <div className="ml-auto">
                                                {getFieldDropdowns(
                                                   WMDefaultValues.m?.li?.i,
                                                    "m.li.s",
                                                    "m.l.s",
                                                    WMDefaultValues.Marriage,
                                                    setFieldValue,
                                                    getMarriagePlaceOptions
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>


                        {/**Washington Form Button **/}
                        <div className="mb-2 md:pt-6 flex justify-between w-full">
                            <div className="buttons ml-auto flex">
                                <div className="mr-1.5">
                                    <Button
                                        type="default"
                                        title="Edit Search"
                                        handleClick={(e) => {
                                            e.preventDefault();
                                            handleShowModal(true);
                                        }}
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
