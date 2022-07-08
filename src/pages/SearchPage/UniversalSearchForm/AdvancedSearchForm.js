import React, { useEffect } from 'react';
import { FieldArray, Field } from 'formik';
import { useTranslation } from "react-i18next"
import { tr } from "../../../components/utils"
import { useSelector, useDispatch } from 'react-redux';
import { collectionDropdown } from './../../../redux/actions/universalSearch'


const getIndex = (index, place) => index + 1 ? index + 1 : place + 1

const pushRelation = (relType, { unshift, insert }, existRelation, data) => {
    let obj = { f: "", l: "" };
    if (relType === 1 && !existRelation('Father').length) {
        obj.r = 'Father';
        unshift(obj)

    }
    if (relType === 2 && !existRelation('Mother').length) {
        obj.r = 'Mother';
        insert(existRelation('Father').length ? 1 : 0, obj)
    }
    if (relType === 3 && existRelation('Sibling').length < 5) {
        let dataArr = data?.map(y => y.r);
        let siblingIndex = dataArr.lastIndexOf('Sibling');
        let motherIndex = dataArr.lastIndexOf('Mother');
        obj.r = 'Sibling';
        insert(getIndex(siblingIndex, motherIndex), obj)
    }
    if (relType === 4 && existRelation('Spouse').length < 5) {
        let dataArr = data?.map(y => y.r);
        let siblingIndex = dataArr.lastIndexOf('Sibling');
        let spouseIndex = dataArr.lastIndexOf('Spouse');
        obj.r = 'Spouse';
        insert(getIndex(spouseIndex, siblingIndex), obj)
    }
    if (relType === 5 && existRelation('Child').length < 5) {
        let dataArr = data?.map(y => y.r);
        let childIndex = dataArr?.lastIndexOf('Child');
        let spouseIndex = dataArr?.lastIndexOf('Spouse');
        obj.r = 'Child';
        insert(getIndex(childIndex, spouseIndex), obj)
    }
}

const getlabelName = (val) => <label className="block text-gray-600 text-sm mb-1" htmlFor="grid-first-name">{val}</label>
const AdvancedSearchForm = ({ formik }) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(collectionDropdown())
    }, [dispatch])
    const { collections: collArr, collectionLoading } = useSelector(state => state.search)

    const { t } = useTranslation();
    return <>
        <div className="advance-search-wrap pt-4 mb-5">
            <FieldArray name="rs">
                {fieldArrayProps => {
                    const { remove, insert, unshift, form: { values } } = fieldArrayProps;
                    const existRelation = type => (values.rs || []).filter(y => y.r === type)
                    return <>
                        <div className="advance-search-container mb-5">
                            {values?.rs?.length ? <div className="flex flex-wrap -mx-2 mb-0 items-center relative pl-16 pr-12 md:px-0 relative">
                                <div className="md:w-1/4 px-2  text-right hidden md:block">
                                </div>
                                <div className="w-3/6 md:w-64 px-2 mb-1">
                                    {tr(t,"f&mName")}

                                </div>
                                <div className="w-3/6 md:w-48 px-2 mb-1">
                                    {tr(t,"LastName")} 
                                </div>

                            </div> : null}

                            {(values.rs || []).map((item, index) => {
                                return <div key={`${index}`} className="flex flex-wrap -mx-2 md:mb-4 items-center pl-16 pr-12 md:px-0 relative">
                                    <div className="absolute left-0 top-2 md:relative md:top-0 md:w-1/4 px-2 md:text-right">
                                        <label className="text-gray-600 text-sm">
                                            {item.r}
                                        </label>
                                    </div>
                                    <div className="w-3/6 md:w-64 px-2 mb-3 md:mb-0">
                                        <Field name={`rs[${index}].f`} className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" id="grid-city" type="text" />
                                    </div>
                                    <div className="w-3/6 md:w-48 px-2 mb-3 md:mb-0">
                                        <Field name={`rs[${index}].l`} className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" id="grid-zip" type="text" />
                                    </div>

                                    <button type="button" className="p-3 absolute right-1.5 top-0 bg-gray-100 hover:bg-gray-200 rounded-lg outline-none focus:outline-none" onClick={() => remove(index)} >
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 13L13 1" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M13 13L1 1" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>
                            })}
                            <div className="flex flex-wrap -mx-2 mb-3.5 pt-1 items-center relative pl-16 md:pl-0">
                                <div className="md:w-1/4 px-2 mb-3 md:mb-0 text-right absolute top-1 md:top-0 left-0 md:relative">
                                    <label className="text-gray-600 text-sm">
                                        {tr(t, "search.unisearchform.advsearch.add")}
                                    </label>
                                </div>
                                <div className="md:w-64 px-2 mb-3 md:mb-0 md:w-64 px-2 mb-3 md:mb-0 flex-grow">
                                    <div className="add-buttons text-base -mx-3 flex flex-wrap">
                                        <span className={`${!existRelation('Father').length ? 'text-blue-400 px-3 cursor-pointer hover:underline' : 'text-gray-400 px-3'}`} onClick={() => pushRelation(1, { unshift, insert }, existRelation, values.rs)}>{tr(t, "search.unisearchform.advsearch.father")}</span>
                                        <span className={`${!existRelation('Mother').length ? 'text-blue-400 px-3 cursor-pointer hover:underline' : 'text-gray-400 px-3'}`} onClick={() => pushRelation(2, { unshift, insert }, existRelation, values.rs)}>{tr(t, "search.unisearchform.advsearch.mother")}</span>
                                        <span className={`${existRelation('Sibling').length < 5 ? 'text-blue-400 px-3 cursor-pointer hover:underline' : 'text-gray-400 px-3'}`} onClick={() => pushRelation(3, { unshift, insert }, existRelation, values.rs)}>{tr(t, "search.unisearchform.advsearch.sibling")}</span>
                                        <span className={`${existRelation('Spouse').length < 5 ? 'text-blue-400 px-3 cursor-pointer hover:underline' : 'text-gray-400 px-3'}`} onClick={() => pushRelation(4, { unshift, insert }, existRelation, values.rs)}>{tr(t, "search.unisearchform.advsearch.spouse")}</span>
                                        <span className={`${existRelation('Child').length < 5 ? 'text-blue-400 px-3 cursor-pointer hover:underline' : 'text-gray-400 px-3'}`} onClick={() => pushRelation(5, { unshift, insert }, existRelation, values.rs)}>{tr(t, "search.unisearchform.advsearch.child")}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }}

            </FieldArray>
            <div className="keyword-section pt-2">
                <div className="field-area mb-2.5">
                    <label className="text-gray-600 mb-1 block text-sm">
                        {tr(t, "search.unisearchform.advsearch.keyword")}
                    </label>
                    <Field name="kw" className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" placeholder={tr(t, "search.unisearchform.advsearch.placeholder.osae")} type="text" />

                </div>
                <div className="field-area mb-2.5">
                    <label className="text-gray-600 mb-1 block text-sm">
                        {tr(t, "search.unisearchform.advsearch.gender")}
                    </label>
                    <div className="w-40">
                        <div className="relative">
                            <Field id="grid-state" as='select' name="g" className={`block appearance-none h-10 w-full  border border-gray-300 text-gray-${formik.values.g ? "700" : "400"} tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}  >
                                <option selected hidden value="">{tr(t, "search.unisearchform.advsearch.option.select")}</option>
                                <option value="" key={-1}> None </option>
                                <option value="Male">{tr(t, "search.unisearchform.advsearch.option.m")}</option>
                                <option value="Female">{tr(t, "search.unisearchform.advsearch.option.f")}</option>
                                <option value="Other">{tr(t, "search.unisearchform.advsearch.option.o")}</option>
                            </Field>
                            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center px-2 text-gray-700">
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="field-area mb-2.5">
                    <label className="text-gray-600 mb-1 block text-sm">
                        {tr(t, "search.unisearchform.advsearch.collection")}
                    </label>
                    <div className="w-64">
                        <div className="relative">

                            <Field id="grid-state" as='select' name="cn" className="block appearance-none h-10 w-full  border border-gray-300 text-gray-700 bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"  >
                                <option value=""> {collectionLoading ? 'Loading...' : tr(t, "search.unisearchform.advsearch.acollection")}</option>
                                {collArr && collArr.map((item, index) => <option key={index} value={item.collectionGUID}> {item.collectionTitle}</option>)}
                            </Field>
                            <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center px-2 text-gray-700">
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </>
}

export default AdvancedSearchForm