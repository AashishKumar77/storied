import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import "./index.css";

const useStyles = makeStyles((theme) => ({
    formControl: {
        minWidth: 150,
        marginBottom: 500
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    labelControl: {
        minWidth: 120,
        marginTop: 10,
        marginRight: 20

    }
}));

const MyDropDown = ({ id, name, options, selectedValue, handleChange }) => {
    const classes = useStyles();
    return (
        <div>
            <FormControl className={classes.labelControl}>
                <div className="dropdown-title">Select User</div>
            </FormControl>

            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id={id}></InputLabel>
                <Select
                    id={id}
                    name={name}
                    value={selectedValue}
                    onChange={handleChange}
                >
                    {
                        options.map((ele, idx) =>
                            <MenuItem key={idx} value={ele.id}>{`${ele.firstName} ${ele.lastName}`}</MenuItem>
                        )
                    }
                </Select>
            </FormControl>
        </div>
    );
}

export default MyDropDown;
