import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';

const getLifeEvents = (lifeEvents, type) => {
    return lifeEvents && lifeEvents.reduce((res, ele) => {
        res.push({
            tableType: type,
            id: ele.id,
            age: ele.age,
            type: ele.type,
            location: ele.location.Location,
            locationId: ele.location.LocationId || '',
            date: ele.date.Date.RawDate,
            description: ele.description,
            newRow: ele.newRow
        });
        return res;
    },[]);
}

const LifeEvents = (props) => {

    const {
        type, 
        lifeEvents, 
        handleUpdate,
        person
    } = props;

    const { t } = useTranslation();
    
    return (
        <Table
            id="lifeEvents"
            type={type}
            columns={[tr(t,"person.table.placelived.age"), tr(t,"person.table.placelived.type"), tr(t,"person.table.placelived.date"), tr(t,"person.table.placelived.location"), tr(t,"person.table.placelived.desc")]}
            keys={["age", "type", "date", "location", "description"]}
            data={getLifeEvents(lifeEvents, type) || []}
            handleUpdate={handleUpdate}
            loading={person.lifeEventsLoading}
            person={person}
            {...props}
        />
    )
}

export default LifeEvents;