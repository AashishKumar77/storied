import React from "react";

// Components
import Dialog from "../Dialog";
import Input from "../Input";
import Loader from "../Loader";
import Uploader from "../../pages/PersonViewPage/uploader";

import "./index.css";
import { tr } from "../../components/utils";
import { useTranslation } from 'react-i18next';
const ProfileModal = ({
    openEditModal,
    fileInputRef,
    selectedFile,
    setSelectedFile,
    accountThumbnail,
    anchorRef,
    closeProfileModal,
    openAccountPopper,
    setOpenAccountPopper,
    handleSelect,
    userAccount,
    photoMenu,
    handleChange,
    saveProfile,
    profileLoading }) => {

    const onTargetClick = () => {
        fileInputRef.current.click();
    };

    const handleToggle = () => {
        setOpenAccountPopper((openState) => !openState)
    }

    const checkDisable = () => {
        if (userAccount) {
            const { firstName, lastName } = userAccount
            if (firstName || lastName) {
                return false
            }
        }
        return true
    }

    const handleEditProfile = () => {
        saveProfile()
    }
    
    return (
        <Dialog
            open={openEditModal}
            actions={true}
            hideDividers={true}
            size="small"
            header="Edit Profile"
            innerClasses="modal-sm"
            content={
                userAccount ?
                    <ContentSection
                        onTargetClick={onTargetClick}
                        fileInputRef={fileInputRef}
                        selectedFile={selectedFile}
                        setSelectedFile={setSelectedFile}
                        accountThumbnail={accountThumbnail}
                        anchorRef={anchorRef}
                        open={openAccountPopper}
                        handleToggle={handleToggle}
                        photoMenu={photoMenu}
                        handleChange={handleChange}
                        handleSelect={handleSelect}
                        userAccount={userAccount}
                    />
                    :
                    <div className="flex justify-center items-center h-52"><Loader /></div>
            }
            handleClose={closeProfileModal}
            handleCancel={closeProfileModal}
            handleSave={handleEditProfile}
            disabled={checkDisable()}
            loading={profileLoading}
        />
    )
}

export default ProfileModal;

const ContentSection = ({
    onTargetClick,
    fileInputRef,
    setSelectedFile,
    selectedFile,
    accountThumbnail,
    anchorRef,
    open,
    handleToggle,
    photoMenu,
    handleSelect,
    userAccount,
    handleChange }) => {
        const { t } = useTranslation();
    return (
        <>
            <div className=" edit-profile-sec">
                <Uploader
                    onTargetClick={onTargetClick}
                    fileInputRef={fileInputRef}
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                    imgSrc={accountThumbnail}
                    anchorRef={anchorRef}
                    open={open}
                    showPopper={open}
                    handleToggle={handleToggle}
                    photoMenu={photoMenu}
                    handleSelect={handleSelect}
                />
            </div>
            <div className="w-full smm:mb-2">
                <Input
                    id="firstName"
                    label={tr(t,"f&mName")}
                    type="text"
                    name="firstName"
                    value={userAccount.firstName}
                    placeholder={""}
                    handleChange={handleChange}
                />
            </div>
            <div className="w-full smm:mb-2">
                <Input
                    id="lastName"
                    label={tr(t,"LastName")}
                    type="text"
                    name="lastName"
                    value={userAccount.lastName}
                    placeholder={""}
                    handleChange={handleChange}
                />
            </div>
            <div className="w-full smm:mb-0">
                <Input
                    id="email"
                    label={`Email`}
                    type="text"
                    name="email"
                    value={userAccount.email}
                    hideTitleCase
                    disabled
                />
            </div>
        </>
    )
}