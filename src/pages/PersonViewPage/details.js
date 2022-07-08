import React from "react";

// Components
import Typography from "../../components/Typography";
import IconMenu from "../../components/IconMenu";
import { tableTypes } from "../../components/utils";

// Local Components
import PersonalInfo from "./personalInfo";
import Events from "./events";
import SpousesAndChildren from "./spousesAndChildren";
import ParentsAndSiblings from "./parentsAndSiblings";
import LifeEvents from "./lifeEvents";

// Menus
import { personalInfoMenu, familyMenu, lifeEventsMenu, nonSelectableMenu } from "./menus";

const { PERSONAL_INFO, EVENTS, SPOUSES_AND_CHILDREN, PARENTS_AND_SIBLINGS, LIFE_EVENTS } = tableTypes;

const Details = (props) => {

    const {
        primaryPersonId,
        person,
        hideParent,
        handleMenu,
        handleUpdate
    } = props;

    const getFamilyMenu = () => {
        if (Object.keys(person.relatedParentIds).length === 0) return familyMenu.filter(e => e.id !== 9 ? true : false);
        else if (hideParent) return familyMenu.filter(e => e.id !== 7 ? true : false)
        else return familyMenu;
    }

    return (
        <>
            {/* ------------------------------PersonalInfo & Events--------------------------------------- */}
            <div className="flex mt-4 mb-4">
                <span>
                    <Typography
                        size={24}
                        text="secondary"
                        weight="medium"
                        tkey="person.heading.personalinfo"
                    >
                    </Typography>
                </span>
                <span className="ml-4">
                    <IconMenu
                        type="plus"
                        background
                        menu={personalInfoMenu}
                        handleMenu={handleMenu}
                    />
                </span>
            </div>

            <PersonalInfo
                type={PERSONAL_INFO}
                personalInfo={person.personalInfo}
                handleUpdate={handleUpdate}
                person={person}
                {...props}
            />

            <div className="mt-8">
                <Events
                    type={EVENTS}
                    events={person.events}
                    handleUpdate={handleUpdate}
                    person={person}
                    {...props}
                />
            </div>

            {/* ------------------------------- Family Spouses&Children & Parents&Siblings --------------------- */}
            <div className="flex mt-8 mb-4">
                <span>
                    <Typography
                        size={24}
                        text="secondary"
                        weight="medium"
                        tkey="person.heading.family"
                    >
                    </Typography>
                </span>
                <span className="ml-4">
                    <IconMenu
                        type="plus"
                        background
                        menu={getFamilyMenu()}
                        handleMenu={handleMenu}
                    />
                </span>
            </div>

            <SpousesAndChildren
                type={SPOUSES_AND_CHILDREN}
                spousesAndChildren={person.spousesAndChildren}
                handleUpdate={handleUpdate}
                person={person}
                {...props}
            />

            <div className="mt-8">
                <ParentsAndSiblings
                    type={PARENTS_AND_SIBLINGS}
                    parentsAndSiblings={person.parentsAndSiblings}
                    personId={primaryPersonId}
                    handleUpdate={handleUpdate}
                    person={person}
                    {...props}
                />
            </div>

            {/* ----------------------------------------- Places Lived --------------------------------------------- */}
            <div className="flex mt-8 mb-4">
                <span>
                    <Typography
                        size={24}
                        text="secondary"
                        weight="medium"
                        tkey="person.heading.lifeEvents"
                    >
                    </Typography>
                </span>
                <span className="ml-4">
                    <IconMenu
                        type="plus"
                        background
                        menu={lifeEventsMenu}
                        handleMenu={handleMenu}
                        searchable={true}
                        tableMenu={person.lifeEvents}
                        nonSelectableMenu={nonSelectableMenu}
                    />
                </span>
            </div>

            <div className="pb-12 min-w-274.5">
                <LifeEvents
                    type={LIFE_EVENTS}
                    lifeEvents={person.lifeEvents}
                    handleUpdate={handleUpdate}
                    person={person}
                    {...props}
                />
            </div>
        </>
    )
};

export default Details;