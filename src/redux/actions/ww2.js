import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, wwiGUID, wwiiPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getWWIIDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.WWIIDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(wwiiPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.WWIIDROPDOWN.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.WWIIDROPDOWN.FAILURE));
      });
  };
};
export const getWw2URLString = (_values) => {
  if (_values?.b?.li?.i === "") {
    delete _values.b.li.i;
  }
  if (_values?.ep?.li?.i === "") {
    delete _values.ep.li.i;
  }
  if (_values?.s?.li?.i === "") {
    delete _values.s.li.i;
  }
  if (_values?.b?.y?.y === "") {
    delete _values.b.y.y;
  }
  return encodeDataToURL({ ..._values });
};
export const submitWW2Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().ww2,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getWw2URLString(valueData),
        url = API_URLS.WW2SEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.WW2PAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.WW2MASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.WW2.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = wwiGUID;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: wwiiPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const wwiiDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(wwiiDataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.WW2SEARCHQUERY.SUCCESS, _value));
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              wwiiDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.WW2.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.WW2PAGINATION.SUCCESS,
              wwiiDataList.total !== -1 ? wwiiDataList.total : 0
            )
          );
          dispatch(
            actionCreator(CONSTANTS.WW2MASKINGFIELD.SUCCESS, maskedList)
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.WW2.FAILURE));
        });
    }
  };
};
export const clearWwiiFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.WW2SEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.WW2PAGINATION.SUCCESS, 0));
  };
};
