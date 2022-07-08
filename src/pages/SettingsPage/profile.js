import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useTranslation } from 'react-i18next';
import { trimString } from "shared-logics";

//Actions
import { updateUser, profileChange } from "../../redux/actions/user";

//Components
import Input from "../../components/Input";
import Button from "../../components/Button";
import Uploader from "../PersonViewPage/uploader";
import Loader from "../../components/Loader";

//Utils
import { tr } from "../../components/utils";

//Menus
import { photoMenu } from "../PersonViewPage/menus";

const Profile = ({
  dispatchUpdateUser,
  dispatchProfileChange,
  onTargetClick,
  fileInputRef,
  setSelectedFile,
  selectedFile,
  anchorRef,
  openAccountPopper,
  handleToggle,
  handleSelect,
  setCropState,
  user: { userFirstName, userLastName, imgSrc, userEmail, userProfileAccount, userId },
}) => {
  const { t } = useTranslation();
  const [edit, setEdit] = useState(false);
  const [userAccount, setUserAccount] = useState(null);
  const [loading,setIsLoading] = useState(true);

  useEffect(() => {
    if (userProfileAccount && !userAccount && imgSrc !== null) {
      let accountProfile = {
        firstName: userFirstName,
        lastName: userLastName,
        email: userEmail,
      };
      setUserAccount(accountProfile);
      setIsLoading(false);
    }
  }, [imgSrc, setUserAccount, userAccount, userEmail, userFirstName, userLastName, userProfileAccount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserAccount({
      ...userAccount,
      [name]: value,
      isChanged: true,
    });
  };

  const checkDisable = () => {
    if (userAccount) {
      const { firstName, lastName } = userAccount
      if (trimString(firstName) && trimString(lastName)) {
        return false
      }
    }
    return true
  }

  const saveProfileNames = async () => {
    setEdit(false);
    const userPayload = {
      userId,
      givenName: userAccount.firstName,
      surname: userAccount.lastName,
    };
    if (userAccount.isChanged) {
      await dispatchUpdateUser(userPayload);
    }
    await dispatchProfileChange();
  }

  const handleCancel = () => {
    setEdit(false);
    setUserAccount({
      firstName: userFirstName,
      lastName: userLastName,
      email: userEmail,
    });
  }


  return (
    <>
    { !loading && (
    <>
      <h2 className="setting-heading">Profile</h2>
      <div className="setting-content ">
        <div className="setting-row">
          <div className="setting-col-4 lg:order-last">
            <div className="avtar-block">
              <label className="user-label">Photo</label>
              <div className="photo-placeholder">
                {/* start */}
                {/* <div>code here</div> */}
                <div className="photo-circle">
                  <Uploader
                    onTargetClick={onTargetClick}
                    fileInputRef={fileInputRef}
                    setSelectedFile={setSelectedFile}
                    selectedFile={selectedFile}
                    imgSrc={imgSrc}
                    anchorRef={anchorRef}
                    open={openAccountPopper}
                    showPopper={openAccountPopper}
                    handleToggle={handleToggle}
                    photoMenu={photoMenu}
                    handleSelect={handleSelect}
                    setCropState={setCropState}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="setting-col-8">
            {!edit && (
              <div className="prop-view">
                <div className="prop-primary">
                  <label className="prop-label">Name</label>
                  <div className="prop-link">
                    <Button handleClick={() => setEdit(true)} type="link-white" title="Edit" />
                  </div>
                </div>
                <div className="prop-readonly">
                  <div className="line-clamp-2">
                    {userFirstName} {userLastName}
                  </div>
                </div>
              </div>
            )}
            {edit && (
              <div className="hidden-0">
                <div className="prop-view prop-edit-mode">
                  <div className="prop-primary">
                    <label className="prop-label">Name</label>
                    <div className="prop-link">
                      <Button handleClick={() => handleCancel()} type="link-white" title="Cancel" />
                    </div>
                  </div>
                  <div className="prop-readonly">
                    <div className="prop-row ">
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="w-full">
                          <Input
                            id="firstName"
                            label={tr(t, "f&mName")}
                            type="text"
                            name="firstName"
                            value={userAccount.firstName}
                            placeholder={""}
                            handleChange={handleChange}
                            autoFocus="autoFocus"
                            position = {userAccount.firstName.length}
                          />
                        </div>
                        <div className="w-full">
                          <Input
                            id="lastName"
                            label={tr(t, "LastName")}
                            type="text" name="lastName"
                            value={userAccount.lastName}
                            placeholder={""}
                            handleChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button
                          handleClick={saveProfileNames}
                          disabled={checkDisable()}
                          size="large"
                          title="Save" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="prop-view">
              <div className="prop-primary">
                <label className="prop-label">Mobile Number</label>
                <div className="prop-link">
                  <Button type="link-white" title="Edit" disabled />
                </div>
              </div>
              <div className="prop-readonly">
                <div className="truncate">
                  801-698-6851
                </div>
              </div>
            </div>
            <div className="prop-view">
              <div className="prop-primary">
                <label className="prop-label">Email</label>
              </div>
              <div className="prop-readonly">
                <div className="truncate">
                  {userEmail}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>)}
    <>  { loading && (<Loader />)}
    </>
    </>
  );
};

const mapStateToProps = (state) => ({
  user: state.user,
})

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchUpdateUser: (payload) => dispatch(updateUser(payload)),
    dispatchProfileChange: () => dispatch(profileChange()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);