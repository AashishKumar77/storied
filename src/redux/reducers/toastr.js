import * as CONSTANTS from "../constants/actionTypes";
const initialState = {
    message: []
};
  
const toastr = (state = initialState, { type = null, payload = null } = {}) => {
    switch (type) {
        case CONSTANTS.ADDTMESSAGE:
            let message = state.message
            if(message.length >= 3) {
                message = state.message.slice(0, 2)
            }
            return {
                ...state,
                message: [ payload, ...message ],
            };
        case CONSTANTS.REMOVETMESSAGE:
            return {
                ...state,
                message: state.message.filter((_message)=>_message.key!==payload),
            };
        default:
            return {
                ...state,
            }
    }
}
export default toastr;