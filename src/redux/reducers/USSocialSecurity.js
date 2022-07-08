import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  USSocialList: [],
  maskingFields: [],
  pageLoading: true,
  sQuery: null,
  loading: false,
  error: false,
};

const USSocialSecurity = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.USSOCIALSECURITYPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.USSOCIALSECURITYPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.USSOCIALSECURITYMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.USSOCIALSECURITYMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.USSOCIALSECURITYSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.USSOCIALSECURITY.REQUEST:
      return {
        ...state,
        USSocialList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.USSOCIALSECURITY.SUCCESS:
      return {
        ...state,
        USSocialList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.USSOCIALSECURITY.FAILURE:
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

export default USSocialSecurity;
