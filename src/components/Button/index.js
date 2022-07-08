import React, { useState } from "react";
import PropTypes from "prop-types";
import "./index.css";

// Components
import Loader from "../Loader";
import Icon from "../Icon";
import Translator from "../Translator";

const Button = ({ type, title, size, icon, disabled, handleClick, loading, tkey, buttonType, ...props }) => {

    const getBtnType = () => {
        switch (type) {
            case "default":
                return "btn-default";
            case "primary":
                return "btn-primary";
            case "secondary":
                return "btn-secondary";
            case "danger":
                return "btn-danger";
            case "red":
                return "btn-red";
            case "red-dark":
                return "btn-red-dark";
            case "skyblue":
                return "btn-skyblue";
            case "white":
                return "btn-white";
            case "link-white":
                return "link-white";
            case "maroon":
                return "btn-maroon";
            case "stepper":
                return "btn-stepper";
            default:
                return "";
        }
    }
    const btnType = getBtnType();

    const getBtnSize = () => {
        switch (size) {
            case "small":
                return "btn-small"
            case "medium":
                return "btn-medium"
            case "large":
                return "btn-large"
            case "xlarge":
                return "btn-xlarge typo-font-bold"
            default:
                return ""
        }
    }
    const btnSize = getBtnSize();

    const btnDisable = disabled || loading ? "btn-disable" : "";

    const getlocalIconColor = () => {
        switch (type) {
            case "default":
                return "secondary"
            case "stepper":
                return "default"
            default:
                return "white";
        }
    }
    const localIconColor = getlocalIconColor();

    const [iconColor, setIconColor] = useState(localIconColor);

    const handleMouseEnter = () => {
        if (type === "stepper") setIconColor("primary");
    }

    const handleMouseLeave = () => {
        if (type === "stepper") setIconColor(localIconColor);
    }

    const getTitle = (tkeyin) => {
        return tkeyin !== "" ? <Translator tkey={tkeyin} /> : title
    }
    return (
        <button
            type={buttonType ? buttonType : "button"}
            className={`btn ${btnType} ${btnSize} ${btnDisable}`}
            onClick={!disabled ? handleClick : undefined}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {
                icon ?
                    <div className="flex items-center swapper">
                        <Icon type={icon} color={iconColor} size={size} />
                        <div className="ml-2 typo-font-light ml-swapper"> {getTitle(tkey)}</div>
                    </div>
                    :
                    <div className="flex justify-center items-center">{loading && <span className="mr-2"><Loader spinner={true} color="default" size={12} /></span>}<span>{getTitle(tkey)}</span></div>
            }
        </button>
    )
}

Button.propTypes = {
    type: PropTypes.oneOf(["default", "primary", "secondary", "danger", "skyblue", "white", "link-white", "red", "red-dark", "stepper"]),
    title: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large", "xlarge"]),
    icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool
    ]),
    disabled: PropTypes.bool,
    handleClick: PropTypes.func,
    tkey: PropTypes.string
};

Button.defaultProps = {
    type: "primary",
    title: "Learn more",
    size: "medium",
    icon: false,
    disabled: false,
    handleClick: undefined,
    tkey: ""
}

export default Button;