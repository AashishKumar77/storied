import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { titleCase } from "../utils/titlecase"
import { showBirthandDeath } from "shared-logics"

const TreePersonOptions = ({ option, inputValue }) => {
    const Name = `${titleCase(option.name)}`;
    const matches = match(Name, inputValue);
    const parts = parse(Name, matches);
    const date = showBirthandDeath(option.birthDate.year, option.deathDate.year, option.isLiving)

    return (
        <div className="tree-person-option">
            <div className="tree-person-name">
                {
                    parts.map((part, index) => (
                        <span key={index} className={`${part.highlight ? 'typo-font-bold' : 'typo-font-regular'} text-sm text-black`}>{part.text}</span>
                    ))
                }
            </div>
            <div className='lifespan'>
                {date}
            </div>
        </div>
    )
}

export default TreePersonOptions;