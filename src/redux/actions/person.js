import {
    GET,
    POST,
    PUT,
    DELETE,
    GET_PERSONAL_INFO,
    GET_EVENTS,
    GET_SPOUSES,
    GET_PARENTS,
    GET_LIFEEVENTS,
    PERSON_ERROR,
    PERSON_PAGE_LOADING,
    UPDATE_PARENTS,
    UPDATE_SPOUSES,
    UPDATE_PERSONAL_INFO,
    UPDATE_SPOUSES_AND_CHILDREN,
    UPDATE_PARENTS_AND_SIBLINGS,
    UPDATE_EVENTS,
    UPDATE_LIFE_EVENTS,
    WHOLE_REFETCHED,
    PARTIAL_REFETCHED,
    REFETCH_PERSON_INFO,
    REFETCH_PERSON_BASIC_INFO,
    PROFILE_IMAGE_LOADING,
    CLEAR_IMAGE,
    CLEAR_REFETCH_INFO,
    ADD_LIFEEVENT,
    SUCCESS_LIFEEVENT,
    FAIL_LIFEEVENT,
    ADD_PERSON_HERO_THUMBNAIL,
    SAVE_HERO_IMAGE,
    THUMBNAIL_UPLOAD_COMPLETE
} from "../constants";
import { relation } from "../../data/person";
import { apiRequest } from "../requests";
import { createUID, heroImageUploadPayload, heroImageEditPayload } from "../helpers";
import {
    getSpousesAndChildrenPayload,
    getParentsAndSiblingsPayload,
    getEventsPayload,
    getLifeEventsPayload,
    getApiType,
    getApiTypeByEventName,
    getApiTypeForLifeEvents,
    getPayloadForNewEvent,
    getNewDataPayload,
    getParsedLifeEvents
} from "../helpers/personPayloads";
import { getOptimisticDetails } from "../helpers/optimisticPersonPage";
import { trimString } from "shared-logics";

export const getPerson = (treeId, primaryPersonId) => async (dispatch) => {
    try {
        dispatch({ type: PERSON_PAGE_LOADING });

        const personalInfo = await apiRequest(GET, `persons/${primaryPersonId}/info`);
        const result = { data: { personalInfo: personalInfo.data, relation } };
        if (personalInfo.data) dispatch({ type: GET_PERSONAL_INFO, payload: result.data });

        const spousesAndChildren = apiRequest(GET, `persons/${treeId}/${primaryPersonId}/spouseswithchildren?addUnknownParents=1`);
        const parentsAndSiblings = apiRequest(GET, `persons/${treeId}/${primaryPersonId}/parentswithsiblings?addUnknownParents=1`);
        const lifeEvents = apiRequest(GET, `persons/${primaryPersonId}/alllifeevents?${treeId} `);
        const eventsInfo = await apiRequest(GET, `persons/${treeId}/${primaryPersonId}/lifeevents`);

        const [spousesAndChildren_res, parentsAndSiblings_res, lifeEvents_res, eventsInfo_res] = await Promise.all([spousesAndChildren, parentsAndSiblings, lifeEvents, eventsInfo]);

        const parsedLifeEvents = getParsedLifeEvents(lifeEvents_res);

        if (spousesAndChildren_res.data) dispatch({ type: GET_SPOUSES, payload: spousesAndChildren_res.data.Spouses });
        if (parentsAndSiblings_res.data) dispatch({ type: GET_PARENTS, payload: parentsAndSiblings_res.data });
        if (lifeEvents_res.data) dispatch({ type: GET_LIFEEVENTS, payload: parsedLifeEvents });
        if (eventsInfo_res.data) dispatch({ type: GET_EVENTS, payload: eventsInfo_res.data.Events });

    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateParents = (treeId, primaryPersonId) => async (dispatch) => {
    try {
        const parentsAndSiblings_res = await apiRequest(GET, `persons/${treeId}/${primaryPersonId}/parentswithsiblings?addUnknownParents=1`);
        const eventsInfo = await apiRequest(GET, `persons/${treeId}/${primaryPersonId}/lifeevents`);
        const res = {
            data: {
                relatedParentIds: parentsAndSiblings_res.data.RelatedParentIds,
                filialRelationshipId: parentsAndSiblings_res.data.FilialRelationshipId,
                parentsAndSiblings: parentsAndSiblings_res.data.ParentsAndSiblings,
            }
        };

        dispatch({
            type: UPDATE_PARENTS,
            payload: res.data
        })
        dispatch({
            type: UPDATE_EVENTS,
            payload: eventsInfo.data.Events
        })

    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateSpouses = (treeId, primaryPersonId) => async (dispatch) => {
    try {
        const res = await apiRequest(GET, `persons/${treeId}/${primaryPersonId}/spouseswithchildren?addUnknownParents=1`);

        dispatch({
            type: UPDATE_SPOUSES,
            payload: res.data.Spouses
        })
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updatePersonalInfo = (oldPersonalInfo, newPersonalInfo, changedKey, person) => async (dispatch) => {
    try {
        const payload = {
            id: newPersonalInfo.id,
            givenName: {
                nameAssertionId: createUID(oldPersonalInfo.givenName.nameAssertionId),
                givenName: changedKey === "givenName" ? trimString(newPersonalInfo.givenName) : oldPersonalInfo.givenName.givenName
            },
            surname: {
                nameAssertionId: createUID(oldPersonalInfo.surname.nameAssertionId),
                surname: changedKey === "surname" ? trimString(newPersonalInfo.surname) : oldPersonalInfo.surname.surname
            },
            gender: {
                assertionId: createUID(oldPersonalInfo.gender.assertionId),
                gender: changedKey === "gender" ? newPersonalInfo.gender : oldPersonalInfo.gender.gender
            }
        };

        const newData = {
            ...newPersonalInfo,
            givenName: changedKey === "givenName" ? trimString(newPersonalInfo.givenName) : oldPersonalInfo.givenName.givenName,
            surname: changedKey === "surname" ? trimString(newPersonalInfo.surname) : oldPersonalInfo.surname.surname
        }

        dispatch({ type: UPDATE_PERSONAL_INFO, payload });

        let refetched = false;

        switch (changedKey) {
            case "givenName":
                refetched = await apiRequest(PUT, `Persons/givenname`, { treeId: oldPersonalInfo.treeId, id: payload.id, nameAssertionId: payload.givenName.nameAssertionId, givenName: payload.givenName.givenName });
                break;

            case "surname":
                refetched = await apiRequest(PUT, `Persons/surname`, { treeId: oldPersonalInfo.treeId, id: payload.id, nameAssertionId: payload.surname.nameAssertionId, surname: payload.surname.surname });
                break;

            case "gender":
                refetched = await apiRequest(PUT, `Persons/gender`, { treeId: oldPersonalInfo.treeId, personId: payload.id, genderAssertionId: payload.gender.assertionId, newGender: payload.gender.gender });
                break;

            default:
                break;
        }

        if (refetched) {
            const optimisticDetails = getOptimisticDetails(newData, changedKey, person)
            dispatch({
                type: WHOLE_REFETCHED,
                payload: optimisticDetails
            })

        }
    }
    catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

const apisForPersonTables = async (apiType, payload) => {
    let refetched = false;

    switch (apiType) {
        // Family Table, Events Table
        case "name":
            refetched = true;
            await apiRequest(PUT, `Persons/givenname`, { treeId: payload.treeId, id: payload.personId, nameAssertionId: payload.AssertionId, givenName: trimString(payload.firstName) });
            await apiRequest(PUT, `Persons/surname`, { treeId: payload.treeId, id: payload.personId, nameAssertionId: payload.AssertionId, surname: trimString(payload.lastName) });
            return refetched;

        case "firstName":
            refetched = true;
            await apiRequest(PUT, `Persons/givenname`, { treeId: payload.treeId, id: payload.personId, nameAssertionId: payload.AssertionId, givenName: trimString(payload.firstName) });
            return refetched;

        case "lastName":
            refetched = true;
            await apiRequest(PUT, `Persons/surname`, { treeId: payload.treeId, id: payload.personId, nameAssertionId: payload.AssertionId, surname: trimString(payload.lastName) });
            return refetched;

        case "gender":
            refetched = true;
            await apiRequest(PUT, `Persons/gender`, { treeId: payload.treeId, personId: payload.personId, genderAssertionId: payload.AssertionId, newGender: payload.gender });
            return refetched;

        case "birthdate":
            refetched = true;
            await apiRequest(PUT, `Persons/birthdate`, { treeId: payload.treeId, personId: payload.personId, birthAssertionId: payload.AssertionId, newDate: trimString(payload.date) });
            return refetched;

        case "birthlocation":
            refetched = true;
            await apiRequest(PUT, `Persons/birthlocation`, { treeId: payload.treeId, personId: payload.personId, birthAssertionId: payload.AssertionId, newLocation: trimString(payload.location), newLocationId: payload.locationId });
            return refetched;

        case "deathdate":
            refetched = true;
            await apiRequest(PUT, `Persons/deathdate`, { treeId: payload.treeId, personId: payload.personId, deathAssertionId: payload.AssertionId, newDate: trimString(payload.date) });
            return refetched;

        case "deathlocation":
            refetched = true;
            await apiRequest(PUT, `Persons/deathlocation`, { treeId: payload.treeId, personId: payload.personId, deathAssertionId: payload.AssertionId, newLocation: trimString(payload.location), newLocationId: payload.locationId });
            return refetched;

        case "marriagedate":
            refetched = true;
            await apiRequest(PUT, `Persons/marriagedate`, { treeId: payload.treeId, personId: payload.personId, marriageAssertionId: payload.AssertionId, spousalRelationshipId: payload.SpousalRelationshipId, newDate: trimString(payload.date) });
            return refetched;

        case "marriagelocation":
            refetched = true;
            await apiRequest(PUT, `Persons/marriagelocation`, { treeId: payload.treeId, personId: payload.personId, marriageAssertionId: payload.AssertionId, spousalRelationshipId: payload.SpousalRelationshipId, newLocation: trimString(payload.location), newLocationId: payload.locationId });
            return refetched;

        case "divorcedate":
            refetched = true;
            await apiRequest(PUT, `Persons/divorcedate`, { treeId: payload.treeId, personId: payload.personId, divorceAssertionId: payload.AssertionId, spousalRelationshipId: payload.SpousalRelationshipId, newDate: trimString(payload.date) });
            return refetched;

        case "divorcelocation":
            refetched = true;
            await apiRequest(PUT, `Persons/divorcelocation`, { treeId: payload.treeId, personId: payload.personId, divorceAssertionId: payload.AssertionId, spousalRelationshipId: payload.SpousalRelationshipId, newLocation: trimString(payload.location), newLocationId: payload.locationId });
            return refetched;

        case "spousallocation":
            refetched = true;
            await apiRequest(PUT, `Persons/spousallocation`, { treeId: payload.treeId, personId: payload.personId, assertionId: payload.AssertionId, spousalRelationshipId: payload.SpousalRelationshipId, newLocation: trimString(payload.location), assertionType: payload.eventType, newLocationId: payload.locationId });
            return refetched;

        case "spousaldate":
            refetched = true;
            await apiRequest(PUT, `Persons/spousaldate`, { treeId: payload.treeId, personId: payload.personId, assertionId: payload.AssertionId, spousalRelationshipId: payload.SpousalRelationshipId, newDate: trimString(payload.date), assertionType: payload.eventType });
            return refetched;

        // All Life Events Table
        case "date":
            refetched = true;
            await apiRequest(PUT, `Persons/date`, { treeId: payload.treeId, personId: payload.personId, dateAssertionId: payload.AssertionId, newDate: trimString(payload.date), eventType: payload.eventType });
            return refetched;

        case "location":
            refetched = true;
            await apiRequest(PUT, `Persons/location`, { treeId: payload.treeId, personId: payload.personId, locationAssertionId: payload.AssertionId, newLocation: trimString(payload.location), eventType: payload.eventType, newLocationId: payload.locationId });
            return refetched;

        default:
            return refetched;
    }
}

export const updateSpousesAndChildren = (oldData, newData, changedKey, treeId, person) => async (dispatch) => {
    try {
        const { localPayload, payload } = getSpousesAndChildrenPayload(oldData, newData, changedKey, treeId);

        dispatch({ type: UPDATE_SPOUSES_AND_CHILDREN, payload: localPayload });

        const apiType = getApiType(changedKey);

        const refetched = await apisForPersonTables(apiType, payload);

        if (refetched) {
            const optimisticDetails = getOptimisticDetails(newData, changedKey, person, payload.AssertionId);
            if (optimisticDetails) dispatch({ type: WHOLE_REFETCHED, payload: optimisticDetails });
        }
    }
    catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateParentsAndSiblings = (oldData, newData, changedKey, treeId, person) => async (dispatch) => {
    try {
        const { localPayload, payload } = getParentsAndSiblingsPayload(oldData, newData, changedKey, treeId);

        dispatch({ type: UPDATE_PARENTS_AND_SIBLINGS, payload: localPayload });

        const apiType = getApiType(changedKey);

        const refetched = await apisForPersonTables(apiType, payload);

        if (refetched) {
            const optimisticDetails = getOptimisticDetails(newData, changedKey, person, payload.AssertionId);
            if (optimisticDetails) dispatch({ type: WHOLE_REFETCHED, payload: optimisticDetails });
        }
    }
    catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateEvents = (oldData, newData, changedKey, treeId, person) => async (dispatch) => {
    try {
        const { localPayload, payload } = getEventsPayload(oldData, newData, changedKey, treeId);

        dispatch({ type: UPDATE_EVENTS, payload: localPayload });

        const apiType = getApiTypeByEventName(newData.name, changedKey);

        const refetched = await apisForPersonTables(apiType, payload);

        if (refetched) {
            const optimisticDetails = getOptimisticDetails(newData, changedKey, person, payload.AssertionId);
            if (optimisticDetails) dispatch({ type: WHOLE_REFETCHED, payload: optimisticDetails });
        }
    }
    catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const updateLifeEvents = (oldData, newData, changedKey, treeId, person) => async (dispatch) => {
    try {
        const { localPayload, payload } = getLifeEventsPayload(oldData, newData, changedKey, treeId);
        dispatch({ type: UPDATE_LIFE_EVENTS, payload: localPayload });

        const apiType = getApiTypeForLifeEvents(newData.type, changedKey);

        const refetched = await apisForPersonTables(apiType, payload);

        if (refetched) {
            const optimisticDetails = getOptimisticDetails(newData, changedKey, person, payload.AssertionId);
            if (optimisticDetails) dispatch({ type: WHOLE_REFETCHED, payload: optimisticDetails });
        }
    }
    catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const wholeRefetch = (treeId, primaryPersonId) => async (dispatch) => {
    try {
        dispatch({
            type: WHOLE_REFETCHED,
            payload: {
                treeId,
                primaryPersonId
            }
        })
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const partialRefetch = (treeId, primaryPersonId) => async (dispatch) => {
    try {
        const eventsInfo = apiRequest(GET, `persons/${treeId}/${primaryPersonId}/lifeevents`);
        const spousesAndChildren = apiRequest(GET, `persons/${treeId}/${primaryPersonId}/spouseswithchildren?addUnknownParents=1`);
        const parentsAndSiblings = apiRequest(GET, `persons/${treeId}/${primaryPersonId}/parentswithsiblings?addUnknownParents=1`);
        const lifeEvents = apiRequest(GET, `persons/${primaryPersonId}/alllifeevents?${treeId}`);
        const [eventsInfo_res, spousesAndChildren_res, parentsAndSiblings_res, lifeEvents_res] = await Promise.all([eventsInfo, spousesAndChildren, parentsAndSiblings, lifeEvents]);
        const res = {
            data: {
                events: eventsInfo_res.data.Events,
                spousesAndChildren: spousesAndChildren_res.data.Spouses,
                relatedParentIds: parentsAndSiblings_res.data.RelatedParentIds,
                filialRelationshipId: parentsAndSiblings_res.data.FilialRelationshipId,
                parentsAndSiblings: parentsAndSiblings_res.data.ParentsAndSiblings,
                lifeEvents: lifeEvents_res.data
            }
        };

        dispatch({
            type: PARTIAL_REFETCHED,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const refetchPersonInfo = (treeId, primaryPersonId) => async (dispatch) => {
    try {
        dispatch({ type: PROFILE_IMAGE_LOADING });
        const personalInfo = apiRequest(GET, `persons/${primaryPersonId}/info`);
        const parentsAndSiblings = apiRequest(GET, `persons/${treeId}/${primaryPersonId}/parentswithsiblings?addUnknownParents=1`);
        const [personalInfo_res, parentsAndSiblings_res] = await Promise.all([personalInfo, parentsAndSiblings]);

        const res = {
            data: {
                personalInfo: personalInfo_res.data,
                parentsAndSiblings: parentsAndSiblings_res.data.ParentsAndSiblings,
            }
        };
        dispatch({
            type: REFETCH_PERSON_INFO,
            payload: res.data
        })
        dispatch({ type: CLEAR_IMAGE })
        dispatch({ type: CLEAR_REFETCH_INFO })
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const refetchPersonBasicInfo = (primaryPersonId, refetchCheck) => async (dispatch) => {
    try {
        if (!refetchCheck) dispatch({ type: PROFILE_IMAGE_LOADING });
        const personalInfo = apiRequest(GET, `persons/${primaryPersonId}/info`);
        const [personalInfo_res] = await Promise.all([personalInfo]);

        const res = {
            data: {
                personalInfo: personalInfo_res.data,
            }
        };
        dispatch({
            type: REFETCH_PERSON_BASIC_INFO,
            payload: res.data
        })
        dispatch({ type: CLEAR_IMAGE })
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const addLifeEvent = (treeId, treePersonId, data, oldData, person) => async (dispatch) => {
    try {
        const payload = getPayloadForNewEvent(treeId, treePersonId, data);
        const newDataPayload = getNewDataPayload(payload, treeId)
        dispatch({ type: ADD_LIFEEVENT });

        await apiRequest(POST, `Persons/lifeevent`, payload);

        const lifeEvents = await apiRequest(GET, `persons/${treePersonId}/alllifeevents?${treeId}`);

        const parsedLifeEvents = lifeEvents.data.reduce((res, ele) => {
            const existed = oldData.find((e) => e.Id === ele.Id);
            if (ele.Type === 'Birth') res.push({ ...ele, newRow: false });
            else if (existed) res.push({ ...ele, newRow: false });
            else res.push({ ...ele, newRow: true })
            return res;
        }, [])

        setTimeout(() => {
            dispatch({ type: SUCCESS_LIFEEVENT, payload: parsedLifeEvents })
        }, 1000);

        const parsedLifeEventsAgain = getParsedLifeEvents(lifeEvents);

        if (payload.assertionType.includes("Birth") || payload.assertionType.includes("Death") || payload.assertionType.includes("Marriage") || payload.assertionType.includes("Divorce")) {
            const eventsInfo = await apiRequest(GET, `persons/${treeId}/${treePersonId}/lifeevents`);
            dispatch({ type: GET_EVENTS, payload: eventsInfo.data.Events });
            const personalInfo = await apiRequest(GET, `persons/${treePersonId}/info`);
            const result = { data: { personalInfo: personalInfo.data, relation } };
            if (personalInfo.data) dispatch({ type: GET_PERSONAL_INFO, payload: result.data });
            let personData = {
                ...person,
                personalInfo: result.data.personalInfo,
                events: eventsInfo.data.Events,
                lifeEvents: parsedLifeEvents
            }
            if (lifeEvents && person.parentsAndSiblings !== []) {
                const optimisticDetails = getOptimisticDetails(newDataPayload, 'addLifeEvent', personData);
                if (optimisticDetails) dispatch({ type: WHOLE_REFETCHED, payload: optimisticDetails });
            }
        }

        setTimeout(() => {
            dispatch({ type: SUCCESS_LIFEEVENT, payload: parsedLifeEventsAgain })
        }, 6000);
    } catch (err) {
        dispatch({ type: FAIL_LIFEEVENT })
    }
}


export const addHeroImage = (imagePayload) => async (dispatch) => {
    try {
        dispatch({
            type: ADD_PERSON_HERO_THUMBNAIL,
            payload: imagePayload
        })

        dispatch({
            type: THUMBNAIL_UPLOAD_COMPLETE
        })
        const payload = heroImageUploadPayload(imagePayload);
        await apiRequest(POST, `Media/uploadbackgroundimage`, payload);

        dispatch({ type: SAVE_HERO_IMAGE });
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const editHeroImage = (imagePayload) => async (dispatch) => {
    try {
        dispatch({
            type: ADD_PERSON_HERO_THUMBNAIL,
            payload: imagePayload
        })

        dispatch({
            type: THUMBNAIL_UPLOAD_COMPLETE
        })
        const payload = heroImageEditPayload(imagePayload);
        await apiRequest(POST, `Media/editbackgroundimage`, payload);

        dispatch({ type: SAVE_HERO_IMAGE });
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}

export const deleteHeroImage = (treePersonId) => async (dispatch) => {
    try {
        await apiRequest(DELETE, `Persons/deletebackgroundimage/${treePersonId}`);
        dispatch({ type: SAVE_HERO_IMAGE });
    } catch (err) {
        dispatch({
            type: PERSON_ERROR,
            payload: { msg: err }
        })
    }
}