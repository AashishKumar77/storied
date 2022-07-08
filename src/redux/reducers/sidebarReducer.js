import * as CONSTANTS from "../constants/actionTypes";

const initialState = {
    isLoading: true,
    ssid: {},
    census: null,
    newspaper: {},
    comparedTo: false,
    comparedProfile: null,
    saveTree:null,
    error: false,
    compareError: false,
    userTrees:[],
    treePeople:null,
    dropDownLoading:false,
    treePeopleDropdownLoad:false,
    saveToTreeLoading: false,
    saveToTreeError: false,
    contentCatalog:null,
    ssidDataSource:[]
}


const sidebarReducer = (state = initialState, { type =null, payload=null  }={}) => {
    switch (type) {
        case CONSTANTS.SSID.REQUEST:
            return {
                ...state,
                isLoading: true,
                // ssid: {},
                error: false
            }
        case CONSTANTS.SSID.SUCCESS:
            return {
                ...state,
                ssid: payload,
                census: null,
                comparedTo: false,
                comparedProfile: null,
                newspaper: {},
                isLoading: false,
                error: false
            }
        case CONSTANTS.SSID.FAILURE:
            return {
                ...state,
                isLoading: false,
                // ssid: {},
                error: true
            }
        case CONSTANTS.NEWSPAPER.REQUEST:
            return {
                ...state,
                isLoading: true,
                newspaper: {},
                error: false
            }
        case CONSTANTS.NEWSPAPER.SUCCESS:
            return {
                ...state,
                ssid: {},
                census: null,
                comparedTo: false,
                comparedProfile: null,
                newspaper: payload,
                isLoading: false,
                error: false
            }
        case CONSTANTS.NEWSPAPER.FAILURE:
            return {
                ...state,
                isLoading: false,
                newspaper: {},
                error: true
            }
        case CONSTANTS.CENSUS.REQUEST:
            return {
                ...state,
                isLoading: true,
                census: null,
                error: false
            }
        case CONSTANTS.CENSUS.SUCCESS:
            return {
                ...state,
                ssid: {},
                saveTree:null,
                census: payload,
                comparedTo: false,
                comparedProfile: null,
                newspaper: {},
                isLoading: false,
                error: false
            }
        case CONSTANTS.CENSUS.FAILURE:
            return {
                ...state,
                isLoading: false,
                census: null,
                error: true
            }
        case CONSTANTS.CENSUSCOMPARETO.REQUEST:
        case CONSTANTS.SSDICOMPARETO.REQUEST:
        case CONSTANTS.NEWSPAPERCOMPARETO.REQUEST:
            return {
                ...state,
                comparedTo: false,
                comparedProfile: null,
                compareError: false
            }
        case CONSTANTS.CENSUSCOMPARETO.SUCCESS:
        case CONSTANTS.SSDICOMPARETO.SUCCESS:
        case CONSTANTS.NEWSPAPERCOMPARETO.SUCCESS:
            return {
                ...state,
                comparedTo: true,
                comparedProfile: payload,
                compareError: false
            }
        case CONSTANTS.CENSUSCOMPARETO.FAILURE:
        case CONSTANTS.SSDICOMPARETO.FAILURE:
        case CONSTANTS.NEWSPAPERCOMPARETO.FAILURE:
            return {
                ...state,
                comparedTo: true,
                comparedProfile: null,
                compareError: true
            }
        
        case CONSTANTS.SAVETREE.REQUEST:
            return {
                ...state,
                isLoading:false
            }
        case CONSTANTS.SAVETREE.SUCCESS:
            return {
                ...state,
                comparedTo: false,
                saveTree: payload
            }
        case CONSTANTS.SAVETREE.FAILURE:
            return {
                ...state,
                comparedTo: true,
                comparedProfile: null
            }
            case CONSTANTS.USERTREES.REQUEST:
                return {
                    ...state,
                    dropDownLoading:true
                }
            case CONSTANTS.USERTREES.SUCCESS:
                return {
                    ...state,
                    userTrees: payload
                }
            case CONSTANTS.USERTREES.FAILURE:
                return {
                    ...state,
                    dropDownLoading:false
                }
            case CONSTANTS.TREEPEOPLE.REQUEST:
                return {
                    ...state,
                    treePeopleDropdownLoad:true
                }
            case CONSTANTS.TREEPEOPLE.SUCCESS:
                return {
                    ...state,
                    treePeople: payload
                }
            case CONSTANTS.TREEPEOPLE.FAILURE:
                return {
                    ...state,
                    treePeopleDropdownLoad:false
                }
            case CONSTANTS.SAVETOTREE.REQUEST:
                return {
                    ...state,
                    saveToTreeLoading:true,
                    saveToTreeError: false
                }
            case CONSTANTS.SAVETOTREE.SUCCESS:
                return {
                    ...state,
                    saveToTreeLoading:false,
                    saveToTreeError: false
                }
            case CONSTANTS.SAVETOTREE.FAILURE:
                return {
                    ...state,
                    saveToTreeLoading:false,
                    saveToTreeError: payload
                }
                case CONSTANTS.SSIDDATASOURCE.SUCCESS:
                    return {
                        ...state,
                        ssidDataSource:payload,
                       
                }
                case CONSTANTS.CONTENTCATALOG.REQUEST:
                    return {
                        ...state,
                    }
                case CONSTANTS.CONTENTCATALOG.SUCCESS:
                    return {
                        ...state,
                        contentCatalog:payload,
                        isLoading:false
                       
                    }
                case CONSTANTS.CONTENTCATALOG.FAILURE:
                    return {
                        ...state,
                        contentCatalog:null,
                        isLoading:false
                    }
            default:
                return {
                    ...state
                }
    }
}
export default sidebarReducer;