import React from 'react';

// Components
import SearchLocation from "../components/SearchLocation";

const LocationPage = () => {

    const handleSelectedValue = (value) => {
        console.log("handleSelectedValue...", { value })
    }
    
    return (
        <div className="flex justify-center w-full">
            <div className="mt-24 w-80">
                <SearchLocation
                    placeholder="search.unisearchform.autocomplete"
                    handleSelectedValue={handleSelectedValue}
                />
            </div>
        </div>
    )
}

export default LocationPage;