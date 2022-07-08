import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
  isLoading: false,
  isPaySuccess: false,
}

const payment = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.SUBMITCARDDETAILS.REQUEST:
            return {
                ...state,
                isLoading: true,
            }
        case CONSTANTS.SUBMITCARDDETAILS.SUCCESS:
            return {
                ...state,
                isLoading: false,
                isPaySuccess: true,
            }
        case CONSTANTS.SUBMITCARDDETAILS.FAILURE:
            return {
                ...state,
                isLoading: false,
                isPaySuccess: false,
            }
        default:
            return {
                ...state,
            }
    }
}

export default payment
