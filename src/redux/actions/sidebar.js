import {
  actionCreator,
  callApi,
  checkCompareData,
  compareTossdi,
} from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { SsdiComparedTo, NewspaperComparedTo } from "./../../data";
import { getRecordHeadersCount } from "../utils/catalogForm";
import { getDate, getMaskDate } from "../../utils"
import { v4 as uuidv4 } from "uuid";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const newspaper = (requestData) => {
  return (dispatch, getState) => {
    let url = API_URLS.API_BASEPATH + requestData.api_path;
    dispatch(actionCreator(CONSTANTS.NEWSPAPER.REQUEST));
    dispatch(actionCreator(CONSTANTS.NEWSPAPER.REQUEST));
    callApi(getState, "GET", url, requestData, false)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.NEWSPAPER.SUCCESS, res.data));
        dispatch(
          actionCreator(
            CONSTANTS.NEWSPAPERCOMPARETO.SUCCESS,
            NewspaperComparedTo
          )
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.NEWSPAPER.FAILURE));
      });
  };
};

export const ssdi = (requestData) => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.SSID.REQUEST));
    let url = API_URLS.API_BASEPATH + requestData.api_path;
    callApi(getState, "GET", url, requestData, false)
      .then((res) => {
        let { data, compareTo } = compareTossdi(res.data, SsdiComparedTo);
        dispatch(actionCreator(CONSTANTS.SSID.SUCCESS, data));
        dispatch(actionCreator(CONSTANTS.SSDICOMPARETO.SUCCESS, compareTo));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.SSID.FAILURE));
      });
  };
};
export const census = (requestData) => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.CENSUS.REQUEST));
    dispatch(actionCreator(CONSTANTS.CENSUSCOMPARETO.REQUEST));
    let url = API_URLS.API_BASEPATH + requestData.api_path;
    callApi(getState, "GET", url, requestData, false)
      .then(async (res) => {
        const dataResponse = res.data;
        const compareToData = false; // generateData function call dataResponse;
        const { data, compareTo, compareToProfile } = await checkCompareData(
          dataResponse,
          compareToData
        );
        dispatch(actionCreator(CONSTANTS.CENSUS.SUCCESS, data));
        if (compareTo) {
          dispatch(
            actionCreator(CONSTANTS.CENSUSCOMPARETO.SUCCESS, compareToProfile)
          );
        }
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.CENSUS.FAILURE));
      });
  };
};
export const saveToTree = (data) => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.SAVETREE.SUCCESS, data));
  };
};
export const getTrees = (userId) => {
  return (dispatch, getState) => {
    let url = API_URLS.userTrees(userId),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.USERTREES.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        const dataResponse = res.data;
        dispatch(actionCreator(CONSTANTS.USERTREES.SUCCESS, dataResponse));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USERTREES.FAILURE));
      });
  };
};
export const treePeopleList = ({ treeId }) => {
  return (dispatch, getState) => {
    let url;
    if (treeId) {
      url = API_URLS.treePeople(treeId)
    } else {
      url = API_URLS.getAllPersons
    }
    const staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.TREEPEOPLE.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        const dataResponse = res.data;
        dispatch(actionCreator(CONSTANTS.TREEPEOPLE.SUCCESS, dataResponse));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.TREEPEOPLE.FAILURE));
      });
  };
};
const getImageId = (item) => item?.image_id || item?.imageID;
const getDateField = (obj, items, _key, _label) => {
  if (items[_key]?.rawDate) {
    obj[_label] = getDate(items[_key]);
  } else if(items[_key]?.date || items[_key]?.month || items[_key]?.year) {
      obj[_label] = getMaskDate(items[_key]);
    }
};
const dataListRecords = (profile, cKeys, dataSource) => {
  let obj = {
    recordId: profile?.recordId,
    partitionKey: profile?.partitionKey,
    imageId: getImageId(profile),
  };
  Object.entries(cKeys).forEach((_obj) => {
    const _label = _obj[0];
    const _key = _obj[1];
    _key.forEach((element) => {
      if (profile[element.key]) {
        if (!obj[_label]) {
          if (element.type === "GUID" && element.indexSearchiness === "Place") {
            obj[_label] = profile[element.key]?.fullChainName;
          } else if (element.type === "Date") {
            getDateField(obj, profile, element.key, _label);
          } else {
            obj[_label] = profile[element.key]?.value;
          }
        }
      }
    });
  });
  return dataSource.push({ ...obj, family: profile?.family });
};
export const getViewRecords = (data, isUniverse = false) => {
  return async (dispatch, getState) => {
    let { ssidDataSource, contentCatalog } = getState().sidebar;
    let cKeys = {},
      dataSource = [];
    const filterArr = ssidDataSource.filter(
      (item) => item.recordId === data.recordId
    )?.[0];
    let guid = data?.partitionKey.split("@")[0];
    let _url = API_URLS.getContentCatalog({ partitionKey: guid }),
      staticheader = createHeader();
    if (isUniverse) {
      const contentCatalogApi = await callApi(
        getState,
        "GET",
        _url,
        {},
        false,
        staticheader
      );
      contentCatalog = contentCatalogApi.data;
    }
    if (!filterArr) {
      const contentCatalogApi = await callApi(
        getState,
        "GET",
        _url,
        {},
        false,
        staticheader
      );
      contentCatalog = contentCatalogApi.data;
      const url = API_URLS.viewRecord(data),
        staticHeader = createHeader();
      dispatch(actionCreator(CONSTANTS.SSID.REQUEST));
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          const profile = res.data;
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          getRecordHeadersCount(contentCatalog, cKeys);
          dataListRecords(profile, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.SSID.SUCCESS, ...dataSource));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.SSID.FAILURE));
        });
    } else {
      dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog));
      getRecordHeadersCount(contentCatalog, cKeys);
      dataListRecords(filterArr, cKeys, dataSource);
      dispatch(actionCreator(CONSTANTS.SSID.SUCCESS, ...dataSource));
    }
  };
};

export const saveToTreePost = (
  paramData,
  postData,
  user,
  history,
  setShowErrorStoryDropdown
) => {
  return (dispatch, getState) => {
    let url = API_URLS.saveToTreeApi(paramData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.SAVETOTREE.REQUEST));
    callApi(getState, "POST", url, postData, false, staticHeader)
      .then((res) => {
        const dataResponse = res.data;
        dispatch(actionCreator(CONSTANTS.SAVETOTREE.SUCCESS, dataResponse));
        dispatch(actionCreator(CONSTANTS.SAVERECORDMSG.SUCCESS, user));
        history.push(
          `/family/person-page/${postData.treeId}/${postData.treePersonId}?tab=2`
        );
      })
      .catch((err) => {
        setShowErrorStoryDropdown(true);
        dispatch(
          actionCreator(CONSTANTS.SAVETOTREE.FAILURE, err.response.data)
        );
      });
  };
};

export const getContentCatalog = (param) => {
  return (dispatch, getState) => {
    let url = API_URLS.getContentCatalog(param),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.REQUEST));
    callApi(getState, "GET", url, {}, false, staticHeader)
      .then((res) => {
        const dataResponse = res.data;
        dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, dataResponse));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.FAILURE, err.response));
      });
  };
};

export function updateContentCatalog() {
  return (dispatch) => {
    dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, null));
  };
}
