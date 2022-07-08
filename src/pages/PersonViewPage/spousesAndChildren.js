import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';
import { checkUnknown, checkFamilyGroup } from "../../utils";

const getSpousesAndChildren = (spousesAndChildren, type) => {
    const res = [];
    if(spousesAndChildren){
        spousesAndChildren.forEach((spandch, index)=>{
            res.push({
                tableType: type,
                id: spandch.id,
                firstName: spandch.firstName.GivenName,
                lastName: spandch.lastName.Surname,
                name: checkUnknown(spandch, "FAMILY"),
                gender: spandch.gender.Gender,
                imgsrc: spandch.imgsrc,
                birth: spandch.birth.Date,
                birthLocation: spandch.birthLocation.Location,
                death: spandch.death.Date,
                deathLocation: spandch.deathLocation.Location,
                marriage: spandch.marriage.Date,
                spouse: spandch.spouse.length > 0 ? `${spandch.spouse[0].firstName} ${spandch.spouse[0].lastName}` : "",
                isFamily: checkFamilyGroup(index)
            })
            if(spandch.children && spandch.children.length > 0){
                spandch.children.forEach((children) =>{
                    res.push({
                        tableType: type,
                        id: children.id,
                        firstName: children.firstName.GivenName,
                        lastName: children.lastName.Surname,
                        name: `${checkUnknown(children, "FAMILY")}-CHILDREN`,
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
                });
            }
        })
    }
    return res;
}

const SpousesAndChildren = (props) => {
    
    const {
        type, 
        spousesAndChildren, 
        handleUpdate,
        person
    } = props;

    const { t } = useTranslation();

    return (
        <Table
            id="family"
            type={type}
            columns={[tr(t,"person.table.spousechildren.spouseandchildren"), tr(t,"person.table.spousechildren.gender"), tr(t,"person.table.spousechildren.birth"), tr(t,"person.table.spousechildren.bl"), tr(t,"person.table.spousechildren.death"), tr(t,"person.table.spousechildren.dl"), tr(t,"person.table.spousechildren.marriage"), tr(t,"person.table.spousechildren.spouse")]}
            keys={["name", "gender", "birth", "birthLocation", "death", "deathLocation", "marriage", "spouse"]}
            data={getSpousesAndChildren(spousesAndChildren, type) || []}
            image={true}
            handleUpdate={handleUpdate}
            loading={person.spousesLoading}
            person={person}
            {...props}
        />
    )
}

export default SpousesAndChildren;