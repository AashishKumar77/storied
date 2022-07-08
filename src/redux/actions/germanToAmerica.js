import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, germanPK } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getGermanDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.GERMANTOAMERICANDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(germanPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.GERMANTOAMERICANDROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.GERMANTOAMERICANDROPDOWN.FAILURE));
      });
  };
};
export const getGermanURLString = (_values) => {
  if (_values?.pr?.li?.i === "") {
    delete _values.pr.li.i;
  }
  if (_values?.b?.li?.i === "") {
    delete _values.b.li.i;
  }
  if (_values?.b?.y?.y === "") {
    delete _values.b.y.y;
  }
  if (_values?.pd?.li?.i === "") {
    delete _values.pd.li.i;
  }
  if (_values?.id?.li?.i === "") {
    delete _values.id.li.i;
  }
  return encodeDataToURL({ ..._values });
};
export const submitGermanForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().germanToAmerica,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getGermanURLString(valueData),
        url = API_URLS.GERMANTOAMERICANSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.GERMANTOAMERICANPAGINATION.REQUEST));
        dispatch(actionCreator(CONSTANTS.GERMANTOAMERICANMASKINGFIELD.REQUEST));
      }
      dispatch(actionCreator(CONSTANTS.GERMANTOAMERICAN.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = germanPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: germanPK }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const gerToAmeDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(gerToAmeDataList, cKeys, dataSource);
          dispatch(
            actionCreator(CONSTANTS.GERMANTOAMERICANSEARCHQUERY.SUCCESS, _value)
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              gerToAmeDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.GERMANTOAMERICAN.SUCCESS, dataSource)
          );
          dispatch(
            actionCreator(
              CONSTANTS.GERMANTOAMERICANPAGINATION.SUCCESS,
              gerToAmeDataList.total !== -1 ? gerToAmeDataList.total : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.GERMANTOAMERICANMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.GERMANTOAMERICAN.FAILURE));
        });
    }
  };
};
export const clearGermanFormQuery = (payload = null) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.GERMANTOAMERICANSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.GERMANTOAMERICANPAGINATION.SUCCESS, 0));
  };
};
