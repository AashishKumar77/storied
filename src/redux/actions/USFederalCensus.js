import * as CONSTANTS from "./../constants/actionTypes";
import { actionCreator, callApi } from "./../utils";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import {
  censusGUID,
  encodeDataToURL,
  formDataTrim,
  censusPK,
} from "../../utils";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSFederalCensusDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS.REQUEST));
    let url = API_URLS.getFormDropdowns(censusGUID),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS.FAILURE));
      });
  };
};
export const getCensusURLString = (_values) => {
  if (_values?.b?.li?.i === "") {
    delete _values.b.li.i;
  }
  if (_values?.r?.rp?.li?.i === "") {
    delete _values.r.rp.li.i;
  }
  if (_values?.r?.rpp?.li?.i === "") {
    delete _values.r.rpp.li.i;
  }
  if (_values?.b?.y?.y === "") {
    delete _values.b.y.y;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUSFederalCensusForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().USFederalCensus,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getCensusURLString(valueData),
        url = API_URLS.USFEDERALCENSUSSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUSPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUSMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.USFEDERALCENSUSLIST.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = censusGUID;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: censusPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const usDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(usDataList, cKeys, dataSource);
          dispatch(
            actionCreator(CONSTANTS.USFEDERALSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              usDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.USFEDERALCENSUSLIST.SUCCESS, dataSource)
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUSPAGINATION.SUCCESS,
              usDataList.total !== -1 ? usDataList.total : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUSMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUSLIST.FAILURE));
        });
    }
  };
};
export const clearUsFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUSPAGINATION.SUCCESS, 0));
  };
};
