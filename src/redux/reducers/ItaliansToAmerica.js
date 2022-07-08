import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
  gender: [],
  occupation: [],
  dropdownLoading: false,
  sQuery: null,
  italianList: [],
  maskingFields: [],
  pageLoading: true,
  loading: false,
  error: false,
};
const italiansToAmerica = (
  state = initialState,
  { type = null, payload = null } = {}
) => {
  switch (type) {
    case CONSTANTS.ITALIANSIDROPDOWN.REQUEST:
      return {
        ...state,
        dropdownLoading: true,
      };
    case CONSTANTS.ITALIANSIDROPDOWN.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        occupation:
          payload[
            "EmploymentSelfOccupation_value_SearchableFilter.keyword"
          ] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.ITALIANSIDROPDOWN.FAILURE:
      return {
        ...state,
        dropdownLoading: false,
      };
    case CONSTANTS.ITALIANSTOAMERICANPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.ITALIANSTOAMERICANPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.ITALIANSTOAMERICANMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.ITALIANSTOAMERICANMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.ITALIANSTOAMERICANSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.ITALIANSTOAMERICAN.REQUEST:
      return {
        ...state,
        italianList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.ITALIANSTOAMERICAN.SUCCESS:
      return {
        ...state,
        italianList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.ITALIANSTOAMERICAN.FAILURE:
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

export default italiansToAmerica;
