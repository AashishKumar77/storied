import React from "react";
import { Formik, Form, Field } from "formik";
import { useSelector } from "react-redux";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultIrish,
  DateDropdownValues,
} from "../../../../../utils";
import { checkIDestPlace, checkPDepartPlace, checkResPlace } from "../../../utils/common";
import IrishDateField from "../../../../../components/DateComponent";
import { headerContent, submitAndClearButtons } from "../../../../../utils/search";
import { dropDownField, inputField, yearField, locationField } from "../../../../../utils/formFields";
import { immigrationFields } from "../../../../../utils/formFields/immigrationForm";

const SearchForm = ({
  title,
  width = "",
  defaultValues,
  IrishClear,
  buttonTitle,
  handleSubmitIrish,
  inputWidth = "",
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };

    if (
      values.fm.t === "" &&
      values.ln.t === "" &&
      (values.Res.name === "" || values.Res.name === undefined) &&
      values.ad.y === "" &&
      values.b.y.y === "" &&
      values.g === "" &&
      (values.PDepart.name === "" && values.PDepart.name === undefined) &&
      (values.IDest.name === "" && values.IDest.name === undefined) &&
      values.o === "" &&
      values.rs === ""
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };

  const { gender, occupation, relationToHead, dropdownLoading } = useSelector(
    (state) => {
      return state.irish;
    }
  );

  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResPlace(valuesData);
    checkIDestPlace(valuesData);
    checkPDepartPlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitIrish(valuesData, { setSubmitting });
  };



  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("pr.l.s", "0");
      setFieldValue("b.y.s", "2");
      setFieldValue("id.l.s", "0");
      setFieldValue("d.l.s", "0");
      setFieldValue(`ad.s`, Object.keys(DateDropdownValues(values.ad.y, values.ad.m, values.ad.d))[0]);

      if (values.Res.id) {
        const loc = Object.keys(values.Res.levelData.residenceLevel);
        setFieldValue("pr.li.s", loc[0]);
      }

      if (values.IDest.id) {
        const loc = Object.keys(values.IDest.levelData.residenceLevel);
        setFieldValue("id.li.s", loc[0]);
      }

      if (values.PDepart.id) {
        const loc = Object.keys(values.PDepart.levelData.residenceLevel);
        setFieldValue("d.li.s", loc[0]);
      }
    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.b?.y?.y && setFieldValue("b.y.s", "8");
      !values?.pr?.l?.l && setFieldValue("pr.l.s", "1");
      !values?.id?.l?.l && setFieldValue("id.l.s", "1");
      !values?.d?.l?.l && setFieldValue("d.l.s", "1");
      !values?.ad?.y && setFieldValue(`ad.s`, "8");
    }
  };

  const defaultIrishSearch = typeSearchDefaultIrish();
  const irishmatchField = (setFieldValue, values) => {
    let irishhtml = null;
    irishhtml = (
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
    return irishhtml;
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
            {IrishClear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultIrishSearch, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultIrishSearch, t)}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                  {locationField("Previous Residence", "pr", "Res", values, setFieldValue)}
                </div>
              </div>

              <IrishDateField
                name="ad"
                yearValue={values.ad.y}
                monthValue={values.ad.m}
                dayValue={values.ad.d}
                label="Arrival Date"
                values={values}
                setFieldValue={setFieldValue}
              />

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
                  {yearField("Birth Year", 'b.y', values, setFieldValue, defaultIrishSearch)}
                </div>
              </div>

              {immigrationFields(values, setFieldValue, gender, dropdownLoading, t)}
              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Occupation", "o", values, occupation, dropdownLoading, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Relation to Head of House", "rs", values, relationToHead, dropdownLoading, t)}
                </div>
              </div>

              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {irishmatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, IrishClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
