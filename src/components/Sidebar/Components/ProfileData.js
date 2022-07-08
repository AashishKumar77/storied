import React from 'react';
import ProfileField from "./ProfileField";
import RelationFields from "./RelationFields";

const ProfileData = ({
    profile,
    configData = {
        "birthDate": "Birth Date",
        "birthPlace": "Birth Place",
        "home": "Home",
        "race": "Race",
        "occupation": "Occupation",
        "spouse": "Spouse",
        "sibling": "Sibling",
        "parent": "Parent",
        "grandParent": "Grand Parent",
        "children": "Children",
        "grandChildren": "Grand Children"
    },
    gotoRouter
}) => {
    const getFeild = (key) => {
        return profile[key] &&
            profile[key].value ? <ProfileField field={profile[key]} label={configData[key] || ""} /> : null
    }
    const getRelaionalFields = (key) => {
        if (profile[key] && !(Array.isArray(profile[key]) && profile[key].length === 0)) {
            return <RelationFields
                data={profile[key]}
                gotoRouter={gotoRouter}
                label={configData[key] || ""}
            />
        }
        return null;

    }
    return profile ? <div className="scrollable-content records pt-4 pb-2 px-4 sm:px-3.5">
        <div className="mb-6">
            {getFeild('birthDate')}
            {getFeild('birthPlace')}
            {getFeild('home')}
            {getFeild('race')}
            {getFeild('occupation')}
        </div>
        {getRelaionalFields("grandParent")}
        {getRelaionalFields("parent")}
        {getRelaionalFields("spouse")}
        {getRelaionalFields("sibling")}
        {getRelaionalFields("children")}
    </div>
        : null;
}
export default ProfileData;