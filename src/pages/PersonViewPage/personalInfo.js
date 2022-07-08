import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';

const getPersonalInfo = (perInfo, type) => {
    let myArr = [];
    myArr.push({
        tableType: type,
        id: perInfo.id,
        givenName: perInfo.givenName.givenName,
        surname: perInfo.surname.surname,
        gender: perInfo.gender.gender
    });
    return myArr;
}

const PersonalInfo = (props) => {

    const {
        type, 
        personalInfo, 
        handleUpdate,
        person
    } = props;
    
    const { t } = useTranslation();

    return (
        <Table
            id="personInfo"
            type={type}
            columns={[tr(t,"f&mName"), tr(t,"LastName"), tr(t,"person.table.personalinfo.gender")]}
            keys={["givenName", "surname", "gender"]}
            data={getPersonalInfo(personalInfo, type) || []}
            handleUpdate={handleUpdate}
            loading={person.personalInfoLoading}
            person={person}
            {...props}
        />
    )
};

export default PersonalInfo;