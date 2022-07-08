import React from "react";

// Components
import Table from "../../components/Table";
import { useTranslation } from 'react-i18next';
import { tr } from '../../components/utils';

const getEvents = (events, type) => {
    return events && events.reduce((res, ele) => {
        res.push({
            tableType: type,
            id: ele.id,
            name: ele.name,
            age: ele.age,
            date: ele.date.Date.RawDate,
            location: ele.location.Location,
            locationId: ele.location.LocationId || "",
            relationships: ele.relationships ? ele.relationships.map(e => e.lastName ? ` ${e.firstName} ${e.lastName}`: ` ${e.firstName}`) : ""
        });
        return res;
    },[]);
}

const Events = (props) => {

    const {
        type, 
        events, 
        handleUpdate,
        person
    } = props;

    const { t } = useTranslation();

    return (
        <Table
            id="events"
            type={type}
            columns={[tr(t,"person.table.events.events"), tr(t,"person.table.events.age"), tr(t,"person.table.events.date"), tr(t,"person.table.events.location"), tr(t,"person.table.events.relationship")]}
            keys={["name", "age", "date", "location", "relationships"]}
            data={getEvents(events, type) || []}
            handleUpdate={handleUpdate}
            loading={person.eventsLoading}
            person={person}
            {...props}
        />
    )
}

export default Events;