import React, { useEffect } from "react";
import { FieldArray, Field } from "formik";
import { useSelector } from "react-redux";
import SearchLocation from "./../../../components/SearchLocation";
import { tr } from "../../../components/utils";
import { useTranslation } from "react-i18next";
import {
  getResidenceText,
  setDropdownObject,
  getRelatedValue,
  getYear,
  DateDropdownValues
} from "./../../../utils";
import { placeAuthority } from "./../../../redux/actions/universalSearch";
import { v4 as uuidv4 } from "uuid";
import TWDropDownComponent from "./../../../components/TWDropDown/TWDropDownComponent";
import "./../index.css";
import DateField from "../../../components/DateComponent/dateField";
const checkExactField = (formik, e) => {
  const value = parseInt(e.target.value);
  if (value !== 0) {
    formik.setFieldValue("matchExact", false);
  }
}
const checkExactFieldLocation = (index, formik, option, e) => {
  if (option[index]) {
    const loc = Object.keys(option[index])
    if (loc[0]) {
      const value = e.target.value
      const checkValue = loc[0]
      if (value !== checkValue) {
        formik.setFieldValue("matchExact", false);
      }
    }
  }
}
const getEventClass = (value) => {
  let str = "text-gray-700";
  if (!value) {
    str = "text-gray-400";
  }
  return str;
};
const deleteYearInput = (e, formValue, index, remove, value, form) => {
  if (
    formValue.le !== "" &&
    (formValue.l?.l === "" || !formValue.l?.l) &&
    !formValue?.li?.name &&
    e.target.value === ""
  ) {
    removeField(index + 1, remove, value, form);
  }
};
const getErrorClass = (error, value) =>
  error === "Required" && value ? "border-maroon-500" : "";

const setValue = (e, formik, index, meta) => {
  let input = getYear(e.target.value);
  formik.setFieldValue(`ls[${index}].y.y`, input);
  if (input === "" || input === undefined) {
    formik.setFieldValue(`ls[${index}].y.m`, '');
    formik.setFieldValue(`ls[${index}].y.d`, '');
  }
  if (!e.target.value || !formik.values.matchExact) {
    formik.setFieldValue(`ls[${index}].y.s`, '8');
  } else {
    formik.setFieldValue(`ls[${index}].y.s`, Object.keys(DateDropdownValues(e.target.value, formik?.values?.ls[index]?.y?.m, formik?.values?.ls[index]?.y?.d))[0]);
  }
  if ((e && e.target.value !== "") || meta.value !== "") {
    formik.setFieldTouched(`ls[${index}].y.y`);
  }
}
const handleYearKeyUp = (e, formik, index, meta, location, push, remove) => {
  const formValue = formik.values.ls[index];
  setValue(e, formik, index, meta);
  if (formValue.le !== "" && (formValue.y?.y === "" || !formValue.y?.y)) {
    formik.setFieldTouched(`ls[${index}].le`);
    formik.setFieldTouched(`ls[${index}].l.l`);
    let cond = formik.values?.ls?.length - 1 === index;
    if (((e && e.target.value !== "") || meta.value !== "") && (!meta.touched || cond)) {
      push(location);
    }
  } else {
    deleteYearInput(e, formValue, index, remove, formik.values.ls, formik);
  }
};

const handleSelectedValue = async (
  e,
  index,
  location,
  meta,
  form,
  { push, remove },
  { setOption, t }
) => {
  const formValue = form.values.ls[index];
  if (e && e.id) {
    form.setFieldValue(`ls[${index}].li.i`, e.id);
    form.setFieldValue(`ls[${index}].li.name`, e.name);
    form.setFieldValue(`ls[${index}].l.l`, e.name);
    let data = await placeAuthority(e.id);
    let obj = { 4: tr(t, "search.form.dropdown.broad") };
    setDropdownObject(data, obj, t, tr);
    let parent = data.parent;
    while (parent) {
      setDropdownObject(parent, obj, t, tr);
      parent = parent.parent;
    }
    setOption((prev) => {
      prev[index] = obj;
      return [...prev];
    });
    const loc = Object.keys(obj)
    form.setFieldValue(`ls[${index}].li.s`, getRelatedValue(form.values.matchExact, loc[0]));
  } else if (e) {
    form.setFieldValue(`ls[${index}].l.l`, e.name);
    form.setFieldValue(`ls[${index}].li.i`, null);
  } else {
    form.setFieldValue(`ls[${index}].l.l`, "");
    form.setFieldValue(`ls[${index}].li.i`, null);
    removeField(index + 1, remove, form.values.ls, form);
  }
  if ((e && e.name) || meta.value !== "") {
    form.setFieldTouched(`ls[${index}].l.l`);
  }
  handleLocationInput(
    e,
    index,
    location,
    meta,
    form,
    { push, remove },
    formValue
  );
};
const handleLocationInput = (
  e,
  index,
  location,
  meta,
  form,
  { push, remove },
  formVal
) => {
  if (formVal.le !== "" && (formVal.l?.l === "" || !formVal.l?.l)) {
    form.setFieldTouched(`ls[${index}].le`);
    form.setFieldTouched(`ls[${index}].y.y`);
    let cond = form.values?.ls?.length - 1 === index;
    if (e && ((e && e.name) || meta.value !== "") && (!meta.touched || cond)) {
      if (!e.id && form.values.matchExact) {
        location.l.s = "0";
        location.y.s = "2";
      }
      push(location);
    }
  } else {
    deleteLocationInput(e, formVal, index, remove, form.values.ls, form);
  }
};
const deleteLocationInput = (e, formVal, index, remove, value, form) => {
  if (
    formVal.le !== "" &&
    e &&
    e.name === "" &&
    (formVal.y?.y === "" || !formVal.y?.y)
  ) {
    removeField(index + 1, remove, form.values.ls, form);
  }
};
const onEventChange = (e, index, location, meta, form, push) => {
  const formValue = form.values.ls[index];
  form.setFieldValue(`ls[${index}].le`, e.target.value);
  if (meta.value !== "" || e.target.value) {
    form.setFieldTouched(`ls[${index}].le`);
  }
  if (!meta.touched) {
    form.setFieldTouched(`ls[${index}].y.y`, false);
    form.setFieldTouched(`ls[${index}].l.l`, false);
  }
  if (formValue.le === "" && (formValue.l?.l !== "" || formValue.y?.y !== "")) {
    form.setFieldTouched(`ls[${index}].y.y`);
    form.setFieldTouched(`ls[${index}].l.l`);
    if ((meta.value !== "" || e.target.value !== "") && !meta.touched) {
      push(location);
    }
  }
};
const removeField = (index, remove, prevVal, formik) => {
  if (prevVal.length - 1 === index - 1) {
    formik.setFieldTouched(`ls[${index - 1}].le`, false, true);
    formik.setFieldTouched(`ls[${index - 1}].y.y`, false, true);
    formik.setFieldTouched(`ls[${index - 1}].l.l`, false, true);
  }
  remove(index);
};
const getFieldValue = (index, form) => {
  let fieldvalue = null;
  if (form.values?.ls[index]?.li?.i) {
    fieldvalue = {
      id: form.values.ls[index].li.i,
      name: form.values.ls[index].li.name,
    };
  } else if (form.values?.ls[index]?.l?.l) {
    fieldvalue = { id: null, name: form.values.ls[index].l.l };
  }
  return fieldvalue;
};
const getLifeEventlocationDropdown = (formik, index, option, noPopup) => {
  let html = null;
  if (formik.values?.ls[index].li?.i) {
    html = (
      <Field
        name={`ls[${index}].li.s`}
        onChange={checkExactFieldLocation.bind(this, index, formik, option)}
        component={TWDropDownComponent}
        isloading={true}
        options={option.length ? option[index] : { 4: "Broad" }}
      />
    );
  } else if (formik.values?.ls[index].l?.l) {
    html = (
      <Field
        name={`ls[${index}].l.s`}
        onChange={checkExactField.bind(this, formik)}
        component={TWDropDownComponent}
        options={getResidenceText()}
      />
    );
  }
  return html;
};
const getCrossButton = (values, index, remove, formik) => {
  let html = null;
  if (values.ls.length > 1 && values?.ls?.length - 1 !== index) {
    html = (
      <button
        type="button"
        className="p-3 absolute right-0 top-0 bg-gray-100 hover:bg-gray-200 rounded-lg outline-none focus:outline-none"
        onClick={() => removeField(index, remove, values.ls, formik)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 13L13 1"
            stroke="#747578"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 13L1 1"
            stroke="#747578"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  }
  return html;
};
const getUniqueEvent = (arr) => {
  let res = [],
    unique = [
      ...new Map(arr.map((item) => [item["universalSearchLabel_US"], item])).values(),
    ];
  unique.sort((a, b) => {
    if (a.searchLabelOrder < b.searchLabelOrder) {
      return -1;
    }
    if (a.searchLabelOrder > b.searchLabelOrder) {
      return 1;
    }
    return 0;
  })
  res = unique.map((item) => {
    return { name: item.universalSearchLabel_US, value: item.universalSearchLabel_US };
  });
  return res;
};
const EventFieldForm = ({
  location,
  formik,
  noPopup,
  setellOptions = [],
  isEdit,
  setOptionVal
}) => {
  const { lifeEvent } = useSelector((state) => state.search);
  const { t } = useTranslation();
  const locationsArr = [{ name: "Select", value: "" }, ...getUniqueEvent(lifeEvent)];
  const option = setellOptions;
  const getEventValue = (formik.values?.ls[0]?.le === '' ? locationsArr?.[0]?.value : formik.values?.ls[0]?.le)
  const getMainLable = event => {
    const data = lifeEvent.filter(item => item.personEventLabel_US === event);
    if (data.length) {
      return data[0].universalSearchLabel_US
    } else {
      return "";
    }
  }
  useEffect(() => {
    formik.setFieldValue(`ls[${0}].le`, getEventValue);
  }, []);
  useEffect(() => {
    if (isEdit) {
      formik.values?.ls.forEach((item, i, arr) => {
        formik.setFieldTouched(`ls[${i}].le`, true);
        formik.setFieldTouched(`ls[${i}].l.l`, true);
        formik.setFieldTouched(`ls[${i}].l.name`, true);
        formik.setFieldTouched(`ls[${i}].y.y`, true);
        if (i === arr.length - 1) {
          formik.setFieldValue(`ls[${i + 1}].le`, "");
          formik.setFieldValue(`ls[${i + 1}].l`, {
            l: "",
            s: "1",
          });
          formik.setFieldValue(`ls[${i + 1}].y`, {
            y: "",
            s: "8",
          });
          formik.setFieldValue(`ls[${i + 1}].li`, {
            s: "4",
          });
        }
      });
    }
  }, [isEdit]);
  return (
    <>
      <FieldArray name="ls">
        {(fieldArrayProps) => {
          const {
            push,
            remove,
            form: { values },
          } = fieldArrayProps;
          return (
            <>
              {(values.ls || []).map((item, index) => {
                return (
                  <div key={`${index}`}>
                    <div className="sm:flex flex-wrap -mx-2 relative">
                      <div className="w-1/2 md:w-1/4 sm:w-1/2 px-2 md:mb-0">
                        <div className="relative md:w-full">
                          <Field id="grid-state" name={`ls[${index}].le`}>
                            {(props) => {
                              const { form, meta, field } = props;
                              const le = getMainLable(field.value)
                              field.value = le ? le : field.value;
                              return (
                                <select
                                  {...field}
                                  onChange={(e) =>
                                    onEventChange(
                                      e,
                                      index,
                                      location,
                                      meta,
                                      form,
                                      push
                                    )
                                  }
                                  className={`block bg-white appearance-none h-10 w-full border border-gray-300 px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent event-select-dd ${getEventClass(
                                    meta.value
                                  )} ${getErrorClass(
                                    formik.errors.isEvent,
                                    !meta.value
                                  )}`}
                                >
                                  {locationsArr.map(
                                    (locationItem, locationIndex) => {
                                      let selectedArr = values.ls.map(
                                        (y) => y.le
                                      ),
                                        cond =
                                          (locationItem.value === "Born" &&
                                            selectedArr.includes("Born")) ||
                                          (locationItem.value === "Died" &&
                                            selectedArr.includes("Died"));
                                      return (
                                        <option
                                          key={locationIndex}
                                          value={
                                            locationItem.value === "Select"
                                              ? ""
                                              : locationItem.value
                                          }
                                          disabled={cond}
                                          hidden={
                                            locationItem.value === "Select"
                                              ? true
                                              : false
                                          }
                                        >
                                          {locationItem.name}
                                        </option>
                                      );
                                    }
                                  )}
                                </select>
                              );
                            }}
                          </Field>
                          <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center px-2 text-gray-700">
                            <svg
                              width="14"
                              height="8"
                              viewBox="0 0 14 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.375 1.40562L6.735 6.76512C6.76978 6.79995 6.81109 6.82759 6.85656 6.84644C6.90203 6.8653 6.95078 6.875 7 6.875C7.04922 6.875 7.09797 6.8653 7.14344 6.84644C7.18891 6.82759 7.23022 6.79995 7.265 6.76512L12.625 1.40562"
                                stroke="#555658"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="sm:w-full md:w-3/4 flex">
                        <div className="w-2/3 md:w-3/4 sm:w-3/4 px-2 mb-3 md:mb-0 flex flex-col">
                          <DateField
                            name={`ls[${index}].y`}
                            yearValue={formik?.values?.ls[index]?.y?.y}
                            monthValue={formik?.values?.ls[index]?.y?.m}
                            dayValue={formik?.values?.ls[index]?.y?.d}
                            values={formik?.values?.ls[index]}
                            setFieldValue={formik.setFieldValue}
                            formik={formik}
                            handleYearKeyUp={handleYearKeyUp}
                            index={index}
                            location={location}
                            push={push}
                            remove={remove}
                          />
                        </div>
                      </div>
                      {getCrossButton(values, index, remove, formik)}
                    </div>
                    <div className="sm:flex flex-wrap -mx-2 mb-2 md:mb-5 relative">
                      <div className="w-1/2 md:w-1/4 sm:w-1/2 px-2 mb-3 md:mb-0"></div>
                      <div className="sm:w-full md:w-3/4 flex">
                        <div className="w-2/3 md:w-3/4 sm:w-3/4 px-2 mb-3 md:mb-0 flex flex-col">
                          <Field name={`ls[${index}].l.l`}>
                            {(props) => {
                              const { form, meta, field } = props;
                              return (
                                <SearchLocation
                                  placeholder="search.unisearchform.autocomplete"
                                  {...field}
                                  freeSolo={true}
                                  value={getFieldValue(index, form)}
                                  id={`locations-filter-${uuidv4()}`}
                                  handleSelectedValue={(e) =>
                                    handleSelectedValue(
                                      e,
                                      index,
                                      location,
                                      meta,
                                      form,
                                      { push, remove },
                                      { setOption: setOptionVal, t }
                                    )
                                  }
                                />
                              );
                            }}
                          </Field>
                          {getLifeEventlocationDropdown(
                            formik,
                            index,
                            option,
                            noPopup
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          );
        }}
      </FieldArray>
    </>
  );
};
export default EventFieldForm;
