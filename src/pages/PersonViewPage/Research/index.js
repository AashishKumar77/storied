import React,{useState,useEffect} from "react";
import clueIcon from "./../../../assets/images/clue-icon.svg"
import className from "classnames";
import {useDispatch,useSelector} from 'react-redux';
import {researchSavedRecord,textMsgFlag} from './../../../redux/actions/personResearch'
import {useParams} from 'react-router-dom'
import RecordCard from  './RecordCard'
import {getTitleByPartitionKey} from "./../../../utils"
const Research = (props) => {
    const {primaryPersonId} =useParams()
    const dispatch=useDispatch()
    useEffect(() => {
      dispatch(researchSavedRecord({primaryPersonId}))
    }, [dispatch,primaryPersonId])
    const [savedRecord,setSavedRecords]=useState(true)
    const {isLoading,savedRecord:records,showTextMsg} =useSelector(state=>state.personResearch)
    setTimeout(() => {
        if(showTextMsg){
            dispatch(textMsgFlag(false ))
        }
    }, 15000);
    return <div  id = "person-page" className="mx-auto w-full max-w-screen-lg px-4 lg:px-28 pb-2">
    <div className="tabs text-center mt-4 mb-4">
        <span className={className('text-gray-700 text-sm font-bold py-2 mx-2 inline-block  cursor-pointer',{'border-b-2 border-blue-400':savedRecord})} onClick={()=>setSavedRecords(true)}>Saved Records</span>
        <span className={className('text-gray-700 text-sm font-bold py-2 mx-2 inline-block  cursor-pointer',{'border-b-2 border-blue-400':!savedRecord})} onClick={()=>setSavedRecords(false)} >Clues</span>
    </div>
    <div className="cards-wrap">
        {savedRecord?<>
        <RecordCard records={records} loading={isLoading} profile={props?.person?.personalInfo} />
        </>:
        <>
        <div className="bg-white border-t border-b border-gray-200 sm:border-b-0 card sm:bg-white sm:rounded-lg sm:shadow px-5 pt-4 pb-5 text-center">
            <div className="max-w-lg mx-auto py-6">
                <div className="icon-container mb-5">
                <img src={clueIcon} className="inline-block" alt="icon" />                            
                    </div>
                <h2 className="font-semibold mb-2 break-words overflow-ellipsis overflow-hidden ">
                {`We haven’t found any new clues for ${props?.person?.personalInfo?.givenName?.givenName} ${props?.person?.personalInfo?.surname?.surname}`}</h2>
                <p className="text-sm">
                We’ll keep digging, but in the mean time try adding more details
                </p>
            </div>
        </div> 
        </>
        
        }      
    </div>
    {showTextMsg?<div className="fixed left-0 bottom-5 px-4 py-3 rounded font-medium z-50 left-5 text-white bg-gray-700 text-sm shadow-md">{`${getTitleByPartitionKey(showTextMsg?.partitionKey)} saved to ${showTextMsg?.textName || 'User'}`}</div>:null}
</div>
}

export default Research;