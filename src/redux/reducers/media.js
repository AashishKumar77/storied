import { FEATURED_STORY_ID_REDIRECT, RESET_MEDIA } from "../constants";
import * as CONSTANTS from "../constants/actionTypes";


const initialState = {
    isLoading: true,
    mediaDetails: {},
    error: false,
    userDetails: {},
    featuredStoryIdRedirect : ""
}

const media = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.MEDIA.REQUEST:
        case CONSTANTS.GETUSERDETAILS.REQUEST:
            return {
                ...state,
                isLoading: true,
                error: false
            }
        case CONSTANTS.MEDIA.SUCCESS:
            return {
                ...state,
                isLoading: false,
                mediaDetails: payload,
                error: false,
            }
        case CONSTANTS.GETUSERDETAILS.FAILURE:
        case CONSTANTS.MEDIA.FAILURE:
            return {
                ...state,
                isLoading: false,
                error: true
            }


        case CONSTANTS.GETUSERDETAILS.SUCCESS:
            return {
                ...state,
                isLoading: false,
                userDetails: payload,
                error: false,
            }


        case RESET_MEDIA:
            return {
                ...state,
                mediaDetails: payload
            }

        case FEATURED_STORY_ID_REDIRECT : 
            return {
                ...state,
                featuredStoryIdRedirect : payload
            }

        default:
            return {
                ...state
            }
    }
}

export default media