import React from 'react';
import searchIcon from '../../assets/images/search-icon.svg'
import { tr } from "../../components/utils";
import { useTranslation } from "react-i18next";
const NoRecord=({isLoading,searchResult,firstName=''})=>{
    const {t} =useTranslation();
    const noMessageString = () => {
        let message = tr(t, 'search.rsltlst.other');
        if( firstName ) {
            message =  `${tr(t, "search.rsltlst.norsltbfornm")} ${firstName} ${tr(t, "search.rsltlst.norsltaftrnm")}`;
        }
        return message;
    }
    return <>
   {  !isLoading && searchResult &&
                searchResult.length ===0 ?  <div className="bg-white border-t border-b border-gray-200 sm:border-b-0 card sm:bg-white sm:rounded-lg sm:shadow px-5 pt-4 pb-5 text-center">
    <div className="max-w-lg mx-auto py-6">
    <div className="icon-container mb-5">
        <img src={searchIcon} className="inline-block" alt="icon"/>
    </div>
    <h2 className="font-semibold mb-4 break-words overflow-ellipsis overflow-hidden ">{noMessageString()}.</h2>
    <p className="text-sm">{tr(t, "search.rsltlst.norsltwrng")}.  </p>
    </div>
    </div>:null
}
    </>
}

export default NoRecord