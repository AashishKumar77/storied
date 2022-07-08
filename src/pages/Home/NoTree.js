import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Stepper from "../../components/Stepper";
import GetStartSteps from "../FamilyStepper/GetStartSteps";
import GetUploadSteps from "../FamilyStepper/GetUploadSteps";
import {
  startNewTree,
  handleSelectHomePerson,
  importGedCom,
  getImportStatus,
  updateGedcom,
  assignHomePerson,
} from "../../redux/actions/family";
import { setNewTree } from "../../services";
let statusTimer;
const IMPORTCOMPLETED = "IMPORTCOMPLETED";
const NoTree = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { userAccount } = useSelector((state) => state.user);
  const {
    progress,
    homePersons,
    selectedHomePerson,
    assigned,
    importStatus,
    startTree,
    newTreeId,
  } = useSelector((state) => state.family);
  const [userForm, setFormdata] = useState(null);
  const [step, setActivestep] = useState(0);
  const [uploadStep, setUploadstep] = useState(false);
  const [privacyCheck, setPrivacycheck] = useState(false);
  const [fileReady, setFileready] = useState(false);
  const [file, setSelectedfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [homePersonCheck, setHomepersoncheck] = useState(true);
  const [showmodal, setShowmodal] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (userAccount) {
      setFormdata(userAccount);
    }
  }, [setFormdata, userAccount]);
  useEffect(() => {
    if (startTree) {
      resetStepper();
      return history.push(
        `/family/pedigree-view/${startTree.treeId}/${startTree.primaryPersonId}/${startTree.level}`
      );
    }
  }, [startTree, history]);
  useEffect(() => {
    if (
      !assigned &&
      importStatus &&
      importStatus.toUpperCase() === IMPORTCOMPLETED
    ) {
      clearInterval(statusTimer);
      dispatch(
        assignHomePerson(
          newTreeId,
          selectedHomePerson.personId,
          homePersonCheck
        )
      );
    }
  }, [importStatus, newTreeId, selectedHomePerson, assignHomePerson]);
  useEffect(() => {
    if (assigned)
      dispatch(updateGedcom(newTreeId, selectedHomePerson.personId, 4));
  }, [assigned, updateGedcom, selectedHomePerson]);
  const handleNextStep = (selectedButton) => {
    if (selectedButton === 1) {
      setUploadstep(false);
      setNewTree(true);
    }
    if (selectedButton === 2) {
      setUploadstep(true);
      setNewTree(false);
    }
    if (selectedButton === 3) {
      handleUploading(true);
      return;
    }
    if (step >= 0 && step < 2) {
      setActivestep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  const handleBackStep = () => {
    if (step <= 2 && step > 0) {
      setActivestep((prevActiveStep) => prevActiveStep - 1);
      setFileready(false);
      setPrivacycheck(false);
    }
  };
  const handleInputChange = (e) => {
    setFormdata({
      ...userForm,
      [e.target.name]: e.target.value,
    });
  };
  const handleCheck = (event) => {
    if (event) setPrivacycheck(event.target.checked);
    else setPrivacycheck(false);
  };
  const handleFileReady = (fileisReady) => {
    setFileready(fileisReady);
  };
  const handleSelectedFile = (selectedFile) => {
    setSelectedfile(selectedFile);
  };
  const handleHomePerson = (event, value) => {
    dispatch(handleSelectHomePerson(value));
  };
  const handleChangeHomePerson = (value) => {
    return value;
  };
  const handleUploading = (upload) => {
    setUploading(upload);
    handleImportGedcom();
  };
  const handleImportGedcom = async () => {
    const FileName = file && file.name.split(".")[0];
    const FormFile = file;
    if (FileName && FormFile) dispatch(importGedCom(FileName, FormFile));
  };
  const handleLearnMore = () => {
    setShowmodal(!showmodal);
  };
  const checkDisabled = () => {
    let bool = true
    if ((userForm.firstName || userForm.lastName).trim()) {
      bool = false;
    }
    return bool;
  };
  const handleHomePersonCheck = (event) => {
    setHomepersoncheck(event.target.checked);
  };
  const handleStartNewTree = async () => {
    setActivestep((prevActiveStep) => prevActiveStep + 1);
    dispatch(startNewTree(userForm));
  };
  const handleDone = async () => {
    setDone(true);
    statusTimer = setInterval(async () => {
      dispatch(getImportStatus(newTreeId));
    }, 10000);
  };
  const resetStepper = () => {
    setActivestep(0);
    setUploadstep(false);
    setPrivacycheck(false);
    setFileready(false);
    setSelectedfile(null);
    setUploading(false);
    setHomepersoncheck(true);
    setDone(false);
  };
  const getPropsForFileUpload = () => {
    return {
      step,
      handleNextStep,
      handleBackStep,
      handleInputChange,
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
      handleLearnMore,
      userForm,
      checkDisabled,
    };
  };
  const getPropsForTextStart = () => {
    return {
      step,
      handleNextStep,
      handleBackStep,
      userForm,
      handleInputChange,
      handleStartNewTree,
      showmodal,
      handleLearnMore,
      checkDisabled,
    };
  };
  return (
    <Stepper
      width={"640"}
      step={step}
      content={
        uploadStep ? (
          <GetUploadSteps {...getPropsForFileUpload()} />
        ) : (
          <GetStartSteps {...getPropsForTextStart()} />
        )
      }
    />
  );
};
export default NoTree;
