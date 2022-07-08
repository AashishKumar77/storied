import {
    actionCreator,
    callApi
} from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };
export const getCountries = (loading = true) =>  {
    return (dispatch, getState) => {
        let url = API_URLS.COUNTRY,
        staticHeader = createHeader();
        dispatch(actionCreator(CONSTANTS.LOCATION.COUNTY.REQUEST, loading));
        return callApi(getState, "GET", url, {} , false, staticHeader)
        .then((res) => {
            dispatch(actionCreator(CONSTANTS.LOCATION.COUNTY.SUCCESS, res.data));
            return res.data
        })
        .catch((err) => {
            dispatch(actionCreator(CONSTANTS.LOCATION.COUNTY.FAILURE, err));
        });
    }
}
export const getStates = (countryId, loading = true) => {
    return (dispatch, getState) => {
        if(countryId) {
            let url = API_URLS.getState(countryId),
            staticHeader = createHeader();
            dispatch(actionCreator(CONSTANTS.LOCATION.STATE.REQUEST, loading));
            callApi(getState, "GET", url, {}, false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.STATE.SUCCESS, res.data));
                return res.data
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.STATE.FAILURE, err));
            });
        } else {
            dispatch(actionCreator(CONSTANTS.LOCATION.STATE.RESET));
            dispatch(actionCreator(CONSTANTS.LOCATION.CITY.RESET));
            dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATION.RESET));
        }
    }
}
export const getCities = (stateId, loading = true) => {
    return (dispatch, getState) => {
        if( stateId ) {
            let url = API_URLS.getCity(stateId),
            staticHeader = createHeader();
            dispatch(actionCreator(CONSTANTS.LOCATION.CITY.REQUEST, loading));
            callApi(getState, "GET", url,  {} , false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.CITY.SUCCESS, res.data));
                return res.data
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.CITY.FAILURE));
            });
        }  else {
            dispatch(actionCreator(CONSTANTS.LOCATION.CITY.RESET));
            dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATION.RESET));
        }
    }
}
export const getPublication = (cityId, stateId, loading = true) => {
    return (dispatch, getState) => {
        if( cityId ) {
            let url = API_URLS.getPublication(cityId, stateId),
            staticHeader = createHeader();
            dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATION.REQUEST, loading));
            callApi(getState, "GET", url, {}, false, staticHeader)
            .then((res) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATION.SUCCESS, res.data));
                return res.data
            })
            .catch((err) => {
                dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATION.FAILURE, err));
            });
        } else {
            dispatch(actionCreator(CONSTANTS.LOCATION.PUBLICATION.RESET));
        }
    }
}