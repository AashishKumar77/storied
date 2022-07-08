import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
    isLoading: false,
    paginationLoading: false,
    list: [],
    totalRecords: 0
};
const publication = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.GETPUBLICTAION.REQUEST:
            return {
                ...state,
                isLoading: true,
                paginationLoading: false
            }
        case CONSTANTS.GETPUBLICTAION.REQUEST:
                return {
                    ...state,
                    isLoading: true,
                    totalRecords: 0,
                    paginationLoading: false
                }
        case CONSTANTS.GETPUBLICTAIONPAGINATION.REQUEST:
            return {
                ...state,
                isLoading: false,
                paginationLoading: true
            }
        case CONSTANTS.GETPUBLICTAION.SUCCESS: 
            return {
                ...state,
                list: payload?.searchResults || [],
                totalRecords: payload?.resultCount,
                isLoading: false,
                paginationLoading: false
            }
        case CONSTANTS.GETPUBLICTAION.FAILURE: 
            return {
                ...state,
                isLoading: false,
                paginationLoading: false
            }
        default:
            return {
                ...state
            }
        }
}
export default publication

