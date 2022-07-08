// Zoom Actions
export const zoomlevel = (scaleval) => {
    localStorage.setItem("scaleval", JSON.stringify(scaleval));
    if (scaleval === 2) {
        document.getElementById("btnplus").classList.remove("top-icon")
        document.getElementById("btnplus").classList.add("top-disable")
        document.getElementById("plus").classList.add("icon-disable")
    }
    else if (scaleval === 0.25) {
        document.getElementById("btnminus").classList.remove("bottom-icon")
        document.getElementById("btnminus").classList.add("bottom-disable")
        document.getElementById("minus").classList.add("icon-disable")
    }
    else {
        if (!document.getElementById("btnplus").classList.contains("top-icon"))
            document.getElementById("btnplus").classList.add("top-icon")
        if (document.getElementById("btnplus").classList.contains("top-disable"))
            document.getElementById("btnplus").classList.remove("top-disable")
        if (document.getElementById("plus").classList.contains("icon-disable"))
            document.getElementById("plus").classList.remove("icon-disable")
        if (!document.getElementById("btnminus").classList.contains("bottom-icon"))
            document.getElementById("btnminus").classList.add("bottom-icon")
        if (document.getElementById("btnminus").classList.contains("bottom-disable"))
            document.getElementById("btnminus").classList.remove("bottom-disable")
        if (document.getElementById("minus").classList.contains("icon-disable"))
            document.getElementById("minus").classList.remove("icon-disable")
    }
}

// Get Focus Name Width
export const getFocusNameWidth = ({ focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, d) => {
    let focusNameWidth = 220
    let focusBirthDeathWidth = 220
    if (d.attributes.path === "") {
        focusNameLength = d.firstName.length + d.lastName.length;
        focusBirthPlacelength = d.attributes.birthLocation.length;
        focusDeathPlaceLength = d.attributes.deathLocation.length;
        focusBirthDateLength = d.attributes.birth ?.RawDate ?.length;
        focusDeathDateLength = d.attributes.death ?.RawDate ?.length;
        let BirthDeathInfo = [focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength]
        let focusMaxBirthDeathLength = Math.max(...BirthDeathInfo)
        if (focusNameLength > 17) {
            focusNameWidth = 220 + ((focusNameLength - 17) * 8)
        }
        if (focusMaxBirthDeathLength > 24) {
            focusBirthDeathWidth = 220 + ((focusMaxBirthDeathLength - 24) * 5.0)
        }
        return { focusNameWidth, focusBirthDeathWidth }
    }
}

// Get FocusWidth
export const getFocusWidth = ({ focuswidth }, { focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, d) => {
    if (d.attributes.path === "") {
        var calculateWidth = getFocusNameWidth({ focusNameLength, focusBirthPlacelength, focusDeathPlaceLength, focusBirthDateLength, focusDeathDateLength }, d)
        if (((calculateWidth.focusBirthDeathWidth > 0) || (calculateWidth.focusNameWidth > 0))) {
            if (calculateWidth.focusNameWidth > calculateWidth.focusBirthDeathWidth)
                focuswidth = calculateWidth.focusNameWidth
            else
                focuswidth = calculateWidth.focusBirthDeathWidth
        }
        if (focuswidth > 400) focuswidth = 400
        return focuswidth
    }
}

// Get FocusHeight
export const getFocusHeight = (d) => {
    let count = 0;
    if (d.attributes.birth.RawDate !== "") {
        count++
    }
    if (d.attributes.death.RawDate !== "") {
        count++;
    }
    if ((d.attributes.birth.RawDate === "") && (d.attributes.birthLocation === "") && d.attributes.death.RawDate !== "") {
        count++;
    }
    if (d.attributes.birthLocation !== "") {
        count++;
    }
    if ((d.attributes.birth.RawDate === "") && (d.attributes.birthLocation !== "")) {
        count++;
    }
    if (d.attributes.deathLocation !== "")
        count++
    if (d.attributes.death.RawDate === "" && d.attributes.deathLocation !== "") {
        count++
    }
    if (d.attributes.birth.RawDate === "" && d.attributes.birthLocation === "" && d.attributes.death.RawDate === "" && d.attributes.deathLocation !== "") {
        count++
    }
    switch (count) {
        case 3:
            return 102
        case 2:
            return (d.attributes.death.RawDate === "" && d.attributes.deathLocation === "") ? 78 : 88
        case 4:
            return 118
        default:
            return 68
    }
}

// Display Initials
export const displayInitials = (fName) => {
    let name = fName.split(' ');
    let updatedFirstName = name[0];
    if (name.length >= 2) {
        for (let i = 1; i <= name.length - 1; i++) {
            let initials = name[i].charAt(0);
            updatedFirstName = updatedFirstName + " " + initials.toUpperCase();
        }
    }
    return updatedFirstName;
}

// Get Initials
export const getInitials = function (fName, lName, displayCardType, imgUrl) {
    let fullNameLength = fName.length + lName.length + 1;
    switch (true) {
        case (displayCardType.toLowerCase().includes("focus") && fullNameLength > 29):
        case (displayCardType.toLowerCase().includes("medium") && fullNameLength > 21 && imgUrl === ""):
        case (displayCardType.toLowerCase().includes("medium") && fullNameLength > 15 && imgUrl !== ""):
        case (displayCardType.toLowerCase().includes("small") && fullNameLength > 21):
            return displayInitials(fName);
        default:
            return fName;
    }
}

