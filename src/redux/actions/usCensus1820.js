import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, USFederal1820PK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSFederal1820DropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1820DROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(USFederal1820PK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1820DROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1820DROPDOWN.FAILURE));
      });
  };
};
export const getUSFederal1820URLString = (_values) => {
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitUSFederal1820Form = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().usCensus1820,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSFederal1820URLString(valueData),
        url = API_URLS.USFEDERALCENSUS1820 + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1820PAGINATION.REQUEST)
        );
        dispatch(
          actionCreator(CONSTANTS.USFEDERALCENSUS1820MASKINGFIELD.REQUEST)
        );
      }
      dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1820.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = USFederal1820PK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: USFederal1820PK,
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
          const usFederal1820DataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(
            usFederal1820DataList,
            cKeys,
            dataSource
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1820SEARCHQUERY.SUCCESS,
              _value
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              usFederal1820DataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.USFEDERALCENSUS1820.SUCCESS, dataSource)
          );

          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1820PAGINATION.SUCCESS,
              usFederal1820DataList.total !== -1
                ? usFederal1820DataList.total
                : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.USFEDERALCENSUS1820MASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1820.FAILURE));
        });
    }
  };
};
export const clearUsFederal1820FormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.USFEDERALCENSUS1820SEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.USFEDERALCENSUS1820PAGINATION.SUCCESS, 0));
  };
};
