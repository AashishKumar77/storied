import React, { useState, useEffect, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { v4 as uuidv4 } from "uuid";
import "./index.css";

// Used Components
import Input from "../Input";
import Checkbox from "../Checkbox";
import Translator from "../Translator";
import Location from "../SearchLocation/Location";
import { apiRequest, isCancel } from "../../redux/requests";

import { tr } from "../../components/utils";
import { useTranslation } from 'react-i18next';

let callApi = true;
const NodeForm = (props) => {
  const { id, parentId, cFilialId, type, path, title, firstName, lastName, isLiving, gender, birth, birthPlace, death, deathPlace, imgsrc, relatedParentIds } = props.formData;
  const [checked, setChecked] = useState(isLiving);
  
  const eventRef = useRef();
  const pageRef = useRef(1);
  const prevHeight = useRef(0);
  const refId = useRef();
  const [birthLocations, setBirthLocations] = useState([]);
  const [deathLocations, setDeathLocations] = useState([]);
  const [birthLocation, setBirthLocation] = useState();
  const [deathLocation, setDeathLocation] = useState();
  const [selectedBirthValue, setSelectedBirthValue] = useState({ id: null, name: birthPlace });
  const [selectedDeathValue, setSelectedDeathValue] = useState({ id: null, name: deathPlace });
  const { t } = useTranslation();
  const handleCheck = (event) => {
    setChecked(event.target.checked);
    props.handlePanActions(null, props.handleViewBox);
    props.handleIsLiving(event.target.checked);
  }

  // HandleLocations
  const handleLocations = async (apiType, searchString, source, requestId, page= 1) => {
    if(callApi){
      try {
        if (!searchString) searchString = '';
        const res = await apiRequest("GET", `placeauthority/typeahead/search/${requestId}/page/${page}/${searchString}`, null, null, source);
        if((res.data &&  page !== 1) || page === 1) {
          setStateForLocations(apiType, res.data)
        }
      } catch (err) {
        if(!isCancel(err) ) {
          setEmptyStateForLocations(apiType)
        }
      }
    }
  }

  const setStateForLocations = (apiType, data) => {
    if(apiType === "birth") setBirthLocations(data);
    else setDeathLocations(data);
    callApi=false;
  }

  const setEmptyStateForLocations = (apiType) => {
    if(apiType === "birth") setBirthLocations([]);
    else setDeathLocations([]);
  }

  //Debounce on birth location change
  useEffect(() => {
    if (birthLocation) {
      const delayDebounce = setTimeout(() => {
        handleLocations("birth", birthLocation, refId.current);
      }, 250)

      return () => {
        return clearTimeout(delayDebounce)
      }
    }
  }, [birthLocation, handleLocations])

  //Debounce on death location change
  useEffect(() => {
    if (deathLocation) {
      const delayDebounceFn = setTimeout(() => {
        handleLocations("death", deathLocation, refId.current);
      }, 250)

      return () => {
        return clearTimeout(delayDebounceFn)
      }
    }
  }, [deathLocation, handleLocations])

  useEffect(() => {
    if (pageRef.current > 1) {
      eventRef.current.target.scrollTop = prevHeight.current
    }
  }, [birthLocations, deathLocations])

  const loadMoreBirthPlaces = () => {
    handleLocations("birth", birthPlace, refId.current, pageRef.current);
  }

  const loadMoreDeathPlaces = () => {
    handleLocations("death", deathPlace, refId.current, pageRef.current);
  }

  const handleBirthPlace = (value, setFieldValue) => {
    if (value && value.name) {
      setSelectedBirthValue({ id: value.id, name: value.name })
      const event = {
        target: {
          name: "birthPlace",
          value: value.name
        }
      }
      props.handleChange(event, setFieldValue)
    } else {
      setSelectedBirthValue({ id: null, name: "" })
      const event = {
        target: {
          name: "birthPlace",
          value: ""
        }
      }
      props.handleChange(event, setFieldValue)
    }
  }

  const handleDeathPlace = (value, setFieldValue) => {
    if (value && value.name) {
      setSelectedDeathValue({ id: value.id, name: value.name })
      const event = {
        target: {
          name: "deathPlace",
          value: value.name
        }
      }
      props.handleChange(event, setFieldValue)
    } else {
      setSelectedDeathValue({ id: null, name: "" })
      const event = {
        target: {
          name: "deathPlace",
          value: ""
        }
      }
      props.handleChange(event, setFieldValue)
    }
  }

  const handleBirthInputChange = (e, val, reason, setFieldValue) => {
    if (reason !== 'reset') {
      setBirthLocation(val);
      handleBirthPlace({ id: null, name: val }, setFieldValue);
      pageRef.current = 1;
      refId.current = uuidv4();
      callApi=true;
    }
  }

  const handleDeathInputChange = (e, val, reason, setFieldValue) => {
    if (reason !== 'reset') {
      setDeathLocation(val);
      handleDeathPlace({ id: null, name: val }, setFieldValue);
      pageRef.current = 1;
      refId.current = uuidv4();
      callApi=true;
    }
  }

  return (
    <>
      <Formik
        innerRef={props.formRef}
        initialValues={{ id, parentId, cFilialId, type, path, title, firstName, lastName, isLiving, gender, birth, birthPlace, death, deathPlace, imgsrc, relatedParentIds }}
      >
        {() => {
          return (
            <Form>
              <div
                id="nodeForm"
                className={checked ? "form-main-small" : "form-main-large"}
                onKeyDown={props.handleKeyDown}
              >
                <div>
                  <Field name="firstName">
                    {({ form: { values, setFieldValue } }) => (
                      <div className="node-input">
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          placeholder={tr(t,"f&mName")}
                          value={values.firstName}
                          handleChange={(e) => props.handleChange(e, setFieldValue)}
                          nodeError={props.errorMessage ?.firstName}
                        />
                      </div>
                    )}
                  </Field>
                  <Field name="lastName">
                    {({ form: { values, setFieldValue } }) => (
                      <div className="node-input">
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          placeholder={tr(t,"LastName")}
                          value={values.lastName}
                          handleChange={(e) => props.handleChange(e, setFieldValue)}
                          nodeError={props.errorMessage ?.lastName}
                        />
                        {!checked && (
                          <div className="text-blue-400 text-xs pl-2 my-1 typo-font-medium">
                            <Translator tkey="pedigree.nodeform.birth" />
                          </div>
                        )}
                      </div>
                    )}
                  </Field>

                  <Field name="birth">
                    {({ form: { values, setFieldValue } }) => (
                      <div className="node-input">
                        <Input
                          id="birth"
                          name="birth"
                          type="text"
                          placeholder="pedigree.nodeform.bdoy"
                          value={values.birth}
                          handleChange={(e) => props.handleChange(e, setFieldValue)}
                          nodeError={props.errorMessage ?.birth}
                        />
                      </div>
                    )}
                  </Field>

                  <Field name="birthPlace">
                    {({ form: { values, setFieldValue } }) => (
                      <div className="node-input">
                        {/* <Input
                          id="birthPlace"
                          name="birthPlace"
                          type="text"
                          placeholder="pedigree.nodeform.bplace"
                          value={values.birthPlace}
                          handleChange={(e) => props.handleChange(e, setFieldValue)}
                          nodeError={props.errorMessage?.birthPlace}
                        /> */}
                        <Location
                          locationId="birthPlace"
                          placeholder="pedigree.nodeform.bplace"
                          value={selectedBirthValue}
                          searchString={values.birthPlace}
                          options={birthLocations}
                          handleChange={(e,val) => handleBirthPlace(val, setFieldValue)}
                          handleInputChange={(e,val, reason) => handleBirthInputChange(e, val ,reason, setFieldValue)}
                          loadMore={loadMoreBirthPlaces}
                          pageRef={pageRef}
                          prevHeight={prevHeight}
                          eventRef={eventRef}
                          setFieldValue={setFieldValue}
                        />
                        {!checked && (
                          <>
                            <div className=" text-blue-400 text-xs pl-2 my-1 typo-font-medium">
                              <Translator tkey="pedigree.nodeform.death" />
                            </div>
                            <div className="node-input">
                              <Input
                                id="death"
                                name="death"
                                placeholder="pedigree.nodeform.ddoy"
                                value={values.death}
                                handleChange={(e) => props.handleChange(e, setFieldValue)}
                                nodeError={props.errorMessage ?.death}
                              />
                            </div>
                            <div className="node-input">
                              {/* <Input
                                id="deathPlace"
                                name="deathPlace"
                                type="text"
                                placeholder="pedigree.nodeform.dplace"
                                value={values.deathPlace}
                                handleChange={(e) => props.handleChange(e, setFieldValue)}
                                nodeError={props.errorMessage ?.deathPlace}
                              /> */}
                              <Location
                                locationId="deathPlace"
                                placeholder="pedigree.nodeform.dplace"
                                value={selectedDeathValue}
                                searchString={values.deathPlace}
                                options={deathLocations}
                                handleChange={(e,val) => handleDeathPlace(val, setFieldValue)}
                                handleInputChange={(e,val, reason) => handleDeathInputChange(e,val,reason, setFieldValue)}
                                loadMore={loadMoreDeathPlaces}
                                pageRef={pageRef}
                                prevHeight={prevHeight}
                                eventRef={eventRef}
                                setFieldValue={setFieldValue}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </Field>

                  <Checkbox
                    id="isLiving"
                    obj={null}
                    checked={checked}
                    color="primary"
                    handleChange={handleCheck}
                    label="pedigree.nodeform.living"
                    labelColor="secondary"
                  />
                </div>

                {props.errorMessage && Object.keys(props.errorMessage).length > 0 && (
                  <div className="error-display">
                    <ErrorBlock errorMessage={props.errorMessage} />
                  </div>
                )}
              </div>
            </Form>
          )
        }}
      </Formik>
    </>
  )
}

export default NodeForm;

const ErrorBlock = ({ errorMessage }) => {
  if (Object.keys(errorMessage).length > 0) {
    for (var key of Object.keys(errorMessage)) return <span>{errorMessage[key]}</span>;
  } else {
    return null;
  }
}