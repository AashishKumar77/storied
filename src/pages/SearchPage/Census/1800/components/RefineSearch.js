import React from "react";
import { Formik, Form, Field } from "formik";
import TWDropDownComponent from "../../../../../components/TWDropDown/TWDropDownComponent";
import Button from "../../../../../components/Button";
import {
   getFirstAndLastName,
   getDisabledOptions,
   CheckExactField
} from "../../../../../utils";
import { getFieldDropdowns } from '../../../../../utils/search';
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
   width = "",
   usFederal1800DefaultValues,
   handleShowModal,
   buttonTitle,
   handleSubmitUSFederal1800,
}) => {
   const handleUSFederal1800Submit = (values, { setSubmitting }) => {
      handleSubmitUSFederal1800(values, { setSubmitting });
   };
   const showUSFederal1800NameDiv = usFederal1800DefaultValues?.fm.t || usFederal1800DefaultValues?.ln.t;

   const getResidenceOptions = () => {
      if (usFederal1800DefaultValues.Residence?.levelData) {
         return usFederal1800DefaultValues.Residence.levelData.residenceLevel;
      }
      return {};
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            onSubmit={handleUSFederal1800Submit}
            initialValues={usFederal1800DefaultValues}
         >
            {({ dirty, isSubmitting, isValid, setFieldValue }) => (
               <Form name="deathsForm" className="w-full">
                  <div className="flex flex-wrap mb-3 md:mb-2.5">
                     <div className={`w-full ${width} pt-1 mb-3`}>
                        {/** First name Last Name **/}
                        {showUSFederal1800NameDiv && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Name</p>
                              </div>
                              {usFederal1800DefaultValues?.fm?.t && (
                                 <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {usFederal1800DefaultValues.fm.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="fm.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             usFederal1800DefaultValues.fm.t
                                          )}
                                          options={getFirstAndLastName()}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                              {usFederal1800DefaultValues?.ln?.t && (
                                 <div
                                    className={`row flex content-row items-center ${usFederal1800DefaultValues.fm || "pb-1"
                                       }`}
                                 >
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {usFederal1800DefaultValues.ln.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="ln.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          options={getFirstAndLastName()}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             usFederal1800DefaultValues.ln.t
                                          )}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                        {/** First name Last Name **/}

                        {usFederal1800DefaultValues?.r?.l?.l && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs"> Residence</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {usFederal1800DefaultValues.r?.l?.l}
                                 </div>
                                 <div className="ml-auto">
                                    {getFieldDropdowns(
                                       usFederal1800DefaultValues.r?.li?.i,
                                       "r.li.s",
                                       "r.l.s",
                                       usFederal1800DefaultValues.Residence,
                                       setFieldValue,
                                       getResidenceOptions
                                    )}
                                 </div>
                              </div>
                           </div>
                        )}

                        {usFederal1800DefaultValues?.sr && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Race/Nationality</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm">{usFederal1800DefaultValues.sr}</div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                  {/** US Federal 1800 Form Button **/}
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
                           disabled={isSubmitting || !isValid || !dirty}
                           title={buttonTitle}
                           buttonType="submit"
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
