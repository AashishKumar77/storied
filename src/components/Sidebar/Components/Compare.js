import React from 'react';
import { isObjEmpty } from './../../utils'

import CompareField from './CompareFields';
const Compare = ({ compareToProfile, profile, configData = {
  "name": "Name",
  "birthDate": "Birth Date",
  "birthPlace": "Birth Place",
  "race": "Race",
  "home": "Home",
  "occupation": "Occupation",
  "spouse": "Spouse",
  "parent": "Parent",
  "grandChildren": "Grand Children",
  "sibling": "Sibling",
  "children": "Children",
  "grandParent": "Grand Parent"
} }) => {
  const checkCond = (toProfile) => {
    if (toProfile) {
      if (Array.isArray(toProfile)) {
        return toProfile.length ? true : false
      } else if (toProfile instanceof Object) {
        return isObjEmpty(toProfile) ? false : true
      } else return false
    } else return false
  }
  const getField = key => {
    return checkCond(profile[key]) ?
      <CompareField
        index={key}
        field={profile[key]}
        label={configData[key] || ""}
        compareField={compareToProfile[key]}
      /> : null
  }

  return <>
    <div>
      <div className="grid grid-cols-2">
        <div className="border-r border-gray-600 py-1.5 pl-4 pr-2">
          <h2 className="mb-0 text-sm text-gray-300 font-medium">This Record</h2>
        </div>
        <div className="py-2 px-3">
          <h2 className="mb-0 text-sm text-gray-300 font-medium">Your Tree</h2>
        </div>
      </div>
      {getField("name")}
      {getField("birthDate")}
      {getField("birthPlace")}
      {getField("home")}
      {getField("race")}
      {getField("occupation")}
      {getField("parent")}
      {getField("sibling")}
      {getField("spouse")}
      {getField("children")}
      {getField("grandChildren")}
    </div>
  </>
}

export default Compare;