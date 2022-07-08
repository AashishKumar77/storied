import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    USCensusList: [],
    maskingFields: [],
    gender: [],
    race: [],
    dropdownLoading : false,
    CensusPageLoading: true,
    sQuery: null,
    loading: false,
    error: false,
};

const USCensus = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
     
        case CONSTANTS.USCENSUSDROPDOWN.REQUEST:
            return {
                ...state,
                gender: [],
                race: [],
                dropdownLoading: true,
            };

        case CONSTANTS.USCENSUSDROPDOWN.SUCCESS:
            return {
                ...state,
                gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
                race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
                dropdownLoading: false,
            };

        case CONSTANTS.USCENSUSDROPDOWN.FAILURE:
            return {
                ...state,
                gender: [],
                race: [],
                dropdownLoading: false,
            };
        case CONSTANTS.USCENSUSPAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.USCENSUSPAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.USCENSUSMASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.USCENSUSMASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.USCENSUSSEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            };
        case CONSTANTS.USCENSUS.REQUEST:
            return {
                ...state,
                USCensusList: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.USCENSUS.SUCCESS:
            return { 
                ...state,
                USCensusList: payload,
                loading: false,
                error: false,
                CensusPageLoading: false,
            };
        case CONSTANTS.USCENSUS.FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                CensusPageLoading: false,
            };
        default:
            return {
                ...state,
            };
    }
};

export default USCensus;
