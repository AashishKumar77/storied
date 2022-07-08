import { Field } from "formik";
import { CheckExactField, DateDropdownValues, daysInMonth, handleDay, handleMonth, handleYearkeypress, months } from "../../utils";
import TWDropDownComponent from "../TWDropDown/TWDropDownComponent";


const DateField = ({ yearValue, monthValue, dayValue, name, values, setFieldValue, handleYearKeyUp, index, location, push, remove, formik }) => {
    let matchExact = formik.values.matchExact
    values = { ...values, matchExact }
    return (
        <div className="flex flex-wrap -mx-2">
            <div className={`w-full  md:w-1/3 px-2 mb-2.5`}>
                <Field name={`${name}.y`}>
                    {(props) => {
                        const { meta, field } = props;
                        return (
                            <input
                                {...field}
                                value={meta.value || ""}
                                onKeyPress={handleYearkeypress}
                                onChange={(e) =>
                                    handleYearKeyUp(
                                        e,
                                        formik,
                                        index,
                                        meta,
                                        location,
                                        push,
                                        remove
                                    )
                                }
                                id="grid-year"
                                className="appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg pl-4 pr-2 md:px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                                type="text"
                                placeholder="Year"
                                maxLength="4"
                            />
                        );
                    }}
                </Field>
                {/* <Field
                    className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400::placeholder`}
                    id="grid-year"
                    type="text"
                    name={`${name}.y`}
                    maxLength="35"
                    onKeyPress={handleYearkeypress}
                    placeholder="Year"
                    onChange={(e) =>
                        handleDateYear(e, setFieldValue, name, values)
                    }
                    maxLength="4"
                /> */}
                {yearValue && yearValue.toString().length === 4 && (
                    <Field
                        name={`${name}.s`}
                        options={DateDropdownValues(yearValue, monthValue, dayValue)}
                        onChange={CheckExactField.bind(this, setFieldValue)}
                        component={TWDropDownComponent}
                    />
                )}
            </div>

            {/* Month Dropdown */}
            <div className={`w-full  md:w-1/3 px-2 mb-2.5`}>
                <div className="relative">
                    <Field
                        name={`${name}.m`}
                        readOnly
                        className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${yearValue ? "700" : "400"
                            } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                        id="grid-month"
                        placeholder="Month"
                        as="select"
                        onChange={(e) =>
                            handleMonth(e, setFieldValue, values, name)
                        }
                    >
                        <option selected hidden value="">
                            Month
                        </option>
                        ,
                        <option value="" key={-1}>
                            None
                        </option>
                        {yearValue && Object.entries(months).map(([key, value]) => {
                            return (
                                <option value={value} key={key}>
                                    {key}
                                </option>
                            );
                        })}
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

            {/* Day Dropdown */}

            <div className={`w-full  md:w-1/3 px-2 mb-2.5`}>
                <div className="relative">
                    <Field
                        name={`${name}.d`}
                        className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${yearValue && monthValue ? "700" : "400"
                            } tw-sel-src bg-white px-4 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent`}
                        id="grid-day"
                        placeholder="Day"
                        as="select"
                        onChange={(e) =>
                            handleDay(
                                e,
                                setFieldValue,
                                values,
                                name,
                                monthValue
                            )
                        }
                    >
                        <option selected hidden value="">
                            Day
                        </option>
                        ,
                        <option value="" key={-1}>
                            None
                        </option>
                        {yearValue && daysInMonth(monthValue, yearValue)?.map((day, i) => {
                            return <option value={day} key={i}>{day}</option>;
                        })}
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

export default DateField