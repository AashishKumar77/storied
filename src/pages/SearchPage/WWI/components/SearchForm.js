import React, { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Translator from "../../../../components/Translator";
import TWDropDownComponent from "../../../../components/TWDropDown/TWDropDownComponent";
import {
  typeSearchDefaultWWI,
  handleMatchCheckbox,
  getResidenceText,
} from "../../../../utils";
import SearchLocation from "../../../../components/FWSearchLocation";
import { v4 as uuidv4 } from "uuid";
import { tr } from "../../../../components/utils";
import { useTranslation } from "react-i18next";
import { dropDownField, inputField } from "../../../../utils/formFields";
import SearchPeople from "../../../../components/SearchPeople";
import { treePeopleList } from "../../../../redux/actions/sidebar";
import { getFirstNameDropDown } from "../../../../utils/search";
import { apiRequest } from "../../../../redux/requests";
import { GET } from "../../../../redux/constants";

const wwiCheckExactFieldLocation = (setFieldValue, locationfield, e) => {
  const loc = Object.keys(locationfield.levelData.residenceLevel);
  if (loc[0]) {
    const value = e.target.value;
    const checkValue = loc[0];
    if (value !== checkValue) {
      setFieldValue("matchExact", false);
    }
  }
};
const checkExactField = (setFieldValue, e) => {
  const value = parseInt(e.target.value);
  if (value !== 0) {
    setFieldValue("matchExact", false);
  }
};
const SearchForm = ({
  width = "",
  defaultValues,
  clear,
  buttonTitle,
  handleSubmitWWW1,
  inputWidth = "",
}) => {

  const formValidate = (values) => {
    let error = {
      invaild: "Inavild"
    };
    if (
      values.fm.t === "" &&
      values.ln.t === "" &&
      (values.LocationField.name === "" || values.LocationField.name === undefined) &&
      values.cd === "" &&
      values.gr === ""
    ) {
      error.invaild = "Inavild";
    } else {
      error = {};
    }
    return error;
  };

  const { dropdownLoading, causes, miltaryRanks } = useSelector((state) => {
    return state.ww1;
  });
  const { t } = useTranslation();
  const handleSubmit = (values, { setSubmitting }) => {
    const valuesData = {
      ...values,
    };
    if (valuesData["LocationField"]) {
      const { name, id } = valuesData["LocationField"];
      valuesData["l"]["l"] = name ? name : "";
      valuesData["li"]["i"] = id ? id : "";
      delete valuesData["LocationField"];
    }
    if (!valuesData.matchExact) {
      delete valuesData.matchExact
    }
    handleSubmitWWW1(valuesData, { setSubmitting });
  };
  const defaultTypeSerach = typeSearchDefaultWWI();
  const getResidence = (data) => {
    if (data.levelData) {
      return data.levelData.residenceLevel;
    }
    return null;
  };
  const getLocationSpecification = (
    locationfield,
    nameId,
    name,
    setFieldValue
  ) => {
    if (locationfield?.name) {
      const _options = (locationfield.id && getResidence(locationfield)) || { 4: "Broad" };
      return locationfield.id ? (
        <Field
          name={nameId}
          onChange={wwiCheckExactFieldLocation.bind(
            this, 
            setFieldValue,
            locationfield
          )}
          component={TWDropDownComponent}
          isloading={!_options}
          options={_options}
          />
      ) : (
        <Field
          name={name}
          onChange={checkExactField.bind(this, setFieldValue)}
          component={TWDropDownComponent}
          options={getResidenceText()}
        />
      );
    }
  };

  const matchCheckField = (setFieldValue, values) => {
    let html = null;
    html = (
      <div className="flex items-center mb-4 sm:mb-0 pr-2 w-full sm:w-auto pt-2.5 pb-3.5 sm:py-0">
        <div className="flex items-center h-5">
          <Field
            name="matchExact"
            type="checkbox"
            id="matchExact"
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border border-gray-400 rounded-lg"
            onChange={(e) => handleMatchCheckbox(e, { setFieldValue, values })}
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

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(treePeopleList({ treeId: "" }));
  }, [dispatch]);

  const {
    treePeople
  } = useSelector(state => {
    return state.sidebar
  });

  const getLifeEvents = async (val, setFieldValue) => {
    await apiRequest(GET, `persons/${val.id}/alllifeevents`).then((res) => {
      const lifeEventsData = res.data;
      const Residence = lifeEventsData?.find((data) => {
        return data.type === "Residence"
      }
      )
      if (Residence) {
        setFieldValue("LocationField.id", Residence.location.LocationId)
        setFieldValue("LocationField.name", Residence.location.Location)
        setFieldValue("l.l", Residence.location.Location)
        setFieldValue("l.s", "1")
        setFieldValue("li.s", "4")
      }
    })
  }
  
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
          setFieldValue,
          handleChange,
          values,
        }) => (
          <Form className="w-full">
            <div className="flex flex-wrap -mx-2 md:mb-2.5">
              <div className={`w-full ${width} px-2 mb-2.5`}>
                <label
                  className="block text-gray-600 text-sm mb-1"
                  htmlFor="grid-input-field"
                >
                  {tr(t, "search.ww1.form.fmname")}
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
                        setFieldValue("ln.t", val?.surname?.surname || "")
                        getLifeEvents(val , setFieldValue)
                      }
                    }}
                    getOptionLabel={(opt) => opt?.givenName?.givenName || values.fm?.t?.name}
                    id={`locations-filter-${uuidv4()}`}
                  />
                 {getFirstNameDropDown(setFieldValue , values , t)}
                </div>
              </div>
              <div className={`w-full ${width} px-2 mb-2.5`}>
                {inputField(tr(t, "search.ww1.form.lname"), 'ln', values, setFieldValue, handleChange, defaultTypeSerach, t)}
              </div>
            </div>

            <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
              <div className={`w-full ${width} px-2 mb-2.5`}>
                <label
                  className="block text-gray-600 text-sm mb-1"
                  htmlFor="grid-hometown"
                >
                  {tr(t, "search.ww1.list.residence")}
                </label>
                <div className="relative">
                  <Field
                    name={`LocationField`}
                    relatedField="li.s"
                    component={SearchLocation}
                    freeSolo={true}
                    searchType={true}
                    id={`locations-filter-${uuidv4()}`}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
                {/* <p className="text-red-500 text-xs italic">Please fill out this field.</p> */}
                {getLocationSpecification(
                  values.LocationField,
                  "li.s",
                  "l.s",
                  setFieldValue
                )}
              </div>
              <div className={`w-full ${width} px-2 mb-2.5`}>
                {dropDownField(tr(t, "search.ww1.form.codoi"), "cd", values, causes, dropdownLoading, t)}
              </div>
            </div>
            <div className="flex flex-wrap -mx-2 md:mb-2.5 relative">
              <div className={`w-full ${width} px-2 mb-2.5`}>
                {dropDownField(tr(t, "search.ww1.form.milrank"), "gr", values, miltaryRanks, dropdownLoading, t)}
              </div>
            </div>
            {/** Form Button **/}
            <div className="mb-2 pt-4 md:pt-7 sm:flex justify-between w-full">
              {matchCheckField(setFieldValue, values)}
              <div className="buttons sm:ml-auto sm:flex">
                <button
                  className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last"
                  type="Submit"
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
            {/** Form Button **/}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default SearchForm;
