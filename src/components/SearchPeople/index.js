import React from 'react';
import Typeahead from '../Typeahead';
import { getDateString } from '../utils';
import { getOptions } from 'shared-logics';

const SearchPeople = ({field, form, getOptionDisabled=[], ...props}) => {
    const handleChange = (val) => {
        if(props.freeSolo || val?.id) {
            form.setFieldValue(`${field.name}`, val)
        }
        props.selectPeople && props.selectPeople(val)
    }
    const value = field.value || null
    return (
        <div className="flex mt-0 w-full">
            <Typeahead
                id={props.id}
                {...props}
                getOptionDisabled = {getOptionDisabled}
                options={getOptions(value, props.options)}
                value = {value?.name?value:null}
                handleChange ={handleChange}
                placeholder = {props.placeholder?props.placeholder:"Search Person"}
                disabled={props.disabled}
                highlight = {!props.renderOption}
                extraRender = {getDateString}
                open={props.open}
                type={props.type}
                
            />
        </div>
    );
}



export default SearchPeople;