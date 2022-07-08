import { v4 as uuidv4 } from "uuid";
import * as CONSTANTS from "../constants/actionTypes";
import * as API_URLS from "../constants/apiUrl";
import { actionCreator, callApi } from "../utils";
import { getHeadersCount, dataListRecords } from "../utils/catalogForm";
import { encodeDataToURL, formDataTrim, italiansGUID } from "../../utils";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
export const getItaliansDropdownList = () => {
  return (dispatch, getState) => {
    dispatch(actionCreator(CONSTANTS.ITALIANSIDROPDOWN.REQUEST));
    let url = API_URLS.getFormDropdowns(italiansGUID),
      staticHeader = createHeader();
    callApi(getState, "GET", url, null, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.ITALIANSIDROPDOWN.SUCCESS, res.data));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.ITALIANSIDROPDOWN.FAILURE));
      });
  };
};
export const getItaliansURLString = (italianFormVal) => {
  if (italianFormVal?.pr?.li?.i === "") {
    delete italianFormVal.pr.li.i;
  }
  if (italianFormVal?.b?.y?.y === "") {
    delete italianFormVal.b.y.y;
  }
  if (italianFormVal?.pd?.li?.i === "") {
    delete italianFormVal.pd.li.i;
  }
  if (italianFormVal?.b?.li?.i === "") {
    delete italianFormVal.b.li.i;
  }
  if (italianFormVal?.id?.li?.i === "") {
    delete italianFormVal.id.li.i;
  }
  return encodeDataToURL({ ...italianFormVal });
};
export const submitItaliansForm = (valueData, newRequest = false) => {
  return async (dispatch, getState) => {
    const { sQuery } = getState().italiansToAmerica,
      _value = encodeDataToURL({ ...formDataTrim(valueData) });
    if (sQuery !== _value) {
      let urlString = await getItaliansURLString(valueData),
        url = API_URLS.ITALIANSTOAMERICANSEARCH + "?" + urlString,
        staticHeader = createHeader();
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.ITALIANSTOAMERICANPAGINATION.REQUEST));
        dispatch(
          actionCreator(CONSTANTS.ITALIANSTOAMERICANMASKINGFIELD.REQUEST)
        );
      }
      dispatch(actionCreator(CONSTANTS.ITALIANSTOAMERICAN.REQUEST));
      const isLogin = localStorage.getItem("switch_status");
      staticHeader.isloggedin = isLogin || "true";
      staticHeader.databaseId = italiansGUID;
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then(async (res) => {
          let _url = API_URLS.getContentCatalog({ partitionKey: italiansGUID }),
            staticheader = createHeader(),
            contentCatalogApi = await callApi(
              getState,
              "GET",
              _url,
              {},
              false,
              staticheader
            );
          const italianToAmeDataList = res.data,
            contentCatalog = contentCatalogApi.data,
            cKeys = {};
          let dataSource = [],
            maskedList = [];
          getHeadersCount(contentCatalog, cKeys);
          maskedList = dataListRecords(italianToAmeDataList, cKeys, dataSource);
          dispatch(
            actionCreator(
              CONSTANTS.ITALIANSTOAMERICANSEARCHQUERY.SUCCESS,
              _value
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.SSIDDATASOURCE.SUCCESS,
              italianToAmeDataList?.documents
            )
          );
          dispatch(
            actionCreator(CONSTANTS.CONTENTCATALOG.SUCCESS, contentCatalog)
          );
          dispatch(
            actionCreator(CONSTANTS.ITALIANSTOAMERICAN.SUCCESS, dataSource)
          );
          dispatch(
            actionCreator(
              CONSTANTS.ITALIANSTOAMERICANPAGINATION.SUCCESS,
              italianToAmeDataList.total !== -1 ? italianToAmeDataList.total : 0
            )
          );
          dispatch(
            actionCreator(
              CONSTANTS.ITALIANSTOAMERICANMASKINGFIELD.SUCCESS,
              maskedList
            )
          );
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.ITALIANSTOAMERICAN.FAILURE));
        });
    }
  };
};
export const clearItaliansFormQuery = (payload) => {
  return async (dispatch) => {
    dispatch(
      actionCreator(CONSTANTS.ITALIANSTOAMERICANSEARCHQUERY.SUCCESS, payload)
    );
    dispatch(actionCreator(CONSTANTS.ITALIANSTOAMERICANPAGINATION.SUCCESS, 0));
  };
};
