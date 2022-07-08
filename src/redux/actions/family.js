import { 
    GET,
    POST,
    PUT,
    DELETE,
    FAMILY_LOADING, 
    GET_FAMILY,
    CLEAR_FAMILY,
    PERSON_LOADING,
    ADD_TREE, 
    UPDATE_FAMILY, 
    FAMILY_ERROR,
    RENDER_STEPPER,
    RENDER_TREE,
    SAVE_PARENTS,
    ADD_PARENT,
    ADD_SIBLING,
    FETCH_PARENTS,
    SAVE_PARENT,
    ADD_SPOUSE,
    FETCH_SPOUSES,
    SAVE_SPOUSE,
    SAVE_ERROR,
    ADD_FAMILY,
    CANCEL_MODAL,
    GET_EDIT_PERSON,
    TREE_ERROR, 
    SELECT_USER, 
    IMPORT_GEDCOM, 
    PROGRESS_BAR,
    GEDCOM_ERROR,
    GET_IMPORT_STATUS,
    IMPORT_STATUS_ERROR,
    ASSIGN_HOMEPERSON,
    ASSIGN_ERROR,
    SELECT_HOMEPERSON,
    SELECT_HOMEPERSON_ERROR,
    AUTOCOMPLETE_TEST,
    AUTOCOMPLETE_PAGINATION_TEST,
    AUTOCOMPLETE_ERROR,
    AUTOCOMPLETE_PAGINATION_ERROR,
    GET_TREES,
    TREES_LOADING,
    SAVE_SIBLING,
    REFETCHED,
    ADD_CHILD,
    SAVE_CHILD,
    SAVE_PROFILE_IMAGE,
    IMAGE_LOADING,
    SET_MODAL_DATA,
    GET_PROFILE_IMAGE,
    FETCHING_IMAGE,
    CLEAR_IMAGE,
    SHOW_IMAGE,
    AUTOCOMPLETE_BIRTH_PAGINATION_TEST,
    AUTOCOMPLETE_BIRTH_TEST,
    AUTOCOMPLETE_DEATH_TEST,
    AUTOCOMPLETE_DEATH_PAGINATION_TEST,
    CLEAR_BIRTH_OPTIONS,
    CLEAR_DEATH_OPTIONS,
    TREE_PERSON_SEARCH_OPTIONS,
    ADD_PARENT_VIA_PLACEHOLDER,
    SAVE_PARENT_VIA_PLACEHOLDER,
    REFETCH_PAGE_AFTER_UPLOAD,
    ADD_PERSON_THUMBNAIL,
    IMAGE_UNLOADING,
    SET_NEW_FAMILY_PAYLOAD,
    GET_EDITED_FAMILY,
    GET_HERO_IMAGE
 } from "../constants";
import { 
    addFilialFunction, 
    startNewTreeWithFocusPerson, 
    gedcomPayload, 
    assignPayload, 
    editPersonPayload,
    getParentPayload,
    getSiblingPayload,
    saveParentPayload,
    getSpousePayload,
    getSpouseAndChildrenPayload,
    saveSpousePayload,
    saveSiblingPayload,
    getSiblingDropdown,
    getChildPayload,
    getParentAndSpousesPayload,
    imageUploadPayload,
    getValuesForCheckBoxes,
    editImageUploadPayload
 } from "../helpers";
import { getNewTree, setCardTooltip } from "../../services";
import { apiRequest, isCancel } from "../requests";
import { refetchLogic } from "../../utils";
import { addMessage } from "./toastr";
import { trimString } from "shared-logics";

export const getFamily = (treeId, primaryPersonId, level) => async (dispatch) => {
    try {
        dispatch({ type: FAMILY_LOADING });

        const res = await apiRequest(GET, `persons/pedigree/${treeId}/${primaryPersonId}/${level}`);

        if(getNewTree() === "true") setCardTooltip(true);
        else setCardTooltip(false);

        setTimeout(() => {
            dispatch({
                type: GET_FAMILY,
                payload: res.data
            })
        }, 100);
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const refetchFamily = (treeId, primaryPersonId, level) => async (dispatch) => {
    try {
        const res = await apiRequest(GET, `persons/pedigree/${treeId}/${primaryPersonId}/${level}`);
        dispatch({
            type: GET_FAMILY,
            payload: res.data
        })
        dispatch({ type: REFETCHED })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const clearFamily = () => async (dispatch) => {
    dispatch({ type: CLEAR_FAMILY })
}

export const renderStepper = () => async (dispatch) => {
    dispatch({ type: RENDER_STEPPER })
}

export const renderTree = () => async (dispatch) => {
    dispatch({ type: RENDER_TREE })
}

export const getNextGenFamily = (treeId, primaryPersonId, level) => async (dispatch) => {
    let path = level && level.split("/");
    // Appending unicode for "/" as backend read the "/" as different parameter
    path = path.join("%2F");
    try {
      const res = await apiRequest(GET,`Persons/expandtree/${treeId}/${primaryPersonId}/${path}`);
      return res.data;
    } catch (err) {
      dispatch({
        type: FAMILY_ERROR,
        payload: { msg: err },
      });
    }
}

export const getEditPerson = (payload) => async (dispatch) => {
    try { 
        dispatch({
            type: GET_EDIT_PERSON,
            payload
        })

    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const saveEditPerson = (family, person, editPerson, treeId) => async (dispatch) => {

    try {
        const personData = editPersonPayload(person, editPerson, treeId);
        if(trimString(editPerson.firstName) === "" && trimString(editPerson.lastName) ==="")
        {
            dispatch(addMessage("First or last name is required.","error"));
        }
        else
        {
            dispatch({ type: SET_NEW_FAMILY_PAYLOAD, payload: family });
            if (Object.keys(personData).length > 2) await apiRequest(PUT, `Persons/${person.id}`, personData);
            setTimeout(() => {
                dispatch({ type: GET_EDITED_FAMILY });
            }, 5000);
        }
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const startNewTree = (personData) => async (dispatch) => {
    const payload = startNewTreeWithFocusPerson(personData);
    
    try {
        await apiRequest(POST, `trees`, payload);

        const res = {
            data: {
                treeId: payload.treeId,
                primaryPersonId: payload.homePerson.id,
                level: 4
            }
        }
        
        setTimeout(() => {
            dispatch({
                type: ADD_TREE,
                payload: res.data
            })
        }, 3000);
        
    } catch (error) {
        dispatch({
            type: TREE_ERROR,
            payload: { msg: error }
        })
    }
}

export const updateFamily = (data) => async (dispatch) => {
    try {
        dispatch({ type: FAMILY_LOADING });

        const res = data;

        setTimeout(() => {
            dispatch({
                type: UPDATE_FAMILY,
                payload: res
            })
        }, 100);
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const addParentsViaPlaceHolders = () => async (dispatch) => {
    dispatch({ type: ADD_PARENT_VIA_PLACEHOLDER });
}

export const saveParentsViaPlaceHolders = ( childData, fatherData, treeId) => async (dispatch) => {
    try {
        const payload = addFilialFunction(childData, fatherData, treeId);
        if(trimString(fatherData.firstName) === "" && trimString(fatherData.lastName) ==="")
        {
            dispatch(addMessage("First or last name is required.","error"));
        }
        else
        {
            dispatch({ type: PERSON_LOADING });
            await apiRequest(POST, `Persons/parent`, payload);
            dispatch({ type: SAVE_PARENT_VIA_PLACEHOLDER })

            let url = `/family/person-page/${treeId}/${fatherData.id}`;
            setTimeout(() => {
                dispatch(addMessage(`${fatherData.firstName} ${fatherData.lastName} has been saved.`,"success",{url}));
            }, 2000);
        }
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
        dispatch(addMessage("Sorry, person couldn't be saved. Please try again.", "error"));
    }
}

export const saveParents = () => async (dispatch) => {
    dispatch({ type: SAVE_PARENTS });
}

export const selectUser = () => async (dispatch) => {
    try {
        dispatch({
            type: SELECT_USER
        })

    } catch (err) {
        dispatch({
            type: TREE_ERROR,
            payload: { msg: err }
        })
    }
}

export const getTrees = (personId) => async (dispatch)=>{  
    try{
        dispatch({ type: TREES_LOADING });
        
        const res = await apiRequest(GET, `Users/${personId}/trees`);      

        dispatch({
            type: GET_TREES,
            payload: res.data
        })
    }
    catch(err){
        dispatch({
            type: TREE_ERROR,
            payload: { msg: err }
        }) 
    }
}

export const importGedCom = (FileName, FormFile) => async (dispatch) => {
    const payload = gedcomPayload(FileName, FormFile);

    try {
        const onUploadProgress = (event) => {
            let percentage = (event.loaded / event.total) * 100;
            dispatch({ type: PROGRESS_BAR, payload: percentage });
        }

        const res = await apiRequest(POST, `Trees/importgedcom`, payload, onUploadProgress);
        
        dispatch({
            type: IMPORT_GEDCOM,
            payload: res.data
        })  
    } catch (err) {
        dispatch({
            type: GEDCOM_ERROR,
            payload: { msg: err }
        })
    }
}

export const getImportStatus = (treeId) => async (dispatch) => {

    try {
        const res = await apiRequest(GET, `Trees/${treeId}/importstatus`);

        dispatch({
            type: GET_IMPORT_STATUS,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: IMPORT_STATUS_ERROR,
            payload: { msg: err }
        })
    }
}

export const assignHomePerson = (treeId, homePersonId, thisIsMePerson) => async (dispatch) => {

    const payload = assignPayload(treeId, homePersonId, thisIsMePerson);

    try {
        const res = await apiRequest(POST, `Trees/assignhomeandrepresentingperson`, payload);

        dispatch({
            type: ASSIGN_HOMEPERSON,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: ASSIGN_ERROR,
            payload: { msg: err }
        })
    }
}

export const handleSelectHomePerson = (selectedHomePerson) => async (dispatch) => {

    try {
        dispatch({
            type: SELECT_HOMEPERSON,
            payload: selectedHomePerson
        })

    } catch (err) {
        dispatch({
            type: SELECT_HOMEPERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateGedcom = (treeId, primaryPersonId, level) => async (dispatch) => {

    try {
        const payload = {
            treeId, 
            primaryPersonId, 
            level
        }

        dispatch({
            type: ADD_TREE,
            payload
        })

    } catch (err) {
        dispatch({
            type: TREE_ERROR,
            payload: { msg: err }
        })
    }
}

export const getTreePersonOptions = (treeId) => async (dispatch) => {
    try {
        const res = await apiRequest(GET, `Trees/${treeId}/listPeople`);
        dispatch({
            type: TREE_PERSON_SEARCH_OPTIONS,
            payload: res.data
        })

    } catch (err) {
        dispatch({
            type: IMPORT_STATUS_ERROR,
            payload: { msg: err }
        })
    }
}

export const getAutoCompleteTest = (searchString, source, requestId, page= 1) => async (dispatch) => {
    try {
        if (!searchString) searchString = '';
        const res = await apiRequest(GET, `placeauthority/typeahead/search/${requestId}/page/${page}/${searchString}`, null, null, source);
        if( (res.data &&  page !== 1) || page === 1) {
            const actionType = page === 1?AUTOCOMPLETE_TEST:AUTOCOMPLETE_PAGINATION_TEST;
            dispatch({
                type: actionType,
                payload: res.data
            })
        }
    } catch (err) {
        if( !isCancel(err) ) {
            dispatch({
                type: page === 1?AUTOCOMPLETE_ERROR:AUTOCOMPLETE_PAGINATION_ERROR,
                payload: { msg: err }
            })
        }
    }
}

export const getBirthAutoCompleteTest = (searchString, source, requestId, page= 1) => async (dispatch) => {
    try {
        if (!searchString) searchString = '';
        const res = await apiRequest(GET, `placeauthority/typeahead/search/${requestId}/page/${page}/${searchString}`, null, null, source);
        if( (res.data &&  page !== 1) || page === 1) {
            const actionType = page === 1 ? AUTOCOMPLETE_BIRTH_TEST : AUTOCOMPLETE_BIRTH_PAGINATION_TEST;
            dispatch({
                type: actionType,
                payload: res.data
            })
        }
    } catch (err) {
        if( !isCancel(err) ) {
            dispatch({
                type: page === 1?AUTOCOMPLETE_ERROR:AUTOCOMPLETE_PAGINATION_ERROR,
                payload: { msg: err }
            })
        }
    }
}

export const getDeathAutoCompleteTest = (searchString, source, requestId, page= 1) => async (dispatch) => {
    try {
        if (!searchString) searchString = '';
        const res = await apiRequest(GET, `placeauthority/typeahead/search/${requestId}/page/${page}/${searchString}`, null, null, source);
        if( (res.data &&  page !== 1) || page === 1) {
            const actionType = page === 1 ? AUTOCOMPLETE_DEATH_TEST : AUTOCOMPLETE_DEATH_PAGINATION_TEST;
            dispatch({
                type: actionType,
                payload: res.data
            })
        }
    } catch (err) {
        if( !isCancel(err) ) {
            dispatch({
                type: page === 1?AUTOCOMPLETE_ERROR:AUTOCOMPLETE_PAGINATION_ERROR,
                payload: { msg: err }
            })
        }
    }
}

export const clearOptionsPayload = (type) => async (dispatch) => {
    try {
        if (type === "birthPlace"){
            dispatch({
                type: CLEAR_BIRTH_OPTIONS,
            })
        }
        else {
            dispatch({
                type: CLEAR_DEATH_OPTIONS,
            })
        }
    } catch (err) {
        if( !isCancel(err) ) {
            dispatch({
                type: AUTOCOMPLETE_ERROR,
                payload: { msg: err }
            })
        }
    }
}


export const addParent = (selectedNode) => async (dispatch) => {
    try {

        const parentPayload = getParentPayload(selectedNode);
        
        dispatch({
            type: SET_MODAL_DATA,
            payload: parentPayload
        })
      
        let res;

        if(selectedNode.fetchSiblings) res = await apiRequest(GET, `Persons/${selectedNode.treeId}/${selectedNode.childId}/SiblingsSharingSingleParent/${selectedNode.parentId}`);

        const result = getValuesForCheckBoxes(res ? res.data.SiblingInfo : []);
        
        dispatch({
            type: ADD_PARENT,
            payload: result
        })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const saveParent = (modalPerson) => async (dispatch) => {
    try {
        const parentData = saveParentPayload(modalPerson);
        if(trimString(parentData.parent.givenName) === "" && trimString(parentData.parent.surname) ==="")
        {
            dispatch(addMessage("First or last name is required.","error"));
        }
        else
        {
            dispatch({ type: PERSON_LOADING });
            dispatch({ type: FETCH_PARENTS });
            await apiRequest(POST, `Persons/parent`, parentData);
            let refetch = refetchLogic(modalPerson);
            dispatch({ type: SAVE_PARENT, payload: refetch  })
            let url = `/family/person-page/${modalPerson.treeId}/${modalPerson.id}`;
            setTimeout(() => {
                dispatch(addMessage(`${modalPerson.firstName} ${modalPerson.lastName} has been saved.`,"success",{url}));
            }, 2000);
        }
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
        dispatch(addMessage("Sorry, person couldn't be saved. Please try again.", "error"));
    }
}

export const addSpouse = (selectedNode) => async (dispatch) => {
    try {
        let res;
        const modalPayload = getSpousePayload(selectedNode);
        dispatch({
            type: SET_MODAL_DATA,
            payload: modalPayload
        })
        if(selectedNode.fetchChildren) res = await apiRequest(GET, `Persons/${selectedNode.treeId}/${selectedNode.treePersonId}/GetDirectChildren`);

        const result = getSpouseAndChildrenPayload(selectedNode, res ? res.data.SiblingInfo : []);

        dispatch({
            type: ADD_SPOUSE,
            payload: result
        })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const saveSpouse = (newPerson, modalPerson) => async (dispatch) => {
    try {
        const spouseData = saveSpousePayload(newPerson, modalPerson);
        if(trimString(spouseData.spouse.givenName) ==="" && trimString(spouseData.spouse.surname) ==="")
        {
            dispatch(addMessage("First or last name is required.","error"));
        }
        else
        {
            dispatch({ type: PERSON_LOADING });
            dispatch({ type: FETCH_SPOUSES });

            await apiRequest(POST, `Persons/spouse`, spouseData);
            let refetch = refetchLogic(modalPerson);
            dispatch({ type: SAVE_SPOUSE,  payload: refetch })
            let url = `/family/person-page/${modalPerson.treeId}/${modalPerson.id}`;
            setTimeout(() => {
                dispatch(addMessage(`${modalPerson.firstName} ${modalPerson.lastName} has been saved.`, "success",{url}));
            }, 1000);
        }
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
        dispatch(addMessage("Sorry, person couldn't be saved. Please try again.", "error"));
    }
}

export const addSibling = (selectedNode) => async (dispatch) => {
    try {
        let res = false;
        const { treeId, primaryPersonId } = selectedNode;

        const siblingPayload = getSiblingPayload(selectedNode);
        
        dispatch({
            type: SET_MODAL_DATA,
            payload: siblingPayload
        })

        if(selectedNode.fetchParents) res = await apiRequest(GET, `persons/${treeId}/${primaryPersonId}/parentsinfo?addUnknownParents=1`);

        const result = getSiblingDropdown(res ? res.data.Parents : []);

        dispatch({
            type: ADD_SIBLING,
            payload: result
        })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const saveSibling = (newPerson, modalPerson) => async (dispatch) => {
    try {
        const siblingData = saveSiblingPayload(newPerson, modalPerson);
        if(trimString(siblingData.child.givenName) ==="" && trimString(siblingData.child.surname) ==="")
        {
            dispatch(addMessage("First or last name is required.","error"));
        }
        else if(siblingData.existingParentIds.length === 1 && siblingData.NewParent && trimString(siblingData.NewParent.givenName) === "" && trimString(siblingData.NewParent.surname) === "")
            dispatch(addMessage("Unknown parent's first or last name is required.","error"));
        else
        {
            dispatch({ type: PERSON_LOADING });
            dispatch({ type: FETCH_PARENTS });
            await apiRequest(POST, `Persons/sibling`, siblingData);
            let refetch = refetchLogic(modalPerson);
            dispatch({ type: SAVE_SIBLING,  payload: refetch })
            if(modalPerson.pfirstName || modalPerson.plastName){
                let url1 = `/family/person-page/${modalPerson.treeId}/${siblingData.NewParent.id}`;
                setTimeout(() => {
                    dispatch(addMessage(`${modalPerson.pfirstName} ${modalPerson.plastName} has been saved.`,"success",{url: url1}));
                }, 1000);
            }
            let url = `/family/person-page/${modalPerson.treeId}/${modalPerson.id}`;
                dispatch(addMessage(`${modalPerson.firstName} ${modalPerson.lastName} has been saved.`,"success",{url}));
        }
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
        dispatch(addMessage("Sorry, person couldn't be saved. Please try again.", "error"));
    }
}

export const addChild = (selectedNode) => async (dispatch) => {
    try {       
        const spousesPayload = getChildPayload(selectedNode);   
        dispatch({
            type: SET_MODAL_DATA,
            payload: spousesPayload
        })
        const res = await apiRequest(GET, `Persons/${selectedNode.treeId}/${selectedNode.treePersonId}/spouses`);

        const result = getParentAndSpousesPayload(selectedNode, res ? res.data.Spouses : []);

        dispatch({
            type: ADD_CHILD,
            payload: result
        })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const saveChild = (newPerson, modalPerson) => async (dispatch) => {
    try {
        const childData = saveSiblingPayload(newPerson, modalPerson);  //Payload is same for sibling & child
        if(trimString(childData.child.givenName) === "" && trimString(childData.child.surname) === "")
        {
            dispatch(addMessage("First or last name is required.","error"));
        }
        else if(childData.existingParentIds.length === 1 && childData.NewParent && trimString(childData.NewParent.givenName) === "" && trimString(childData.NewParent.surname) === "")
             dispatch(addMessage("Unknown parent's first or last name is required.","error"));
        else
        {
            dispatch({ type: PERSON_LOADING });
            dispatch({ type: FETCH_SPOUSES });
            await apiRequest(POST, `Persons/child`, childData);
            let refetch = refetchLogic(modalPerson);
            if(modalPerson.pfirstName || modalPerson.plastName){
                let url1 = `/family/person-page/${modalPerson.treeId}/${childData.NewParent.id}`;
                setTimeout(() => {
                    dispatch(addMessage(`${modalPerson.pfirstName} ${modalPerson.plastName} has been saved.`,"success",{url: url1}));
                }, 1000);
            }
            dispatch({ type: SAVE_CHILD,  payload: refetch })
            let url = `/family/person-page/${modalPerson.treeId}/${modalPerson.id}`;
            dispatch(addMessage(`${modalPerson.firstName} ${modalPerson.lastName} has been saved.`,"success",{url}));
        }
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
        dispatch(addMessage("Sorry, person couldn't be saved. Please try again.", "error"));
    }
}

export const addFamily = () => async (dispatch) => {
    try {
        const res = {
            data: {
                firstName: "",
                lastName: "",
                isLiving: "true",
                gender: "",
                birth: "",
                birthPlace: "",
                death: "",
                deathPlace: "",
            }
        }
        dispatch({
            type: ADD_FAMILY,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const cancelModal = () => async (dispatch) => {
    try {
        dispatch({ type: CANCEL_MODAL })
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

    
export const addProfileImage = (imagePayload, personCheck, fam) => async (dispatch) => {
    try {
        dispatch({ type: IMAGE_LOADING });
        if (personCheck) {
            dispatch({
                type: ADD_PERSON_THUMBNAIL,
                payload: imagePayload
            })
            dispatch({ type: IMAGE_UNLOADING });
        }
        else {
            dispatch({ type: SET_NEW_FAMILY_PAYLOAD, payload: fam });
            dispatch({ type: IMAGE_UNLOADING });
        }
        const payload = imageUploadPayload(imagePayload);
        await apiRequest(POST, `Media/uploadprofileimage`, payload);

        dispatch({ type: SAVE_PROFILE_IMAGE});
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
    }
}

export const deleteProfileImage = (treePersonId) => async (dispatch) => {
    try {
        dispatch({ type: IMAGE_LOADING });
        await apiRequest(DELETE, `Persons/deleteprofileimage/${treePersonId}`);
        dispatch({ type: SAVE_PROFILE_IMAGE});
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
    }
}

export const getProfileImage = (profileImageId, heroImage) => async (dispatch) => {
    try {     
        dispatch({ type: FETCHING_IMAGE });  
        const res = await apiRequest(GET, `Media/${profileImageId}/OriginalImage`);
        if(!heroImage){
            dispatch({
                type: GET_PROFILE_IMAGE,
                payload: res.data
            })
        }
        else {
            dispatch({
                type: GET_HERO_IMAGE,
                payload: res.data
            })
        }
    } catch (err) {
        dispatch({
            type: FAMILY_ERROR,
            payload: { msg: err }
        })
    }
}

export const editProfileImage = (imagePayload, personCheck) => async (dispatch) => {
    try {
        dispatch({ type: IMAGE_LOADING });
        if (personCheck) {
            dispatch({
                type: ADD_PERSON_THUMBNAIL,
                payload: imagePayload
            })
            dispatch({ type: IMAGE_UNLOADING });
        }
        const payload = editImageUploadPayload(imagePayload);
        await apiRequest(POST, `Media/editprofileimage`, payload);

        dispatch({ type: SAVE_PROFILE_IMAGE});
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
    }
}

export const clearImage = () => async (dispatch) => {
    try {
        dispatch({ type: CLEAR_IMAGE });
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
    }
}

export const showImage = () => async (dispatch) => {
    try {
        dispatch({ type: SHOW_IMAGE });
    } catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
    }
}

export const getRepresentInfo = (userId, treeId, primaryPersonId) => async(dispatch) => {
    try {
        const res = await apiRequest(GET, `Trees/${userId}/${treeId}/representingpersoninfo`);
        if(primaryPersonId === res.data.treePersonId && res.data.profileImageUrl !== null){
                dispatch({ type: REFETCH_PAGE_AFTER_UPLOAD });
        }
    }
    catch (err) {
        dispatch({
            type: SAVE_ERROR,
            payload: { msg: err }
        })
    }
}
