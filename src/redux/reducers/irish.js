import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  occupation: [],
  relationToHead: [],
  dropdownLoading: false,
  irishList: [],
  maskingFields: [],
  pageLoading: true,
  sQuery: null,
  loading: false,
  error: false,
};

const irish = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.IRISHPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.IRISHPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.IRISHMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.IRISHMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.IRISHSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.IRISH.REQUEST:
      return {
        ...state,
        irishList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.IRISH.SUCCESS:
      return {
        ...state,
        irishList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.IRISH.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.IRISHDROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.IRISHDROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        occupation: payload["Employment_occupationSelfOccupation_value_SearchableFilter.keyword"] || [],
        relationToHead: payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.IRISHDROPDOWN.FAILURE:
      return {
        ...state,
        dropdownLoading: false,
      };
    default:
      return {
        ...state,
      };
  }
};

export default irish;
