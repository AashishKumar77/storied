import { createUID } from "./index";

const dateKeys = ["birth", "death", "marriage"];
const placeKeys = ["birthLocation", "deathLocation"];
const genderKeys = ["gender"];
const nameKeys = ["name", "firstName", "lastName"];
const spousalEvents = ["Marriage", "Divorce", "Engagement", "Annulment", "Divorce Filed", "Marriage Settlement", "Marriage Bann", "Marriage Contract", "Marriage License", "Separation"];

// Get Payloads
export const getSpousesAndChildrenPayload = (oldData, newData, changedKey, treeId) => {
    let AssertionId, SpousalRelationshipId, date, location, gender, firstName, lastName;
    for (let mainSpouseLoop of oldData) {
        let mainSpouse = mainSpouseLoop;
        if (mainSpouse.id === newData.id) {
            switch (true) {
                case nameKeys.includes(changedKey):
                    AssertionId = mainSpouse.firstName.NameAssertionId;
                    firstName = newData.nameDetails.firstName;
                    lastName = newData.nameDetails.lastName;
                    mainSpouse.name = `${firstName} ${lastName}`;
                    mainSpouse.firstName = {
                        ...mainSpouse.firstName,
                        GivenName: firstName
                    };
                    mainSpouse.lastName = {
                        ...mainSpouse.lastName,
                        Surname: lastName
                    };
                    break;

                case dateKeys.includes(changedKey):
                    AssertionId = mainSpouse[changedKey].AssertionId;
                    date = newData[changedKey];
                    if (changedKey === "marriage") SpousalRelationshipId = mainSpouse[changedKey].SpousalRelationshipId;
                    mainSpouse[changedKey] = {
                        ...mainSpouse[changedKey],
                        Date: newData[changedKey]
                    }
                    break;

                case placeKeys.includes(changedKey):
                    AssertionId = mainSpouse[changedKey].AssertionId;
                    location = newData[changedKey];
                    mainSpouse[changedKey] = {
                        ...mainSpouse[changedKey],
                        Location: newData[changedKey]
                    }
                    break;

                case genderKeys.includes(changedKey):
                    AssertionId = mainSpouse[changedKey].AssertionId;
                    gender = newData[changedKey];
                    mainSpouse[changedKey] = {
                        ...mainSpouse[changedKey],
                        Gender: newData[changedKey]
                    }
                    break;

                default:
                    break;
            }
        }
        for (let mainSpouseChildrenLoop of mainSpouse.children) {
            let mainSpouseChildren = mainSpouseChildrenLoop;
            if (mainSpouseChildren.id === newData.id) {
                switch (true) {
                    case nameKeys.includes(changedKey):
                        AssertionId = mainSpouseChildren.firstName.NameAssertionId;
                        firstName = newData.nameDetails.firstName;
                        lastName = newData.nameDetails.lastName;
                        mainSpouseChildren.name = `${firstName} ${lastName}`;
                        mainSpouseChildren.firstName = {
                            ...mainSpouseChildren.firstName,
                            GivenName: firstName
                        };
                        mainSpouseChildren.lastName = {
                            ...mainSpouseChildren.lastName,
                            Surname: lastName
                        };
                        break;
                    case dateKeys.includes(changedKey):
                        AssertionId = mainSpouseChildren[changedKey].AssertionId;
                        date = newData[changedKey];
                        if (changedKey === "marriage") SpousalRelationshipId = mainSpouseChildren[changedKey].SpousalRelationshipId;
                        mainSpouseChildren[changedKey] = {
                            ...mainSpouseChildren[changedKey],
                            Date: newData[changedKey]
                        }
                        break;

                    case placeKeys.includes(changedKey):
                        AssertionId = mainSpouseChildren[changedKey].AssertionId;
                        location = newData[changedKey];
                        mainSpouseChildren[changedKey] = {
                            ...mainSpouseChildren[changedKey],
                            Location: newData[changedKey]
                        }
                        break;

                    case genderKeys.includes(changedKey):
                        AssertionId = mainSpouseChildren[changedKey].AssertionId;
                        gender = newData[changedKey];
                        mainSpouseChildren[changedKey] = {
                            ...mainSpouseChildren[changedKey],
                            Gender: newData[changedKey]
                        }
                        break;

                    default:
                        break;
                }
            }
        }
    }
    return {
        localPayload: oldData,
        payload: {
            treeId,
            personId: newData.id,
            AssertionId: createUID(AssertionId),
            SpousalRelationshipId: createUID(SpousalRelationshipId),
            date,
            location,
            gender,
            firstName,
            lastName,
            locationId: newData.locationId
        }
    }
}

export const getParentsAndSiblingsPayload = (oldData, newData, changedKey, treeId) => {
    let AssertionId, SpousalRelationshipId, date, location, gender, firstName, lastName;
    for (let dataLoop of oldData) {
        let data = dataLoop;
        for (let parentLoop of data.Parents) {
            let parentData = parentLoop;
            if (parentData.id === newData.id) {
                switch (true) {
                    case nameKeys.includes(changedKey):
                        AssertionId = parentData.firstName.NameAssertionId;
                        firstName = newData.nameDetails.firstName;
                        lastName = newData.nameDetails.lastName;
                        parentData.name = `${firstName} ${lastName}`;
                        parentData.firstName = {
                            ...parentData.firstName,
                            GivenName: firstName
                        };
                        parentData.lastName = {
                            ...parentData.lastName,
                            Surname: lastName
                        };
                        break;

                    case dateKeys.includes(changedKey):
                        AssertionId = parentData[changedKey].AssertionId;
                        date = newData[changedKey];
                        if (changedKey === "marriage") SpousalRelationshipId = parentData[changedKey].SpousalRelationshipId;
                        parentData[changedKey] = {
                            ...parentData[changedKey],
                            Date: newData[changedKey]
                        }
                        break;

                    case placeKeys.includes(changedKey):
                        AssertionId = parentData[changedKey].AssertionId;
                        location = newData[changedKey];
                        parentData[changedKey] = {
                            ...parentData[changedKey],
                            Location: newData[changedKey]
                        }
                        break;

                    case genderKeys.includes(changedKey):
                        AssertionId = parentData[changedKey].AssertionId;
                        gender = newData[changedKey];
                        parentData[changedKey] = {
                            ...parentData[changedKey],
                            Gender: newData[changedKey]
                        }
                        break;

                    default:
                        break;
                }
            }
        }
        for (let childrenLoop of data.children) {
            let childrenData = childrenLoop;
            if (childrenData.id === newData.id) {
                switch (true) {
                    case nameKeys.includes(changedKey):
                        AssertionId = childrenData.firstName.NameAssertionId;
                        firstName = newData.nameDetails.firstName;
                        lastName = newData.nameDetails.lastName;
                        childrenData.name = `${firstName} ${lastName}`;
                        childrenData.firstName = {
                            ...childrenData.firstName,
                            GivenName: firstName
                        };
                        childrenData.lastName = {
                            ...childrenData.lastName,
                            Surname: lastName
                        };
                        break;

                    case dateKeys.includes(changedKey):
                        AssertionId = childrenData[changedKey].AssertionId;
                        date = newData[changedKey];
                        if (changedKey === "marriage") SpousalRelationshipId = childrenData[changedKey].SpousalRelationshipId;
                        childrenData[changedKey] = {
                            ...childrenData[changedKey],
                            Date: newData[changedKey]
                        }
                        break;

                    case placeKeys.includes(changedKey):
                        AssertionId = childrenData[changedKey].AssertionId;
                        location = newData[changedKey];
                        childrenData[changedKey] = {
                            ...childrenData[changedKey],
                            Location: newData[changedKey]
                        }
                        break;

                    case genderKeys.includes(changedKey):
                        AssertionId = childrenData[changedKey].AssertionId;
                        gender = newData[changedKey];
                        childrenData[changedKey] = {
                            ...childrenData[changedKey],
                            Gender: newData[changedKey]
                        }
                        break;

                    default:
                        break;
                }
            }
        }
    }
    return {
        localPayload: oldData,
        payload: {
            treeId,
            personId: newData.id,
            AssertionId: createUID(AssertionId),
            SpousalRelationshipId: createUID(SpousalRelationshipId),
            date,
            location,
            gender,
            firstName,
            lastName,
            locationId: newData.locationId
        }
    }
}

export const getEventsPayload = (oldData, newData, changedKey, treeId) => {
    let AssertionId, SpousalRelationshipId, PersonId;
    const updatedLocalPayload = oldData && oldData.reduce((res, ele) => {
        if (ele.id === newData.id) {
            switch (changedKey) {
                case "date":
                    AssertionId = ele[changedKey].AssertionId;
                    SpousalRelationshipId = ele[changedKey].RelationId;
                    PersonId = ele[changedKey].PersonId;
                    res.push({
                        ...ele,
                        [changedKey]: {
                            ...ele[changedKey],
                            Date: {
                                RawDate: newData.date,
                            }
                        }
                    })
                    break;

                case "location":
                    AssertionId = ele[changedKey].AssertionId;
                    SpousalRelationshipId = ele[changedKey].RelationId;
                    PersonId = ele[changedKey].PersonId;
                    res.push({
                        ...ele,
                        [changedKey]: {
                            ...ele[changedKey],
                            Location: newData.location
                        }
                    })
                    break;

                default:
                    break;
            }
        } else {
            res.push(ele)
        }
        return res;
    }, [])
    return {
        localPayload: updatedLocalPayload,
        payload: {
            treeId,
            personId: PersonId,
            AssertionId: createUID(AssertionId),
            SpousalRelationshipId: createUID(SpousalRelationshipId),
            [changedKey]: newData[changedKey],
            eventType: newData.name.replace(/\s/g, ''),
            locationId: newData.locationId
        }
    }
}

export const getLifeEventsPayload = (oldData, newData, changedKey, treeId) => {
    let AssertionId, PersonId, eventType, SpousalRelationshipId;
    const updatedLocalPayload = oldData && oldData.reduce((res, ele) => {
        if (ele.id === newData.id) {
            eventType = ele.type;
            switch (changedKey) {
                case "date":
                    AssertionId = ele.date.AssertionId;
                    SpousalRelationshipId = ele.date.RelationId;
                    PersonId = ele.date.PersonId;
                    res.push({
                        ...ele,
                        date: {
                            ...ele.date,
                            Date: {
                                ...ele.date.Date,
                                RawDate: newData.date,
                            }
                        }
                    })
                    break;

                case "location":
                    AssertionId = ele.location.AssertionId;
                    SpousalRelationshipId = ele.location.RelationId;
                    PersonId = ele.location.PersonId;
                    res.push({
                        ...ele,
                        location: {
                            ...ele.Location,
                            Location: newData.location
                        }
                    })
                    break;

                default:
                    break;
            }
        } else {
            res.push(ele)
        }
        return res;
    }, [])
    return {
        localPayload: updatedLocalPayload,
        payload: {
            treeId,
            personId: PersonId,
            AssertionId: createUID(AssertionId),
            eventType: eventType.replace(/\s/g, ''),
            [changedKey]: newData[changedKey],
            SpousalRelationshipId: createUID(SpousalRelationshipId),
            locationId: newData.locationId
        }
    }
}

export const getPayloadForNewEvent = (treeId, treePersonId, data) => {
    const locationId = data.filter((i) => i.id === 'location')[0].locationId
    const result = data && data.reduce((res, ele) => {
        res[ele.name] = ele.value
        return res;
    }, {});
    return {
        treeId,
        personId: treePersonId,
        assertionType: result.type.replace(" ", ""),
        dateLocation: {
            date: result.date,
            location: result.location,
            description: result.description,
            locationId: locationId || "",
            latitude: "",
            longitude: "",
            note: "",
        }
    }
}

export const getNewDataPayload = (payload, treePersonId) => {
    return {
        age: "",
        date: payload.dateLocation.date,
        description: payload.dateLocation.description,
        id: treePersonId,
        location: payload.dateLocation.location,
        locationId: payload.dateLocation.locationId,
        newRow: false,
        tableType: "LIFE_EVENTS",
        type: payload.assertionType
    }
}

export const getParsedLifeEvents = (lifeEvents_res) => {
    return lifeEvents_res.data.map(e => {
        return {
            ...e,
            newRow: false
        }
    });
}

// Get Apis
export const getApiType = (changedKey) => {
    switch (changedKey) {
        case "birth":
            return "birthdate";

        case "birthLocation":
            return "birthlocation";

        case "death":
            return "deathdate";

        case "deathLocation":
            return "deathlocation";

        case "marriage":
            return "marriagedate";

        default:
            return changedKey;
    }
}

export const getApiTypeByEventName = (eventName, changedKey) => {
    switch (true) {
        case (eventName === "Birth" && changedKey === "location"):
            return "birthlocation";

        case (eventName === "Death" && changedKey === "date"):
            return "deathdate";

        case (eventName === "Death" && changedKey === "location"):
            return "deathlocation";

        case (eventName === "Divorce" && changedKey === "date"):
        case (eventName === "Marriage" && changedKey === "date"):
            return "spousaldate";

        case (eventName === "Divorce" && changedKey === "location"):
        case (eventName === "Marriage" && changedKey === "location"):
            return "spousallocation";

        case (eventName === "Birth" && changedKey === "date"):
        default:
            return "birthdate";
    }
}

export const getApiTypeForLifeEvents = (eventName, changedKey) => {
    switch (true) {
        case ((spousalEvents.includes(eventName)) && changedKey === "date"):
            return "spousaldate";

        case ((spousalEvents.includes(eventName)) && changedKey === "location"):
            return "spousallocation";

        default:
            return changedKey;
    }
}