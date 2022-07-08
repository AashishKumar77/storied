import React from 'react'
import { Formik, Form, Field } from 'formik'
import TWDropDownComponent from '../../../../components/TWDropDown/TWDropDownComponent'
import Button from "../../../../components/Button";
import { getFirstAndLastName, getResidenceText, getDisabledOptions } from '../../../../utils'
import { tr } from "../../../../components/utils"
import { useTranslation } from "react-i18next"
const getFirstAndLastNameOptions = getFirstAndLastName()
const wwiCheckExactFieldLocation = (setFieldValue, locationfield, e) => {
    const location = Object.keys(locationfield.levelData.residenceLevel);
    if (location[0]) {
      const value = e.target.value;
      const checkValue = location[0];
      if (value !== checkValue) {
        setFieldValue("matchExact", false);
      }
    }
  };
  const checkExactField = (setFieldValue, e) => {
    const value = parseInt(e.target.value);
    if (value !== 0) {
      setFieldValue("matchExact", false);
    }
  };
const RefineSearch = ({
    width = "",
    defaultValues,
    handleShowModal,
    buttonTitle,
    handleSubmitWWW1
}) => {
    const { t } = useTranslation()
    const handleSubmit = (values, { setSubmitting }) => {
        handleSubmitWWW1(values, { setSubmitting })
    }
    const showNameDiv = defaultValues?.fm.t || defaultValues?.ln.t;
    const getResidence = () => {
        if (defaultValues.LocationField?.levelData) {
            return defaultValues.LocationField.levelData.residenceLevel
        }
        return {};
    }
    const getLocationField = (bool, locationfield, setFieldValue) => {
        if (bool) {
            return <Field name="li.s" 
                onChange={wwiCheckExactFieldLocation.bind(
                    this,
                    setFieldValue,
                    locationfield
                )} component={TWDropDownComponent} options={getResidence()} />
        } else {
            return <Field onChange={checkExactField.bind(this, setFieldValue)} name="l.s" component={TWDropDownComponent} options={getResidenceText()} />
        }
    }
    return <>
        <Formik
            enableReinitialize={true}
            initialValues={defaultValues}
            onSubmit={handleSubmit}>
            {({
                dirty,
                isSubmitting,
                isValid,
                setFieldValue
            }) => (
                <Form className="w-full">
                    <div className="flex flex-wrap mb-3 md:mb-2.5">
                        <div className={`w-full ${width} pt-1 mb-3`}>
                            {/** First name Last Name **/}
                            {showNameDiv && <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                <div className="label-wrap mb-2">
                                    <p className="text-gray-500 text-xs">{tr(t, "search.ww1.list.name")}</p>
                                </div>
                                {defaultValues?.fm.t && <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{defaultValues.fm.t}</div>
                                    <div className="ml-auto">
                                        <Field 
                                            name="fm.s" 
                                            component={TWDropDownComponent} 
                                            options={getFirstAndLastName()}
                                            onChange={checkExactField.bind(this, setFieldValue)} 
                                            defaultValue="0" 
                                            getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, defaultValues.fm.t)} />
                                    </div>
                                </div>}
                                {defaultValues?.ln.t && <div className={`row flex content-row items-center ${defaultValues.fm || "pb-1"}`}>
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{defaultValues.ln.t}</div>
                                    <div className="ml-auto">
                                        <Field 
                                            name="ln.s" 
                                            component={TWDropDownComponent} 
                                            options={getFirstAndLastName()} 
                                            defaultValue="0" 
                                            onChange={checkExactField.bind(this, setFieldValue)}
                                            getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, defaultValues.ln.t)} />
                                    </div>
                                </div>}
                            </div>}
                            {/** First name Last Name **/}
                            {/** Residence **/}
                            {defaultValues?.l?.l && <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                <div className="label-wrap mb-2">
                                    <p className="text-gray-500 text-xs">{tr(t, "search.ww1.list.residence")}</p>
                                </div>
                                <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{defaultValues.l.l}</div>
                                    <div className="ml-auto">
                                        {getLocationField(defaultValues.li?.i, defaultValues.LocationField, setFieldValue)}
                                    </div>
                                </div>
                            </div>}
                            {/** Residence **/}
                            {/** Cause of Death **/}
                            {defaultValues?.cd ? <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                <div className="label-wrap mb-2">
                                    <p className="text-gray-500 text-xs">{tr(t, "search.ww1.list.cod")}</p>
                                </div>
                                <div className="row flex pb-1 content-row items-center">
                                    <div className="text text-sm pr-3">{defaultValues.cd}</div>
                                </div>
                            </div> : null}
                            {/** Cause of Death **/}
                            {/** Rank **/}
                            {defaultValues?.gr ? <div className="refine-row border-b border-gray-200 pb-2 pt-2">
                                <div className="label-wrap mb-2">
                                    <p className="text-gray-500 text-xs">{tr(t, "search.ww1.list.rank")}</p>
                                </div>
                                <div className="row flex content-row pb-1 items-center">
                                    <div className="text text-sm">{defaultValues.gr}</div>
                                </div>
                            </div> : null}
                            {/** Rank **/}
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
                                    title={tr(t, "search.ww1.list.esearch")}
                                    type="default"
                                />
                            </div>
                            <Button
                                buttonType="submit"
                                disabled={!dirty || isSubmitting || !isValid}
                                title={isSubmitting ? tr(t, "search.ww1.form.dropdown.loading") : buttonTitle}
                            />
                            {/* <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleShowModal(true);
                                }}
                                className="disabled:opacity-50 text-gray-700 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:text-black"
                                type="button">
                                {tr(t, "search.ww1.list.esearch")}
                            </button>
                            <button
                                className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-sm px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ml-3"
                                type="Submit"
                                disabled={!dirty || isSubmitting || !isValid}>
                                {isSubmitting ? tr(t, "search.ww1.form.dropdown.loading") : buttonTitle}
                            </button> */}
                        </div>
                    </div>
                    {/** Form Button **/}
                </Form>
            )}
        </Formik>
    </>
}

export default RefineSearch;