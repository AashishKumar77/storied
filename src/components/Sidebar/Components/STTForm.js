import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik'
import { tr } from "./../../../components/utils";
import { useTranslation } from "react-i18next";
import SearchPeople from "./../../SearchPeople";
import { v4 as uuidv4 } from "uuid";
import { useSelector, useDispatch } from 'react-redux'
import {
    treePeopleList
} from './../../../redux/actions/sidebar';
const STTForm = ({
    handleSubmitForm,
    getOptionDisabled
}) => {
    const {
        treePeople
    } = useSelector(state => {
        return state.sidebar
    });
    const defaultValues = {
        peopleList: ""
    };
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(treePeopleList({ treeId: "" }));
    }, [dispatch]);
    const handleSubmit = (values, { setSubmitting }) => {
        handleSubmitForm(values);
        setSubmitting(false);
    }  
    return <>
        <Formik
            enableReinitialize={true}
            initialValues={defaultValues}
            onSubmit={handleSubmit}
            validate={(values) => {
                let error = {};
                if (!values.peopleList?.id) {
                    error.peopleList = "Required";
                }
                return error;
            }}>
            {({
                dirty,
                isSubmitting,
                isValid,
            }) => (
                <Form className="w-full">
                    {/** Typeahead Person Search */}
                    <div className="flex flex-wrap -mx-2 mb-3 md:mb-2.5 relative">
                        <div className={`w-full px-2 mb-0 md:mb-0`}>
                            <div className="relative">
                                <Field name={`peopleList`}  options={treePeople} component={SearchPeople} getOptionDisabled={getOptionDisabled} freeSolo={true} id={`locations-filter-${uuidv4()}`} />
                            </div>
                        </div>
                    </div>
                    {/** Typeahead Person Search */}
                    {/** Form Button **/}
                    <div className="mb-2 md:pt-6 flex justify-between w-full">
                        <div className="buttons ml-auto">
                            <button
                                className="disabled:opacity-50 text-gray-700 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black"
                                type="reset"
                                disabled={!dirty || isSubmitting}>
                                {tr(t, "search.ww1.form.clear")}
                            </button>
                            <button
                                className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 ml-4"
                                type="Submit"
                                disabled={!dirty || isSubmitting || !isValid}>
                                {isSubmitting ? `${tr(t, "search.ww1.form.dropdown.loading")}...` : "Save"}
                            </button>
                        </div>
                    </div>
                    {/** Form Button **/}
                </Form>
            )}
        </Formik>
    </>
}
export default STTForm;