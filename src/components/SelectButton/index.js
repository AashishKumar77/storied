import React from "react";
import PropTypes from "prop-types";
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    selectButton: {
        background: "#FFFFFF",
        border: "1px solid #747578",
        boxSizing: 'border-box',
        borderRadius: "8px",
        width: 94,
        height: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        marginRight: 8,
        color:"#747578",
        "&:hover": {
            background: "#DAE3EF",
            border:"1px solid #204A82",
            color:"#204A82"
        }
    },
    title: {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        padding: 4
    },
    selectedButton: {
        background: "#DAE3EF",
        border:"1px solid #204A82",
        color:"#204A82"
    }
});

const SelectButton = ({ classes, title, select, handleSelect }) => {

    const handleClick = () => {
        handleSelect(title);
    }

    return (
        <div data-test="select-button" className={select ? `${classes.selectButton} ${classes.selectedButton}` : `${classes.selectButton}`} onClick={handleClick}>
            <div className={classes.title}>{title}</div>
        </div>
    )
}

SelectButton.propTypes = {
    title: PropTypes.string,
    select: PropTypes.bool,
    handleSelect: PropTypes.func
};

SelectButton.defaultProps = {
    title: "Title",
    select: false,
    handleSelect: undefined
}

export default withStyles(styles)(SelectButton);