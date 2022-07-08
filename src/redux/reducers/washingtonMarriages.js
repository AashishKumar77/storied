import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    WMList: [],
    maskingFields: [],
    WMPageLoading: true,
    WMPageTitle: "",
    sQuery: null,
    loading: false,
    error: false,
    dropdownLoading : false,
    gender : []
};

const washingtonMarriages = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {

        case CONSTANTS.WASHINGTONMARRAGESDROPDOWN.REQUEST:
            return {
                ...state,
                gender: [],
                dropdownLoading: true,
            };

        case CONSTANTS.WASHINGTONMARRAGESDROPDOWN.SUCCESS:
            return {
                ...state,
                gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
                dropdownLoading: false,
            };

        case CONSTANTS.WASHINGTONMARRAGESDROPDOWN.FAILURE:
            return {
                ...state,
                gender: [],
                dropdownLoading: false,
            };

        case CONSTANTS.WASHINGTONMARRAGESPAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.WASHINGTONMARRAGESPAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.WASHINGTONMARRAGESMASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.WASHINGTONMARRAGESMASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.WASHINGTONMARRAGESSEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            };
        case CONSTANTS.WASHINGTONMARRAGES.REQUEST:
            return {
                ...state,
                WMList: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.WASHINGTONMARRAGES.SUCCESS:
            return {
                ...state,
                WMList: payload,
                loading: false,
                error: false,
                WMPageLoading: false,
            };
        case CONSTANTS.WASHINGTONMARRAGES.FAILURE:
            return {
                ...state,
                loading: false,
                error: true,
                WMPageLoading: false,
            };
        case CONSTANTS.WASHINGTONMARRAGESTITLE.SUCCESS:
            return {
                ...state,
                WMPageTitle: payload,
            };
        default:
            return {
                ...state,
            };
    }
};

export default washingtonMarriages;
