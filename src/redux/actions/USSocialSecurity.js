import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, USSocialPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSSocialURLString = (_values) => {
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  return encodeDataToURL({ ..._values });
};

export const submitUSSocialSecurityForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().USSocialSecurity,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSSocialURLString({
          ...formDataTrim(valueData),
        }),
        url = API_URLS.USSOCIALSECURITY + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.USSOCIALSECURITYPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.USSOCIALSECURITYMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.USSOCIALSECURITY.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USSocialPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: USSocialPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const USSocialDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(USSocialDataList, cKeys, dataSource);
          dispatch(
            actionCreator(CONSTANTS.USSOCIALSECURITYSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              USSocialDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.USSOCIALSECURITY.SUCCESS, dataSource)
          );
          dispatch(
            actionCreator(
              CONSTANTS.USSOCIALSECURITYPAGINATION.SUCCESS,
              USSocialDataList.total !== -1 ? USSocialDataList.total : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USSOCIALSECURITYMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USSOCIALSECURITY.FAILURE));
        });
    }
  };
};
export const clearIUSSocialFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.USSOCIALSECURITYSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.USSOCIALSECURITYPAGINATION.SUCCESS, 0));
  };
};
