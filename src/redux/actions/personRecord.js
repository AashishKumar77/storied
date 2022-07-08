import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi, getUSFieldValue } from "../utils";
import fieldList from "../utils/fieldList.json";
import { addMessage } from "./toastr";
import { v4 as uuidv4 } from "uuid";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
const getFieldData = (appenedFile, name, item, filed, maskingFields) => {
  let data = [],
    mask = [];
  if (item[filed[0].key]) {
    getUSFieldValue(data, mask, filed[0].key, filed[0].type, item[filed[0].key], maskingFields);
  } else if (filed[1] && item[filed[1].key]) {
    getUSFieldValue(data, mask, filed[0].key, filed[1].type, item[filed[1].key], maskingFields);
  }
  if (data.length !== 0) {
    appenedFile.push({
      key: name,
      value: data,
      mask: mask[0],
    });
  }
};
export const submitPersonSearchForm = (personId, isLoggedIn = false) => {
  return async (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.PERSONRECORDSEARCH.REQUEST));
    let url = `${API_URLS.PERSONRRECORDSAPI(personId)}`,
      staticHeader = createHeader();
    staticHeader.isloggedin = isLoggedIn;
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        let resp = res.data;
        resp.documents = resp.documents.map((item) => {
          let appenedFile = [];
          fieldList.forEach((_filed) => {
            if (typeof _filed.label === "string") {
              item && getFieldData(appenedFile, _filed.label, item, _filed.data);
            }
          });
          return { ...item, appenedFiles: appenedFile };
        });
        dispatch(actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, resp?.documents));
        dispatch(actionCreator(CONSTANTS.PERSONRECORDSEARCH.SUCCESS, resp));
      })
      .catch(() => {
        dispatch(actionCreator(CONSTANTS.PERSONRECORDSEARCH.FAILURE));
      });
  };
};
export const clearPersonFormQuery = () => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.PERSONRECORDSEARCH.FAILURE));
  };
};

export const getPersonsClue = (personId) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.PERSONCLUEAPI({ personId })}`,
      staticHeader = createHeader();
    dispatch({ type: CONSTANTS.PERSONCLUE.REQUEST });
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch({ type: CONSTANTS.PERSONCLUE.SUCCESS, payload: res.data });
      })
      .catch((err) => {
        const { response } = err;
        if (response.status === 404) {
          dispatch(addMessage(`${response}`, "error"));
        } else {
          dispatch(addMessage("Something went wrong", "error"));
        }
        dispatch({ type: CONSTANTS.PERSONCLUE.FAILURE });
      });
  };
};
export const clearPersonsClue = () => (dispatch) => {
  dispatch({ type: CONSTANTS.PERSONCLUE.SUCCESS, payload: null });
};
