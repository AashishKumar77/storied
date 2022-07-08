import { dropDownField, locationField } from "./index"
export const immigrationFields = (values, setFieldValue, gender, dropdownLoading, t) => {
    return (
        <>
            <div className="flex flex-wrap -mx-2 md:mb-2.5 md:max-w-lg">
                <div className={`w-full px-2 mb-2.5`}>
                    {dropDownField("Gender", "g", values, gender, dropdownLoading, t)}
                </div>
            </div>

            <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                    {locationField("Place of Departure", "d", "PDepart", values, setFieldValue)}
                </div>
            </div>
            <div className="flex flex-wrap -mx-2 md:mb-2.5">
                <div className={`w-full md:w-3/4 px-2 mb-2.5`}>
                    {locationField("Immigration Destination", "id", "IDest", values, setFieldValue)}
                </div>
            </div>
        </>
    )
}