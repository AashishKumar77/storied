import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
  getResidenceText,
  getFirstAndLastName,
  getDisabledOptions,
  CheckExactFieldLocation,
  getYearsOptions,
  DateDropdownValues,
  CheckExactField,
  getFormattedDate,
} from "../../../../../utils";
const getFirstAndLastNameOptions = getFirstAndLastName();
const RefineSearch = ({
  width = "",
  irishDefaultValues,
  handleShowModal,
  buttonTitle,
  handleSubmitIrish,
}) => {
  const handleSubmit = (values, { setSubmitting }) => {
    handleSubmitIrish(values, { setSubmitting });
  };
  const showNameDiv = irishDefaultValues?.fm.t || irishDefaultValues?.ln.t;

  const getResidenceOptions = () => {
    if (irishDefaultValues.Res?.levelData) {
      return irishDefaultValues.Res.levelData.residenceLevel;
    }
    return {};
  };

  const getResidenceFieldDropdowns = (
    setFieldValue,
    bool,
    name,
    nameId,
    locationfield
  ) => {
    if (bool) {
      return (
        <Field
          name={nameId}
          component={TWDropDownComponent}
          onChange={CheckExactFieldLocation.bind(
            this,
            setFieldValue,
            locationfield
          )}
          options={getResidenceOptions()}
        />
      );
    } else {
      return (
        <Field
          name={name}
          component={TWDropDownComponent}
          options={getResidenceText()}
          onChange={CheckExactField.bind(this, setFieldValue)}
        />
      );
    }
  };


  const getIDestOptions = () => {
    if (irishDefaultValues.IDest?.levelData) {
      return irishDefaultValues.IDest.levelData.residenceLevel;
    }
    return {};
  };

  const getIDestFieldDropdowns = (
    setFieldValue,
    bool,
    name,
    nameId,
    locationfield
  ) => {
    if (bool) {
      return (
        <Field
          name={nameId}
          component={TWDropDownComponent}
          onChange={CheckExactFieldLocation.bind(
            this,
            setFieldValue,
            locationfield
          )}
          options={getIDestOptions()}
        />
      );
    } else {
      return (
        <Field
          name={name}
          component={TWDropDownComponent}
          options={getResidenceText()}
          onChange={CheckExactField.bind(this, setFieldValue)}
        />
      );
    }
  };

  const getPDepartOptions = () => {
    if (irishDefaultValues.PDepart?.levelData) {
      return irishDefaultValues.PDepart.levelData.residenceLevel;
    }
    return {};
  };

  const getPDepartFieldDropdowns = (
    setFieldValue,
    bool,
    name,
    nameId,
    locationfield
  ) => {
    if (bool) {
      return (
        <Field
          name={nameId}
          component={TWDropDownComponent}
          onChange={CheckExactFieldLocation.bind(
            this,
            setFieldValue,
            locationfield
          )}
          options={getPDepartOptions()}
        />
      );
    } else {
      return (
        <Field
          name={name}
          component={TWDropDownComponent}
          options={getResidenceText()}
          onChange={CheckExactField.bind(this, setFieldValue)}
        />
      );
    }
  };

  const getArrivalDate = (setFieldValue) => {
    return <div className="refine-row border-b border-gray-200 pb-2 pt-2">
      <div className="label-wrap mb-2">
        <p className="text-gray-500 text-xs">Arrival Date</p>
      </div>
      <div className="row flex content-row pb-1 items-center">
        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
          {getFormattedDate(irishDefaultValues?.ad.y, irishDefaultValues?.ad.m, irishDefaultValues?.ad.d)}
        </div>
        <div className="ml-auto">
          <Field
            name={`ad.s`}
            options={DateDropdownValues(irishDefaultValues.ad.y, irishDefaultValues.ad.m, irishDefaultValues.ad.d)}
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
        initialValues={irishDefaultValues}
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
                    {irishDefaultValues?.fm.t && (
                      <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {irishDefaultValues.fm.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="fm.s"
                            component={TWDropDownComponent}
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            options={getFirstAndLastName()}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              irishDefaultValues.fm.t
                            )}
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    )}
                    {irishDefaultValues?.ln.t && (
                      <div
                        className={`row flex content-row items-center ${irishDefaultValues.fm || "pb-1"
                          }`}
                      >
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                          {irishDefaultValues.ln.t}
                        </div>
                        <div className="ml-auto">
                          <Field
                            name="ln.s"
                            component={TWDropDownComponent}
                            onChange={CheckExactField.bind(this, setFieldValue)}
                            options={getFirstAndLastName()}
                            getdisabledoptions={getDisabledOptions(
                              getFirstAndLastNameOptions,
                              irishDefaultValues.ln.t
                            )}
                            defaultValue="0"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/** First name Last Name **/}

                {irishDefaultValues?.pr?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs"> Previous Residence</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {irishDefaultValues.pr?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getResidenceFieldDropdowns(
                          setFieldValue,
                          irishDefaultValues.pr?.li?.i,
                          "pr.l.s",
                          "pr.li.s",
                          irishDefaultValues.Res
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {irishDefaultValues?.ad.y && (
                  getArrivalDate(setFieldValue)
                )}

                {irishDefaultValues?.b?.y?.y && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Birth Year</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {irishDefaultValues?.b?.y?.y}
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

                {irishDefaultValues?.g && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Gender</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{irishDefaultValues.g}</div>
                    </div>
                  </div>
                )}


                {irishDefaultValues?.d?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">
                        Place of Departure
                      </p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {irishDefaultValues.d?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getPDepartFieldDropdowns(
                          setFieldValue,
                          irishDefaultValues.d?.li?.i,
                          "d.l.s",
                          "d.li.s",
                          irishDefaultValues.PDepart
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {irishDefaultValues?.id?.l?.l && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">
                        Immigration Destination
                      </p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                        {irishDefaultValues.id?.l?.l}
                      </div>
                      <div className="ml-auto">
                        {getIDestFieldDropdowns(
                          setFieldValue,
                          irishDefaultValues.id?.li?.i,
                          "id.l.s",
                          "id.li.s",
                          irishDefaultValues.IDest
                        )}
                      </div>
                    </div>
                  </div>
                )}


                {irishDefaultValues?.o && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">Occupation</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{irishDefaultValues.o}</div>
                    </div>
                  </div>
                )}

                {irishDefaultValues?.rs && (
                  <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                    <div className="label-wrap mb-2">
                      <p className="text-gray-500 text-xs">
                        Relation to Head of House
                      </p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                      <div className="text text-sm">{irishDefaultValues.rs}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/** Form Button **/}
            <div className="mb-2 md:pt-6 flex justify-between w-full">
              <div className="buttons ml-auto flex">
                <div className="mr-1.5">
                  <Button
                    handleClick={(e) => {
                      e.preventDefault();
                      handleShowModal(true);
                    }}
                    title="Edit Search"
                    type="default"
                  />
                </div>
                <Button
                  buttonType="submit"
                  disabled={!dirty || isSubmitting || !isValid}
                  title={buttonTitle}
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
