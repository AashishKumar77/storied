import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  countyLoading: false,
  stateLoading: false,
  cityLoadig: false,
  publicationLoading: false,
  countryRequest: false,
  stateRequest: false,
  cityRequest: false,
  publicationRequest: false,
  counties: [],
  states: [],
  city: [],
  publication: []
};

const location = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.LOCATION.COUNTY.REQUEST:
      return {
        ...state,
        counties: [],
        states: [],
        city: [],
        publication: [],
        countyLoading: payload,
        countryRequest: false,
      };
    case CONSTANTS.LOCATION.COUNTY.SUCCESS:
      return {
        ...state,
        counties: payload,
        countyLoading: false,
        countryRequest: true,
      };
    case CONSTANTS.LOCATION.COUNTY.FAILURE:
        return {
            ...state,
            countyLoading: false,
            countryRequest: true
        };
    case CONSTANTS.LOCATION.STATE.REQUEST:
        return {
            ...state,
            states: [],
            city: [],
            publication: [],
            stateLoading: payload,
            stateRequest: false,
        };
    case CONSTANTS.LOCATION.STATE.SUCCESS:
        return {
            ...state,
            states: payload,
            stateLoading: false,
            stateRequest: true
        };
    case CONSTANTS.LOCATION.STATE.RESET:
        return {
            ...state,
            states: [],
            stateRequest: false
        }
    case CONSTANTS.LOCATION.STATE.FAILURE:
        return {
            ...state,
            stateLoading: false,
            stateRequest: true
        };
    case CONSTANTS.LOCATION.CITY.REQUEST:
        return {
            ...state,
            city: [],
            publication: [],
            cityLoadig: payload,
            cityRequest: false
        };
    case CONSTANTS.LOCATION.CITY.SUCCESS:
        return {
            ...state,
            city: payload,
            cityLoadig: false,
            cityRequest: true
        };
    case CONSTANTS.LOCATION.CITY.RESET:
        return {
            ...state,
            cityRequest: false,
            city: []
        }
    case CONSTANTS.LOCATION.CITY.FAILURE:
        return {
            ...state,
            cityLoadig: false,
            cityRequest: true
        };
    case CONSTANTS.LOCATION.PUBLICATION.REQUEST:
        return {
            ...state,
            publication: [],
            publicationLoading: payload,
            publicationRequest: false
        };
    case CONSTANTS.LOCATION.PUBLICATION.SUCCESS:
        return {
            ...state,
            publication: payload,
            publicationLoading: false,
            publicationRequest: true
        };
    case CONSTANTS.LOCATION.PUBLICATION.RESET:
        return {
            ...state,
            publicationRequest: false,
            publication: []
        }
    case CONSTANTS.LOCATION.PUBLICATION.FAILURE:
        return {
            ...state,
            publicationLoading: false,
            publicationRequest: true
        };
    default:
      return {
        ...state,
      };
  }
};
export default location;
