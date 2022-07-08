import React, { useEffect } from 'react';
import TWDropDownComponent from './../../components/TWDropDown/TWDropDownComponent';
import Typography from "./../../components/Typography";
import Button from "./../../components/Button";
import { getDayOptions, getFirstAndLastName, getResidenceText, encodeDataToURL, getDisabledOptions, getFormattedDate } from '../../utils';
import { Field, Formik, FieldArray, Form } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import { submitUniversalSearchForm, collectionDropdown } from './../../redux/actions/universalSearch'
import { useHistory } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";

const getRelationshipStr = (arr) => {
    let str = '';
    for (let i = 0; i < arr.length; i++) {
        str += `${arr[i].f || ''}${arr[i].l ? ' ' : ''}${arr[i].l || ''}${i === arr.length - 1 ? '' : ', '}`
    }
    return str
}
const getRelationship = (Relationships) => {
    let html = [];
    if (Relationships?.length) {
        let parents = Relationships.filter(y => y.r === 'Father' || y.r === 'Mother');
        let spouse = Relationships.filter(y => y.r === 'Spouse');
        let children = Relationships.filter(y => y.r === 'Child');
        let sibling = Relationships.filter(y => y.r === 'Sibling');
        if (parents.length) {
            html.push(
                <div className="refine-row border-b border-gray-200 pb-2 pt-2" key={uuidv4()}>
                    <div className="label-wrap mb-2">
                        <p className="text-gray-500 text-xs">{`Parents`}</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(parents)}</div>
                    </div>
                </div>
            )
        }
        if (spouse.length) {
            html.push(
                <div className="refine-row border-b border-gray-200 pb-2 pt-2" key={uuidv4()} >
                    <div className="label-wrap mb-2">
                        <p className="text-gray-500 text-xs">{'Spouse'}</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(spouse)}</div>
                    </div>
                </div>
            )
        }
        if (children.length) {
            html.push(
                <div className="refine-row border-b border-gray-200 pb-2 pt-2" key={uuidv4()}>
                    <div className="label-wrap mb-2">
                        <p className="text-gray-500 text-xs">{children.length === 1 ? 'Child' : 'Children'}</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(children)}</div>
                    </div>
                </div>
            )
        }
        if (sibling.length) {
            html.push(
                <div className="refine-row border-b border-gray-200 pb-2 pt-2" key={uuidv4()}>
                    <div className="label-wrap mb-2">
                        <p className="text-gray-500 text-xs">Sibling</p>
                    </div>
                    <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{getRelationshipStr(sibling)}</div>
                    </div>
                </div>
            )
        }

    }

    return html
}

const getLocation = (item, index, formik, option) => {
    let html = null;
    if (item.li?.i) {
        html = <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3">{item.li?.name}</div>
            <div className="ml-auto">
                <Field name={`ls[${index}].li.s`} component={TWDropDownComponent} options={option?.length ? option[index] : { "4": "Broad" }} />
            </div>
        </div>
    } else if (item.l?.l) {
        html = <div className="row flex content-row pb-1 items-center">
            <div className="text text-sm pr-3">{item.l?.l}</div>
            <div className="ml-auto">
                <Field name={`ls[${index}].l.s`} component={TWDropDownComponent} options={getResidenceText()} />
            </div>
        </div>
    }
    return html;
}
const getFieldValue = (searchValue, key, collArr = []) => {
    let html = null;
    let actualKey = { g: "Gender", kw: "Keyword", cn: "Collection Name" },
        getVal = () => {
            let val = searchValue[key];
            if (key === 'cn' && collArr) {
                let data = collArr.filter(y => y.collectionGUID === searchValue[key])
                if (data.length) {
                    val = data[0]?.collectionTitle
                }
            }
            return val;
        }
    if (searchValue && searchValue[key]) {
        html = <div className="refine-row pb-2 pt-2">
            <div className="label-wrap mb-2">
                <p className="text-gray-500 text-xs">{actualKey[key]}</p>
            </div>
            <div className="row flex content-row pb-1 items-center">
                <div className="text text-sm">{getVal()}</div>

            </div>
        </div>
    }
    return html
}
const getNameSegment = (searchValue) => {
    const getFirstAndLastNameOptions = getFirstAndLastName()
    let html = null;
    if (searchValue && (searchValue.fm?.t || searchValue.ln?.t)) {
        html = <div className="refine-row border-b border-gray-200 pb-2 pt-2">
            <div className="label-wrap mb-2">
                <p className="text-gray-500 text-xs">Name</p>
            </div>
            {
                searchValue.fm?.t ?
                    <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{searchValue.fm?.t}</div>
                        <div className="ml-auto">
                            <Field name={`firstName`} component={TWDropDownComponent} options={getFirstAndLastNameOptions} defaultValue="0" getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, searchValue.fm?.t)} />
                        </div>
                    </div> : null
            }
            {
                searchValue.ln?.t ?
                    <div className="row flex content-row pb-1 items-center">
                        <div className="text text-sm pr-3 break-words overflow-ellipsis overflow-hidden">{searchValue.ln?.t}</div>
                        <div className="ml-auto">
                            <Field name={`lastName`} component={TWDropDownComponent} options={getFirstAndLastNameOptions} defaultValue="0" getdisabledoptions={getDisabledOptions(getFirstAndLastNameOptions, searchValue.ln?.t)} />
                        </div>
                    </div> : null
            }
        </div>
    }
    return html;

}
const getObjValue = (obj, value) => {
    let res = obj
    if (obj.fm) {
        res.fm.s = value.firstName;
    }
    if (obj.ln) {
        res.ln.s = value.lastName;
    }
    if (obj.ls) {
        obj.ls = value.ls
    }
    if (obj.matchExact) {
        delete obj.matchExact
    }
    return res
}
const getYearFieldDropdown = (item, index,) => item?.y?.y ?
    <div className="row flex content-row pb-1 items-center">
        <div className="text text-sm pr-3">{getFormattedDate(item?.y?.y, item?.y?.m, item?.y?.d)}</div>
        <div className="ml-auto">
            <Field name={`ls[${index}].y.s`} component={TWDropDownComponent} options={getDayOptions()} />
        </div>
    </div> : null
const UniversalRefineSearch = ({ searchValue, setShowModal, setCurrent, option }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const initialValues = {
        firstName: searchValue?.fm?.s,
        lastName: searchValue?.ln?.s,
        ls: searchValue?.ls
    }
    useEffect(() => {
        if (searchValue.cn) {
            dispatch(collectionDropdown())
        }
    }, [searchValue])
    const { collections: collArr } = useSelector(state => state.search)
    const handleSubmit = (values, props) => {
        setCurrent(1)
        const universal_form_switch_status = localStorage.getItem('universal_form_switch_status')
        let formValue = searchValue;
        formValue = getObjValue(formValue, values)
        formValue.pn = 1;
        history.push(`?${encodeDataToURL(formValue)}`)
        dispatch(submitUniversalSearchForm({ query: encodeDataToURL(formValue) }, universal_form_switch_status ? universal_form_switch_status === 'true' : false))
        props.resetForm({ values: formValue })


    }
    return <>
        <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {formik => {
                return <>
                    <div className="uni-refine-search-sidebar mb-8">
                        <div className="bg-white border-t border-b border-gray-200 sn:boder-0 sm:rounded-lg sm:shadow p-3 md:py-5 md:px-6">

                            <div className="head"><h2 className="mb-3">
                                <Typography
                                    text="secondary"
                                    weight="medium"
                                >
                                    Revise Search</Typography>
                            </h2></div>
                            <Form className="w-full">
                                <div className="flex flex-wrap mb-3 md:mb-2.5">
                                    <div className="w-full  pt-1 mb-3">
                                        {getNameSegment(searchValue)}
                                        <FieldArray name={`ls`}>
                                            {fieldArrayProps => {
                                                const { form: { values } } = fieldArrayProps;
                                                return (values?.ls || []).map((item, index) => {

                                                    return (item?.l?.l || item?.li?.i || item?.y?.y) ? <div key={index} className="refine-row border-b border-gray-200 pb-2 pt-2">
                                                        <div className="label-wrap mb-2">
                                                            <p className="text-gray-500 text-xs">{item.le}</p>
                                                        </div>
                                                        {getLocation(item, index, formik, option)}
                                                        {getYearFieldDropdown(item, index)}
                                                    </div> : null
                                                })

                                            }}
                                        </FieldArray>
                                        {getRelationship(searchValue && searchValue.rs).map(y => y)}
                                        {getFieldValue(searchValue, 'g')}
                                        {getFieldValue(searchValue, 'kw')}
                                        {getFieldValue(searchValue, 'cn', collArr)}
                                    </div>
                                </div>
                                <div className="mb-2 -mt-1 flex justify-between w-full">
                                    <div className="buttons ml-auto flex">
                                        <Button
                                            handleClick={() => setShowModal(true)}
                                            title="Edit Search"
                                            type="default"
                                        />
                                        <div className="ml-1.5">
                                            <Button
                                                buttonType="submit"
                                                disabled={!formik.dirty}
                                                title="Update" />
                                        </div>
                                    </div>

                                </div>
                            </Form>
                        </div>
                    </div>
                </>
            }}

        </Formik>
    </>
}

export default UniversalRefineSearch;