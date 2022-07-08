import React, { useRef, useEffect } from 'react';
import PropTypes from "prop-types";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';

import { removeBodyOverflow, addBodyOverflow } from "../../pages/PersonViewPage/services";

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
        width: 110
    },
    menuItem: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        color: "#000"
    }
}));

export default function HeroImagePopover({ getMousePosition, imgSrc, menu, handleMenu, mousePosition, setCompState, setMousePosition }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);

    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    let heroImg = document.getElementById('heroImagePopover');

    if (heroImg && !open) {
        heroImg.onclick = function (e) {
            addBodyOverflow();
            setCompState('hero');
            setMousePosition({
                ...mousePosition,
                x: e.clientX,
                y: e.clientY
            })
            setOpen((previousOpen) => !previousOpen);
        }
    }


    const handleClose = (event) => {
        setCompState(null);
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
        removeBodyOverflow();
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

    useEffect(() => {
        window.addEventListener("scroll", () => {
            function heroOverFlow() {
                if (window.scrollY > mousePosition.y) {
                    removeBodyOverflow();
                    setOpen(false);
                }}
                heroOverFlow();
            });
    }, []);

    const handleSelect = async(e) => {
        handleMenu(e);
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <div>
                <div ref={anchorRef} aria-haspopup="true">
                    <img src={imgSrc} id="heroImagePopover" alt="card-pic-medium" className="w-full h-full"  />
                </div>
                <Popover
                    open={open}
                    anchorReference="anchorPosition"
                    anchorPosition={{ top: mousePosition.y, left: mousePosition.x }}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal:'center',
                    }}
                >
                    <Paper
                        className={`${classes.rootPaper}`}
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
                </Popover>
            </div>
        </div>
    );
}

HeroImagePopover.propTypes = {
    type: PropTypes.oneOf(["image", "avatar"]),
    avatarName: PropTypes.string,
    menu: PropTypes.arrayOf(PropTypes.object),
    handleMenu: PropTypes.func
};

HeroImagePopover.defaultProps = {
    type: "image",
    avatarName: "avatarName",
    menu: [{
        id: 1,
        name: "HeroImagePopover"
    }],
    handleMenu: undefined
}