import { v4 as uuidv4 } from "uuid";
import { getOwner } from "../../services";
import { checkUnknown } from '../../utils';
import {titleCase} from "../../components/utils/titlecase";
import { trimString } from "shared-logics";

const BlankId = "00000000-0000-0000-0000-000000000000";

export const addFilialFunction = (child, parent, treeId) => {
    if (child.attributes.cFilialId === "" || child.attributes.cFilialId === "cFilialId") {
        child.attributes.cFilialId = uuidv4();
    }
    return {
        filialRelationshipId: child.attributes.cFilialId,
        childId: child.id,
        treeId: treeId,
        relationType: "Biological",
        parent: treePersonFunction(parent, treeId),
        siblingFilialRelationshipIds:[]
    };

};

const getTreeName = (personData) => {
    if(personData.lastName) {
        return `${personData.lastName} Family Tree`;
    }
    return `${personData.firstName} Family Tree` ;
}

export const startNewTreeWithFocusPerson = (personData) => {
    const treeId = uuidv4();
    const treeName = getTreeName(personData);

    return {
        treeId: treeId,
        treeName: treeName,
        homePerson: {
            treeId: treeId,
            givenName: personData.firstName,
            surname: personData.lastName,
            id: uuidv4(),
            gender: personData.gender,
            birthDate: personData.birthDate,
            birthLocation: personData.birthPlace,
            birthLocationId: personData.birthLocationId || "",
            deathLocationId: '',
            deathDate: personData.death,
            deathLocation: personData.deathPlace,
            isLiving: personData.isLiving
        },
        userId: personData.id
    }

}

export const treePersonFunction = (person, treeId) => {
    return {
        treeId: treeId,
        givenName: person.firstName,
        surname: person.lastName,
        isLiving: person.isLiving,
        id: person.id,
        gender: person.attributes.gender,
        birthDate: person.attributes.birth.RawDate,
        birthLocation: person.attributes.birthPlace,
        deathDate: person.attributes.death.RawDate,
        deathLocation: person.attributes.deathPlace,
        birthLocationId: person.birthLocationId,
        deathLocationId: person.deathLocationId
    };

}

export const gedcomPayload = (FileName, FormFile) => {
    let formData = new FormData();
    formData.append("UserId", getOwner());
    formData.append("TreeId", uuidv4());
    formData.append("FileName", FileName);
    formData.append("FormFile", FormFile);
    return formData;
}

export const imageUploadPayload = (imagePayload) => {
    const { originalImage, profileImage, croppingInfo} = imagePayload;
    let formData = new FormData();
    formData.append("OwnerId", getOwner());
    formData.append("TreeId", imagePayload.treeId);
    formData.append("PersonId", imagePayload.treePersonId);
    formData.append("Size", imagePayload.size);
    formData.append("AuthorCredit", imagePayload.authorCredit);
    formData.append("OriginalImage", originalImage);
    formData.append("ProfileImage", profileImage);
    formData.append("CroppingInfo.CropX", croppingInfo.CropX);
    formData.append("CroppingInfo.CropY", croppingInfo.CropY);
    formData.append("CroppingInfo.Height", croppingInfo.Height);
    formData.append("CroppingInfo.Width", croppingInfo.Width);
    formData.append("CroppingInfo.ZoomAspect", croppingInfo.ZoomAspect);
    return formData;
}

export const heroImageUploadPayload = (imagePayload) => {
    const { originalImage, profileImage, croppingInfo} = imagePayload;
    let formData = new FormData();
    formData.append("TreeId", imagePayload.treeId);
    formData.append("PersonId", imagePayload.treePersonId);
    formData.append("AuthorCredit", imagePayload.authorCredit);
    formData.append("OriginalImage", originalImage);
    formData.append("BackgroundImage", profileImage);
    formData.append("CroppingInfo.CropX", croppingInfo.CropX);
    formData.append("CroppingInfo.CropY", croppingInfo.CropY);
    formData.append("CroppingInfo.Height", croppingInfo.Height);
    formData.append("CroppingInfo.Width", croppingInfo.Width);
    formData.append("CroppingInfo.ZoomAspect", croppingInfo.ZoomAspect);
    return formData;
}

export const heroImageEditPayload = (imagePayload) => {
    const { profileImage, originalImageId, croppingInfo } = imagePayload;
    let formData = new FormData();
    formData.append("OriginatingMediaId", originalImageId )
    formData.append("TreeId", imagePayload.treeId);
    formData.append("PersonId", imagePayload.treePersonId);
    formData.append("AuthorCredit", imagePayload.authorCredit);
    formData.append("BackgroundImage", profileImage);
    formData.append("CroppingInfo.CropX", croppingInfo.CropX);
    formData.append("CroppingInfo.CropY", croppingInfo.CropY);
    formData.append("CroppingInfo.Height", croppingInfo.Height);
    formData.append("CroppingInfo.Width", croppingInfo.Width);
    formData.append("CroppingInfo.ZoomAspect", croppingInfo.ZoomAspect);
    return formData;
}

export const userImageUploadPayload = (imagePayload) => {
    const { originalImage, profileImage, croppingInfo } = imagePayload;
    let formData = new FormData();
    formData.append("OwnerId", getOwner());
    formData.append("AuthorCredit", imagePayload.authorCredit);
    formData.append("OriginalImage", originalImage);
    formData.append("ProfileImage", profileImage);
    formData.append("CroppingInfo.CropX", croppingInfo.CropX);
    formData.append("CroppingInfo.CropY", croppingInfo.CropY);
    formData.append("CroppingInfo.Height", croppingInfo.Height);
    formData.append("CroppingInfo.Width", croppingInfo.Width);
    formData.append("CroppingInfo.ZoomAspect", croppingInfo.ZoomAspect);
    return formData;
}

export const userEditImageUploadPayload = (imagePayload) => {
    const { profileImage, originalImageId, croppingInfo } = imagePayload;
    let formData = new FormData();
    formData.append("OwnerId", getOwner());
    formData.append("OriginatingUserMediaId", originalImageId )
    formData.append("AuthorCredit", imagePayload.authorCredit);
    formData.append("ProfileImage", profileImage);
    formData.append("CroppingInfo.CropX", croppingInfo.CropX);
    formData.append("CroppingInfo.CropY", croppingInfo.CropY);
    formData.append("CroppingInfo.Height", croppingInfo.Height);
    formData.append("CroppingInfo.Width", croppingInfo.Width);
    formData.append("CroppingInfo.ZoomAspect", croppingInfo.ZoomAspect);
    return formData;
}

export const editImageUploadPayload = (imagePayload) => {
    const { originalImageId, profileImage, croppingInfo } = imagePayload;
    let formData = new FormData();
    formData.append("OriginatingUserMediaId", originalImageId);
    formData.append("OwnerId", getOwner());
    formData.append("TreeId", imagePayload.treeId);
    formData.append("PersonId", imagePayload.treePersonId);
    formData.append("AuthorCredit", imagePayload.authorCredit);
    formData.append("ProfileImage", profileImage);
    formData.append("CroppingInfo.CropX", croppingInfo.CropX);
    formData.append("CroppingInfo.CropY", croppingInfo.CropY);
    formData.append("CroppingInfo.Height", croppingInfo.Height);
    formData.append("CroppingInfo.Width", croppingInfo.Width);
    formData.append("CroppingInfo.ZoomAspect", croppingInfo.ZoomAspect);
    return formData;
}

export const assignPayload = (treeId, homePersonId, thisIsMePerson) => {
    return {
        treeId,
        userId: getOwner(),
        homePersonId,
        thisIsMePerson
    }
}

export const createUID = (value) => {
    if (value === BlankId) return uuidv4();
    else return value;
}

export const editPersonPayload = (person, editPerson, treeId) => {
    const { firstName, lastName, isLiving, gender, birth, birthPlace, death, deathPlace, birthLocationId, deathLocationId } = editPerson;
    const editPayload = {
        personId: person.id,
        treeId,
        newGivenName: trimString(firstName),
        newSurname: trimString(lastName),
        newGender: gender,
        newLivingStatus: isLiving.toString(),
        newBirthDate: trimString(birth),
        newBirthLocation: trimString(birthPlace),
        newDeathDate: trimString(death),
        newDeathLocation: trimString(deathPlace),
        newBirthLocationId: birthLocationId || "",
        newDeathLocationId: deathLocationId || ""
    };
    if (firstName === person.firstName) delete editPayload.newGivenName;
    if (lastName === person.lastName) delete editPayload.newSurname;
    if (gender === person.gender) delete editPayload.newGender;
    if (isLiving.toString().toLowerCase() === person.isLiving.toString().toLowerCase()) delete editPayload.newLivingStatus;
    if (birth === person.birth) delete editPayload.newBirthDate;
    if (death === person.death) delete editPayload.newDeathDate;
    if (birthPlace === person.birthPlace) delete editPayload.newBirthLocation;
    if (deathPlace === person.deathPlace) delete editPayload.newDeathLocation;
    if (birthPlace === person.birthPlace) delete editPayload.newBirthLocationId;
    if (deathPlace === person.deathPlace) delete editPayload.newDeathLocationId
    return editPayload;
}

export const getValuesForCheckBoxes = (siblings) => {
     return siblings.reduce((res, ele) => {
        res.push({
            id: ele.id,
            filialRelationshipId: ele.filialRelationshipId,
            firstName: ele.firstName,
            lastName: ele.lastName,
            check: true
        });
        return res;
    }, []);
}

export const getParentPayload = (selectedNode) => {
    return {
        id: selectedNode.id,
        treeId: selectedNode.treeId,
        nodeType : selectedNode.nodeType,
        relationAdded: selectedNode.relationAdded,
        homePersonId: selectedNode.homePersonId,
        generation: selectedNode.generation,
        filialRelationshipId: selectedNode.filialRelationshipId,
        childId: selectedNode.childId,
        selectedName: selectedNode.selectedName,
        firstName: "",
        lastName: "",
        isLiving: "true",
        gender: selectedNode.gender,
        requiredGender: selectedNode.requiredGender,
        birth: "",
        birthPlace: "",
        death: "",
        deathPlace: "",
        siblings: []
    }
}

export const getSiblingPayload = (selectedNode) => {
    return {
        id: selectedNode.id,
        relationAdded: selectedNode.relationAdded,
        nodeType: selectedNode.nodeType,
        treeId: selectedNode.treeId,
        homePersonId: selectedNode.homePersonId,
        generation: selectedNode.generation,
        filialRelationshipId: selectedNode.filialRelationshipId,
        primaryPersonId: selectedNode.primaryPersonId,
        selectedName: selectedNode.selectedName,
        firstName: "",
        lastName: "",
        isLiving: selectedNode.isLiving,
        gender: "",
        birth: "",
        birthPlace: "",
        death: "",
        deathPlace: "",
        pfirstName: '',
        plastName: '',
        parents: [],
    }
}

export const getSiblingDropdown = (parents) => {
    return parents.reduce((res, ele) => {
        let firstElement = ele.Combination[0];
        let secondElement = ele.Combination[1];
        res.push({
            id: firstElement.id,
            gender: firstElement.gender,
            name: trimString(`${titleCase(firstElement.firstName)} ${titleCase(firstElement.lastName)} and ${checkUnknown(secondElement, "SIBLING")}`),
            spouseId: secondElement.id
        })
        return res;
    }, []);
}

export const saveParentPayload = (modalPerson) => {
    const { firstName, lastName, gender, isLiving, birth, birthPlace, death, deathPlace, siblings, birthLocationId, deathLocationId } = modalPerson;
    const siblingFilialRelationshipIds = siblings ? siblings.reduce((res, ele) => {
        if (ele.check) res.push(ele.filialRelationshipId);
        return res;
    }, []) : [];
    return {
        filialRelationshipId: modalPerson.filialRelationshipId,
        childId: modalPerson.childId,
        parent: {
            treeId: modalPerson.treeId,
            id: modalPerson.id,
            givenName: trimString(firstName),
            surname: trimString(lastName),
            gender,
            isLiving,
            birthDate: trimString(birth),
            birthLocation: trimString(birthPlace),
            deathDate: trimString(death),
            deathLocation: trimString(deathPlace),
            birthLocationId,
            deathLocationId
        },
        treeId: modalPerson.treeId,
        relationType: "Biological",
        siblingFilialRelationshipIds
    }
}

const payloadForNewChild = (newPerson, modalPerson) => {
    const { firstName, lastName, gender, isLiving, birth, birthPlace, existingParentIds, id, death, deathPlace, birthLocationId, deathLocationId } = modalPerson;
    const { filialRelationshipId, treeId, primaryPersonId } = newPerson;
    const parentArray = existingParentIds.filter(i => i !== BlankId);
    return {
        filialRelationshipId,
        primaryPersonId,
        existingParentIds: parentArray,
        child: {
            treeId: treeId,
            id,
            givenName: trimString(firstName),
            surname: trimString(lastName),
            gender,
            isLiving,
            birthDate: trimString(birth),
            birthLocation: trimString(birthPlace),
            deathDate: trimString(death),
            deathLocation: trimString(deathPlace),
            birthLocationId,
            deathLocationId
        },
        NewParent: {
            treeId,
            id: createUID(BlankId),
            givenName: trimString(modalPerson.pfirstName),
            surname: trimString(modalPerson.plastName),
            gender: modalPerson.unknownGender,
            isLiving: true,
            birthDate: "",
            birthLocation: ""
        },
        treeId: treeId,
        relationType: "Biological"
    }
}

const payloadForBothParents = (newPerson, modalPerson) => {
    const { firstName, lastName, gender, isLiving, birth, birthPlace, existingParentIds, id, death, deathPlace, birthLocationId, deathLocationId } = modalPerson;
    const { filialRelationshipId, treeId, primaryPersonId } = newPerson;
    const parentArray = existingParentIds.filter(i => i !== BlankId);
    return {
        filialRelationshipId,
        primaryPersonId,
        existingParentIds: parentArray,
        child: {
            treeId: treeId,
            id,
            givenName: trimString(firstName),
            surname: trimString(lastName),
            gender,
            isLiving,
            birthDate: trimString(birth),
            birthLocation: trimString(birthPlace),
            deathDate: trimString(death),
            deathLocation: trimString(deathPlace),
            birthLocationId,
            deathLocationId
        },
        treeId: treeId,
        relationType: "Biological"
    }
}

export const saveSiblingPayload = (newPerson, modalPerson) => {
    const { existingParentIds, pfirstName, plastName } = modalPerson;
    if (existingParentIds.includes(BlankId) && (pfirstName || plastName)) {
        return payloadForNewChild(newPerson, modalPerson);
    }
    else {
        return payloadForBothParents(newPerson, modalPerson);
    }
}

const getOptions = (selectedNode, spousesList) => {
    let result = [];
    result = spousesList.reduce((res, ele) => {
      res.push({
        id: selectedNode.treePersonId,
        name: trimString(`${titleCase(selectedNode.firstName)} ${titleCase(selectedNode.lastName)} and ${titleCase(ele.firstName)} ${titleCase(ele.lastName)}`),
        spouseId: ele.id,
      })
      return res;
    }, []);
    result.push({
    	id: selectedNode.treePersonId,
        name: trimString(`${titleCase(selectedNode.firstName)} ${titleCase(selectedNode.lastName)} and ${checkUnknown(selectedNode, "CHILD")}`),
        spouseId : BlankId
    })
    return result;
}

//addChild set-modal-data
export const getChildPayload = (selectedNode) =>{
return {
    id: selectedNode.id,
    treeId: selectedNode.treeId,
    nodeType: selectedNode.nodeType,
    relationAdded: selectedNode.relationAdded,
    homePersonId: selectedNode.homePersonId,
    generation: selectedNode.generation,
    filialRelationshipId: selectedNode.filialRelationshipId,
    childId: selectedNode.childId,
    selectedName: selectedNode.selectedName,
    nodeGender: selectedNode.nodeGender,
    firstName: "",
    lastName: "",
    isLiving: selectedNode.isLiving,
    gender: "",
    requiredGender: selectedNode.requiredGender,
    birth: "",
    birthPlace: "",
    death: "",
    deathPlace: "",
    pfirstName: "",
    plastName: "",
    primaryPersonId:selectedNode.primaryPersonId,
    spouses: []
}
}
export const getParentAndSpousesPayload=(selectedNode, spousesList)=>{
   const options = getOptions(selectedNode, spousesList)
    return {
        id: selectedNode.id,
        treeId: selectedNode.treeId,
        filialRelationshipId: selectedNode.filialRelationshipId,
        childId: selectedNode.childId,
        selectedName: selectedNode.selectedName,
        nodeGender: selectedNode.nodeGender,
        firstName: "",
        lastName: "",
        isLiving: selectedNode.isLiving,
        gender: "",
        requiredGender: selectedNode.requiredGender,
        birth: "",
        birthPlace: "",
        death: "",
        deathPlace: "",
        pfirstName: "",
        plastName: "",
        primaryPersonId:selectedNode.primaryPersonId,
        spouses: options
    }
}

export const childWithBothParent=(newPerson,modalPerson)=>{
    const { firstName, lastName, gender, isLiving, birth, birthPlace, existingParentIds, id } = modalPerson;
    const { filialRelationshipId, treeId, primaryPersonId } = newPerson;
    const spouseArray= existingParentIds.filter(i => i !== BlankId);
    return {
        filialRelationshipId,
        primaryPersonId,
        existingParentIds: spouseArray,
        child: {
            treeId: treeId,
            id,
            givenName: trimString(firstName),
            surname: trimString(lastName),
            gender,
            isLiving,
            birthDate: trimString(birth),
            birthPlace:trimString(birthPlace),
        },

        treeId: treeId,
        relationType: "Biological"
    }
}
//addSpouse set-modal-data
export const getSpousePayload = (selectedNode) => {
    return {
        id: selectedNode.id,
        treeId: selectedNode.treeId,
        nodeType: selectedNode.nodeType,
        spousesLength: selectedNode.spousesLength,
        relationAdded: selectedNode.relationAdded,
        treePersonId: selectedNode.treePersonId,
        homePersonId: selectedNode.homePersonId,
        generation: selectedNode.generation,
        directChildren: selectedNode.directChildren,
        filialRelationshipId: selectedNode.filialRelationshipId,
        spousalRelationshipId: selectedNode.spousalRelationshipId,
        selectedName: selectedNode.selectedName,
        firstName: "",
        lastName: "",
        isLiving: selectedNode.isLiving.toString(),
        gender: selectedNode.gender,
        requiredGender: selectedNode.requiredGender,
        birth: "",
        birthPlace: "",
        death: "",
        deathPlace: "",
        children: []
    }
}

export const getSpouseAndChildrenPayload = (selectedNode, children) => {
    const myChildren = getValuesForCheckBoxes(children);
    return {
        id: selectedNode.id,
        treeId: selectedNode.treeId,
        treePersonId: selectedNode.treePersonId,
        filialRelationshipId: selectedNode.filialRelationshipId,
        spousalRelationshipId: selectedNode.spousalRelationshipId,
        selectedName: selectedNode.selectedName,
        firstName: "",
        lastName: "",
        isLiving: selectedNode.isLiving.toString(),
        gender: selectedNode.gender,
        requiredGender: selectedNode.requiredGender,
        birth: "",
        birthPlace: "",
        death: "",
        deathPlace: "",
        children: myChildren
    }
}

export const saveSpousePayload = (newPerson, modalPerson) => {
    const { firstName, lastName, gender, isLiving, birth, birthPlace, death, deathPlace, birthLocationId,
        deathLocationId } = modalPerson;
    const childFilialRelationshipIds = modalPerson.children.reduce((res, ele) => {
        if(ele.check) res.push(ele.filialRelationshipId);
        return res;
    }, []);
    return {
        spousalRelationshipId: newPerson.spousalRelationshipId,
        primaryPersonId: newPerson.treePersonId,
        spouse: {
            treeId: newPerson.treeId,
            id: newPerson.id,
            givenName: trimString(firstName),
            surname: trimString(lastName),
            gender,
            isLiving,
            birthDate: trimString(birth),
            birthLocation: trimString(birthPlace),
            deathDate: trimString(death),
            deathLocation:trimString(deathPlace),
            birthLocationId,
            deathLocationId
        },
        treeId: newPerson.treeId,
        childFilialRelationshipIds
    }
}