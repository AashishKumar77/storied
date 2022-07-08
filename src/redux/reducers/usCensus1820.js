import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
   race: [],
   dropdownLoading: false,
   sQuery: null,
   usFederal1820List: [],
   maskingFields: [],
   UFCpageLoading: true,
   loading: false,
   error: false,
}

const usCensus1820 = (state = initialState, { type = null, payload = null } = {}) => {

   switch (type) {
      case CONSTANTS.USFEDERALCENSUS1820PAGINATION.REQUEST:
         return {
            ...state,
            totalRecords: 0,
         };
      case CONSTANTS.USFEDERALCENSUS1820PAGINATION.SUCCESS:
         return {
            ...state,
            totalRecords: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1820MASKINGFIELD.REQUEST:
         return {
            ...state,
            maskingFields: [],
         };
      case CONSTANTS.USFEDERALCENSUS1820MASKINGFIELD.SUCCESS:
         return {
            ...state,
            maskingFields: payload,
         };
      case CONSTANTS.USFEDERALCENSUS1820.REQUEST:
         return {
            ...state,
            usFederal1820List: [],
            loading: true,
            error: false,
         };
      case CONSTANTS.USFEDERALCENSUS1820SEARCHQUERY.SUCCESS:
         return {
            ...state,
            sQuery: payload,
         }
      case CONSTANTS.USFEDERALCENSUS1820.SUCCESS:
         return {
            ...state,
            usFederal1820List: payload,
            loading: false,
            error: false,
            UFCpageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1820.FAILURE:
         return {
            ...state,
            loading: false,
            error: true,
            UFCpageLoading: false,
         };
      case CONSTANTS.USFEDERALCENSUS1820DROPDOWN.REQUEST:
         return {
            ...state,
            dropdownLoading: true,
         }
      case CONSTANTS.USFEDERALCENSUS1820DROPDOWN.SUCCESS:
         return {
            ...state,
            race: payload["SelfRace_value_SearchableFilter.keyword"] || [],
            dropdownLoading: false,
         }
      case CONSTANTS.USFEDERALCENSUS1820DROPDOWN.FAILURE:
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

export default usCensus1820