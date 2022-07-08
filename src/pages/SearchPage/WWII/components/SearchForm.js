import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../components/Translator";
import { tr } from "../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultWWII,
  DateDropdownValues,
} from "../../../../utils";
import { checkBirthPlace, checkEnlistNew, checkResidence } from "../../utils/common";
import DateField from "../../../../components/DateComponent";
import { headerContent } from "../../../../utils/search";
import { dropDownField, inputField, yearField, locationField } from "../../../../utils/formFields";

const SearchForm = ({
  title,
  width = "",
  defaultValues,
  WWIIClear,
  buttonTitle,
  handleSubmitWWII,
}) => {

  const formValidate = (values) => {
    let error = {
      invalid: "Invalid"
    };
    if (
      values.fm.t.trim() === "" &&
      values.ln.t.trim() === "" &&
      (values.BirthPlace.name === "" || values.BirthPlace.name === undefined) &&
      values.b.y.y === "" &&
      values.e.y.y === "" &&
      (values.Enlist.name === "" || values.Enlist.name === undefined) &&
      (values.Residence.name === "" || values.Residence.name === undefined) &&
      values.sr.y.y === "" &&
      values.r === "" &&
      values.m === "" &&
      values.er === "" &&
      values.el === "" &&
      values.o === "" &&
      values.c === "" &&
      values.ec === ""
    ) {
      error.invalid = "Invalid";
    } else {
      error = {};
    }
    return error;
  };

  const { dropdownLoading, race, citizenship, maritalStatus, occupation, componentArmy, miltaryRanks, levelEducation } = useSelector((state) => {
    return state.ww2;
  });

  const { t } = useTranslation();
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkBirthPlace(valuesData);
    checkEnlistNew(valuesData);
    checkResidence(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitWWII(valuesData, { setSubmitting });
  };

  const handleLocations = (values, setFieldValue) => {
    if (values.BirthPlace.id) {
      const loc = Object.keys(values.BirthPlace.levelData.residenceLevel);
      setFieldValue("b.li.s", loc[0]);
    }
    if (values.Enlist.id) {
      const loc = Object.keys(values.Enlist.levelData.residenceLevel);
      setFieldValue("e.li.s", loc[0]);
    }
    if (values.Residence.id) {
      const loc = Object.keys(values.Residence.levelData.residenceLevel);
      setFieldValue("sr.li.s", loc[0]);
    }
  }

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("b.l.s", "0");
      setFieldValue("b.y.s", "2");
      setFieldValue("e.l.s", "0");
      setFieldValue("sr.l.s", "0");
      setFieldValue(`e.y.s`, Object.keys(DateDropdownValues(values.e.y.y, values.e.y.m, values.e.y.d))[0]);
      setFieldValue(`sr.y.s`, Object.keys(DateDropdownValues(values.sr.y.y, values.sr.y.m, values.sr.y.d))[0]);
      handleLocations(values, setFieldValue)
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.b?.l?.l && setFieldValue("b.l.s", "1");
      !values?.b?.y?.y && setFieldValue("b.y.s", "8");
      !values?.ep?.l?.l && setFieldValue("e.l.s", "1");
      !values?.sr?.l?.l && setFieldValue("sr.l.s", "1");
      !values?.ed?.y && setFieldValue(`e.s`, "8");
      !values?.e?.y?.y && setFieldValue(`e.y.s`, "8");
      !values?.sr?.y?.y && setFieldValue(`sr.y.s`, "8");
    }
  };

  const defaultWWIISearch = typeSearchDefaultWWII();
  const wwiimatchField = (setFieldValue, values) => {
    let wwiihtml = null;
    wwiihtml = (
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
    return wwiihtml;
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
            {WWIIClear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultWWIISearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultWWIISearch, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}
                </div>
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
                  {yearField("Birth Year", 'b.y', values, setFieldValue, defaultWWIISearch)}
                </div>
              </div>

              <DateField
                name="e.y"
                yearValue={values.e.y.y}
                monthValue={values.e.y.m}
                dayValue={values.e.y.d}
                label="Enlistment Date"
                values={values}
                setFieldValue={setFieldValue}
              />
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Place of Enlistment", "e", "Enlist", values, setFieldValue)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Residence", "sr", "Residence", values, setFieldValue, "State, Country")}
                </div>
              </div>
              <DateField
                name="sr.y"
                yearValue={values.sr.y.y}
                monthValue={values.sr.y.m}
                dayValue={values.sr.y.d}
                label="Residence Date"
                values={values}
                setFieldValue={setFieldValue}
              />
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Race/Nationality", "r", values, race, dropdownLoading, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Marital Status", "m", values, maritalStatus, dropdownLoading, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Military Rank", "er", values, miltaryRanks, dropdownLoading, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Level of Education", "el", values, levelEducation, dropdownLoading, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Citizenship", "c", values, citizenship, dropdownLoading, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Component of the Army", "ec", values, componentArmy, dropdownLoading, t)}
                </div>
              </div>
              <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                {wwiimatchField(setFieldValue, values)}
                <div className="buttons sm:ml-auto sm:flex">
                  <button
                    className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last"
                    disabled={!dirty || isSubmitting || !isValid}
                    type="submit"
                  >
                    {isSubmitting ? `Loading...` : tr(t, buttonTitle)}
                  </button>
                  {WWIIClear ? (
                    <button
                      className="disabled:opacity-50 text-gray-700 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0"
                      disabled={!dirty || isSubmitting}
                      type="reset"
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
