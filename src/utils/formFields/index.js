import { Field } from "formik";
import TWDropDownComponent from "../../components/TWDropDown/TWDropDownComponent";
import SearchLocation from "../../components/FWSearchLocation"
import { CheckExactField, getFirstAndLastName, handleSearchType, getLastNode } from "./helper";
import { tr } from "../../components/utils";
import { getDisabledOptions, handleYearkeypress, getYearsOptions } from "../../utils";
import { handleBirthSearchType, getDropDown, getLocationSpecification } from "../../utils/search";

export const inputField = (label, formikLiteral, values, setFieldValue, handleChange, defaultSearch, t) => {
  const data = getLastNode(values, formikLiteral);
  return (
    <>
      <label
        className="block text-gray-600 text-sm mb-1"
        htmlFor="grid-input-field"
      >
        {label}
      </label>
      <Field
        name={`${formikLiteral}.t`}
        id="grid-input-field"
        type="text"
        maxLength="35"
        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
        onChange={(e) =>
          handleSearchType(
            e,
            handleChange,
            setFieldValue,
            formikLiteral,
            formikLiteral,
            values,
            defaultSearch
          )
        }
      />
      {data?.t && (
        <Field
          name={`${formikLiteral}.s`}
          defaultValue="0"
          onChange={CheckExactField.bind(this, setFieldValue)}
          options={getFirstAndLastName(tr, t)}
          component={TWDropDownComponent}
          getdisabledoptions={getDisabledOptions(
            getFirstAndLastName,
            data.t
          )}
        />
      )}
    </>
  )
}

export const yearField = (label, formikLiteral, values, setFieldValue, defaultSearch) => {
  const data = getLastNode(values, formikLiteral);
  return (
    <>
      <label className="block text-gray-600 text-sm mb-1 w-full" htmlFor="grid-year">
        {label}
      </label>
      <Field
        name={`${formikLiteral}.y`}
        maxLength="35"
        className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400::placeholder`}
        id="grid-year"
        type="text"
        onKeyPress={handleYearkeypress}
        onChange={(e) =>
          handleBirthSearchType(e, setFieldValue, formikLiteral, formikLiteral, values, defaultSearch)
        }
        maxLength="4"
      />
      {data?.y && (
        <Field
          name={`${formikLiteral}.s`}
          onChange={CheckExactField.bind(this, setFieldValue)}
          component={TWDropDownComponent}
          options={getYearsOptions()}
        />
      )}
    </>
  )
}

export const dropDownField = (label, formikLiteral, values, dropdown, dropdownLoading, t) => {
  return (
    <>
      <label className="block text-gray-600 text-sm mb-1 w-full" htmlFor="grid-race">
        {label}
      </label>
      <div className="relative">
        <Field
          name={formikLiteral}
          className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${values[formikLiteral] ? "700" : "400"
            } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
          id="dropdown"
          placeholder="Select"
          as="select"
        >
          {getDropDown(dropdown, dropdownLoading, t)}
        </Field>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </>
  )
}

export const locationField = (label, formikLiteral, name, values, setFieldValue, placeholder) => {
  return (
    <>
      <label
        className="block text-gray-600 text-sm mb-1"
        htmlFor="locations-filter"
      >
        {label}
      </label>
      <div className="relative">
        <Field
          name={name}
          relatedField={`${formikLiteral}.li.s`}
          component={SearchLocation}
          freeSolo={true}
          searchType={true}
          placeholder={placeholder}
          id="locations-filter"
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {getLocationSpecification(
        values[name],
        `${formikLiteral}.li.s`,
        `${formikLiteral}.l.s`,
        setFieldValue
      )}
    </>
  )
}



