import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, USFederal1810PK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSFederal1810DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1810DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(USFederal1810PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1810DROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1810DROPDOWN.FAILURE));
      });
  };
};
export const getUSFederal1810URLString = (_values) => {
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUSFederal1810Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().usCensus1810,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSFederal1810URLString(valueData),
        url = API_URLS.USFEDERALCENSUS1810 + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1810PAGINATION.REQUEST)
        );
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1810MASKINGFIELD.REQUEST)
        );
      }
      dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1810.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USFederal1810PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: USFederal1810PK,
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
          const usFederal1810DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            usFederal1810DataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1810SEARCHQUERY.SUCCESS,
              _value
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              usFederal1810DataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.USFEDERALCENSUS1810.SUCCESS, dataSource)
          );

          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1810PAGINATION.SUCCESS,
              usFederal1810DataList.total !== -1
                ? usFederal1810DataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1810MASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1810.FAILURE));
        });
    }
  };
};
export const clearUsFederal1810FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.USFEDERALCENSUS1810SEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1810PAGINATION.SUCCESS, 0));
  };
};
