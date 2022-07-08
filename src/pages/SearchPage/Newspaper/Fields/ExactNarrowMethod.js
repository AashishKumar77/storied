import Year from "../Components/Year"
import Month from "../Components/Month"
import Day from "../Components/Day"
import CrossButton from "../Components/CrossButton"
import DropDown from "../Components/DropDown"
import { Field } from "formik";
import {
    getFieldClass,
    checkValueExistForDate
} from "shared-logics"
const ExactNarrowMethod = ({ field, form }) => {
    const handleExactClick = (name) => {
        form.setFieldValue(`${name}.y`, '')
        form.setFieldValue(`${name}.m`, '')
        form.setFieldValue(`${name}.d`, '')
    }
    return <div className="md:w-9/12 w-full mb-3 md:mb-0">
        <div className="flex items-start flex-wrap mb-6 md:mb-3.5">
            <div className="md:w-40 sm:w-1/3 w-full md:px-2 sm:pr-2 relative">
                <div className="flex items-center mb-4 sm:mb-0">
                    <Field
                        component={Year}
                        name="ex.y"
                        className = {`${getFieldClass(form.errors?.ex?.y, form.touched?.ex?.y)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                        onChange={()=>form.setFieldValue('ex.d', '')}
                    />
                    <DropDown/>
                </div>
            </div>
            <div className="md:w-40 sm:w-1/3 w-1/2 sm:px-2 pr-2 relative">
                <div className="flex items-center">
                    <Field
                        component={Month}
                        name="ex.m"
                        className = {`${getFieldClass(form.errors?.ex?.m, form.touched?.ex?.m)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                        onChange={()=>form.setFieldValue('ex.d', '')}
                    />
                    <DropDown />
                </div>
            </div>
            <div className="md:w-32 sm:w-1/3 w-1/2 md:px-2 pl-2 relative">
                <div className="flex items-center">
                    <Field
                        component={Day}
                        name="ex.d"
                        className = {`${getFieldClass(form.errors?.ex?.d, form.touched?.ex?.d)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                        year = {form.values.ex?.y}
                        month = {form.values.ex?.m}
                    />
                    <DropDown />

                </div>
            </div>
            {
            checkValueExistForDate(form.values.ex) && <CrossButton 
                handleClick = {handleExactClick.bind(null, 'ex')}
                buttonClass="p-3 ml-2 bg-gray-100 hover:bg-gray-200 rounded-lg outline-none focus:outline-none hidden md:block" 
            />
           }
        </div>
    </div>
}
export default ExactNarrowMethod;