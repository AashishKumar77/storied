import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from "prop-types";
import Ssdi from './Components/SsdiData'
import Newspaper from './Components/NewpapperData';
import ProfileData from "./Components/ProfileData"
import TreeButton from './Components/TreeButton'
import { calculateCompareToData } from './../utils'
import CompareTo from './Components/CompareTo';
import Clue from './Components/Clue';
import SaveTree from './Components/SaveToTree'
import Header from "./Components/Header";
import Compare from './Components/Compare'
import Loader from './../Loader';
import Typography from "./../../components/Typography";
import TailwindModal from "../TailwindModal"
import SideBardCloseButton from './Components/SideBardCloseButton';
import {
  handleResize,
  handleIframeClick,
  getSidebarTypeClass
} from "../utils/sidebar";
import {removeAtFromGuid} from "../../utils"
import className from "classnames";
import RecordData from './Components/RecordData';
import STTForm from './Components/STTForm';
import { saveToTreePost,getContentCatalog } from '../../redux/actions/sidebar'
import Error from "./Components/Error";
import LazyLoadImage from "./../LazyLoadImg";
import {
  useHistory,
  useParams
} from 'react-router-dom'

const getModalErrMsg=saveToTreeError=> saveToTreeError?.length && saveToTreeError[0]?.code=== "409"?saveToTreeError[0]?.description:null
const saveToTreeRecords = (recordId, partitionKey, dispatch, values,user, history, setShowErrorStoryDropdown) => {
  if( recordId && partitionKey || user) {
    values.peopleList && dispatch(saveToTreePost({personId: values.peopleList.id}, {
        "treeId": values.tree,
        "treePersonId": values.peopleList.id,
        "recordId": recordId || user?.recordId,
        "partitionKey": partitionKey || user?.partitionKey,
    },{textName:user.selfFull_name_display_value||user?.Name, partitionKey: partitionKey||user?.partitionKey}, history, setShowErrorStoryDropdown))
  }
}
const isCloseBtn = (showSideBarAction,showSideBar) => {
  let btn = null;
    btn = (
      <button
        className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
        onClick={() => showSideBarAction(showSideBar)}
      >
        <span className="sr-only">Close panel</span>
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 8C0 3.58172 3.58172 0 8 0L24 0C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24L0 8Z" fill="#555658"/>
<path d="M10 22L22 10" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M22 22L10 10" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

      </button>
    );
  return btn;
};
const getHeader=(profile,type,contentCatalog)=>{
  let html= <div className="px-4 sm:px-3.5 border-b border-gray-600 mt-2 pb-4">
  <h2 id="slide-over-heading" className="mb-0 pb-0">
    
<Typography
  size={24}
  text="primary"
  weight="medium"
>
      <span className="text-white">
          {profile?.selfFull_name_display_value || profile?.Name || ''}
      </span>
      </Typography>
  </h2> 
  <p className="mt-0.5 mb-0">
  <Typography
  size={14}  
>
  <span className='flex'>
    <span className="text-gray-300 block w-11/12">{contentCatalog?.collectionTitle || ''}</span>
 </span>
</Typography>
  </p>
</div>
if(type !=='records'){
  html=<Header profile={profile} type={type}/>
}
return html;
}
const getClue=(clueValue)=>clueValue ? <Clue clueValue={clueValue} /> : null
const Sidebar = ({
  clueValue,
  comparedTo,
  comparedProfile,
  showSideBar,
  showSideBarAction,
  type,
  profile,
  savedPerson,
  treeData,
  gotoRouter,
  isLoading,
  prevNext,
  handlePrev,
  handleNext,
}) => {
  const [showStoryDropdown, setShowStoryDropdown] = useState(false)
  const [showErrorStoryDropdown, setShowErrorStoryDropdown] = useState(false)
  const treeFamily = useSelector(state => state.sidebar.saveTree)
  const [compareToProfile, setCompareToProfile] = useState(false);
  const [compareTree, setCompareTree] = useState(false);
  const [saveButton, setSaveButton] = useState(true);
  const [screenDropDown, setScreenDropDown] = useState("bottom");
  const profilediv = useRef();
  const scrollDiv = useRef();
  const treeDiv = useRef();
  const history=useHistory();
  const dispatch = useDispatch();
  const { recordId, partitionKey }=useParams();
  const newPartKey=partitionKey?.split('@')[0]
  useEffect(()=>{
    if(recordId && newPartKey){
      dispatch(getContentCatalog({partitionKey:newPartKey}))
    }
  },[dispatch])
  const { 
    saveToTreeError,contentCatalog
  } = useSelector(state=>{
    return state.sidebar
  });
  useEffect(() => {
    setCompareToProfile(calculateCompareToData(comparedProfile, type))
  }, [comparedProfile, type]);
  const profileDataCurrent = profilediv.current;
  const treeDivCurrent = treeDiv.current;
  const errorModal = () => {
    return  <TailwindModal 
    title={""} 
    showClose={true} 
    classes="top-2/4 left-2/4 transform  -translate-y-2/4 -translate-x-2/4"
    innerClasses="max-w-errModal"
    content={<Error modalState = {setShowErrorStoryDropdown} desc={getModalErrMsg(saveToTreeError)} btnText="Got it"/>} 
    showModal = {saveToTreeError && showErrorStoryDropdown}
    setShowModal = {setShowErrorStoryDropdown}/>
  }
  const dropModalHtml=()=>{
    return  <TailwindModal 
    title={"Save Record To My Tree"} 
    showClose={true} 
    classes="top-2/4 left-2/4 transform  -translate-y-2/4 -translate-x-2/4"
    innerClasses="max-w-sm"
    content={<STTForm handleSubmitForm = {
      (values) => {
        saveToTreeRecords(recordId, partitionKey, dispatch, values,profile, history, setShowErrorStoryDropdown);
        setShowStoryDropdown(false);
      }
    }/>} 
    showModal = {!showErrorStoryDropdown && showStoryDropdown}
    setShowModal = {setShowStoryDropdown}/>
  }
  useEffect(() => {
      handleResize(profilediv, treeDiv, clueValue, setScreenDropDown, treeFamily, profile, recordId);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [profileDataCurrent, treeDivCurrent, clueValue, treeFamily, compareTree, profile]);

  useEffect(() => {
    const handleIframeClickEvent = (e) => {
      handleIframeClick(e)(setSaveButton);
    }
    window.addEventListener('message', handleIframeClickEvent)
    return () => window.removeEventListener('message', handleIframeClickEvent)
  }, [])
  const getCompareHtml = () => {
    if (compareTree) {
      return <Compare compareToProfile={compareToProfile} profile={profile} />;
    } else {
      let returnHtml;
      switch(type) {
        case "census": 
            returnHtml = <ProfileData gotoRouter={gotoRouter} type={type} profile={profile} />;
            break;
        case "ssdi":
            returnHtml = <Ssdi type={type} profile={profile} />;
            break;
        case "newspaper":
            returnHtml = <Newspaper type={type} profile={profile} />;
            break;
        case "records":
            returnHtml=<RecordData type={type} profile={profile} />;
              break;
        default :
          returnHtml = null;
      }
      return returnHtml;
    }
  }
  const sourceTreeHtml = () => {
    if (compareTree === false) {
      const text = contentCatalog?.citation?.replace(/(\b(https?|ftp|file):\/\/[\-A-Z0-9+&@#\/%?=~_|!:,.;]*[\-A-Z09+&@#\/%=~_|])/img, '<a href="$1" target="_blank">$1</a>');
      return <div className="font-light text-gray-300 px-4 sm:px-3.5 mb-6 text-xs ">
        <span dangerouslySetInnerHTML={{__html: text}}></span>
      </div>
    } else {
      return null;
    }
  }
  const getCompareBoxHtml = () => {
    return comparedTo ? <CompareTo
    profile={compareToProfile}
    compareTree={compareTree}
    setCompareTree={setCompareTree}
    type={type} /> : <SaveTree treeFamily = {treeFamily}/>;
  }
  const getIframe = (item, _history) => {
    let html = null;
    if (item?.imageId) {
      html = (
        <div>
        <div
          onClick={() =>
            _history.push(`/records/${item.recordId}/${item.partitionKey}`)
          }
          className="thumb-wrap cursor-pointer flex items-center">
         <div className='thumb relative w-16 h-14 overflow-hidden'>
         <LazyLoadImage
            className="rounded-lg border border-gray-300 w-14 h-14 object-cover relative z-50 cursor-pointer"
            src={`https://imgapi.storied.com/StoriedThumbnail/${removeAtFromGuid(
              item.partitionKey
            )}/${item?.imageId}.jpg`}
            alt={"view records"}
          />
         </div>
         <div className='px-0'>
           <Typography size={14} weight="medium"><span className='text-white block bg-gray-600 rounded-lg px-7 py-3 ml-2'>View Image</span></Typography>         
         </div>
        </div>
        </div>
      );
    }
    return html;
  };
  const isProfileImage = () => {
    let html = "";
    if (!recordId) {
      html = (
        <div className="flex">
          {getIframe(profile, history)}
          <TreeButton
            treeDiv={treeDiv}
            scrollDiv={scrollDiv}
            screenDropDown={screenDropDown}
            text={"Save"}
            savedPerson={savedPerson}
            treeData={treeData}
            setShowStoryDropdown={setShowStoryDropdown}
            showStoryDropdown={showStoryDropdown}
          />
        </div>
      );
    } else {
      html = (
        <>
          {getCompareBoxHtml()}
          <div className={`flex px-4 sm:px-3.5 justify-end mt-6`}>
            <div className="inline-flex ">
              <div className="dd-button ml-1">
                <div className="relative inline-block text-left">
                  <TreeButton
                    treeDiv={treeDiv}
                    scrollDiv={scrollDiv}
                    screenDropDown={screenDropDown}
                    text={"Save"}
                    savedPerson={savedPerson}
                    treeData={treeData}
                    setShowStoryDropdown={setShowStoryDropdown}
                    showStoryDropdown={showStoryDropdown}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return html;
  };
  return <>
    <SideBardCloseButton 
        showSideBar = {showSideBar} 
        saveButton = {saveButton}
        showSideBarAction = {showSideBarAction}
        treeData = {treeData}
        savedPerson = {savedPerson}
        showStoryDropdown = {showStoryDropdown}
        setShowStoryDropdown = {setShowStoryDropdown}
    />
    <div className="mx-auto">
      {showSideBar && !recordId && <div className='overlay-table' onClick={() => showSideBarAction(false)}></div>}
      <div ref={scrollDiv} 
      className={`${className({"overflow-y-hidden overflow-x-hidden scrollbar-w-2 scrollbar-track-lighter scrollbar-thumb-rounded scrollbar-thumb bg-gray-700 fixed inset-0 max-w-sm top-14 md:top-16 ease-in-out duration-500 opacity-100 transition-all right-0 w-full left-auto z-50 sidebar-table": true,
      "-mr-96": !showSideBar})}`}>
        <div className="absolute inset-0 ">
          <section className="absolute inset-y-0 left-0 max-w-full h-full flex" aria-labelledby="slide-over-heading">
            <div className="relative w-screen  h-full">
              <div className={className({
                "absolute right-4 pt-6  pr-2 flex": true,
                "top-9": clueValue,
                "-top-1": !clueValue
              })}>
              </div>
              <div className="h-full flex flex-col pt-5 pb-6 bg-gray-700 shadow-xl text-white">
                {getClue(clueValue)}
                {isLoading ? <Loader /> :
                  Object.keys(profile).length > 0 && <div className="w-full">
                    <div className='w-full flex mb-5' >
                    <div className="flex w-full">
                            {!recordId && (
                              <>
                                <div className="ml-3 mr-2">
                                  <button
                                    disabled={prevNext?.prev}
                                    onClick={() => handlePrev()}
                                    className="disabled:opacity-50"
                                  >
                                    <svg
                                      width="32"
                                      height="32"
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
                                        fill="#555658"
                                      />
                                      <path
                                        d="M18.4308 21.4307L13.6668 16.6662C13.6359 16.6353 13.6113 16.5986 13.5946 16.5582C13.5778 16.5177 13.5692 16.4744 13.5692 16.4307C13.5692 16.3869 13.5778 16.3436 13.5946 16.3032C13.6113 16.2627 13.6359 16.226 13.6668 16.1951L18.4308 11.4307"
                                        stroke="white"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                </div>
                                <div>
                                  <button
                                    disabled={prevNext?.next}
                                    onClick={() => handleNext()}
                                    className="disabled:opacity-50"
                                  >
                                    <svg
                                      width="32"
                                      height="32"
                                      viewBox="0 0 32 32"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M32 8C32 3.58172 28.4183 0 24 0H8C3.58172 0 0 3.58172 0 8V24C0 28.4183 3.58172 32 8 32H24C28.4183 32 32 28.4183 32 24V8Z"
                                        fill="#555658"
                                      />
                                      <path
                                        d="M13.5692 21.4307L18.3332 16.6662C18.3641 16.6353 18.3887 16.5986 18.4054 16.5582C18.4222 16.5177 18.4308 16.4744 18.4308 16.4307C18.4308 16.3869 18.4222 16.3436 18.4054 16.3032C18.3887 16.2627 18.3641 16.226 18.3332 16.1951L13.5692 11.4307"
                                        stroke="white"
                                        strokeWidth="1.25"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                            <div className="ml-auto mr-3">
                              {type !== "ssdi" && isCloseBtn(showSideBarAction, showSideBar)}
                            </div>
                          </div>
                    </div>
                    <div className={className({"mx-auto max-w-md": getSidebarTypeClass(type)})}>
                      {getHeader(profile,type,contentCatalog)}
                      <div className={`overflow-y-auto overflow-x-hidden scrollbar-w-2 scrollbar-track-lighter scrollbar-thumb-rounded scrollbar-thumb  max-h-64 transform transition scale-auto`} ref={profilediv}>
                        {getCompareHtml()}
                        {sourceTreeHtml()}
                      </div>
                    </div>
                    <div className='border-t border-gray-600 pt-4'>
                      <div className='pt-1 pr-6 pl-6'>
                        {isProfileImage()}
                      </div>
                    </div>
                  </div>
                  }
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
    {dropModalHtml()}
    {errorModal()}
  </>
}
Sidebar.propTypes = {
  profile: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  clue: PropTypes.bool,
};

Sidebar.defaultProps = {
  profile: {},
  clue: true
}
export default Sidebar;