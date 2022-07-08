import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
    getFirstAndLastName,
    getDisabledOptions,
    CheckExactField,
    typeSearchDefaultWashingtonMarriages,
    DateDropdownValues,
} from "../../../../../utils";
import { useSelector } from "react-redux";
import { handleSearchType, headerContent, genderField, submitAndClearButtons, marriagePlaceField } from "../../../../../utils/search";
import { checkMarriagePlace } from "../../../utils/common";
import MarriageDateField from "../../../../../components/DateComponent";



const SearchForm = ({
    title,
    width = "",
    defaultValues,
    WMClear,
    buttonTitle,
    handleSubmitWashingtonMarriages,
    inputWidth = "",
}) => {

    const { t } = useTranslation();
    const { gender, dropdownLoading } =
        useSelector((state) => {
            return state.washingtonMarriages;
        });

    const handleSubmit = (values, { setSubmitting }) => {
        const valuesData = {
            ...values,
        };
        checkMarriagePlace(valuesData);
        if (!valuesData.matchExact) {
            delete valuesData.matchExact;
        }
        handleSubmitWashingtonMarriages(valuesData, { setSubmitting });
    };

    const handleMatchWMCheckbox = (e, setFieldValue, values) => {
        if (e.target.checked) {
            setFieldValue("matchExact", true);
            setFieldValue("fm.s", "0");
            setFieldValue("ln.s", "0");
            setFieldValue("m.l.s", "0");
            setFieldValue("s.fm.s", "0");
            setFieldValue("s.ln.s", "0");
            setFieldValue(`m.y.s`, Object.keys(DateDropdownValues(values.m.y.y, values.m.y.m, values.m.y.d))[0]);
            if (values.Marriage.id) {
                const loc = Object.keys(values.Marriage.levelData.residenceLevel);
                setFieldValue("m.li.s", loc[0]);
            }

        } else {
            setFieldValue("matchExact", false);
            !values?.fm.t && setFieldValue("fm.s", "2");
            !values?.ln.t && setFieldValue("ln.s", "2");
            !values?.m?.l?.l && setFieldValue("m.l.s", "1");
            !values?.s.fm.t && setFieldValue("s.fm.s", "2");
            !values?.s.ln.t && setFieldValue("s.ln.s", "2");
            !values?.m?.y?.y && setFieldValue("m.y.s", "8");
        }
    };

    const defaultWMSearch = typeSearchDefaultWashingtonMarriages();
    const WMmatchField = (setFieldValue, values) => {
        let WMHtml = null;
        WMHtml = (
            <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
                <div className="flex items-center h-5">
                    <Field
                        name="matchExact"
                        id="matchExact"
                        type="checkbox"
                        onChange={(e) => handleMatchWMCheckbox(e, setFieldValue, values)}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-400 rounded-lg"
                    />
                </div>
                <div className="ml-2 text-sm">
                    <label htmlFor="matchExact" className="font-medium text-gray-700">
                        <Translator tkey="search.unisearchform.malltrms" />
                    </label>
                </div>
            </div>
        );
        return WMHtml;
    };


    const getWMFirstAndLastName = getFirstAndLastName();

    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleSubmit}
                initialValues={defaultValues}
            >
                {({
                    dirty,
                    isSubmitting,
                    isValid,
                    setSubmitting,
                    setFieldValue,
                    handleChange,
                    values,
                }) => (
                    <>
                        {WMClear
                            ? headerContent({
                                t,
                                title,
                                buttonTitle,
                                dirty,
                                isSubmitting,
                                isValid,
                                values,
                                setSubmitting,
                                handleSubmit,
                            })
                            : null}
                        <Form className="w-full">
                            <div className="flex flex-wrap -mx-2 md:mb-2.5">
                                <div className={`w-full ${width} px-2 mb-2.5`}>
                                    <label
                                        className="block text-gray-600 text-sm mb-1"
                                        htmlFor="grid-WM-first-name"
                                    >
                                        {tr(t, "search.ww1.form.fmname")}
                                    </label>
                                    <Field
                                        name="fm.t"
                                        maxLength="35"
                                        type="text"
                                        id="grid-WM-first-name"
                                        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                                        onChange={(e) =>
                                            handleSearchType(
                                                e,
                                                handleChange,
                                                setFieldValue,
                                                "fm",
                                                "fm",
                                                values,
                                                defaultWMSearch
                                            )
                                        }
                                    />
                                    {values.fm.t && (
                                        <Field
                                            name="fm.s"
                                            options={getFirstAndLastName(tr, t)}
                                            component={TWDropDownComponent}
                                            onChange={CheckExactField.bind(this, setFieldValue)}
                                            defaultValue="0"
                                            getdisabledoptions={getDisabledOptions(
                                                getWMFirstAndLastName,
                                                values.fm.t
                                            )}
                                        />
                                    )}
                                </div>
                                <div className={`w-full ${width} px-2 mb-2.5`}>
                                    <label
                                        className="block text-gray-600 text-sm mb-1"
                                        htmlFor="grid-WM-last-name"
                                    >
                                        {tr(t, "search.ww1.form.lname")}
                                    </label>
                                    <Field
                                        name="ln.t"
                                        maxLength="35"
                                        type="text"
                                        id="grid-WM-last-name"
                                        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                                        onChange={(e) =>
                                            handleSearchType(
                                                e,
                                                handleChange,
                                                setFieldValue,
                                                "ln",
                                                "ln",
                                                values,
                                                defaultWMSearch
                                            )
                                        }
                                    />
                                    {values.ln.t && (
                                        <Field
                                            name="ln.s"
                                            onChange={CheckExactField.bind(this, setFieldValue)}
                                            component={TWDropDownComponent}
                                            defaultValue="0"
                                            options={getWMFirstAndLastName}
                                            getdisabledoptions={getDisabledOptions(
                                                getWMFirstAndLastName,
                                                values.ln.t
                                            )}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                                {genderField(gender, dropdownLoading, t, values, width, inputWidth)}
                            </div>

                            <div className="flex flex-wrap -mx-2 md:mb-2.5">
                                <div className={`w-full ${width} px-2 mb-2.5`}>
                                    <label
                                        className="block text-gray-600 text-sm mb-1"
                                        htmlFor="grid-WM-spouse-first-name"
                                    >
                                        Spouse First & Middle Name(s)
                                    </label>
                                    <Field
                                        name="s.fm.t"
                                        id="grid-WM-spouse-first-name"
                                        type="text"
                                        maxLength="35"
                                        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                                        onChange={(e) =>
                                            handleSearchType(
                                                e,
                                                handleChange,
                                                setFieldValue,
                                                "s.fm",
                                                "s.fm",
                                                values,
                                                defaultWMSearch
                                            )
                                        }
                                    />
                                    {values.s.fm.t && (
                                        <Field
                                            name="s.fm.s"
                                            defaultValue="0"
                                            onChange={CheckExactField.bind(this, setFieldValue)}
                                            options={getFirstAndLastName(tr, t)}
                                            component={TWDropDownComponent}
                                            getdisabledoptions={getDisabledOptions(
                                                getWMFirstAndLastName,
                                                values.s.fm.t
                                            )}
                                        />
                                    )}
                                </div>
                                <div className={`w-full ${width} px-2 mb-2.5`}>
                                    <label
                                        className="block text-gray-600 text-sm mb-1"
                                        htmlFor="grid-spouse-last-name"
                                    >
                                        Spouse Last Name
                                    </label>
                                    <Field
                                        name="s.ln.t"
                                        id="grid-WM-spouse-last-name"
                                        maxLength="35"
                                        type="text"
                                        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                                        onChange={(e) =>
                                            handleSearchType(
                                                e,
                                                handleChange,
                                                setFieldValue,
                                                "s.ln",
                                                "s.ln",
                                                values,
                                                defaultWMSearch
                                            )
                                        }
                                    />
                                    {values.s.ln.t && (
                                        <Field
                                            name="s.ln.s"
                                            component={TWDropDownComponent}
                                            onChange={CheckExactField.bind(this, setFieldValue)}
                                            defaultValue="0"
                                            options={getWMFirstAndLastName}
                                            getdisabledoptions={getDisabledOptions(
                                                getWMFirstAndLastName,
                                                values.s.ln.t
                                            )}
                                        />
                                    )}
                                </div>
                            </div>

                            <MarriageDateField
                                name="m.y"
                                yearValue={values.m.y.y}
                                monthValue={values.m.y.m}
                                dayValue={values.m.y.d}
                                label="Marriage Date"
                                values={values}
                                setFieldValue={setFieldValue}
                            />


                            <div className="flex flex-wrap -mx-2 md:mb-2.5">
                               {marriagePlaceField(values , setFieldValue)}
                            </div>

                            <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                                {WMmatchField(setFieldValue, values)}
                                {submitAndClearButtons(dirty, isSubmitting, isValid, WMClear, buttonTitle, t)}
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};
export default SearchForm;
