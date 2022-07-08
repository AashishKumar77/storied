import React from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import Translator from "../../../../../components/Translator";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  typeSearchDefaultUSFederal1800,
} from "../../../../../utils";
import { headerContent } from "../../../../../utils/search";
import { dropDownField, inputField, locationField } from "../../../../../utils/formFields";

const checkResidence = (values) => {
  if (values["Residence"]) {
    const { name, id } = values["Residence"];
    values["r"]["l"]["l"] = name ? name : "";
    values["r"]["li"]["i"] = id ? id : "";
    delete values["Residence"];
  }
};

const SearchForm = ({
  title,
  width = "",
  defaultValues,
  USFClear,
  buttonTitle,
  handleSubmitUSFederal1800,
  inputWidth = "",
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };

    if (
      values.fm.t === "" &&
      values.ln.t === "" &&
      (values.Residence.name === "" || values.Residence.name === undefined) &&
      values.sr === ""
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };
  const { race, dropdownLoading } = useSelector((state) => { return state.usFederal1800; });
  const { t } = useTranslation();

  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    checkResidence(valuesData);
    if (!valuesData.matchExact) {
      delete valuesData.matchExact;
    }
    handleSubmitUSFederal1800(valuesData, { setSubmitting });
  };

  const handleMatchCheckbox = (e, setFieldValue, values) => {
    if (e.target.checked) {
      setFieldValue("matchExact", true);
      setFieldValue("fm.s", "0");
      setFieldValue("ln.s", "0");
      setFieldValue("r.l.s", "0");
      if (values?.Residence?.id) {
        const loc = Object.keys(values.Residence.levelData.residenceLevel);
        setFieldValue("r.li.s", loc[0]);
      }

    } else {
      setFieldValue("matchExact", false);
      !values?.fm.t && setFieldValue("fm.s", "2");
      !values?.ln.t && setFieldValue("ln.s", "2");
      !values?.m?.l?.l && setFieldValue("r.l.s", "1");
    }
  };

  const defaultUSFederal1800Search = typeSearchDefaultUSFederal1800();
  const USFederal1800MatchField = (setFieldValue, values) => {
    let USFederal1800html = null;
    USFederal1800html = (
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
    return USFederal1800html;
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
            {USFClear
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
                  {inputField(tr(t, "search.ww1.form.fmname"), 'fm', values, setFieldValue, handleChange, defaultUSFederal1800Search, t)}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultUSFederal1800Search, t)}
                </div>
              </div>

              <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {locationField("Residence", "r", "Residence", values, setFieldValue, "City, County")}
                </div>
                <div className={`w-full ${width} px-2 mb-2.5`}>
                  {dropDownField("Race/Nationality", "sr", values, race, dropdownLoading, t)}
                </div>
              </div>

              <div className="mb-2 pt-4 md:pt-10 sm:flex justify-between w-full">
                {USFederal1800MatchField(setFieldValue, values)}
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
                  {USFClear ? (
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
