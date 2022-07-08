import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, OhioPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getOhioURLString = (_values) => {
  if (_values?.d?.li?.i === "") {
    delete _values.d.li.i;
  }
  return encodeDataToURL({ ..._values });
};

export const submitOhioForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().ohioDeaths,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getOhioURLString({
          ...formDataTrim(valueData),
        }),
        url = API_URLS.OHIODEATHS + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.OHIODEATHSPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.OHIODEATHSMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.OHIODEATHS.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = OhioPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: OhioPK,
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
          const ohioDeathsDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            ohioDeathsDataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(CONSTANTS.OHIODEATHSSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              ohioDeathsDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.OHIODEATHS.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.OHIODEATHSPAGINATION.SUCCESS,
              ohioDeathsDataList.total !== -1
                ? ohioDeathsDataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.OHIODEATHSMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.OHIODEATHS.FAILURE));
        });
    }
  };
};
export const clearOhioFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.OHIODEATHSSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.OHIODEATHSPAGINATION.SUCCESS, 0));
  };
};
