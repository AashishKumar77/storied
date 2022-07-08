import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    isLoading: false,
    savedRecord:null,
    showTextMsg:false
}


const personResearch = (state = initialState, { type =null, payload=null  }={}) => {
    switch (type) {
        case CONSTANTS.RESEARCHSAVEDRECORD.REQUEST:
            return {
                ...state,
                savedRecord:null,
                isLoading: true,
            }
        case CONSTANTS.RESEARCHSAVEDRECORD.SUCCESS:
            return {
                ...state,
                savedRecord:payload,
                isLoading:false
            }
        case CONSTANTS.RESEARCHSAVEDRECORD.FAILURE:
            return {
                ...state,
                isLoading: false,
            }
            case CONSTANTS.SAVERECORDMSG.SUCCESS:
                return {
                    ...state,
                    showTextMsg:payload
                }
            case CONSTANTS.SAVERECORDMSG.FAILURE:
                return {
                    ...state,
                    showTextMsg:false
                }
        default:
            return {
                ...state
            }
    }
}
export default personResearch;