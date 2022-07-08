import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
   race: [],
   dropdownLoading: false,
   sQuery: null,
   usFederal1810List: [],
   maskingFields: [],
   USCpageLoading: true,
   loading: false,
   error: false,
}

const usCensus1810 = (state = initialState, { type = null, payload = null } = {}) => {

   switch (type) {
      case CONSTANTS.USFEDERALCENSUS1810PAGINATION.REQUEST:
         return {
            ...state,
            totalRecords: 0,
         };
      case CONSTANTS.USFEDERALCENSUS1810PAGINATION.SUCCESS:
         return {
            ...state,
            totalRecords: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1810MASKINGFIELD.REQUEST:
         return {
            ...state,
            maskingFields: [],
         };
      case CONSTANTS.USFEDERALCENSUS1810MASKINGFIELD.SUCCESS:
         return {
            ...state,
            maskingFields: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1810.REQUEST:
         return {
            ...state,
            usFederal1810List: [],
            loading: true,
            error: false,
         };
      case CONSTANTS.USFEDERALCENSUS1810SEARCHQUERY.SUCCESS:
         return {
            ...state,
            sQuery: payload,
         }
      case CONSTANTS.USFEDERALCENSUS1810.SUCCESS:
         return {
            ...state,
            usFederal1810List: payload,
            loading: false,
            error: false,
            USCpageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1810.FAILURE:
         return {
            ...state,
            loading: false,
            error: true,
            USCpageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1810DROPDOWN.REQUEST:
         return {
            ...state,
            dropdownLoading: true,
         }
      case CONSTANTS.USFEDERALCENSUS1810DROPDOWN.SUCCESS:
         return {
            ...state,
            race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
            dropdownLoading: false,
         }
      case CONSTANTS.USFEDERALCENSUS1810DROPDOWN.FAILURE:
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

export default usCensus1810