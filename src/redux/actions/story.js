import { actionCreator, callApi } from "./../utils";
import * as CONSTANTS from "./../constants/actionTypes";
import * as API_URLS from "./../constants/apiUrl";
import { v4 as uuidv4 } from "uuid";
import { addMessage } from "./toastr";
import { getOwner } from "../../services";
import { FEATURED_STORY_ID_REDIRECT } from "../constants";
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const createHeader = () => {
  return {
    "wa-clientId": CLIENT_ID,
    "wa-requestId": uuidv4(),
  };
};
const createMultipartHeader = () => {
  return {
    ...createHeader(),
    "Content-Type": "multipart/form-data",
  };
};

export const getStory = (data, newRequest = true, isPagintionLoading = {}) => {
  let requestData = { ...data, authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getStories(requestData),
      staticHeader = createHeader();
    if (data.categoryName) {
      url = url + `?categoryName=${data.categoryName}`;
    }
    if (newRequest) {
      dispatch(actionCreator(CONSTANTS.GETSTORY.REQUEST));
    } else {
      dispatch(actionCreator(CONSTANTS.GETSTORYPAGINATION.REQUEST));
    }
    setTimeout(() => {
      isPagintionLoading.current = true;
      callApi(getState, "GET", url, requestData, false, staticHeader)
        .then((res) => {
          const dataRespo = res.data;
          if (newRequest) {
            dispatch(actionCreator(CONSTANTS.GETSTORY.SUCCESS, dataRespo));
          } else {
            dispatch(actionCreator(CONSTANTS.GETSTORYPAGINATION.SUCCESS, dataRespo));
            isPagintionLoading.current = false;
          }
        })
        .catch((err) => {
          if (newRequest) {
            dispatch(actionCreator(CONSTANTS.GETSTORY.FAILURE, err.response.data));
          } else {
            dispatch(actionCreator(CONSTANTS.GETSTORYPAGINATION.FAILURE, err));
            isPagintionLoading.current = false;
          }
        });
    }, 1000);
  };
};
export const getStoryAndUpdateList = (data) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewStory(data),
      staticHeader = createHeader();
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.GETSTORYANDUPDATELIST.SUCCESS, res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  };
};
export const editStory = (formData, history, treeId, personId, setSubmitting, ref) => {
  return (dispatch, getState) => {
    let url = API_URLS.editStoryApi,
      staticHeader = createMultipartHeader();
    dispatch(actionCreator(CONSTANTS.POSTSTORY.REQUEST));
    callApi(getState, "PUT", url, formData, false, staticHeader)
      .then((res) => {
        setSubmitting(false);
        dispatch(actionCreator(CONSTANTS.POSTSTORY.SUCCESS, res.data));
        dispatch(addMessage("Story has been updated succesfully", "success"));
        if (ref !== "1" && treeId && personId) {
          history.push(`/family/person-page/${treeId}/${personId}?tab=0`);
        } else {
          if (ref === "1") {
            history.push("/stories");
          } else {
            history.push("/");
          }
        }
      })
      .catch((err) => {
        setSubmitting(false);
        dispatch(actionCreator(CONSTANTS.SAVETOTREE.FAILURE, err?.response?.data));
        dispatch(addMessage("Sorry, your story couldn't be update. Please try again.", "error"));
      });
  };
};
export const addStory = (data, history, tree_id, person_id, submit, ref, mediaId) => {
  return (dispatch, getState) => {
    let url = API_URLS.saveStoryApi,
      staticHeader = createMultipartHeader();
    dispatch(actionCreator(CONSTANTS.POSTSTORY.REQUEST));
    callApi(getState, "POST", url, data, false, staticHeader)
      .then((res) => {
        submit(false);
        // dispatch(apiDelay())
        setTimeout(() => {
          dispatch(actionCreator(CONSTANTS.POSTSTORY.SUCCESS, res.data));
          dispatch(addMessage("Story has been created succesfully", "success", mediaId ? { cta: { action: () => history.push(`/stories/view/0/${data.get("storyId")}?mediaId=${mediaId}`), text: "View" } } : null));
          if (ref !== "1" && tree_id && person_id) {
            let urlCal = `/family/person-page/${tree_id}/${person_id}?tab=0`;
            history.push(urlCal);
          } else {
            if (ref === "1") {
              history.push("/stories");
            } else if (ref === "4" && mediaId) {
              history.push(`/media/view-image/${mediaId}`);
              // For Redirection to Story Page when going back from Media Viewer
              dispatch({
                type: FEATURED_STORY_ID_REDIRECT,
                payload: data.get("storyId"),
              });
            } else {
              history.push("/");
            }
          }
        }, 1500);
      })
      .catch((err) => {
        submit(false);
        dispatch(actionCreator(CONSTANTS.POSTSTORY.FAILURE, err?.response?.data));
        dispatch(addMessage("Sorry, your story couldn't be saved. Please try again.", "error"));
      });
  };
};
export const deleteStoryPerson = (item, storyId, personDetail, removeIndex) => {
  return (dispatch, getState) => {
    let NewPrimaryPersonId = removeIndex === 0 ? personDetail[1].id : personDetail[0].id;
    const data = { storyId: storyId, personId: item.id, treeId: item.treeId, NewPrimaryPersonId };
    let url = API_URLS.deleteStoryPerson,
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.DELETESTORYPERSON.REQUEST));
    callApi(getState, "PUT", url, data, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.DELETESTORYPERSON.SUCCESS, item));
        dispatch(addMessage("Person has been removed successfully in this story"));
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.DELETESTORYPERSON.FAILURE, err.response.data));
        dispatch(addMessage("something went wrong", "error"));
      });
  };
};
export const viewStory = (data) => {
  return (dispatch, getState) => {
    let url = API_URLS.viewStory(data),
      staticHeader = createHeader();

    dispatch(actionCreator(CONSTANTS.VIEWSTORY.REQUEST));
    return callApi(getState, "GET", url, data, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.SUCCESS, res.data));
        return res.data;
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.VIEWSTORY.FAILURE, err?.response));
      });
  };
};

export const deleteStory = (data, params) => {
  return (dispatch, getState) => {
    let url = API_URLS.deleteStory(data.storyId),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.DELETESTORY.REQUEST));
    callApi(getState, "DELETE", url, {}, false, staticHeader)
      .then((res) => {
        setTimeout(() => {
          dispatch(actionCreator(CONSTANTS.DELETESTORY.SUCCESS, res.data));
          dispatch(addMessage("Story deleted successfully"));
          if (params.refType !== "1" && params.treeId && params.primaryPersonId) {
            params.history.push(`/family/person-page/${params.treeId}/${params.primaryPersonId}?tab=0`);
          } else {
            params.history.push(params.refType === "1" ? `/stories` : `/`);
          }
        }, 1500);
      })
      .catch((err) => {
        dispatch(actionCreator(CONSTANTS.DELETESTORY.FAILURE, err.response));
        dispatch(addMessage("We are unable to delete this story at this time, please try again later.", "error"));
      });
  };
};

export const getLeftPanelDetails = (data) => {
  let requestData = { ...data, authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getLeftPanelDetailsOwner(),
      staticHeader = createHeader();
    if (requestData.treeId && requestData.personId) {
      url = API_URLS.getLeftPanelDetails(requestData);
    }
    dispatch(actionCreator(CONSTANTS.GETLEFTPANELDETAILS.REQUEST));
    setTimeout(
      () =>
        callApi(getState, "GET", url, requestData, false, staticHeader)
          .then((res) => {
            //  pass res.data instead of static json when API is up
            dispatch(actionCreator(CONSTANTS.GETLEFTPANELDETAILS.SUCCESS, res.data?.resultData || {}));
          })
          .catch((err) => {
            dispatch(actionCreator(CONSTANTS.GETLEFTPANELDETAILS.FAILURE, {}));
          }),
      1000
    );
  };
};

export const getRightPanelDetails = (data) => {
  let requestData = { ...data, authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getRightPanelDetails(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.GETRIGHTPANELDETAILS.REQUEST));
    setTimeout(
      () =>
        callApi(getState, "GET", url, requestData, false, staticHeader)
          .then((res) => {
            dispatch(actionCreator(CONSTANTS.GETRIGHTPANELDETAILS.SUCCESS, res.data || {}));
          })
          .catch((err) => {
            dispatch(actionCreator(CONSTANTS.GETRIGHTPANELDETAILS.FAILURE));
          }),
      1000
    );
  };
};

export const getSpousesWithChildren = (data) => {
  let requestData = { ...data, authorId: getOwner() };
  return (dispatch, getState) => {
    let url = API_URLS.getSpousesWithChildren(requestData),
      staticHeader = createHeader();
    dispatch(actionCreator(CONSTANTS.SPOUSESWITHCHILDREN.REQUEST));
    setTimeout(
      () =>
        callApi(getState, "GET", url, requestData, false, staticHeader)
          .then((res) => {
            dispatch(actionCreator(CONSTANTS.SPOUSESWITHCHILDREN.SUCCESS, res.data || {}));
          })
          .catch((err) => {
            dispatch(actionCreator(CONSTANTS.SPOUSESWITHCHILDREN.FAILURE));
          }),
      1000
    );
  };
};

export const updatePrivacyStatus = (storyId, privacyStatus) => {
  return (dispatch, getState) => {
    const data = { StoryId: storyId, privacy: privacyStatus };
    let url = API_URLS.updatePrivacyStatus,
      staticHeader = createMultipartHeader();
    dispatch(actionCreator(CONSTANTS.UPDATEPRIVACYSTATUS.REQUEST));
    callApi(getState, "PUT", url, data, false, staticHeader)
      .then((res) => {
        dispatch(actionCreator(CONSTANTS.UPDATEPRIVACYSTATUS.SUCCESS, privacyStatus));
        dispatch(addMessage("Story has been updated succesfully", "success"));
      })
      .catch((err) => {
        dispatch(addMessage("Sorry, your story couldn't be update. Please try again.", "error"));
        return err?.response?.data;
      });
  };
};
