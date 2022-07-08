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
export const getnotification = ({ pageNumber = 1, pageSize = 10 }) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.getNotifications}/${pageNumber}/${pageSize}`;
    let staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETNOTIF.REQUEST));
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETNOTIF.SUCCESS, res.data));
      })
      .catch((err) => {
        const data = ["3b411ef8-539f-455e-b439-0bb2988ef4c8|587ab728-26aa-41c4-bbc2-eceb5dad9df3|2628883c-2117-4b9a-9555-3f3a842ffcf8|True", "3b411ef8-539f-455e-b439-0bb2988ef4c4|954883c9-bf9c-4a78-84de-19fc83113c6e|2628883c-2117-4b9a-9555-3f3a842ffcf8|False", "3b411ef8-539f-455e-b439-0bb2988ef438|925ae6e9-cbd5-40f5-975a-a3ee5ab216c4|2628883c-2117-4b9a-9555-3f3a842ffcf8|True", "3b411ef8-539f-455e-b439-0bb2988ef2c8|d554e6a1-5456-44a5-ad05-2b67e18ceec6|2628883c-2117-4b9a-9555-3f3a842ffcf8|False", "3b411ef8-539f-455e-b439-0bb2982ef4c8|1b3749fc-f776-415d-a343-c80747947b82|2628883c-2117-4b9a-9555-3f3a842ffcf8|False", "3b411ef8-539f-455e-b439-0bb2918ef4c8|1a3cf787-78ae-4f62-ad63-3db0e7f54399|2628883c-2117-4b9a-9555-3f3a842ffcf8|True"];
        dispatch(actionCreator(CONSTANTS.GETNOTIF.SUCCESS, data));
      });
  };
};
export const getActulNotification = (notifId, storyId, userId, isRead = false) => {
  let userUrl = API_URLS.getADB2CUserInfo(userId),
    storyUrl = API_URLS.viewStory({ storyId }),
    staticHeader = createHeader();
  return async (dispatch, getState) => {
    let userData = await callApi(getState, "GET", userUrl, null, false, staticHeader),
      storyData = await callApi(getState, "GET", storyUrl, null, false, staticHeader);
    const dispatchParams = {
      notifId,
      user: userData.data,
      story: storyData.data,
      isRead,
    };
    dispatch(actionCreator(CONSTANTS.GETACTUALNOTIF.SUCCESS, dispatchParams));
  };
};
export const markReadNotification = (notifId) => {
  return (dispatch, getState) => {
    let url = `${API_URLS.MarkedRead}/${notifId}`,
      staticHeader = createHeader();
    callApi(getState, "PUT", url, {}, false, staticHeader)
      .then((res) => {
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const updateLastTimeUserSawNotification = () => {
  return (dispatch, getState) => {
    let url = `${API_URLS.updateLastTimeUserSawNotification}`,
      staticHeader = createHeader();
    callApi(getState, "PUT", url, {}, false, staticHeader)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  };
};
export const updateNotifCount = (count) => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.UPDATENOTIFCOUNT.SUCCESS, count));
  };
};

export const refreshNotif = () => {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.REFRESHNOTIF.SUCCESS));
  }
}