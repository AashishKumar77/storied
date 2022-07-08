import React, { useEffect } from 'react';
import { Field } from "formik";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button"
import SearchPeople from "./../../../../components/SearchPeople"
import { getDateString } from "./../../../../components/utils"
import { getPersonProfileUrl } from "./../../../../components/utils/genderIcon"
import { treePeopleList } from './../../../../redux/actions/sidebar';
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
const getLabel = (option) => {
    const name = [];
    if (option.givenName) {
        name.push(option.givenName.givenName);
    }
    if (option.surname) {
        name.push(option.surname.surname);
    }
    return name.join(" ");
}
const Person = ({ form, field, setStep, treeProfileId }) => {
    const dispatch = useDispatch();
    const { storyId, treeId, primaryPersonId } = useParams();
    useEffect(() => {
        if (storyId && field.value[0]) {
            dispatch(treePeopleList({ treeId: field.value[0].treeId }));
        } else {
            dispatch(treePeopleList({ treeId: treeId || treeProfileId }));
        }
    }, [dispatch, treeId, storyId])
    const {
        treePeople
    } = useSelector(state => {
        return state.sidebar
    });
    useEffect(() => {
        if (
          !(field.value && field.value.length > 0) &&
          treePeople &&
          treePeople.length &&
          primaryPersonId
        ) {
          let defaultPerson = treePeople.filter(
            (item) => item.id === primaryPersonId
          );
          form.setFieldValue(field.name, [
            { ...defaultPerson[0], defaultPerson: true },
          ]);
        }
      }, [treePeople, primaryPersonId, field.value, form, field.name]); 
    const removePerson = (index) => {
        let valueTemp = [...field.value]
        valueTemp.splice(index, 1)
        form.setFieldValue(field.name, valueTemp)
    }
    const selectPeople = (val) => {
        if (val.id) {
            const isNotExist = field.value.findIndex((_person) => _person.id === val.id) === -1
            isNotExist && form.setFieldValue(field.name, [...field.value, val])
            form.setFieldValue("search", { "id": "", "name": "" })
        }
    }
    return <div className="story-box add-person-box">
        <div className="story-body">
            <div className="story-title mb-6">
                <h2><Typography text="secondary" size={32} weight="lyon-medium">Who is in this story?</Typography></h2>
            </div>
            <div className="sm:mb-12">
                <div className="who-is mb-4 relative">
                    <Field
                        name="search"
                        autoFocus={true}
                        component={SearchPeople}
                        placeholder={"Add People from your tree"}
                        freeSolo={true}
                        highlight={true}
                        height={32}
                        fontSize={14}
                        popoverMt={28}
                        options={treePeople}
                        selectPeople={selectPeople}
                        getOptionDisabled={field.value}
                    />
                </div>
                <div className="persons-wrap">
                    {field.value && field.value.map((_person, index) => <div key={index} className="persons-in-story relative mb-4 ">
                        {_person.defaultPerson !== true && <button onClick={() => removePerson(index)} type="button" className="bg-gray-100 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset absolute top-2/4 transform -translate-y-2/4 right-0">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2 14L14 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 14L2 2" stroke="#747578" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>}
                        <div className="flex items-center pr-12">
                            <div className="media w-10 h-10 overflow-hidden mr-2 avtar-square-large">
                                <img src={getPersonProfileUrl(_person)} alt="Story Pic" className="object-cover w-10 h-10" />
                            </div>
                            <div className="media-text flex-1 avtar-square-large-name my-auto">
                                <h3 className="text-sm typo-font-medium main-title">{getLabel(_person)}</h3>
                                <p className="text-xs sub-title">{getDateString(_person)}</p>
                            </div>
                        </div>
                    </div>
                    )}
                </div>
            </div>
            <div className="story-footer justify-end flex fixed -top-4 smm:-top-3 right-4 lg:top-0 lg:right-0 lg:relative z-1000 lg:z-50">
                <div className="flex">
                    <div className="mr-2 hidden lg:flex">
                        <Button handleClick={() => setStep(0)} size="large" title="Back" type="default" />
                    </div>
                    <Button disabled={field.value?.length <= 0} handleClick={() => setStep(2)} size="large" title="Next" />
                </div>
            </div>
        </div>
    </div>
}

export default Person