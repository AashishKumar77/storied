import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
   race: [],
   dropdownLoading: false,
   sQuery: null,
   usFederal1830List: [],
   maskingFields: [],
   UFCpageLoading: true,
   loading: false,
   error: false,
}

const usCensus1830 = (state = initialState, { type = null, payload = null } = {}) => {

   switch (type) {
      case CONSTANTS.USFEDERALCENSUS1830PAGINATION.REQUEST:
         return {
            ...state,
            totalRecords: 0,
         };
      case CONSTANTS.USFEDERALCENSUS1830PAGINATION.SUCCESS:
         return {
            ...state,
            totalRecords: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1830MASKINGFIELD.REQUEST:
         return {
            ...state,
            maskingFields: [],
         };
      case CONSTANTS.USFEDERALCENSUS1830MASKINGFIELD.SUCCESS:
         return {
            ...state,
            maskingFields: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1830.REQUEST:
         return {
            ...state,
            usFederal1830List: [],
            loading: true,
            error: false,
         };
      case CONSTANTS.USFEDERALCENSUS1830SEARCHQUERY.SUCCESS:
         return {
            ...state,
            sQuery: payload,
         }
      case CONSTANTS.USFEDERALCENSUS1830.SUCCESS:
         return {
            ...state,
            usFederal1830List: payload,
            loading: false,
            error: false,
            UFCpageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1830.FAILURE:
         return {
            ...state,
            loading: false,
            error: true,
            UFCpageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1830DROPDOWN.REQUEST:
         return {
            ...state,
            dropdownLoading: true,
         }
      case CONSTANTS.USFEDERALCENSUS1830DROPDOWN.SUCCESS:
         return {
            ...state,
            race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
            dropdownLoading: false,
         }
      case CONSTANTS.USFEDERALCENSUS1830DROPDOWN.FAILURE:
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

export default usCensus1830