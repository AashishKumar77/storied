import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
  isLoading: false,
  personRecords: null,
  isPersonClue: false,
  personClue: null,
};
const personRecord = (
  state = initialState,
  { type = null, payload = null } = {}
) => {
  switch (type) {
    case CONSTANTS.PERSONRECORDSEARCH.REQUEST:
      return {
        ...state,
        isLoading: true,
        personRecords: null,
      };
    case CONSTANTS.PERSONRECORDSEARCH.SUCCESS:
      return {
        ...state,
        personRecords: payload,
        isLoading: false,
      };
    case CONSTANTS.PERSONRECORDSEARCH.FAILURE:
      return {
        ...state,
        personRecords: { documents: [], total: 0 },
        isLoading: false,
      };
    case CONSTANTS.PERSONCLUE.REQUEST:
      return {
        ...state,
        isPersonClue: true,
      };
    case CONSTANTS.PERSONCLUE.SUCCESS:
      return {
        ...state,
        personClue: payload,
        isPersonClue: false,
      };
    case CONSTANTS.PERSONCLUE.FAILURE:
      return {
        ...state,
        isPersonClue: false,
      };
    default:
      return {
        ...state,
      };
  }
};
export default personRecord;
