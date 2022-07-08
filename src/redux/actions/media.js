import * as API_URLS from "./../constants/apiUrl";
import * as CONSTANTS from "./../constants/actionTypes";
import { v4 as uuidv4 } from "uuid";
import { actionCreator, callApi } from "../utils";
import { addMessage } from "./toastr";
import { FEATURED_STORY_ID_REDIRECT, RESET_MEDIA } from "../constants";


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;


const createHeader = () => {
    return {
        "wa-clientId": CLIENT_ID,
        "wa-requestId": uuidv4(),
    };
};


export const getMedia = (mediaId) => {
    let requestData = { mediaId: mediaId };
    return (dispatch, getState) => {
        let url = API_URLS.getMedia(requestData),
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.MEDIA.REQUEST));
       return callApi(getState, "GET", url, requestData, false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.MEDIA.SUCCESS, res.data || {}));
                return res.data
            })
            .catch(() => {
                dispatch(actionCreator(CONSTANTS.MEDIA.FAILURE));
            });
    };
};

export const updateMediaMetaData = (data ,mediaId , showEditDialog ) => {
    return (dispatch, getState) => {
        let url = API_URLS.UPDATEMEDIAMETADATA,
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.UPDATEMEDIAMETADATA.REQUEST));
        callApi(getState, "POST", url, data, false, staticHeader)
            .then((res) => {
                showEditDialog(false)
                dispatch(actionCreator(CONSTANTS.UPDATEMEDIAMETADATA.SUCCESS, data));
                dispatch(getMedia(mediaId));
                dispatch(addMessage("Media Updated Succesfully"))
            })
            .catch(() => {
                dispatch(actionCreator(CONSTANTS.UPDATEMEDIAMETADATA.FAILURE));
                dispatch(addMessage("Sorry, media not saved. Please try again.", "error"));
            });
    };
};

  export const getUserDetails = (userId) => {
    let requestData = { userId: userId };
    return (dispatch, getState) => {
        let url = API_URLS.getUserDetail(requestData),
            staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.GETUSERDETAILS.REQUEST));
        callApi(getState, "GET", url, requestData, false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.GETUSERDETAILS.SUCCESS, res.data || {}));
            })
            .catch(() => {
                dispatch(actionCreator(CONSTANTS.GETUSERDETAILS.FAILURE));
            });
    };
};

export const addPersonToMedia = (personId ,mediaId , showEditDialog ) => {
    return (dispatch, getState) => {
        let url = API_URLS.ADDPERSONTOMEDIA,
            staticHeader = createHeader();
            const requestData = {
                personId : personId,
                mediaId : mediaId
            }
        dispatch(actionCreator(CONSTANTS.ADDPERSONTOMEDIA.REQUEST));
        callApi(getState, "POST", url, requestData, false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.ADDPERSONTOMEDIA.SUCCESS, res.data));
                dispatch(getMedia(mediaId));
                dispatch(addMessage("Media Updated Succesfully"))
                showEditDialog(false)
            })
            .catch(() => {
                dispatch(actionCreator(CONSTANTS.ADDPERSONTOMEDIA.FAILURE));
                dispatch(addMessage("Sorry, media not saved. Please try again.", "error"));
            });
    };
};

export const removePersonFromMedia = (personId ,mediaId ) => {
    return (dispatch, getState) => {
        let url = API_URLS.REMOVEPERSONFROMMEDIA,
            staticHeader = createHeader();
            const requestData = {
                personId : personId,
                mediaId : mediaId
            }
        dispatch(actionCreator(CONSTANTS.REMOVEPERSONFROMMEDIA.REQUEST));
        callApi(getState, "POST", url, requestData, false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.REMOVEPERSONFROMMEDIA.SUCCESS, res.data));
                dispatch(getMedia(mediaId));
                dispatch(addMessage("Person has been removed successfully from this media"))
            })
            .catch(() => {
                dispatch(actionCreator(CONSTANTS.REMOVEPERSONFROMMEDIA.FAILURE));
                dispatch(addMessage("something went wrong", "error"));
            });
    };
};

export const resetMedia = () => {
    return (dispatch) => {
        dispatch({
            type: RESET_MEDIA,
            payload: {}
        })
    }
}

export const featuredStoryRedirect = (id) => {
    return (dispatch) => {
        dispatch({
            type: FEATURED_STORY_ID_REDIRECT,
            payload: id
        })
    }
}
