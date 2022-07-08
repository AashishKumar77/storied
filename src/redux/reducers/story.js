import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  isLoading: false,
  list: [],
  isListEmpty: true,
  view: null,
  deletePersonLoader: false,
  deleteStoryErr: true,
  leftPanelDetails: null,
  rightPanelDetails: null,
  spousesnchildren: null,
  viewPermission:true
};

const story = (state = initialState, { type = null, payload = null } = {}) => {
  const request = {
      ...state,
      list: [],
      isLoading: true,
      isListEmpty: true,
      viewPermission:true
    },
    failure = {
      ...state,
      isLoading: false,
    };
  const paginationRequest = {
    ...state,
    isPagintionLoading: true,
  };
  const paginationFailure = {
    ...state,
    isPagintionLoading: false,
  };
  switch (type) {
    case CONSTANTS.GETSTORY.REQUEST:
      return {
        ...state,
        // list: [],
        isListEmpty: true
      };
    case CONSTANTS.GETSTORY.SUCCESS:
      return {
        ...state,
        list: payload,
        isListEmpty: false,
      };
    case CONSTANTS.GETSTORY.FAILURE:
      return {
        ...state,
        isListEmpty: false,
      };
    case CONSTANTS.GETSTORYANDUPDATELIST.SUCCESS:
        return {
        ...state,
        list : state.list.map(item => typeof item === "string" && item === payload.storyId ? payload : item)
    } 
    case CONSTANTS.GETSTORYPAGINATION.REQUEST:
      return paginationRequest;
    case CONSTANTS.GETSTORYPAGINATION.SUCCESS:
      return {
        ...state,
        list: [...state.list, ...payload],
        isPagintionLoading: false,
      };
    case CONSTANTS.GETSTORYPAGINATION.FAILURE:
      return paginationFailure;
    case CONSTANTS.POSTSTORY.REQUEST:
      return request;
    case CONSTANTS.POSTSTORY.SUCCESS:
      return {
        ...state,
        isLoading: false,
      };
    case CONSTANTS.POSTSTORY.FAILURE:
      return {
        ...state,
        isLoading: payload,
      };
    case CONSTANTS.VIEWSTORY.REQUEST:
      return request;
    case CONSTANTS.VIEWSTORY.SUCCESS:
      return {
        ...state,
        isLoading: false,
        viewPermission:true,
        view: payload,
      };
    case CONSTANTS.VIEWSTORY.FAILURE:
      return payload?.status===403?{
        ...state,
        isLoading:false,
        viewPermission:false
      }:failure;
    case CONSTANTS.DELETESTORYPERSON.REQUEST:
      return {
        ...state,
        deletePersonLoader: true,
      };
    case CONSTANTS.DELETESTORYPERSON.SUCCESS:
      return {
        ...state,
        deletePersonLoader: false,
        view: {
          ...state.view,
          personDetail: state.view.personDetail.filter(
            (value) => value.id !== payload.id
          ),
        },
      };
    case CONSTANTS.DELETESTORYPERSON.FAILURE:
      return {
        ...state,
        deletePersonLoader: false,
      };
    case CONSTANTS.DELETESTORY.REQUEST:
      return {
        ...state,
        isLoading: true,
        deleteStoryErr: true,
      };
    case CONSTANTS.DELETESTORY.SUCCESS:
      return {
        ...state,
        deleteStoryErr: false,
        isLoading: false,
        list: state.list.filter((y) => y.id !== payload.storyId),
      };
    case CONSTANTS.DELETESTORY.FAILURE:
      return {
        ...state,
        isLoading: false,
        deleteStoryErr: payload,
      };
    case CONSTANTS.GETLEFTPANELDETAILS.REQUEST:
      return request;
    case CONSTANTS.GETLEFTPANELDETAILS.SUCCESS:
      return {
        ...state,
        leftPanelDetails: payload,
        isLoading: false,
      };
    case CONSTANTS.GETLEFTPANELDETAILS.FAILURE:
      return {
        ...state,
        isLoading: false,
        leftPanelDetails: payload,
      };
    case CONSTANTS.SPOUSESWITHCHILDREN.REQUEST:
      return request;
    case CONSTANTS.SPOUSESWITHCHILDREN.SUCCESS:
      return {
        ...state,
        spousesnchildren: payload,
        isLoading: false,
      };
    case CONSTANTS.UPDATEPRIVACYSTATUS.SUCCESS:
      return {
        ...state,
        view: {
          ...state.view,
          privacy: payload,
        },
      };
    case CONSTANTS.SPOUSESWITHCHILDREN.FAILURE:
      return {
        ...state,
        isLoading: false,
        spousesnchildren: payload,
      };
    case CONSTANTS.GETRIGHTPANELDETAILS.REQUEST:
      return request;
    case CONSTANTS.GETRIGHTPANELDETAILS.SUCCESS:
      return {
        ...state,
        rightPanelDetails: payload,
        isLoading: false,
      };
    case CONSTANTS.GETRIGHTPANELDETAILS.FAILURE:
      return {
        ...state,
        isLoading: false,
        rightPanelDetails: payload,
      };
    default:
      return {
        ...state,
      };
  }
};
export default story;
