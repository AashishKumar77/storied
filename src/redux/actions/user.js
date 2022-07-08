import {
    GET,
    POST,
    GET_USER,
    USER_ERROR,
    PROFILE_LOADING,
    SAVE_PROFILE,
    SHOW_PROFILE,
    DELETE,
    CLEAR_PROFILE_IMAGE,
    GET_USER_PROFILE_IMAGE,
    PROFILE_CHANGED,
    SET_PROFILE_IMAGE,
    CLEAR_EDIT_IMAGE,
    SHOW_EDIT_IMAGE,
    PROFILE_IMAGE_UPLOADED,
    ADD_PROFILE_THUMBNAIL,
    ACCESS_CODE_VALIDATING,
    ACCESS_CODE_INVALID,
    ACCESS_CODE_VALID,
    CLEAR_ACCESS,
    UPDATE_USER,
    PROFILE_IMAGE_DELETED
} from "../constants";
import { apiRequest } from "../requests";
import { userImageUploadPayload, userEditImageUploadPayload } from "./../helpers";
import { checkValue } from "../../utils";
import { setUserCheck, getUserCheck, setAccessCode } from "../../services";

export const getUserAccount = (userId) => async (dispatch) => {
    let userCheck = getUserCheck();
    try {

        const adb2cInfo = await apiRequest(GET, `Users/${userId}/adb2cinfo`)

        if (userCheck === null) {
            setUserCheck(true);
            await apiRequest(POST, `User/createstorieduser`,)
        }

        const res = await apiRequest(GET, `Users/${userId}/info`);
        let payload = {
            id: adb2cInfo.data.userId,
            firstName: checkValue(adb2cInfo.data.givenName),
            lastName: checkValue(adb2cInfo.data.surname),
            email: adb2cInfo.data.mail,
            birthPlace: checkValue(adb2cInfo.data.city),
            birthDate: '',
            profileImageId: res.data.profileImageId,
            imgSrc: res.data.profileImageUrl,
            birthLocationId: ""
        }

        dispatch({
            type: GET_USER,
            payload: payload
        });
        dispatch({ type: SAVE_PROFILE });
    }
    catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const showProfile = () => async (dispatch) => {
    try {
        dispatch({ type: SHOW_PROFILE });
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        });
    }
}

export const profileChange = () => async (dispatch) => {
    try {
        dispatch({ type: PROFILE_CHANGED });
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        });
    }
}

export const saveUserProfileImage = (imagePayload) => async (dispatch) => {
    try {
        dispatch({ type: PROFILE_LOADING });
        dispatch({
            type: ADD_PROFILE_THUMBNAIL,
            payload: imagePayload
        })
        const payload = userImageUploadPayload(imagePayload);
        await apiRequest(POST, `Media/uploaduserprofileimage`, payload);
        dispatch({ type: SAVE_PROFILE });
        dispatch({ type: PROFILE_IMAGE_UPLOADED })
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const editUserProfileImage = (imagePayload) => async (dispatch) => {
    try {
        dispatch({ type: PROFILE_LOADING });
        dispatch({
            type: ADD_PROFILE_THUMBNAIL,
            payload: imagePayload
        })
        const payload = userEditImageUploadPayload(imagePayload);
        await apiRequest(POST, `Media/edituserprofileimage`, payload);
        dispatch({ type: PROFILE_IMAGE_UPLOADED })
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const deleteUserProfileImage = (userId) => async (dispatch) => {
    try {
        dispatch({ type: PROFILE_LOADING });
        dispatch({ type: PROFILE_IMAGE_DELETED })
        await apiRequest(DELETE, `User/deleteuserprofileimage/${userId}`);
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const getUserProfileImage = (profileImageId) => async (dispatch) => {
    try {
        const res = await apiRequest(GET, `Media/${profileImageId}/OriginalImage`);

        dispatch({
            type: GET_USER_PROFILE_IMAGE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const clearProfileImage = () => async (dispatch) => {
    try {
        dispatch({ type: CLEAR_PROFILE_IMAGE });
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateUser = (payload) => async (dispatch) => {
    try {
        let updateUserPayload = {
            userFirstName: payload.givenName,
            userLastName: payload.surname,
        }
        dispatch({ type: PROFILE_LOADING });
        dispatch ({ type: UPDATE_USER, payload:updateUserPayload })
        await apiRequest(POST, `User/updateuser`, payload);

    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const setProfileImage = (userId) => async (dispatch) => {
    try {
        const res = await apiRequest(GET, `Users/${userId}/info`)

        dispatch({
            type: SET_PROFILE_IMAGE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const clearEditImage = () => async (dispatch) => {
    try {
        dispatch({ type: CLEAR_EDIT_IMAGE });
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const showEditImage = () => async (dispatch) => {
    try {
        dispatch({ type: SHOW_EDIT_IMAGE });
    } catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}

export const accessCodeValidation = (accessCode, instance) => async (dispatch) => {
    try {
        let payload = {
            accessCode,
        }

        dispatch({
            type: ACCESS_CODE_VALIDATING
        })
        const response = await apiRequest(POST, `user/verifyaccess`, payload);
        if (response.data === "Failure") {
            dispatch({
                type: ACCESS_CODE_INVALID
            })
        }
        else {
            setAccessCode(accessCode)
            dispatch({
                type: ACCESS_CODE_VALID
            })
        }
    }
    catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }

}

export const clearAccess = () => async (dispatch) => {
    try {
        dispatch({
            type: CLEAR_ACCESS
        })
    }
    catch (err) {
        dispatch({
            type: USER_ERROR,
            payload: { msg: err }
        })
    }
}
export const addRecentViewPeople = ({ primaryPersonId, treeId }) => async () => {
    await apiRequest(POST, `user/addrecentlyviewedpeople/${treeId}/${primaryPersonId}`, {});

}