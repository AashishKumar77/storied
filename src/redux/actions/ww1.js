import * as CONSTANTS from "./../constants/actionTypes";
import { actionCreator, callApi } from "./../utils";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import {
  getResidence,
  getLevelCheck,
  encodeDataToURL,
  formDataTrim,
  wwiGUID,
  wwiPK,
} from "../../utils";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  levelCheck = getLevelCheck(),
  residence = getResidence();
const getWwiLevelLocation = (level, id, parentData, options, optionsLevel) => {
  if (levelCheck[level]) {
    const type = levelCheck[level];
    if (residence[type] && !options[type]) {
      options[type] = id;
      optionsLevel[residence[type]] = type;
    }
  }
  if (parentData) {
    return getWwiLevelLocation(
      parentData.level,
      parentData.placeId,
      parentData.parent,
      options,
      optionsLevel
    );
  }
  return {
    options,
    optionsLevel,
  };
};
export const pageLoader = () => {
  return (dispatch) => {
    dispatch({ type: CONSTANTS.WWIPAGELOADER });
  };
};
export const getLocationGUID = (id) => {
  let url = `${API_URLS.PLACEAUTHIRITY}/${id}`,
    staticHeader = createHeader();
  return callApi({}, "GET", url, null, false, staticHeader)
    .then((res) => {
      const data = res.data;
      let { options, optionsLevel } = getWwiLevelLocation(
        data.level,
        id,
        data.parent,
        {},
        {}
      );
      options["search.form.dropdown.broad"] = id;
      optionsLevel["4"] = "search.form.dropdown.broad";
      return {
        residenceId: options,
        residenceLevel: optionsLevel,
      };
    })
    .catch((err) => {
      return {
        residenceId: {},
        residenceLevel: {},
      };
    });
};
export const getWWIList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.WW1DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(wwiPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.WW1DROPDOWN.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.WW1DROPDOWN.FAILURE));
      });
  };
};
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const getWw1URLString = async (_values) => {
  let li = {};
  if (_values.li?.i) {
    delete _values.l;
    let levelData = null;
    if (!_values?.LocationField?.levelData) {
      levelData = await getLocationGUID(_values.li.i);
    } else {
      levelData = _values.LocationField.levelData;
      delete _values.LocationField;
    }
    li = {
      li: {
        i: levelData?.residenceId[levelData.residenceLevel[_values.li.s]],
        s: _values.li.s,
      },
    };
  } else if (_values.l?.l) {
    delete _values.li;
  } else {
    delete _values.li;
    delete _values.l;
  }
  return encodeDataToURL({ ..._values, ...li });
};
export const submitWW1Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().ww1,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getWw1URLString(valueData),
        url = API_URLS.WWISEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.WW1PAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.WW1MASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.WW1.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = wwiGUID;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: wwiPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const wwiDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(wwiDataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.WW1SEARCHQUERY.SUCCESS, _value));
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              wwiDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.WW1.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.WW1PAGINATION.SUCCESS,
              wwiDataList.total !== -1 ? wwiDataList.total : 0
            )
          );
          dispatch(
            actionCreator(CONSTANTS.WW1MASKINGFIELD.SUCCESS, maskedList)
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.WW1.FAILURE));
        });
    }
  };
};
export const clearWwiFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.WW1SEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.WW1PAGINATION.SUCCESS, 0));
  };
};
