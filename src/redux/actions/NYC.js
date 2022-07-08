import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, NYCMarriagesPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getNYCDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.NYCDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(NYCMarriagesPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.NYCDROPDOWN.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.NYCDROPDOWN.FAILURE));
      });
  };
};

export const getNYCURLString = (_values) => {
  if (_values?.m?.li?.i === "") {
    delete _values.m.li.i;
  }
  return encodeDataToURL({ ..._values });
};

export const submitNYCForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().nyc,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getNYCURLString({ ...formDataTrim(valueData) }),
        url = API_URLS.NYC + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.NYCPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.NYCMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.NYC.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = NYCMarriagesPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: NYCMarriagesPK,
            }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(getState, "GET", _url, {}, false, staticheader);
          const NYCDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(NYCDataList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.NYCSEARCHQUERY.SUCCESS, _value));
          dispatch(actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, NYCDataList?.documents));
          dispatch(actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog));
          dispatch(actionCreator(CONSTANTS.NYC.SUCCESS, dataSource));
          dispatch(actionCreator(CONSTANTS.NYCPAGINATION.SUCCESS, NYCDataList.total !== -1 ? NYCDataList.total : 0));
          dispatch(actionCreator(CONSTANTS.NYCMASKINGFIELD.SUCCESS, maskedList));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.NYC.FAILURE));
        });
    }
  };
};
export const clearNYCFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.NYCSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.NYCPAGINATION.SUCCESS, 0));
  };
};
