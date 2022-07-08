import {
    actionCreator,
    callApi
} from './../utils';
import * as CONSTANTS from './../constants/actionTypes';
import * as API_URLS from './../constants/apiUrl';

import { v4 as uuidv4 } from "uuid";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
    return {
        "wa-clientId": CLIENT_ID,
        "wa-requestId": uuidv4(),
    }
}

export const researchSavedRecord = data => {
    return (dispatch, getState) => {

        let url = API_URLS.researchSavedRecord(data), staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.RESEARCHSAVEDRECORD.REQUEST))
        callApi(getState, 'GET', url, {}, false, staticHeader).then((res) => {
            const dataResponse = res.data;
            dispatch(actionCreator(CONSTANTS.RESEARCHSAVEDRECORD.SUCCESS, dataResponse))
        }).catch(err => {
            dispatch(actionCreator(CONSTANTS.RESEARCHSAVEDRECORD.FAILURE))
        })
    }
}

export const textMsgFlag = data => {
    return (dispatch) => {
        if (data?.flag) {
            dispatch(actionCreator(CONSTANTS.SAVERECORDMSG.SUCCESS,data))
        } else {
            dispatch(actionCreator(CONSTANTS.SAVERECORDMSG.FAILURE))
        }
    }
}