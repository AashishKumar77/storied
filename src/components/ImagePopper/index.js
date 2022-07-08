import React, { useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

// Components
import AccountAvatar from '../AccountAvatar';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    rootPaper: {
        marginLeft: 0,
        background: "#FFFFFF",
        boxShadow: "0px 4px 24px -4px rgba(0, 0, 0, 0.15)",
        borderRadius: 8
    },
    imgSrc: {
        width: 208,
    },
    avatar: {
        minWidth: 90,
        maxWidth: 150
    },
    menuItem: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        color: "#000"
    }
}));

export default function ImagePopper({ type, avatarName, imgSrc, menu, handleMenu }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);

    const handleToggle = () => {
        setOpen((previousOpen) => !previousOpen);
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

    return (
        <div className={classes.root}>
            <div>
                {
                    type === "image" ? 
                    <div ref={anchorRef} aria-haspopup="true">
                        <img src={imgSrc} alt="card-pic-medium" className="w-full h-full rounded-2xl" style={{ width: 220}} onClick={handleToggle} />
                    </div>
                    :
                    <div ref={anchorRef} aria-haspopup="true" onClick={handleToggle}>
                        <AccountAvatar avatarName={avatarName} imgSrc={imgSrc} />
                    </div>
                }
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal placement="bottom-start">
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: 'bottom start' }}
                        >
                            <Paper
                                classes={{
                                    root: type === "image" ? `${classes.rootPaper} ${classes.image}` : `${classes.rootPaper} ${classes.avatar}` 
                                }}
                            >
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                        {
                                            menu && menu.map((ele, key) =>
                                                <MenuItem key={key} classes={{ root: classes.menuItem }} onClick={() => handleSelect(ele)}>{ele.name}</MenuItem>
                                            )
                                        }
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </div>
        </div>
    );
}

ImagePopper.propTypes = {
    type: PropTypes.oneOf(["image", "avatar"]),
    avatarName: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.object),
    handleMenu: PropTypes.func
};

ImagePopper.defaultProps = {
    type: "image",
    avatarName: "avatarName",
    menu: [{
        id: 1,
        name: "ImagePopper"
    }],
    handleMenu: undefined
}