import * as CONSTANTS from "./../constants/actionTypes";
import { actionCreator } from "./../utils";

export const addMessage = (message, type="success", ...rest) => {
    let options = {canClose:true, cta: null}
    rest.forEach((_param)=> {
        options = {...options, ..._param}
    })
    if(options.url){
    return (dispatch, getState) => {
        dispatch(actionCreator(CONSTANTS.ADDTMESSAGE, {
            key: new Date().getTime(), 
            icon: options.icon,
            content:message, 
            type: type, 
            canClose: false,
            url: options.url,
            ...options.cta?.action?{cta:options.cta}:{}
        }));
        }
    }
    else {
    return (dispatch, getState) => {
        dispatch(actionCreator(CONSTANTS.ADDTMESSAGE, {
            key: new Date().getTime(), 
            icon: options.icon,
            content:message, 
            type: type, 
            canClose: options.canClose,
            ...options.cta?.action?{cta:options.cta}:{}
        }));
    }}
}
export const removeMessage = (messageId) => {
    return (dispatch, getState) => {
        dispatch(actionCreator(CONSTANTS.REMOVETMESSAGE, messageId));
    }
}