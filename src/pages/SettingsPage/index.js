import React, { useState, useRef, useEffect} from "react";
import { connect } from "react-redux";

//Actions
import { saveUserProfileImage, editUserProfileImage, deleteUserProfileImage, getUserProfileImage, getUserAccount, updateUser, profileChange, clearEditImage, showEditImage } from "../../redux/actions/user";

//Components
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Content from "./content";
import ImageCropper from "../../components/ImageCropper";
import InvalidFile from "../../components/InvalidFile";
import Typography from "../../components/Typography";

//Menu
import { settingsMenu } from "./../PersonViewPage/menus";

//Services
import { addMobileContent, removeMobileContent } from "./services";
import { dataURLtoFile, blobToDataUrl } from "./../../utils";

//Css
import "./index.css";

const SettingsPage = ({
    dispatchGetUserAccount,
    dispatchProfileChange,
    dispatchShowImage,
    dispatchClearImage,
    dispatchSaveUserProfileImage,
    dispatchEditUserProfileImage,
    dispatchDeleteUserProfileImage,
    dispatchGetUserProfileImage,
    user: { originalUserImage, originalProfileImage, originalImageId, profileChanged, showEditImageCropper, imgSrc, userId, profileImageId },
}) => {
  const [tab, setTab] = useState(1);
  const fileObject = {
    x: 0,
    y: 0,
    zoom: 1,
    file: null
  }
  const fileInputRef = useRef(null);
  const anchorRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(fileObject);
  const [imageFile, setImageFile] = useState(null);
  const [cropState, setCropState] = useState("create");
  const [showInvalidModal, setShowInvalidModal] = useState(false);
  const [openAccountPopper, setOpenAccountPopper] = useState(false);

  //File Selector
  const fileSelector = document.createElement("input");
  fileSelector.setAttribute("type", "file");
  fileSelector.accept = "image/*";
  fileSelector.addEventListener("change", handleFiles, false);

  function handleFiles() {
    const fileList = this.files;
    const file = fileList[0]; /* now you can work with the file list */
    setSelectedFile({
      ...selectedFile,
      file,
    });
  }

  useEffect(() => {
    if (profileChanged) {
      setSelectedFile(null);
      setCropState(null);
      setOpenAccountPopper(false);
      dispatchGetUserAccount(userId);
    }
  }, [dispatchGetUserAccount, profileChanged, userId])

  useEffect(() => {
    if (selectedFile && imageFile) {
      dispatchShowImage();
    }
  }, [selectedFile, imageFile, dispatchShowImage]);

  useEffect(() => {
    if (originalProfileImage && originalUserImage) {
      const url = originalProfileImage;
      blobToDataUrl(url).then((response) => {
        const originalImageFile = dataURLtoFile(response, "test.png");
        if (originalUserImage.croppingInfo) {
          setCropState("edit");
          setSelectedFile({
            x: originalUserImage.croppingInfo.cropX,
            y: originalUserImage.croppingInfo.cropY,
            width: originalUserImage.croppingInfo.width,
            height: originalUserImage.croppingInfo.height,
            zoom: originalUserImage.croppingInfo.zoomAspect,
            file: originalImageFile,
          });
        } else {
          setCropState("create");
          setSelectedFile({
            ...selectedFile,
            file: originalImageFile,
          });
        }
      });
    }
  }, [setSelectedFile, originalProfileImage]);


  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  const handleToggle = () => {
    setOpenAccountPopper((openState) => !openState)
  }

  const closeCropModal = async () => {
    if (!imgSrc) {
      setSelectedFile(null);
    }
    await dispatchClearImage();
  };

  const handleChooseNew = () => {
    setCropState("create");
    setImageFile(null);
    fileSelector.click();
  };

  const handleSaveImages = async (croppedFile, croppingInfo, fileUrl) => {
    let payload = {};
    switch (cropState) {
      case "edit":
        payload = {
          originalImageId,
          authorCredit: "author-credit",
          profileImage: croppedFile,
          croppingInfo: croppingInfo,
          accountThumbnail: fileUrl,
        };
        await dispatchEditUserProfileImage(payload);
        break;
      case "delete":

        break;
      case "create":
        payload = {
          authorCredit: "author-credit",
          originalImage: selectedFile.file,
          profileImage: croppedFile,
          croppingInfo: croppingInfo,
          accountThumbnail: fileUrl,
        };
        await dispatchSaveUserProfileImage(payload);
        break;
      default: // do nothing
    }
    await dispatchProfileChange();
  };

  // menu event for edit profile avatar popper
  const handlePhotoMenu = async (e) => {
    switch (e.id) {
      case 1:
          dispatchGetUserProfileImage(profileImageId);
        break;

      case 2:
        handleChooseNew();
        break;

      case 3:
        setImageFile(null);
        setSelectedFile(null);
        await dispatchDeleteUserProfileImage(userId);
        break;

      default:
        break;
    }
  };

  const handleSelect = (e) => {
    handlePhotoMenu(e);
    setOpenAccountPopper(false);
  };

  const closeInvalidModal = () => {
    setSelectedFile(null);
    setShowInvalidModal(false);
    if (fileInputRef.current !== null) {
      fileInputRef.current.value = null;
    }
  };


  const setMobileView = (id) => {
    setTab(id);
    addMobileContent();
  };

  const SettingsSideBar = () => {
    return settingsMenu.map((ele) => (
      <li className={ele.id === tab ? "active" : ""}>
        <Button handleClick={() => setTab(ele.id)} type="link-white" icon={ele.icon} title={ele.title} />
      </li>
    ));
  };

  const SettingsMobileSideBar = () => {
    return settingsMenu.map((ele) => (
      <li className={ele.id === tab ? "active" : ""} onClick={() => setMobileView(ele.id)}>
        <Icon handleClick={() => setMobileView(ele.id)} id='"icon-" + crypt' type="rightArrow" />
        <Button type="default" icon={ele.icon} title={ele.title} />
      </li>
    ));
  };

  const getPropsForContent = () => {
    return {
      onTargetClick,
      fileInputRef,
      setSelectedFile,
      selectedFile,
      anchorRef,
      openAccountPopper,
      handleToggle,
      handleSelect,
      setCropState
    }
  }

  return (
    <div className="homepage setting-page">
      <div className="hidden md:block w-full">
        <div className="setting-header">
          <div className="main-wrapper setting-header-inner">
            <h1>Settings</h1>
          </div>
          <figure></figure>
        </div>
        <div className="main-wrapper mx-auto relative z-20">
          <div className="setting-container">
            <div className="setting-sidebar">
              <ul className="setting-menu">
                <SettingsSideBar />
              </ul>
            </div>
            <div className="setting-content-wrap">
              <Content tab={tab} {...getPropsForContent()}/>
            </div>
          </div>
        </div>
      </div>
      <div className="md:hidden mobile-setting-page ">
        <sidebar className="setting-mobile-sidebar">
          <h1 className="mobile-heading">
            <Typography>Settings</Typography>
          </h1>
          <ul className="setting-mobile-menu">
            <SettingsMobileSideBar />
          </ul>
        </sidebar>
        <div className="mobile-setting-content">
          <div className="st-content">
            <div className="mb-6">
              <Button type="link-white" icon="leftArrow" title="Settings" handleClick={() => removeMobileContent()} />
            </div>
            <Content tab={tab} {...getPropsForContent()}/>
          </div>
        </div>
      </div>
      <ImageCropper
        selectedFile={selectedFile}
        imageFile={imageFile}
        setImageFile={setImageFile}
        closeCropModal={closeCropModal}
        setSelectedFile={setSelectedFile}
        setShowInvalidModal={setShowInvalidModal}
        showImageCropper={showEditImageCropper}
        from="editModal"
        cropState={cropState}
        handleSaveImages={handleSaveImages}
      />
        <InvalidFile 
        selectedFile={selectedFile} 
        showInvalidModal={showInvalidModal} 
        closeInvalidModal={closeInvalidModal} />
    </div>
  );
};


const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchClearImage: () => dispatch(clearEditImage()),
    dispatchShowImage: () => dispatch(showEditImage()),
    dispatchSaveUserProfileImage: (payload) => dispatch(saveUserProfileImage(payload)),
    dispatchEditUserProfileImage: (payload) => dispatch(editUserProfileImage(payload)),
    dispatchDeleteUserProfileImage: (userId) => dispatch(deleteUserProfileImage(userId)),
    dispatchGetUserProfileImage: (profileImageId) => dispatch(getUserProfileImage(profileImageId)),
    dispatchGetUserAccount: (userAccount) => dispatch(getUserAccount(userAccount)),
    dispatchUpdateUser: (payload) => dispatch(updateUser(payload)),
    dispatchProfileChange: () => dispatch(profileChange()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);