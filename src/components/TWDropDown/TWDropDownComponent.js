import React, { useState, useEffect, useMemo } from "react";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import PropTypes from "prop-types";
import { tr } from "./../../components/utils";
import { useTranslation } from "react-i18next";
import className from "classnames";
const keyDownHandler = (anchorEl, setAnchorEl, event) => {
    if( anchorEl && event.key === 'Tab') {
        setAnchorEl(false);
    }
}
const TWDropDownComponent = ({field, form, options={}, ...props}) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const { t } = useTranslation();
  const getDisabledOptions = useMemo(() => props.getdisabledoptions || [], [props.getDisabledOptions]);
  useEffect(()=>{
    document.addEventListener("keydown", keyDownHandler.bind(null, anchorEl, setAnchorEl));
    return () => document.removeEventListener("keydown", keyDownHandler);
  }, [anchorEl, setAnchorEl])
  useEffect(()=>{
     if (getDisabledOptions.includes(field.value)) {
        form.setFieldValue(field.name, props.defaultValue || "");
     }
  }, [getDisabledOptions, field.value, props.defaultValue, form, field.name])
  const handlePopoverOpen = (event) => {
    setAnchorEl(!anchorEl);
  };
  const handleClickAway = () => {
    setAnchorEl(false);
  }
  const handleDropDownChange = (e) => {
    form.handleChange(e);
    props.onChange && props.onChange(e)
    setAnchorEl(false);
  }
  const getValue = () => {
    const inteValue = field.value;
    if( inteValue && options && options[inteValue] ) {
        return tr(t, options[inteValue]?options[inteValue]:inteValue);
    } else if(props.isloading) {
        return tr(t, "search.ww1.dropdown.loading");
    } else {
        return tr(t, "search.ww1.dropdown.select");
    }
  }
  const open = Boolean(anchorEl);
  return <ClickAwayListener onClickAway={handleClickAway}>
        <div className="option-dd relative" 
            onKeyDown={(event)=> {
                event.key === 'ArrowDown' && !anchorEl && handlePopoverOpen()}
            }>
            <div className="relative inline-block text-left">
                <div onClick={handlePopoverOpen}>
                    <button type="button" className="inline-flex justify-center w-full rounded-sm py-0 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-400 whitespace-nowrap" id="menu-button" aria-expanded="true" aria-haspopup="true">
                        {getValue()}
                        <svg className="-mr-1 ml-1 h-4 w-4 mt-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                {open && <div className={`origin-top-right z-50 absolute right-0 mt-2 px-4 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`} role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-3" role="none">
                        {Object.entries(options).map((option, index) => {
                            const disabledBool = getDisabledOptions.includes(option[0]);
                            return <div className={className({
                                "flex items-center": true
                                })} key={index}>
                                <input 
                                    {...field} 
                                    {...props}
                                    value = {option[0]}
                                    id = {`${field.name}_${option[0]}`}  
                                    type = "radio"
                                    disabled = {disabledBool}
                                    checked = {option[0] === field.value}
                                    onChange= {handleDropDownChange}
                                    className = "form-radio focus:ring-blue-400 h-4 w-4 text-blue-400 border-gray-300" />
                                    <label htmlFor={`${field.name}_${option[0]}`} className={className({
                                        "ml-2 block text-sm font-medium py-1 whitespace-nowrap": true,
                                        "text-gray-700": !disabledBool,
                                        "text-gray-300 select-none": disabledBool
                                    })}>
                                    {tr(t, option[1])}
                                </label>
                            </div>
                        })}
                    </div>
                </div>
                }
            </div>
      </div>
    </ClickAwayListener>
}
TWDropDownComponent.propTypes = {
    field: PropTypes.object,
    form: PropTypes.object,
    isloading: PropTypes.bool
  };
export default TWDropDownComponent;