import * as API_URLS from "../constants/apiUrl";
import * as CONSTANTS from "../constants/actionTypes";
import { actionCreator, callApi } from "../utils";
import { addMessage } from "./toastr";
import { setIsPrivileged } from "../../services";
import { strFirstUpCase } from "../../utils";

const createHeader = () => {
    return {
      "X-Api-Key": "C5BFF7F0-B4DF-475E-A331-F737424F013C",
    };
  };

  export const submitCardDetails = (formData) => {
    const requestData = { ...formData };
    return (dispatch, getState) => {
      let url = API_URLS.SUBMITCARDDETAILS,
        staticHeader = createHeader();
      dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.REQUEST));
      callApi(getState, "POST", url, requestData, false, staticHeader, true)
        .then((res) => {
          if(res?.data?.flagProcess) {
            setIsPrivileged(true);
            dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.SUCCESS, requestData));
          } else {
            dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, res?.rrorMessage));
            dispatch(addMessage(strFirstUpCase(res?.data?.errorMessage), "error"));
          }
        })
        .catch((err) => {
          dispatch(actionCreator(CONSTANTS.SUBMITCARDDETAILS.FAILURE, err));
          dispatch(addMessage("Sorry, your payment is unsuccessfull. Please try again.", "error"));
        });
    };
  };
