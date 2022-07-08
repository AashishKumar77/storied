import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
  getFirstAndLastName,
  getDisabledOptions,
  CheckExactField,
  getYearsOptions,
  DateDropdownValues,
  getFormattedDate,
} from "../../../../../utils";
import { getFieldDropdowns } from "../../../../../utils/search";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({
  width = "",
  italianDefaultValues,
  handleShowModal,
  buttonTitle,
  handleSubmitForm,
}) => {
  const handleSubmit = (values, { setSubmitting }) => {
    handleSubmitForm(values, { setSubmitting });
  };
  const showNameDiv = italianDefaultValues?.fm.t || italianDefaultValues?.ln.t;
  const getResOptions = () => {
    if (italianDefaultValues.Res?.levelData) {
      return italianDefaultValues.Res.levelData.residenceLevel;
    }
    return {};
  };
  const getBirthOptions = () => {
    if (italianDefaultValues.BirthPlace?.levelData) {
      return italianDefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };
  const getPDepartOptions = () => {
    if (italianDefaultValues.PDepart?.levelData) {
      return italianDefaultValues.PDepart.levelData.residenceLevel;
    }
    return {};
  };
  const getIdestOptions = () => {
    if (italianDefaultValues.IDest?.levelData) {
      return italianDefaultValues.IDest.levelData.residenceLevel;
    }
    return {};
  };
  const getArrivalDate = (setFieldValue) => {
    return (
      <div className="refine-row border-b border-gray-200 pb-2 pt-2">
        <div className="label-wrap mb-2">
          <p className="text-gray-500 text-xs">Arrival Date</p>
        </div>
        <div className="row flex content-row pb-1 items-center">
          <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
            {getFormattedDate(italianDefaultValues?.ad.y, italianDefaultValues?.ad.m, italianDefaultValues?.ad.d)}
          </div>
          <div className="ml-auto">
            <Field
              name={`ad.s`}
              options={DateDropdownValues(
                italianDefaultValues.ad.y,
                italianDefaultValues.ad.m,
                italianDefaultValues.ad.d
              )}
              component={TWDropDownComponent}
              onChange={CheckExactField.bind(this, setFieldValue)}
            />
          </div>
        </div>
      </div>
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={italianDefaultValues}
      onSubmit={handleSubmit}
    >
      {({ dirty, isSubmitting, isValid, setFieldValue }) => (
        <Form name="wwiiForm" className="w-full">
          <div className="flex flex-wrap mb-3 md:mb-2.5">
            <div className={`w-full ${width} pt-1 mb-3`}>
              {showNameDiv && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Name</p>
                  </div>
                  {italianDefaultValues?.fm.t && (
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {italianDefaultValues.fm.t}
                      </div>
                      <div className="ml-auto">
                        <Field
                          name="fm.s"
                          component={TWDropDownComponent}
                          onChange={CheckExactField.bind(this, setFieldValue)}
                          options={getFirstAndLastName()}
                          getdisabledoptions={getDisabledOptions(
                            getFirstAndLastNameOptions,
                            italianDefaultValues.fm.t
                          )}
                          defaultValue="0"
                        />
                      </div>
                    </div>
                  )}
                  {italianDefaultValues?.ln.t && (
                    <div
                      className={`row flex content-row items-center ${
                        italianDefaultValues.fm || "pb-1"
                      }`}
                    >
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {italianDefaultValues.ln.t}
                      </div>
                      <div className="ml-auto">
                        <Field
                          name="ln.s"
                          component={TWDropDownComponent}
                          onChange={CheckExactField.bind(this, setFieldValue)}
                          options={getFirstAndLastName()}
                          getdisabledoptions={getDisabledOptions(
                            getFirstAndLastNameOptions,
                            italianDefaultValues.ln.t
                          )}
                          defaultValue="0"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {italianDefaultValues?.pr?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Previous Residence</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {italianDefaultValues.pr?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        italianDefaultValues.pr?.li?.i,
                        "pr.li.s",
                        "pr.l.s",
                        italianDefaultValues.Res,
                        setFieldValue,
                        getResOptions
                      )}
                    </div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.ad.y && getArrivalDate(setFieldValue)}
              {italianDefaultValues?.b?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Birthplace</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {italianDefaultValues.b?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        italianDefaultValues.b?.li?.i,
                        "b.li.s",
                        "b.l.s",
                        italianDefaultValues.BirthPlace,
                        setFieldValue,
                        getBirthOptions
                      )}
                    </div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.b?.y?.y && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Birth Year</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {italianDefaultValues?.b?.y?.y}
                    </div>
                    <div className="ml-auto">
                      <Field
                        name={`b.y.s`}
                        options={getYearsOptions()}
                        component={TWDropDownComponent}
                        onChange={CheckExactField.bind(this, setFieldValue)}
                      />
                    </div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.g && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Gender</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm">{italianDefaultValues.g}</div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.d?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Place of Departure</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {italianDefaultValues.d?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        italianDefaultValues.d?.li?.i,
                        "d.li.s",
                        "d.l.s",
                        italianDefaultValues.PDepart,
                        setFieldValue,
                        getPDepartOptions
                      )}
                    </div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.id?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">
                      Immigration Destination
                    </p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {italianDefaultValues.id?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        italianDefaultValues.id?.li?.i,
                        "id.li.s",
                        "id.l.s",
                        italianDefaultValues.IDest,
                        setFieldValue,
                        getIdestOptions
                      )}
                    </div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.s && (
                <div className="refine-row pb-2 pt-2 border-b border-gray-200">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Ship</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm">{italianDefaultValues.s}</div>
                  </div>
                </div>
              )}
              {italianDefaultValues?.o && (
                <div className="refine-row pb-2 pt-2 border-b border-gray-200">
                  <div className="label-wrap mb-2">
                    <p className="text-xs text-gray-500">Occupation</p>
                  </div>
                  <div className="row items-center flex content-row pb-1">
                    <div className="text text-sm">{italianDefaultValues.o}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mb-2 md:pt-6 w-full">
            <div className="flex buttons ml-auto">
              <div className="mr-1.5">
                <Button
                  handleClick={(e) => {
                    e.preventDefault();
                    handleShowModal(true);
                  }}
                  type="default"
                  title="Edit Search"
                />
              </div>
              <Button
                title={isSubmitting ? "Loading..." : buttonTitle}
                disabled={!dirty || isSubmitting || !isValid}
                buttonType="submit"
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default RefineSearch;
