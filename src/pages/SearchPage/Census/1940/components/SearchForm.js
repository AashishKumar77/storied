import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import {
  typeSearchDefaulUSFederalCensus,
} from "../../../../../utils";
import { headerContent } from "../../../../../utils/search"
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { checkBirthPlace, checkRSPlace, checkRSPPlace } from "../../../utils/common";
import { useTranslation } from "react-i18next";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";

const handleMatchCheckbox = (e, form) => {
  if (e.target.checked) {
    form.setFieldValue("fm.s", "0");
    form.setFieldValue("ln.s", "0");
    form.setFieldValue("b.l.s", "0");
    form.setFieldValue("b.y.s", "2");
    form.setFieldValue("r.l.s", "0");
    form.setFieldValue("pr.l.s", "0");
    if (form.values.BirthPlace.id) {
      form.setFieldValue("b.li.s", Object.keys(form.values.BirthPlace.levelData.residenceLevel)[0]);
    }
    if (form.values.RSPlace.name) {
      form.setFieldValue("r.li.s", Object.keys(form.values.RSPlace.levelData.residenceLevel)[0]);
    }
    if (form.values.RSPPlace.id) {
      form.setFieldValue("pr.li.s", Object.keys(form.values.RSPPlace.levelData.residenceLevel)[0]);
    }
    form.setFieldValue("matchExact", true);
  } else {
    form.setFieldValue("matchExact", false);
    !form.values?.fm.t && form.setFieldValue("fm.s", "2");
    !form.values?.ln.t && form.setFieldValue("ln.s", "2");
    !form.values?.b?.l?.l && form.setFieldValue("b.l.s", "1");
    !form.values?.b?.y?.y && form.setFieldValue("b.y.s", "8");
    !form.values?.r?.rp?.l?.l && form.setFieldValue("r.l.s", "1");
    !form.values?.r?.rpp?.l?.l && form.setFieldValue("pr.l.s", "1");
  }
};

const SearchForm = ({
  title,
  width = "",
  defaultValues,
  clear,
  buttonTitle,
  handleSubmitUSFederalCensus,
  inputWidth = "",
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };

    if (
      values.fm.t.trim() === "" &&
      values.ln.t.trim() === "" &&
      (values.RSPlace.name === "" || values.RSPlace.name === undefined) &&
      (values.RSPPlace.name === "" || values.RSPPlace.name === undefined) &&
      (values.BirthPlace.name === "" || values.BirthPlace.name === undefined) &&
      values.b.y.y === "" &&
      values.g === "" &&
      values.ms === "" &&
      values.sr === "" &&
      values.rs === ""
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };

  const { gender, race, maritalStatus, relationship, dropdownLoading } =
    useSelector((state) => {
      return state.USFederalCensus;
    });
  const { t } = useTranslation();
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkBirthPlace(valuesData);
    checkRSPlace(valuesData);
    checkRSPPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitUSFederalCensus(valuesData, { setSubmitting });
  };


  const defaultTypeCensusSearch = typeSearchDefaulUSFederalCensus();
  const matchInputField = (setFieldValue, values) => {
    let html = null;
    html = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field
            name="matchExact"
            id="matchExact"
            type="checkbox"
            onChange={(e) => handleMatchCheckbox(e, { setFieldValue, values })}
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-400 rounded-lg"
          />
        </div>
        <div className="ml-2 text-sm cursor-pointer">
          <label htmlFor="matchExact" className="font-medium text-gray-700">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return html;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={defaultValues}
        onSubmit={handleSubmit}
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
            {clear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultTypeCensusSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultTypeCensusSearch, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>
                  {locationField("Residence", "r", "RSPlace", values, setFieldValue)}
                </div >
              </div >
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full br-field-md px-2 mb-2.5`}>
                  {locationField("Previous Residence", "pr", "RSPPlace", values, setFieldValue)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {yearField("Birth Year", 'b.y', values, setFieldValue, defaultTypeCensusSearch)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Gender", "g", values, gender, dropdownLoading, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Marital Status", "ms", values, maritalStatus, dropdownLoading, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Race/Nationality", "sr", values, race, dropdownLoading, t)}
                </div >
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Relation to Head of House", "rs", values, relationship, dropdownLoading, t)}
                </div>
              </div >
              <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                {matchInputField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button
                    className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last"
                    type="submit"
                    disabled={!dirty || isSubmitting || !isValid}
                  >
                    {isSubmitting
                      ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
                      : tr(t, buttonTitle)}
                  </button>
                  {clear ? (
                    <button
                      className="disabled:opacity-50 text-gray-700 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0"
                      type="reset"
                      disabled={!dirty || isSubmitting}
                    >
                      {tr(t, "search.ww1.form.clear")}
                    </button>
                  ) : null}
                </div>
              </div>
            </Form >
          </>
        )}
      </Formik >
    </>
  );
};
export default SearchForm;
