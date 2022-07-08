import React from 'react';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import {titleCase} from "../utils/titlecase"
import {showBirthandDeath} from "shared-logics"

const getDateString = (option) => {
    let birth = ""
    let death =""
    if(option.birth){
        birth = new Date(option.birth);
        birth = birth.getFullYear()
        if (isNaN(birth))
            birth = ""
    } 
    if(option.death){
        death = new Date(option.death);
        death = death.getFullYear();
        if (isNaN(death))
            death = ""
    }
    return showBirthandDeath(birth,death,false)
} 

const ComboOptions = ({ option, inputValue }) => {
    const Name = `${titleCase(option.name)}`;
    const matches = match(Name, inputValue);
    const parts = parse(Name, matches);
    const date = getDateString(option);

    return (
        <>
            <div className="flex items-center w-full">
                <div>
                {
                    parts.map((part, index) => (
                        <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>{part.text}</span>
                    ))
                }
                </div>

                <span className='text-sm text-gray-500 ml-auto whitespace-nowrap pl-4'>{date}</span>
            </div>
        </>
    )
}

export default ComboOptions;