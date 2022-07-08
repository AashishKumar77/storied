import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';
import { checkUnknown, checkFamilyGroup } from "../../utils"

const getparentsAndSiblings = (arrayOfParentsAndSiblings, personId, type) => {
    const res = [];
    arrayOfParentsAndSiblings && arrayOfParentsAndSiblings.map((parentsAndSiblings,index) => {
        if (parentsAndSiblings.Parents) {
            parentsAndSiblings.Parents.forEach((parent)=>{
                res.push({
                    tableType: type,
                    id: parent.id,
                    firstName: parent.firstName.GivenName,
                    lastName: parent.lastName.Surname,
                    name: checkUnknown(parent, "FAMILY"),
                    gender: parent.gender.Gender,
                    imgsrc: parent.imgsrc,
                    birth: parent.birth.Date,
                    birthLocation: parent.birthLocation.Location,
                    death: parent.death.Date,
                    deathLocation: parent.deathLocation.Location,
                    marriage: parent.marriage.Date,
                    spouse: parent.spouse.length > 0 ? `${parent.spouse[0].firstName} ${parent.spouse[0].lastName}` : "",
                    isFamily: checkFamilyGroup(index)
                })
            })
        }
        if (parentsAndSiblings.children) {
            parentsAndSiblings.children.forEach((children) =>{
                res.push({    
                    tableType: type,
                    id: children.id,
                    firstName: children.firstName.GivenName,
                    lastName: children.lastName.Surname,
                    name: `${checkUnknown(children, "FAMILY")}-CHILDREN${ personId === children.id ? "-ISFOCUS":""}`,
                    gender: children.gender.Gender,
                    imgsrc:children.imgsrc,           
                    birth: children.birth.Date,
                    birthLocation: children.birthLocation.Location,
                    death: children.death.Date,
                    deathLocation: children.deathLocation.Location,
                    marriage: children.marriage.Date,
                    spouse: children.spouse.length > 0 ? `${children.spouse[0].firstName} ${children.spouse[0].lastName}` : "",
                    isFamily: checkFamilyGroup(index)
                })
            })
        }
        return res;
    }) 
    return res;
}

const ParentsAndSiblings = (props) => { 

    const {
        type, 
        parentsAndSiblings, 
        personId, 
        handleUpdate,
        person
    } = props;

    const { t } = useTranslation();

    return (
        <Table
            id={"family"}
            type={type}
            columns={[tr(t,"person.table.parentsibling.parentandsibling"), tr(t,"person.table.parentsibling.gender"), tr(t,"person.table.parentsibling.birth"), tr(t,"person.table.parentsibling.bl"), tr(t,"person.table.parentsibling.death"), tr(t,"person.table.parentsibling.dl"), tr(t,"person.table.parentsibling.marriage"), tr(t,"person.table.parentsibling.spouse")]}
            keys={["name", "gender", "birth", "birthLocation", "death", "deathLocation", "marriage", "spouse"]}
            data={getparentsAndSiblings(parentsAndSiblings, personId, type) || []}
            image={true}
            handleUpdate={handleUpdate}
            loading={person.parentsLoading}
            person={person}
            {...props}
        />
    )
}

export default ParentsAndSiblings;