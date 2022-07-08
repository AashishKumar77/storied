import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  russianList: [],
  maskingFields: [],
  pageLoading: true,
  loading: false,
  error: false,
};

const russian = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.RUSSIANPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.RUSSIANPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.RUSSIANMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.RUSSIANMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.RUSSIAN.REQUEST:
      return {
        ...state,
        russianList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.RUSSIANSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.RUSSIAN.SUCCESS:
      return {
        ...state,
        russianList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.RUSSIAN.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.RUSSIANDROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };

    case CONSTANTS.RUSSIANDROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        occupation: payload["Employment_occupationSelfOccupation_value_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };

    case CONSTANTS.RUSSIANDROPDOWN.FAILURE:
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

export default russian;
