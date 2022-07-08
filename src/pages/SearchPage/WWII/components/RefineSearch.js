import React from 'react'
import { Formik, Form, Field } from 'formik'
import TWDropDownComponent from '../../../../components/TWDropDown/TWDropDownComponent'
import Button from "../../../../components/Button";
import { getFirstAndLastName, getDisabledOptions, getYearsOptions, CheckExactField, DateDropdownValues, getFormattedDate } from '../../../../utils'
import { getFieldDropdowns } from '../../../../utils/search';
const getFirstAndLastNameOptions = getFirstAndLastName()
const RefineSearch = ({
  width = "",
  WWIIDefaultValues,
  handleShowModal,
  buttonTitle,
  handleSubmitWWII
}) => {
  const handleSubmit = (values, { setSubmitting }) => {
    handleSubmitWWII(values, { setSubmitting })
  }
  const showNameDiv = WWIIDefaultValues?.fm.t || WWIIDefaultValues?.ln.t;

  const getEnlistOptions = () => {
    if (WWIIDefaultValues.Enlist?.levelData) {
      return WWIIDefaultValues.Enlist.levelData.residenceLevel;
    }
    return {};
  };
  const getBirthOptions = () => {
    if (WWIIDefaultValues.BirthPlace?.levelData) {
      return WWIIDefaultValues.BirthPlace.levelData.residenceLevel;
    }
    return {};
  };

  const getResidenceOptions = () => {
    if (WWIIDefaultValues.Residence?.levelData) {
      return WWIIDefaultValues.Residence.levelData.residenceLevel;
    }
    return {};
  };

  const WWIIFields = (setFieldValue) => {
    return <>
      {WWIIDefaultValues?.sr?.y?.y && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Residence Date</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
              {getFormattedDate(WWIIDefaultValues?.sr.y.y, WWIIDefaultValues?.sr.y.m, WWIIDefaultValues?.sr.y.d)}
            </div>
            <div className="ml-auto">
              <Field
                name={`sr.y.s`}
                options={DateDropdownValues(WWIIDefaultValues.sr.y.y, WWIIDefaultValues.sr.y.m, WWIIDefaultValues.sr.y.d)}
                component={TWDropDownComponent}
                onChange={CheckExactField.bind(this, setFieldValue)}
              />
            </div>
          </div>
        </div>
      )}
      {WWIIDefaultValues?.r && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Race/Nationality</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.r}</div>
          </div>
        </div>
      )}

      {WWIIDefaultValues?.m && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Marital Status</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.m}</div>
          </div>
        </div>
      )}

      {WWIIDefaultValues?.er && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Military Rank</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.er}</div>
          </div>
        </div>
      )}

      {WWIIDefaultValues?.el && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Level of Education</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.el}</div>
          </div>
        </div>
      )}
      {WWIIDefaultValues?.o && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Occupation</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.o}</div>
          </div>
        </div>
      )}
      {WWIIDefaultValues?.c && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Citizenship</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.c}</div>
          </div>
        </div>
      )}
      {WWIIDefaultValues?.ec && (
        <div className="refine-row border-b border-gray-200 pb-2 pt-2">
          <div className="label-wrap mb-2">
            <p className="text-gray-500 text-xs">Component of the Army</p>
          </div>
          <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm">{WWIIDefaultValues.ec}</div>
          </div>
        </div>
      )}
    </>
  }

  return <>
    <Formik
      enableReinitialize={true}
      initialValues={WWIIDefaultValues}
      onSubmit={handleSubmit}>
      {({
        dirty,
        isSubmitting,
        isValid,
        setFieldValue
      }) => (
        <Form name="wwiiForm" className="w-full">
          <div className="flex flex-wrap mb-3 md:mb-2.5">
            <div className={`w-full ${width} pt-1 mb-3`}>
              {/** First name Last Name **/}
              {showNameDiv && <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                <div className="label-wrap mb-2">
                  <p className="text-gray-500 text-xs">Name</p>
                </div>
                {WWIIDefaultValues?.fm.t && <div className="row flex content-row pb-1 items-center">
                  <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{WWIIDefaultValues.fm.t}</div>
                  <div className="ml-auto">
                    <Field name="fm.s" component={TWDropDownComponent} onChange={CheckExactField.bind(this, setFieldValue)} options={getFirstAndLastName()} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, WWIIDefaultValues.fm.t)} defaultValue="0" />
                  </div>
                </div>}
                {WWIIDefaultValues?.ln.t && <div className={`row flex content-row items-center ${WWIIDefaultValues.fm || "pb-1"}`}>
                  <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{WWIIDefaultValues.ln.t}</div>
                  <div className="ml-auto">
                    <Field name="ln.s" component={TWDropDownComponent} onChange={CheckExactField.bind(this, setFieldValue)} options={getFirstAndLastName()} getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, WWIIDefaultValues.ln.t)} defaultValue="0" />
                  </div>
                </div>}
              </div>}
              {/** First name Last Name **/}

              {WWIIDefaultValues?.b?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Birth Place</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {WWIIDefaultValues.b?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        WWIIDefaultValues.b?.li?.i,
                        "b.li.s",
                        "b.l.s",
                        WWIIDefaultValues.BirthPlace,
                        setFieldValue,
                        getBirthOptions

                      )}
                    </div>
                  </div>
                </div>
              )}

              {WWIIDefaultValues?.b?.y?.y && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Birth Year</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {WWIIDefaultValues?.b?.y?.y}
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

              {WWIIDefaultValues?.e?.y?.y && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Enlistment Date</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {getFormattedDate(WWIIDefaultValues?.e.y.y, WWIIDefaultValues?.e.y.m, WWIIDefaultValues?.e.y.d)}
                    </div>
                    <div className="ml-auto">
                      <Field
                        name={`e.y.s`}
                        options={DateDropdownValues(WWIIDefaultValues.e.y.y, WWIIDefaultValues.e.y.m, WWIIDefaultValues.e.y.d)}
                        component={TWDropDownComponent}
                        onChange={CheckExactField.bind(this, setFieldValue)}
                      />
                    </div>
                  </div>
                </div>
              )}


              {WWIIDefaultValues?.e?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Place of Enlistment</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {WWIIDefaultValues.e?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        WWIIDefaultValues.e?.li?.i,
                        "e.li.s",
                        "e.l.s",
                        WWIIDefaultValues.Enlist,
                        setFieldValue,
                        getEnlistOptions
                      )}
                    </div>
                  </div>
                </div>
              )}

              {WWIIDefaultValues?.sr?.l?.l && (
                <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                  <div className="label-wrap mb-2">
                    <p className="text-gray-500 text-xs">Residence</p>
                  </div>
                  <div className="row flex content-row pb-1 items-center">
                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                      {WWIIDefaultValues.sr?.l?.l}
                    </div>
                    <div className="ml-auto">
                      {getFieldDropdowns(
                        WWIIDefaultValues.sr?.li?.i,
                        "sr.li.s",
                        "sr.l.s",
                        WWIIDefaultValues.Residence,
                        setFieldValue,
                        getResidenceOptions
                      )}
                    </div>
                  </div>
                </div>
              )}
              {WWIIFields(setFieldValue)}
            </div>
          </div>
          {/** WWII Form Button **/}
          <div className="mb-2 md:pt-6 flex justify-between w-full">
            <div className="buttons ml-auto flex">
              <div className="mr-1.5">
                <Button
                  title="Edit Search"
                  handleClick={(e) => {
                    e.preventDefault();
                    handleShowModal(true);
                  }}
                  type="default"
                />
              </div>
              <Button
                buttonType="submit"
                title={buttonTitle}
                disabled={!dirty || !isValid || isSubmitting}
              />
            </div>
          </div>
        </Form>
      )}
    </Formik>
  </>
}

export default RefineSearch;