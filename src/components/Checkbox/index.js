import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Checkbox from '@material-ui/core/Checkbox';

// Components
import Typography from "../Typography";

const styles = () => ({
    default: {
        color: "#FAFAFA"
    },
    primary: {
        color: "#295DA1"
    },
    secondary: {
        color: "#212122"
    },
    danger: {
        color: "#B02A4C"
    }
});

const MyCheckBox = ({ 
    classes, 
    id, 
    obj,
    checked, 
    color, 
    disabled, 
    handleChange, 
    label, 
    labelColor, 
    tkey 
}) => {
    
    const getCheckboxColor = () => {
        switch(color){
            case "default":
                return classes.default;
            case "secondary":
                return classes.secondary;
            case "danger":
                return classes.danger;
            case "primary":
            default:
                return classes.primary;
        }
    }    

    const checkboxColor = getCheckboxColor()

    const handleCheck = (e) => {
        handleChange(e, obj);
    }
    
    return (
        <div className="flex items-center">
            <Checkbox 
                classes={{
                    root: checkboxColor,
                }}
                id={id}
                color="default"
                checked ={checked} 
                disabled={disabled}
                onChange={!disabled ? handleCheck : undefined}
            />
            <Typography size={14} text={disabled ? "default" : labelColor} tkey={label} />
        </div>
    );
}

MyCheckBox.propTypes = {
    id: PropTypes.string,
    checked: PropTypes.bool,
    color: PropTypes.oneOf(["default", "primary", "secondary", "danger"]),
    disabled: PropTypes.bool,
    handleChange: PropTypes.func,
    label: PropTypes.string,
    labelColor: PropTypes.oneOf(["default", "primary", "secondary", "danger"])
};
  
MyCheckBox.defaultProps = {  
    id: "checkbox",
    checked: false,
    color: "primary",
    disabled: false,
    handleChange: undefined,
    label: "label",
    labelColor: "secondary"
}
  
export default withStyles(styles)(MyCheckBox);
