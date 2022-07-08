/* eslint no-eval: 0 */
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import MyDrawer from "../../src/components/Drawer/index";
import _ from "lodash";
import {setZoomReset} from "../pages/FamilyPage";
import * as services from "../services"
import Actions from "../components/D3/Actions";

// Actions
import {
  clearFamily,
  updateFamily,
  refetchFamily,
  addProfileImage,
  saveParentsViaPlaceHolders,
  showImage,
  clearImage,
  getRepresentInfo,
  getNextGenFamily
} from "../redux/actions/family";
import { setProfileImage } from "../redux/actions/user";

// Components
import D3 from "../components/D3";
import ImageCropper from "../components/ImageCropper";
import InvalidFile from "../components/InvalidFile";
import Loader from "../components/Loader";

// Utils
import { getOwner } from "../services";

const PedigreeViewPage = ({
  family: {
    family,
    refetchTree,
    profileImageAdded,
    imageLoading,
    parentsAdded,
    parentAddedViaPlaceholder,
    showImageCropper,
    treePersonOptions,
  },
  user: { imgSrc, userId, imageUploaded},
  dispatchClearFamily,
  dispatchSetProfileImage,
  dispatchUpdateFamily,
  dispatchRefetchFamily,
  dispatchAddProfileImage,
  refetchAfterParentsAdded,
  dispatchShowImage,
  dispatchClearImage,
  dispatchSaveParentsViaNodes,
  dispatchGetRepresentInfo,
  dispatchGetNextGenFamily,
  ...props
}) => {
  const { treeId, primaryPersonId, level } = useParams();
  const fileObject = {
    x: 0,
    y: 0,
    zoom: 1,
    userID: '',
  }
  const [selectedFile, setSelectedFile] = useState(fileObject);
  const [imageFile, setImageFile] = useState(null);
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    return () => {
      dispatchClearFamily();
    };
  }, [dispatchClearFamily]);

  useEffect(() => {
    if (profileImageAdded) {
      setSelectedFile(null);
      setImageFile(null);
      dispatchRefetchFamily(treeId, primaryPersonId, level);
    }
    if (imgSrc === ""){
      dispatchSetProfileImage(userId)
    }
  }, [profileImageAdded, setSelectedFile, dispatchRefetchFamily, treeId, primaryPersonId, level, imgSrc, userId, dispatchSetProfileImage]);

  useEffect(() => {
    if (!showImageCropper) {
      setSelectedFile(null);
      setImageFile(null);
    }
  }, [setSelectedFile, setImageFile, showImageCropper]);

  useEffect(() => {
    if (selectedFile && imageFile) {
      dispatchShowImage();
    }
  }, [selectedFile, imageFile, dispatchShowImage]);

  useEffect(() => {
    if (parentsAdded) refetchAfterParentsAdded();
  }, [parentsAdded, refetchAfterParentsAdded]);

  useEffect(() => {
    if (parentAddedViaPlaceholder) refetchAfterParentsAdded();
  }, [parentAddedViaPlaceholder, refetchAfterParentsAdded]); 

  useEffect(()=>{
    if(refetchTree) dispatchRefetchFamily(treeId, primaryPersonId, level);
  },[refetchTree, dispatchRefetchFamily])

  useEffect(() => {
    if (imageUploaded) {
      dispatchGetRepresentInfo(userId, treeId, primaryPersonId)
    }
  }, [userId, treeId, imageUploaded, primaryPersonId, dispatchGetRepresentInfo]);
  
  // CardMenu
  const handleCardMenu = (menu, node) => {
    switch (menu) {
      case 0:
        props.handleView(node);
        break;

      case 1:
        services.setTreePan(true)
        props.handleFocus(node);
        break;

      case 2:
        props.handleEdit(node);
        break;

      case 4:
        props.handleAddSpouse(node);
        break;

      case 5:
        props.handleAddChild(node);
        break;

      case 6:
        props.handleAddParent(node);
        break;

      case 7:
        props.handleAddSibling(node);
        break;

      default:
        break;
    }
  };

  //To get nextGen Family 
 const addNextGenFamily =  (node) => {
   return  dispatchGetNextGenFamily(treeId,node.id, node.attributes.path)
 };

  // Image Uploader
  const handleImageUploader = (files, node) => {
    if (showInvalidModal) closeInvalidModal();
    const file = files[0];
    setSelectedFile({
      ...selectedFile,
      userID: node.id,
      file});
  };

  const closeCropModal = async () => {
    setImageFile(null);
    setSelectedFile(null);
    dispatchClearImage();
  };

  const closeInvalidModal = () => {
    setShowInvalidModal(false);
  };

  const retryFileUpload = () => {
    closeInvalidModal();
  };

  const upDateFamily = (result, url, treeData) => {
    result.attributes.imgsrc = url;
    return { ...treeData, result };
  };

//To expand/collapse tree
  const updateTreeJson = (treeData) =>{
    dispatchUpdateFamily(treeData);
  }
  const findFocusNode = async(Id, url) =>{
    const treeData = _.cloneDeep(family);
    let newFamily;
    let resultNode = "";
    if(treeData.id === Id) resultNode = treeData;
    if(resultNode){
      newFamily = upDateFamily(resultNode, url, treeData)
      }
      return newFamily;
  }

  const handleSaveImages = async (croppedImageFile, croppingInfo, fileUrl) => {
    const fileName = selectedFile && selectedFile.file.name.split(".")[0];
    const selectedFileId = selectedFile && selectedFile.userID;
    const imagePayload = {
      ownerId: getOwner(),
      treeId: treeId,
      treePersonId: primaryPersonId,
      size: 10,
      authorCredit: "author-credit",
      originalImage: selectedFile.file,
      profileImage: croppedImageFile,
      fileName,
      croppingInfo
    };
   let fam = await findFocusNode(selectedFileId, fileUrl);
    if(fam){
      await dispatchAddProfileImage(imagePayload, false, fam);
    }
  };

  const handleDrawer = () => {
    setZoomReset(false)
    setDrawer(true);
  }

  const handleClose = () => {
    setDrawer(false);
  }

  const handleSelect = (treePersonId) => {
    setDrawer(false);
    props.handleSearchFocus(treePersonId);
  }

  if (family) {
    const focusPersonName = family.treeInfo.TreeName && `${family.treeInfo.TreeName}`

    return (
      <>
        <D3
          data={family}
          handleCardMenu={handleCardMenu}
          handleImageUploader={handleImageUploader}
          makeHomePersonAsFocus = {props.makeHomePersonAsFocus}
          handleDrawer={handleDrawer}
          addParentViaPlaceholder={props.handleNextGeneration}
          updateTreeJson={updateTreeJson}
          addNextGenFamily={addNextGenFamily}
          {...props}
        />
        <MyDrawer
          open={drawer}
          handleClose={handleClose}
          title={focusPersonName}
          subTitle={`${treePersonOptions.length} People`}
          options={treePersonOptions}
          handleSelect={handleSelect}
        />
        <ImageCropper
          selectedFile={selectedFile}
          showImageCropper={showImageCropper}
          setSelectedFile={setSelectedFile}
          closeCropModal={closeCropModal}
          setImageFile={setImageFile}
          imageFile={imageFile}
          setShowInvalidModal={setShowInvalidModal}
          handleSaveImages={handleSaveImages}
          imageLoading={imageLoading}
          from="pedigree-person"
        />
        <InvalidFile
          selectedFile={selectedFile}
          showInvalidModal={showInvalidModal}
          closeInvalidModal={closeInvalidModal}
          retryFileUpload={retryFileUpload}
          handleImageUploader={handleImageUploader}
        />
      </>
    );
  } else {
    return (
      <div className="h-screen overflow-hidden bg-gray-200">
        <Actions disable />
        <Loader color="primary" />
      </div>
    );
  }
};

PedigreeViewPage.propTypes = {
  family: PropTypes.object.isRequired,
};

const mapStateToProps = (state, props) => ({
  family: state.family,
  user: state.user,
  props,
});

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchClearFamily: () => dispatch(clearFamily()),
    dispatchUpdateFamily: (updatedData) => dispatch(updateFamily(updatedData)),
    dispatchGetNextGenFamily: (treeId, primaryPersonId, level) => dispatch(getNextGenFamily(treeId, primaryPersonId, level)),
    dispatchRefetchFamily: (treeId, primaryPersonId, level) => dispatch(refetchFamily(treeId, primaryPersonId, level)),
    dispatchAddProfileImage: (imagePayload, check, fam) =>dispatch(addProfileImage(imagePayload, check, fam)),
    dispatchShowImage: () => dispatch(showImage()),
    dispatchClearImage: () => dispatch(clearImage()),
    dispatchSetProfileImage: (userId) => dispatch(setProfileImage(userId)),
    dispatchGetRepresentInfo: (userId, treeId, primaryPersonId) => dispatch(getRepresentInfo(userId, treeId, primaryPersonId)),
    dispatchSaveParentsViaNodes: ( childData, resultedData, treeId, gender) => dispatch(saveParentsViaPlaceHolders(childData, resultedData, treeId, gender))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PedigreeViewPage);
