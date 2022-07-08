import React from "react";

// Components 
import Icon from "../Icon";
import Typography from "../Typography";
import Translator from "../Translator";
import {titleCase} from "../utils/titlecase"
export const CardMenu = ({ type, content, firstName,firstNameWithInitials,lastName, handleMenu, focusMenu }) => {
    return (
        <div id="nodeForm" className="form-main-large card-menu">
            {content}
            <div className="card-option" onClick={() => handleMenu(0)}>
                <Icon
                    type="user-single"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        size={14}
                    >
                        <Translator tkey="pedigree.actions.view"/> {titleCase(firstNameWithInitials) || titleCase(lastName) }
                    </Typography>
                </div>
            </div>

            {
                focusMenu
                &&
                <div className="card-option" onClick={() => handleMenu(1)}>
                    <Icon
                        type="dashboard"
                    />
                    <div className="card-option-title">
                        <Typography
                            text="secondary"
                            weight="medium"
                            size={14}
                            tkey="pedigree.actions.makefocus"
                        >                           
                        </Typography>
                    </div>
                </div>
            }

            <div className="card-option" onClick={() => handleMenu(2)}>
                <Icon
                    type="edit"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        size={14}
                        tkey="pedigree.actions.qedit"
                    >                       
                    </Typography>
                </div>
            </div>

            <div className="card-option" onClick={() => handleMenu(3)}>
                <Icon
                    type="add-circle"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        size={14}
                        tkey="pedigree.actions.add.family"
                    >                       
                    </Typography>
                </div>
            </div>
        </div>
    )
}

export const CardSubMenu = ({ type, content, handleMenu, hideAddParent, hideAddSibling }) => {
    return (
        <div id="nodeForm" className="form-main-large card-menu">
            {content}
            <div className="card-option" onClick={() => handleMenu(4)}>
                <Icon
                    type="add-circle"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        tkey="pedigree.actions.add.spouse"
                        size={14}
                    >                      
                    </Typography>
                </div>
            </div>

            <div className="card-option" onClick={() => handleMenu(5)}>
                <Icon
                    type="add-circle"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        tkey="pedigree.actions.add.child"
                        size={14}
                    >                   
                    </Typography>
                </div>
            </div>

            {!hideAddParent  && <div className="card-option" onClick={() => handleMenu(6)}>
                <Icon
                    type="add-circle"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        tkey="pedigree.actions.add.parent"
                        size={14}
                    >                      
                    </Typography>
                </div>
            </div>}

            {hideAddSibling  && <div className="card-option" onClick={() => handleMenu(7)}>
                <Icon
                    type="add-circle"
                />
                <div className="card-option-title">
                    <Typography
                        text="secondary"
                        weight="medium"
                        tkey="pedigree.actions.add.sibling"
                        size={14}
                    >                       
                    </Typography>
                </div>
            </div>}
        </div>
    )
}