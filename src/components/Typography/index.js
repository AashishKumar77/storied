import React from "react";
import PropTypes from "prop-types";
import Translator from "../Translator";
import "./index.css";

const Typography = ({ type, text, size, weight, children, href, target, tkey }) => {

    const CheckVarient =() =>{
        switch(type){
            case "defaultText": return "defaultText"
            case "link": return "link-style"
            default: return "";
        }
    }
    const varient = CheckVarient();

    const CheckFontColor = () =>{
        switch(text){
            case "default": return "default-color"
            case "primary": return "primary-color" 
            case "secondary": return "secondary-color"
            case "danger": return "danger-color"
            case "brand-color": return "brand-color"
            case "white-color": return "white-color"
            default: return "";
        }
    }
    const fontColor = CheckFontColor()
        
    const CheckTypoSize = () =>{
        switch(size){
        case 10: return "text-vs"
        case 12: return "text-xs"
        case 14: return "text-sm"
        case 16: return "text-base"
        case 18: return "text-lg"
        case 20: return "text-xl"
        case 24: return "text-lg md:text-2xl"
        case 32: return "text-4xl"
        case 48: return "text-2xl md:text-4xl xl:text-5xl"
        default: return "";
        }
    }
    const typoSize = CheckTypoSize()

    const CheckTypoWeight = () => {
        switch(weight){
            case "regular": return "typo-font-regular"
            case "light": return "typo-font-light"
            case "medium": return "typo-font-medium"
            case "bold": return "typo-font-bold"
            case "lyon-regular": return "lyon-font-regular"
            case "lyon-medium": return "lyon-font-medium"
            default: return "typo-font-regular"
        }
    }
    const typoWeight = CheckTypoWeight()

    const getText = () => {
        return tkey !== "" ? <Translator tkey={tkey}/> : children;
    }    

    if(type === "link") return <a href={href} target={target} className={`${varient} ${fontColor} ${typoSize} ${typoWeight}`}>{getText()}</a>
    else return <span className={`${varient} ${fontColor} ${typoSize} ${typoWeight}`}>{getText()}</span>;
}

Typography.propTypes = {
    type: PropTypes.oneOf(["defaultText", "link"]),
    text: PropTypes.oneOf(["default", "primary", "secondary", "danger", "brand-color", "white-color"]),
    size: PropTypes.oneOf([10, 12, 14, 16, 18, 20, 24, 32, 48]),
    weight: PropTypes.oneOf(["regular", "light", "medium", "bold", "lyon-regular","lyon-medium"]),
    children: PropTypes.any,
    href: PropTypes.string,
    target: PropTypes.string,
    tkey: PropTypes.string
};

Typography.defaultProps = {
    type: "defaultText",
    text: "default",
    size: 16,
    weight: "regular",
    children: "",
    href: "https://www.google.com/",
    tkey: ""
}

export default Typography;