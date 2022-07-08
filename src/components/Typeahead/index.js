import React, { useRef, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

const useStyles = makeStyles({
    inputRoot: {
        width: props => props.width,
        fontSize: props => props.fontSize,
        height: props => props.height,
        borderRadius: props => props.borderRadius,
        padding: "2px 0px !important",        
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: '1px solid #ccc'
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1",
            borderWidth: 2
        }
    },
    input: {
        padding: "0 1rem !important",
        height: "100%"
    },
    endAdornment: {
        display: props => {
            if (props.closeIconDisable) {
                return "none"
            }
        }
    },
    root: {
        width: '100%',
    },
    popper: {
        width: 0,
        position: 'absolute',
        top: 0,
        marginTop: props => props.popoverMt,
    },
    //Styling for drawer autocomplete component
    inputRoot1: {
        width: "100%",
        height: 32,
        borderRadius: 8,
        padding: "2px 0px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #ccc",
        },
    },
    input1: {
        padding: "0 0 0 2rem !important",
        textTransform: "capitalize",
        height: "100%"
    },
    endAdornment1: {
        display: "none",
    },
    paper1: {
        boxShadow: "none",
        overflow: "visible"
    },
    listbox1: {
        overflowY: "overlay !important",
        maxHeight: "100% !important",
        "&.MuiAutocomplete-listbox": {
            padding: "0 0"
        }
    },
    popper1: {
        position: 'static',
    },
    //styling for combobox autocomplete component
    inputRoot2: {
        height: 40,
        borderRadius: 8,
        padding: "2px 0px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#295DA1",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #ccc",
        },
    },
    input2: {
        padding: "0 1rem !important",
        textTransform: "capitalize",
        height: "100%"
    },
    endAdornment2: {
        display: "none"
    },
    root2: {
        width: '100%',
    },
    paper2: {
        marginTop: "40px"
    }
});
const loadNextPageDataFn = (event, loadNextPage, loadNext, page) => {
    const listboxNode = event.currentTarget;
    if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
        page.current = page.current + 1;
        loadNextPage ? loadNextPage(page.current) : loadNext(page.current)
    }
}
const getRender = (props) => {
    if (!props.highlight && props.renderOption) {
        return { renderOption: props.renderOption }
    } else {
        return {}
    }
}
const renderOptionPropFn = (highlight, renderOption, extraRender, value, getOptionDisabled) => {
    let customprops = {};
    if (highlight) {
        customprops['renderOption'] = renderOption ? renderOption : (option) => {
            const matches = match(option.name, value);
            const parts = parse(option.name, matches);
            return <React.Fragment>
                <div className="flex items-center w-full">
                    <div>
                        {parts.map((part, index) => (
                            <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                                {part.text}
                            </span>
                        ))}
                    </div>
                    {extraRender && <span className='text-sm text-gray-500 ml-auto whitespace-nowrap pl-4'>
                        {extraRender(option)}
                    </span>}
                </div>
            </React.Fragment>
        }
    }
    if (getOptionDisabled) {
        customprops['getOptionDisabled'] = (option) => getOptionDisabled.findIndex(_dis => option.id === _dis.id) !== -1
    }
    return customprops
}
const valEmptySet = (val, handleChange, page) => {
    if (val === "") {
        handleChange({ id: "", name: "" }, page.current)
    }
}

const Typeahead = ({ options, optionLoading, pagination, value, placeholder, handleChange, freeSolo, getOptionDisabled, ...props }) => {
    const classes = useStyles({ ...props, value: value });
    let page = useRef(1);
    let currentTxt = useRef("");
    const loadNextPageData = (event) => {
        loadNextPageDataFn(event, props.loadNextPage, loadNext, page)
    }
    const loadNext = (currentPage) => {
        handleChange(value, currentPage)
    }
    const handleChangeField = (e, val) => {
        if (val?.id) {
            page.current = 1
            handleChange(val, page.current)
        }
        if (val?.personId) {
            props.handleSelect(e, val);
        }
    }
    const handleInputChange = (e, val, reason) => {
        if (reason !== 'reset') {
            page.current = 1
            currentTxt.current = val;
            props.callbackApi && props.callbackApi(val)
            valEmptySet(val, handleChange, page)
            freeSolo && handleChange({ id: "", name: val }, page.current)
        }
    }
    const getClasses = (type) => {
        switch (type) {
            case "drawer":
                return {
                    inputRoot: classes.inputRoot1,
                    input: classes.input1,
                    endAdornment: classes.endAdornment1,
                    paper: classes.paper1,
                    listbox: classes.listbox1,
                    popper: classes.popper1
                }
            case "combobox":
                return {
                    inputRoot: classes.inputRoot2,
                    paper: classes.paper2,
                    input: classes.input2,
                    endAdornment: classes.endAdornment2,
                    root: classes.root2
                }
            case "story":
            default:
                return {
                    inputRoot: classes.inputRoot,
                    input: classes.input,
                    endAdornment: classes.endAdornment,
                    root: classes.root,
                    popper: classes.popper
                }
        }
    }
    const renderOptionProp = useMemo(() => {
        return renderOptionPropFn(
            props.highlight,
            props.renderOption,
            props.extraRender,
            currentTxt.current,
            getOptionDisabled);
    }, [
        props.highlight,
        props.renderOption,
        props.extraRender,
        currentTxt.current,
        getOptionDisabled
    ])
    return (
        <div className={`${props.mainClass}`}>
            <Autocomplete
                id={props.id}
                options={options}
                {...getRender(props)}
                {...pagination ? {
                    ListboxProps: {
                        onScroll: (event) => {
                            loadNextPageData(event)
                        }
                    }
                } : {}}
                autoHighlight={props.autoHighlight}
                open={props.open}
                autoSelect={props.autoSelect}
                freeSolo={freeSolo}
                getOptionLabel={(option) => {
                    return props.getOptionLabel ? props.getOptionLabel(option) : option.name || ""
                }}
                getOptionSelected={(option, _value) => {
                    return props.getOptionSelected ? props.getOptionSelected(option, _value) : option.name === _value.name
                }}
                {...renderOptionProp}
                style={{ width: "100%" }}
                value={value}
                disabled={props.disabled}
                renderInput={props.renderInput ? props.renderInput : (params) => <TextField {...params} autoFocus={props.autoFocus} placeholder={placeholder} variant="outlined" />}
                onChange={handleChangeField}
                disablePortal={true}
                onInputChange={handleInputChange}
                loading={optionLoading}
                classes={getClasses(props.type)}
            />
        </div>
    );
}

Typeahead.defaultProps = {
    freeSolo: true,
    pagination: false,
    options: [],
    optionLoading: false,
    value: null,
    placeholder: '',
    width: '100%',
    height: 40,
    borderRadius: 8,
    popoverMt: 36,
    highlight: false,
    autoHighlight: false,
    autoSelect: false,
    disabled: false,
    closeIconDisable: true,
    getOptionDisabled: [],
    autoFocus: false,
    mainClass: 'flex mt-0 w-full'
}


export default Typeahead;