import React from "react";
import PropTypes from "prop-types";
const ToggleButton = ({
    enable,
    roundWidth = "w-9",
    roundHeight = "h-6",
    enableRoundColor = "bg-green-400",
    roundColor = "bg-gray-400",
    toogleTop =  "top-0.5",
    toogleEnableTranslate = "translate-x-3.5",
    toogleDisableTranslate =  "translate-x-0.5",
    duration = "duration-500",
    onChange
}) => {
    let array = new Uint8Array(1)
    let crypt = window.crypto.getRandomValues(array);
    const uniqueId = Math.floor(crypt * 1000000);
    return <label htmlFor={`toogleA_${uniqueId}`} className="transform flex items-center cursor-pointer"><div className="relative">
        <input id={`toogleA_${uniqueId}`} type="checkbox" className="hidden" onChange={(e) => onChange(e)} />
        <div className={`${roundWidth} ${roundHeight} ${enable ? enableRoundColor : roundColor} rounded-full shadow-inner`}></div>
        <div className={`${toogleTop} transform ${enable?toogleEnableTranslate:toogleDisableTranslate} transition-all ${duration}  ease-in-out  absolute w-5 h-5 bg-white rounded-full shadow inset-y-0`}></div>
    </div></label>
}
ToggleButton.propTypes = {
    enable: PropTypes.bool
}
ToggleButton.defaultProps = {  
    enable: false,  
}
export default ToggleButton;