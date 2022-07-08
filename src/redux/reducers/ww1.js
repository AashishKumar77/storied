import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
  hometowns: [],
  dropdownLoading: false,
  causes: [],
  miltaryRanks: [],
  sQuery: null,
  ww1List: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
};
const ww1 = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.WW1DROPDOWN.REQUEST:
      return {
        ...state,
        hometowns: [],
        causes: [],
        miltaryRanks: [],
        dropdownLoading: true,
      };
    case CONSTANTS.WW1DROPDOWN.SUCCESS:
      return {
        ...state,
        hometowns: payload.ResidenceCity,
        causes:
          payload["DeathSelfCause_of_death_value_SearchableFilter.keyword"] || [],
        miltaryRanks:
          payload["MilitarySelfRank_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.WW1PAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.WW1SEARCHQUERY.SUCCESS:
        return {
            ...state,
            sQuery: payload,
    } 
    case CONSTANTS.WW1PAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.WW1MASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.WW1MASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.WW1.REQUEST:
      return {
        ...state,
        ww1List: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.WW1.SUCCESS:
      return {
        ...state,
        ww1List: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.WW1.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};
export default ww1;
