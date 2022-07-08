import React from "react";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultMassachusettsMarriages,
} from "../../../../../utils";
import { headerContent } from "../../../../../utils/search";
import { inputField, yearField, locationField } from "../../../../../utils/formFields";


const checkMarriage = (values) => {
  if (values["Marriage"]) {
    const { name, id } = values["Marriage"];
    values["m"]["l"]["l"] = name ? name : "";
    values["m"]["li"]["i"] = id ? id : "";
    delete values["Marriage"];
  }
};

const SearchForm = ({
  title,
  width = "",
  defaultValues,
  MMClear,
  buttonTitle,
  handleSubmitMassachusettsMarriages,
  inputWidth = "",
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };

    if (
      values.fm.t === "" &&
      values.ln.t === "" &&
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

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkMarriage(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitMassachusettsMarriages(valuesData, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("m.y.s", "2");
      setFieldValue("m.l.s", "0");
      if (values?.Marriage?.id) {
        const loc = Object.keys(values.Marriage.levelData.residenceLevel);
        setFieldValue("m.li.s", loc[0]);
      }

    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.m.y.y && setFieldValue("m.y.s", "8");
      !values?.m?.l?.l && setFieldValue("m.l.s", "1");
    }
  };

  const defaultMassachusettsMarriagesSearch = typeSearchDefaultMassachusettsMarriages();
  const MassachusettsMarriagesMatchField = (setFieldValue, values) => {
    let MassachusettsMarriageshtml = null;
    MassachusettsMarriageshtml = (
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
    return MassachusettsMarriageshtml;
  };

  return (
    <>
      <Formik
        initialValues={defaultValues}
        validate={formValidate}
        onSubmit={handleSubmit}
      >
        {({
          setFieldValue,
          setSubmitting,
          handleChange,
          values,
          dirty,
          isValid,
          isSubmitting,
        }) => (
          <>
            {MMClear ? headerContent({ t, title, buttonTitle, dirty, isSubmitting, isValid, values, setSubmitting, handleSubmit }) : null}
            <Form className="w-full">
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultMassachusettsMarriagesSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultMassachusettsMarriagesSearch, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
                  {yearField("Marriage Year", 'm.y', values, setFieldValue, defaultMassachusettsMarriagesSearch)}
                </div>
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Marriage Place", "m", "Marriage", values, setFieldValue, "City, County")}
                </div>
              </div>

              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {MassachusettsMarriagesMatchField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button
                    type="submit"
                    disabled={!dirty || !isValid || isSubmitting}
                    className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last"
                  >
                    {isSubmitting
                      ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
                      : tr(t, buttonTitle)}
                  </button>
                  {MMClear ? (
                    <button
                      type="reset"
                      disabled={!dirty || isSubmitting}
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
