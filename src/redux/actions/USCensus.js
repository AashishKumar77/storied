import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "./../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, uscensusGUID } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getUSCensusURLString = (_values) => {
  if (_values?.r?.li?.i === "") {
    delete _values.r.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const getUSCensusDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.USCENSUSDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(uscensusGUID),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.USCENSUSDROPDOWN.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.USCENSUSDROPDOWN.FAILURE));
      });
  };
};

export const submitUSCensusForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().USCensus,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getUSCensusURLString({
          ...formDataTrim(valueData),
        }),
        url = API_URLS.USCENSUS + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.USCENSUSPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.USCENSUSMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.USCENSUS.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = uscensusGUID;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: uscensusGUID }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const USCensusDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(USCensusDataList, cKeys, dataSource);
          dispatch(
            actionCreator(CONSTANTS.USCENSUSSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              USCensusDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(actionCreator(CONSTANTS.USCENSUS.SUCCESS, dataSource));
          dispatch(
            actionCreator(
              CONSTANTS.USCENSUSPAGINATION.SUCCESS,
              USCensusDataList.total !== -1 ? USCensusDataList.total : 0
            )
          );
          dispatch(
            actionCreator(CONSTANTS.USCENSUSMASKINGFIELD.SUCCESS, maskedList)
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.USCENSUS.FAILURE));
        });
    }
  };
};

export const clearUSCensusFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(actionCreator(CONSTANTS.USCENSUSSEARCHQUERY.SUCCESS, payload));
    dispatch(actionCreator(CONSTANTS.USCENSUSPAGINATION.SUCCESS, 0));
  };
};
