import * as CONSTANTS from "../constants/actionTypes";
import { mapCondForNotif } from "./../utils";

const initialState = {
  notif: [],
  loader: false,
  notifCount: 0,
};

const notification = (state = initialState, { type = null, payload = null } = {}) => {
  switch (type) {
    case CONSTANTS.GETNOTIF.REQUEST:
      return {
        ...state,
        loader: true,
      };
    case CONSTANTS.GETNOTIF.SUCCESS:
      return {
        ...state,
        notif: [...state?.notif, ...payload],
        loader: false,
      };
    case CONSTANTS.GETNOTIF.FAILURE:
      return {
        ...state,
        loader: false,
      };
    case CONSTANTS.GETACTUALNOTIF.SUCCESS:
      return {
        ...state,
        notif: (state.notif || []).map((item) => mapCondForNotif(item, payload)),
      };
    case CONSTANTS.UPDATENOTIFCOUNT.SUCCESS:
      return {
        ...state,
        notifCount: payload,
      };
    case CONSTANTS.REFRESHNOTIF.SUCCESS:
      return {
        ...state,
        notif: [],
      };
    default:
      return {
        ...state,
      };
  }
};
export default notification;
