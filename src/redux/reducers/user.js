import { 
    GET_USER, 
    USER_ERROR, 
    SHOW_PROFILE, 
    PROFILE_LOADING, 
    SAVE_PROFILE, 
    GET_USER_PROFILE_IMAGE,
    CLEAR_PROFILE_IMAGE,
    PROFILE_CHANGED,
    SET_PROFILE_IMAGE,
    CLEAR_EDIT_IMAGE,
    SHOW_EDIT_IMAGE,
    PROFILE_IMAGE_UPLOADED,
    CLEAR_REFETCH_INFO,
    ADD_PROFILE_THUMBNAIL,
    ACCESS_CODE_VALIDATING,
    ACCESS_CODE_INVALID,
    ACCESS_CODE_VALID,
    CLEAR_ACCESS,
    UPDATE_USER,
    PROFILE_IMAGE_DELETED
 } from "../constants";

const initialState = {
    loading: true,
    error: null,
    user: null,
    userName: null,
    userFirstName: null,
    userLastName: null,
    userEmail: null,
    userId: null,
    imgSrc: null,
    showProfileModalModal: false,
    profileLoading: false,
    originalProfileImage: null,
    originalImageId: null,
    profileChanged: false,
    showEditImageCropper: false,
    originalUserImage: null,
    imageUploaded: false,
    accessCodeValidating: false,
    accessCodeInvalid: false,
    redirectToLogin: false
    
}

const user = (state = initialState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case GET_USER:
            return {
                ...state,
                userProfileAccount: payload,
                userAccount: payload,
                userId: payload.id,
                userFirstName: payload.firstName,
                userLastName: payload.lastName,
                userEmail: payload.email,
                userBirthDate: payload.birthDate,
                userBirthPlace: payload.birthPlace,
                imgSrc: payload.imgSrc,
                profileImageId: payload.profileImageId,
                userLoading: false
            }
        
        case UPDATE_USER:
            return {
                ...state,
                userFirstName: payload.userFirstName,
                userLastName: payload.userLastName
            }           
        case PROFILE_IMAGE_UPLOADED :
            return {
                ...state,
                originalProfileImage: null,
                originalImageId: null  
                
            }
        case CLEAR_REFETCH_INFO: 
        return {
            ...state,
            imageUploaded: false
        }
        case USER_ERROR:
            return {
                ...state,
                error: payload,
                userLoading: false,
                profileLoading: false,
                showProfileModal: false
            }
        
        case SHOW_PROFILE:
            return {
                ...state,
                showProfileModal: true,
                profileLoading: false
            }

        case PROFILE_LOADING:
            return {
                ...state,
                profileLoading: true
            }
        case ADD_PROFILE_THUMBNAIL: 
        return {
            ...state,
            imgSrc: payload.accountThumbnail,
            showEditImageCropper: false
        }
        case PROFILE_IMAGE_DELETED: 
        return {
            ...state,
            imgSrc: ""
        }
        case SAVE_PROFILE:
            return {
                ...state,
                profileLoading: false,
                showProfileModal: false,
                profileChanged: false
            }
        case GET_USER_PROFILE_IMAGE: 
        return {
            ...state,
            originalProfileImage: payload.originalImagePath,
            originalImageId: payload.originalImageId,
            originalUserImage: payload,

        }

        case CLEAR_PROFILE_IMAGE:
            return {
                ...state,
                originalProfileImage: null,
                showProfileModal: false,
                originalImageId: null  
            }
        
        case PROFILE_CHANGED: 
        return {
            ...state,
            profileChanged: true
        }

        case SET_PROFILE_IMAGE: 
        return {
            ...state,
            imgSrc: payload.profileImageUrl,
            profileImageId: payload.profileImageId
        }
        case CLEAR_EDIT_IMAGE:
            return {
                ...state,
                showEditImageCropper: false,
                originalProfileImage: ""
            }
        case SHOW_EDIT_IMAGE:
            return {
                ...state,
                showEditImageCropper: true
            }
        case ACCESS_CODE_VALIDATING:
            return {
                ...state,
                accessCodeValidating: true,
                accessCodeInvalid: false
            }
        case ACCESS_CODE_INVALID:
            return {
                ...state,
                accessCodeValidating: false,
                accessCodeInvalid: true
            }
        case ACCESS_CODE_VALID:
            return {
                ...state,
                accessCodeValidating: false,
                accessCodeInvalid: false,
                redirectToLogin: true
            }
        case CLEAR_ACCESS: 
        return {
            redirectToLogin: false
        }
        default:
            return state;
    }
}

export default user;