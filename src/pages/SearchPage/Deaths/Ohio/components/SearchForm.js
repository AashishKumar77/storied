import React from "react";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  DateDropdownValues,
   typeSearchDefaultOhioDeaths,
} from "../../../../../utils";
import { headerContent } from "../../../../../utils/search";
import { inputField, locationField } from "../../../../../utils/formFields";
import DateField from "../../../../../components/DateComponent"
import { checkDeathPlace } from "../../../utils/common";



const SearchForm = ({
  title,
  width = "",
  defaultValues,
  OhioClear,
  buttonTitle,
  handleSubmitOhio,
  inputWidth = "",
}) => {

  const { t } = useTranslation();


  const formValidate = (values) => {
    let formError = {
      invalid: "Invalid"
    };

    if (
      values.fm.t === "" &&
      values.ln.t === "" &&
      (values.Death.name === "" || values.Death.name === undefined) &&
      values.d.y.y === ""
    ) {
      formError.invalid = "Invalid";
    } else {
      formError = {};
    }
    return formError;
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const ohioValuesData = {
      ...values,
    };
    checkDeathPlace(ohioValuesData);
    if (!ohioValuesData.matchExact) {
      delete ohioValuesData.matchExact;
    }
    handleSubmitOhio(ohioValuesData, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("d.l.s", "0");
      if (values.Death.id) {
        const loc = Object.keys(values.Death.levelData.residenceLevel);
        setFieldValue("d.li.s", loc[0]);
      }

      setFieldValue("d.y.s", "2");
      setFieldValue(`d.y.s`, Object.keys(DateDropdownValues(values.d.y.y, values.d.y.m, values.d.y.d))[0]);
    } else {
      setFieldValue("matchExact", false);
      !values?.d?.y?.y && setFieldValue("d.y.s", "8");
      !values?.d?.l?.l && setFieldValue("d.l.s", "1");
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
    }
  };

  const defaultOhioSearch = typeSearchDefaultOhioDeaths();
  const ohiomatchField = (setFieldValue, values) => {
    let ohiohtml = null;
    ohiohtml = (
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
    return ohiohtml;
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
        }) => (
          <>
            {OhioClear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultOhioSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultOhioSearch, t)}
                </div>
              </div>

              <DateField
                setFieldValue={setFieldValue}
                values={values}
                dayValue={values.d.y.d}
                monthValue={values.d.y.m}
                yearValue={values.d.y.y}
                name="d.y"
                label="Death Date"
              />

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Death Place", "d", "Death", values, setFieldValue)}
                </div>
              </div>

              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {ohiomatchField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button
                    disabled={!dirty || !isValid || isSubmitting}
                    type="submit"
                    className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last"
                  >
                    {isSubmitting
                      ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
                      : tr(t, buttonTitle)}
                  </button>
                  {OhioClear ? (
                    <button
                      disabled={!dirty || isSubmitting}
                      type="reset"
                      className="disabled:opacity-50 text-gray-700 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0"
                    >
                      {tr(t, "search.ww1.form.clear")}
                    </button>
                  ) : null}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
