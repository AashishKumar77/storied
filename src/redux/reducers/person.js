import {
    PERSON_PAGE_LOADING,
    GET_PERSON,
    GET_PERSONAL_INFO,
    GET_EVENTS,
    GET_SPOUSES,
    GET_PARENTS,
    GET_LIFEEVENTS,
    PERSON_ERROR,
    FETCH_PARENTS,
    UPDATE_PARENTS,
    FETCH_SPOUSES,
    UPDATE_SPOUSES,
    UPDATE_PERSONAL_INFO,
    UPDATE_PERSONINFO_ONLY,
    UPDATE_SPOUSES_AND_CHILDREN,
    UPDATE_PARENTS_AND_SIBLINGS,
    UPDATE_EVENTS,
    UPDATE_LIFE_EVENTS,
    UPDATE_PERSON,
    REFETCHED,
    WHOLE_REFETCHED,
    PARTIAL_REFETCHED,
    REFETCH_PERSON_INFO,
    REFETCH_PERSON_BASIC_INFO,
    PROFILE_IMAGE_LOADING,
    ADD_PERSON_THUMBNAIL,
    ADD_LIFEEVENT,
    SUCCESS_LIFEEVENT,
    FAIL_LIFEEVENT,
    ADD_PERSON_HERO_THUMBNAIL
} from "../constants";

const initialState = {
    loading: true,
    error: null,
    personalInfo: null,
    relation: null,
    events: null,
    spousesAndChildren: null,
    relatedParentIds: {},
    filialRelationshipId: null,
    parentsAndSiblings: null,
    lifeEvents: null,
    refetchedData: false,
    wholeRefetched: false,
    personRefetched: false,
    profileImageLoading: false,
    personalInfoLoading: false,
    eventsLoading: false,
    spousesLoading: false,
    parentsLoading: false,
    lifeEventsLoading: false,
    addingLifeEvent: false,
    lifeEventAdded: false,
}

const person = (state = initialState, action = {}) => {
    const { type, payload } = action;

    switch (type) {
        case PERSON_PAGE_LOADING:
            return {
                ...state,
                loading: true,
                personalInfoLoading: true,
                eventsLoading: true,
                spousesLoading: true,
                parentsLoading: true,
                lifeEventsLoading: true
            }

        case GET_PERSONAL_INFO:
            return {
                ...state,
                loading: false,
                personalInfo: payload.personalInfo,
                relation: payload.relation,
                personalInfoLoading: false
            }

        case GET_EVENTS:
            return {
                ...state,
                loading: false,
                events: payload,
                eventsLoading: false
            }

        case GET_SPOUSES:
            return {
                ...state,
                loading: false,
                spousesAndChildren: payload,
                spousesLoading: false
            }

        case GET_PARENTS:
            return {
                ...state,
                loading: false,
                relatedParentIds: payload.RelatedParentIds,
                filialRelationshipId: payload.FilialRelationshipId,
                parentsAndSiblings: payload.ParentsAndSiblings,
                parentsLoading: false
            }

        case GET_LIFEEVENTS:
            return {
                ...state,
                loading: false,
                lifeEvents: payload,
                lifeEventsLoading: false
            }

        case GET_PERSON:
            return {
                ...state,
                loading: false,
                events: payload.events,
                spousesAndChildren: payload.spousesAndChildren,
                relatedParentIds: payload.relatedParentIds,
                filialRelationshipId: payload.filialRelationshipId,
                parentsAndSiblings: payload.parentsAndSiblings,
                lifeEvents: payload.lifeEvents,
                wholeRefetched: false,
                personRefetched: false
            }

        case REFETCHED:
            return {
                ...state,
                refetchedData: true
            }

        case WHOLE_REFETCHED:
            return {
                ...state,
                personalInfo: payload.personalInfo,
                events: payload.events,
                spousesAndChildren: payload.spousesAndChildren,
                // relatedParentIds: payload.relatedParentIds,
                // filialRelationshipId: payload.filialRelationshipId,
                parentsAndSiblings: payload.parentsAndSiblings,
                lifeEvents: payload.lifeEvents,
                wholeRefetched: false
            }

        case PARTIAL_REFETCHED:
                return {
                    ...state,
                    events: payload.events,
                    spousesAndChildren: payload.spousesAndChildren,
                    relatedParentIds: payload.relatedParentIds,
                    filialRelationshipId: payload.filialRelationshipId,
                    parentsAndSiblings: payload.parentsAndSiblings,
                    lifeEvents: payload.lifeEvents,
                    personRefetched: false
                }

        case FETCH_PARENTS:
        case FETCH_SPOUSES:
            return {
                ...state,
                refetchedData: false
            }


        case UPDATE_PARENTS:
            return {
                ...state,
                relatedParentIds: payload.relatedParentIds,
                filialRelationshipId: payload.filialRelationshipId,
                parentsAndSiblings: payload.parentsAndSiblings,
                refetchedData: true
            }

        case UPDATE_SPOUSES:
            return {
                ...state,
                spousesAndChildren: payload,
                refetchedData: true
            }

        case UPDATE_PERSONAL_INFO:
            return {
                ...state,
                personalInfo: {
                    ...state.personalInfo,
                    givenName: payload.givenName,
                    surname: payload.surname,
                    gender: payload.gender
                }
            }

        case ADD_PERSON_THUMBNAIL:
            return {
                ...state,
                personalInfo: {
                    ...state.personalInfo,
                    profileImageUrl: payload.fileUrl,
                }
            }
        
            case ADD_PERSON_HERO_THUMBNAIL:
            return {
                ...state,
                personalInfo: {
                    ...state.personalInfo,
                    backgroundImageUrl: payload.fileUrl,
                }
            }

        case UPDATE_SPOUSES_AND_CHILDREN:
            return {
                ...state,
                spousesAndChildren: payload
            }

        case UPDATE_PARENTS_AND_SIBLINGS:
            return {
                ...state,
                parentsAndSiblings: payload
            }

        case UPDATE_EVENTS:
            return {
                ...state,
                events: payload
            }

        case UPDATE_LIFE_EVENTS:
            return {
                ...state,
                lifeEvents: payload
            }

        case UPDATE_PERSON:
            return {
                ...state,
                wholeRefetched: true
            }

        case UPDATE_PERSONINFO_ONLY:
            return {
                ...state,
                personRefetched: true
            }

        case PERSON_ERROR:
            return {
                ...state,
                loading: false,
                error: true
            }

        case PROFILE_IMAGE_LOADING:
            return {
                ...state,
                profileImageLoading: true,
            }
        case REFETCH_PERSON_INFO:
            return {
                ...state,
                profileImageLoading: false,
                personalInfo: payload.personalInfo,
                parentsAndSiblings: payload.parentsAndSiblings
            }
        case REFETCH_PERSON_BASIC_INFO:
            return {
                ...state,
                profileImageLoading: false,
                personalInfo: payload.personalInfo
            }
        case ADD_LIFEEVENT:
            return {
                ...state,
                addingLifeEvent: true,
                lifeEventAdded: false
            }
        case SUCCESS_LIFEEVENT:
            return {
                ...state,
                addingLifeEvent: false,
                lifeEventAdded: true,
                lifeEvents: payload
            }
        case FAIL_LIFEEVENT:
            return {
                ...state,
                addingLifeEvent: false,
                lifeEventAdded: false
            }       
        default:
            return state;
    }
}

export default person;