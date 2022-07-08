import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  gender: [],
  race: [],
  maritalStatus: [],
  relationship: [],
  citizenshipStatus: [],
  dropdownLoading: false,
  sQuery: null,
  USFederalCensusList: [],
  loading: false,
  error: false,
  maskingFields: [],
  pageLoading: true,
};

const USFederalCensus = (
  state = initialState,
  { type = null, payload = null } = {}
) => {
  switch (type) {
    case CONSTANTS.USFEDERALCENSUS.REQUEST:
      return {
        ...state,
        gender: [],
        race: [],
        maritalStatus: [],
        relationship: [],
        citizenshipStatus: [],
        dropdownLoading: true,
      };

    case CONSTANTS.USFEDERALCENSUS.SUCCESS:
      return {
        ...state,
        gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
        race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
        maritalStatus:
          payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
        relationship:
          payload["SelfRelationship_value_SearchableFilter.keyword"] || [],
        citizenshipStatus:
          payload["CitizenshipSelfStatus_SearchableFilter.keyword"] || [],
        dropdownLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUSPAGINATION.REQUEST:
      return {
        ...state,
        totalRecords: 0,
      };
    case CONSTANTS.USFEDERALCENSUSPAGINATION.SUCCESS:
      return {
        ...state,
        totalRecords: payload,
      };
    case CONSTANTS.USFEDERALCENSUSMASKINGFIELD.REQUEST:
      return {
        ...state,
        maskingFields: [],
      };
    case CONSTANTS.USFEDERALCENSUSMASKINGFIELD.SUCCESS:
      return {
        ...state,
        maskingFields: payload,
      };
    case CONSTANTS.USFEDERALCENSUSLIST.REQUEST:
      return {
        ...state,
        USFederalCensusList: [],
        loading: true,
        error: false,
      };
    case CONSTANTS.USFEDERALSEARCHQUERY.SUCCESS:
        return {
          ...state,
          sQuery: payload,
    } 
    case CONSTANTS.USFEDERALCENSUSLIST.SUCCESS:
      return {
        ...state,
        USFederalCensusList: payload,
        loading: false,
        error: false,
        pageLoading: false,
      };
    case CONSTANTS.USFEDERALCENSUSLIST.FAILURE:
      return {
        ...state,
        loading: false,
        error: true,
        pageLoading: false,
        USFederalCensusList: [],
      };
    default:
      return {
        ...state,
      };
  }
};

export default USFederalCensus;
