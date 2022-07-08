import React from 'react';
import { Field } from "formik";
import { useSelector, useDispatch } from "react-redux";
import {
    getStates,
    getCities,
    getPublication
} from "./../../../../redux/actions/location"
const getEmptyAndLoadingO = (loading, text) => {
    return <option value="">{loading === 1? "Loading...":text}</option>
}
const NarrowLocation = ({ field, form }) => {
    const {
        countyLoading,
        stateLoading,
        cityLoadig,
        publicationLoading,
        counties,
        states,
        city,
        publication
    } = useSelector(state => state.location);
    const dispatch = useDispatch();
    const InnerMDivHtml = <div className="absolute right-0 mr-1 h-10 w-10 flex items-center justify-center rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562" stroke="#555658" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    </div>
    return <>
    <h3 className="typo-font-medium text-blue-500 mb-3">Narrow by Location</h3>
    <div className="flex items-start flex-wrap md:flex-nowrap md:mb-4 relative -mx-2">
        <div className="md:w-1/2 w-full mx-2 mb-4 md:mb-0 relative">
            <label
                className="block text-gray-600 text-sm mb-2"
                htmlFor="grid-first-name"
            >
                Country
            </label>
            <div className="flex items-center">
                <Field
                    as = "select"
                    id="country"
                    name="cu"
                    onChange = {(e)=> {
                        form.handleChange(e);
                        dispatch(getStates(e.target.value, 1))
                        form.setFieldValue("st", "")
                        form.setFieldValue("ci", "")
                        form.setFieldValue("pu", "")
                    }}
                    autoComplete="country-name"
                    className="appearance-none w-full pr-10 py-2 px-3 border border-gray-300 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >   
                    {getEmptyAndLoadingO(countyLoading, "Search All")}
                    {
                        !countyLoading && counties.map((country)=> {
                            return <option key={country.id} value={country.id}>{country.name}</option>
                        })
                    }
                </Field>
                    {InnerMDivHtml}
            </div>
        </div>
        <div className="md:w-1/2 w-full mx-2 mb-4 md:mb-0 relative">
            <label
                className="block text-gray-600 text-sm mb-2"
                htmlFor="grid-first-name"
                disabled = {!form.values.cu}
            >
                State
            </label>
            <div className="flex items-center">
                <Field
                    as = "select"
                    id = "state"
                    name = "st"
                    disabled = {!form.values.cu}
                    onChange = {(e)=> {
                        form.handleChange(e);
                        dispatch(getCities(e.target.value, 1))
                        if(e.target.value === "") {
                            form.setFieldValue("ci", "")
                            form.setFieldValue("pu", "")
                        }
                    }}
                    className="appearance-none w-full pr-10 py-2 px-3 border border-gray-300  disabled:bg-gray-200 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                    {getEmptyAndLoadingO(stateLoading, "Search All")}
                    {
                        !stateLoading && states.map((_state)=> {
                            return <option key={_state.id} value={_state.id}>{_state.name}</option>
                        })
                    }
                </Field>
                    {InnerMDivHtml}
            </div>
        </div>
        
    </div>
    <div className="flex items-start flex-wrap md:flex-nowrap relative -mx-2 md:mb-4">
        <div className="md:w-1/2 w-full mx-2 mb-4 md:mb-0 relative">
            <label
                className="block text-gray-600 text-sm mb-2"
                htmlFor="grid-first-name"
                disabled = {!form.values.st}
            >
                City
            </label>
            <div className="flex items-center">
                <Field
                    as = "select"
                    id = "city"
                    disabled = {!form.values.st}
                    name = "ci"
                    onChange = {(e)=> {
                        form.handleChange(e);
                        dispatch(getPublication(e.target.value, form.values.st, 1))
                        if(e.target.value === "") {
                            form.setFieldValue("pu", "")
                        }
                    }}
                    className="appearance-none w-full pr-10 py-2 px-3 border border-gray-300 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                >
                    {getEmptyAndLoadingO(cityLoadig, "Search All")}
                    {
                        !cityLoadig && city.map((_city)=> {
                            return <option key={_city.id} value={_city.id}>{_city.name}</option>
                        })
                    }
                </Field>
                    {InnerMDivHtml}
            </div>
        </div>
        <div className="md:w-1/2 w-full mx-2 mb-4 md:mb-0 relative">
            <label
                className="block text-gray-600 text-sm mb-2"
                htmlFor="grid-first-name"
                disabled = {!form.values.ci}
            >
                Publication
            </label>
            <div className="flex items-center">
                <Field
                    as = "select"
                    id = "publication"
                    disabled = {!form.values.ci}
                    name = "pu"
                        className="appearance-none w-full pr-10 py-2 px-3 border border-gray-300 z-10 bg-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent">
                    {getEmptyAndLoadingO(publicationLoading, "Search All")}
                    {
                        !publicationLoading && publication.map((_publication)=> {
                            return <option key={_publication.id} value={_publication.id}>{_publication.name}</option>
                        })
                    }
                </Field>
                    {InnerMDivHtml}
            </div>
        </div>

    </div>
    </>
}
export default NarrowLocation;