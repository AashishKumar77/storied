import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    ohioList: [],
    maskingFields: [],
    DeathsPageLoading: true,
    sQuery: null,
    loading: false,
    error: false,
};

const ohioDeaths = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.OHIODEATHSPAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.OHIODEATHSPAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.OHIODEATHSMASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.OHIODEATHSMASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.OHIODEATHSSEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            };
        case CONSTANTS.OHIODEATHS.REQUEST:
            return {
                ...state,
                ohioList: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.OHIODEATHS.SUCCESS:
            return {
                ...state,
                ohioList: payload,
                loading: false,
                error: false,
                DeathsPageLoading: false,
            };
        case CONSTANTS.OHIODEATHS.FAILURE:
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

export default ohioDeaths;
