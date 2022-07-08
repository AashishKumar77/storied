import React, { useState, useRef, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Title from './title';
import Person from './person';
import Category from './category';
import "./index.css";
import { getRecentTree, getOwner,isUserOwner } from "../../../../services";
import { getTreesListAsync } from '../../../../redux/actions/homepage'
import Button from "./../../../../components/Button"
import { v4 as uuidv4 } from "uuid";
import { addMessage } from "../../../../redux/actions/toastr";
import { addStory, viewStory, editStory } from "../../../../redux/actions/story"
import Error from './../../../../components/Sidebar/Components/Error';
import TailwindModal from './../../../../components/TailwindModal';
import ErrImg from './../../../../assets/images/fileErr.svg'
import Loader from './../../../../components/Loader';
import PermissionCard from './../../../../components/PermissionCard';
import {
    refetchPersonBasicInfo,
} from "./../../../../redux/actions/person";
import {getMedia} from './../../../../redux/actions/media'
import { getLayoutAspect, LAYOUT_ID, getWidgetOption, getImageSize, getScreen, getWindowWidth } from '../../../../utils'
const getTreeRedirect = (treeId, primaryPersonId) => {
    return !treeId && !primaryPersonId 
}
const getRound = (mediaSize, width, height) => {
    let round1 = 0, round2 = 0;
    
    round1 = Math.round(mediaSize.width / width * 100) / 100
    round2 = Math.round(mediaSize.height / height * 100) / 100
    return Math.min(round1, round2)
}

const isCropFn = (mediaSize, layoutFit) => {
    return layoutFit && mediaSize.width > layoutFit.width && mediaSize.height > layoutFit.height
}
const onMediaLoaded = (mediaSize, layout, layoutFit) => {
    let round = 0
    let isCrop = false;
    if ([LAYOUT_ID.FILL].includes(layout)) {
        round = getRound(mediaSize, 750, 1050)
        isCrop = isCropFn(mediaSize, layoutFit)
    } else if ([LAYOUT_ID.SQUARE].includes(layout)) {
        round = getRound(mediaSize, 600, 600)
        isCrop = isCropFn(mediaSize, layoutFit)
    } else if ([LAYOUT_ID.TWO_IMAGE].includes(layout)) {
        round = getRound(mediaSize, 600, 430)
        isCrop = isCropFn(mediaSize, layoutFit)
    }
    return { maxZoom: round, isCrop: isCrop }
}
const getFileCurrent = (selectedFile, MviewSaveBtnFile, MviewSaveBtn) => {
    return MviewSaveBtn?[...MviewSaveBtnFile]:[...selectedFile]
}
const isSaveDisable = (layoutIdS, MviewSaveBtnFile) => {
    return layoutIdS === LAYOUT_ID.TWO_IMAGE && !MviewSaveBtnFile[1].mediaId
 }
const fileMediaData = (formData, file, index, values, orderNumber, currentIndex, name="storyImages") => {
    if (file.mediaId) {
        formData.append(`${name}[${currentIndex}].OriginatingMediaId`, file.mediaId);
        formData.append(`${name}[${currentIndex}].mediaId`, file.mediaId);
        formData.append(`${name}[${currentIndex}].orderNumber`, orderNumber);
        file.file && formData.append(`${name}[${currentIndex}].media`, file.file);
        file.imageURL && formData.append(`${name}[${currentIndex}].url`, file.imageURL);
            currentIndex+=1
        if (file.mediaObj[values.layoutId]) {
            file.mediaObj[values.layoutId].croppedImageURL && formData.append(`${name}[${currentIndex}].croppedImageURL`, file.mediaObj[values.layoutId].croppedImageURL);
        }
        if (file.mediaObj[values.layoutId]) {
            file.mediaObj[values.layoutId].file && formData.append(`${name}[${currentIndex}].media`, file.mediaObj[values.layoutId].file);
            formData.append(`${name}[${currentIndex}].OriginatingMediaId`, file.mediaObj[values.layoutId].OriginateMediaId)
            formData.append(`${name}[${currentIndex}].orderNumber`, orderNumber);
            formData.append(`${name}[${currentIndex}].mediaId`, file.mediaObj[values.layoutId].MediaId)
            formData.append(`${name}[${currentIndex}].croppingInfo.cropX`, file.mediaObj[values.layoutId].cropCordinates.x)
            formData.append(`${name}[${currentIndex}].croppingInfo.cropY`, file.mediaObj[values.layoutId].cropCordinates.y)
            formData.append(`${name}[${currentIndex}].croppingInfo.height`, file.mediaObj[values.layoutId].cropCordinates.height)
            formData.append(`${name}[${currentIndex}].croppingInfo.width`, file.mediaObj[values.layoutId].cropCordinates.width)
            formData.append(`${name}[${currentIndex}].croppingInfo.ZoomAspect`, file.mediaObj[values.layoutId].zoomLevel)
            currentIndex+=1
        }
    }
    return currentIndex
}
const peopleStory = (formData, existingPeople, currentPeople) => {
    currentPeople.forEach((_person, index)=>{
        formData.append(`NewPeopleInStory[${index}].ContributorId`, _person.treeId)
        formData.append(`NewPeopleInStory[${index}].PersonId`, _person.id)
    })
}
const categoryStory = (formData, existingCategory, currentCategory) => {
    currentCategory.forEach((_category, index)=>{
        formData.append(`NewStoryCategories[${index}]`, _category)
    })
}
const placeStory = (formData, current) => {
    formData.append(`NewLocationId`, current.id)
    formData.append(`NewLocation`, current.name)
}
const singleValueStory = (formData, current, name) => {
    formData.append(`${name}`, current)
}
const imagesStory = (formData, existingImages, currentImages, values) => {
    let currentIndex = 0,
    isDeleted = existingImages.filter(({ mediaId: id1 }) => !currentImages.some(({ mediaId: id2 }) => id2 === id1));
    currentImages.forEach((_image, index)=>{
        currentIndex = fileMediaData(formData, _image, index, values, (index+1), currentIndex, 'NewStoryImages')
    })
    isDeleted.forEach((element, index) => {
        formData.append(`${'RemovedImages'}[${index}].mediaId`, element.mediaId)
        formData.append(`${'RemovedImages'}[${index}].IsCropped`, element.mediaId !== element.originatingMediaId)
    });
}
const getPlaceId = (placeId) => {
    return (placeId!=="00000000-0000-0000-0000-000000000000")?placeId:""
}
const storyCategoryAppend =(formData, values)=>{
    if (values.storyCategories) {
        values.storyCategories.forEach((_category, index) => {
            formData.append(`storyCategories[${index}]`, _category)
        })
    } else {
        formData.append("storyCategories", [])
    }
}
const handlesubmit = ({ values, props, files,mediaId, dispatch, history, treeId, personId, setSubmitting, storyId, view, refType }) => {
    let formData = new FormData();
    if( storyId ) {
        formData.append("storyId", storyId);
        formData.append("authorId", view.authorId)
        formData.append("privacy", values.privacy)
        values.person[0]?.id && formData.append("NewPrimaryPersonId", values.person[0]?.id)
        peopleStory(formData, view.personDetail, values.person)
        categoryStory(formData, view.storyCategories, values.storyCategories)
        placeStory(formData, values.place)
        singleValueStory(formData, values.title, 'NewTitle')
        singleValueStory(formData, values.date, 'NewDate')
        singleValueStory(formData, values.layoutId, 'NewLayoutId')
        singleValueStory(formData, values.content, 'NewContent')
        imagesStory(formData, view.storyImages, files, values)
        dispatch(editStory(formData, history, treeId, personId, setSubmitting, refType))
    } else {
        formData.append("privacy", values.privacy || "Public")
        formData.append("storyId", uuidv4());
        formData.append("title", values.title);
        formData.append("authorId", getOwner())
        values.person[0]?.id && formData.append("PrimaryPersonId", values.person[0]?.id)
        if (values.place?.id) {
            formData.append("locationId", values.place.id);
            formData.append("location", values.place.name);
        } else if (values.place.name) {
            formData.append("location", values.place.name);
        }
        formData.append("date", values.date);
        formData.append("content", values.content);
        formData.append("layoutId", values.layoutId || LAYOUT_ID.DEFAULT);
        storyCategoryAppend(formData,values)
        if (values.person) {
            values.person.forEach((_person, index) => {
                formData.append(`peopleInStory[${index}].ContributorId`, _person.treeId)
                formData.append(`peopleInStory[${index}].PersonId`, _person.id)
            })
        } else {
            formData.append("peopleInStory", [])
        }

        if (files) {
            
            let currentIndex = 0;
            files.forEach((file, index) => {
                currentIndex = fileMediaData(formData, file, index, values, (index+1), currentIndex)
            })
        } else {
            formData.append("storyImages", [])
        }
        dispatch(addStory(formData, history, treeId, personId, setSubmitting, refType,mediaId))
    }
}
const getWidget = ({ step, setStep, formik, selectedFile, setMviewSaveBtn, setSelectedFile, handleSaveImages, fileInputRef, setValidSelectedFile, MviewSaveBtn,ipadView,setIpadView, MviewSaveBtnFile, setMviewSaveBtnFile, layoutIdS, setLayoutIdS, setValidSelectedFileObj , treeProfileId}) => {
    switch (step) {
        case 1:
            return <Field  treeProfileId = {treeProfileId} component={Person} setStep={setStep} name="person" handleSaveImages={handleSaveImages} />
        case 2:
            return <Category setStep={setStep} formik={formik} />
        default:
            return <Title onMediaLoaded={onMediaLoaded} MviewSaveBtn={MviewSaveBtn} ipadView={ipadView} setIpadView={setIpadView} setMviewSaveBtn={setMviewSaveBtn} setValidSelectedFile={setValidSelectedFile} layoutIdS={layoutIdS} setLayoutIdS={setLayoutIdS} selectedFile={MviewSaveBtn?MviewSaveBtnFile:selectedFile} setSelectedFile={setSelectedFile} formik={formik} setStep={setStep} fileInputRef={fileInputRef} handleSaveImages={handleSaveImages}  MviewSaveBtnFile = {MviewSaveBtnFile} setMviewSaveBtnFile={setMviewSaveBtnFile} setValidSelectedFileObj = {setValidSelectedFileObj}/>
        //getTitleComp({selectedFile,setSelectedFile,formik,setStep,fileInputRef, setValidSelectedFile, handleSaveImages})

    }
}

const backRedirect = ({step, setStep, history, mediaId,ipadView,setIpadView, MviewSaveBtn, setMviewSaveBtn, setMviewSaveBtnFile, setValidSelectedFile, selectedFile, refType}, { treeId, primaryPersonId }) => {
    if(ipadView) {
        setIpadView(false)
    } else if(MviewSaveBtn) {
        setMviewSaveBtn(false)
        setMviewSaveBtnFile([{}, {}])
    }
    else{
    switch (step) {
        case 1:
            setStep(0)
            break;
        case 2:
            setStep(1)
            break;
        default:
            let url = getTreeRedirect(treeId, primaryPersonId)? '/':`/family/person-page/${treeId}/${primaryPersonId}?tab=0`
            if(refType === "1") {
                url = '/stories'
            }else if(refType==='4' && mediaId){
                url=`/media/view-image/${mediaId}`
            }
            history.push(url)
    }
}
}
const buttonVaildIpad = (formikProp, currentLayout, file) => {
    let vaild = false
    if (formikProp?.values?.ModalTitle && formikProp?.values?.ModalContent) {
        vaild = true
    }
    if (formikProp?.values?.ModalContent.length > 1000) {
        vaild = false
    }
    if (currentLayout === LAYOUT_ID.TWO_IMAGE && !file[1].mediaId) {
        vaild = false
    }
    return vaild
}
const buttonVaild = (formikProp, currentLayout, file) => {
    let vaild = false
    if (formikProp?.values?.title && formikProp?.values?.content) {
        vaild = true
    }
    if (formikProp?.values?.content.length > 1000) {
        vaild = false
    }
    if (currentLayout === LAYOUT_ID.TWO_IMAGE && !file[1].mediaId) {
        vaild = false
    }
    return vaild
}

const getMobileViewBtn = (step, setStep, formik, selectedFile,ipadView,setIpadView,ViewCond) => {
    let btn = <div></div>;
    if (step === 0 ) {
        if(ipadView){
            btn = <Button
            handleClick={() => {
                const {ModalTitle, ModalPlace, ModalDate, ModalContent} = formik.values
                formik.setFieldValue("title", ModalTitle)
                formik.setFieldValue("place", ModalPlace)
                formik.setFieldValue("date", ModalDate)
                formik.setFieldValue("content", ModalContent)
                setIpadView(false)
            }}
            disabled={!buttonVaildIpad(formik, formik.values.layoutId, selectedFile)}
            size="large"
            title="Save"
        />
        }else{
            btn = <Button
            handleClick={() => setStep(1)}
            disabled={!buttonVaild(formik, formik.values.layoutId, selectedFile)}
            size="large"
            title="Next"
        />
        }
        
    }
    return btn
}
const isLoadingFn = (storyId, isLoading) => {
    if( storyId ) {
        return isLoading
    } 
    return false
}
const getPersonDetail = (data, personalInfo, primaryPersonId) => {
    let personArr = data.personDetail
    if( primaryPersonId ) {
        personArr =  data.personDetail.map((_person)=>{
            if(personalInfo?.id === _person.id) {
                _person['defaultPerson']= true
            }
            return _person
        })
    }
    return personArr
}
const setFileStatus = ({setValidSelectedFile, _files, setIsLoading, lengthSto, index, _initialValues, setInitialValues}) => {
    if((lengthSto-1)===index){
        setValidSelectedFile(_files)
        setIsLoading(false)  
        if(_initialValues.layoutId === LAYOUT_ID.TWO_IMAGE && _files.length===0) {
            _initialValues.layoutId = LAYOUT_ID.DEFAULT
        }
        setInitialValues(_initialValues)
    }
}
const loadImages = ({selectedFile, data, setIsLoading, setValidSelectedFile,  _initialValues, setInitialValues}) => {
    let _files =  [...selectedFile]
    if(data.url){
        data.storyImages=[{
            croppingInfo: null,
            mediaId: data.originatingMediaId,
            orderNumber: 1,
            originatingMediaId: data.originatingMediaId,
            url:data.url,
            fromMedia:true
        }
        ]
    }
    if(data?.storyImages?.length === 0) {
        setIsLoading(false)  
        setInitialValues(_initialValues)
    }
    data.storyImages.forEach((file, index)=>{
        let img = new Image();
        img.src = file.url;
        img.onerror = () => {
            setFileStatus({setValidSelectedFile, _files, setIsLoading, lengthSto:data.storyImages.length, index,  _initialValues, setInitialValues})
        }
        img.onload = () => {
            let layout = data.layoutId
            let calculateImageSize = { calculate: {} }
            const { width, height, widthActual, heightActual } = getImageSize(img.naturalWidth, img.naturalHeight, layout, getScreen())
            calculateImageSize.calculate = {
                width: width,
                height: height,
                widthActual: widthActual,
                heightActual: heightActual
            }
            if( file.croppedImageURL && file.croppingInfo ) {
                let imgCrop = new Image();
                imgCrop.src = file.croppedImageURL ;
                const { width:_width, height:_height, widthActual:_widthActual, heightActual:_heightActual } = getImageSize(imgCrop.naturalWidth, imgCrop.naturalHeight, layout, getScreen())
                imgCrop.onload = () => {
                    calculateImageSize[layout] = {}
                    calculateImageSize[layout].calculate = {
                        width: _width,
                        height: _height,
                        widthActual: _widthActual,
                        heightActual: _heightActual
                    }
                }
            }
            const {
                maxZoom,
                isCrop
            } = onMediaLoaded({ height: img.naturalHeight, width: img.naturalWidth }, layout, getLayoutAspect(layout))
            _files[index] = {
                maxZoom: maxZoom,
                isCrop: isCrop,
                file: null,
                url: img.src,
                ...calculateImageSize,
                imageURL: file.url,
                
                ...file.croppedImageURL?{croppedImageURL: file.croppedImageURL}:{},
                cropCordinates: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
                mediaObj: {
                    ...file.croppedImageURL && file.croppingInfo?{
                        [layout]: {
                            url: file.croppedImageURL,
                            file: null,
                            zoomLevel: file.croppingInfo.zoomAspect,
                            cropCordinates: {x:file.croppingInfo.cropX, y:file.croppingInfo.cropY, height: file.croppingInfo.height, width: file.croppingInfo.width},
                            crop: {x: img.naturalWidth-(2*file.croppingInfo.cropX+file.croppingInfo.width), y: img.naturalHeight-(2*file.croppingInfo.cropY+file.croppingInfo.height)}
                        }
                    }:{}
                },
                height: img.naturalHeight,
                width: img.naturalWidth,
                mediaId: file.mediaId,
            }
            setFileStatus({setValidSelectedFile, _files, setIsLoading, lengthSto: data.storyImages.length, index,  _initialValues, setInitialValues})
    }})
}
const setinitialDataState=({data,setInitialValues,selectedFile,setIsLoading,setValidSelectedFile,personalInfo,primaryPersonId})=>{
    let img = new Image();
    img.src=data.url
    img.onload=()=>{
       let layout= setLayoutObj(null,img)
       data.layoutId=layout
    }
    const placeId = getPlaceId(data?.mediaMetaData?.locationId);
    let _initialValues = {
        storyId: uuidv4() ,
        authorId: data.ownerId,
        title: data?.mediaMetaData?.title ,
        placeId: placeId,
        date: (data?.mediaMetaData?.date?.rawDate)||"",
        content: "",
        storyCategories: [],
        person: [],
        layoutId:data.layoutId,
        place: { id: placeId, name: data?.mediaMetaData?.location||"" },
        privacy: "Public"
    }
    setInitialValues(_initialValues)
    loadImages({selectedFile, data, setIsLoading, setValidSelectedFile, _initialValues, setInitialValues})
}
const viewStoryProp = ({personalInfo, primaryPersonId, storyId,mediaId, dispatch, setInitialValues, setIsLoading, setValidSelectedFile, selectedFile}) => {
    (!personalInfo && primaryPersonId) && dispatch(refetchPersonBasicInfo(primaryPersonId))
    if(  storyId && ( personalInfo || !primaryPersonId)) {
        dispatch(viewStory({ storyId })).then((data)=>{
            const placeId = getPlaceId(data.locationId)
            let _initialValues = {
                storyId: data.storyId ,
                authorId: data.authorId,
                title: data.title ,
                placeId: placeId,
                date: (data.date)?data.date:"",
                content: data.content,
                layoutId: data.layoutId,
                storyCategories: data.storyCategories,
                person: getPersonDetail(data, personalInfo, primaryPersonId),
                place: { id: placeId, name: data.location?data.location:"" },
                privacy: data.privacy
            }
            setInitialValues(_initialValues)
            loadImages({selectedFile, data, setIsLoading, setValidSelectedFile, _initialValues, setInitialValues})
        })
    } else if(mediaId &&(personalInfo|| !primaryPersonId)){
        dispatch(getMedia(mediaId)).then((data)=>{
            setinitialDataState({data,setInitialValues,selectedFile,setIsLoading,setValidSelectedFile})
        })
    }else if(!storyId || !mediaId) {
        setIsLoading(false)  
    }
}
const setLayoutObj = (layout, img)=>{
    if (!layout || layout === LAYOUT_ID.DEFAULT) {
        layout = getWidgetOption({ height: img.naturalHeight, width: img.naturalWidth })
        layout = LAYOUT_ID.FIT in layout ? LAYOUT_ID.FIT : LAYOUT_ID.FILL
    }
    return layout
}
const setSelectedFilefn = ({file, index, currentLayout, formik, setShowErrorModal, setValidSelectedFile, erroModalmsgs, selectedFile, setMviewSaveBtn, setIpadView, setMviewSaveBtnFile, MviewSaveBtnFile}) => {
    if (file) {
        const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
        var sizeInMb = file.size / 1024;
        var sizeLimit = 1024 * 10; // if you want 10 MB
        if (!acceptedImageTypes.includes(file['type'])) {
            erroModalmsgs.current.msg = "Invaild File Type"
            erroModalmsgs.current.desc = "The image you're trying to use must be smaller than 10 MB. Resize your image or choose a different one."
            setShowErrorModal(true);
        } else if (sizeInMb > sizeLimit) {
            erroModalmsgs.current.msg = 'Image Is Too Large'
            erroModalmsgs.current.desc = "Images must be JPGs or PNGs. Maximum file size: 10 MB"
            setShowErrorModal(true);
        } else {
            let img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
                let layout = currentLayout
                layout = setLayoutObj(layout, img)
                formik.setFieldValue("imageChange", true)
                let calculateImageSize = { calculate: {} }
                const { width, height, widthActual, heightActual } = getImageSize(img.naturalWidth, img.naturalHeight, layout, getScreen())
                calculateImageSize.calculate = {
                    width: width,
                    height: height,
                    widthActual: widthActual,
                    heightActual: heightActual
                }
                const {
                    maxZoom,
                    isCrop
                } = onMediaLoaded({ height: img.naturalHeight, width: img.naturalWidth }, layout, getLayoutAspect(layout))
                let obj = {
                    maxZoom: maxZoom,
                    isCrop: isCrop,
                    file: file,
                    url: img.src,
                    ...calculateImageSize,
                    cropCordinates: { x: 0, y: 0, width: img.naturalWidth, height: img.naturalHeight },
                    mediaObj: {
                    },
                    height: img.naturalHeight,
                    width: img.naturalWidth,
                    mediaId: uuidv4(),
                }
                
                if( getWindowWidth() <= 1023  ) {
                    let objarray = [...MviewSaveBtnFile]
                    objarray[index] = obj
                    setIpadView(false)
                    setMviewSaveBtn(getWindowWidth() <= 1023, layout, true)
                    setMviewSaveBtnFile(objarray)
                } else {
                    let objarray = [...selectedFile]
                    objarray[index] = obj
                    setValidSelectedFile(objarray)
                    formik.setFieldValue("layoutId", layout)
                }
            }
        }
    }
}
const redirectToHome=async ({history, treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount, setIsLoading, setTreeId, dispatch})=>{
    if(getTreeRedirect(treeId, primaryPersonId) &&  !treeIdUser && !primaryPersonIdUser ) {
        setIsLoading(true) ; 
        const trees = await getTreesListAsync(userProfileAccount.id)
        setIsLoading(false); 
        if(trees.length) {
            setTreeId(trees[0].treeId)
        } else {
            dispatch(addMessage("Default tree has not been selected", "error"));
            history.push(`/`);
        }
    } 
}
const setMviewSaveBtnFileCond = (state, MviewSaveBtn, setMviewSaveBtnFile, selectedFile) => {
    (!state && !MviewSaveBtn) && setMviewSaveBtnFile(selectedFile)
}
const _handleValidate = (e,step) => {
    if (step !== 2 && e.key === 'Enter') {
       e.preventDefault();
    }
}
const AddStories = () => {
    const dispatch = useDispatch()
    const history = useHistory()
    const { view } = useSelector(state => state.story)
    const { userProfileAccount } = useSelector(state => state.user);
    const { storyId, treeId, primaryPersonId, refType,mediaId } = useParams();
    
    useEffect(()=>{
        const obj = getRecentTree()
        let treeIdUser = null
        let primaryPersonIdUser = null
        if( obj ) {
            treeIdUser = obj.treeId
            setTreeId(treeIdUser)
            primaryPersonIdUser = obj.primaryPersonId
        }
        userProfileAccount && redirectToHome({history, treeId, primaryPersonId, treeIdUser, primaryPersonIdUser, userProfileAccount,setIsLoading, setTreeId, dispatch})
    },[treeId, primaryPersonId, userProfileAccount])
    const [ isLoading, setIsLoading ] = useState(true)
    const [step, setStep] = useState(0);
    const [selectedFile, setValidSelectedFileObj] = useState([{}, {}]);
    const [showErrorModal, setShowErrorModal] = useState(false)
    const erroModalmsgs = useRef({ msg: "", desc: "" });
    const fileInputRef = useRef()
    const [treeProfileId, setTreeId] = useState(null)
    const [MviewSaveBtn, setMviewSaveBtnBool] = useState(false)
    const [MviewSaveBtnFile, setMviewSaveBtnFile] = useState([{}, {}])
    const [layoutIdS, setLayoutIdS] = useState(null)
    const [ipadView,setIpadView]=useState(false)
    const [initialValues, setInitialValues] = useState({
        storyId: "",
        authorId: "",
        title: "",
        placeId: "",
        date: "",
        content: "",
        layoutId: "",
        storyCategories: [],
        person: [],
        place: { id: "", name: "" },
        imageChange: false,
        privacy:""
    })

    const {
        personalInfo
    } = useSelector(state => {
        return state.person
    });
    useEffect(() => {
        viewStoryProp({personalInfo, primaryPersonId, storyId,mediaId, dispatch, setInitialValues, setIsLoading, setValidSelectedFile, selectedFile:[{}, {}]})
    }, [dispatch, personalInfo, primaryPersonId, storyId,mediaId])
    const setMviewSaveBtn = (data, layout=null, state=false) => {
        if(data) {
            setLayoutIdS(layout);
            setMviewSaveBtnFileCond(state, MviewSaveBtn, setMviewSaveBtnFile, selectedFile)
        } else {
            setMviewSaveBtnFile([{}, {}])
            setLayoutIdS(null)
        }
        setMviewSaveBtnBool(data)
    }
    const _handlesubmit = (values, props) => {
        handlesubmit({ refType, values,mediaId, props, files: selectedFile, dispatch, history, treeId, personId: primaryPersonId, setSubmitting: props.setSubmitting, storyId, view});
    }
    const setSelectedFile = (file, index, currentLayout, formik) => {
        setSelectedFilefn({file, index, currentLayout, formik, setShowErrorModal, setValidSelectedFile, erroModalmsgs, selectedFile, setMviewSaveBtn, setIpadView, setMviewSaveBtnFile, MviewSaveBtnFile})
    }
    const setValidSelectedFile = (data) => {
        if( MviewSaveBtn ) {
            setMviewSaveBtnFile(data)
        } else {
            setValidSelectedFileObj(data)
        }
    }
    const handleSaveImages = (file, fileurl, index, cropSettings, _layout, formik) => {
        let objarray = getFileCurrent(selectedFile, MviewSaveBtnFile, MviewSaveBtn)
        objarray[index].mediaObj[_layout] = {
            OriginateMediaId: objarray[index].mediaId,
            MediaId: cropSettings.MediaId || uuidv4(),
            url: fileurl,
            file: file,
            zoomLevel: cropSettings.zoomLevel,
            cropCordinates: cropSettings.cropCordinates,
            crop: cropSettings.crop,
            calculate:cropSettings.calculate
        }
        if( MviewSaveBtn ) {
            setMviewSaveBtnFile(objarray)
        } else {
            setValidSelectedFile(objarray)
            formik.setFieldValue("imageChange", true)
        }
    }
    const getButton = (formik) => {
        if( MviewSaveBtn ) {
            return <Button
            handleClick={() => {
                setMviewSaveBtn(false)
                setValidSelectedFileObj(MviewSaveBtnFile)
                setMviewSaveBtnFile([{}, {}])
                formik.setFieldValue("layoutId", layoutIdS)
            }}
            size="large"
            disabled={isSaveDisable(layoutIdS, MviewSaveBtnFile)}
            title="Save"
        />
        }
        return getMobileViewBtn(step, setStep, formik, selectedFile,ipadView,setIpadView)
    }
    const pageHtmml=()=>{
       let PermissionCond=false;
       if(storyId){
           if(!isUserOwner(view.authorId)){
            PermissionCond=true
           }
       }
        return PermissionCond?<PermissionCard/>:<Formik
        initialValues={initialValues}
        onSubmit={_handlesubmit}
        enableReinitialize = {true}
    >
        {formik => {
            return <><div className="page-wrap-bg-dk story-page-wrap">
                <Form onSubmit={formik.handleSubmit} onKeyDown={(e) => _handleValidate(e,step)}>
                    <div className="relative main-wrapper mx-auto pt-8">
                        <div className="buton-wrap-top">
                            <button onClick={() => backRedirect({step,mediaId, setStep, history, ipadView, setIpadView,MviewSaveBtn, setMviewSaveBtn,selectedFile, setValidSelectedFile, MviewSaveBtnFile, setMviewSaveBtnFile, refType}, { treeId, primaryPersonId })} type="button" className="bg-gray-100 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
                                <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.5 8L1.5 8" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M8.5 1L1.5 8L8.5 15" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <div className="lg:hidden">
                                {getButton(formik)}
                            </div>
                        </div>
                        <div className="page-box-wrap flex w-full justify-center">
                            {getWidget({ step, setStep, formik, selectedFile, setSelectedFile, handleSaveImages, fileInputRef, setValidSelectedFile, MviewSaveBtn, setMviewSaveBtn,ipadView,setIpadView, MviewSaveBtnFile, setMviewSaveBtnFile, layoutIdS, setLayoutIdS, setValidSelectedFileObj, treeProfileId })}
                        </div>
                    </div>
                </Form>
            </div>
                <TailwindModal title={""}
                    showClose={true}
                    classes="top-2/4 left-2/4 transform  -translate-y-2/4 -translate-x-2/4"
                    innerClasses="max-w-errModal"
                    content={<Error modalState={setShowErrorModal} imgs={ErrImg} msg={erroModalmsgs.current.msg} btnText="Change Image" desc={erroModalmsgs.current.desc} />}
                    showModal={showErrorModal}
                    setShowModal={setShowErrorModal} />
            </>
        }}
    </Formik>
    }
    return isLoadingFn(storyId, isLoading)?<Loader />:pageHtmml()
}

export default AddStories;