import { actionCreator, callApi } from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const getPublicationList = (params, newRequest = true) => {
  return (dispatch, getState) => {
    let url = API_URLS.getPublications + `?` + params,
      staticHeader = createHeader();
    if (newRequest) {
      dispatch(actionCreator(CONSTANTS.GETPUBLICTAION.REQUEST));
    } else {
      dispatch(actionCreator(CONSTANTS.GETPUBLICTAIONPAGINATION.REQUEST));
    }
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETPUBLICTAION.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.GETPUBLICTAION.FAILURE, err));
      });
  };
};
