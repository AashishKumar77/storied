import React from "react";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../.././../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultNYC,
} from "../../../../../utils";
import { useSelector } from "react-redux";
import { headerContent, submitAndClearButtons } from "../../../../../utils/search";
import { checkMarriagePlace } from "../../../utils/common";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";



const SearchForm = ({
  title,
  width = "",
  defaultValues,
  NYCClear,
  buttonTitle,
  handleSubmitNYC,
  inputWidth = "",
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };

    if (
      values.fm.t.trim() === "" &&
      values.ln.t.trim() === "" &&
      values.g === "" &&
      values.s.fm.t.trim() === "" &&
      values.s.ln.t.trim() === "" &&
      values.m.y.y === "" &&
      (values.Marriage.name === "" || values.Marriage.name === undefined)
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { t } = useTranslation();
  const { gender, dropdownLoading } =
    useSelector((state) => {
      return state.nyc;
    });

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkMarriagePlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitNYC(valuesData, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("s.fm.s", "0");
      setFieldValue("s.ln.s", "0");
      setFieldValue("m.y.s", "2");
      setFieldValue("m.l.s", "0");
      if (values.Marriage.id) {
        const loc = Object.keys(values.Marriage.levelData.residenceLevel);
        setFieldValue("m.li.s", loc[0]);
      }

    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.s.fm.t && setFieldValue("s.fm.s", "2");
      !values?.s.ln.t && setFieldValue("s.ln.s", "2");
      !values?.m?.y?.y && setFieldValue("m.y.s", "8");
      !values?.m?.l?.l && setFieldValue("m.l.s", "1");
    }
  };

  const defaultNYCSearch = typeSearchDefaultNYC();
  const NYCmatchField = (setFieldValue, values) => {
    let NYCHtml = null;
    NYCHtml = (
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
    return NYCHtml;
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
            {NYCClear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultNYCSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultNYCSearch, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Gender", "g", values, gender, dropdownLoading, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField("Spouse First & Middle Name(s)", 's.fm', values, setFieldValue, handleChange, defaultNYCSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField("Spouse Last Name", 's.ln', values, setFieldValue, handleChange, defaultNYCSearch, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
                  {yearField("Marriage Year", 'm.y', values, setFieldValue, defaultNYCSearch)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Marriage Place", "m", "Marriage", values, setFieldValue)}
                </div>
              </div>

              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {NYCmatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, NYCClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
