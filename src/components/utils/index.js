import { showBirthandDeath } from "shared-logics"
export const cardType = {
    FOCUSED_LIVING: "focused-living",
    FOCUSED_DECEASED: "focused-deceased",
    FOCUSED_DECEASED_AddIMAGE: "focused-deceased-AddImage",
    FOCUSED_DECEASED_NOIMAGE: "focused-deceased-NoImage",
    FOCUSED_DECEASED_DATE: "focused-deceased-Date",
    MEDIUM_IMG: "medium-img",
    MEDIUM: "medium",
    MEDIUM_NEXT_GEN: "medium-next-gen",
    SMALL_IMG: "small-img",
    SMALL: "small",
    SMALL_NEXT_GEN: "small-next-gen"
}

export const cardGender = {
    MALE: "Male",
    FEMALE: "Female",
    OTHER: "Other",
    DEFAULT: "Default",
}

export const cardRelation = {
    MAIN: "main",
    PARENTS: "parents",
    CHILDREN: "children",
    SPOUSE: "spouse",
    CHILD_SPOUSE: "child-spouse"
}

export const cardDirection = {
    UP: "Up",
    DOWN: "Down"
}

export const tr = (t, tkey) => {
    const getQueryParams = new URLSearchParams(window.location.search);
    const lng = getQueryParams.get('lng');
    let wLang = false;
    if (lng && lng.toLocaleLowerCase() === "w") {
        wLang = true;
    }
    const w = (wlng) => {
        let ttext = t(wlng);
        let str = "";
        for (const text of ttext.split(" ")) {
            let len = text.length;
            while (len > 0) {
                str = str + "w";
                len--;
            }
            str = str + " ";
        }
        return str;
    }
    if (wLang) {
        return w(`${tkey}`)
        
    }
    else {
       return t(`${tkey}`)
    }

}

export const getQueryParam=()=>{
    if(window.location.href.split("?").length>1){
        return `?${window.location.href.split("?")[1]}`;
    }
    else{
        return ``
    }
}

export const getType = (path, title, type, nodesizecheck, nodetypecheck) => {
    const nodePath = path ? path.split("/") : [];
    switch (true) {
        //case (nodesizecheck > 10 && nodetypecheck === "spouse"):
        case (nodesizecheck > 20 && nodetypecheck === "sChild"):
        case (nodesizecheck > 20 && nodetypecheck === "directChildren"):
        case (nodetypecheck === "directChildspouse"):
        case (type === cardType.SMALL_IMG):
            return cardType.SMALL_IMG
        case (nodePath.length === 0):
            {
                if (nodetypecheck === "focus")
                    return cardType.FOCUSED_LIVING;
                else
                    return cardType.FOCUSED_DECEASED;
            }
        default:{
            switch (true) {
                case (nodePath.length % 4 === 0 && title !== ""):
                    return cardType.SMALL_NEXT_GEN
                case ((nodePath.length <= 3) && title !== ""):
                case (nodePath.length >= 5 && title !== ""):
                    return cardType.MEDIUM_NEXT_GEN
                case (nodePath.length % 4 === 0):
                    return cardType.SMALL_IMG
                case (nodePath.length >= 5):
                case (nodePath.length <= 3):
                    return cardType.MEDIUM_IMG
                default:
                    return cardType.SMALL_IMG
            }
        }
    }
}

export const parseName = (name) => {
    var values = name.split(/\s+/);
    var fName = values[0];
    var lName = values[1] ? name.substr(name.indexOf(' ') + 1) : '';
    return { fName, lName };
}

export const getTitle = (str) => {
    const len = 25;
    const size = Math.ceil(str.length / len);
    const r = Array(size);
    let offset = 0;
    let newString = "";
    for (let i = 0; i < size; i++) {
        r[i] = str.substr(offset, len);
        offset += len;
        newString = newString + r[i] + "-";
    }
    if (r.length > 1) {
        return r.join("-");
    }
    return r[0];
}

export const _formatData = ({ value,
    lightValue = "",
    desc = "",
    isNew = false,
    restrict = false,
    field = [],
    newField = []
}) => {
    return {
        value: value,
        lightValue: lightValue,
        isNew: isNew,
        desc: desc,
        restrict: restrict,
        field: field,
        newField: newField
    }
}

export const formatDataField = (data) => {
    let profileData = {}
    profileData.name = _formatData(
        {
            value: {
                "firstName": data.firstName.toLowerCase(),
                "lastName": data.lastName.toLowerCase()
            },
            restrict: data.restrict,
            isNew: data.isNew,
            field: data.field,
            newField: data.newField
        }
    )
    profileData.namePlace = `${data.birthYear} ${data.state} ${data.county}`;
    profileData.birthDate = _formatData(
        {
            value: {
                birthYear: `~${data.birthYear}`
            },
            lightValue: `(${data.age} in ${(parseInt(data.age) + parseInt(data.birthYear))})`,
            restrict: data.restrict,
            isNew: data.isNew,
            field: data.field,
            newField: data.newField
        }
    )
    if (data.placeofBirth) {
        const birthPlace = (data.placeofBirth.length <= 2) ? data.placeofBirth : data.placeofBirth.toLowerCase();
        profileData.birthPlace = _formatData({
            value: { placeofBirth: birthPlace },
            restrict: data.restrict,
            isNew: data.isNew,
            field: data.field,
            newField: data.newField
        });
    }
    profileData.home = _formatData({
        value: {
            "citySameHouse": data.citySameHouse
        },
        restrict: data.restrict,
        field: data.field,
        isNew: data.isNew,
        newField: data.newField
    });
    profileData.race = _formatData({
        value: data.race,
        restrict: data.restrict,
        field: data.field,
        isNew: data.isNew,
        newField: data.newField
    });
    profileData.occupation = _formatData({
        value: data.occupation,
        restrict: data.restrict,
        field: data.field,
        isNew: data.isNew,
        newField: data.newField
    });
    return profileData;
}

export const getRelationsDataFormat = (person, compareTo = false) => {
    let profileData = {};
    profileData.children = [];
    profileData.parent = [];
    profileData.grandParent = [];
    profileData.sibling = [];
    profileData.treeData = [];
    profileData.spouse = [];
    profileData.grandChildren = [];
    person && person.familyList && person.familyList.forEach(_data => {
        if (['HEAD'].includes(_data.relationship)) {
            profileData = { ...formatDataField(_data), ...profileData }
        }
        else if (['FATHER', 'MOTHER'].includes(_data.relationship)) {
            profileData.parent.push(_data)
        }
        else if (['GRANDFATHER', 'GRANDMOTHER'].includes(_data.relationship)) {
            profileData.grandParent.push(_data)
        }
        else if (['WIFE', 'HUSBAND'].includes(_data.relationship)) {
            profileData.spouse.push(_data)
        }
        else if (['SON', 'DAUGHTER'].includes(_data.relationship)) {
            profileData.children.push(_data)
        }
        else if (['GRANDSON', 'GRANDDAUGHTER'].includes(_data.relationship)) {
            profileData.grandChildren.push(_data)
        }
        else if (['BROTHER', 'SISTER'].includes(_data.relationship)) {
            profileData.sibling.push(_data)
        }
        if (!compareTo) {
            profileData.treeData.push((_data.firstName + " " + _data.lastName).toLowerCase())
        }
    });
    return profileData;
}

export const dateToAge = (d1, d2) => {
    var date1 = new Date(d1);
    var date2 = new Date(d2);
    var diff = new Date(date2.getTime() - date1.getTime());
    return diff.getUTCFullYear() - 1970;
}

export const dateToLocalString = (date, zone = undefined, options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) =>
    new Date(date).toLocaleDateString(zone, options);

export const isObjEmpty = (object = {}) =>
    Object.keys(object).length ? false : true

export const getMonthString = (short = 1) =>
    short ? ["Jan", "Feb", "Mar", "Apr", "May", "June",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        : ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

export const calculateCompareToData = (comparedProfile, type) => {
    switch (type) {
        case 'ssdi':
            return comparedProfile
        case 'newspaper':
            return;
        case 'census':
            return getRelationsDataFormat(comparedProfile)
        default:
            return {}
    }
}

export const newspaperDataFormat = newsData => {
    let profileData = {};
    profileData.name = { value: { firstName: newsData.pubTitle && newsData.pubTitle.toLowerCase() } };
    profileData.treeData = newsData.pubTitle && newsData.pubTitle.toLowerCase();
    profileData.address = `${newsData.cityName},${newsData.stateName},${newsData.countryName || 'USA'}`
    profileData.dateTime = `${getMonthString()[newsData.pubDateMonth || 0]}, ${newsData.pubDateDay},${newsData.pubDateYear} Page ${newsData.pageNumber}`
    return profileData;
}

export const ssdiCompareTo = (comparedProfile) => {
    let profileData = {};
    profileData.name = {
        value: {
            firstName: `${comparedProfile 
                && comparedProfile.firstName}`,
            middleName: `${comparedProfile 
                && comparedProfile.middleName}`,
            lastName: `${comparedProfile 
                && comparedProfile.lastName}`
        }
    };
    profileData.birthDate = {
        key: 'Birth Date',
        value: dateToLocalString(comparedProfile 
            && comparedProfile.birthDate),
        lightValue: '',
        isNew: false,
        desc: ''
    }
    profileData.birthPlace = {
        key: 'Birth Place',
        value: comparedProfile && comparedProfile.birthPlace,
        isNew: false,
        desc: ''
    }
    return profileData;
}

export const newspaperCompareTo = (comparedProfile) => {
    let profileData = {};
    profileData.children = [];
    if (comparedProfile) {
        profileData.name = {
            value: {
                firstName: `${comparedProfile.firstName}`,
                middleName: `${comparedProfile.middleName}`,
                lastName: `${comparedProfile.lastName}`,
            }
        };
        profileData.birthDate = {
            key: 'Birth Date',
            value: dateToLocalString(comparedProfile.birthDate),
            lightValue: '',
            isNew: false,
            desc: ''
        }
        profileData.children.push(comparedProfile)
    }
    return profileData
}

export const checkNodeType = (type, focusedMargin, mediumMagin, mediumNextGenMargin, smallNextGenMargin, smallMargin) => {
    const { FOCUSED_LIVING, FOCUSED_DECEASED, MEDIUM_NEXT_GEN, SMALL_NEXT_GEN, SMALL_IMG } = cardType;
    switch(type) {
        case FOCUSED_LIVING:
        case FOCUSED_DECEASED:
            return focusedMargin;

        case MEDIUM_NEXT_GEN:
            return mediumNextGenMargin;

        case SMALL_NEXT_GEN:
            return smallNextGenMargin;
        
        case SMALL_IMG:
            return smallMargin;
        
        default:
            return mediumMagin;
    }
}

export const getDateString=option=>{
    const birthDate = option?.birthDate?.year
    const deathDate = option?.deathDate?.year
    const isLiving = option?.isLiving
    return showBirthandDeath(birthDate, deathDate, isLiving)
}
export const getScale = (type) => {
    const zoom = Number(localStorage.getItem('scaleval'));
    switch(zoom){
        case 2:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, 4, 104, 100, 100, 103) ,
                marginTop: checkNodeType(type, 128, 123, 100, 100, 108)
            };

        case 1.75:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, -8, 78, 74, 74, 78),
                marginTop: checkNodeType(type, 96, 90, 75, 75, 82)
            };

        case 1.5:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, -24, 52, 49, 49, 52),
                marginTop: checkNodeType(type, 64, 60, 50, 49, 54)
            };

        case 1.25:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, -36, 26, 24, 24, 25),
                marginTop: checkNodeType(type, 32, 30, 25, 24, 28)
            };

        case 1:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, -50, 0, -2, -2, 0),
                marginTop: checkNodeType(type, -1, 0, -2, -2, 0)
            };

        case 0.75:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, -62, -26, -28, -28, -26),
                marginTop: checkNodeType(type, -30, -30, -28, -28, -26)
            };

        case 0.5:
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, -77, -53, -53, -53, -53),
                marginTop: checkNodeType(type, -65, -60, -55, -55, -55)
            };

        case 0.25:
            return {
                scale: `scale(${0.5})`,
                marginLeft: checkNodeType(type, -62, -53, -53, -53, -53),
                marginTop: checkNodeType(type, -62, -60, -53, -53, -53)
            };

        default: 
            return {
                scale: `scale(${zoom})`,
                marginLeft: checkNodeType(type, 0, 0, 0, 0, 0),
                marginTop: checkNodeType(type, 0, 0, 0, 0, 0)
            };
    }
}

export const generateRandomNumber = (min, max) => {    
    // Create byte array and fill with 1 random number
    var byteArray = new Uint8Array(1);
    window.crypto.getRandomValues(byteArray);

    var range = max - min + 1;
    var max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range)
        return generateRandomNumber(min, max);
    return min + (byteArray[0] % range);
}

export const tableTypes = {
    PERSONAL_INFO: "PERSONAL_INFO",
    EVENTS: "EVENTS",
    SPOUSES_AND_CHILDREN: "SPOUSES_AND_CHILDREN",
    PARENTS_AND_SIBLINGS: "PARENTS_AND_SIBLINGS",
    LIFE_EVENTS: "LIFE_EVENTS",
}

export const iconsList = [
    "home",
    "plus",
    "minus",
    "aim",
    "delete",
    "family",
    "upload",
    "user-single",
    "dashboard",
    "edit",
    "add-circle",
    "search",
    "plant",
    "file",
    "tree",
    "downArrow",
    "upArrow",
    "addPhoto",
    "uploadFile",
    "uploadFileError",
    "errorImg",
    "hamburger",
    "camera"
];