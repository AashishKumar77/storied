import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, USFederal1830PK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSFederal1830DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1830DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(USFederal1830PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1830DROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1830DROPDOWN.FAILURE));
      });
  };
};
export const getUSFederal1830URLString = (_values) => {
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUSFederal1830Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().usCensus1830,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSFederal1830URLString(valueData),
        url = API_URLS.USFEDERALCENSUS1830 + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1830PAGINATION.REQUEST)
        );
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1830MASKINGFIELD.REQUEST)
        );
      }
      dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1830.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USFederal1830PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: USFederal1830PK,
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
          const usFederal1830DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            usFederal1830DataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1830SEARCHQUERY.SUCCESS,
              _value
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              usFederal1830DataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.USFEDERALCENSUS1830.SUCCESS, dataSource)
          );

          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1830PAGINATION.SUCCESS,
              usFederal1830DataList.total !== -1
                ? usFederal1830DataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1830MASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1830.FAILURE));
        });
    }
  };
};
export const clearUsFederal1830FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.USFEDERALCENSUS1830SEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1830PAGINATION.SUCCESS, 0));
  };
};
