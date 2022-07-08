import React from 'react';
import ProfileField from './ProfileField';

const SsdiData = ({ profile, configData = {
    "birthDate": "Birth Date",
    "deathDate": "Death date",
    "stateName": "State"
} }) => {
    const getFeild = (key) => {
        let returnData=null;
         if(profile[key] 
             &&
            profile[key].value){
            returnData= <ProfileField field={profile[key]} label={configData[key] || ""} /> 
            }
            return returnData;
    }
    return <>
        <div className="scrollable-content records pt-4 pb-2 px-4 sm:px-3.5">
            <div className="mb-1">
                {getFeild('birthDate')}
                {getFeild('deathDate')}
                {getFeild('stateName')}
            </div>
        </div>
    </>
}

export default SsdiData;