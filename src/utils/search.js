import { Field } from "formik";
import { CheckExactField, CheckExactFieldLocation, getDisabledOptions, getFirstAndLastName, getResidenceText, getYear, getYearsOptions, handleYearkeypress, numToLocaleString } from ".";
import SearchLocation from "../components/FWSearchLocation";
import TWDropDownComponent from "../components/TWDropDown/TWDropDownComponent";
import Typography from "../components/Typography";
import { tr } from "../components/utils";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/Button";


export const handleSearchType = (
  e,
  handleChange,
  setFieldValue,
  name,
  match,
  values,
  defaultTypeSearch
) => {
  handleChange(e);
  if (!e.target.value) {
    setFieldValue(`${name}.s`, defaultTypeSearch[match] || "2");
  } else {
    if (values.matchExact) {
      setFieldValue(`${name}.s`, defaultTypeSearch[match] || "0");
    }
  }
};

export const handleBirthSearchType = (e, setFieldValue, name, match, values, defaultTypeSearch) => {
  let input = getYear(e.target.value);
  setFieldValue(`${name}.y`, input);
  if (!e.target.value) {
    setFieldValue(`${name}.s`, defaultTypeSearch[match] || "8");
  } else {
    if (values.matchExact) {
      setFieldValue(`${name}.s`, defaultTypeSearch[match] || "2");
    }
  }
};

export const getDropDown = (data, dropdownLoading, t) => {
  let options = [];
  if (dropdownLoading) {
    options.push(
      <option value="" key={-1}>
        {tr(t, "search.ww1.form.dropdown.loading")}
      </option>
    );
  } else {
    options.push(
      <option selected hidden value="">
        {tr(t, "search.ww1.form.dropdown.select")}
      </option>,
      <option value="" key={-1}>
        None
      </option>
    );
  }
  options = [
    ...options,
    ...Object.entries(data).map((_data, index) => (
      <option value={_data[0]} key={index}>
        {_data[1]}
      </option>
    )),
  ];
  return options;
};

const getResidenceData = (data) => {
  if (data.levelData) {
    return data.levelData.residenceLevel;
  }
  return null;
};

export const getLocationSpecification = (
  locationfield,
  nameId,
  name,
  setFieldValue
) => {
  if (locationfield?.name) {
    const _options =
      (locationfield.id && getResidenceData(locationfield)) || [];
    return locationfield.id ? (
      <Field
        name={nameId}
        component={TWDropDownComponent}
        onChange={CheckExactFieldLocation.bind(
          this,
          setFieldValue,
          locationfield
        )}
        isloading={!_options}
        options={_options}
      />
    ) : (
      <Field
        name={name}
        onChange={CheckExactField.bind(this, setFieldValue)}
        component={TWDropDownComponent}
        options={getResidenceText()}
      />
    );
  }
};

export const PaginationResult = (
  t,
  pageRecords,
  limitPerPage,
  current,
  totalRecords
) =>
  pageRecords ? (
    <>
      {tr(t, "search.ww1.list.results")}{" "}
      {`${numToLocaleString(
        limitPerPage * (current - 1) + 1
      )}-${numToLocaleString(pageRecords)}`}{" "}
      {tr(t, "search.ww1.list.rpagination")} {numToLocaleString(totalRecords)}{" "}
    </>
  ) : (
    tr(t, "search.nresult")
  );


export const getFieldDropdowns = (
  bool,
  nameId,
  name,
  locationfield,
  setFieldValue,
  getOptions
) => {
  if (bool) {
    return (
      <Field
        name={nameId}
        component={TWDropDownComponent}
        options={getOptions()}
        onChange={CheckExactFieldLocation.bind(
          this,
          setFieldValue,
          locationfield
        )}
      />
    );
  } else {
    return (
      <Field
        name={name}
        component={TWDropDownComponent}
        onChange={CheckExactField.bind(this, setFieldValue)}
        options={getResidenceText()}
      />
    );
  }
};

export const headerContentSubmitButton = ({
  t,
  title,
  buttonTitle,
  dirty,
  isSubmitting,
  isValid
}) => (
  <div className="head mb-5 flex justify-between items-center justify-between">
    <h2 className="inline mb-0">
      <Typography size={24} text="secondary" weight="medium">
        {title}
      </Typography>
    </h2>
    <button
      className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last hidden md:flex"
      type="submit"
      disabled={!dirty || isSubmitting || !isValid}
    >
      {isSubmitting
        ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
        : tr(t, buttonTitle)}
    </button>
  </div>
);

export const headerContent = ({
  t,
  title,
  buttonTitle,
  dirty,
  isSubmitting,
  isValid,
  values,
  setSubmitting,
  handleSubmit,
}) => (
  <div className="head mb-5 flex justify-between items-center justify-between">
    <h2 className="inline mb-0">
      <Typography size={24} text="secondary" weight="medium">
        {title}
      </Typography>
    </h2>
    <button
      className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last hidden md:flex"
      type="button"
      disabled={!dirty || isSubmitting || !isValid}
      onClick={() => handleSubmit(values, { setSubmitting })}
    >
      {isSubmitting
        ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
        : tr(t, buttonTitle)}
    </button>
  </div>
);


export const submitAndClearButtons = (dirty, isSubmitting, isValid, clear, buttonTitle, t) => {
  return (
    <div className="buttons sm:ml-auto sm:flex">
      <button
        type="submit"
        className="disabled:opacity-50 bg-blue-400 active:bg-blue-500 text-white font-semibold text-base px-6 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 sm:ml-4 w-full sm:w-auto order-last"
        disabled={!dirty || isSubmitting || !isValid}
      >
        {isSubmitting
          ? `${tr(t, "search.ww1.form.dropdown.loading")}...`
          : tr(t, buttonTitle)}
      </button>
      {clear ? (
        <button
          type="reset"
          disabled={!dirty || isSubmitting}
          className="disabled:opacity-50 text-gray-700 active:bg-gray-200 rounded-lg bg-gray-100 font-semibold px-6 py-2 text-base focus:outline-none focus:ring-2 focus:ring-inset focus:text-black w-full sm:w-auto mt-4 sm:mt-0"
        >
          {tr(t, "search.ww1.form.clear")}
        </button>
      ) : null}
    </div>
  )
}

export const ListingPageheaderContent = (title) => (
  <div className="head-content text-center">
    <h2 className="mb-5 sml:mb-1.5">
      <Typography
        fontFamily="primaryFont"
        size={24}
        text="secondary"
        weight="medium"
      >
        {title}
      </Typography>
    </h2>
  </div>
);


//Previous Residence Field

export const previousResidenceField = (values, setFieldValue, label, md) => {
  return <div className="flex flex-wrap -mx-2 md:mb-2.5">
    <div className={`w-full ${md && "br-field-md"}  md:w-3/4 px-2 mb-2.5`}>
      <label
        className="block text-gray-600 text-sm mb-1"
        htmlFor="grid-Residence"
      >
        {label}
      </label>
      <div className="relative">
        <Field
          name={`Res`}
          relatedField="pr.li.s"
          component={SearchLocation}
          freeSolo={true}
          searchType={true}
          id={`locations-filter-${uuidv4()}`}
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
        values.Res,
        "pr.li.s",
        "pr.l.s",
        setFieldValue
      )}
    </div>
  </div>
}

// Birth Year Field

export const birthYearField = (values, setFieldValue, defaultSearch) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1 w-full"
          htmlFor="grid-birth-year"
        >
          Birth Year
        </label>
        <Field
          name="b.y.y"
          maxLength="35"
          className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400::placeholder`}
          id="grid-birth-year"
          type="text"
          onKeyPress={handleYearkeypress}
          onChange={(e) =>
            handleBirthSearchType(e, setFieldValue, "b.y", "b.y", values, defaultSearch)
          }
          maxLength="4"
        />
        {values?.b?.y?.y && (
          <Field
            name={`b.y.s`}
            onChange={CheckExactField.bind(this, setFieldValue)}
            component={TWDropDownComponent}
            options={getYearsOptions()}
          />
        )}
      </div>
    </div>
  )
}


// Gender Field

export const genderField = (data, dropdownLoading, t, values, width, inputWidth) => {
  return (
    <div className={`w-full ${width} px-2 mb-2.5`}>
      <label
        className="block text-gray-600 text-sm mb-1"
        htmlFor="grid-gender"
      >
        Gender
      </label>
      <div className="relative">
        <Field
          name="g"
          className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${values.g ? "700" : "400"
            } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
          id="grid-gender"
          placeholder="Select"
          as="select"
        >
          {getDropDown(data, dropdownLoading, t)}
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
    </div>
  )
}

// Place of Departure Field

export const departureField = (values, setFieldValue, md) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1"
          htmlFor="grid-port-embarkment"
        >
          Place of Departure
        </label>
        <div className="relative">
          <Field
            name={`PDepart`}
            relatedField="d.li.s"
            component={SearchLocation}
            freeSolo={true}
            searchType={true}
            id={`locations-filter-${uuidv4()}`}
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
          values.PDepart,
          "d.li.s",
          "d.l.s",
          setFieldValue
        )}
      </div>
    </div>
  )
}


export const departureWidthField = (values, setFieldValue) => {
  return (

    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className="px-2 w-full">
        <label
          className="block text-gray-600 text-sm mb-1 w-full"
          htmlFor="grid-place-departure"
        >
          Place of Departure
        </label>
      </div>
      <div className={`w-full br-field-md px-2 mb-2.5`}>
        <div className="relative">
          <Field
            name={`PDepart`}
            component={SearchLocation}
            relatedField="d.li.s"
            searchType={true}
            freeSolo={true}
            id={`locations-filter-${uuidv4()}`}
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

        {/* Departure Location dropdown */}

        {getLocationSpecification(
          values.PDepart,
          "d.li.s",
          "d.l.s",
          setFieldValue
        )}
      </div>
    </div>
  )
}


//Immigration Destination Field

export const immigrationField = (values, setFieldValue) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1"
          htmlFor="grid-immigration-destination"
        >
          Immigration Destination
        </label>
        <div className="relative">
          <Field
            name={`IDest`}
            relatedField="id.li.s"
            component={SearchLocation}
            freeSolo={true}
            searchType={true}
            id={`locations-filter-${uuidv4()}`}
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
          values.IDest,
          "id.li.s",
          "id.l.s",
          setFieldValue
        )}
      </div>
    </div>
  )
}

// Occupation Field

export const occupationField = (data, dropdownLoading, t, values, width, inputWidth) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
      <div className={`w-full ${width} px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1"
          htmlFor="grid-occupation"
        >
          Occupation
        </label>
        <div className="relative">
          <Field
            name="o"
            className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${values.o ? "700" : "400"
              } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
            id="grid-occupation"
            placeholder="Select"
            as="select"
          >
            {getDropDown(data, dropdownLoading, t)}
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
      </div>
    </div>
  )
}

// Birth Place and Year

export const birthPlaceAndYear = (values, setFieldValue, defaultSearch, inputWidth) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className="px-2 w-full">
        <label
          className="block text-gray-600 text-sm mb-1 w-full"
          htmlFor="grid-birth-place"
        >
          Birth
        </label>
      </div>
      <div className={`w-full br-field-md px-2 mb-2.5`}>
        <div className="relative">
          <Field
            name={`BirthPlace`}
            relatedField="b.li.s"
            component={SearchLocation}
            freeSolo={true}
            searchType={true}
            id={`locations-filter-${uuidv4()}`}
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
          values.BirthPlace,
          "b.li.s",
          "b.l.s",
          setFieldValue
        )}
      </div>
      <div className={`w-full birth-year-field px-2 mb-2.5`}>
        <Field
          name="b.y.y"
          maxLength="35"
          placeholder="Year"
          className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400::placeholder ${inputWidth}`}
          id="grid-birth-year"
          type="text"
          onKeyPress={handleYearkeypress}
          onChange={(e) =>
            handleBirthSearchType(
              e,
              setFieldValue,
              "b.y",
              "b.y",
              values,
              defaultSearch
            )
          }
          maxLength="4"
        />
        {values?.b?.y?.y && (
          <Field
            name={`b.y.s`}
            component={TWDropDownComponent}
            onChange={CheckExactField.bind(this, setFieldValue)}
            options={getYearsOptions()}
          />
        )}
      </div>
    </div>
  )
}

// Birth Place and Year with labels and more width

export const birthYearandPlacewithLabels = (values, setFieldValue, defaultSearch, inputWidth) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1 w-full"
          htmlFor="grid-birth-place"
        >
          Birthplace
        </label>
        <div className="relative">
          <Field
            component={SearchLocation}
            relatedField="b.li.s"
            name={`BirthPlace`}
            freeSolo={true}
            id={`locations-filter-${uuidv4()}`}
            searchType={true}
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

        {/* BirthPlace Dropdown */}

        {getLocationSpecification(
          values.BirthPlace,
          "b.li.s",
          "b.l.s",
          setFieldValue
        )}
      </div>
      <div className={`w-full  md:w-1/4 px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1 w-full"
          htmlFor="grid-birth-place"
        >
          Birth Year
        </label>
        <Field
          name="b.y.y"
          maxLength="35"
          className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400::placeholder ${inputWidth}`}
          id="grid-birth-year"
          type="text"
          onKeyPress={handleYearkeypress}
          onChange={(e) =>
            handleBirthSearchType(e, setFieldValue, "b.y", "b.y", values, defaultSearch)
          }
          maxLength="4"
        />
        {values?.b?.y?.y && (
          <Field
            name={`b.y.s`}
            onChange={CheckExactField.bind(this, setFieldValue)}
            component={TWDropDownComponent}
            options={getYearsOptions()}
          />
        )}
      </div>
    </div>

  )
}





export const immigrationWidthField = (values, setFieldValue) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className={`w-full br-field-md px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1"
          htmlFor="grid-birth-place"
        >
          Immigration Destination
        </label>
        <div className="relative">
          <Field
            id={`locations-filter-${uuidv4()}`}
            relatedField="id.li.s"
            name={`IDest`}
            component={SearchLocation}
            freeSolo={true}
            searchType={true}
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

        {/* Immigration Destination dropdown */}

        {getLocationSpecification(
          values.IDest,
          "id.li.s",
          "id.l.s",
          setFieldValue
        )}
      </div>
    </div>
  )
}

export const birthPlaceField = (values, setFieldValue, label) => {
  return (
    <div className="flex flex-wrap -mx-2 md:mb-2.5">
      <div className={`w-full br-field-md px-2 mb-2.5`}>
        <label
          className="block text-gray-600 text-sm mb-1"
          htmlFor="grid-country-place"
        >
          {label}
        </label>
        <div className="relative">
          <Field
            id={`locations-filter-${uuidv4()}`}
            name={`BirthPlace`}
            relatedField="b.li.s"
            component={SearchLocation}
            freeSolo={true}
            searchType={true}
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

        {/* Birth Place Location */}

        {getLocationSpecification(
          values.BirthPlace,
          "b.li.s",
          "b.l.s",
          setFieldValue
        )}
      </div>
    </div>
  )
}

export const marriagePlaceField = (values, setFieldValue, placeholder) => {
  return (
    <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
      <label
        className="block text-gray-600 text-sm mb-1"
        htmlFor="grid-Marriage-Place"
      >
        Marriage Place
      </label>
      <div className="relative">
        <Field
          name={`Marriage`}
          relatedField="m.li.s"
          component={SearchLocation}
          freeSolo={true}
          searchType={true}
          placeholder={placeholder}
          id={`locations-filter-${uuidv4()}`}
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
        values.Marriage,
        "m.li.s",
        "m.l.s",
        setFieldValue
      )}
    </div>
  )
}


export const ResidenceField = (values, setFieldValue, width) => {
  return (
    <div className={`w-full ${width} px-2 mb-2.5`}>
      <label
        className="block text-gray-600 text-sm mb-1"
        htmlFor="grid-Residence-Place"
      >
        Residence
      </label>
      <div className="relative">
        <Field
          name={`Residence`}
          relatedField="r.li.s"
          component={SearchLocation}
          freeSolo={true}
          searchType={true}
          placeholder="City, County"
          id={`locations-filter-${uuidv4()}`}
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
        values.Residence,
        "r.li.s",
        "r.l.s",
        setFieldValue
      )}
    </div>
  )
}

export const RaceField = (data, dropdownLoading, t, values, width, inputWidth) => {
  return (
    <div className={`w-full ${width} px-2 mb-2.5`}>
      <label
        className="block text-gray-600 text-sm mb-1 w-full"
        htmlFor="grid-us-federal-1800-race"
      >
        Race/Nationality
      </label>
      <div className="relative">
        <Field
          name="sr"
          className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${values.sr ? "700" : "400"
            } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent ${inputWidth}`}
          id="grid-us-federal-1800-race"
          placeholder="Select"
          as="select"
        >
          {getDropDown(data, dropdownLoading, t)}
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
    </div>
  )
}

export const refineSearchButtons = (isSubmitting, isValid, dirty, buttonTitle, handleShowModal) => {
  return (
    <div className="mb-2 md:pt-6 flex justify-between w-full">
      <div className="buttons ml-auto flex">
        <div className="mr-1.5">
          <Button
            handleClick={(e) => {
              e.preventDefault();
              handleShowModal(true);
            }}
            type="default"
            title="Edit Search"
          />
        </div>
        <Button
          disabled={isSubmitting || !isValid || !dirty}
          buttonType="submit"
          title={buttonTitle}
        />
      </div>
    </div>
  )
}

export const getFirstNameDropDown = (setFieldValue, values, t) => {
  let html = null;

  if (values?.fm?.t?.givenName?.givenName || values?.fm?.t?.name) {
    html = (
      <Field
        name="fm.s"
        component={TWDropDownComponent}
        onChange={CheckExactField.bind(this, setFieldValue)}
        options={getFirstAndLastName()}
        defaultValue="0"
        getdisabledoptions={getDisabledOptions(
          getFirstAndLastName,
          values?.fm?.t
        )}
      />
    )
  }
  return html;

}