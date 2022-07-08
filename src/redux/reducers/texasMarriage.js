import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
   gender: [],
   dropdownLoading: false,
   sQuery: null,
   texasMarriageList: [],
   maskingFields: [],
   pageLoading: true,
   loading: false,
   error: false,
}

const texasMarriage = (state = initialState, { type = null, payload = null } = {}) => {

   switch (type) {
      case CONSTANTS.TEXASMARRIAGESPAGINATION.REQUEST:
         return {
            ...state,
            totalRecords: 0,
         };
      case CONSTANTS.TEXASMARRIAGESPAGINATION.SUCCESS:
         return {
            ...state,
            totalRecords: payload,
         };
      case CONSTANTS.TEXASMARRIAGESMASKINGFIELD.REQUEST:
         return {
            ...state,
            maskingFields: [],
         };
      case CONSTANTS.TEXASMARRIAGESMASKINGFIELD.SUCCESS:
         return {
            ...state,
            maskingFields: payload,
         };
      case CONSTANTS.TEXASMARRIAGES.REQUEST:
         return {
            ...state,
            texasMarriageList: [],
            loading: true,
            error: false,
         };
      case CONSTANTS.TEXASMARRIAGESSEARCHQUERY.SUCCESS:
         return {
            ...state,
            sQuery: payload,
         }
      case CONSTANTS.TEXASMARRIAGES.SUCCESS:
         return {
            ...state,
            texasMarriageList: payload,
            loading: false,
            error: false,
            pageLoading: false,
         };
      case CONSTANTS.TEXASMARRIAGES.FAILURE:
         return {
            ...state,
            loading: false,
            error: true,
            pageLoading: false,
         };
      case CONSTANTS.TEXASMARRIAGESDROPDOWN.REQUEST:
         return {
            ...state,
            dropdownLoading: true,
         }
      case CONSTANTS.TEXASMARRIAGESDROPDOWN.SUCCESS:
         return {
            ...state,
            gender: payload["SelfGender_value_SearchableFilter.keyword"] || [],
            dropdownLoading: false,
         }
      case CONSTANTS.TEXASMARRIAGESDROPDOWN.FAILURE:
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

export default texasMarriage