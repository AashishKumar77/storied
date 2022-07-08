import { 
    FAMILY_LOADING, 
    GET_FAMILY,
    CLEAR_FAMILY,
    PERSON_LOADING,
    SAVE_PARENTS,
    ADD_PARENT,
    ADD_SIBLING,
    SAVE_PARENT,
    ADD_SPOUSE,
    SAVE_SPOUSE,
    SAVE_ERROR,
    ADD_FAMILY,
    CANCEL_MODAL,
    GET_EDIT_PERSON,
    ADD_TREE, 
    UPDATE_FAMILY, 
    FAMILY_ERROR,
    RENDER_STEPPER,
    RENDER_TREE,
    TREE_ERROR, 
    SELECT_USER, 
    IMPORT_GEDCOM, 
    PROGRESS_BAR,
    GEDCOM_ERROR,
    GET_IMPORT_STATUS,
    IMPORT_STATUS_ERROR,
    ASSIGN_HOMEPERSON,
    ASSIGN_ERROR,
    SELECT_HOMEPERSON,
    SELECT_HOMEPERSON_ERROR,
    AUTOCOMPLETE_TEST,
    AUTOCOMPLETE_ERROR,
    AUTOCOMPLETE_REQUEST,
    AUTOCOMPLETE_PAGINATION_ERROR,
    AUTOCOMPLETE_PAGINATION_TEST,
    AUTOCOMPLETE_PAGINATION_REQUEST,
    GET_TREES,
    TREES_LOADING,
    SAVE_SIBLING,
    ADD_CHILD,
    SAVE_CHILD,
    SAVE_PROFILE_IMAGE,
    IMAGE_LOADING,
    CLEAR_IMAGE,
    SET_MODAL_DATA,
    GET_PROFILE_IMAGE,
    FETCHING_IMAGE,
    SHOW_IMAGE,
    AUTOCOMPLETE_BIRTH_TEST,
    AUTOCOMPLETE_DEATH_TEST,
    AUTOCOMPLETE_BIRTH_PAGINATION_TEST,
    CLEAR_BIRTH_OPTIONS,
    CLEAR_DEATH_OPTIONS,
    TREE_PERSON_SEARCH_OPTIONS,
    ADD_PARENT_VIA_PLACEHOLDER,
    SAVE_PARENT_VIA_PLACEHOLDER,
    REFETCH_PAGE_AFTER_UPLOAD,
    IMAGE_UNLOADING,
    SET_NEW_FAMILY_PAYLOAD,
    GET_EDITED_FAMILY,
    SAVE_HERO_IMAGE,
    GET_HERO_IMAGE,
    THUMBNAIL_UPLOAD_COMPLETE
 } from "../constants";

const initialState = {
    loading: true,
    error: null,
    stepper: true,
    family: null,
    oldFamily: null,
    startTree: null,
    options: [],
    birthPlaceOptions: [],
    deathPlaceOptions: [],
    optionLoading: false,
    homePersons: [],
    treePersonOptions:[],
    newTreeId: null,
    trees: [],
    treesloading: true,
    selectedHomePerson: null,
    progress: 0,
    importStatus: null,
    assigned: null,
    personLoading: false,
    editPerson: null,
    newPerson: null,
    parentAdded: false,
    spouseAdded: false,
    updatedPerson: false,
    siblingAdded: false,
    childAdded: false,
    parentAddedViaPlaceholder:false,
    profileImageAdded: false,
    heroImageAdded: false,
    imageLoading: false,
    imageFetching: false,
    parentsAdded: false,
    dropDownPayload: null,
    hasNextPage: true, 
    isNextPageLoading: false,
    originalImage: null,
    showImageCropper: false,
    closeModalStatus: false,
    originalHeroImage: null,
    refetchTree: false
}

const family = (state = initialState, action = {}) => {
    const { type, payload } = action;
    const mapping = {
        [RENDER_STEPPER]: {
            ...state,
            stepper: true
        },
        [RENDER_TREE]: {
            ...state,
            stepper: false
        },
        [FAMILY_LOADING]: {
            ...state,
            loading: true
        },
        [PERSON_LOADING]: {
            ...state,
            personLoading: true
        },
        [IMAGE_LOADING]: {
            ...state,
            imageLoading: true
        },
        [IMAGE_UNLOADING] : {
            ...state,
            imageLoading: false,
            showImageCropper: false
        },
        [FETCHING_IMAGE]: {
            ...state,
            imageFetching: true,
            showImageCropper: true
        },
        [GET_EDIT_PERSON]: {
            ...state,
            personLoading: false,
            editPerson: payload,
            newPerson: null
        },
        [SET_NEW_FAMILY_PAYLOAD]: {
            ...state,
            family: payload,
            showImageCropper: false,
        },
        [GET_EDITED_FAMILY]: {
            ...state,
            updatedPerson: true,
            checkRefetchFamily: true
        },
        [SET_MODAL_DATA]: {
            ...state,
            parentAdded: false,
            parentAddedViaPlaceholder:false,
            personLoading: false,
            editPerson: null,
            newPerson: payload
        },
        [ADD_PARENT]: {
            ...state,
            dropDownPayload: payload
        },
        [ADD_SPOUSE]: {
            ...state,
            spouseAdded: false,
            personLoading: false,
            editPerson: null,
            dropDownPayload: payload
        },
        [ADD_SIBLING]: {
            ...state,
            dropDownPayload: payload
        },
        [ADD_CHILD]:{
            ...state,
            childAdded: false,
            personLoading: false,
            editPerson: null,
            dropDownPayload: payload
        },
        [SAVE_PARENT]: {
            ...state,
            parentAdded: true,
            newPerson: null,
            family: payload ? null : state.family,
            dropDownPayload: null,
            checkRefetchFamily : payload,
            closeModalStatus: true
        },
        [SAVE_SPOUSE]: {
            ...state,
            spouseAdded: true,
            newPerson: null,
            family: payload ? null : state.family,
            dropDownPayload: null,
            checkRefetchFamily : payload,
            closeModalStatus: true
        },
        [SAVE_SIBLING]: {
            ...state,
            siblingAdded: true,
            newPerson: null,
            family: payload ? null : state.family,
            dropDownPayload: null,
            checkRefetchFamily: payload,
            closeModalStatus: true
        },
        [SAVE_CHILD]: {
            ...state,
            childAdded: true,
            newPerson: null,
            family: payload ? null : state.family,
            dropDownPayload: null,
            checkRefetchFamily: payload,
            closeModalStatus: true
        },
        [SAVE_ERROR]: {
            ...state,
            error: payload,
            loading: false,
            closeModalStatus: true,
            refetchTree: true
        },
        [ADD_FAMILY]: {
            ...state,
            personLoading: false,
            editPerson: null,
            newPerson: payload
        },
        [CANCEL_MODAL]: {
            ...state,
            personLoading: false,
            editPerson: null,
            newPerson: null,
            updatedPerson: false,
            parentAdded: false,
            parentAddedViaPlaceholder:false,
            spouseAdded: false,
            siblingAdded: false,
            childAdded: false,
            profileImageAdded: false,
            dropDownPayload: null,
            birthPlaceOptions: [],
            deathPlaceOptions: [],
            closeModalStatus: false
        },
        [GET_FAMILY]: {
            ...state,
            stepper: false,
            family: payload,
            oldFamily: payload,
            editPerson: null,
            newPerson: null,
            loading: false,
            updatedPerson: false,
            parentAdded: false,
            parentAddedViaPlaceholder: false,
            spouseAdded: false,
            siblingAdded: false,
            childAdded: false,
            imageLoading: false,
            profileImageAdded: false,
            error: null,
            parentsAdded: false,
            checkRefetchFamily: false,
            closeModalStatus: false,
            refetchTree: false
        },
        [UPDATE_FAMILY]: {
            ...state,
            stepper: false,
            family: payload,
            editPerson: null,
            newPerson: null,
            loading: false,
            updatedPerson: false,
            parentAdded: false,
            spouseAdded: false,
            siblingAdded: false,
            childAdded: false,
            imageLoading: false,
            profileImageAdded: false,
            error: null,
            parentsAdded: false,
            refetchTree: false
        },
        [CLEAR_FAMILY]: {
            ...state,
            treePersonOptions: [],
            loading: false,
            family: null,
            startTree: null,
            stepper: true,
            error: null,
        },
        [FAMILY_ERROR]: {
            ...state,
            error: payload,
            loading: false,
            family: state.oldFamily,
            closeModalStatus: false
        },
        [SAVE_PARENTS]: {
            ...state,
            parentsAdded: true,
        },
        [ADD_PARENT_VIA_PLACEHOLDER]: {
            ...state,
            parentAddedViaPlaceholder: false,
            personLoading: false
        },
        [SAVE_PARENT_VIA_PLACEHOLDER]: {
            ...state,
            parentAddedViaPlaceholder: true,
            newPerson: null
        },
        [ADD_TREE]: {
            ...state,
            loading: false,
            startTree: payload,
            homePersons: [],
            newTreeId: null,
            selectedHomePerson: null,
            progress: 0,
            importStatus: null,
            assigned: null,
        },
        [GET_TREES]: {
            ...state,
            trees: payload,
            treesloading: false
        } ,
        [TREES_LOADING]: {
            ...state,
            treesloading: true
        },
        [TREE_ERROR]: {
            ...state,
            loading: false,
            startTree: null,
            homePersons: [],
            newTreeId: null,
            selectedHomePerson: null,
            progress: 0,
            importStatus: null,
            assigned: null,
        },
        [SELECT_USER]: {
            ...state,
            loading: false,
            startTree: null,
            homePersons: [],
            newTreeId: null,
            selectedHomePerson: null,
            progress: 0,
            importStatus: null,
            assigned: null,
        },
        [IMPORT_GEDCOM]: {
            ...state,
            homePersons: payload && payload.persons,
            newTreeId: payload && payload.treeId,
            selectedHomePerson: null
        },
        [PROGRESS_BAR]: {
            ...state,
            progress: payload
        },
        [GEDCOM_ERROR]: {
            ...state,
            homePersons: [],
            newTreeId: null,
            selectedHomePerson: null,
            progress: 0,
            importStatus: null,
            assigned: null,
        },
        [GET_IMPORT_STATUS]: {
            ...state,
            importStatus: payload
        },
        [IMPORT_STATUS_ERROR]: {
            ...state,
            importStatus: null
        },
        [ASSIGN_HOMEPERSON]: {
            ...state,
            assigned: true
        },
        [ASSIGN_ERROR]: {
            ...state,
            assigned: null
        },
        [SELECT_HOMEPERSON]: {
            ...state,
            selectedHomePerson: payload
        },
        [SELECT_HOMEPERSON_ERROR]: {
            ...state,
            selectedHomePerson: null
        },
        [AUTOCOMPLETE_REQUEST]: {
            ...state,
            options: [],
            optionLoading: true
        },
        [AUTOCOMPLETE_TEST]: {
            ...state,
            options: payload,
            optionLoading: false,
            hasNextPage: true
        },
        [AUTOCOMPLETE_BIRTH_TEST]: {
            ...state,
            birthPlaceOptions: payload,
            optionLoading: false,
            hasNextPage: true
        },
        [CLEAR_BIRTH_OPTIONS]: {
            ...state,
            birthPlaceOptions: []
        },
        [CLEAR_DEATH_OPTIONS]: {
            ...state,
            deathPlaceOptions: []
        },
        [AUTOCOMPLETE_DEATH_TEST]: {
            ...state,
            deathPlaceOptions: payload,
            optionLoading: false,
            hasNextPage: true
        },
        [AUTOCOMPLETE_ERROR]: {
            ...state,
            options: [],
            optionLoading: false
        },
        [AUTOCOMPLETE_PAGINATION_REQUEST]: {
            ...state,
            isNextPageLoading: true
        },
        [AUTOCOMPLETE_PAGINATION_TEST]: {
            ...state,
            options :state.options.concat(payload),
            isNextPageLoading: false
        },
        [AUTOCOMPLETE_BIRTH_PAGINATION_TEST]: {
            ...state,
            birthPlaceOptions :state.birthPlaceOptions.concat(payload),
            isNextPageLoading: false
        },
        [AUTOCOMPLETE_PAGINATION_ERROR]: {
            ...state,
            isNextPageLoading: false
        },
        [SAVE_PROFILE_IMAGE]: {
            ...state,
            imageLoading: false,
            profileImageAdded: true,
            showImageCropper: false,
            originalImage: null
        },
        [SAVE_HERO_IMAGE]: {
            ...state,
            imageLoading: false,
            showImageCropper: false,
            heroImageAdded: true,
            originalHeroImage: null
        },
        [THUMBNAIL_UPLOAD_COMPLETE]: {
            ...state,
            imageLoading: false,
            showImageCropper: false
        },
        [CLEAR_IMAGE]: {
            ...state,
            imageLoading: false,
            profileImageAdded: false,
            showImageCropper: false,
            originalImage: null,
            heroImageAdded: false,
            originalHeroImage: null
        },
        [GET_PROFILE_IMAGE]: {
            ...state,
            originalImage: payload,
            profileImageAdded: false,
            imageFetching: false
        },
        [GET_HERO_IMAGE]: {
            ...state,
            originalHeroImage: payload,
            profileImageAdded: false,
            imageFetching: false
        },

        [SHOW_IMAGE]: {
            ...state,
            imageLoading: false,
            profileImageAdded: false,
            showImageCropper: true,
        },
        [TREE_PERSON_SEARCH_OPTIONS]:{
            ...state,
            treePersonOptions: payload,
            checkRefetchFamily: false
        },
        [REFETCH_PAGE_AFTER_UPLOAD]: {
            ...state,
            profileImageAdded: true
        }

    };
    return mapping[type] || state;
}

export default family;