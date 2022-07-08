import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, russianPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getRussianDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.RUSSIANDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(russianPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.RUSSIANDROPDOWN.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.RUSSIANDROPDOWN.FAILURE));
      });
  };
};
export const getRussianURLString = (_values) => {
  if (_values?.b?.li?.i === "") {
    delete _values.b.li.i;
  }
  if (_values?.a?.li?.i === "") {
    delete _values.a.li.i;
  }
  if (_values?.pe?.li?.i === "") {
    delete _values.pe.li.i;
  }
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  if (_values?.b?.y?.y === "") {
    delete _values.b.y.y;
  }
  return encodeDataToURL({ ..._values });
};
export const submitRussianForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().russian,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getRussianURLString(valueData),
        url = API_URLS.RUSSIANSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.RUSSIANPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.RUSSIANMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.RUSSIAN.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = russianPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: russianPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const itemList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(itemList, cKeys, dataSource);
          dispatch(actionCreator(CONSTANTS.RUSSIANSEARCHQUERY.SUCCESS, _value));
          dispatch(
            actionCreator(CONSTANTS.SSIDDATASOURCE.SUCCESS, itemList?.documents)
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.RUSSIAN.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.RUSSIANPAGINATION.SUCCESS,
              itemList.total !== -1 ? itemList.total : 0
            )
          );
          dispatch(
            actionCreator(CONSTANTS.RUSSIANMASKINGFIELD.SUCCESS, maskedList)
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.RUSSIAN.FAILURE));
        });
    }
  };
};
export const clearRussianFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.RUSSIANSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.RUSSIANPAGINATION.SUCCESS, 0));
  };
};
