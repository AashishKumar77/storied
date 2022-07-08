import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import { typeSearchDefaultUSFederal1800 } from "../../../../../utils";
import { headerContent, submitAndClearButtons } from "../../../../../utils/search";
import { checkResidencePlace } from "../../../utils/common";
import { dropDownField, inputField, locationField } from "../../../../../utils/formFields";
const SearchForm = ({ title, width = "", defaultValues, UFCClear, buttonTitle, handleSubmitUSCensus1830, inputWidth = "" }) => {
  const formValidate = (_values) => {
    let error = {
      invalid: "Invalid",
    };
    if (_values.fm.t === "" && _values.ln.t === "" && _values.sr === "" && (_values.Residence.name === "" || _values.Residence.name === undefined)) {
      error.invalid = "Invalid";
    } else {
      error = {};
    }
    return error;
  };
  const { race, dropdownLoading } = useSelector((state) => {
    return state.usCensus1830;
  });
  const { t } = useTranslation();
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResidencePlace(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitUSCensus1830(valuesData, { setSubmitting });
  };
  const handleMatchCheckbox = (e, setFieldValue, formvalues) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      if (formvalues?.Residence?.id) {
        const loc = Object.keys(formvalues.Residence.levelData.residenceLevel);
        setFieldValue("r.li.s", loc[0]);
      }
      setFieldValue("r.l.s", "0");
    } else {
      !formvalues?.fm.t && setFieldValue("fm.s", "2");
      !formvalues?.ln.t && setFieldValue("ln.s", "2");
      !formvalues?.r?.l?.l && setFieldValue("r.l.s", "1");
      setFieldValue("matchExact", false);
    }
  };
  const defaultUSFederal1830Search = typeSearchDefaultUSFederal1800();
  const USFederal1830MatchField = (setFieldValue, values) => {
    let USFederal1830html = null;
    USFederal1830html = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field name="matchExact" id="matchExact" type="checkbox" onChange={(e) => handleMatchCheckbox(e, setFieldValue, values)} className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-400 rounded-lg" />
        </div>
        <div className="ml-2 text-sm">
          <label htmlFor="matchExact" className="font-medium text-gray-700">
            <Translator tkey="search.unisearchform.malltrms" />
          </label>
        </div>
      </div>
    );
    return USFederal1830html;
  };
  return (
    <>
      <Formik initialValues={defaultValues} validate={formValidate} onSubmit={handleSubmit}>
        {({ setFieldValue, setSubmitting, handleChange, values, dirty, isValid, isSubmitting }) => (
          <>
            {UFCClear
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
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.fmname"), "fm", values, setFieldValue, handleChange, defaultUSFederal1830Search, t)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{inputField(tr(t, "search.ww1.form.lname"), "ln", values, setFieldValue, handleChange, defaultUSFederal1830Search, t)}</div>
              </div>
              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>{locationField("Residence", "r", "Residence", values, setFieldValue)}</div>
                <div className={`w-full ${width} px-2 mb-2.5`}>{dropDownField("Race/Nationality", "sr", values, race, dropdownLoading, t)}</div>
              </div>
              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {USFederal1830MatchField(setFieldValue, values)}
                {submitAndClearButtons(dirty, isSubmitting, isValid, UFCClear, buttonTitle, t)}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};
export default SearchForm;
