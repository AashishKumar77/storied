import React, {useRef, useEffect, useState} from "react";
import PropTypes from "prop-types";
import "./index.css";

// Components
import Typography from "../Typography";
import Icon from "../Icon"
import { useTranslation } from 'react-i18next';
import {tr} from "../utils"
import {titleCase} from "../utils/titlecase"
    
const Input = ({ id, label, type, placeholder, name, value, disabled, error, hideTitleCase, errorMessage, autoFocus, handleChange, handleBlur, nodeError, position }) => {
    const inputRef = useRef(null);
    const [startpos, setStartpos] = useState(position)
    
    useEffect(() =>{
        inputRef.current.selectionStart = startpos
        inputRef.current.selectionEnd = startpos
    },[value])

    const handleTitleCase = (e) => {
        setStartpos(e.target.selectionStart);
        let event;
        let str = e.target.value
        if (hideTitleCase) {
            event = {
                target: {
                    name: e.target.name,
                    value: str
                }
            }
            handleChange(event)
        }
        else {
            let updatedstr = titleCase(str)
            event = {
                target: {
                    name: e.target.name,
                    value: updatedstr
                }
            }
            handleChange(event)
        }
    }

    const inputDisable = disabled ? "input-disabled cursor-check" : "";

    const inputError = error ? "input-error" : "";

    const inputAutoFocus = autoFocus ? "input-text:focus" : "";

    const nodeFormError = nodeError ? "nodeform-error": "";

    const { t } = useTranslation();

    return (
        <>
            <div className="mb-1 truncate">
                <Typography
                    size={14}
                    text="default"
                >
                {label && tr(t,label)}
                </Typography>
            </div>
            <input
                ref={inputRef} 
                id={id}
                type={type}
                placeholder={titleCase(tr(t,placeholder))}
                name={name}
                value={ hideTitleCase ? value : titleCase(value)}
                autoFocus={autoFocus}
                className={`input-text ${inputDisable} ${inputError} ${inputAutoFocus} ${nodeFormError}`}
                onChange={handleTitleCase}
                onCut={handleTitleCase}
                onCopy={handleTitleCase}
                onPaste={handleTitleCase}
                onBlur={handleBlur}
                autoComplete="off"
            />
            {nodeError && <Icon type="errorImg" size="medium"/>}
            {error && <div className="error-message">{errorMessage}</div>}
        </>
    )
}

Input.propTypes = {
    id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    type: PropTypes.oneOf(["text","number"]),
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    disabled: PropTypes.bool,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
    autoFocus: PropTypes.bool,
    handleChange: PropTypes.func,
    handleBlur: PropTypes.func,
};

Input.defaultProps = {
    id: "id",
    type: "text",
    placeholder: "Placeholder",
    name: "name",
    value: "value",
    disabled: false,
    error: false,
    errorMessage: "errorMessage",
    autoFocus: false,
    handleChange: undefined,
    handleBlur: undefined
}

export default Input;