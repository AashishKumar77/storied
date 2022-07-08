import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import {
  getFirstAndLastName,
  getDisabledOptions,
  CheckExactField,
  getYearsOptions,
  DateDropdownValues,
  getFormattedDate,
} from "../../../../../utils";
import { getFieldDropdowns, refineSearchButtons } from "../../../../../utils/search";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({
  width = "",
  russianDefaultValues,
  handleShowModal,
  buttonTitle,
  handleSubmitRussian,
}) => {
  const handleSubmit = (values, { setSubmitting }) => {
    handleSubmitRussian(values, { setSubmitting });
  };
  const showNameDiv = russianDefaultValues?.fm.t || russianDefaultValues?.ln.t;
  const getBirthOptions = () => {
    if (russianDefaultValues.BirthPlace?.levelData) {
      return russianDefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };

  const getArrivalOptions = () => {
    if (russianDefaultValues.ArrivalPlace?.levelData) {
      return russianDefaultValues.ArrivalPlace.levelData.residenceLevel;
    }
    return {};
  };


  const getDepartOptions = () => {
    if (russianDefaultValues.Depart?.levelData) {
      return russianDefaultValues.Depart.levelData.residenceLevel;
    }
    return {};
  };


  const getResOptions = () => {
    if (russianDefaultValues.Res?.levelData) {
      return russianDefaultValues.Res.levelData.residenceLevel;
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
            {getFormattedDate(russianDefaultValues?.a.y.y, russianDefaultValues?.a.y.m, russianDefaultValues?.a.y.d)}
          </div>
          <div className="ml-auto">
            <Field
              name={`a.y.s`}
              options={DateDropdownValues(russianDefaultValues.a.y.y, russianDefaultValues.a.y.m, russianDefaultValues.a.y.d)}
              component={TWDropDownComponent}
              onChange={CheckExactField.bind(this, setFieldValue)}
            />
          </div>
        </div>
      </div>
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={russianDefaultValues}
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {showNameDiv && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Name</p>
                    </div>
                    {russianDefaultValues?.fm.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {russianDefaultValues.fm.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="fm.s"
                            component={TWDropDownComponent}
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            options={getFirstAndLastName()}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              russianDefaultValues.fm.t
                            )}
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    )}
                    {russianDefaultValues?.ln.t && (
                      <div
                        className={`row flex content-row items-center ${russianDefaultValues.fm || "pb-1"
                          }`}
                      >
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {russianDefaultValues.ln.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="ln.s"
                            component={TWDropDownComponent}
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            options={getFirstAndLastName()}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              russianDefaultValues.ln.t
                            )}
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {russianDefaultValues?.b?.y?.y && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birth Year</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {russianDefaultValues?.b?.y?.y}
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

                {russianDefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birthplace</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {russianDefaultValues?.b?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          russianDefaultValues.b?.li?.i,
                          "b.li.s",
                          "b.l.s",
                          russianDefaultValues.BirthPlace,
                          setFieldValue,
                          getBirthOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {russianDefaultValues?.a?.y?.y && getArrivalDate(setFieldValue)}

                {russianDefaultValues?.a?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Arrival Place</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {russianDefaultValues?.a?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          russianDefaultValues.a?.li?.i,
                          "a.li.s",
                          "a.l.s",
                          russianDefaultValues.ArrivalPlace,
                          setFieldValue,
                          getArrivalOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {russianDefaultValues?.g && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{russianDefaultValues.g}</div>
                    </div>
                  </div>
                )}

                {russianDefaultValues?.d?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">
                      Place of Departure
                      </p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {russianDefaultValues?.d?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          russianDefaultValues.d?.li?.i,
                          "d.li.s",
                          "d.l.s",
                          russianDefaultValues.Depart,
                          setFieldValue,
                          getDepartOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {russianDefaultValues?.r?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Previous Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {russianDefaultValues?.r?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          russianDefaultValues.r?.li?.i,
                          "r.li.s",
                          "r.l.s",
                          russianDefaultValues.Res,
                          setFieldValue,
                          getResOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {russianDefaultValues?.s && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Ship</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{russianDefaultValues.s}</div>
                    </div>
                  </div>
                )}

                {russianDefaultValues?.o && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Occupation</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{russianDefaultValues.o}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/** Russian Form Button **/}
            {refineSearchButtons(isSubmitting, isValid, dirty, buttonTitle, handleShowModal)}
            
          </Form>
        )}
      </Formik>
    </>
  );
};
export default RefineSearch;
