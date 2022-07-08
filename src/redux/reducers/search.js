import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
  isLoading: false,
  sQuery: null,
  universal_search: null,
  collections: null,
  collectionLoading: false,
  isLifeEvent: false,
  lifeEvent: [],
};
const search = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.UNIVERSALSEARCH.REQUEST:
      return {
        ...state,
        isLoading: true,
        universal_search: null,
      };
    case CONSTANTS.UNIVERSALSEARCHQUERY.SUCCESS:
      return {
        ...state,
        sQuery: payload,
      };
    case CONSTANTS.UNIVERSALSEARCH.SUCCESS:
      return {
        ...state,
        universal_search: payload,
        isLoading: false,
      };
    case CONSTANTS.UNIVERSALSEARCH.FAILURE:
      return {
        ...state,
        universal_search: { documents: [], total: 0 },
        isLoading: false,
      };
    case CONSTANTS.COLEECTIONDROPDOWN.REQUEST:
      return {
        ...state,
        collectionLoading: true,
      };
    case CONSTANTS.COLEECTIONDROPDOWN.SUCCESS:
      return {
        ...state,
        collections: payload,
        collectionLoading: false,
      };
    case CONSTANTS.COLEECTIONDROPDOWN.FAILURE:
      return {
        ...state,
        collectionLoading: false,
      };
    case CONSTANTS.LIFEEVENTDROPDOWN.REQUEST:
      return {
        ...state,
        isLifeEvent: true,
      };
    case CONSTANTS.LIFEEVENTDROPDOWN.SUCCESS:
      return {
        ...state,
        lifeEvent: payload,
        isLifeEvent: false,
      };
    case CONSTANTS.LIFEEVENTDROPDOWN.FAILURE:
      return {
        ...state,
        isLifeEvent: false,
      };
    default:
      return {
        ...state,
      };
  }
};
export default search;
