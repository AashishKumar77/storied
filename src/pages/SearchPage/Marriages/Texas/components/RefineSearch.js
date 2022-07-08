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
   getFormattedDate
} from "../../../../../utils";
import { getFieldDropdowns } from '../../../../../utils/search';
const getFirstAndLastNameDeathOptions = getFirstAndLastName();
const RefineSearch = ({
   width = "",
   texasMarriagesDefaultValues,
   handleShowModal,
   buttonTitle,
   handleSubmitTexasMarriages,
}) => {
   const handleTexasMarriagesSubmit = (values, { setSubmitting }) => {
      handleSubmitTexasMarriages(values, { setSubmitting });
   };
   const showTexasMarriagesNameDiv = texasMarriagesDefaultValues?.fm.t || texasMarriagesDefaultValues?.ln.t;

   const getMarriageOptions = () => {
      if (texasMarriagesDefaultValues.Marriage?.levelData) {
         return texasMarriagesDefaultValues.Marriage.levelData.residenceLevel;
      }
      return {};
   };

   return (
      <>
         <Formik
            enableReinitialize={true}
            onSubmit={handleTexasMarriagesSubmit}
            initialValues={texasMarriagesDefaultValues}
         >
            {({ dirty, isSubmitting, isValid, setFieldValue }) => (
               <Form name="deathsForm" className="w-full">
                  <div className="flex flex-wrap mb-3 md:mb-2.5">
                     <div className={`w-full ${width} pt-1 mb-3`}>
                        {/** First name Last Name **/}
                        {showTexasMarriagesNameDiv && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Name</p>
                              </div>
                              {texasMarriagesDefaultValues?.fm?.t && (
                                 <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {texasMarriagesDefaultValues.fm.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="fm.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             texasMarriagesDefaultValues.fm.t
                                          )}
                                          options={getFirstAndLastName()}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                              {texasMarriagesDefaultValues?.ln?.t && (
                                 <div
                                    className={`row flex content-row items-center ${texasMarriagesDefaultValues.fm || "pb-1"
                                       }`}
                                 >
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {texasMarriagesDefaultValues.ln.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="ln.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          options={getFirstAndLastName()}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             texasMarriagesDefaultValues.ln.t
                                          )}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                        {/** First name Last Name **/}

                        {texasMarriagesDefaultValues?.b?.y && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Birth Year</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {texasMarriagesDefaultValues?.b?.y}
                                 </div>
                                 <div className="ml-auto">
                                    <Field
                                       name={`b.s`}
                                       component={TWDropDownComponent}
                                       onChange={CheckExactField.bind(this, setFieldValue)}
                                       options={getYearsOptions()}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {texasMarriagesDefaultValues?.g && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Gender</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm">{texasMarriagesDefaultValues.g}</div>
                              </div>
                           </div>
                        )}

                        {texasMarriagesDefaultValues?.s?.fm?.t && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Spouse First & Middle Name(s)</p>
                              </div>
                              {texasMarriagesDefaultValues?.s.fm.t && (
                                 <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                       {texasMarriagesDefaultValues.s.fm.t}
                                    </div>
                                    <div className="ml-auto">
                                       <Field
                                          name="s.fm.s"
                                          component={TWDropDownComponent}
                                          onChange={CheckExactField.bind(this, setFieldValue)}
                                          getdisabledoptions={getDisabledOptions(
                                             getFirstAndLastNameDeathOptions,
                                             texasMarriagesDefaultValues.fm.t
                                          )}
                                          options={getFirstAndLastName()}
                                          defaultValue="0"
                                       />
                                    </div>
                                 </div>
                              )}
                           </div>
                        )}
                        {texasMarriagesDefaultValues?.s?.ln?.t && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Spouse Last Name</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {texasMarriagesDefaultValues.s.ln.t}
                                 </div>
                                 <div className="ml-auto">
                                    <Field
                                       name="s.ln.s"
                                       component={TWDropDownComponent}
                                       onChange={CheckExactField.bind(this, setFieldValue)}
                                       getdisabledoptions={getDisabledOptions(
                                          getFirstAndLastNameDeathOptions,
                                          texasMarriagesDefaultValues.s.ln.t
                                       )}
                                       options={getFirstAndLastName()}
                                       defaultValue="0"
                                    />
                                 </div>
                              </div>
                           </div>
                        )}
                        {texasMarriagesDefaultValues?.m?.y?.y && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs">Marriage Date</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                   {getFormattedDate(texasMarriagesDefaultValues?.m.y.y , texasMarriagesDefaultValues?.m.y.m , texasMarriagesDefaultValues?.m.y.d)}
                                 </div>
                                 <div className="ml-auto">
                                    <Field
                                       name={`m.y.s`}
                                       options={DateDropdownValues(texasMarriagesDefaultValues.m.y.y, texasMarriagesDefaultValues.m.y.m, texasMarriagesDefaultValues.m.y.d)}
                                       component={TWDropDownComponent}
                                       onChange={CheckExactField.bind(this, setFieldValue)}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {texasMarriagesDefaultValues?.m?.l?.l && (
                           <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                              <div className="label-wrap mb-2">
                                 <p className="text-gray-500 text-xs"> Marriage Place</p>
                              </div>
                              <div className="row flex content-row pb-1 items-center">
                                 <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">
                                    {texasMarriagesDefaultValues.m?.l?.l}
                                 </div>
                                 <div className="ml-auto">
                                    {getFieldDropdowns(
                                       texasMarriagesDefaultValues.m?.li?.i,
                                       "m.li.s",
                                       "m.l.s",
                                       texasMarriagesDefaultValues.Marriage,
                                       setFieldValue,
                                       getMarriageOptions
                                    )}
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>
                  </div>
                  {/** Texas Marriage Form Button **/}
                  <div className="mb-2 md:pt-6 flex justify-between w-full">
                     <div className="buttons ml-auto flex">
                        <div className="mr-1.5">
                           <Button
                              type="default"
                              title="Edit Search"
                              handleClick={(e) => {
                                 e.preventDefault();
                                 handleShowModal(true);
                              }}
                           />
                        </div>
                        <Button
                           buttonType="submit"
                           title={buttonTitle}
                           disabled={!dirty || isSubmitting || !isValid}
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
