import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, USFederal1800PK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };

export const getUSFederal1800DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERAL1800DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(USFederal1800PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.USFEDERAL1800DROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USFEDERAL1800DROPDOWN.FAILURE));
      });
  };
};
export const getUSFederal1800URLString = (_values) => {
  if (_values?.m?.li?.i === "") {
    delete _values.m.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUSFederal1800Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().usFederal1800,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSFederal1800URLString(valueData),
        url = API_URLS.USFEDERAL1800SEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.USFEDERAL1800PAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.USFEDERAL1800MASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.USFEDERAL1800.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USFederal1800PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: USFederal1800PK,
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
          const usFederal1800DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            usFederal1800DataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(CONSTANTS.USFEDERAL1800SEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              usFederal1800DataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.USFEDERAL1800.SUCCESS, dataSource));

          dispatch(
            actionCreator(
              CONSTANTS.USFEDERAL1800PAGINATION.SUCCESS,
              usFederal1800DataList.total !== -1
                ? usFederal1800DataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERAL1800MASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERAL1800.FAILURE));
        });
    }
  };
};
export const clearUsFederal1800FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.USFEDERAL1800SEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.USFEDERAL1800PAGINATION.SUCCESS, 0));
  };
};
