import { tableTypes } from "../utils";

const { PERSONAL_INFO, EVENTS, SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS, LIFE_EVENTS } = tableTypes;

const personalInfoKeys = ["givenName", "surname", "gender"];
const eventKeys = ["name", "age", "date", "location", "relationships"];
const spousesAndChildrenKeys = ["name", "gender", "birth", "birthLocation", "death", "deathLocation", "marriage", "spouse"];
const parentsAndSiblingKeys = ["name", "gender", "birth", "birthLocation", "death", "deathLocation", "marriage", "spouse"];
const lifeEventsKeys = ["age","type",  "date", "location", "description"];

let checkUnknown
let nexttable

export const unKnownCases = ["Unknown Spouse", "Unknown Mother", "Unknown Father"];

export const boldAllLifeEventsTitles = ["Birth", "Marriage", "Death"];

export const nonEditTableCells = {
    PERSONAL_INFO: [],
    EVENTS: ["name", "age", "relationships"],
    SPOUSES_AND_CHILDREN: ["marriage", "spouse"],
    PARENTS_AND_SIBLINGS: ["marriage", "spouse"],
    LIFE_EVENTS: ["age","type", "description"]
};

const tableNames = [PERSONAL_INFO, EVENTS, SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS, LIFE_EVENTS];

const getDataForParentsAndSiblings = (arrayOfParentsAndSiblings) => {
    const res = [];
    arrayOfParentsAndSiblings && arrayOfParentsAndSiblings.map((parentsAndSiblings, index) => {
        if (parentsAndSiblings.Parents) {
            parentsAndSiblings.Parents.forEach((parent) => {
                res.push({
                    tableType: PARENTS_AND_SIBLINGS,
                    id: parent.id,
                    name: `${parent.firstName.GivenName} ${parent.lastName.Surname}`,
                    firstName: parent.firstName.GivenName,
                    lastName: parent.lastName.Surname,
                    gender: parent.gender.Gender,
                    imgsrc: parent.imgsrc,
                    birth: parent.birth.Date,
                    birthLocation: parent.birthLocation.Location,
                    death: parent.death.Date,
                    deathLocation: parent.deathLocation.Location,
                    marriage: parent.marriage.Date,
                    spouse: parent.spouse.length > 0 ? `${parent.spouse[0].firstName} ${parent.spouse[0].lastName}` : "",
                })
            })
        }
        if (parentsAndSiblings.children) {
            parentsAndSiblings.children.forEach((children) => {
                res.push({
                    tableType: PARENTS_AND_SIBLINGS,
                    id: children.id,
                    name: `${children.firstName.GivenName} ${children.lastName.Surname}`,
                    firstName: children.firstName.GivenName,
                    lastName: children.lastName.Surname,
                    gender: children.gender.Gender,
                    imgsrc: children.imgsrc,
                    birth: children.birth.Date,
                    birthLocation: children.birthLocation.Location,
                    death: children.death.Date,
                    deathLocation: children.deathLocation.Location,
                    marriage: children.marriage.Date,
                    spouse: children.spouse.length > 0 ? `${children.spouse[0].firstName} ${children.spouse[0].lastName}` : "",
                })
            })
        }
        return res;
    })
    return res;
}

const getDataForSpousesAndChildren = (arrayOfSpousesAndChildren) => {
    const res = [];
    if(arrayOfSpousesAndChildren){
        arrayOfSpousesAndChildren.forEach((spandch, index)=>{
            res.push({
                tableType: SPOUSES_AND_CHILDREN,
                id: spandch.id,
                name: `${spandch.firstName.GivenName} ${spandch.lastName.Surname}`,
                firstName: spandch.firstName.GivenName,
                lastName: spandch.lastName.Surname,
                gender: spandch.gender.Gender,
                imgsrc: spandch.imgsrc,
                birth: spandch.birth.Date,
                birthLocation: spandch.birthLocation.Location,
                death: spandch.death.Date,
                deathLocation: spandch.deathLocation.Location,
                marriage: spandch.marriage.Date,
                spouse: spandch.spouse.length > 0 ? `${spandch.spouse[0].firstName} ${spandch.spouse[0].lastName}` : "",
            })
            if(spandch.children && spandch.children.length > 0){
                spandch.children.forEach((children) =>{
                    res.push({
                        tableType: SPOUSES_AND_CHILDREN,
                        id: children.id,
                        name: `${children.firstName.GivenName} ${children.lastName.Surname}`,
                        firstName: children.firstName.GivenName,
                        lastName: children.lastName.Surname,
                        gender: children.gender.Gender,
                        imgsrc:children.imgsrc,
                        birth: children.birth.Date,
                        birthLocation: children.birthLocation.Location,
                        death: children.death.Date,
                        deathLocation: children.deathLocation.Location,
                        marriage: children.marriage.Date,
                        spouse: children.spouse.length > 0 ? `${children.spouse[0].firstName} ${children.spouse[0].lastName}` : "",
                    })
                });
            }
        })
    }
    return res;
}

const getNewDataRow = (tableType, person, dataIndex) => {
    const spousesTableData = getDataForSpousesAndChildren(person.spousesAndChildren);
    const parentsTableData = getDataForParentsAndSiblings(person.parentsAndSiblings);

    let data;

    switch (tableType) {
        case EVENTS:
            data = person.events[dataIndex];

            return {
                id: data.id,
                name: data.name,
                age: data.age,
                date: data.date.Date.RawDate,
                location: data.location.Location,
                relationships: data.relationships ? data.relationships.map(e => e.lastName ? ` ${e.firstName} ${e.lastName}` : ` ${e.firstName}`) : ""
            }

        case SPOUSES_AND_CHILDREN:
            data = spousesTableData[dataIndex];

            return {
                birth: data.birth,
                birthLocation: data.birthLocation,
                death: data.death,
                deathLocation: data.deathLocation,
                gender: data.gender,
                id: data.id,
                imgsrc: data.imgsrc,
                marriage: data.marriage,
                name: data.name,
                firstName: data.firstName,
                lastName: data.lastName,
                spouse: data.spouse
            }

        case PARENTS_AND_SIBLINGS:
            data = parentsTableData[dataIndex];

            return {
                birth: data.birth,
                birthLocation: data.birthLocation,
                death: data.death,
                deathLocation: data.deathLocation,
                gender: data.gender,
                id: data.id,
                imgsrc: data.imgsrc,
                marriage: data.marriage,
                name: data.name,
                firstName: data.firstName,
                lastName: data.lastName,
                spouse: data.spouse
            }

        case LIFE_EVENTS:
            data = person.lifeEvents[dataIndex];
            return {
                id: data.id,
                type: data.type,
                date: data.date.Date.RawDate,
                location: data.location.Location,
                description: data.description,
            }

        case PERSONAL_INFO:
        default:
            data = person.personalInfo;

            return {
                id: data.id,
                givenName: data.givenName.givenName,
                surname: data.surname.surname,
                gender: data.gender.gender
            }

    }
}

export const getNextAndPrevTableCell = (tableType, dataIndex, keyIndex, person, next) => {
    const spousesTableData = getDataForSpousesAndChildren(person.spousesAndChildren);
    const parentsTableData = getDataForParentsAndSiblings(person.parentsAndSiblings);
    const eventsLength = person.events.length - 1;
    const spousesLength = spousesTableData.length - 1;
    const parentsLength = parentsTableData.length - 1;
    const lifeEventsLength = person.lifeEvents.length - 1;
    const infoLength = person.personalInfo.length - 1;

    let newDataIndex, newKeyIndex;
    let tableIndex ;
    let lastRow = false;

    switch (tableType) {
        case EVENTS:
            tableIndex = 1;
            if (next) {
                if (dataIndex === eventsLength && keyIndex === 3) {
                    newDataIndex = 0
                    if(spousesLength >= 0){
                        tableIndex = tableIndex + 1
                        newKeyIndex = 0;
                        nexttable = tableNames[tableIndex]
                        checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                        if(checkUnknown.name.trim() ==="")
                            newDataIndex++;
                    }
                    else if(parentsLength >= 0){
                        tableIndex = tableIndex + 2
                        newKeyIndex = 0;
                    }
                    else if(lifeEventsLength >= 0){
                        newKeyIndex = 2;
                        tableIndex = tableIndex + 3
                    }
                    else
                    {
                        newKeyIndex = keyIndex;
                        newDataIndex = dataIndex;
                        lastRow = true;
                    }
                    nexttable = tableNames[tableIndex]
                    
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else if (keyIndex === 3) {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = 2;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex + 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0 && keyIndex === 2) {
                    if(eventsLength >= 0)
                        tableIndex = tableIndex - 1
                    newDataIndex = 0;
                    newKeyIndex = 2;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: personalInfoKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else if (keyIndex === 2) {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = 3;

                    return {
                        newTableType: EVENTS,
                        newDataRow: getNewDataRow(EVENTS, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex - 1;

                    return {
                        newTableType: EVENTS,
                        newDataRow: getNewDataRow(EVENTS, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case SPOUSES_AND_CHILDREN:
            tableIndex = 2;
            if (next) {
                if (dataIndex === spousesLength && keyIndex === 5) {        
                    if(parentsLength >= 0){
                        newKeyIndex = 0;
                        newDataIndex = 0;
                        tableIndex = tableIndex + 1
                    }
                    else if(lifeEventsLength >= 0){
                        newKeyIndex = 2;
                        newDataIndex = 0;
                        tableIndex = tableIndex + 2
                    }
                    else
                    {
                        newKeyIndex = keyIndex;
                        newDataIndex = dataIndex;
                        lastRow = true;
                    }
                    nexttable = tableNames[tableIndex]

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else if (keyIndex === 5) {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = 0;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex + 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0 && keyIndex === 0) {
                    if(eventsLength >= 0){
                        tableIndex = tableIndex - 1
                        newKeyIndex = 3;
                        newDataIndex = eventsLength
                    }
                    else if(infoLength >= 0){
                        tableIndex = tableIndex - 2
                        newKeyIndex = 2;
                        newDataIndex = infoLength
                    }
                    nexttable = tableNames[tableIndex]

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else if (keyIndex === 0) {
                    if(dataIndex > 0) 
                        newDataIndex = dataIndex - 1;
                    else
                        newDataIndex = dataIndex
                    newKeyIndex = 5;
                    nexttable = tableNames[tableIndex]
                    checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                    if(checkUnknown.name.trim() ==="" || (newDataIndex === 0 && newKeyIndex === 0))
                        {
                        if(eventsLength >= 0){
                            tableIndex = tableIndex - 1
                            newKeyIndex = 3;
                            newDataIndex = eventsLength;
                        }
                        else if(infoLength >= 0){
                            tableIndex = tableIndex - 2
                            newKeyIndex = 2;
                            newDataIndex = infoLength;
                        }
                        nexttable = tableNames[tableIndex]

                        return {
                            newTableType: nexttable,
                            newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                            newKeyValue: eventKeys[newKeyIndex],
                            newDataIndex,
                            newKeyIndex,
                            lastRow
                        }
                    } 
                    else{
                        return {
                            newTableType: nexttable,
                            newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                            newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                            newDataIndex,
                            newKeyIndex,
                            lastRow
                        }
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex - 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case PARENTS_AND_SIBLINGS:
            tableIndex = 3
            if (next) {
                if (dataIndex === parentsLength && keyIndex === 5) {
                    if(lifeEventsLength >= 0){
                        tableIndex = tableIndex + 1
                        newDataIndex = 0;
                        newKeyIndex = 2;
                    }
                    else
                    {
                        newKeyIndex = keyIndex;
                        newDataIndex = dataIndex;
                        lastRow = true;
                    }
                    nexttable = tableNames[tableIndex]

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else if (keyIndex === 5) {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = 0;
                    nexttable = tableNames[tableIndex]
                    checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                    if(checkUnknown.name.trim() ==="")
                        newDataIndex++;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex + 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0 && keyIndex === 0) {
                    if(spousesLength >= 0){
                        tableIndex = tableIndex - 1
                        newKeyIndex = 5;
                        newDataIndex = spousesLength
                    }
                    else if(eventsLength >= 0){
                        tableIndex = tableIndex - 2
                        newKeyIndex = 3;
                        newDataIndex = eventsLength
                    }
                    else if(infoLength >= 0){
                        tableIndex = tableIndex - 3
                        newKeyIndex = 2;
                        newDataIndex = infoLength
                    }
                    nexttable = tableNames[tableIndex]

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else if (keyIndex === 0) {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = 5;
                    nexttable = tableNames[tableIndex]
                    checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                    if(checkUnknown.name.trim() ==="")
                        newDataIndex--;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex - 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case LIFE_EVENTS:
            tableIndex = 4
            if (next) {
                nexttable = tableNames[tableIndex]
                if (dataIndex === lifeEventsLength && keyIndex === 3) {
                    newDataIndex = lifeEventsLength;
                    newKeyIndex = 3;
                    lastRow = true;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex, 
                        lastRow
                    }
                } else if (keyIndex === 3) {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = 2;

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex + 1;

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0 && keyIndex === 2) {
                    if(parentsLength >= 0){
                        tableIndex = tableIndex - 1
                        newKeyIndex = 5;
                        newDataIndex = parentsLength
                    }
                    else if(spousesLength >= 0){
                        tableIndex = tableIndex - 2
                        newKeyIndex = 5;
                        newDataIndex = spousesLength
                    }
                    else if(eventsLength >= 0){
                        tableIndex = tableIndex - 3
                        newKeyIndex = 3;
                        newDataIndex = eventsLength
                    }
                    else if(infoLength >= 0){
                        tableIndex = tableIndex - 4
                        newKeyIndex = 2;
                        newDataIndex = infoLength
                    }
                    nexttable = tableNames[tableIndex]  

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else if (keyIndex === 2) {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = 3;
                    nexttable = tableNames[tableIndex]  
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex - 1;
                    nexttable = tableNames[tableIndex]  
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case PERSONAL_INFO:
        default:
            tableIndex = 0
            if (next) {
                if (dataIndex === 0 && keyIndex === 2) {
                    if(eventsLength >= 0){
                        tableIndex = tableIndex + 1
                        newKeyIndex = 2;
                    }
                    else if(spousesLength >= 0){
                        tableIndex = tableIndex + 2
                        newKeyIndex = 0;
                    }
                    else if(parentsLength >= 0){
                        tableIndex = tableIndex + 3
                        newKeyIndex = 0;
                    }
                    else if(lifeEventsLength >= 0){
                        tableIndex = tableIndex + 4
                        newKeyIndex = 1;
                    }
                    nexttable = tableNames[tableIndex]
                    newDataIndex = 0;

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex + 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: personalInfoKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0 && keyIndex === 0) {
                    newDataIndex = 0;
                    newKeyIndex = 0;
                    nexttable = tableNames[tableIndex]
                    lastRow =  true
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: personalInfoKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex;
                    newKeyIndex = keyIndex - 1;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: personalInfoKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }
    }
}

export const getTopAndBottomTableCell = (tableType, dataIndex, keyIndex, person, bottom) => {
    const spousesTableData = getDataForSpousesAndChildren(person.spousesAndChildren);
    const parentsTableData = getDataForParentsAndSiblings(person.parentsAndSiblings);
    const infoLength = person.personalInfo.length - 1;
    const eventsLength = person.events.length - 1;
    const spousesLength = spousesTableData.length - 1;
    const parentsLength = parentsTableData.length - 1;
    const lifeEventsLength = person.lifeEvents.length - 1;
    
    let newDataIndex, newKeyIndex;
    let lastRow = false;
    let tableIndex;

    switch (tableType) {
        case EVENTS:
            tableIndex = 1
            if (bottom) {
                if (dataIndex === eventsLength) { 
                    newDataIndex = 0
                    if(spousesLength >= 0){
                        tableIndex = tableIndex + 1
                        newKeyIndex = 0;
                        nexttable = tableNames[tableIndex]
                        checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                        if(checkUnknown.name.trim() ==="")
                            newDataIndex++;
                    }
                    else if(parentsLength >= 0){
                        tableIndex = tableIndex + 2
                        newKeyIndex = 0;
                    }
                    else if(lifeEventsLength >= 0){
                        newKeyIndex = 2;
                        tableIndex = tableIndex + 3
                    }
                    else{
                        newKeyIndex = keyIndex;
                        newDataIndex = dataIndex;
                        lastRow = true;
                    }
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0) {
                    if(eventsLength >= 0)
                        tableIndex = tableIndex - 1
                    nexttable = tableNames[tableIndex]
                    newDataIndex = 0;
                    newKeyIndex = 2;

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: personalInfoKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = keyIndex;

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case SPOUSES_AND_CHILDREN:
            tableIndex = 2
            if (bottom) {
                if (dataIndex === spousesLength) {
                    
                    if(parentsLength >= 0){
                        newKeyIndex = 0;
                        newDataIndex = 0;
                        tableIndex = tableIndex + 1
                    }
                    else if(lifeEventsLength >= 0){
                        newKeyIndex = 2;
                        newDataIndex = 0;
                        tableIndex = tableIndex + 2
                    }
                    else{
                        newKeyIndex = keyIndex;
                        newDataIndex = dataIndex;
                        lastRow = true;
                    }
                    nexttable = tableNames[tableIndex]

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0) {
                    if(eventsLength >= 0){
                        tableIndex = tableIndex - 1
                        newKeyIndex = 3;
                        newDataIndex = eventsLength
                    }
                    else if(infoLength >= 0){
                        tableIndex = tableIndex - 2
                        newKeyIndex = 2;
                        newDataIndex = infoLength
                    }
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                    if(checkUnknown.name.trim() ==="")
                        newDataIndex--;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case PARENTS_AND_SIBLINGS:
            tableIndex = 3
            if (bottom) {
                if (dataIndex === parentsLength) {
                    if(lifeEventsLength >= 0){
                        tableIndex = tableIndex + 1
                        newDataIndex = 0;
                        newKeyIndex = 2;
                    }
                    else{
                        newKeyIndex = keyIndex;
                        newDataIndex = dataIndex;
                        lastRow = true;
                    }
                    nexttable = tableNames[tableIndex]
                    

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                    if(checkUnknown.name.trim() ==="")
                        newDataIndex++;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0) {
                    if(spousesLength >= 0){
                        tableIndex = tableIndex - 1
                        newKeyIndex = 5;
                        newDataIndex = spousesLength
                    }
                    else if(eventsLength >= 0){
                        tableIndex = tableIndex - 2
                        newKeyIndex = 3;
                        newDataIndex = eventsLength
                    }
                    else if(infoLength >= 0){
                        tableIndex = tableIndex - 3
                        newKeyIndex = 2;
                        newDataIndex = infoLength
                    }
                    nexttable = tableNames[tableIndex]
                    
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: spousesAndChildrenKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
                else {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    checkUnknown = getNewDataRow(nexttable, person, newDataIndex)
                    if(checkUnknown.name.trim() ==="")
                        newDataIndex--;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case LIFE_EVENTS:
            tableIndex = 4
            if (bottom) {
                nexttable = tableNames[tableIndex]
                if (dataIndex === lifeEventsLength) {
                    newDataIndex = lifeEventsLength;
                    newKeyIndex = keyIndex;
                    lastRow = true;
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } else {
                    newDataIndex = dataIndex + 1;
                    newKeyIndex = keyIndex;

                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            } 
            else {
                if (dataIndex === 0) {
                    if(parentsLength >= 0){
                        tableIndex = tableIndex - 1
                        newKeyIndex = 5;
                        newDataIndex = parentsLength
                    }
                    else if(spousesLength >= 0){
                        tableIndex = tableIndex - 2
                        newKeyIndex = 5;
                        newDataIndex = spousesLength
                    }
                    else if(eventsLength >= 0){
                        tableIndex = tableIndex - 3
                        newKeyIndex = 3;
                        newDataIndex = eventsLength
                    }
                    else if(infoLength >= 0){
                        tableIndex = tableIndex - 4
                        newKeyIndex = 2;
                        newDataIndex = infoLength
                    }
                    nexttable = tableNames[tableIndex]  
                    
                    
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: parentsAndSiblingKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
                else {
                    newDataIndex = dataIndex - 1;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: lifeEventsKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                }
            }

        case PERSONAL_INFO:
        default:
            tableIndex = 0
            if (bottom) {
                if (dataIndex === 0) {
                    if(eventsLength >= 0){
                        tableIndex = tableIndex + 1
                        newKeyIndex = 2;
                    }
                    else if(spousesLength >= 0){
                        tableIndex = tableIndex + 2
                        newKeyIndex = 0;
                    }
                    else if(parentsLength >= 0){
                        tableIndex = tableIndex + 3
                        newKeyIndex = 0;
                    }
                    else if(lifeEventsLength >= 0){
                        tableIndex = tableIndex + 4
                        newKeyIndex = 2;
                    }
                    nexttable = tableNames[tableIndex]
                    newDataIndex = 0;
                    
                    }
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: eventKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
            } 
            else {
                if (dataIndex === 0) {
                    newDataIndex = 0;
                    newKeyIndex = keyIndex;
                    nexttable = tableNames[tableIndex]
                    lastRow = true
                    return {
                        newTableType: nexttable,
                        newDataRow: getNewDataRow(nexttable, person, newDataIndex),
                        newKeyValue: personalInfoKeys[newKeyIndex],
                        newDataIndex,
                        newKeyIndex,
                        lastRow
                    }
                } 
            }
    }
}