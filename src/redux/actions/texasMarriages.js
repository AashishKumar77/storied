import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, texasMarriagesPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getTexasMarriagesDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.TEXASMARRIAGESDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(texasMarriagesPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.TEXASMARRIAGESDROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.TEXASMARRIAGESDROPDOWN.FAILURE));
      });
  };
};
export const getTexasMarriagesURLString = (_values) => {
  if (_values?.m?.li?.i === "") {
    delete _values.m.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitTexasMarriagesForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().texasMarriages,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getTexasMarriagesURLString(valueData),
        url = API_URLS.TEXASMARRIAGESSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.TEXASMARRIAGESPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.TEXASMARRIAGESMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.TEXASMARRIAGES.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = texasMarriagesPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: texasMarriagesPK,
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
          const texasMarriagesDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            texasMarriagesDataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(CONSTANTS.TEXASMARRIAGESSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              texasMarriagesDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.TEXASMARRIAGES.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.TEXASMARRIAGESPAGINATION.SUCCESS,
              texasMarriagesDataList.total !== -1
                ? texasMarriagesDataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.TEXASMARRIAGESMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.TEXASMARRIAGES.FAILURE));
        });
    }
  };
};
export const clearTexasMarriagesFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.TEXASMARRIAGESSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.TEXASMARRIAGESPAGINATION.SUCCESS, 0));
  };
};
