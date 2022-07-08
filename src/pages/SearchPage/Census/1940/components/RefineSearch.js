import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
  getFirstAndLastName,
  getDisabledOptions,
  getYearsOptions,
  CheckExactField,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import { getFieldDropdowns } from "../../../../../utils/search";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({
  width = "",
  USDefaultValues,
  handleShowModal,
  buttonTitle,
  handleSubmitUSFederalCensus,
}) => {
  const { t } = useTranslation();
  const handleFormSubmit = (values, { setSubmitting }) => {
    handleSubmitUSFederalCensus(values, { setSubmitting });
  };
  const showNamesDiv = USDefaultValues?.fm.t || USDefaultValues?.ln.t;
  const getBirthOptions = () => {
    if (USDefaultValues.BirthPlace?.levelData) {
      return USDefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };

  const getResidenceOptions = () => {
    if (USDefaultValues.RSPlace?.levelData) {
      return USDefaultValues.RSPlace.levelData.residenceLevel;
    }
    return {};
  };

  const getResidencePlaceOptions = () => {
    if (USDefaultValues.RSPPlace?.levelData) {
      return USDefaultValues.RSPPlace.levelData.residenceLevel;
    }
    return {};
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={USDefaultValues}
        onSubmit={handleFormSubmit}
      >
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNamesDiv && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">
                        {tr(t, "search.ww1.list.name")}
                      </p>
                    </div>
                    {USDefaultValues?.fm?.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {USDefaultValues.fm.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="fm.s"
                            component={TWDropDownComponent}
                            options={getFirstAndLastName()}
                            defaultValue="0"
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              USDefaultValues.fm.t
                            )}
                          />
                        </div>
                      </div>
                    )}
                    {USDefaultValues?.ln?.t && (
                      <div
                        className={`row flex content-row items-center ${USDefaultValues.fm || "pb-1"
                          }`}
                      >
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {USDefaultValues.ln.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="ln.s"
                            component={TWDropDownComponent}
                            options={getFirstAndLastName()}
                            defaultValue="0"
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              USDefaultValues.ln.t
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {USDefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {USDefaultValues?.r?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          USDefaultValues.r?.li?.i,
                          "r.li.s",
                          "r.l.s",
                          USDefaultValues.RSPlace,
                          setFieldValue,
                          getResidenceOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {USDefaultValues?.pr?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Previous Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {USDefaultValues?.pr?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          USDefaultValues.pr?.li?.i,
                          "pr.li.s",
                          "pr.l.s",
                          USDefaultValues.RSPPlace,
                          setFieldValue,
                          getResidencePlaceOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {USDefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birth Place</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {USDefaultValues.b?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          USDefaultValues.b?.li?.i,
                          "b.li.s",
                          "b.l.s",
                          USDefaultValues.BirthPlace,
                          setFieldValue,
                          getBirthOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {USDefaultValues?.b?.y?.y ? (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birth Year</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {USDefaultValues?.b?.y?.y}
                      </div>
                      <div className="ml-auto">
                        <Field
                          name={`b.y.s`}
                          component={TWDropDownComponent}
                          onChange={CheckExactField.bind(this, setFieldValue)}
                          options={getYearsOptions()}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}
                {USDefaultValues?.g ? (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{USDefaultValues.g}</div>
                    </div>
                  </div>
                ) : null}
                {USDefaultValues?.ms ? (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Marital Status</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{USDefaultValues.ms}</div>
                    </div>
                  </div>
                ) : null}
                {USDefaultValues?.sr ? (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Race/Nationality</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{USDefaultValues.sr}</div>
                    </div>
                  </div>
                ) : null}
                {USDefaultValues?.rs ? (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">
                        Relation to Head of House
                      </p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{USDefaultValues.rs}</div>
                    </div>
                  </div>
                ) : null}
                {USDefaultValues?.cs ? (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Citizenship</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{USDefaultValues.cs}</div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="mb-2 md:pt-6 flex justify-between w-full">
              <div className="buttons ml-auto flex">
                <div className="mr-1.5">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
                    title={tr(t, "search.ww1.list.esearch")}
                    type="default"
                  />
                </div>
                <Button
                  buttonType="submit"
                  disabled={!dirty || isSubmitting || !isValid}
                  title={
                    isSubmitting
                      ? tr(t, "search.ww1.form.dropdown.loading")
                      : buttonTitle
                  }
                />
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
