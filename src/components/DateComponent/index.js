import { Field } from "formik";
import { CheckExactField, DateDropdownValues, daysInMonth, handleDateYear, handleDay, handleMonth, handleYearkeypress, months } from "../../utils";
import TWDropDownComponent from "../TWDropDown/TWDropDownComponent";



const DateComponent = ({ label, yearValue, monthValue, dayValue, name, values, setFieldValue }) => {

    return (
        <div className="flex flex-wrap -mx-2 md:mb-2.5">
            <div className="w-full px-2">
                <label
                    className="block text-gray-600 text-sm mb-1"
                    htmlFor="grid-date"
                >
                    {label}
                </label>
            </div>

            <div className={`w-full  md:w-1/5 px-2 mb-2.5`}>
                <Field
                    name={`${name}.y`}
                    maxLength="35"
                    placeholder="Year"
                    className={`appearance-none block w-full h-10 text-gray-700 border border-gray-300 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400::placeholder`}
                    id="grid-birth-year"
                    type="text"
                    onKeyPress={handleYearkeypress}
                    onChange={(e) =>
                        handleDateYear(e, setFieldValue, name, values)
                    }
                    maxLength="4"
                />
                {yearValue && yearValue.toString().length === 4 && (
                    <Field
                        name={`${name}.s`}
                        component={TWDropDownComponent}
                        onChange={CheckExactField.bind(this, setFieldValue)}
                        options={DateDropdownValues(yearValue, monthValue, dayValue)}
                    />
                )}
            </div>

            {/* Month Dropdown */}

            {yearValue && yearValue.toString().length === 4 && (
                <div className={`w-full  md:w-1/5 px-2 mb-2.5`}>
                    <div className="relative">
                        <Field
                            name={`${name}.m`}
                            className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${monthValue ? "700" : "400"
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
                            {Object.entries(months).map(([key, value]) => {
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
            )}

            {/* Day Dropdown */}

            {yearValue && monthValue && (
                <div className={`w-full  md:w-1/5 px-2 mb-2.5`}>
                    <div className="relative">
                        <Field
                            name={`${name}.d`}
                            className={`block appearance-none h-10 w-full border border-gray-300 text-gray-${dayValue ? "700" : "400"
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
                            {daysInMonth(monthValue, yearValue)?.map((day) => {
                                return <option value={day}>{day}</option>;
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
            )}
        </div>
    )
}

export default DateComponent