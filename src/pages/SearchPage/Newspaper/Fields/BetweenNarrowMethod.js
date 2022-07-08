import Year from "../Components/Year"
import Month from "../Components/Month"
import Day from "../Components/Day"
import CrossButton from "../Components/CrossButton";
import DropDown from "../Components/DropDown";
import { Field } from "formik";
import {
    getFieldClass,
    checkValueExistForDate,
    checkValueExistForDateEnd
} from "shared-logics"
const BetweenNarrowMethod = ({field, form, ...props}) => {
    const handleClick = (name) => {
        form.setFieldValue(`${name}.y`, '')
        form.setFieldValue(`${name}.m`, '')
        form.setFieldValue(`${name}.d`, '')
    }
    const handleEndClick = (name) => {
        form.setFieldValue(`${name}.ey`, '')
        form.setFieldValue(`${name}.em`, '')
        form.setFieldValue(`${name}.ed`, '')
    }
    return <div className="md:w-9/12 w-full mb-3 md:mb-0">
    <div key={0} className="flex items-start flex-wrap mb-6 md:mb-4">
        <div className="md:w-40 sm:w-1/3 w-full md:px-2 sm:pr-2 relative">
            <div className="flex items-center mb-4 sm:mb-0">
                <Field 
                    component={Year} 
                    name={`${field.name}.y`}
                    className = {`${getFieldClass(form.errors?.[field.name]?.y, form.touched?.[field.name]?.y)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                    onChange={()=>form.setFieldValue(`${field.name}.d`, '')}
                    />
                <DropDown/>
            </div>
        </div>
        <div className="md:w-40 sm:w-1/3 w-1/2 sm:px-2 pr-2 relative">
            <div className="flex items-center">
            <Field 
                component={Month} 
                name={`${field.name}.m`}
                className = {`${getFieldClass(form.errors?.bt?.m, form.touched?.bt?.m)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                onChange={()=>form.setFieldValue(`${field.name}.d`, '')}/>
                <DropDown />
            </div>
        </div>
        <div className="md:w-32 sm:w-1/3 w-1/2 md:px-2 pl-2 relative">
            <div className="flex items-center">
                <Field 
                    component={Day} 
                    className = {`${getFieldClass(form.errors?.bt?.d, form.touched?.bt?.d)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                    year = {form.values.bt?.y}
                    month = {form.values.bt?.m}
                    name="bt.d"/>
                <DropDown />
            </div>
        </div>
        {
        checkValueExistForDate(form.values.bt) && <CrossButton 
            handleClick = {handleClick.bind(null, 'bt')}
            buttonClass="p-3 ml-2 bg-gray-100 hover:bg-gray-200 rounded-lg outline-none focus:outline-none hidden md:block" 
        />
        }

    </div>
    <div key={1} className="flex items-start flex-wrap mb-6 md:mb-4">
        <div className="md:w-40 sm:w-1/3 w-full md:px-2 sm:pr-2 relative">
            <div className="flex items-center mb-4 sm:mb-0">
                <Field 
                    component={Year} 
                    className = {`${getFieldClass(form.errors?.bt?.ey, form.touched?.bt?.ey)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                    name="bt.ey"
                    onChange={()=>form.setFieldValue('bt.ed', '')}
                />
                <DropDown/>
            </div>
        </div>
        <div className="md:w-40 sm:w-1/3 w-1/2 sm:px-2 pr-2 relative">
            <div className="flex items-center">
                <Field 
                    component={Month} 
                    name="bt.em"
                    className = {`${getFieldClass(form.errors?.bt?.em, form.touched?.bt?.em)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                    onChange={()=>form.setFieldValue('bt.ed', '')}
                    />
                <DropDown />
            </div>
        </div>
        <div className="md:w-32 sm:w-1/3 w-1/2 md:px-2 pl-2 relative">
            <div className="flex items-center">
                <Field 
                    component={Day} 
                    className = {`${getFieldClass(form.errors?.[field.name]?.ed, form.touched?.[field.name]?.ed)?"border-transparent ring-2 ring-maroon-400 focus:ring-maroon-400": "border  focus:ring-blue-400"}`}
                    year = {form.values[field.name]?.ey}
                    month = {form.values[field.name]?.em}
                    name="bt.ed"/>
                <DropDown />
            </div>
        </div>
           {checkValueExistForDateEnd(form.values[field.name]) && <CrossButton 
                handleClick = {handleEndClick.bind(null, `${field.name}`)}
                buttonClass="p-3 ml-2 bg-gray-100 hover:bg-gray-200 rounded-lg outline-none focus:outline-none hidden md:block" 
            />
           }

    </div>
</div>
}
export default BetweenNarrowMethod;