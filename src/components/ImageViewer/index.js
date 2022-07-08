import React,{useEffect, useState, useCallback} from 'react';
import {
    useLocation, 
    useParams
} from 'react-router-dom'
import queryString from 'query-string';
import SidebarComponent from './../Sidebar';
import {useDispatch,useSelector} from 'react-redux'
import {newspaper,ssdi,census, getTrees} from './../../redux/actions/sidebar';
import { getRelationsDataFormat,newspaperDataFormat } from "./../utils"

const getPathString=(location,household,householdId,dispatch)=>{
    let pathArr=location.pathname.split('/');
        pathArr.shift();
        let dataPath={},pathString=pathArr[0]?.toLowerCase();
            if(pathString==='ssdi'){
                dataPath.api_path=pathArr.join('/');
                    dispatch(ssdi(dataPath))
            }else if(pathString==='newspaper'){
                let api_url=`${pathArr[0]}/${pathArr[1].replace(/-/g,' ')}/${pathArr[2]}/${pathArr[3].slice(2)}`;
                    dataPath.api_path=api_url
                dispatch(newspaper(dataPath))
            }else if(pathString==='census'){
                dataPath.api_path = "census/"+household+"/"+householdId;
                    dispatch(census(dataPath))
            }else if(pathString==='ut'){
                dataPath.api_path=pathArr.join('/')
                    dispatch(census(dataPath))
            }
          return  pathString;
}

const ImageViewer = (props) => {
    const { household, householdId } = useParams();
    const [type, setType] =  useState("");
    const [savedPerson, setSavedPerson] =  useState("");
    const [treeData, setTreeData] =  useState(null);
    const [showSideBar, setShowSideBar] = useState(true);
    const [clueValue,setClueValue]=useState(false)
    const dispatch=useDispatch()
    const location=useLocation();
    const srcUrl='https://imgwrapper.storied.com/'
    const [srcState, setSrcState] =  useState(false);
    const [data, setData] =  useState(false);
    const {
        isLoading,
        census:censusData, 
        ssid:ssdiData,
        newspaper:newspaperData,
        comparedTo, 
        comparedProfile
    } = useSelector(state=>{
        return state.sidebar
    });
    const {
        userAccount
    } = useSelector(state=>{
        return state.user
    });
    useEffect(()=>{
        if (userAccount) {
            dispatch(getTrees(userAccount.id));
        }
    }, [dispatch, userAccount])
    const handleData=useCallback(()=>{

        let pathString=getPathString(location,household,householdId,dispatch)
        
        setType(pathString);
    },[householdId, dispatch, household, location])
    const handleIframeURL = useCallback((ssdidata) => {
        let pathArr=location.pathname.split('/');
        pathArr.shift();
        let src = srcUrl;
        let formatedData,pathString=pathArr[0]?.toLowerCase(),
            cencusString=val=>`${censusData[val].replace(/\s+/g, '-').toLowerCase()}/`,
            calculateSrcString=str=>{
                str+=cencusString('state')
                str+=cencusString('county')
                str+=cencusString('township')
                str+=cencusString('district')
                str+=cencusString('batchName')
                str+=cencusString('imageName')
                return str
            };
            if(pathString==='ssdi'){
                formatedData=ssdidata
                src+=pathArr.join('/')
            }else if(pathString==='newspaper'){
                formatedData=newspaperDataFormat(newspaperData)
                pathArr.shift();
                src+=pathArr.join('-')
            }else if(['census','ut'].includes(pathString) 
                && censusData){
                formatedData = getRelationsDataFormat(censusData);        
                src=calculateSrcString(src)
            } 
            if(formatedData){
                setData(formatedData);
                setSavedPerson(formatedData.name);
                 setTreeData(formatedData.treeData)
            }
            setSrcState(src)
    },[location.pathname, censusData, newspaperData])
    useEffect(() => {
        let query=queryString.parse(location.search);
            setClueValue(query?.clue?.toUpperCase())
        handleData()
    }, [householdId, handleData, location.search])
    useEffect(() => {
        handleIframeURL(ssdiData)
    }, [censusData, ssdiData, newspaperData, handleIframeURL])
    const gotoRouter = (Item) => {
        let dataPath = {};
        dataPath.api_path = "census/"+household+"/"+householdId+"/"+Item.id;
        dispatch(census(dataPath))
    }
    
   const showSideBarAction =()=>{
        setShowSideBar(prevState=>!prevState)
   }
    return <>
    <div className={`w-full transform transition scale-auto`}>
    
            <SidebarComponent 
                isLoading={isLoading}
                profile = {data}
                clueValue={clueValue} 
                comparedTo={comparedTo} 
                comparedProfile={comparedProfile} 
                showSideBar={showSideBar} 
                showSideBarAction={showSideBarAction} 
                type ={type}
                savedPerson = {savedPerson}
                treeData = {treeData}
                gotoRouter = {gotoRouter}
            />
            <div className={`h-full transition-all duration-500 ${showSideBar?"ml-96":""}`}>
            {srcState?<iframe src={srcState} height={"100%"} width={"100%"} title="Iframe Image"></iframe>:null}
            </div>
    </div>
    </>
}
export default ImageViewer;