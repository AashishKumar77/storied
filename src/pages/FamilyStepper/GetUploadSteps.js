import React from "react";

// Components
import Typography from "../../components/Typography";
import Button from "../../components/Button";
import Uploader from "../../components/Uploader";
import Checkbox from "../../components/Checkbox";
import ComboBox from "../../components/ComboBox";
import Loader from "../../components/Loader";
import Step0 from "./Step0";

const UploaderComponent = (props) => {
  return (
    <div className="mt-6">
      <div className="mt-0">
        <Uploader {...props}/>
      </div>
    </div>
  )
}

let Init = true;

const GetUploadSteps = ({
  step,
  handleNextStep,
  handleBackStep,
  privacyCheck,
  handleCheck,
  fileReady,
  handleFileReady,
  handleSelectedFile,
  uploading,
  progress,
  homePersons,
  selectedHomePerson,
  handleChangeHomePerson,
  handleHomePerson,
  homePersonCheck,
  handleHomePersonCheck,
  done,
  handleDone,
  showmodal,
  handleLearnMore
}) => {

  const getPropsForUploader = () => {
    return {
      fileReady,
      handleFileReady,
      handleSelectedFile,
      uploading,
      progress,
      homePersons,
      handleCheck,
      handleNextStep,
    }
  }

  const changeInit = (value) => {
    if(homePersonCheck) Init = false
    else Init = value
  }

  const handleLocalDone = () => {
    Init = true;
    handleDone();
  }

  switch (step) {
    case 0:
      return (
        <Step0 
          handleNextStep={handleNextStep} 
          showmodal={showmodal} 
          handleLearnMore={handleLearnMore} 
        />
      );

    case 1:
      return (
        <>
          {/* Uploading */}
          {
            uploading && (
              <>
                <div className="mt-0">
                  <Typography size={24} weight="medium" text="secondary" tkey="family.stepper.uploadTree.step2.title" />
                </div>
                <div className="mt-2">
                  <Typography size={14} weight="light" text="secondary" tkey="family.stepper.uploadTree.step2.desc" />
                </div>

                <UploaderComponent {...getPropsForUploader()}/>
              </>
            ) 
          }

          {/* Upload */}
          {
            !uploading && (
              <>
                <div className="mt-0">
                  <Typography size={24} weight="medium" text="secondary" tkey="family.stepper.uploadTree.step1.title" />
                </div>
                <div className="mt-2">
                  <Typography size={14} text="secondary" tkey="family.stepper.uploadTree.step1.desc" />
                </div>
                
                <UploaderComponent {...getPropsForUploader()}/>

                <div className="mt-8 flex">
                  <div>
                    <Checkbox
                      id="privacy-check"
                      obj={null}
                      checked={privacyCheck}
                      color="primary"
                      handleChange={handleCheck}
                      label=""
                      labelColor="secondary"
                      disabled={!fileReady}
                    />
                  </div>
                  <div className="mt-2">
                    <span>
                      <Typography size={12} weight="light" text="secondary" tkey="family.stepper.uploadTree.step1.agree"></Typography>
                      &nbsp;
                      <Typography
                        size={12}
                        type="link"
                        target="_blank"
                        href="https://newspaperarchive.com/privacypolicy/"
                        text="primary"
                        tkey="family.stepper.uploadTree.step1.privacy"
                      />
                      &nbsp;
                      <Typography
                        size={12}
                        text="secondary"
                        tkey="family.stepper.uploadTree.step1.and"
                      />
                      &nbsp;
                      <Typography
                        size={12}
                        type="link"
                        target="_blank"
                        href="https://newspaperarchive.com/terms/"
                        text="primary"
                        tkey="family.stepper.uploadTree.step1.terms"
                      />
                    </span>
                  </div>
                </div>
                <div className="start-tree-btn upload-btn">
                  <div className="mr-2">
                      <Button
                        type="default"
                        size="large"
                        tkey="family.stepper.uploadTree.step1.backButton"
                        handleClick={handleBackStep}
                      />
                  </div>
                  <div className="mr-0">
                      <Button
                        type="primary"
                        size="large"
                        tkey="family.stepper.uploadTree.step1.nextButton"
                        disabled={!privacyCheck}
                        handleClick={()=>handleNextStep(3)}
                      />
                  </div>
                </div>
              </>
            )
          }
        </>
      );

    case 2:
      return (
        <>
          {!done ? (
            <>
              <div className="mt-0">
                <Typography size={24} weight="medium" text="secondary" tkey="family.stepper.uploadTree.step3.title" />
              </div>

              <div className="mt-2">
                <Typography size={14} weight="light" text="secondary" tkey="family.stepper.uploadTree.step3.desc" />
              </div>

              <div className="mt-6">
                <div className="mt-0">
                  <ComboBox
                    id="tree-homepersons"
                    init={Init}
                    changeInit={changeInit}
                    label="family.stepper.uploadTree.step3.label"
                    placeholder="Select Home Person"
                    options={homePersons}
                    handleChange={handleChangeHomePerson}
                    handleSelect={handleHomePerson}
                    value={selectedHomePerson}
                  />
                  <div className="flex mt-2">
                    <Checkbox
                      id="homePersonCheck"
                      obj={null}
                      checked={homePersonCheck}
                      color="primary"
                      handleChange={handleHomePersonCheck}
                      label="family.stepper.uploadTree.step3.checkBox"
                      labelColor="secondary"
                      disabled={false}
                    />
                  </div>
                </div>
              </div>

              <div className="start-tree-btn">
                <div className="mr-0">
                  <Button
                    type="primary"
                    size="large"
                    tkey="family.stepper.uploadTree.step3.nextButton"
                    disabled={!selectedHomePerson}
                    handleClick={handleLocalDone}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col al items-center">                             
              <div className="mt-20">
                <Loader color="danger"/>
              </div>

              <div className="mt-8 content-center">
                <Typography
                  size={24}
                  weight="medium"
                  text="secondary"
                  tkey="family.stepper.uploadTree.step4.title"
                />
              </div>
              <div className="mt-6 w-80 mx-auto">
                <Typography
                  size={14}
                  text="secondary"
                  tkey="family.stepper.uploadTree.step4.desc"
                />
            </div>
          </div>
          )}
        </>
      );

    default:
      return null;
  }
};

export default GetUploadSteps;