import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, massachussetsPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getmassachusettsURLString = (_values) => {
  if (_values?.d?.li?.i === "") {
    delete _values.d.li.i;
  }
  return encodeDataToURL({ ..._values });
};

export const submitMassachusettsForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().massachussets,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getmassachusettsURLString({
          ...formDataTrim(valueData),
        }),
        url = API_URLS.MASSACHUSSETS + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.MASSACHUSSETSPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.MASSACHUSSETSMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.MASSACHUSSETS.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = massachussetsPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: massachussetsPK,
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
          const massachussetsDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            massachussetsDataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(CONSTANTS.MASSACHUSSETSSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              massachussetsDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.MASSACHUSSETS.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.MASSACHUSSETSPAGINATION.SUCCESS,
              massachussetsDataList.total !== -1
                ? massachussetsDataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.MASSACHUSSETSMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.MASSACHUSSETS.FAILURE));
        });
    }
  };
};
export const clearMassachussetsFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.MASSACHUSSETSSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.MASSACHUSSETSPAGINATION.SUCCESS, 0));
  };
};
