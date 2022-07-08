import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import {
   getFirstAndLastName,
   getDisabledOptions,
   CheckExactField
} from "../../../../../utils";
import { getFieldDropdowns, refineSearchButtons } from '../../../../../utils/search';
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
   width = "",
   usFederal1820DefaultValues,
   handleShowModal,
   buttonTitle,
   handleSubmitUSCensus1820,
}) => {
   const handleUSFederal1820Submit = (values, { setSubmitting }) => {
      handleSubmitUSCensus1820(values, { setSubmitting });
   };
   const showUSFederal1820NameDiv = usFederal1820DefaultValues?.fm.t || usFederal1820DefaultValues?.ln.t;

   const getResidenceOptions = () => {
      if (usFederal1820DefaultValues.Residence?.levelData) {
         return usFederal1820DefaultValues.Residence.levelData.residenceLevel;
      }
      return {};
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            onSubmit={handleUSFederal1820Submit}
            initialValues={usFederal1820DefaultValues}
         >
            {({ dirty, isSubmitting, isValid, setFieldValue }) => (
               <Form name="Census Form" className="w-full">
                  <div className="flex flex-wrap mb-3 md:mb-2.5">
                     <div className={`w-full ${width} pt-1 mb-3`}>
                        {/** First name Last Name **/}
                        {showUSFederal1820NameDiv && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Name</p>
                              </div>
                              {usFederal1820DefaultValues?.fm?.t && (
                                 <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {usFederal1820DefaultValues.fm.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="fm.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             usFederal1820DefaultValues.fm.t
                                          )}
                                          options={getFirstAndLastName()}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                              {usFederal1820DefaultValues?.ln?.t && (
                                 <div
                                    className={`row flex content-row items-center ${usFederal1820DefaultValues.fm || "pb-1"
                                       }`}
                                 >
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {usFederal1820DefaultValues.ln.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="ln.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          options={getFirstAndLastName()}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             usFederal1820DefaultValues.ln.t
                                          )}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                        {/** First name Last Name **/}

                        {usFederal1820DefaultValues?.r?.l?.l && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs"> Residence</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {usFederal1820DefaultValues.r?.l?.l}
                                 </div>
                                 <div className="ml-auto">
                                    {getFieldDropdowns(
                                       usFederal1820DefaultValues.r?.li?.i,
                                       "r.li.s",
                                       "r.l.s",
                                       usFederal1820DefaultValues.Residence,
                                       setFieldValue,
                                       getResidenceOptions
                                    )}
                                 </div>
                              </div>
                           </div>
                        )}

                        {usFederal1820DefaultValues?.sr && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Race/Nationality</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm">{usFederal1820DefaultValues.sr}</div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                  {/** US Federal 1820 Form Button **/}
                       {refineSearchButtons(isSubmitting, isValid, dirty, buttonTitle, handleShowModal)}
               </Form>
            )}
         </Formik>
      </>
   );
};

export default RefineSearch;
