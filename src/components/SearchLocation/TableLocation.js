import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";

// Utils
import { tr } from "../utils";
import { setLocationChanged, getLocationChanged } from "../utils/location";

// Actions
import { getAutoCompleteTest } from "../../redux/actions/family";

const filter = createFilterOptions();

const useStyles = makeStyles({
    inputRoot: {
        width: '100%',
        height: 40,
        borderRadius: 4,
        padding: "2px 0px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #397388"
        }
    },
    input: {
        padding: "0 1rem !important",
        textTransform: "capitalize",
        height: "100%"
    },
    endAdornment: {
        display: "none"
    },
    root: {
        width: '100%',
    },
    popper: {
        // marginTop: "36px !important"
        height: 100
    }
});

const getLocationValue = (searchValue) => {
    return searchValue;
};

const TableLocation = ({
    placeholder,
    searchString = "",
    handleSelectedValue,
    family: { options, optionLoading },
    dispatchGetAutoCompleteTest,
    id = "locations-filter",
    freeSolo = false,
    inputRef,
    highLight,
    ...props
}) => {
    const classes = useStyles();
    const [location, setLocation] = useState(searchString);

    const locationValue = useMemo(
        () => getLocationValue(location),
        [location]
    );

    useEffect(() => {
        setLocation(searchString);
    }, [searchString])

    const eventRef = useRef();
    const pageRef = useRef(1);
    const prevHeight = useRef(0);
    const { t } = useTranslation();
    const refId = useRef();

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (inputRef) inputRef.focus();
            if (inputRef && highLight && !getLocationChanged()) inputRef.select();
            dispatchGetAutoCompleteTest(locationValue, refId.current);
        }, 250)

        return () => {
            return clearTimeout(delayDebounceFn)
        }
    }, [locationValue, dispatchGetAutoCompleteTest])

    useEffect(() => {
        if(inputRef && searchString && searchString.length === 1) inputRef.focus()
    }, [searchString])

    const handleChange = (e, val) => {
        handleSelectedValue(val);
    }

    const handleInputChange = (e, val, reason) => {
        if (reason !== 'reset') {
            setLocationChanged(true);
            handleReset(val);
        }
        if(val === "" && props.handleEmptyValue) {
            props.handleEmptyValue();
        }
    }

    const handleReset = (val) => {
        setLocation(val);
        handleSelectedValue({ id: null, name: val });
        pageRef.current = 1
        refId.current = uuidv4()
    }

    const loadMore = () => {
        dispatchGetAutoCompleteTest(locationValue, refId.current, pageRef.current);
    }

    useEffect(() => {
        if (pageRef.current > 1) {
            eventRef.current.target.scrollTop = prevHeight.current
        }
    }, [options])

    return (
        <div className="flex mt-0 w-full h-full">
            <Autocomplete
                {...props}
                id={id}
                options={options}
                freeSolo={freeSolo}
                loading={optionLoading}
                getOptionLabel={(option) => option.name}
                style={{ width: "100%" }}
                value={{ id: null, name: locationValue }}
                getOptionSelected={(o, v) => o.name === v.name}
                renderInput={(params) =>
                    <TextField
                        inputRef={input => {
                            inputRef = input;
                        }}
                        {...params}
                        placeholder={tr(t, placeholder)}
                        variant="outlined"
                    />
                }
                filterOptions={(myOptions, params) => {
                    const filtered = filter(myOptions, params);

                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            name: `${params.inputValue}`,
                            id: params.id
                        });
                    }
                    return filtered
                }}
                onChange={handleChange}
                onBlur={props.handleBlur}
                onKeyDown={props.handleKeyDown}
                disablePortal={false}
                popperOptions={{
                    placement: "bottom"
                }}
                onInputChange={handleInputChange}
                ListboxProps={{
                    onScroll: (e) => {
                        const listboxNode = e.currentTarget;
                        prevHeight.current = listboxNode.scrollHeight
                        if (listboxNode.scrollTop + listboxNode.clientHeight === listboxNode.scrollHeight) {
                            pageRef.current += 1;
                            eventRef.current = e;
                            loadMore()
                        }
                    }
                }}
                classes={{
                    inputRoot: classes.inputRoot,
                    input: classes.input,
                    endAdornment: classes.endAdornment,
                    root: classes.root,
                    popper: classes.popper
                }}
                blurOnSelect={true}
                onClose={props.handleClose}
                autoComplete={true}
            />
        </div>
    );
}

const mapStateToProps = (state) => ({
    family: state.family
});

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchGetAutoCompleteTest: (value, reqId, page) => dispatch(getAutoCompleteTest(value, null, reqId, page))
    }
}

TableLocation.propTypes = {
    handleSelectedValue: PropTypes.func
};

TableLocation.defaultProps = {
    handleSelectedValue: undefined
}

export default connect(mapStateToProps, mapDispatchToProps)(TableLocation);