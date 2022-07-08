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
    typeSearchDefaultUSSocialSecurity,
    DateDropdownValues,
} from "../../../../../utils";
import { v4 as uuidv4 } from "uuid";
import SearchLocation from "../../../../../components/FWSearchLocation";
import DateField from "../../../../../components/DateComponent";
import { getLocationSpecification, handleSearchType, headerContent, submitAndClearButtons } from "../../../../../utils/search";
import { resPlace } from "../../../utils/common";


const SearchForm = ({
    title,
    width = "",
    defaultValues,
    USClear,
    buttonTitle,
    handleSubmitUSSocialSecurity,
    inputWidth = "",
}) => {

    const formValidate = (values) => {
        let error = {
            invaild: "Inavild"
        };
        if (
            values.fm.t.trim() === "" &&
            values.ln.t.trim() === "" &&
            values.b.y === "" &&
            values.d.y === "" &&
            (values.Res.name === "" || values.Res.name === undefined)
        ) {
            error.invaild = "Inavild";
        } else {
            error = {};
        }
        return error;
    };
    const { t } = useTranslation();
    const handleSubmit = (values, { setSubmitting }) => {
        const valuesData = {
            ...values,
        };
        resPlace(valuesData)
        if (!valuesData.matchExact) {
            delete valuesData.matchExact;
        }
        handleSubmitUSSocialSecurity(valuesData, { setSubmitting });
    };


    const handleMatchCheckbox = (e, setFieldValue, values) => {
        if (e.target.checked) {
            setFieldValue("matchExact", true);
            setFieldValue("fm.s", "0");
            setFieldValue("ln.s", "0");
            setFieldValue(`b.s`, Object.keys(DateDropdownValues(values.b.y, values.b.m, values.b.d))[0]);
            setFieldValue(`d.s`, Object.keys(DateDropdownValues(values.d.y, values.d.m, values.d.d))[0]);
            setFieldValue("r.l.s", "0");

            if (values.Res.id) {
                const loc = Object.keys(values.Res.levelData.residenceLevel);
                setFieldValue("r.li.s", loc[0]);
            }
        } else {
            setFieldValue("matchExact", false);
            !values?.fm.t && setFieldValue("fm.s", "2");
            !values?.ln.t && setFieldValue("ln.s", "2");
            !values?.b?.y && setFieldValue(`b.s`, "8");
            !values?.d?.y && setFieldValue(`d.s`, "8");
            !values?.r?.l?.l && setFieldValue("r.l.s", "1");
        }
    };

    const defaultIUSSocialSearch = typeSearchDefaultUSSocialSecurity();
    const USSocialmatchField = (setFieldValue, values) => {
        let USSocialhtml = null;
        USSocialhtml = (
            <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
                <div className="flex items-center h-5">
                    <Field
                        name="matchExact"
                        id="matchExact"
                        type="checkbox"
                        onChange={(e) => handleMatchCheckbox(e, setFieldValue, values)}
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
        return USSocialhtml;
    };

    const getUSSocialFirstAndLastName = getFirstAndLastName();

    return (
        <>
            <Formik
                enableReinitialize={true}
                onSubmit={handleSubmit}
                initialValues={defaultValues}
                validate={formValidate}
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
                        {USClear
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
                                        htmlFor="grid-irish-first-name"
                                    >
                                        {tr(t, "search.ww1.form.fmname")}
                                    </label>
                                    <Field
                                        name="fm.t"
                                        id="grid-Social-first-name"
                                        maxLength="35"
                                        type="text"
                                        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                                        onChange={(e) =>
                                            handleSearchType(
                                                e,
                                                handleChange,
                                                setFieldValue,
                                                "fm",
                                                "fm",
                                                values,
                                                defaultIUSSocialSearch
                                            )
                                        }
                                    />
                                    {values.fm.t && (
                                        <Field
                                            name="fm.s"
                                            defaultValue="0"
                                            component={TWDropDownComponent}
                                            onChange={CheckExactField.bind(this, setFieldValue)}
                                            options={getFirstAndLastName(tr, t)}
                                            getdisabledoptions={getDisabledOptions(
                                                getUSSocialFirstAndLastName,
                                                values.fm.t
                                            )}
                                        />
                                    )}
                                </div>
                                <div className={`w-full ${width} px-2 mb-2.5`}>
                                    <label
                                        className="block text-gray-600 text-sm mb-1"
                                        htmlFor="grid-irish-last-name"
                                    >
                                        {tr(t, "search.ww1.form.lname")}
                                    </label>
                                    <Field
                                        name="ln.t"
                                        maxLength="35"
                                        id="grid-wwii-last-name"
                                        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                                        type="text"
                                        onChange={(e) =>
                                            handleSearchType(
                                                e,
                                                handleChange,
                                                setFieldValue,
                                                "ln",
                                                "ln",
                                                values,
                                                defaultIUSSocialSearch
                                            )
                                        }
                                    />
                                    {values.ln.t && (
                                        <Field
                                            name="ln.s"
                                            defaultValue="0"
                                            component={TWDropDownComponent}
                                            onChange={CheckExactField.bind(this, setFieldValue)}
                                            options={getUSSocialFirstAndLastName}
                                            getdisabledoptions={getDisabledOptions(
                                                getUSSocialFirstAndLastName,
                                                values.ln.t
                                            )}
                                        />
                                    )}
                                </div>
                            </div>

                            <DateField
                                name="b"
                                yearValue={values.b.y}
                                monthValue={values.b.m}
                                dayValue={values.b.d}
                                label="Birth Date"
                                values={values}
                                setFieldValue={setFieldValue}
                            />

                            <DateField
                                name="d"
                                yearValue={values.d.y}
                                monthValue={values.d.m}
                                dayValue={values.d.d}
                                label="Death Date"
                                values={values}
                                setFieldValue={setFieldValue}
                            />

                            <div className="flex flex-wrap -mx-2 md:mb-2.5">
                                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                                    <label
                                        className="block text-gray-600 text-sm mb-1"
                                        htmlFor="grid-Residence"
                                    >
                                        Residence
                                    </label>
                                    <div className="relative">
                                        <Field
                                            name={`Res`}
                                            relatedField="r.li.s"
                                            component={SearchLocation}
                                            freeSolo={true}
                                            searchType={true}
                                            id={`locations-filter-${uuidv4()}`}
                                        />
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg
                                                className="fill-current h-4 w-4"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {getLocationSpecification(
                                        values.Res,
                                        "r.li.s",
                                        "r.l.s",
                                        setFieldValue
                                    )}
                                </div>
                            </div>




                            <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                                {USSocialmatchField(setFieldValue, values)}
                                {submitAndClearButtons(dirty, isSubmitting, isValid, USClear, buttonTitle, t)}
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};
export default SearchForm;
