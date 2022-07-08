import * as API_URLS from "./../constants/apiUrl";
import * as CONSTANTS from "./../constants/actionTypes";
import { getOwner, getRecentTree, setRecentTree} from "../../services";
import { v4 as uuidv4 } from "uuid";
import { POST, CLEAR_STORY_LIKES_PERSONS } from "../constants";
import { actionCreator, callApi } from "../utils";
import { apiRequest } from "../requests";
import { addMessage } from "./toastr";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;


const createHeader = () => {
    return {
      "wa-clientId": CLIENT_ID,
      "wa-requestId": uuidv4(),
    };
  };


  const getStoriesAPICall = (getState , url , requestData ,staticHeader,newRequest,dispatch ,isPaginationLoading ) => {
    isPaginationLoading.current = true;
    callApi(getState, "GET", url, requestData, false, staticHeader)
      .then((res) => {
        const dataRespo = res.data;
        if (newRequest) {
          dispatch(actionCreator(CONSTANTS.GETSTORIES.SUCCESS, dataRespo));
        } else {
          dispatch(
            actionCreator(CONSTANTS.GETSTORIESPAGINATION.SUCCESS, dataRespo)
          );
          isPaginationLoading.current = false;
        }
      })
      .catch((err) => {
        if (newRequest) {
          dispatch(
            actionCreator(CONSTANTS.GETSTORIES.FAILURE, err?.response?.data)
          );
        } else {
          dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.FAILURE, err));
          isPaginationLoading.current = false;
        }
      });
  }


  export const getStories = (data, newRequest = true, isPaginationLoading = {},homepage=false) => {
    return (dispatch, getState) => {
      let url = API_URLS.getOwnStories(data),
        staticHeader = createHeader();
        if(homepage){
          url=API_URLS.getHomepageStories(data)
        }
      if(data.treeId) {
        url = API_URLS.getStories(data)
      }
      if (data.categoryName) {
        url = url + `?categoryName=${data.categoryName}`;
      }
      if (newRequest) {
        dispatch(actionCreator(CONSTANTS.GETSTORIES.REQUEST));
      } else {
        dispatch(actionCreator(CONSTANTS.GETSTORIESPAGINATION.REQUEST));
      }
        getStoriesAPICall(getState , url , data ,staticHeader,newRequest,dispatch ,isPaginationLoading)        
    };
  };

  export const getHomeStoryAndUpdateList = (data)=>{
    return (dispatch, getState) => {
      let url = API_URLS.viewStory(data),
        staticHeader = createHeader();       
      return callApi(getState, "GET", url, data, false, staticHeader)
        .then(async(res) => {
           let userUrl=API_URLS.getADB2CUserInfo(res?.data?.authorId) 
           let authorData=await callApi(getState, "GET", userUrl, {}, false, staticHeader);
           res.data.author=authorData?.data;
          dispatch(actionCreator(CONSTANTS.GETHOMESTORYANDUPDATELIST.SUCCESS, res.data));
        })
        .catch((err) => {
          console.log(err)
        });
    };
  }

 const getStoriesCountAPICall = (getState , url , requestData , staticHeader , dispatch) => {
  callApi(getState, "GET", url, requestData, false, staticHeader)
  .then((res) => {
    dispatch(
      actionCreator(
        CONSTANTS.GETSTORIESCOUNT.SUCCESS,
        res.data?.resultData?.AllStoryCount || 0
      )
    );
  })
  .catch((err) => {
    dispatch(actionCreator(CONSTANTS.GETSTORIESCOUNT.FAILURE, {}));
  })
 }


export const getStoriesCount = () => {
  let requestData = { authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getStoriesCount(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETSTORIESCOUNT.REQUEST));
    getStoriesCountAPICall(getState, url, requestData, staticHeader, dispatch)
  };
};


  export const getTreesListAsync = () => {
    let requestData = {authorId: getOwner() };
      let url = API_URLS.getTreesASYNC(requestData),
        staticHeader = createHeader();
        return apiRequest("GET", url, requestData, false, staticHeader)
          .then((res) => {
            return res.data || []
          })
          .catch((err) => {
            return []
          });
  }

  export const getTreesList = () => {
    let requestData = {authorId: getOwner() };
    return (dispatch, getState) => {
      let url = API_URLS.getTreesList(requestData),
        staticHeader = createHeader();
      dispatch(actionCreator(CONSTANTS.GETTREESLIST.REQUEST));
      callApi(getState, "GET", url, requestData, false, staticHeader)
      .then((res) => {
        const latestTree = getRecentTree()
          if(latestTree === null && res.data && res.data.length > 0)
            {
              let recentTree = "";
              recentTree = {treeId: res.data[0].treeId, primaryPersonId: res.data[0].homePersonId, level:4}
              setRecentTree(recentTree)
            }
        dispatch(
          actionCreator(
            CONSTANTS.GETTREESLIST.SUCCESS,
            res.data || []
          )
        );
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.GETTREESLIST.FAILURE, {}));
      })
    };
  };

  export const addRecentViewTree= async (treeId) => {
    await apiRequest(POST, `User/addrecentlyviewedtree/${treeId}`, {});
  }

  export const getRecentPeopleList = () => {
    let requestData = { authorId: getOwner() };
    return (dispatch, getState) => {
      let url = API_URLS.getRecentPeople(requestData),
        staticHeader = createHeader();
      dispatch(actionCreator(CONSTANTS.RECENTPEOPLE.REQUEST));
      callApi(getState, "GET", url, requestData, false, staticHeader)
        .then((res) => {
          dispatch(actionCreator(CONSTANTS.RECENTPEOPLE.SUCCESS, res.data || []));
        })
        .catch(() => {
          dispatch(actionCreator(CONSTANTS.RECENTPEOPLE.FAILURE));
        });
    };
  };

  export const updateStoryIsLiked = (storyId, isLiked, storyIndex) => {
    const requestData = { storyId: storyId, isLiked: isLiked, storyIndex:storyIndex };
    return (dispatch, getState) => {
      let url = API_URLS.updateStoryIsLiked(requestData),
        staticHeader = createHeader();
      dispatch(actionCreator(CONSTANTS.UPDATESTORYISLIKED.REQUEST));
      callApi(getState, "POST", url, {}, false, staticHeader)
        .then((res) => {
          dispatch(actionCreator(CONSTANTS.UPDATESTORYISLIKED.SUCCESS, requestData));
        })
        .catch((err) => {
          dispatch(addMessage("Sorry, your story couldn't be update. Please try again.", "error"));
          return err?.response?.data
        });
    };
  };

  export const storylikespersons = (storyId, pageNumber, pageSize, isLikesPageLoading= {}) => {
    const requestData = { storyId , pageNumber, pageSize};
    return (dispatch, getState) => {
      let url = API_URLS.storylikespersons(requestData),
        staticHeader = createHeader();
      dispatch(actionCreator(CONSTANTS.STORYLIKESPERSONS.REQUEST, pageNumber));
      callApi(getState, "GET", url, {}, false, staticHeader)
        .then((res) => {
          dispatch(actionCreator(CONSTANTS.STORYLIKESPERSONS.SUCCESS, { data :res.data, pageNumber}  || {}));
        })
        .catch((err) => {
          dispatch(addMessage("Sorry, your story couldn't be update. Please try again.", "error"));
          return err?.response?.data
        });
    };
  };

  export const clearStorylikespersons = () => async (dispatch) => {
    dispatch({ type: CLEAR_STORY_LIKES_PERSONS })
}