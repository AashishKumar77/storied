import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    NYCList: [],
    maskingFields: [],
    NYCPageLoading: true,
    sQuery: null,
    loading: false,
    error: false,
    dropdownLoading : false,
    gender : []
};

const NYC = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {

        case CONSTANTS.NYCDROPDOWN.REQUEST:
            return {
                ...state,
                gender: [],
                dropdownLoading: true,
            };

        case CONSTANTS.NYCDROPDOWN.SUCCESS:
            return {
                ...state,
                gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
                dropdownLoading: false,
            };

        case CONSTANTS.NYCDROPDOWN.FAILURE:
            return {
                ...state,
                gender: [],
                dropdownLoading: false,
            };

        case CONSTANTS.NYCPAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.NYCPAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.NYCMASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.NYCMASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.NYCSEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            };
        case CONSTANTS.NYC.REQUEST:
            return {
                ...state,
                NYCList: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.NYC.SUCCESS:
            return {
                ...state,
                NYCList: payload,
                loading: false,
                error: false,
                NYCPageLoading: false,
            };
        case CONSTANTS.NYC.FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                NYCPageLoading: false,
            };
        default:
            return {
                ...state,
            };
    }
};

export default NYC;
