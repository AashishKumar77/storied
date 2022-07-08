import { tableTypes } from "../../components/utils";

const { PERSONAL_INFO, EVENTS, SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS, LIFE_EVENTS } = tableTypes;

////////////////////////////////// PERSONAL_INFO ////////////////////////////////// 
const updateNameForPersonalInfo = (newData, person) => {
    return {
        ...person.personalInfo,
        givenName: {
            ...person.personalInfo.givenName,
            givenName: newData.nameDetails.firstName,
        },
        surname: {
            ...person.personalInfo.surname,
            surname: newData.nameDetails.lastName,
        }
    }
}

const updateGenderForPersonalInfo = (newData, person) => {
    return {
        ...person.personalInfo,
        gender: {
            ...person.personalInfo.gender,
            gender: newData.gender,
        }
    }
}

const updateDateForPersonalInfo = (newData, person, keyName, newKeyName) => {
    return {
        ...person.personalInfo,
        [keyName]: {
            ...person.personalInfo[keyName],
            rawDate: newData[newKeyName],
            year: newData[newKeyName]
        }
    }
}

const updateLocationForPersonalInfo = (newData, person, keyName, newKeyName) => {
    return {
        ...person.personalInfo,
        [keyName]: newData[newKeyName]
    }
}

////////////////////////////////// NAME ////////////////////////////////// 
const updateSpouseName = (arr, newData, keyName) => {
    return arr.reduce((res1, ele1) => {
        const data = ele1[keyName].reduce((res2, ele2) => {
            const selectedObject = ele2.id === newData.id ? true : false;
            res2.push({
                ...ele2,
                firstName: selectedObject ? newData.nameDetails.firstName : ele2.firstName,
                lastName: selectedObject ? newData.nameDetails.lastName : ele2.lastName
            })
            return res2;
        }, [])

        res1.push({
            ...ele1,
            [keyName]: data
        })
        return res1;
    }, [])
}

const updateNameForParentsAndSiblings = (arr, newData, keyName) => {
    return arr.reduce((res1, ele1) => {
        const data = ele1[keyName].reduce((res2, ele2) => {
            const selectedObject = ele2.id === newData.id ? true : false;
            res2.push({
                ...ele2,
                firstName: {
                    ...ele2.firstName,
                    GivenName: selectedObject ? newData.nameDetails.firstName : ele2.firstName.GivenName,
                },
                lastName: {
                    ...ele2.lastName,
                    Surname: selectedObject ? newData.nameDetails.lastName : ele2.lastName.Surname
                }
            })
            return res2;
        }, [])

        res1.push({
            ...ele1,
            [keyName]: data
        })
        return res1;
    }, [])
}

const updateGenderForParentsAndSiblings = (arr, newData, keyName) => {
    return arr.reduce((res1, ele1) => {
        const data = ele1[keyName].reduce((res2, ele2) => {
            const selectedObject = ele2.id === newData.id ? true : false;
            res2.push({
                ...ele2,
                gender: {
                    ...ele2.firstName,
                    Gender: selectedObject ? newData.gender : ele2.gender.Gender,
                }
            })
            return res2;
        }, [])

        res1.push({
            ...ele1,
            [keyName]: data
        })
        return res1;
    }, [])
}

const updateSpouseNameForParentsAndSiblings = (arr, newData, keyName) => {
    return arr.reduce((res1, ele1) => {
        const data = ele1[keyName].reduce((res2, ele2) => {
            const spouse = ele2.spouse.reduce((res3, ele3) => {
                const selectedObject = ele3.id === newData.id ? true : false;
                res3.push({
                    ...ele3,
                    firstName: selectedObject ? newData.nameDetails.firstName : ele3.firstName,
                    lastName: selectedObject ? newData.nameDetails.lastName : ele3.lastName
                })
                return res3;
            }, []);
            res2.push({
                ...ele2,
                spouse
            })
            return res2;
        }, [])

        res1.push({
            Parents: keyName === "Parents" ? data : ele1.Parents,
            children: keyName === "children" ? data : ele1.children,
        })
        return res1;
    }, [])
}

//////////////////////////////////  DATE / LOCATION ////////////////////////////////// 
const getOtherKeyNameForFamily = (primaryKey) => {
    switch (primaryKey) {
        case "birth": return "birthLocation";
        case "birthLocation": return "birth";
        case "death": return "deathLocation";
        case "deathLocation": return "death";
        default: return null
    }
}

const updateDateAndLocation = ({ arr, newData, primaryKey, secondaryKey, fcKey, newKeyName, AssertionId }) => {
    const otherKeyName = getOtherKeyNameForFamily(primaryKey);
    return arr.reduce((res, ele) => {
        if (otherKeyName && AssertionId) {
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: ele[primaryKey][fcKey] === newData.id ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: ele[primaryKey][fcKey] === newData.id ? newData[newKeyName] : ele[primaryKey][secondaryKey]
                },
                [otherKeyName]: {
                    ...ele[otherKeyName],
                    AssertionId: ele[otherKeyName][fcKey] === newData.id ? AssertionId : ele[otherKeyName].AssertionId,
                }
            })
        } else {
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    [secondaryKey]: ele[primaryKey][fcKey] === newData.id ? newData[newKeyName] : ele[primaryKey][secondaryKey]
                }
            })
        }
        return res;
    }, []);
}

const updateNestedArr = ({ arr, newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId }) => {
    const otherKeyName = getOtherKeyNameForFamily(primaryKey);
    return arr.reduce((res, ele) => {
        if (otherKeyName && AssertionId) {
            const selectedObject1 = ele[primaryKey][cKey] === compId ? true : false;
            const selectedObject2 = ele[otherKeyName][cKey] === compId ? true : false;
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: selectedObject1 ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: selectedObject1 ? newData[newKeyName] : ele[primaryKey][secondaryKey],
                },
                [otherKeyName]: {
                    ...ele[otherKeyName],
                    AssertionId: selectedObject2 ? AssertionId : ele[otherKeyName].AssertionId,
                }
            })
        } else {
            const selectedObject3 = ele[primaryKey][cKey] === compId ? true : false;
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    [secondaryKey]: selectedObject3 ? newData[newKeyName] : ele[primaryKey][secondaryKey],
                }
            })
        }
        return res;
    }, []);
}

const updateDateAndLocationForSpousesAndChildren = ({ arr, newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId }) => {
    const otherKeyName = getOtherKeyNameForFamily(primaryKey);
    return arr.reduce((res, ele) => {
        const children = updateNestedArr({ arr: ele.children, newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId });
        if (otherKeyName && AssertionId) {
            res.push({
                ...ele,
                children,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: ele[primaryKey][cKey] === compId ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: ele[primaryKey][cKey] === compId ? newData[newKeyName] : ele[primaryKey][secondaryKey]
                },
                [otherKeyName]: {
                    ...ele[otherKeyName],
                    AssertionId: ele[otherKeyName][cKey] === compId ? AssertionId : ele[otherKeyName].AssertionId,
                }
            })
        } else {
            res.push({
                ...ele,
                children,
                [primaryKey]: {
                    ...ele[primaryKey],
                    [secondaryKey]: ele[primaryKey][cKey] === compId ? newData[newKeyName] : ele[primaryKey][secondaryKey]
                }
            })
        }
        return res;
    }, []);
}

const updateDateAndLocationForBothParentsAndSiblings = ({ arr, newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId }) => {
    return arr.reduce((res1, ele1) => {
        const Parents = updateNestedArr({ arr: ele1.Parents, newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId });
        const children = updateNestedArr({ arr: ele1.children, newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId });
        res1.push({
            Parents,
            children,
        })
        return res1;
    }, [])
}

const updateDateAndLocationForParentsAndSiblings = ({ arr, newData, compId, keyName, primaryKey, secondaryKey, cKey, newKeyName, AssertionId }) => {
    return arr.reduce((res, ele) => {
        const data = updateNestedArr({ arr: ele[keyName], newData, compId, primaryKey, secondaryKey, cKey, newKeyName, AssertionId });
        res.push({
            Parents: keyName === "Parents" ? data : ele.Parents,
            children: keyName === "children" ? data : ele.children,
        })
        return res;
    }, [])
}

const getOtherKeyNameForEvents = (primaryKey) => {
    switch (primaryKey) {
        case "date": return "location";
        case "location": return "date";
        case "Date": return "Location";
        case "Location": return "Date";
        default: return null;
    }
}

const updateDateAndLocationForEvents = ({ arr, newData, compId, primaryKey, secondaryKey, fcKey, scKey, type, newKeyName, AssertionId }) => {
    const otherKeyName = getOtherKeyNameForEvents(primaryKey);
    return arr.reduce((res, ele) => {
        if (otherKeyName && AssertionId) {
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? newData[newKeyName] : ele[primaryKey][secondaryKey]
                },
                [otherKeyName]: {
                    ...ele[otherKeyName],
                    AssertionId: ele[fcKey] === type && ele[otherKeyName][scKey] === compId ? AssertionId : ele[otherKeyName].AssertionId,
                }
            })
        } else {
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? newData[newKeyName] : ele[primaryKey][secondaryKey]
                }
            })
        }
        return res;
    }, []);
}

const updateDateForEvents = ({ arr, newData, compId, primaryKey, secondaryKey, fcKey, scKey, type, newKeyName, AssertionId }) => {
    const otherKeyName = getOtherKeyNameForEvents(primaryKey);
    return arr.reduce((res, ele) => {
        if (otherKeyName && AssertionId) {
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: {
                        ...ele[primaryKey][secondaryKey],
                        RawDate: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? newData[newKeyName] : ele[primaryKey][secondaryKey].RawDate
                    }
                },
                [otherKeyName]: {
                    ...ele[otherKeyName],
                    AssertionId: ele[fcKey] === type && ele[otherKeyName][scKey] === compId ? AssertionId : ele[otherKeyName].AssertionId,
                }
            })
        } else {
            res.push({
                ...ele,
                [primaryKey]: {
                    ...ele[primaryKey],
                    AssertionId: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? AssertionId : ele[primaryKey].AssertionId,
                    [secondaryKey]: {
                        ...ele[primaryKey][secondaryKey],
                        RawDate: ele[fcKey] === type && ele[primaryKey][scKey] === compId ? newData[newKeyName] : ele[primaryKey][secondaryKey].RawDate
                    }
                }
            })
        }
        return res;
    }, []);
}

const getKeyName = (newData, changedKey) => {
    const dateKeys = ["date", "birth", "death"];
    const dateKey = dateKeys.includes(changedKey) ? true : false;

    if ((newData.tableType === EVENTS && newData.name === "Birth") || (newData.tableType === LIFE_EVENTS && newData.type === "Birth") || (changedKey === "birth") || (changedKey === "birthLocation")) {
        return {
            type: "Birth",
            keyName: dateKey ? "birthDate" : "birthLocation",
            shortName: dateKey ? "birth" : "location"
        }
    } else if ((newData.tableType === EVENTS && newData.name === "Death") || (newData.tableType === LIFE_EVENTS && newData.type === "Death") || (changedKey === "death") || (changedKey === "deathLocation")) {
        return {
            type: "Death",
            keyName: dateKey ? "deathDate" : "deathLocation",
            shortName: dateKey ? "death" : "location"
        }
    } else if ((newData.tableType === EVENTS && newData.name === "Marriage") || (newData.tableType === LIFE_EVENTS && newData.type === "Marriage")) {
        return {
            type: "Marriage",
            keyName: dateKey ? "date" : "location",
            shortName: dateKey ? "marriage" : "location"
        }
    } else if ((newData.tableType === EVENTS && newData.name === "Divorce") || (newData.tableType === LIFE_EVENTS && newData.type === "Divorce")) {
        return {
            type: "Divorce",
            keyName: dateKey ? "date" : "location",
            shortName: dateKey ? "divorce" : "location"
        }
    } else return null;
}

const capitalKeyName = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getPersonalInfo = (newData, person, changedKeyName, keyObj) => {
    if (newData.id === person.personalInfo.id && changedKeyName === "date") {
        return updateDateForPersonalInfo(newData, person, keyObj.keyName, keyObj.shortName)
    } else if (newData.id === person.personalInfo.id && changedKeyName === "location") {
        return updateLocationForPersonalInfo(newData, person, keyObj.keyName, keyObj.keyName)
    } else {
        return person.personalInfo;
    }
}

export const getOptimisticDetails = (newData, changedKey, person, AssertionId) => {
    let personalInfo, events, spousesAndChildren, parentsAndSiblings, lifeEvents, newDataClone, keyObj, changedKeyName;
    switch (true) {
        ////////////////////////////////// PERSONAL_INFO ////////////////////////////////// 
        case ((newData.tableType === PERSONAL_INFO) && (changedKey === "givenName")):
        case ((newData.tableType === PERSONAL_INFO) && (changedKey === "surname")):
            newDataClone = { ...newData };
            newDataClone.nameDetails = { firstName: newData.givenName, lastName: newData.surname }
            personalInfo = updateNameForPersonalInfo(newDataClone, person);
            spousesAndChildren = updateSpouseName(person.spousesAndChildren, newDataClone, "spouse");
            parentsAndSiblings = updateNameForParentsAndSiblings(person.parentsAndSiblings, newDataClone, "children");
            return {
                personalInfo,
                events: person.events,
                spousesAndChildren,
                parentsAndSiblings,
                lifeEvents: person.lifeEvents
            }

        case ((newData.tableType === PERSONAL_INFO) && (changedKey === "gender")):
            personalInfo = updateGenderForPersonalInfo(newData, person);
            parentsAndSiblings = updateGenderForParentsAndSiblings(person.parentsAndSiblings, newData, "children");
            return {
                personalInfo,
                events: person.events,
                spousesAndChildren: person.spousesAndChildren,
                parentsAndSiblings,
                lifeEvents: person.lifeEvents
            }

        ////////////////////////////////// EVENTS BIRTH/DEATH DATE/LOCATION ////////////////////////////////// 
        case ((newData.tableType === EVENTS) && (newData.name === "Birth" || newData.name === "Death") && (changedKey === "date" || changedKey === "location")):
        case ((newData.tableType === LIFE_EVENTS) && (newData.type === "Birth" || newData.type === "Death") && (changedKey === "date" || changedKey === "location")):
            keyObj = getKeyName(newData, changedKey);
            personalInfo = changedKey === "date" ? updateDateForPersonalInfo(newData, person, keyObj.keyName, changedKey) : updateLocationForPersonalInfo(newData, person, keyObj.keyName, changedKey);
            events = changedKey === "date" ? updateDateForEvents({ arr: person.events, newData, compId: person.personalInfo.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "name", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId }) : updateDateAndLocationForEvents({ arr: person.events, newData, compId: person.personalInfo.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "name", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId });
            parentsAndSiblings = updateDateAndLocationForParentsAndSiblings({ arr: person.parentsAndSiblings, newData, compId: person.personalInfo.id, keyName: "children", primaryKey: changedKey === "date" ? keyObj.shortName : keyObj.keyName, secondaryKey: capitalKeyName(changedKey), cKey: "PersonId", newKeyName: changedKey, AssertionId });
            lifeEvents = changedKey === "date" ? updateDateForEvents({ arr: person.lifeEvents, newData, compId: person.personalInfo.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "type", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId }) : updateDateAndLocationForEvents({ arr: person.lifeEvents, newData, compId: person.personalInfo.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "type", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId });
            return {
                personalInfo,
                events,
                spousesAndChildren: person.spousesAndChildren,
                parentsAndSiblings,
                lifeEvents
            }

        ////////////////////////////////// EVENTS MARRIAGE/DIVORCE DATE/LOCATION ////////////////////////////////// 
        case ((newData.tableType === EVENTS) && (newData.name === "Marriage" || newData.name === "Divorce") && (changedKey === "date" || changedKey === "location")):
        case ((newData.tableType === LIFE_EVENTS) && (newData.type === "Marriage" || newData.type === "Divorce") && (changedKey === "date" || changedKey === "location")):
            keyObj = getKeyName(newData, changedKey);
            events = changedKey === "date" ? updateDateForEvents({ arr: person.events, newData, compId: person.personalInfo.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "name", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId }) : updateDateAndLocationForEvents({ arr: person.events, newData, compId: newData.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "name", scKey: "AssertionId", type: keyObj.type, newKeyName: changedKey, AssertionId });
            lifeEvents = changedKey === "date" ? updateDateForEvents({ arr: person.lifeEvents, newData, compId: person.personalInfo.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "type", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId }) : updateDateAndLocationForEvents({ arr: person.lifeEvents, newData, compId: newData.id, primaryKey: changedKey, secondaryKey: capitalKeyName(changedKey), fcKey: "type", scKey: "AssertionId", type: keyObj.type, newKeyName: changedKey, AssertionId });
            if (keyObj.type === "Marriage" && changedKey === "date") {
                spousesAndChildren = updateDateAndLocation({ arr: person.spousesAndChildren, newData, primaryKey: keyObj.shortName, secondaryKey: capitalKeyName(changedKey), fcKey: "AssertionId", newKeyName: changedKey, AssertionId });
                parentsAndSiblings = updateDateAndLocationForParentsAndSiblings({ arr: person.parentsAndSiblings, newData, compId: newData.id, keyName: "children", primaryKey: keyObj.shortName, secondaryKey: capitalKeyName(changedKey), cKey: "AssertionId", newKeyName: changedKey, AssertionId });
            }
            return {
                personalInfo: person.personalInfo,
                events,
                spousesAndChildren: keyObj.type === "Marriage" && changedKey === "date" ? spousesAndChildren : person.spousesAndChildren,
                parentsAndSiblings: keyObj.type === "Marriage" && changedKey === "date" ? parentsAndSiblings : person.parentsAndSiblings,
                lifeEvents
            }

        ////////////////////////////////// SPOUSES NAME ////////////////////////////////// 
        case ((newData.tableType === SPOUSES_AND_CHILDREN) && (changedKey === "name")):
            events = updateSpouseName(person.events, newData, "relationships");
            parentsAndSiblings = updateSpouseNameForParentsAndSiblings(person.parentsAndSiblings, newData, "children");
            return {
                personalInfo: person.personalInfo,
                events,
                spousesAndChildren: person.spousesAndChildren,
                parentsAndSiblings,
                lifeEvents: person.lifeEvents
            }

        ////////////////////////////////// SPOUSES DATE AND LOCATION ////////////////////////////////// 
        case ((newData.tableType === SPOUSES_AND_CHILDREN) && (changedKey === "birth" || changedKey === "birthLocation" || changedKey === "death" || changedKey === "deathLocation" || changedKey === "marriage")):
            spousesAndChildren = updateDateAndLocationForSpousesAndChildren({ arr: person.spousesAndChildren, newData, compId: newData.id, primaryKey: changedKey, secondaryKey: changedKey === "birthLocation" || changedKey === "deathLocation" ? "Location" : "Date", cKey: "PersonId", newKeyName: changedKey, AssertionId });
            return {
                personalInfo: person.personalInfo,
                events: person.events,
                spousesAndChildren,
                parentsAndSiblings: person.parentsAndSiblings,
                lifeEvents: person.lifeEvents
            }

        ////////////////////////////////// PARENTS NAME ////////////////////////////////// 
        case ((newData.tableType === PARENTS_AND_SIBLINGS) && (changedKey === "name")):
            personalInfo = newData.id === person.personalInfo.id ? updateNameForPersonalInfo(newData, person) : person.personalInfo;
            events = updateSpouseName(person.events, newData, "relationships");
            spousesAndChildren = updateSpouseName(person.spousesAndChildren, newData, "spouse");
            parentsAndSiblings = updateSpouseNameForParentsAndSiblings(person.parentsAndSiblings, newData, "Parents");
            return {
                personalInfo,
                events,
                spousesAndChildren,
                parentsAndSiblings,
                lifeEvents: person.lifeEvents
            }

        ////////////////////////////////// PARENTS GENDER ////////////////////////////////// 
        case ((newData.tableType === PARENTS_AND_SIBLINGS) && (changedKey === "gender")):
            personalInfo = newData.id === person.personalInfo.id ? updateGenderForPersonalInfo(newData, person) : person.personalInfo;
            return {
                personalInfo,
                events: person.events,
                spousesAndChildren: person.spousesAndChildren,
                parentsAndSiblings: person.parentsAndSiblings,
                lifeEvents: person.lifeEvents
            }

        ////////////////////////////////// PARENTS BIRTH/DEATH DATE/LOCATION ////////////////////////////////// 
        case ((newData.tableType === PARENTS_AND_SIBLINGS) && (changedKey === "birth" || changedKey === "death" || changedKey === "birthLocation" || changedKey === "deathLocation")):
            keyObj = getKeyName(newData, changedKey);
            changedKeyName = changedKey === "birth" || changedKey === "death" ? "date" : "location";
            personalInfo = getPersonalInfo(newData, person, changedKeyName, keyObj);
            events = changedKeyName === 'date' ? updateDateForEvents({ arr: person.events, newData, compId: person.personalInfo.id, primaryKey: changedKeyName, secondaryKey: capitalKeyName(changedKeyName), fcKey: "name", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId }) : updateDateAndLocationForEvents({ arr: person.events, newData, compId: newData.id, primaryKey: changedKeyName, secondaryKey: capitalKeyName(changedKeyName), fcKey: "name", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId });
            parentsAndSiblings = updateDateAndLocationForBothParentsAndSiblings({ arr: person.parentsAndSiblings, newData, compId: newData.id, primaryKey: changedKeyName === "date" ? keyObj.shortName : keyObj.keyName, secondaryKey: capitalKeyName(changedKeyName), cKey: "PersonId", newKeyName: changedKey, AssertionId });
            lifeEvents = changedKeyName === 'date' ?  updateDateForEvents({ arr: person.lifeEvents, newData, compId: person.personalInfo.id, primaryKey: changedKeyName, secondaryKey: capitalKeyName(changedKeyName), fcKey: "type", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId }) : updateDateAndLocationForEvents({ arr: person.lifeEvents, newData, compId: newData.id, primaryKey: capitalKeyName(changedKeyName), secondaryKey: capitalKeyName(changedKeyName), fcKey: "type", scKey: "PersonId", type: keyObj.type, newKeyName: changedKey, AssertionId });
            return {
                personalInfo,
                events,
                spousesAndChildren: person.spousesAndChildren,
                parentsAndSiblings,
                lifeEvents
            }

        case ((newData.tableType === LIFE_EVENTS) && (newData.type === "Death") && (changedKey === "addLifeEvent")):
            let result = updateDateAndLocationForParentsAndSiblings({ arr: person.parentsAndSiblings, newData, compId: person.personalInfo.id, keyName: "children", primaryKey: "death", secondaryKey: "Date", cKey: "PersonId", newKeyName: "date" });
            let parentsAndSiblingsWithDate = updateDateAndLocationForParentsAndSiblings({ arr: result, newData, compId: person.personalInfo.id, keyName: "children", primaryKey: "deathLocation", secondaryKey: "Location", cKey: "PersonId", newKeyName: "location" });
            return {
                personalInfo: person.personalInfo,
                events: person.events,
                spousesAndChildren: person.spousesAndChildren,
                parentsAndSiblings: parentsAndSiblingsWithDate,
                lifeEvents: person.lifeEvents
            }

        default:
            return null;
    }
}