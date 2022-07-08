import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import AdvancedSearchForm from "./AdvancedSearchForm";
import EventFieldForm from "./EventFieldForm";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import TWDropDownComponent from "./../../../components/TWDropDown/TWDropDownComponent";
import { getFirstAndLastName, getDisabledOptions, DateDropdownValues } from "../../../utils";
import Translator from "../../../components/Translator";
import { tr } from "../../../components/utils";
import { useTranslation } from "react-i18next";
import { treePeopleList } from "../../../redux/actions/sidebar";
import SearchPeople from "../../../components/SearchPeople";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "../../../redux/requests";
import { GET } from "../../../redux/constants";


const getFirstAndLastNameOptions = getFirstAndLastName();
const handleMatchCheckbox = (e, form, option) => {
  if (e.target.checked) {
    form.setFieldValue("matchExact", true)
    let lifeEvent = form?.values?.ls || [];
    for (let i = 0; i < lifeEvent.length; i++) {
      if (lifeEvent[i]?.y?.y !== '' && e.target.checked || lifeEvent[i]?.y?.y === '' && e.target.checked) {
        form.setFieldValue(`ls[${i}].y.s`, Object.keys(DateDropdownValues(form?.values?.ls[i]?.y?.y, form?.values?.ls[i]?.y?.m, form?.values?.ls[i]?.y?.d))[0]);
      }
      form.setFieldValue(`ls[${i}].l.s`, "0");
      if (option[i]) {
        const loc = Object.keys(option[i]);
        loc[0] && form.setFieldValue(`ls[${i}].li.s`, loc[0]);
      }
    }
    form.setFieldValue("fm.s", "0");
    form.setFieldValue("ln.s", "0");
  } else {
    handlematchElse(form);
  }

}
const handlematchElse = (form) => {
  form.setFieldValue("matchExact", false);
  !form.values?.fm.t && form.setFieldValue("fm.s", "2");
  !form.values?.ln.t && form.setFieldValue("ln.s", "2");
  !form.values?.l?.l && form.setFieldValue("l.s", "1");
  !form.values?.y?.y && form.setFieldValue("y.s", "8");
}
const checkExactField = (formik, e) => {
  const value = parseInt(e.target.value);
  if (value !== 0) {
    formik.setFieldValue("matchExact", false);
  }
};
const matchField = (advanceSearch, formik, option) => {
  let html = null;
  if (advanceSearch) {
    html = (
      <div className="flex items-start mb-4 sm:mb-0 pr-2">
        <div className="flex items-center h-5">
          <Field
            name="matchExact"
            type="checkbox"
            id="matchExact"
            onChange={(e) => handleMatchCheckbox(e, formik, option)}
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
  }
  return html;
};
const getFirstNameDropdown = (formik) => {
  let html = null;
  if (formik.values?.fm?.t?.givenName?.givenName || formik.values?.fm?.t?.name) {
    html = (
      <Field
        name="fm.s"
        component={TWDropDownComponent}
        onChange={checkExactField.bind(this, formik)}
        options={getFirstAndLastNameOptions}
        defaultValue="0"
        getdisabledoptions={getDisabledOptions(
          getFirstAndLastNameOptions,
          formik.values?.fm?.t
        )}
      />
    );
  }
  return html;
};
const getLastDropdown = (formik) => {
  let html = null;
  if (formik.values?.ln?.t?.trim()) {
    html = (
      <Field
        name="ln.s"
        component={TWDropDownComponent}
        onChange={checkExactField.bind(this, formik)}
        options={getFirstAndLastNameOptions}
        defaultValue="0"
        getdisabledoptions={getDisabledOptions(
          getFirstAndLastNameOptions,
          formik.values?.ln?.t
        )}
      />
    );
  }
  return html;
};
const handleNameChange = (e, formik, name, match) => {
  formik.handleChange(e);
  if (!e.target.value) {
    formik.setFieldValue(`${name}.s`, getFirstAndLastNameOptions[match] || "2");
  } else {
    if (formik.values.matchExact) {
      formik.setFieldValue(
        `${name}.s`,
        getFirstAndLastNameOptions[match] || "0"
      );
    }
  }
};


const UniversalSearchForm = ({
  handFormsubmit,
  handleSubmit,
  initialValues,
  isEdit,
  formVaildate,
  location,
  setellOptions = [],
  showHeader = true,
  advancedOpen = false,
}) => {
  const { t } = useTranslation();
  const [option, setOptionVal] = useState(setellOptions);
  const { isLoading } = useSelector((state) => state.search);
  const [advanceSearch, setAdvancedSearch] = useState(advancedOpen);
  const getcond = (formik) => {
    return !formik.dirty || !formik.isValid;
  };
  const handleReset = (formik) => {
    formik.resetForm();
    setAdvancedSearch(false);
  };
  const buttonlabel = isLoading ? (
    <Loader />
  ) : (
    tr(t, "search.unisearchform.search")
  );

  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(treePeopleList({ treeId: "" }));
  }, [dispatch]);

  const {
    treePeople
  } = useSelector(state => {
    return state.sidebar
  });

  const toDoubleDigitNumber = (n) => {
    return n > 9 ? "" + n: "0" + n;
}
  

  const getLifeEvents = async (val, formik) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const lifeEventsData = res.data;
      lifeEventsData?.map((data, index) => {

        formik.setFieldValue(`ls[${index}].le`, data.type)
        formik.setFieldValue(`ls[${index}].l.l`, data.location.Location)
        formik.setFieldValue(`ls[${index}].li.i`, data.location.LocationId)
        formik.setFieldValue(`ls[${index}].li.name`, data.location.Location)
        formik.setFieldValue(`ls[${index}].li.s`, "4")
        formik.setFieldValue(`ls[${index}].l.s`, "1")
        const EventDate = data?.date?.Date
        if (EventDate?.YearValue) {
          formik.setFieldValue(`ls[${index}].y.y`, EventDate?.YearValue)
          formik.setFieldValue(`ls[${index}].y.s`, "8")
        }
        if (EventDate?.MonthValue) {
          formik.setFieldValue(`ls[${index}].y.m`, toDoubleDigitNumber(EventDate?.MonthValue))
        }
        if (EventDate?.DayValue) {
          formik.setFieldValue(`ls[${index}].y.d`, EventDate?.DayValue)
        }
      })
    })
  }

  const Initiallocation = {
    le: "",
    l: { l: "", s: "1" },
    y: { y: "", m: "", d: "", s: "8" },
    li: { i: "", s: "4", name: "" },
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validate={formVaildate}
        onSubmit={handleSubmit}
      >
        {(formik) => {
          return (
            <>
              {/* <div className="head mb-5 flex flex-wrap justify-between items-center">
                        {getHeader(showHeader,t)}
                        {topSearchButton(formik,showHeader,handFormsubmit,advanceSearch,t)}
                    </div> */}
              <Form className="w-full">
                <div className="flex flex-wrap -mx-2 mb-5 md:mb-2.5">
                  <div className={`w-full md:w-1/2 px-2 mb-3`}>
                    <label className="block text-gray-600 text-sm mb-1" htmlFor="grid-cause">
                      {tr(t, "f&mName")}
                    </label>
                    <div className="relative">
                      <Field
                        name={`fm.t`}
                        options={treePeople}
                        component={SearchPeople}
                        freeSolo={true}
                        placeholder=" "
                        selectPeople={(val) => {
                          if (val?.givenName?.givenName) {
                            formik.setFieldValue("ln.t", val?.surname?.surname || "")
                            formik.setFieldValue("ls", [Initiallocation]);
                            getLifeEvents(val, formik)
                          }
                        }}
                        getOptionLabel={(opt) => opt?.givenName?.givenName || formik.values.fm?.t?.name}
                        id={`locations-filter-${uuidv4()}`}
                      />
                      {getFirstNameDropdown(formik)}
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <label
                      className="block text-gray-600 text-sm mb-1"
                      htmlFor="grid-last-name"
                    >
                      {tr(t, "LastName")}
                    </label>
                    <Field
                      name="ln.t"
                      className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                      id="grid-last-name"
                      type="text"
                      onChange={(e) =>
                        handleNameChange(e, formik, "ln", "ln.s")
                      }
                    />

                    {getLastDropdown(formik)}
                  </div>
                </div>
                <EventFieldForm
                  location={location}
                  setellOptions={option}
                  formik={formik}
                  setOptionVal={setOptionVal}
                  noPopup={showHeader}
                  isEdit={isEdit}
                />
                {advanceSearch ? <AdvancedSearchForm formik={formik} /> : null}
                <div className="mb-2 pt-6 flex justify-end sm:justify-between w-full items-center">
                  {matchField(advanceSearch, formik, option)}
                  {!advanceSearch ? (
                    <button
                      className="text-blue-500 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-3 sm:px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset"
                      type="button"
                      onClick={() => setAdvancedSearch(true)}
                    >
                      {tr(t, "search.unisearchform.adsearch")}
                    </button>
                  ) : null}
                  <div className="buttons flex items-center justify-end">
                    <button
                      className="text-gray-700 hidden sm:block active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black"
                      type="button"
                      onClick={() => handleReset(formik)}
                    >
                      {tr(t, "search.unisearchform.clr")}
                    </button>
                    <button
                      className={`bg-blue-400 w-28 active:bg-blue-500 text-white font-semibold text-base px-3 sm:px-6 py-2 ml-3 sm:ml-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200" type="Submit" ${!(formik.dirty && formik.isValid)
                        ? "opacity-50 cursor-default"
                        : ""
                        }`}
                      disabled={getcond(formik)}
                      type="submit"
                    >
                      {buttonlabel}
                    </button>
                  </div>
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
};

export default UniversalSearchForm;
