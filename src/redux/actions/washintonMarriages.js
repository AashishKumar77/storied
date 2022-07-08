import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import {
  encodeDataToURL,
  formDataTrim,
  washingtonMarriagesPK,
} from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID,
  createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getWMDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.WASHINGTONMARRAGESDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(washingtonMarriagesPK),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(
          actionCreator(CONSTANTS.WASHINGTONMARRAGESDROPDOWN.SUCCESS, res.data)
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.WASHINGTONMARRAGESDROPDOWN.FAILURE));
      });
  };
};

export const getWMURLString = (_values) => {
  if (_values?.m?.li?.i === "") {
    delete _values.m.li.i;
  }
  return encodeDataToURL({ ..._values });
};

export const submitWMForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().washingtonMarriages,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getWMURLString({ ...formDataTrim(valueData) }),
        url = API_URLS.WASHINGTONMARRAGES + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.WASHINGTONMARRAGESPAGINATION.REQUEST));
        dispatch(
          actionCreator(CONSTANTS.WASHINGTONMARRAGESMASKINGFIELD.REQUEST)
        );
      }
      dispatch(actionCreator(CONSTANTS.WASHINGTONMARRAGES.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = washingtonMarriagesPK;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({
              partitionKey: washingtonMarriagesPK,
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
          const WMDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(WMDataList, cKeys, dataSource);
          dispatch(
            actionCreator(
              CONSTANTS.WASHINGTONMARRAGESSEARCHQUERY.SUCCESS,
              _value
            )
          );
          dispatch(
            actionCreator(CONSTANTS.WASHINGTONMARRAGES.SUCCESS, dataSource)
          );
          dispatch(
            actionCreator(
              CONSTANTS.WASHINGTONMARRAGESTITLE.SUCCESS,
              contentCatalog?.collectionTitle
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.WASHINGTONMARRAGESPAGINATION.SUCCESS,
              WMDataList.total !== -1 ? WMDataList.total : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.WASHINGTONMARRAGESMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.WASHINGTONMARRAGES.FAILURE));
        });
    }
  };
};
export const clearWMFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.WASHINGTONMARRAGESSEARCHQUERY.SUCCESS, payload)
    );
  };
};
