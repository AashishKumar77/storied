import React from 'react';
import Loader from "./../../../components/Loader";
import folderIcon from "./../../../assets/images/folder-icon.svg"
import { useHistory } from "react-router-dom";
import {  censusGUID, uscensusGUID, wwiiPK, getTitleByPartitionKey } from './../../../utils'
const configCensus = {
    selfFull_name_display_value: "Name",
    military_enlistmentSelfDate_value: "Enlistment Date",
    residenceSelfPlace_raw: "Residence",
    selfGender_value: "Gender",
    birthSelfPlace_raw: "Birthplace",
  };
  const configUsCensus = {
    selfFull_name_display_value: "Name",
    residenceSelfPlace_id: "Residence",
    selfGender_value: "Gender",
    selfRace_value: "Race/Nationality"
  }
const configWWI = {
    selfFull_name_display_value: "Name",
    militarySelfRank_value: "Military Rank",
    residenceSelfPlace_raw: "Residence",
    deathSelfCause_of_death_value: "Cause of Death",
    deathSelfYear_display_value: "Death Year",
  };
const configWWII = {
    selfFull_name_display_value: "Name",
    military_enlistmentSelfDate_value: "Enlistment Date",
    residenceSelfPlace_raw: "Residence",
    selfGender_value: "Gender",
    birthSelfPlace_raw: "Birthplace",
    militarySelfRank_value: "Military Rank",
    "Place of Enlistment": "Place of Enlistment",
  };
const getKeyById = (data, key) => {
    let obj = "",
    pk = data?.partitionKey.split("@")[0];
    if (pk === censusGUID) {
      obj = configCensus[key];
    } else if (pk === wwiiPK) {
      obj = configWWII[key];
    } else if (pk === uscensusGUID){
        obj = configUsCensus[key];
    } else{
      obj = configWWI[key];
    }
    return obj;
  };  
const getField = (data, key) => {
    let displayFields = getKeyById(data, key),
    html = null;
    if (data[key] && displayFields) {
        html = <div className="grid grid-cols-10 mt-2">
            <div className="col-span-3 sm:col-span-2">
                <p className="label text-gray-500 text-sm pr-3">{displayFields}</p>
            </div>
            <div className="col-span-7 sm:col-span-8">
                <p className="text-sm">{data[key]}</p>
            </div>
        </div>
    }
    return html
}
const NoRecords = (loading, profile) => {
    let html = null
    if (!loading) {
        html = <div className="bg-white border-t border-b border-gray-200 sm:border-b-0 card sm:bg-white sm:rounded-lg sm:shadow px-5 pt-4 pb-5 text-center mb-5">
            <div className="max-w-lg mx-auto py-6">
                <div className="icon-container mb-5">
                    <img src={folderIcon} className="inline-block" alt="icon" />
                </div>
                <h2 className="font-semibold mb-2 break-words overflow-ellipsis overflow-hidden ">
                    You haven’t saved any records for  {`${profile?.givenName?.givenName} ${profile?.surname?.surname}`}
                </h2>
            </div>
        </div>
    }
    return html

}
const RecordCard = ({ records, loading, profile }) => {
    const history = useHistory();

    return <>
        {loading ? <><div className="text-center mt-20"><Loader />
            <span className="block py-4 font-bold">Saving Record...</span></div></>
            : null}
        {records?.documents && records?.documents.length ? records.documents.map((item, index) => <div key={index} className="card sm:mb-4 hover:shadow-md relative z-50">

            <div className="border-t border-b border-gray-200 sm:border-b-0 card sm:bg-white sm:rounded-lg sm:shadow px-5 pt-4 pb-5">
                <div className="md:flex">
                    <div className="content-block flex-grow">
                        <div className="head mb-5">
                            <h3 className="font-semibold mb-1">{getTitleByPartitionKey(item?.partitionKey)} </h3>
                        </div>
                        <div className="person-detail">
                            {getField(item, "selfFull_name_display_value")}
                            {getField(item, "residenceSelfPlace_raw")}
                            {getField(item, "deathSelfCause_of_death_value")}
                            {getField(item, "militarySelfRank_value")}
                            {getField(item, "military_enlistmentSelfDate_value")}
                            {getField(item, "military_enlistmentSelfPlace_raw")}
                            {getField(item, "selfGender_value")}
                            {getField(item, "birthSelfPlace_raw")}
                            {getField(item, "deathSelfYear_display_value")}
                            {getField(item, "selfRace_value")}
                            {getField(item, "residenceSelfPlace_id")}
                        </div>
                        <div></div>
                    </div>
                    <div className="hidden md:flex flex-col items-center item-block max-w-xs py-2 px-1">
                        <div className="link-wrap mb-3"><span
                            className="whitespace-nowrap text-blue-400 font-semibold cursor-pointer text-sm hover:bg-blue-200 rounded-lg py-2 px-4" onClick={() => history.push(`/records/${item.recordId}/${item.partitionKey}`)}>View
                            Record</span></div>
                    </div>
                </div>
            </div>
        </div>) : NoRecords(loading, profile)}
    </>
}

export default RecordCard