import React from "react";
import { useHistory } from "react-router-dom";
import Typography from "./../../../components/Typography";
import "./index.css";
const getFamilyData = (items, goToViewRecord, index) => {
  const familyItem = items?.[1];
  return (
    familyItem && (
      <div className="sidepanel-table mt-8 mb-2" key={index}>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-xs font-normal text-left pb-3 text-gray-300">Household</th>
              <th className="text-xs font-normal text-left pb-3 text-gray-300">Born</th>
              <th className="text-xs font-normal text-left pb-3 text-gray-300">Age</th>
              <th className="text-xs font-normal text-left pb-3 text-gray-300">Relationship</th>
            </tr>
          </thead>
          <tbody>
            {familyItem?.map((item, i) => {
              return (
                <tr key={i}>
                  <td className={`text-sm text-white underline`} onClick={() => goToViewRecord(item.id)}>{`${item.given_name} ${item.surname}`}</td>
                  <td className="text-xs text-gray-300">{item.birth_year}</td>
                  <td className="text-xs text-gray-300">{item.age}</td>
                  <td className="text-xs text-gray-300">{item.relationship}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    )
  );
};
const getFeild = (value, display, index) => {
  let returnData = null;
  if (value && display) {
    returnData = (
      <div key={index} className="flex items-start mb-2">
        <div className="record-label mt-text mb-0 w-28 text-xs text-right pr-4">
          <Typography size={12}>{display}</Typography>
        </div>
        <div className="self-center">
          <h3 className="mb-0 text-sm right-text">{value}</h3>
        </div>
      </div>
    );
  }
  return returnData;
};
const getObjData = (profile) => {
  let obj = { ...profile };
  ["recordId", "partitionKey", "imageId"].forEach((e) => delete obj[e]);
  return obj;
};
const RecordData = ({ profile }) => {
  const history = useHistory();
  const goToViewRecord = (_recordId) => {
    history.push(`/records/${_recordId}/${profile.partitionKey}`);
  };
  return (
    <div className="scrollable-content records pt-4 pb-6 px-4 sm:px-3.5">
      <div className="mb-1">
        {Object.entries(getObjData(profile)).map((item, index) => {
          return item[0] === "family" ? getFamilyData(item, goToViewRecord, index) : getFeild(item[1], item[0], index);
        })}
      </div>
    </div>
  );
};
export default RecordData;
