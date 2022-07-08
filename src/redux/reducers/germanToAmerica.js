import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  occupation: [],
  dropdownLoading: false,
  germanList: [],
  maskingFields: [],
  pageLoading: true,
  sQuery: null,
  loading: false,
  error: false,
};

const germanToAmerica = (
  state = initialState,
  { type = null, payload = null } = {}
) => {
  switch (type) {
    case CONSTANTS.GERMANTOAMERICANPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.GERMANTOAMERICANPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.GERMANTOAMERICANMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.GERMANTOAMERICANMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.GERMANTOAMERICANSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.GERMANTOAMERICAN.REQUEST:
      return {
        ...state,
        germanList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.GERMANTOAMERICAN.SUCCESS:
      return {
        ...state,
        germanList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.GERMANTOAMERICAN.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
      };
    case CONSTANTS.GERMANTOAMERICANDROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.GERMANTOAMERICANDROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        occupation:
          payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] ||
          [],
        dropdownLoading: false,
      };
    case CONSTANTS.GERMANTOAMERICANDROPDOWN.FAILURE:
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

export default germanToAmerica;
