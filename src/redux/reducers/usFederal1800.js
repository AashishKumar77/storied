import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
   race: [],
   dropdownLoading: false,
   sQuery: null,
   usFederal100List: [],
   maskingFields: [],
   pageLoading: true,
   loading: false,
   error: false,
}

const usFederal1800 = (state = initialState, { type = null, payload = null } = {}) => {

   switch (type) {
      case CONSTANTS.USFEDERAL1800PAGINATION.REQUEST:
         return {
            ...state,
            totalRecords: 0,
         };
      case CONSTANTS.USFEDERAL1800PAGINATION.SUCCESS:
         return {
            ...state,
            totalRecords: payload,
         };
      case CONSTANTS.USFEDERAL1800MASKINGFIELD.REQUEST:
         return {
            ...state,
            maskingFields: [],
         };
      case CONSTANTS.USFEDERAL1800MASKINGFIELD.SUCCESS:
         return {
            ...state,
            maskingFields: payload,
         };
      case CONSTANTS.USFEDERAL1800.REQUEST:
         return {
            ...state,
            usFederal100List: [],
            loading: true,
            error: false,
         };
      case CONSTANTS.USFEDERAL1800SEARCHQUERY.SUCCESS:
         return {
            ...state,
            sQuery: payload,
         }
      case CONSTANTS.USFEDERAL1800.SUCCESS:
         return {
            ...state,
            usFederal100List: payload,
            loading: false,
            error: false,
            pageLoading: false,
         };
      case CONSTANTS.USFEDERAL1800.FAILURE:
         return {
            ...state,
            loading: false,
            error: true,
            pageLoading: false,
         };
      case CONSTANTS.USFEDERAL1800DROPDOWN.REQUEST:
         return {
            ...state,
            dropdownLoading: true,
         }
      case CONSTANTS.USFEDERAL1800DROPDOWN.SUCCESS:
         return {
            ...state,
            race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
            dropdownLoading: false,
         }
      case CONSTANTS.USFEDERAL1800DROPDOWN.FAILURE:
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

export default usFederal1800