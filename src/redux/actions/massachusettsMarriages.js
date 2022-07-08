import * as CONSTANTS from "./../constants/actionTypes";
import { actionCreator, callApi } from "./../utils";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import {
  getResidence,
  getLevelCheck,
  encodeDataToURL,
  formDataTrim,
  MassachusettsMarriagesPK,
} from "../../utils";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  levelCheck = getLevelCheck(),
  residence = getResidence();
const getMassachusettsMarriagesLevelLocation = (
  level,
  id,
  parentData,
  options,
  optionsLevel
) => {
  if (levelCheck[level]) {
    const type = levelCheck[level];
    if (residence[type] && !options[type]) {
      options[type] = id;
      optionsLevel[residence[type]] = type;
    }
  }
  if (parentData) {
    return getMassachusettsMarriagesLevelLocation(
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
    dispatch({ type: CONSTANTS.MMPAGELOADER });
  };
};
export const getLocationGUID = (id) => {
  let url = `${API_URLS.PLACEAUTHIRITY}/${id}`,
    staticHeader = createHeader();
  return callApi({}, "GET", url, null, false, staticHeader)
    .then((res) => {
      const data = res.data;
      let { options, optionsLevel } = getMassachusettsMarriagesLevelLocation(
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
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const getMMURLString = async (_values) => {
  let MMli = {};
  if (_values.li?.i) {
    delete _values.l;
    let levelData = null;

    if (!_values?.LocationField?.levelData) {
      levelData = await getLocationGUID(_values.li.i);
    } else {
      levelData = _values.LocationField.levelData;
      delete _values.LocationField;
    }
    MMli = {
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
  return encodeDataToURL({ ..._values, ...MMli });
};
export const submitMMForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().massachusettsMarriages,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getMMURLString(valueData),
        url = API_URLS.MMSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.MMPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.MMMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.MM.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = MassachusettsMarriagesPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: MassachusettsMarriagesPK,
            }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const MMDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(MMDataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.MMSEARCHQUERY.SUCCESS, _value));
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              MMDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.MM.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.MMPAGINATION.SUCCESS,
              MMDataList.total !== -1 ? MMDataList.total : 0
            )
          );
          dispatch(actionCreator(CONSTANTS.MMMASKINGFIELD.SUCCESS, maskedList));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.MM.FAILURE));
        });
    }
  };
};
export const clearMMFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.MMSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.MMPAGINATION.SUCCESS, 0));
  };
};
