import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
   getFirstAndLastName,
   getDisabledOptions,
   CheckExactField,
   getYearsOptions,
} from "../../../../../utils";
import { getFieldDropdowns } from "../../../../../utils/search";
const getFirstAndLastNameMMOptions = getFirstAndLastName();
const RefineSearch = ({
   width = "",
   massachusettsMarriageDefaultValues,
   handleShowModal,
   buttonTitle,
   handleSubmitMassachusettsMarriages,
}) => {
   const handleMassachusettsMarriagesSubmit = (values, { setSubmitting }) => {
      handleSubmitMassachusettsMarriages(values, { setSubmitting });
   };
   const showMassachussetsNameDiv = massachusettsMarriageDefaultValues?.fm.t || massachusettsMarriageDefaultValues?.ln.t;


   const getMarriageOptions = () => {
      if (massachusettsMarriageDefaultValues.Marriage?.levelData) {
         return massachusettsMarriageDefaultValues.Marriage.levelData.residenceLevel;
      }
      return {};
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            onSubmit={handleMassachusettsMarriagesSubmit}
            initialValues={massachusettsMarriageDefaultValues}
         >
            {({ dirty, isSubmitting, isValid, setFieldValue }) => (
               <Form name="deathsForm" className="w-full">
                  <div className="flex flex-wrap mb-3 md:mb-2.5">
                     <div className={`w-full ${width} pt-1 mb-3`}>
                        {/** First name Last Name **/}
                        {showMassachussetsNameDiv && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Name</p>
                              </div>
                              {massachusettsMarriageDefaultValues?.fm.t && (
                                 <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {massachusettsMarriageDefaultValues.fm.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="fm.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameMMOptions,
                                             massachusettsMarriageDefaultValues.fm.t
                                          )}
                                          options={getFirstAndLastName()}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                              {massachusettsMarriageDefaultValues?.ln.t && (
                                 <div
                                    className={`row flex content-row items-center ${massachusettsMarriageDefaultValues.fm || "pb-1"
                                       }`}
                                 >
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {massachusettsMarriageDefaultValues.ln.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="ln.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          options={getFirstAndLastName()}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameMMOptions,
                                             massachusettsMarriageDefaultValues.ln.t
                                          )}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                        {/** First name Last Name **/}

                        {massachusettsMarriageDefaultValues?.m?.y?.y && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Marriage Year</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {massachusettsMarriageDefaultValues?.m?.y?.y}
                                 </div>
                                 <div className="ml-auto">
                                    <Field
                                       name={`m.y.s`}
                                       component={TWDropDownComponent}
                                       onChange={CheckExactField.bind(this, setFieldValue)}
                                       options={getYearsOptions()}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {massachusettsMarriageDefaultValues?.m?.l?.l && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs"> Marriage Place</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {massachusettsMarriageDefaultValues.m?.l?.l}
                                 </div>
                                 <div className="ml-auto">
                                    {getFieldDropdowns(
                                       massachusettsMarriageDefaultValues.m?.li?.i,
                                       "m.li.s",
                                       "m.l.s",
                                       massachusettsMarriageDefaultValues.Marriage,
                                       setFieldValue,
                                       getMarriageOptions
                                    )}
                                 </div>
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
                              title="Edit Search"
                              handleClick={(e) => {
                                 e.preventDefault();
                                 handleShowModal(true);
                              }}
                              type="default"
                           />
                        </div>
                        <Button
                           disabled={!dirty || isSubmitting || !isValid}
                           buttonType="submit"
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
