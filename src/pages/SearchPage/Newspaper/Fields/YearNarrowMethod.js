import Year from "../Components/Year"
import ExpandRange from "../Components/ExpandRange"
import CrossButton from "../Components/CrossButton"
import DropDown from "../Components/DropDown"
import { Field } from "formik";
import {
    getFieldClass,
    checkValueExistForYearRange,
} from "shared-logics"

const YearNarrowMethod = ({ field, form }) => {
    
    const handleYRangeClick = (name) => {
        form.setFieldValue(`${name}.y`, '');
        form.setFieldValue(`${name}.eb`, '0')
    }
    return <div className="md:w-9/12 w-full mb-3 md:mb-0">
        <div className="flex items-start flex-wrap mb-6 md:mb-3.5">
            <div className="md:w-40 sm:w-1/3 w-70 md:px-2 sm:pr-2 relative">
                <div className="flex items-center mb-4 sm:mb-0">
                    <Field
                        component={Year}
                        name="ye.y"
                        className = {`${getFieldClass(form.errors?.ye?.y, form.touched?.ye?.y)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                        onChange={()=>form.setFieldValue('ye.eb', '0')}
                    />
                   <DropDown/>
                </div>
            </div>
            <div className="md:w-48 sm:w-1/3 w-1/2 sm:px-2 pr-2 relative">
                <div className="flex items-center">
                    <Field
                        disabled= {!form.values.ye?.y}
                        component={ExpandRange}
                        name="ye.eb"
                    />
                    <DropDown />

                </div>
            </div>
            
            {checkValueExistForYearRange(form.values.ye) && <CrossButton 
                handleClick = {handleYRangeClick.bind(null, 'ye')} 
            />
           }
        </div>
    </div>
}
export default YearNarrowMethod;