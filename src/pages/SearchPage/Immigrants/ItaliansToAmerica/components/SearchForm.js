import React from "react";
import { Formik, Form, Field } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { tr } from "../../../../../components/utils";
import Translator from "../../../../../components/Translator";
import DateField from "../../../../../components/DateComponent";
import {
  checkBirthPlace,
  checkResPlace,
  checkIDestPlace,
  checkPDepartPlace,
} from "../../../utils/common";
import {
  typeSearchDefaultItaliansToAmerica,
  DateDropdownValues,
} from "../../../../../utils";
import {
  headerContent,
  submitAndClearButtons,
} from "../../../../../utils/search";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";
import { immigrationFields } from "../../../../../utils/formFields/immigrationForm";

const SearchForm = ({
  title,
  width = "",
  defaultValues,
  italianClear,
  buttonTitle,
  handleSubmitForm,
  inputWidth = "",
}) => {
  const formValidate = (values) => {
    let error = {
      invaild: "Inavild",
    };
    if (
      (values.PDepart.name === "" || values.PDepart.name === undefined) &&
      (values.IDest.name === "" || values.IDest.name === undefined) &&
      (values.BirthPlace.name === "" || values.BirthPlace.name === undefined) &&
      (values.Res.name === "" || values.Res.name === undefined) &&
      values.fm.t === "" &&
      values.ln.t === "" &&
      values.ad.y === "" &&
      values.b.y.y === "" &&
      values.g === "" &&
      values.o === "" &&
      values.s === ""
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { t } = useTranslation();
  const { gender, occupation, dropdownLoading } = useSelector((state) => {
    return state.italiansToAmerica;
  });
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResPlace(valuesData);
    checkBirthPlace(valuesData);
    checkPDepartPlace(valuesData);
    checkIDestPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitForm(valuesData, { setSubmitting });
  };
  const handleLocationField = (setFieldValue, values) => {
    if (values.BirthPlace.id) {
      const loc = Object.keys(values.BirthPlace.levelData.residenceLevel);
      setFieldValue("b.li.s", loc[0]);
    }
    if (values.PDepart.id) {
      const loc = Object.keys(values.PDepart.levelData.residenceLevel);
      setFieldValue("d.li.s", loc[0]);
    }
    if (values.Res.id) {
      const loc = Object.keys(values.Res.levelData.residenceLevel);
      setFieldValue("pr.li.s", loc[0]);
    }
    if (values.IDest.id) {
      const loc = Object.keys(values.IDest.levelData.residenceLevel);
      setFieldValue("id.li.s", loc[0]);
    }
  };
  const handleMatchCheckbox = (e, values, setFieldValue) => {
    if (e.target.checked) {
      setFieldValue("ln.s", "0");
      setFieldValue("fm.s", "0");
      setFieldValue("pr.l.s", "0");
      setFieldValue("b.l.s", "0");
      setFieldValue("b.y.s", "2");
      setFieldValue("id.l.s", "0");
      setFieldValue("d.l.s", "0");
      setFieldValue("matchExact", true);
      setFieldValue(
        `ad.s`,
        Object.keys(
          DateDropdownValues(values.ad.y, values.ad.m, values.ad.d)
        )[0]
      );
      handleLocationField(setFieldValue, values);
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.b?.l?.l && setFieldValue("b.l.s", "4");
      !values?.pr?.l?.l && setFieldValue("pr.l.s", "1");
      !values?.b?.y?.y && setFieldValue("b.y.s", "8");
      !values?.id?.l?.l && setFieldValue("id.l.s", "1");
      !values?.d?.l?.l && setFieldValue("d.l.s", "1");
      !values?.ad?.y && setFieldValue(`ad.s`, "8");
    }
  };
  const defaultTypeItaliansSearch = typeSearchDefaultItaliansToAmerica();
  const italianMatchField = (setFieldValue, values) => {
    let formHtml = null;
    formHtml = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field
            name="matchExact"
            id="matchExact"
            type="checkbox"
            onChange={(e) => handleMatchCheckbox(e, values, setFieldValue)}
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
    return formHtml;
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
          setSubmitting,
          setFieldValue,
          handleChange,
          dirty,
          isSubmitting,
          isValid,
          values,
        }) => (
          <>
            {italianClear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultTypeItaliansSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultTypeItaliansSearch, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Previous Residence", "pr", "Res", values, setFieldValue)}
                </div>
              </div>
              <DateField
                name="ad"
                yearValue={values.ad.y}
                monthValue={values.ad.m}
                dayValue={values.ad.d}
                label="Arrival Date"
                values={values}
                setFieldValue={setFieldValue}
              />
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Birthplace", "b", "BirthPlace", values, setFieldValue)}
                </div>
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
                  {yearField("Birth Year", 'b.y', values, setFieldValue, defaultTypeItaliansSearch)}
                </div>
              </div>

              {immigrationFields(values, setFieldValue, gender, dropdownLoading, t)}
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  <label
                    className="block text-gray-600 text-sm mb-1"
                    htmlFor="grid-italian-ship-name"
                  >
                    Ship
                  </label>
                  <Field
                    name="s"
                    maxLength="35"
                    id="grid-italian-ship"
                    type="text"
                    className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
                    onChange={(e) => handleChange(e)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}
                </div>
              </div>
              <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
                {italianMatchField(setFieldValue, values)}
                {submitAndClearButtons(
                  dirty,
                  isSubmitting,
                  isValid,
                  italianClear,
                  buttonTitle,
                  t
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
