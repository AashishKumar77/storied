export const setLocationChanged = (value) => {
    localStorage.setItem("locationChanged", value)
}

export const getLocationChanged = () => {
    if(localStorage.getItem("locationChanged") === "true") return true;
    else return false;
}