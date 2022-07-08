import React from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import { tr } from "../../../components/utils";
import { useTranslation } from "react-i18next";
import * as narrowAction from "./Fields"
import Keywords from "./Components/Keywords";
import {
    getFieldClass
} from "shared-logics";

import {
    encodeDataToURL,
    formDataTrim
} from "./../../../utils";
import { useHistory } from "react-router-dom";


const GetFieldsMethod = ({ form }) => {
    const value = form.values.nm
    if (value === 'between') {
        return <Field component={narrowAction.BetweenNarrowMethod} name="bt"  />
    } else if (value === 'exact') {
        return <Field component={narrowAction.ExactNarrowMethod} name="ex" />
    } else if (value === 'byyear') {
        return <Field component={narrowAction.YearNarrowMethod} name="ye" />
    } else if (value === 'before') {
        return <Field component={narrowAction.BeforeNarrowMethod} name="be" />
    } else if (value === 'after') {
        return <Field component={narrowAction.AfterNarrowMethod} name="af" />
    }
    return null
}
const getCombineError = (error, name) => {
    let _error = {}
    if (Object.keys(error).length > 0) {
        _error[name] = error;
        _error['invaild'] = "Inavild"
    }
    return _error;
}
const narrowMethodValidation = (values, error) => {
    let _error = {}
    switch (values.nm.trim()) {
        case "byyear":
            if (!values.ye.y) {
                error.ye = { y: "inValid" }
                error.invaild = "Inavild";
            }
            break;
        case "exact":
            _error = {}
            if (!values.ex.y) {
                _error.y = "inValid"
            }
            if (!values.ex.m) {
                _error.m = "inValid"
            }
            error = { ...error, ...getCombineError(_error, "ex") }
            break;
        case "between":
            _error = {}
            if (!values.bt.y) {
                _error.y = "inValid"
            }
            if (!values.bt.ey) {
                _error.ey = "inValid" 
            }
            error = { ...error, ...getCombineError(_error, "bt") }
            break;
        case "before":
            if (!values.be.y) {
                error.be = { y: "inValid" }
                error.invaild = "Inavild";
            }
            break;
        case "after":
            if (!values.af.y) {
                error.af = { y: "inValid" }
                error.invaild = "Inavild";
            }
    }
    return error;
}
const formValidate = (values) => {
    let error = {};
    let keywordValidation = false
    values.k.forEach((value, index) => {
        if (value.t?.trim() && !value.m.trim()) {
            if (!error.k) {
                error.k = [{}, {}, {}, {}]
            }
            error.k[index].m = "inValid"
        } else if (value.t?.trim()) {
            keywordValidation = true
        }
    });
    if (values.ln.trim() === "" && !keywordValidation) {
        error.ln = "inValid"
        error.invaild = "Inavild";
    }
    if (values.nm.trim() !== "") {
        error = { ...error, ...narrowMethodValidation(values, error) }
    }
    return error;
};
const getAppendData = (values) => {
    let ob = {}
    switch (values.nm) {
        case 'byyear':
            ob = { ye: values.ye }
            break;
        case 'before':
            ob = { be: values.be }
            break;
        case 'after':
            ob = { af: values.af }
            break;
        case 'between':
            ob = { bt: values.bt }
            break;
        case 'exact':
            ob = { ex: values.ex }
            break;
    }
    const k = values.k.filter((_k) => !!_k.m && !!_k.t)
    if (k.length > 0) {
        ob['k'] = k;
    }
    return ob;
}
const NewspaperForm = ({
    title,
    defaultValues,
    WWIIIClear,
    buttonTitle,
    handleNewspapperSubmit,
}) => {
    const history = useHistory();
    const { t } = useTranslation();
    const handleSubmit = (values, { setSubmitting }) => {
        let formValue = { ...values };
        delete formValue.ex;
        delete formValue.ye;
        delete formValue.bt;
        delete formValue.af;
        delete formValue.be;
        delete formValue.k;
        formValue = { ...formValue, ...getAppendData(values) }
        formValue.pn = 1
        formValue.ps = formValue.ps || 10
        formValue.email = formValue.email || true
        const urlQuery = encodeDataToURL({ ...formDataTrim(formValue) });
        handleNewspapperSubmit && handleNewspapperSubmit(values)
        history.push(`/search/newspapers/result?${urlQuery}`);
        return null
    };

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
                    errors,
                    touched,
                    setFieldTouched
                }) => (
                    <>
                        <Form>
                            <div className="w-full">
                                <h3 className="typo-font-medium text-blue-500 mb-3">Names</h3>
                                <div className="flex items-start flex-wrap md:flex-nowrap relative -mx-2 md:mb-4">
                                    <div className="w-full md:w-1/2 mx-2 mb-4 md:mb-0">
                                        <label
                                            className="block text-gray-600 text-sm mb-1"
                                            htmlFor="grid-first-name"
                                        >
                                            {tr(t, "search.ww1.form.fmname")}
                                        </label>
                                        <Field
                                            autoFocus={true}
                                            name="fn"
                                            className="appearance-none grid-first-name w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                            id="grid-first-name"
                                            type="text"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2 mx-2 mb-4 md:mb-0">
                                        <label
                                            className="block text-gray-600 text-sm mb-1"
                                            htmlFor="grid-last-name"
                                        >
                                            {tr(t, "search.ww1.form.lname")}
                                        </label>
                                        <Field
                                            name="ln"
                                            className={`appearance-none w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:border-transparent ${getFieldClass(touched.ln, errors.ln) ? "border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400" : "border  focus:ring-blue-400"}`}
                                            id="grid-last-name"
                                            type="text"
                                        />
                                        {touched.ln && errors.ln && <div className="text-maroon-400 text-xs mt-1">Please enter last name or search by keyword</div>}
                                    </div>
                                </div>
                                <h3 className="typo-font-medium text-blue-500 mb-3">Keywords</h3>

                                <FieldArray component={Keywords} name={"k"} />
                                <Field component={narrowAction.NarrowLocation} name="nl" />
                                <h3 className="typo-font-medium text-blue-500 mb-3">Narrow by Date</h3>
                                <div className="md:flex">
                                    <div className="md:w-3/12 w-full md:pr-2 mb-6 md:mb-0 relative">
                                        <div className="flex items-center">
                                            <Field
                                                as="select"
                                                name="nm"
                                                onChange={(e) => {
                                                    handleChange(e);
                                                    setFieldTouched(`bt.0.y`, false);
                                                    setFieldTouched(`bt.1.y`, false);
                                                    setFieldTouched(`ex.y`, false);
                                                    setFieldTouched(`ex.m`, false);
                                                    setFieldTouched(`be.y`, false);
                                                    setFieldTouched(`af.y`, false);
                                                    setFieldTouched(`ye.y`, false);
                                                }}
                                                className={`appearance-none w-full pl-2 pr-6 py-2 px-3 border border-gray-300 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${values.nm?"select-value": "empty-value"}`}>
                                                <option value="" >Narrow Method</option>
                                                <option value="byyear">By Year</option>
                                                <option value="exact">Exact</option>
                                                <option value="between">Between</option>
                                                <option value="before">Before</option>
                                                <option value="after">After</option>
                                            </Field>
                                            <div className="absolute right-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
                                                    <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                        <Field component={GetFieldsMethod} name="options"  />
                                </div>
                                <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                                    <div className="buttons ml-auto flex items-center justify-end">
                                        <button
                                            className="disabled:opacity-40 bg-blue-400 active:bg-blue-500 text-white typo-font-medium text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ml-4 w-auto order-last"
                                            disabled={!dirty || isSubmitting || !isValid}
                                            type="submit"
                                        >
                                            {isSubmitting ? `Loading...` : tr(t, buttonTitle)}
                                        </button>
                                        {WWIIIClear ? (
                                            <button
                                                className="disabled:opacity-40 text-blue-500 active:bg-gray-200 rounded-lg bg-gray-100 typo-font-medium px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset w-auto"
                                                disabled={dirty && isSubmitting}
                                                type="reset"
                                            >
                                                {tr(t, "search.ww1.form.clear")}
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </>
                )}
            </Formik>
        </>
    );
};
export default NewspaperForm;
