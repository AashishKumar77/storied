import React, { useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles(() => ({
  root: {
    border: "none !important",
    "&:focus": {
      backgroundColor: "white"
    },
  },
  icon: {
    display: "none"
  },
  familyPaper: {
    padding: "0px",
    backgroundColor: "none",
    marginTop: 8,
    marginLeft: -8,
    top: "435px",
    left: "269px",
    transformorigin: "0px 0px",
    width: "4.6rem !important",
  },
  paper: {
    padding: "0px",
    backgroundColor: "none",
    marginTop: 12,
    marginLeft: -24,
    top: "435px",
    left: "269px",
    transformorigin: "0px 0px",
    width: "4.6rem !important",
  },
  selected: {
    backgroundColor: "white !important",
    color: "black",
    "&:hover": {
      backgroundColor: "#FAFAFA !important"
    },
  },
  rootMenuItem: {
    fontSize: "14px",
    "&$selected": {
      backgroundColor: "white !important",
      "&:hover": {
        backgroundColor: "#FAFAFA !important"
      },
    },
    "&:hover": {
      backgroundColor: "#FAFAFA"
    },
    "&:focus": {
      backgroundColor: "white !important"
    },
    "&:focus:hover": {
      backgroundColor: "#FAFAFA !important"
    },
  },
  mouseEnterFalse: {
    fontSize: "14px",
    "&:focus": {
      backgroundColor: "#FAFAFA !important"
    }
  },
  select: {
    marginLeft: 10,
    paddingRight: "0px !important"
  }
}));

const MySelect = ({
  id,
  open,
  name,
  options,
  value,
  handleChange,
  handleClose,
  familyTable
}) => {
  const [focusFlag, setFocusFlag] = useState(false);
  const classes = useStyles();
  
  const onMouseEnterHandler = () => {
    setFocusFlag(true);
  };

  const onMouseLeaveHandler = () => {
    setFocusFlag(false);
  };

  const handleKeyDown = (e, option) => {
    if (e.keyCode === 9 || e.keyCode === 13) {
      let customEvent = {
        target: {
          value: option
        }
      }
      handleChange(customEvent)
    }
  }

  return (
    <div>
      <FormControl className={classes.formControl}>
        <Select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          onClose={handleClose}
          disableUnderline={true}
          classes={{
            root: classes.root,
            select: classes.select,
            icon: classes.icon
          }}
          MenuProps={{
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "left"
            },
            transformOrigin: {
              vertical: "top",
              horizontal: "left"
            },
            getContentAnchorEl: null,
            classes: {
              paper: familyTable ? classes.familyPaper : classes.paper
            }
          }}
          open={open}
        >
          {options.map((option, idx) => (
            <MenuItem
              data-test="menuitem"
              key={idx}
              value={option}
              classes={{
                root: focusFlag
                  ? classes.rootMenuItem
                  : classes.mouseEnterFalse,
                selected: classes.selected
              }}
              onMouseEnter={onMouseEnterHandler}
              onMouseLeave={onMouseLeaveHandler}
              onKeyDown={(e) => handleKeyDown(e, option)}
            >
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

MySelect.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  open: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.string,
  handleChange: PropTypes.func,
  handleClose: PropTypes.func
};

MySelect.defaultProps = {
  id: "selectGender",
  name: "Gender",
  open: true,
  options: ["Male", "Female", "Other"],
  value: "Male",
  handleChange: undefined,
  handleClose: undefined,
}

export default MySelect;
