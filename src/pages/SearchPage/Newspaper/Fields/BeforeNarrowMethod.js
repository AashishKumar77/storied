import Year from "../Components/Year"
import CrossButton from "../Components/CrossButton";
import DropDown from "../Components/DropDown"
import { Field } from "formik";
import {
    getFieldClass,
    checkValueExistForYear
} from "shared-logics"
const BeforeNarrowMethod = ({ field, form }) => {
    const handleBeforeClick = () => {
        form.setFieldValue(`be.y`, '')
    }
    return <div className="md:w-9/12 w-full mb-3 md:mb-0">
        <div className="flex items-start flex-wrap mb-6 md:mb-3.5">
            <div className="md:w-40 sm:w-1/3 w-full md:px-2 sm:pr-2 relative">
                <div className="flex items-center mb-3 sm:mb-0">
                    <Field
                        component={Year}
                        name={`be.y`}
                        className = {`${getFieldClass(form.errors?.be?.y, form.touched?.be?.y)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                    />
                    <DropDown />
                </div>
            </div>
            {checkValueExistForYear(form.values.be) && <CrossButton 
                handleClick = {handleBeforeClick} 
            />
           }
        </div>
    </div>
}
export default BeforeNarrowMethod;