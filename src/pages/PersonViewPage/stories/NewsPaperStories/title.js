import React from 'react';
import ClassNames from 'classnames';
import { Field } from 'formik';
import { v4 as uuidv4 } from "uuid";
import Tooltip from '../../../../components/Tooltip';
import "./../addStories/index.css";
import Button from '../../../../components/Button';
import PrivacyToggle from '../../../../components/PrivacyToggle';
import Textarea from './../textArea';
import SearchLocation from '../../../../components/FWSearchLocation';

const tooltipConfig = {
    background: "#555658",
};
const storyWordCount = (formik) => {
    let count = formik.values.content?.length,
        newLine = formik.values.content?.split("\n")?.length - 1;
    if (!formik.dirty) {
        count = formik.values.content?.length - newLine;
    }
    return count;
}
const GetCharacterCount = ({ formik }) => {
    const contentLength = storyWordCount(formik);
    return <span className={ClassNames('count p-1', { 'bg-orange-300 text-gray-600': (contentLength > 450 && contentLength < 500), 'bg-maroon-500 text-white': contentLength > 500 })}  >{contentLength}/500</span>
}

const Title = ({ setStep, formik, TitleVailed, urlImage, localImage }) => {
    return <>
        <div className="story-box relative">
            <div className="md:flex">
                <div className="main-stroy-img fit">
                    <div className="clipping-actions md:h-full w-full flex items-center justify-center overflow-y-hidden">
                        <img src={urlImage} className="h-full w-full object-cover filter blur-md" />
                        <img src={localImage} className="absolute max-h-full max-w-full" />
                    </div>
                </div>
                <div className="story-body">
                    <div className="relative w-full h-full md:flex items-center right-0 px-3 md:px-0">
                        <div className="story-option flex justify-end">
                            <div className="relative md:absolute top-0 right-0 z-50">
                                <Field name={"privacy"} as={PrivacyToggle} formik={formik} />
                            </div>
                        </div>
                        <div className="story-content mt-5 relative">
                            <div className="story-title mb-1">
                                <Field name={"title"} placeholder="Add a Title" autoFocus className="lyon-font-medium text-gray-700 bg-transparent w-full focus:outline-none" />
                            </div>
                            <div>
                                <div className="mb-1 relative location-field flex items-center">
                                    <span className="mr-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                                            <path d="M15 3.8V12.6667C15 13.038 14.8525 13.3941 14.5899 13.6566C14.3274 13.9192 13.9713 14.0667 13.6 14.0667C13.2287 14.0667 12.8726 13.9192 12.6101 13.6566C12.3475 13.3941 12.2 13.038 12.2 12.6667V1.93333C12.2 1.6858 12.1017 1.4484 11.9266 1.27337C11.7516 1.09833 11.5142 1 11.2667 1H1.93333C1.6858 1 1.4484 1.09833 1.27337 1.27337C1.09833 1.4484 1 1.6858 1 1.93333V12.6667C1 13.038 1.1475 13.3941 1.41005 13.6566C1.6726 13.9192 2.0287 14.0667 2.4 14.0667H13.6" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M3.33337 9.40002H9.86671" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M3.33337 11.2667H7.06671" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M3.33337 3.33331H9.86671V7.06665H3.33337V3.33331Z" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </span>
                                    <Field name={"publisher_title"} readOnly className="text-xs w-full bg-transparent text-gray-600 focus:outline-none capitalize" />
                                </div>
                                <div className="mb-1 relative location-field">
                                    <Field
                                        name={"place"}
                                        component={SearchLocation}
                                        freeSolo={true}
                                        popoverMt={25}
                                        id={`locations-filter-${uuidv4()}`}
                                        placeholder="Location"
                                        highlight={true}
                                        renderInput={params => (
                                            <div ref={params.InputProps.ref} className="relative location-field">
                                                <input {...params.inputProps} placeholder="Location" maxLength="50" className="text-xs w-full bg-transparent text-gray-500 focus:outline-none" />
                                            </div>
                                        )} />
                                </div>
                                <div className="date mb-5">
                                    <Field name={"date"} placeholder="Year or exact date" maxLength="50" className="text-xs text-gray-500 bg-transparent w-full focus:outline-none" />

                                </div>
                                <div className="story-description">
                                    <Field name={"content"} as={Textarea} formik={formik} className="text-xs text-gray-600 bg-transparent w-full focus:outline-none" placeholder="Anything you want to add to this story?" />
                                </div>
                            </div>
                        </div>
                        <div className="story-footer flex justify-between items-center flex-row-reverse smm:flex-row md:absolute bottom-0 right-0">
                            <div className="flex items-center smm:ml-auto">
                                <div className="character-count">
                                    <span className="flex items-center text-gray-500 text-xs lg:mr-3">
                                        <Tooltip placement="top" key={""} {...tooltipConfig} title={<p className="font-normal font-sans
                                            text-xs mb-0">
                                            We limit stories to 500 characters because
                                            we believe that by keeping these stories short
                                            and focused, they are more likely to be read
                                            and shared among family members.
                                        </p>} >
                                            <span className="mr-1">
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M6 6C6.00007 5.63335 6.10093 5.27378 6.29155 4.96058C6.48217 4.64738 6.75522 4.3926 7.08085 4.2241C7.40649 4.0556 7.77218 3.97986 8.13795 4.00515C8.50372 4.03044 8.85551 4.15579 9.15486 4.3675C9.4542 4.57921 9.68959 4.86914 9.8353 5.20559C9.981 5.54205 10.0314 5.91208 9.98102 6.27525C9.93063 6.63842 9.78138 6.98075 9.54958 7.26482C9.31778 7.5489 9.01235 7.76378 8.66667 7.886C8.47161 7.95496 8.30275 8.08272 8.18335 8.25167C8.06395 8.42062 7.99989 8.62245 8 8.82933V9.5" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M8 11.5C7.95055 11.5 7.90222 11.5147 7.86111 11.5421C7.82 11.5696 7.78795 11.6086 7.76903 11.6543C7.75011 11.7 7.74516 11.7503 7.7548 11.7988C7.76445 11.8473 7.78826 11.8918 7.82322 11.9268C7.85819 11.9617 7.90273 11.9855 7.95123 11.9952C7.99972 12.0048 8.04999 11.9999 8.09567 11.981C8.14135 11.962 8.1804 11.93 8.20787 11.8889C8.23534 11.8478 8.25 11.7994 8.25 11.75C8.25 11.6837 8.22366 11.6201 8.17678 11.5732C8.12989 11.5263 8.0663 11.5 8 11.5Z" fill="#747578" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M0.5 8C0.5 9.98912 1.29018 11.8968 2.6967 13.3033C4.10322 14.7098 6.01088 15.5 8 15.5C9.98912 15.5 11.8968 14.7098 13.3033 13.3033C14.7098 11.8968 15.5 9.98912 15.5 8C15.5 6.01088 14.7098 4.10322 13.3033 2.6967C11.8968 1.29018 9.98912 0.5 8 0.5C6.01088 0.5 4.10322 1.29018 2.6967 2.6967C1.29018 4.10322 0.5 6.01088 0.5 8V8Z" stroke="#747578" />
                                                </svg>
                                            </span>
                                        </Tooltip>
                                        <GetCharacterCount
                                            formik={formik}
                                        />
                                    </span>
                                </div>
                                <div className="button hidden lg:block">
                                    <Button disabled={!TitleVailed(formik)} handleClick={() => setStep(1)} size="large" title="Next" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}
export default Title;
