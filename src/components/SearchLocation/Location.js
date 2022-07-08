import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { useTranslation } from "react-i18next";
import "./index.css";
// Utils
import { tr } from "../../components/utils";

const filter = createFilterOptions();

const useStyles = makeStyles({
    inputRoot: {
        width: '100%',
        height: 40,
        borderRadius: 8,
        padding: "2px 0px !important",
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgb(215, 216, 217)"
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            border: '1px solid #ccc'
        }
    },
    input: {
        padding: "0 1rem !important",
        color: "#111314",
        height: "100%"
    },
    endAdornment: {
        display: "none"
    },
    root: {
        width: '100%',
    },
    popper: {
        marginTop: "36px !important"
    }
});

const Location = ({
    placeholder,
    handleInputChange,
    options,
    handleChange,
    locationId,
    value,
    freeSolo = true,
    pageRef,
    eventRef,
    loadMore,
    prevHeight,
    setFieldValue,
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const titlecaseval = { id: value.id, name: value.name }

    return (
        <div className="flex mt-0 w-full">
            <Autocomplete
                id={locationId}
                options={options}
                freeSolo={freeSolo}
                getOptionLabel={(option) => option.name}
                style={{ width: "100%" }}
                value={titlecaseval}
                getOptionSelected={(o, v) => o.name === v.name}
                renderInput={(params) => <TextField {...params} placeholder={tr(t, placeholder)} variant="outlined" />}
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
                onChange={(x, y) => handleChange(x, y, setFieldValue)}
                disablePortal={true}
                onInputChange={(x, y, z) => handleInputChange(x, y, z, setFieldValue)}
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
                className="custome-input"
            />
        </div>
    );
}

export default Location;