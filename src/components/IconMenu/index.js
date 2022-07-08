import React, { useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './index.css';
// Components
import Icon from "../Icon";

// Utils
import { iconsList } from "../utils";

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  rootPaper: {
    marginLeft: 90,
    width: 120,
    background: "#FFFFFF",
    boxShadow: "0px 4px 24px -4px rgba(0, 0, 0, 0.15)",
    borderRadius: 8
  },
  rootHorizontalPaper: {
    marginLeft: 90,
    width: 130,
    background: "#FFFFFF",
    boxShadow: "0px 4px 24px -4px rgba(0, 0, 0, 0.15)",
    borderRadius: 8,
    marginTop: 1
  },
  menuItem: {
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: 14,
    color: "#000"
  },
  ///For searchable-dropdown
  searchRootPaper: {
    width: 200,
    background: "#FFFFFF",
    boxShadow: "0px 4px 24px -4px rgba(0, 0, 0, 0.15)",
    borderRadius: 8
  },
  inputRoot: {
    height: 32,
    borderRadius: 8,
    margin: "0 16px",
    padding: "0 0 !important",
    maxWidth: '100%',
    width: 'auto',
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#295DA1",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #ccc",
    },
  },
  input: {
    padding: "0 0 0 1rem !important",
    textTransform: "capitalize",
    height: "100%"

  },
  endAdornment: {
    display: "none",
  },
  autocompletePaper: {
    boxShadow: "none",
    overflow: "visible"
  },
  listbox: {
    "&.MuiAutocomplete-listbox": {
      padding: "0 0"
    }
  },
  popperDisablePortal: {
    position: 'relative',
  }
}));

export default function IconMenu({ 
  type, size, popperPlacement , rootClass, 
  color, background, disabled, menu, handleMenu, searchable, tableMenu, nonSelectableMenu }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  // return focus to the button when we transitioned from !open -> open
 const prevOpen = useRef(open);

  const handleToggle = () => {
   setOpen((openMenu) => !openMenu);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    }
  }

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleSelect = (e) => {
    handleMenu(e)
    setOpen(false);
  }
  //For nonselectebale events 
  const checkEventPresent = (listoption) => {
    let isSelectable = true;
    let presentEvent = false;
    let nonSelectableEvents = nonSelectableMenu.find(
      (ele) => listoption.name === ele.name
    );
    if (tableMenu && listoption.name === "Death") {
      if (tableMenu.some((element) => element.Type === "Death"))
        presentEvent = true;
    }
    if (nonSelectableEvents) isSelectable = false;
    if (presentEvent) isSelectable = false;

    return isSelectable;
  };
  return (
    <div className={classes.root}>
      <div>
        <div
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
        >
          <Icon
            type={type}
            size={size}
            color={color}
            background={background}
            disabled={disabled}
            handleClick={handleToggle}
            placement={searchable ? "bottom-start" : "bottom-end"}
          />
        </div>
        {searchable ? (
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            placement={"bottom-start"}
            transition
            disablePortal
            className="family-event-popover"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement == "bottom-start",
                }}
              >
                <Paper
                  classes={{
                    root: classes.searchRootPaper,
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <div>
                      <Autocomplete
                        open={true}
                        options={menu}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            margin="normal"
                            variant="outlined"
                            placeholder="Search events"
                            className="searchable-box"
                          />
                        )}
                        getOptionDisabled={option => !checkEventPresent(option)}
                        onChange={(e, newValue) => handleSelect(newValue)}
                        noOptionsText=" "
                        disablePortal={true}
                        renderOption={(option) => option.name}
                        classes={{
                          inputRoot: classes.inputRoot,
                          input: classes.input,
                          endAdornment: classes.endAdornment,
                          paper: classes.autocompletePaper,
                          listbox: classes.listbox,
                        }}
                      />
                    </div>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        ) : (
          <Popper
            open={open}
            anchorEl={anchorRef.current}
            role={undefined}
            transition
            disablePortal
            placement={popperPlacement}
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper
                  classes={{
                    root: rootClass ? classes.rootClass : classes.rootPaper,
                  }}
                >
                  <ClickAwayListener onClickAway={handleClose}>
                    <MenuList
                      autoFocusItem={open}
                      id="menu-list-grow"
                      onKeyDown={handleListKeyDown}
                    >
                      {menu &&
                        menu.map((ele, key) => (
                          <MenuItem
                            key={key}
                            classes={{ root: classes.menuItem }}
                            onClick={() => handleSelect(ele)}
                          >
                            {ele.name}
                          </MenuItem>
                        ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        )}
      </div>
    </div>
  );
}


IconMenu.propTypes = {
  type: PropTypes.oneOf(iconsList),
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["default", "primary", "secondary", "danger", "white"]),
  background: PropTypes.bool,
  disabled: PropTypes.bool,
  menu: PropTypes.arrayOf(PropTypes.object),
  handleMenu: PropTypes.func
};

IconMenu.defaultProps = {
  type: "plus",
  size: "small",
  color: "default",
  background: false,
  disabled: false,
  menu: [{
    id: 1,
    name: "IconMenu"
  }],
  handleMenu: undefined
}