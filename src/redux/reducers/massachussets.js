import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    massachussetsList: [],
    maskingFields: [],
    DeathsPageLoading: true,
    sQuery: null,
    loading: false,
    error: false,
};

const massachussets = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.MASSACHUSSETSPAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.MASSACHUSSETSPAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.MASSACHUSSETSMASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.MASSACHUSSETSMASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.MASSACHUSSETSSEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            };
        case CONSTANTS.MASSACHUSSETS.REQUEST:
            return {
                ...state,
                massachussetsList: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.MASSACHUSSETS.SUCCESS:
            return {
                ...state,
                massachussetsList: payload,
                loading: false,
                error: false,
                DeathsPageLoading: false,
            };
        case CONSTANTS.MASSACHUSSETS.FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                DeathsPageLoading: false,
            };
        default:
            return {
                ...state,
            };
    }
};

export default massachussets;
