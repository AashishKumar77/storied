import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    race: [],
    citizenship: [],
    componentArmy: [],
    maritalStatus: [],
    miltaryRanks: [],
    levelEducation: [],
    occupation: [],
    dropdownLoading: false,
    sQuery: null,
    ww2List: [],
    maskingFields: [],
    pageLoading: true,
    loading: false,
    error: false,
}

const ww2 = (state = initialState, { type = null, payload = null } = {}) => {

    switch (type) {
        case CONSTANTS.WW2PAGINATION.REQUEST:
            return {
                ...state,
                totalRecords: 0,
            };
        case CONSTANTS.WW2PAGINATION.SUCCESS:
            return {
                ...state,
                totalRecords: payload,
            };
        case CONSTANTS.WW2MASKINGFIELD.REQUEST:
            return {
                ...state,
                maskingFields: [],
            };
        case CONSTANTS.WW2MASKINGFIELD.SUCCESS:
            return {
                ...state,
                maskingFields: payload,
            };
        case CONSTANTS.WW2.REQUEST:
            return {
                ...state,
                ww2List: [],
                loading: true,
                error: false,
            };
        case CONSTANTS.WW2SEARCHQUERY.SUCCESS:
            return {
                ...state,
                sQuery: payload,
            }
        case CONSTANTS.WW2.SUCCESS:
            return {
                ...state,
                ww2List: payload,
                loading: false,
                error: false,
                pageLoading: false,
            };
        case CONSTANTS.WW2.FAILURE:
            return {
                ...state,
                loading: false,
                sQuery: null,
                error: true,
                pageLoading: false,
            };
        case CONSTANTS.WWIIDROPDOWN.REQUEST:
            return {
                ...state,
                dropdownLoading: true,
            }

        case CONSTANTS.WWIIDROPDOWN.SUCCESS:
            return {
                ...state,
                race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
                citizenship: payload["CitizenshipSelfStatus_value_SearchableFilter.keyword"] || [],
                maritalStatus: payload["MarriageSelfStatus_value_SearchableFilter.keyword"] || [],
                componentArmy: payload["Military_enlistmentSelfComponent_of_army_value_SearchableFilter.keyword"] || [],
                miltaryRanks: payload["Military_enlistmentSelfRank_value_SearchableFilter.keyword"] || [],
                levelEducation: payload["EducationSelfLevel_completed_value_SearchableFilter.keyword"] || [],
                occupation: payload["EmploymentSelfOccupation_value_SearchableFilter.keyword"] || [],
                dropdownLoading: false,
            }

        case CONSTANTS.WWIIDROPDOWN.FAILURE:
            return {
                ...state,
                dropdownLoading: false,
            }

        default:
            return {
                ...state,
            }
    }

}


export default ww2