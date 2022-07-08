import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
  sQuery: null,
  MMList: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
};
const massachusettsMarriages = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.MMPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.MMSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      }
    case CONSTANTS.MMPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.MMMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.MMMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.MM.REQUEST:
      return {
        ...state,
        MMList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.MM.SUCCESS:
      return {
        ...state,
        MMList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.MM.FAILURE:
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
export default massachusettsMarriages;
