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
  germanDefaultValues,
  handleShowModal,
  buttonTitle,
  handleSubmitGermanToAmerica,
}) => {
  const handleSubmit = (values, { setSubmitting }) => {
    handleSubmitGermanToAmerica(values, { setSubmitting });
  };
  const showNameDiv = germanDefaultValues?.fm.t || germanDefaultValues?.ln.t;

  const getResOptions = () => {
    if (germanDefaultValues.Res?.levelData) {
      return germanDefaultValues.Res.levelData.residenceLevel;
    }
    return {};
  };

  const getBirthOptions = () => {
    if (germanDefaultValues.BirthPlace?.levelData) {
      return germanDefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };

  const getPDepartOptions = () => {
    if (germanDefaultValues.PDepart?.levelData) {
      return germanDefaultValues.PDepart.levelData.residenceLevel;
    }
    return {};
  };

  const getIdestOptions = () => {
    if (germanDefaultValues.IDest?.levelData) {
      return germanDefaultValues.IDest.levelData.residenceLevel;
    }
    return {};
  };

 

  const getArrivalDate = (setFieldValue) => {
    return <div className="refine-row border-b border-gray-200 pb-2 pt-2">
      <div className="label-wrap mb-2">
        <p className="text-gray-500 text-xs">Arrival Date</p>
      </div>
      <div className="row flex content-row pb-1 items-center">
        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
          {getFormattedDate(germanDefaultValues?.ad.y, germanDefaultValues?.ad.m, germanDefaultValues?.ad.d)}
        </div>
        <div className="ml-auto">
          <Field
            name={`ad.s`}
            options={DateDropdownValues(germanDefaultValues.ad.y, germanDefaultValues.ad.m, germanDefaultValues.ad.d)}
            component={TWDropDownComponent}
            onChange={CheckExactField.bind(this, setFieldValue)}
          />
        </div>
      </div>
    </div>
  }








  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={germanDefaultValues}
        onSubmit={handleSubmit}
      >
        {({ dirty, isSubmitting, isValid, setFieldValue }) => (
          <Form name="wwiiForm" className="w-full">
            <div className="flex flex-wrap mb-3 md:mb-2.5">
              <div className={`w-full ${width} pt-1 mb-3`}>
                {/** First name Last Name **/}
                {showNameDiv && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Name</p>
                    </div>
                    {germanDefaultValues?.fm.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {germanDefaultValues.fm.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="fm.s"
                            component={TWDropDownComponent}
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            options={getFirstAndLastName()}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              germanDefaultValues.fm.t
                            )}
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    )}
                    {germanDefaultValues?.ln.t && (
                      <div
                        className={`row flex content-row items-center ${germanDefaultValues.fm || "pb-1"
                          }`}
                      >
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {germanDefaultValues.ln.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="ln.s"
                            component={TWDropDownComponent}
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            options={getFirstAndLastName()}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              germanDefaultValues.ln.t
                            )}
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/** First name Last Name **/}

                {germanDefaultValues?.pr?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Previous Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {germanDefaultValues.pr?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          germanDefaultValues.pr?.li?.i,
                          "pr.li.s",
                          "pr.l.s",
                          germanDefaultValues.Res,
                          setFieldValue,
                          getResOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {germanDefaultValues?.ad.y && (
                  getArrivalDate(setFieldValue)
                )}

                {germanDefaultValues?.b?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birthplace</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {germanDefaultValues.b?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          germanDefaultValues.b?.li?.i,
                          "b.li.s",
                          "b.l.s",
                          germanDefaultValues.BirthPlace,
                          setFieldValue,
                          getBirthOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {germanDefaultValues?.b?.y?.y && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birth Year</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {germanDefaultValues?.b?.y?.y}
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

                {germanDefaultValues?.g && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{germanDefaultValues.g}</div>
                    </div>
                  </div>
                )}

                {germanDefaultValues?.d?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Place of Departure</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {germanDefaultValues.d?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          germanDefaultValues.d?.li?.i,
                          "d.li.s",
                          "d.l.s",
                          germanDefaultValues.PDepart,
                          setFieldValue,
                          getPDepartOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {germanDefaultValues?.id?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Immigration Destination</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {germanDefaultValues.id?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getFieldDropdowns(
                          germanDefaultValues.id?.li?.i,
                          "id.li.s",
                          "id.l.s",
                          germanDefaultValues.IDest,
                          setFieldValue,
                          getIdestOptions
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {germanDefaultValues?.s && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Ship</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{germanDefaultValues.s}</div>
                    </div>
                  </div>
                )}

                {germanDefaultValues?.o && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Occupation</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{germanDefaultValues.o}</div>
                    </div>
                  </div>
                )}

              </div>
            </div>
            
             {/** German Form Button **/}
             {refineSearchButtons(isSubmitting, isValid, dirty, buttonTitle, handleShowModal)}

          </Form>
        )}
      </Formik>
    </>
  );
};

export default RefineSearch;
