import { placeAuthority } from "./../redux/actions/universalSearch";
import { trimString } from "shared-logics";

export const MALE = "Male";
export const FEMALE = "Female";
export const OTHER = "Other";
export const UNKNOWN = "Unknown";

const UNIVERSALSEARCHVAL = "universal_search_val";
const UNIVERSALSEARCHPLACE = "universal_search_place";
const WWISEARCHVAL = "wwi_search_value";


export const findChild = (element, id, index, myArray) => {
  if (element.id === id) {
    myArray.push(`parents[${index}]`);
    return element;
  } else if (element.parents !== null) {
    var i;
    var result = null;
    for (i = 0; result === null && i < element.parents.length; i++) {
      result = findChild(element.parents[i], id, i, myArray);
      if (result) myArray.push(`parents[${index}]`);
    }
    return result;
  }
  return null;
};

export const getPath = (data, id, myArray) => {
  for (let i = 0; i < data.length; i++) {
    const result = findChild(data[i], id, i, myArray);
    if (result) return myArray.reverse().join(".");
  }
};

export const checkUnknown = (obj, type) => {
  if (type === "FAMILY") {
    const blankid = "00000000-0000-0000-0000-000000000000";
    if (obj.id === blankid && obj.gender.Gender === MALE) {
      return `Unknown Father`;
    } else if (obj.id === blankid && obj.gender.Gender === FEMALE) {
      return `Unknown Mother`;
    } else if (obj.id === blankid) {
      return `Unknown Spouse`;
    } else {
      return `${obj.firstName.GivenName} ${obj.lastName.Surname}`;
    }
  } else if (type === "SIBLING") {
    const blankid = "00000000-0000-0000-0000-000000000000";
    if (obj.id === blankid && obj.gender === MALE) {
      return `Unknown Father`;
    } else if (obj.id === blankid && obj.gender === FEMALE) {
      return `Unknown Mother`;
    } else if (obj.id === blankid) {
      return `Unknown Parent`;
    } else {
      return `${obj.firstName} ${obj.lastName}`;
    }
  } else if (type === "CHILD") {
    if (obj.nodeGender === MALE) return "Unknown Mother";
    else if (obj.nodeGender === FEMALE) return "Unknown Father";
    else return "Unknown Parent";
  }
};

export const getShortGender = (gender) => {
  switch (gender) {
    case MALE:
      return "M";
    case FEMALE:
      return "F";
    case OTHER:
      return "O";
    case UNKNOWN:
    default:
      return "";
  }
};

export const checkFamilyGroup = (index) => {
  return index % 2 !== 0;
};

export const getNextPath = (path, index) => {
  return `${path}/${index}`;
};

export const getNode = (selectedNode, newPerson) => {
  return {
    id: selectedNode.id,
    parentId: selectedNode.parentId,
    firstName: newPerson.firstName,
    lastName: newPerson.lastName,
    isLiving: newPerson.isLiving,
    attributes: {
      type: selectedNode.type,
      cFilialId: selectedNode.cFilialId,
      path: selectedNode.path,
      title: selectedNode.title,
      gender: newPerson.gender,
      birth: newPerson.birth,
      birthPlace: newPerson.birthPlace,
      death: newPerson.death,
      deathPlace: newPerson.deathPlace,
      imgsrc: selectedNode.imgsrc,
      relatedParentIds: selectedNode.relatedParentIds,
    },
  };
};

export const getPathString = (pathString, isParent) => {
  if (pathString === "") return null;
  let elements = pathString && pathString.split("/");
  if (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i] = "parents[" + elements[i] + "]";
    }
  }
  if (isParent) {
    elements.pop(elements.length - 1);
  }
  elements = elements.join(".");
  return elements;
};

export const saveUniversalSearchValue = (val) => {
  localStorage.setItem(UNIVERSALSEARCHVAL, val);
};
export const getUniversalSearchValue = () =>
  localStorage.getItem(UNIVERSALSEARCHVAL);

export const searchUniversalPlace = (val) => {
  localStorage.setItem(UNIVERSALSEARCHPLACE, val);
};
export const getUniversalSearchPlace = () =>
  localStorage.getItem(UNIVERSALSEARCHPLACE);

export const saveWWISearchValue = (val) => {
  localStorage.setItem(WWISEARCHVAL, JSON.stringify(val));
};
export const typeSearchDefaultWWI = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    ResidenceCityMatch: "1",
    ResidenceCityMatchID: "1",
  };
};
export const getFirstName = (values) => {
  let name = [];
  if (values) {
    const { fm, ln } = values;
    if (fm.t) {
      name.push(fm.t);
    }
    if (ln.t) {
      name.push(ln.t);
    }
  }
  return name.join(" ");
};
export const getWWIDefaultValue = () => {
  const {
    FirstNameMatch,
    LastNameMatch,
    ResidenceCityMatch,
    ResidenceCityMatchID,
  } = typeSearchDefaultWWI();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    l: {
      l: "",
      s: ResidenceCityMatch,
    },
    li: {
      i: null,
      s: ResidenceCityMatchID,
    },
    LocationField: {
      id: null,
      name: "",
    },
    ci: "",
    gr: "",
    matchExact: false,
  };
};

export const typeSearchDefaulUSFederalCensus = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    BirthMatch: "4",
    OtherMatches: "1",
    ResidenceMatch: "1",
    yearMatch: "8"
  };
};

export const getUSFederalCensusDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, BirthMatch, ResidenceMatch, yearMatch, OtherMatches } =
    typeSearchDefaulUSFederalCensus();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    g: "",
    sr: "",
    b: {
      y: {
        y: "",
        s: yearMatch,
      },
      li: {
        i: "",
        s: BirthMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    r: {
      li: {
        i: "",
        s: ResidenceMatch,
      },
      l: {
        l: "",
        s: ResidenceMatch,
      },
    },
    pr: {
      li: {
        i: "",
        s: ResidenceMatch,
      },
      l: {
        l: "",
        s: ResidenceMatch,
      },
    },
    ms: "",
    rs: "",
    matchExact: false,
    BirthPlace: {
      id: "",
      name: "",
    },
    RSPlace: {
      id: "",
      name: "",
    },
    RSPPlace: {
      id: "",
      name: "",
    },
  };
};

export const typeSearchDefaultGermanToAmerica = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    BirthMatch: "4",
    OtherMatches: "1",
    yearMatch: "8"
  };
};
export const getGermanToAmericaDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, BirthMatch, OtherMatches, yearMatch } =
    typeSearchDefaultGermanToAmerica();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    pr: {
      li: {
        i: "",
        s: BirthMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    ad: {
      y: "",
      m: "",
      d: "",
      s: yearMatch
    },
    b: {
      li: {
        i: "",
        s: BirthMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
      y: {
        y: "",
        s: yearMatch,
      },
    },
    g: "",
    d: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    id: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    s: "",
    o: "",
    Res: {
      id: "",
      name: "",
    },
    BirthPlace: {
      id: "",
      name: "",
    },
    PDepart: {
      id: "",
      name: "",
    },
    IDest: {
      id: "",
      name: "",
    },
  };
};

export const typeSearchDefaultItaliansToAmerica = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    BirthMatch: "4",
    yearMatch: "8",
    OtherMatches: "1",

  };
};
export const getItaliansToAmericaDefaultValue = () => {
  const { LastNameMatch, FirstNameMatch, BirthMatch, yearMatch, OtherMatches } =
    typeSearchDefaultItaliansToAmerica();
  return {
    ln: {
      t: "",
      s: LastNameMatch,
    },
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ad: {
      y: "",
      m: "",
      d: "",
      s: yearMatch
    },
    pr: {
      li: {
        i: "",
        s: BirthMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    b: {
      li: {
        i: "",
        s: BirthMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
      y: {
        y: "",
        s: yearMatch,
      },
    },
    d: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    g: "",
    id: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    s: "",
    o: "",
    BirthPlace: {
      id: "",
      name: "",
    },
    PDepart: {
      id: "",
      name: "",
    },
    Res: {
      id: "",
      name: "",
    },
    IDest: {
      id: "",
      name: "",
    },
  };
};

export const typeSearchDefaultWWII = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    OtherMatches: "1",
    BirthMatch: "4",
    ResidenceMatch: "4",
    yearMatch: "8"
  };
};


export const getWWIIDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, BirthMatch, OtherMatches, yearMatch, ResidenceMatch } = typeSearchDefaultWWII();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    b: {
      li: {
        i: "",
        s: BirthMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
      y: {
        y: "",
        s: yearMatch
      }
    },
    e: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
      y: {
        y: "",
        m: "",
        d: "",
        s: yearMatch
      }
    },
    sr: {
      li: {
        i: "",
        s: ResidenceMatch,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
      y: {
        y: "",
        m: "",
        d: "",
        s: yearMatch
      },
    },
    r: "",
    er: "",
    m: "",
    el: "",
    o: "",
    c: "",
    ec: "",
    matchExact: false,
    BirthPlace: {
      id: "",
      name: "",
    },
    Residence: {
      id: "",
      name: ""
    },
    Enlist: {
      id: "",
      name: "",
    }
  }
}
export const getNewspapperDefaultValue = () => {
  return {
    k: [{ m: 'an', t: '' }],
    fn: "",
    ln: "",
    cu: "", 
    st: "",
    ci: "",
    pu: "",
    nm: "",
    bt: { "y": "", "m": "", "d": "", "ey": "", "em": "", "ed": "" },
    ex: { "y": "", "m": "", "d": "" },
    ye: { "y": "", "eb": "0" },
    be: { "y": "" },
    af: { "y": "" }
  }
}
export const getEmailDefaultValue = () => {
  return {
    k: [{ rn: '', re: '' }],
    yn: '',
    ye: '',
    msg:''
  }
}
export const typeSearchDefaultIrish = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    OtherMatches: "1",
    yearMatch: "8"
  };
};

export const getIrishDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, OtherMatches, yearMatch } = typeSearchDefaultIrish();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    pr: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    ad: {
      y: "",
      m: "",
      d: "",
      s: yearMatch
    },
    b: {
      y: {
        y: "",
        s: yearMatch
      }
    },
    g: "",
    d: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    id: {
      li: {
        i: "",
        s: OtherMatches,
      },
      l: {
        l: "",
        s: OtherMatches,
      },
    },
    o: "",
    rs: "",
    Res: {
      id: "",
      name: "",
    },
    PDepart: {
      id: "",
      name: "",
    },
    IDest: {
      id: "",
      name: "",
    },
  }
}

export const typeSearchDefaultUSSocialSecurity = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    DateMatch: "8",
    ResidenceMatch: "1",
  };
};

export const getUSSocialSecurityDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, DateMatch, ResidenceMatch } = typeSearchDefaultUSSocialSecurity();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    b: {
      y: "",
      m: "",
      d: "",
      s: DateMatch
    },
    d: {
      y: "",
      m: "",
      d: "",
      s: DateMatch
    },
    r: {
      li: {
        i: "",
        s: ResidenceMatch,
      },
      l: {
        l: "",
        s: ResidenceMatch,
      },
    },
    Res: {
      id: "",
      name: "",
    },
  }
}



export const getFirstAndLastName = () => {
  return {
    0: "search.form.dropdown.exact", //"Exact"
    1: "search.form.dropdown.similar", //"Similar"
    2: "search.form.dropdown.broad", //"Broad"
  };
};
export const getLevelCheck = () => {
  return {
    1: "search.form.dropdown.exactcity",
    2: "search.form.dropdown.exactcity",
    3: "search.form.dropdown.exactcity",
    4: "search.form.dropdown.exactcity",
    5: "search.form.dropdown.exactcounty",
    6: "search.form.dropdown.exactstate",
    7: "search.form.dropdown.exactcountry",
    8: "search.form.dropdown.exactcountry",
    9: "search.form.dropdown.exactcountry",
    10: "search.form.dropdown.exactcountry"
  };
};
export const getResidence = () => {
  return {
    "search.form.dropdown.exactcity": "0",
    "search.form.dropdown.exactcounty": "1",
    "search.form.dropdown.exactstate": "2",
    "search.form.dropdown.exactcountry": "3",
    "search.form.dropdown.broad": "4",
  };
};
export const getResidenceText = () => {
  return {
    0: "search.form.dropdown.exact",
    1: "search.form.dropdown.broad",
  };
};
export const getYearsOptions = () => {
  return {
    2: "Exact",
    3: "+/- 1 Year",
    4: "+/- 5 Years",
    5: "+/- 10 Years",
    8: "Broad",
  };
};

export const getBeforeAfterOptions = () => {
  return {
    2: "Exact Year",
    3: "+/- 1 Year",
    4: "+/- 5 Years",
    5: "+/- 10 Years",
    6: "Before",
    7: "After",
    8: "Broad",
  };
};


export const getYearMonthOptions = () => {
  return {
    1: "Exact Month & Year",
    2: "Exact Year",
    3: "+/- 1 Year",
    4: "+/- 5 Years",
    5: "+/- 10 Years",
    6: "Before",
    7: "After",
    8: "Broad",
  };
};
export const getDayOptions = () => {
  return {
    0: "Exact Date",
    1: "Exact Month & Year",
    2: "Exact Year",
    3: "+/- 1 Year",
    4: "+/- 5 Years",
    5: "+/- 10 Years",
    6: "Before",
    7: "After",
    8: "Broad",
  };
};

export const getWWISearchValue = () => {
  const jsonData = localStorage.getItem(WWISEARCHVAL);
  return jsonData ? JSON.parse(jsonData) : null;
};
export const pageRecordsCountfn = (
  loading,
  error,
  totalRecords,
  limitPerPage,
  current
) => {
  if (!loading && !error && totalRecords > 0) {
    let pageRecordsCount = limitPerPage * current;
    pageRecordsCount =
      totalRecords > pageRecordsCount ? pageRecordsCount : totalRecords;
    return pageRecordsCount;
  } else {
    return 0;
  }
};
export const getValue = (value, afterSpace = false) => {
  const spaceExist = afterSpace ? " " : "";
  return value ? `${value}${spaceExist}` : "";
};
export const getButtonTitle = (values) => {
  return values ? "search.ww1.form.update" : "search.ww1.form.search";
};

export const editPersonData = (data) => {
  return {
    firstName: trimString(data.firstName),
    lastName: trimString(data.lastName),
    isLiving: data.isLiving,
    gender: data.gender,
    birth: trimString(data.birth),
    birthPlace: trimString(data.birthPlace),
    death: trimString(data.death),
    deathPlace: trimString(data.deathPlace),
  };
};

export const newPersonData = (modalAction, data) => {
  switch (modalAction) {
    case modalType.ADD_PARENT:
      return {
        id: data.id,
        treeId: data.treeId,
        filialRelationshipId: data.filialRelationshipId,
        childId: data.childId,
        selectedName: trimString(data.selectedName),
        firstName: trimString(data.firstName),
        lastName: trimString(data.lastName),
        isLiving: data.isLiving.toUpperCase() === "TRUE" ? true : false,
        gender: data.gender,
        requiredGender: data.requiredGender,
        birth: trimString(data.birth),
        birthPlace: trimString(data.birthPlace),
        death: trimString(data.death),
        birthLocationId: "",
        deathLocationId: "",
        deathPlace: trimString(data.deathPlace),
        siblings: data.siblings,
        relationAdded: data.relationAdded,
        nodeType: data.nodeType,
        homePersonId: data.homePersonId,
        generation: data.generation,
      };

    case modalType.ADD_SIBLING:
      return {
        id: data.id,
        treeId: data.treeId,
        filialRelationshipId: data.filialRelationshipId,
        selectedName: trimString(data.selectedName),
        gender: data.gender,
        firstName: trimString(data.firstName),
        lastName: trimString(data.lastName),
        isLiving: data.isLiving,
        requiredGender: data.requiredGender,
        birth: trimString(data.birth),
        birthPlace: trimString(data.birthPlace),
        death: trimString(data.death),
        deathPlace: trimString(data.deathPlace),
        pfirstName: trimString(data.pfirstName),
        plastName: trimString(data.plastName),
        primaryPersonId: data.primaryPersonId,
        parents: data.parents,
        relationAdded: data.relationAdded,
        nodeType: data.nodeType,
        homePersonId: data.homePersonId,
        generation: data.generation,
        birthLocationId: "",
        deathLocationId: ""
      };

    case modalType.ADD_CHILD:
      return {
        id: data.id,
        treeId: data.treeId,
        treePersonId: data.treePersonId,
        filialRelationshipId: data.filialRelationshipId,
        selectedName: trimString(data.selectedName),
        firstName: trimString(data.firstName),
        lastName: trimString(data.lastName),
        isLiving: data.isLiving,
        gender: data.gender,
        nodeGender: data.nodeGender,
        requiredGender: data.requiredGender,
        birth: trimString(data.birth),
        birthPlace: trimString(data.birthPlace),
        death: trimString(data.death),
        deathPlace: trimString(data.deathPlace),
        pfirstName: trimString(data.pfirstName),
        plastName: trimString(data.plastName),
        primaryPersonId: data.primaryPersonId,
        spouses: data.spouses,
        relationAdded: data.relationAdded,
        nodeType: data.nodeType,
        homePersonId: data.homePersonId,
        generation: data.generation,
        birthLocationId: "",
        deathLocationId: ""
      };

    case modalType.ADD_SPOUSE:
      return {
        id: data.id,
        treeId: data.treeId,
        treePersonId: data.treePersonId,
        filialRelationshipId: data.filialRelationshipId,
        selectedName: trimString(data.selectedName),
        firstName: trimString(data.firstName),
        lastName: trimString(data.lastName),
        isLiving: data.isLiving.toUpperCase() === "TRUE" ? true : false,
        gender: data.gender,
        requiredGender: data.requiredGender,
        birth: trimString(data.birth),
        birthPlace: trimString(data.birthPlace),
        death: trimString(data.death),
        deathPlace: trimString(data.deathPlace),
        children: data.children,
        relationAdded: data.relationAdded,
        nodeType: data.nodeType,
        spousesLength: data.spousesLength,
        homePersonId: data.homePersonId,
        generation: data.generation,
        directChildren: data.directChildren,
        birthLocationId: "",
        deathLocationId: ""
      };
    case modalType.ADD_FATHER_OR_MOTHER:
      return {
        id: data.id,
        treeId: data.treeId,
        filialRelationshipId: data.filialRelationshipId,
        childId: data.childId,
        firstName: trimString(data.firstName),
        lastName: data.title === "Add Father" ? trimString(data.childSurname) : trimString(data.lastName),
        isLiving: data.isLiving,
        gender: data.gender,
        birth: "",
        birthPlace: trimString(data.birthPlace),
        death: "",
        deathPlace: trimString(data.deathPlace),
        imgsrc: "",
        birthLocationId: "",
        deathLocationId: ""
      };
    default:
      return {
        firstName: trimString(data.firstName),
        lastName: trimString(data.lastName),
        isLiving: true,
        gender: data.gender,
        birth: trimString(data.birth),
        birthPlace: trimString(data.birthPlace),
        death: trimString(data.death),
        deathPlace: trimString(data.deathPlace),
        birthLocationId: "",
        deathLocationId: ""
      };
  }
};

export const checkValue = (value) => {
  if (value) {
    return value;
  }
  return "";
};

export const getAvatarName = (firstName, lastName, showBoth = false) => {
  if (showBoth && firstName && lastName) {
    const firstNameChar = firstName.charAt(0);
    const lastNameChar = lastName.charAt(0);
    return firstNameChar.toUpperCase() + lastNameChar.toUpperCase();
  } else if (firstName) {
    const firstChar = firstName.charAt(0);
    return firstChar.toUpperCase();
  } else if (lastName) {
    const firstChar = lastName.charAt(0);
    return firstChar.toUpperCase();
  } else {
    return "";
  }
};

export const modalType = {
  ADD_CHILD: "ADD_CHILD",
  ADD_PARENT: "ADD_PARENT",
  ADD_SIBLING: "ADD_SIBLING",
  ADD_SPOUSE: "ADD_SPOUSE",
  EDIT_PERSON: "EDIT_PERSON",
  ADD_FATHER_OR_MOTHER: "ADD_FATHER_OR_MOTHER",
};

export const tableType = {
  PERSONAL_INFO: "PERSONAL_INFO",
  EVENTS: "EVENTS",
  SPOUSES_AND_CHILDREN: "SPOUSES_AND_CHILDREN",
  PARENTS_AND_SIBLINGS: "PARENTS_AND_SIBLINGS",
  LIFE_EVENTS: "LIFE_EVENTS",
};

export const getSelectedGender = (gender) => {
  if (gender === MALE) return FEMALE;
  if (gender === FEMALE) return MALE;
  else return "";
};

export const getRelatedParentIdOrGender = (obj) => {
  for (const [key, value] of Object.entries(obj)) {
    return {
      parentId: key,
      gender: getSelectedGender(value),
    };
  }
};
export const getLocationsArr = (tr, t) => [
  tr(t, "search.unisearchform.location.select"),
  tr(t, "search.unisearchform.location.livedin"),
  tr(t, "search.unisearchform.location.born"),
  tr(t, "search.unisearchform.location.married"),
  tr(t, "search.unisearchform.location.died"),
  tr(t, "search.unisearchform.location.milatry"),
  tr(t, "search.unisearchform.location.immigration"),
  tr(t, "search.unisearchform.location.education"),
  tr(t, "search.unisearchform.location.employment"),
];
export const getKeywordsArr = (tr, t) => ({
  "wo": tr(t, "Without the Word(s)"),
  "an": tr(t, "At Least One of These"),
  "ex": tr(t, "With the Exact Phrase"),
  "al": tr(t, "With All of the Words")
})

export const getDisabledOptions = (getFirstAndLastNameOptions, text) => {
  const doubleQoutesExist = /"([^\\"]|\\")*/.test(text);
  const specialChar = /[*?]/.test(text);
  if (doubleQoutesExist || specialChar) {
    return Object.keys(getFirstAndLastNameOptions).filter(
      (element) => element !== "0"
    );
  }
  return [];
};

export const encodeDataToURL = (data, prefix = "") => {
  let dataValue = [];
  if (Array.isArray(data)) {
    return data
      .map((value, index) => {
        if (typeof value === "object" || Array.isArray(value)) {
          const indexString = `[${index}]`;
          return encodeDataToURL(
            value,
            prefix.replace(/[.]$/, "") + indexString + "."
          );
        } else {
          return `${prefix.replace(/[.]$/, "")}[${index}]=${encodeURIComponent(
            value
          )}`;
        }
      })
      .join("&");
  } else {
    dataValue = Object.keys(data);
    const prefixString = prefix !== "" ? prefix.replace(/[.]$/, "") + "." : "";
    return dataValue
      .map((value, index) => {
        let returnString = "";
        if (Array.isArray(data[value]) || typeof data[value] === "object") {
          returnString = `${encodeDataToURL(
            data[value],
            prefixString + value
          )}`;
        } else {
          returnString = `${prefixString + value}=${encodeURIComponent(
            data[value]
          )}`;
        }
        return returnString;
      })
      .filter(function (el) {
        return !!el;
      })
      .join("&");
  }
};

export const decodeDataToURL = (str) => {
  try {
    if (str[0] === "?") str = str.substring(1);
    let obj = {};
    let arr = str.split(/[&]+/);
    for (let elem of arr) {
      let arrField = elem.split(/[[\]/]/),
        fieldLength = arrField.length;
      if (fieldLength > 1 && fieldLength % 2) {
        getArrayObj(arrField, obj);
      } else {
        let [key, val] = getKeyValArr(elem),
          keyArr = key.split(".");
        obj = mergeArray(keyArr, obj, val);
      }
    }
    return obj;
  } catch (err) {
    return false;
  }
};
const mergeArray = (keyArr, obj, value, index = 0) => {
  if (index === keyArr.length - 1) {
    obj[keyArr[index]] = decodeURIComponent(value);
    return obj;
  } else {
    if (!obj[keyArr[index]]) {
      obj[keyArr[index]] = {};
    }
    obj[keyArr[index]] = mergeArray(
      keyArr,
      obj[keyArr[index]],
      value,
      index + 1
    );
    return obj;
  }
};

export const getKeyValArr = (str) => {
  let arr = ["", ""];
  let splitArr = str.split("=");
  if (splitArr[0]) arr[0] = splitArr[0];
  if (splitArr[1]) arr[1] = splitArr[1];
  return arr;
};
export const getArrayObj = (arrField, existObj) => {
  let [key, val] = getKeyValArr(arrField[2]),
    keyArr = key.split(".").filter((y) => y),
    builtObj = strToObject(keyArr, val);
  if (arrField[0] in existObj) {
    if (keyArr.length === 1) {
      existObj[arrField[0]][arrField[1]] = {
        ...existObj[arrField[0]][arrField[1]],
        ...builtObj,
      };
    } else if (keyArr.length === 2) {
      if (existObj[arrField[0]][arrField[1]]) {
        if (keyArr[0] in existObj[arrField[0]][arrField[1]] || {}) {
          existObj[arrField[0]][arrField[1]][keyArr[0]] = {
            ...existObj[arrField[0]][arrField[1]][keyArr[0]],
            ...builtObj[keyArr[0]],
          };
        }
      } else {
        existObj[arrField[0]][arrField[1]] = {
          ...existObj[arrField[0]][arrField[1]],
          ...builtObj,
        };
      }
    }
  } else {
    existObj[arrField[0]] = [{ ...builtObj }];
  }
};
export const strToObject = (arr, val) => {
  let object = {},
    result = object;
  for (let i = 0; i < arr.length - 1; i++) {
    object = object[arr[i]] = {};
  }
  object[arr[arr.length - 1]] = decodeURIComponent(val);
  return result;
};

export const setDropdownObject = (parent, option, t, tr) => {
  if (parent?.level === 3 || parent?.level === 4) {
    option["0"] = tr(t, "search.form.dropdown.exactcity");
  }
  if (parent?.level === 5) {
    option["1"] = tr(t, "search.form.dropdown.exactcounty");
  }
  if (parent?.level === 6) {
    option["2"] = tr(t, "search.form.dropdown.exactstate");
  }
  if (parent?.level > 6) {
    option["3"] = tr(t, "search.form.dropdown.exactcountry");
  }
};

export const getPageSize = (ps) => {
  let size = 20;
  if (isNaN(ps)) {
    return size;
  }
  if (ps <= 10) size = 10;
  if (ps > 20 && ps <= 50) size = 50;
  if (ps > 50 && ps <= 100) size = 100;
  if (ps > 100) size = 100;
  return size;
};
export const formDataTrim = (obj) => {
  for (let elem in obj) {
    if (Array.isArray(obj[elem])) {
      let arr = obj[elem];
      if (!arr.length) {
        delete obj[elem];
      } else {
        for (let arrElem of arr) {
          formDataTrim(arrElem);
        }
      }
    } else {
      _ifObj(obj, elem);
    }
  }
  return obj;
};

const deleteFromObj = (obj, elem, elem1) => {
  if (obj[elem] && !obj[elem][elem1]) {
    delete obj[elem][elem1];
  }
  if (obj[elem]) {
    let keyArr = Object.keys(obj[elem]);
    if (!keyArr.length || (keyArr.length === 1 && keyArr.includes('s'))) {
      delete obj[elem]
    }
  }
}
const _ifObj = (obj, elem) => {
  if (typeof obj[elem] === "object" && obj[elem] !== null) {
    for (let elem1 in obj[elem]) {
      if (obj[elem] && typeof obj[elem][elem1] === 'object' && !Array.isArray(obj[elem][elem1])) {
        _ifObj(obj[elem], elem1)
      } else if (obj[elem] && Array.isArray(obj[elem][elem1])) {
        formDataTrim(obj[elem][elem1])
      }
      deleteFromObj(obj, elem, elem1)
    }
  } else if (typeof obj[elem] === "string" && !obj[elem]) {
    delete obj[elem];
  }
}
function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}
export function mergeDeep(target, source) {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

export const dataURLtoFile = (dataurl, filename) => {
  var arr = dataurl.split(","),
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: "image/png" });
};

export const blobToDataUrl = async (imageUrl) => {
  const data = await fetch(imageUrl);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

export const LAYOUT_ID = {
  FIT: "8b3584fb-7547-4240-a826-ce176a91ac2a",
  FILL: "9b6c4867-c77f-4817-991f-d64e175b2471",
  SQUARE: "a8ddfd67-8e0b-45fc-84b2-2c72fab1d66a",
  BORDER: "91875ad8-9ffe-4f2f-8ee2-cd42ea96778c",
  TWO_IMAGE: "5f529565-6817-4fa6-b631-2d9623b86f7f",
  DEFAULT: "48b601e9-9ce2-4055-9ba7-1370643cea92",
};
const layoutCropedArea = {
  [LAYOUT_ID.FIT]: {
    width: 300,
    height: 420,
    mobile: {
      width: "w-full",
      height: 525,
    },
  },
  [LAYOUT_ID.FILL]: {
    width: 300,
    height: 420,
    mobile: {
      width: "w-full",
      height: 525,
    },
  },
  [LAYOUT_ID.SQUARE]: {
    width: 368,
    height: 368,
    mobile: {
      width: 300,
      height: 300,
    },
  },
  [LAYOUT_ID.BORDER]: {
    width: 368,
    height: 368,
    mobile: {
      width: 300,
      height: 300,
    },
  },
  [LAYOUT_ID.TWO_IMAGE]: {
    width: 400,
    height: 287,
    mobile: {
      width: 300,
      height: 215,
    },
  },
};
export const getImageSizeCalculate = (
  imageWidth,
  imageHeight,
  mediaWidth,
  mediaHeight,
  count = 0
) => {
  let width = imageWidth;
  let height = imageHeight;
  if (!(imageWidth <= mediaWidth && imageHeight <= mediaHeight)) {
    if (imageHeight > imageWidth && imageHeight > mediaHeight) {
      height = mediaHeight;
      let widthPer = ((imageHeight - mediaHeight) / imageHeight) * 100;
      let heightPerV = (imageWidth * widthPer) / 100;
      width = Math.round((imageWidth - heightPerV) * 1000) / 1000;
    } else if (imageHeight === imageWidth) {
      width = mediaWidth;
      height = mediaWidth;
    } else if (imageWidth > mediaWidth) {
      width = mediaWidth;
      let widthPer = ((imageWidth - mediaWidth) / imageWidth) * 100;
      let heightPerV = (imageHeight * widthPer) / 100;
      height = Math.round((imageHeight - heightPerV) * 1000) / 1000;
    }
    if (count <= 3 && (height > mediaHeight || width > mediaWidth)) {
      count++;
      const imageSize = getImageSizeCalculate(
        width,
        height,
        mediaWidth,
        mediaHeight,
        count
      );
      width = imageSize.width;
      height = imageSize.height;
    }
  }
  return {
    width,
    height,
    widthActual: mediaWidth,
    heightActual: mediaHeight,
  };
};
const fill = {
  Desktop: {
    width: 500,
    height: 700,
  },
  iPad: {
    width: "full",
    height: 700,
  },
  Mobile: {
    width: "full",
    height: 526,
  },
};
const fit = {
  Desktop: {
    width: 500,
    height: 700,
  },
  iPad: {
    width: "full",
    height: 700,
  },
  Mobile: {
    width: "full",
    height: 525,
  },
};
const square = {
  Desktop: {
    width: 400,
    height: 400,
  },
  iPad: {
    width: "full-50",
    height: "width",
  },
  Mobile: {
    width: "full",
    height: "width",
  },
};
const border = {
  Desktop: {
    width: 400,
    height: 600,
  },
  iPad: {
    width: "full-50",
    height: 600,
  },
  Mobile: {
    width: "full",
    height: 449,
  },
};
const twoImage = {
  Desktop: {
    width: 400,
    height: 287,
  },
  iPad: {
    width: "full-50",
    height: 215,
  },
  Mobile: {
    width: 300,
    height: 215,
  },
};
const getWidthHeightImage = (widthHeight, _widthHeight) => {
  return widthHeight > _widthHeight ? _widthHeight : widthHeight;
};
const labelArray = {
  [LAYOUT_ID.FIT]: "Fit to page",
  [LAYOUT_ID.FILL]: "Fill",
  [LAYOUT_ID.SQUARE]: "Square",
  [LAYOUT_ID.BORDER]: "Border",
  [LAYOUT_ID.TWO_IMAGE]: "2-image",
};
export const getWidgetLabel = (id) => {
  return labelArray[id];
};
const getIpadImageWidth = (width) => {
  let newWidth = width;
  const divWidth = (getWindowWidth() - 24 * 2) / 2;
  if (newWidth === "full") {
    newWidth = divWidth;
  } else if (newWidth === "full-50") {
    newWidth = divWidth - 80;
  }
  return newWidth;
};
const getIpadImageHeight = (width, height) => {
  let newHeight = height;
  if (newHeight === "width") {
    newHeight = width;
  }
  return newHeight;
};
const getScreenSize = ({ width, height }, screen) => {
  let newWidth = width;
  let newHeight = height;
  if (screen === "Mobile") {
    if (newWidth === "full" && newHeight === "width") {
      newWidth = getWindowWidth();
      newHeight = getWindowWidth();
    } else if (newWidth === "full") {
      newWidth = getWindowWidth();
    }
  } else if (screen === "iPad") {
    newWidth = getIpadImageWidth(newWidth);
    newHeight = getIpadImageHeight(newWidth, newHeight);
  }
  return { width: newWidth, height: newHeight };
};
export const getImageSizeList = (
  imageWidth,
  imageHeight,
  layout,
  mediaObj = { width: 259, height: 186 }
) => {
  //Two Images only
  let { width, height } = mediaObj;
  let { width: _width, height: _height } = { width, height };
  if ([LAYOUT_ID.TWO_IMAGE].includes(layout)) {
    if (imageWidth > width || imageHeight > height) {
      width = getWidthHeightImage(imageWidth, width);
      height = getWidthHeightImage(imageHeight, height);
    } else {
      width = imageWidth;
      height = imageHeight;
    }
    return {
      width: width,
      height: height,
      widthActual: 640,
      heightActual: 250,
    };
  } else {
    return getImageSizeCalculate(imageWidth, imageHeight, _width, _height);
  }
};
export const getImageSize = (imageWidth, imageHeight, layout, screen) => {
  let mediaSize = {
    width: imageWidth,
    height: imageHeight,
  };
  let { width, height } = getScreenSize(fill[screen], screen);
  if ([LAYOUT_ID.FIT].includes(layout)) {
    let screnRatio = getScreenSize(fit[screen], screen);
    width =
      getWindowWidth() < screnRatio.width ? getWindowWidth() : screnRatio.width;
    height = screnRatio.height;
    mediaSize = getImageSizeCalculate(imageWidth, imageHeight, width, height);
  } else if ([LAYOUT_ID.SQUARE].includes(layout)) {
    let screnRatio = getScreenSize(square[screen], screen);
    width = screnRatio.width;
    height = screnRatio.height;
    mediaSize = {
      width: width,
      height: height,
      widthActual: width,
      heightActual: height,
    };
  } else if ([LAYOUT_ID.BORDER].includes(layout)) {
    let screnRatio = getScreenSize(border[screen], screen);
    width = screnRatio.width;
    height = screnRatio.height;
    mediaSize = getImageSizeCalculate(imageWidth, imageHeight, width, height);
  } else if ([LAYOUT_ID.TWO_IMAGE].includes(layout)) {
    let { width: _width, height: _height } = getScreenSize(
      twoImage[screen],
      screen
    );
    width = imageWidth;
    height = imageHeight;
    if (imageWidth > _width || imageHeight > _height) {
      width = getWidthHeightImage(imageWidth, _width);
      height = getWidthHeightImage(imageHeight, _height);
    }
    mediaSize = {
      width: width,
      height: height,
      widthActual: 400,
      heightActual: 287,
    };
  } else if (
    [LAYOUT_ID.FILL].includes(layout) &&
    (imageWidth > 375 || imageHeight > height)
  ) {
    mediaSize = {
      width: width,
      height: height,
      widthActual: 350,
      heightActual: 490,
    };
  }
  return mediaSize;
};
export const getWidgetOption = ({ width, height }) => {
  let aspectRatio = 5 / 7,
    result = {};
  let imageRatio = width / height === aspectRatio;
  if (!(height >= 700 && width >= 500 && imageRatio)) {
    result[LAYOUT_ID.FIT] = "fit-lt-btn widget-btn";
  }
  if (height >= 700 && width >= 500) {
    result[LAYOUT_ID.FILL] = "fill-lt-btn widget-btn";
  }
  if (height >= 400 && width >= 400) {
    result[LAYOUT_ID.SQUARE] = "square-lt-btn widget-btn";
  }
  if (height >= 600 && width >= 400) {
    result[LAYOUT_ID.BORDER] = "border-lt-btn widget-btn";
  }
  result[LAYOUT_ID.TWO_IMAGE] = "multi-lt-btn widget-btn";
  return result;
};
export const getWindowWidth = () => {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
};
export const getLayoutAspect = (layout) => {
  return layoutCropedArea[layout];
};
export const strFirstUpCase = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
export const strFirstlowerCase = (str) =>
  str ? str.charAt(0).toLowerCase() + str.slice(1) : "";

export const getScreen = () => {
  const width = getWindowWidth();
  let screen = "Desktop";
  if (width <= 520) {
    screen = "Mobile";
  }
  return screen;
};
export const getFullWidthHeight = (obj) => {
  if (obj.width) {
    if (obj.width === "full") {
      return {
        width: getWindowWidth() + "px",
        height: obj.height + "px",
      };
    } else {
      return {
        width: obj.width + "px",
        height: obj.height + "px",
      };
    }
  }
};

export const ObjForPlaceId = (data, obj) => {
  if (data?.level === 3 || data?.level === 4) {
    obj["0"] = data.placeId;
  }
  if (data?.level === 5) {
    obj["1"] = data.placeId;
  }
  if (data?.level === 6) {
    obj["2"] = data.placeId;
  }
  if (data?.level > 6) {
    obj["3"] = data.placeId;
  }
};
export const getuniversalQuery = async (query) => {
  let data = decodeDataToURL(query);
  if (data?.ls?.length) {
    for (let ls of data.ls) {
      if (ls?.li?.i) {
        let apiData = await placeAuthority(ls.li.i);
        let obj = {};
        ObjForPlaceId(apiData, obj);
        let parent = apiData.parent;
        while (parent) {
          ObjForPlaceId(parent, obj);
          parent = parent.parent;
        }
        if (obj[ls.li.s]) {
          ls.li.i = obj[ls.li.s];
        }
      }
    }
  }
  return encodeDataToURL(data);
};
export const getImageProps = (file, layout) => {
  if (
    file.mediaObj &&
    file.mediaObj[layout] &&
    file.mediaObj[layout].calculate &&
    file.mediaObj[layout].calculate
  ) {
    const { width, height, widthActual, heightActual } =
      file.mediaObj[layout].calculate;
    return {
      width: widthActual,
      height: heightActual,
      style: {
        width: width,
        height: height,
        "objectFit": "cover",
      },
    };
  } else {
    return {
      width: file.width,
      height: file.height,
      style: {
        ...(file.calculate
          ? file.calculate && getFullWidthHeight(file.calculate)
          : {}),
        "objectFit": "cover",
      },
    };
  }
};
export const universalInitialValues = () => {
  const location = {
    le: "",
    l: { l: "", s: "1" },
    y: { y: "", m: "", d: "", s: "8" },
    li: { i: "", s: "4", name: "" },
  };
  const initialValues = {
    fm: { t: "", s: "2" },
    ln: { t: "", s: "2" },
    rs: [],
    ls: [location],
    kw: "",
    g: "",
    cn: "",
    pn: 1,
    ps: 10,
    matchExact: false,
  };
  return { location, initialValues };
};
export const newHeaderInitialValues = () => {
  const location = {
    le: "",
    l: { l: "", s: "1" },
    y: { y: "", s: "8" },
  };
  const initialValues = {
    fm: { t: "", s: "2" },
    ln: { t: "", s: "2" },
    rs: [],
    ls: [],
    kw: "",
    g: "",
    cn: "",
    pn: 1,
    ps: 10,
  };
  return { location, initialValues };
};
export const typeSearchDefaultRussian = () => ({
  FirstNameMatch: "2",
  LastNameMatch: "2",
  ResidenceCityMatch: "1",
  ResidenceCityMatchID: "1",
  yearMatch: "8"
});
export const getRussianDefaultValue = () => {
  const {
    FirstNameMatch,
    LastNameMatch,
    ResidenceCityMatch,
    ResidenceCityMatchID,
    yearMatch
  } = typeSearchDefaultRussian();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    b: {
      y: {
        y: "",
        s: yearMatch
      },
      l: {
        l: "",
        s: ResidenceCityMatch,
      },
      li: {
        i: "",
        s: ResidenceCityMatchID,
      },
    },
    a: {
      y: {
        y: "",
        m: "",
        d: "",
        s: yearMatch
      },
      l: {
        l: "",
        s: ResidenceCityMatch,
      },
      li: {
        i: "",
        s: ResidenceCityMatchID,
      },
    },
    g: "",
    d: {
      l: {
        l: "",
        s: ResidenceCityMatch,
      },
      li: {
        i: "",
        s: ResidenceCityMatchID,
      },
    },
    r: {
      l: {
        l: "",
        s: ResidenceCityMatch,
      },
      li: {
        i: "",
        s: ResidenceCityMatchID,
      },
    },
    s: "",
    o: "",
    BirthPlace: {
      id: "",
      name: "",
    },
    ArrivalPlace: {
      id: "",
      name: "",
    },
    Depart: {
      id: "",
      name: "",
    },
    Res: {
      id: "",
      name: "",
    },
  };
};
export const numToLocaleString = (num) => {
  return num.toLocaleString();
};
export const formLsValidate = (values) => {
  let res = false;
  let arr = values && values.filter((y) => y?.le === "");
  if (arr.length > 0) {
    res = true;
  }
  return res;
};
export const formVaildate = (values) => {
  let error = {
    invaild: "Inavild",
    isEvent: "",
  };
  let LifeEvents = values.ls?.filter(
    (y) => y?.l?.l && y?.l?.l !== "" || y?.y?.y && y?.y?.y !== ""
  );
  let relations = values.rs?.filter(
    (y) => y?.f && y?.f?.trim() !== "" || y?.l && y?.l?.trim() !== ""
  );
  let LifeEventsValid = formLsValidate(LifeEvents);
  if (
    (values.fm.t?.givenName?.givenName === "" || values.fm.t?.name === "") &&
     values.ln.t.trim() === "" &&
    values.kw.trim() === "" &&
    values.g === "" &&
    values.cn.trim() === "" &&
    !relations.length &&
    !LifeEvents.length
  ) {
    error.invaild = "Inavild";
  } else if (LifeEventsValid) {
    error.invaild = "Inavild";
    error.isEvent = "Required";
  } else {
    error = {};
  }
  return error;
};
export const getYear = (value) => {
  let str = "";
  if (Number(value) !== 0) {
    str = Number(value);
  }
  return str;
};
export const getMonth = (value) => {
  let str = "";
  str = String(value);
  return str;
};

export const getDay = (value) => {
  let str = "";
  if (Number(value) !== 0 && Number(value) <= 31) {
    str = Number(value);
  }
  return str;
};

export const handleYearkeypress = (e) => {
  if (e.which !== 0 && (e.which < 48 || e.which > 57)) {
    e.preventDefault();
  }
};

export const wwiPK = "9297bb3b17fe4e73a06d9549ee2b2c48";
export const censusPK = "ca5bd7f41a2f47f9a43377d79c6da6a6";
export const wwiGUID = "9297bb3b-17fe-4e73-a06d-9549ee2b2c48";
export const censusGUID = "ca5bd7f4-1a2f-47f9-a433-77d79c6da6a6";
export const uscensusGUID = "5b949e7e-9c4d-499a-a0dd-0f48d7678ecb";
export const russianPK = "9a094a72-43c8-49fc-bd01-03008309ff2a";
export const germanPK = "31bdb982-91e1-4d7f-b562-1ad71953d5c3";
export const wwiiPK = "0b89a723-3908-4ef7-8885-71f75b2fde8f";
export const irishPK = "2ee39cb6-5ceb-4081-b1cd-71b73e1507bd"
export const italiansGUID = "2807f9da-2c70-480f-9368-ec6dd1bfb0d8";
export const USSocialPK = "4f2e7041-8339-4caf-a465-ed2b8016031d";
export const massachussetsPK = "91f21c3b-ac5d-4a00-b6ac-824821667563";
export const NYCMarriagesPK = "f94c4f5a-a3cf-49f4-be78-b2c0ebbcd25e";
export const texasMarriagesPK = "3bc62037-1852-4c77-b946-1725da030341";
export const USFederal1800PK = "9b82165a-1259-458f-bbde-bfc0e5bfd114";
export const USFederal1810PK = "ae52510b-5338-4061-a724-5d34d189ce90";
export const washingtonMarriagesPK = "90b96409-4d23-4c90-874d-5828cd7ad52d";
export const MassachusettsMarriagesPK = "61c71aae-f045-4635-9667-5576b0f3c8d5";
export const USFederal1820PK = "75e043ad-08dc-466f-bdfb-73e1862f66dc"
export const USFederal1830PK = "caad1837-8d0f-4409-b126-92d7aeaca56d"
export const OhioPK = "0479b6e9-5772-4083-964f-e6c2ab99c3ee"

export const getInitials = (nameString) => {
  const fullName = nameString.split(" ");
  let initials = "";
  if (fullName.length > 1) {
    initials = fullName.shift().charAt(0) + fullName.pop().charAt(0);
    return initials.toUpperCase();
  } else {
    initials = fullName.shift().charAt(0);
    return initials.toUpperCase();
  }
};
export const getWidgetClass = (type, files) => {
  let str = "";
  switch (type) {
    case LAYOUT_ID.FILL:
      str = "fill";
      break;
    case LAYOUT_ID.BORDER:
      str = "border-view";
      break;
    case LAYOUT_ID.TWO_IMAGE:
      str = "multiple-images";
      break;
    case LAYOUT_ID.SQUARE:
      str = "square";
      break;
    default:
      str = "fit";
  }

  return str;
};
export const removeAtFromGuid = (guid) => (guid ? guid.split("@")[0] : "");
export const handleMatchCheckbox = (e, form) => {
  if (e.target.checked) {
    form.setFieldValue("matchExact", true);
    form.setFieldValue("fm.s", "0");
    form.setFieldValue("ln.s", "0");
    form.setFieldValue("l.s", "0");
    if (form.values.LocationField.id) {
      const loc = Object.keys(form.values.LocationField.levelData.residenceLevel);
      form.setFieldValue("li.s", loc[0]);
    }
  } else { 
    form.setFieldValue("matchExact", false);
    !form.values?.fm.t && form.setFieldValue("fm.s", "2");
    !form.values?.ln.t && form.setFieldValue("ln.s", "2");
    !form.values?.l?.l && form.setFieldValue("l.s", "1");
  }
};
export const isMatchExact = (value) => {
  let res = value;
  if (typeof value === "string") {
    res = value === "true" ? true : false;
  }
  return res;
};

export const getHomeCardHeight = (height) => {
  let res = "";
  if (height > 570) {
    res = "top-sticky";
  }
  if (window?.innerHeight < 440) {
    res = ""
  }
  return res;
};
export const getRelatedValue = (matchExact, value) => {
  if (matchExact) {
    return value
  }
  return "4"
}

export const CheckExactFieldLocation = (setFieldValue, locationfield, e) => {
  const loc = Object.keys(locationfield.levelData.residenceLevel);
  if (loc[0]) {
    const value = e.target.value;
    const valueCheck = loc[0];
    if (value !== valueCheck) {
      setFieldValue("matchExact", false);
    }
  }
};

export const CheckExactField = (setFieldValue, e) => {
  const value = parseInt(e.target.value);
  if (value !== 0) {
    setFieldValue("matchExact", false);
  }
};

//to search spouse node in family json
const searchSpouses = (arr, nodeId, key) => {
  let obj = arr.filter((el) => el.id === nodeId)[0];
  if (obj) {
    return key;
  }
};

//Find edited node in family json
const findItem = (arr, itemId, nestingKey) =>
  arr.reduce((a, item) => {
    if (a) return a;
    if (item.id === itemId) return nestingKey;
    if (nestingKey) {
      if (item[nestingKey])
        return findItem(item[nestingKey], itemId, nestingKey);
    } else {
      return searchSpouses(arr, itemId, 'spouses');
    }
    if (item.schildspouse) return searchSpouses(item.schildspouse, itemId, 'schildSpouse');
  }, null);

export const getNodeTypeById = (Id, family) => {
  const treeData = { ...family };
  let nodeType = "";
  if (treeData.id === Id) nodeType = 'FOCUS';
  if (nodeType === "") nodeType = findItem(treeData.parents, Id, "parents");
  if (!nodeType) nodeType = findItem(treeData.spouses, Id, 'spouses');
  if (!nodeType) nodeType = findItem(treeData.spouses, Id, "schild");
  if (!nodeType) nodeType = findItem(treeData.directChildren, Id, "directChildren");
  if (nodeType) {
    return nodeType
  }
}

const findSpouses = (arr, itemId, nestingKey) =>
  arr.reduce((a, item) => {
    if (a) return a;
    if (item.id === itemId) return arr;
    if (nestingKey) {
      if (item[nestingKey])
        return findSpouses(item[nestingKey], itemId, nestingKey);
    }
  }, null);

export const getNoOfSpouses = (Id, family, type) => {
  const treeData = { ...family };
  let arrayLength = "";
  if (arrayLength === "" && type === "schild") arrayLength = findSpouses(treeData.spouses, Id, 'schild');
  else {
    arrayLength = findSpouses(treeData.parents, Id, "parents");
  }
  if (arrayLength) {
    let IdArray = arrayLength.map(ele => ele.id);
    let IdCount = IdArray.filter(e => e !== '').length - 1;
    let children = arrayLength.filter(e => e.id === Id);
    let childSpouse = arrayLength.filter(ele => ele.id === Id);
    if (type === "parents") return IdCount;
    if (type === "schild") return childSpouse[0].schildspouse.length;
    return children[0].parent;
  }
}


const getDirectChildCheck = (node) => {
  if ((node.children && node.children.length > 0) && node.directChildren)
    return node.children.filter((ele) => ele.id === node.directChildren.id)[0].check;
  return null;
}

const getSiblingOrChildForFocus = (node) => {
  if (node && node.existingParentIds) {
    return node.existingParentIds.includes(node.homePersonId)
  }
}

const relationCheckForSchildspouse = (relation) => {
  return (relation === 'ADD_SIBLING' || relation === 'ADD_CHILD' || relation === 'ADD_SPOUSE')
}

export const refetchLogic = (node) => {
  let nodeType = node.nodeType;
  let relation = node.relationAdded;
  let spousesLength = node.spousesLength;
  const directChildCheck = getDirectChildCheck(node);
  const siblingorChildAddedForFocus = getSiblingOrChildForFocus(node);
  switch (true) {
    case ((nodeType === 'FOCUS') && (relation === 'ADD_SIBLING')): return false;
    case ((nodeType === 'parents') && (relation === 'ADD_CHILD' || relation === "ADD_SIBLING" || (relation === 'ADD_SPOUSE' && !directChildCheck))): return false;
    case ((nodeType === 'schild') && ((relation === 'ADD_CHILD') || (relation === 'ADD_SIBLING' && !siblingorChildAddedForFocus) || (relation === 'ADD_SPOUSE' && spousesLength !== 0))): return false;
    case ((nodeType === 'directChildren') && (relation === 'ADD_CHILD')): return false;
    case ((nodeType === 'spouses') && (relation === 'ADD_SPOUSE' || relation === 'ADD_SIBLING' || (relation === 'ADD_CHILD' && !siblingorChildAddedForFocus))): return false;
    case ((nodeType === 'schildSpouse') && relationCheckForSchildspouse(relation)): return false;
    default: return true;
  }
}

export const getTitleByPartitionKey = (partitionKey) => {
  let title = "", key = partitionKey?.split("@")?.[0];
  switch (key) {
    case wwiGUID:
      title = "Soldiers of the Great War Casualty List";
      break;
    case wwiiPK:
      title = "WWII United States Army Enlistment Records, 1938-1946";
      break;
    case uscensusGUID:
      title = "1790 United States Federal Census";
      break;
    case USFederal1800PK:
      title = "1800 United States Federal Census";
      break;
    case USFederal1810PK:
      title = "1810 United States Federal Census";
      break;
    case USFederal1820PK:
      title = "1820 United States Federal Census";
      break;
    case USFederal1830PK:
      title = "1830 United States Federal Census";
      break;
    case censusGUID:
      title = "1940 United States Federal Census";
      break;
    case massachussetsPK:
      title = "Massachusetts State Deaths, 1841-1910";
      break;
    case USSocialPK:
      title = "United States Social Security Index";
      break;
    case germanPK:
      title = "Germans to America, 1850-1897";
      break;
    case russianPK:
      title = "Russian Immigrants to US, 1834-1897";
      break;
    case italiansGUID:
      title = "Italians to America, 1855-1900";
      break;
    case irishPK:
      title = "Irish Famine Passenger Records, 1846-1851";
      break;
    case MassachusettsMarriagesPK:
      title = "Massachusetts State Marriages, 1841-1910";
      break;
    case texasMarriagesPK:
      title = "Texas Marriages, 1966-2011";
      break;

    case NYCMarriagesPK:
      title = "New York City Marriages, 1950-2017";
      break;

    default:
      break;
  }
  return title;
};


export const daysInMonth = (month, year) => {
  let day = new Date(year, parseInt(month), 0).getDate();
  let arr = []
  for (let i = 1; i < day + 1; i++) {
    arr.push(i);
  }
  return arr
}

export const months = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12'
}

export const getPersonOrder = (persons, primaryPersonId) => {
  let _persons = persons
  if (primaryPersonId) {
    const index = persons.findIndex((_person) => _person.id === primaryPersonId)
    if (index !== -1) {
      let newPersons = [
        persons[index],
        ...persons.slice(0, index),
        ...persons.slice(index + 1, persons.length)
      ]
      _persons = newPersons
    }
  }
  return _persons
}

export const handleDateYear = (e, setFieldValue, name, values) => {
  let yearinput = getYear(e.target.value);
  setFieldValue(`${name}.y`, yearinput);

  if (yearinput.toString().length != 4) {
    setFieldValue(`${name}.m`, "")
    setFieldValue(`${name}.d`, "")
  }

  if (!e.target.value) {
    setFieldValue(`${name}.s`, "8");
    setFieldValue(`${name}.m`, "");
    setFieldValue(`${name}.d`, "")
  } else {
    if (values.matchExact) {
      setFieldValue(`${name}.s`, "2");
    }
  }
};

export const handleMonth = (e, setFieldValue, values, name) => {
  const monthValue = e.target.value
  setFieldValue(`${name}.m`, e.target.value)
  // To reassign day value after selecting different month 
  setFieldValue(`${name}.d`, "")
  if (monthValue && values.matchExact) {
    setFieldValue(`${name}.s`, "1")
  } else {
    setFieldValue(`${name}.s`, "8")
    if (values.matchExact) {
      setFieldValue(`${name}.s`, "2")
    }
  }
  if (!e.target.value) {
    setFieldValue(`${name}.d`, "")
    if (values.matchExact) {
      setFieldValue(`${name}.s`, "2")
    } else {
      setFieldValue(`${name}.s`, "8")
    }
  }
}

export const handleDay = (e, setFieldValue, values, name, monthValue) => {
  const dayValue = e.target.value
  setFieldValue(`${name}.d`, e.target.value)
  if (dayValue && values.matchExact) {
    setFieldValue(`${name}.s`, "0")
  } else {
    setFieldValue(`${name}.s`, "8")
    if (values.matchExact) {
      setFieldValue(`${name}.s`, "1")
    }
  }
  if (!e.target.value) {
    setFieldValue(`${name}.d`, "")
    if (values.matchExact && monthValue) {
      setFieldValue(`${name}.s`, "1")
    } else {
      setFieldValue(`${name}.s`, "8")
    }
  }
}

export const DateDropdownValues = (yearValue, monthValue, dayValue) => {
  let options = {};
  if (yearValue) {
    options = getBeforeAfterOptions();
  }
  if (monthValue) {
    options = getYearMonthOptions();
  }
  if (dayValue) {
    options = getDayOptions();
  }
  return options;
};

export const typeSearchDefaultMassachusetts = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    yearMatch: "8",
    DeathSelfPlace: "1",
  };
};

export const getMassachusettsDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, yearMatch, DeathSelfPlace } = typeSearchDefaultMassachusetts();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    d: {
      y: {
        y: "",
        s: yearMatch
      },
      li: {
        i: "",
        s: DeathSelfPlace,
      },
      l: {
        l: "",
        s: DeathSelfPlace,
      }
    },
    Death: {
      id: "",
      name: ""
    }
  }
}

export const typeSearchDefaultNYC = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    yearMatch: "8",
    MarriagePlace: "1",
  };
};

export const getNYCDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, yearMatch, MarriagePlace } = typeSearchDefaultNYC();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    g: "",
    s: {
      fm: {
        t: "",
        s: FirstNameMatch,
      },
      ln: {
        t: "",
        s: LastNameMatch,
      },
    },
    m: {
      y: {
        y: "",
        s: yearMatch
      },
      li: {
        i: "",
        s: MarriagePlace,
      },
      l: {
        l: "",
        s: MarriagePlace,
      }
    },
    Marriage: {
      id: "",
      name: ""
    }
  }
}

export const typeSearchDefaultWashingtonMarriages = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    MarriagePlace: "1",
    yearMatch: "8",
  };
};

export const getWashingtonMarriagesDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, MarriagePlace, yearMatch } = typeSearchDefaultWashingtonMarriages();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    g: "",
    s: {
      fm: {
        t: "",
        s: FirstNameMatch,
      },
      ln: {
        t: "",
        s: LastNameMatch,
      },
    },
    m: {
      y: {
        y: "",
        m: "",
        d: "",
        s: yearMatch
      },
      li: {
        i: "",
        s: MarriagePlace,
      },
      l: {
        l: "",
        s: MarriagePlace,
      }
    },
    Marriage: {
      id: "",
      name: ""
    }
  }
}

export const getLinkStory = ({ refType, treeId, primaryPersonId, storyId }) => {
  let url;
  let storyUrl = storyId ? `/${storyId}` : ``
  if (refType === "1" && treeId && primaryPersonId) {
    url = `/1${storyUrl}/${treeId}/${primaryPersonId}`
  } else if (refType === "1") {
    url = `/1${storyUrl}`
  } else if (refType === "2") {
    url = `/2${storyUrl}/${treeId}/${primaryPersonId}?tab=0`
  } else if (treeId && primaryPersonId) {
    url = `/2${storyUrl}/${treeId}/${primaryPersonId}?tab=0`
  } else {
    url = `/0${storyUrl}`
  }
  return url
}
export const getStoryRedirectUrl = ({ refType, treeId, primaryPersonId }) => {
  let url = '/'
  if (refType === "1") {
    url = '/stories'
  } else if (refType === "2" || (treeId && primaryPersonId)) {
    url = `/family/person-page/${treeId}/${primaryPersonId}?tab=0`
  } else if (refType === "3") {
    url = '/notifications'
  }
  return url;
}

export const typeSearchDefaultUSCensus = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    residenceMatch: "1"
  };
};

export const getUSCensusDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, residenceMatch } = typeSearchDefaultUSCensus();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    s: "",
    r: {
      li: {
        i: "",
        s: residenceMatch,
      },
      l: {
        l: "",
        s: residenceMatch,
      },
    },
    Res: {
      id: "",
      name: ""
    }
  };
};

export const getLabel = (option) => {
  const name = [];
  if (option.givenName) {
    name.push(option.givenName);
  }
  if (option.surname) {
    name.push(option.surname);
  }
  return name.join(" ");
}

export const getFixNumWithStr = (str) => {
  str = str.toUpperCase();
  let num = 0;
  if (str.length === 1) {
    num = str.charCodeAt(0);
  } else if (str.length > 1) {
    num = str.charCodeAt(0) + str.charCodeAt(1);
  }
  return num % 4;
}

export const getRange = (max) => {
  let byteArray = new Uint16Array(1);
  window.crypto.getRandomValues(byteArray);
  return byteArray[0] % max;
}

export const typeSearchDefaultTexasMarriages = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    DateMatch: "8",
    PlaceMatch: "1",
  };
};

export const getTexasMarriagesDefaultValues = () => {
  const { FirstNameMatch, LastNameMatch, DateMatch, PlaceMatch } = typeSearchDefaultTexasMarriages();
  return {
    fm: {
      t: '',
      s: FirstNameMatch
    },
    ln: {
      t: '',
      s: LastNameMatch
    },
    b: {
      y: '',
      s: DateMatch
    },
    s: {
      fm: {
        t: '',
        s: FirstNameMatch
      },
      ln: {
        t: '',
        s: LastNameMatch
      }
    },
    m: {
      y: {
        y: '',
        m: '',
        d: '',
        s: DateMatch
      },
      li: {
        i: '',
        s: PlaceMatch
      },
      l: {
        l: '',
        s: PlaceMatch
      }
    },
    Marriage: {
      id: "",
      name: ""
    }
  }
}

export const typeSearchDefaultUSFederal1800 = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    PlaceMatch: "1",
  };
};

export const getUSFederal1800DefaultValues = () => {
  const { FirstNameMatch, LastNameMatch, PlaceMatch } = typeSearchDefaultUSFederal1800();
  return {
    fm: {
      t: '',
      s: FirstNameMatch
    },
    ln: {
      t: '',
      s: LastNameMatch
    },
    r: {
      li: {
        i: '',
        s: PlaceMatch
      },
      l: {
        l: '',
        s: PlaceMatch
      }
    },
    sr: "",
    Residence: {
      id: "",
      name: ""
    }
  }
}

export const getCardNames = (fullName) => {
  const names = fullName.split(" ");
  return {
    firstName: names[0],
    lastName: names[1],
  };
};

export const getDateStrings = (date) => {
  const names = date.split("/");
  return {
    month: names[0],
    year: names[1],
  };
};

export const getDate = (dateObj) => {
  const { day, month, year, isNormalized, rawDate } = dateObj
  if (isNormalized) {
    const date = `${year}/${month}/${day}`
    return new Date(date).toLocaleDateString('en-GB', {
      day: "numeric",
      month: 'short',
      year: 'numeric',
    })
  } else {
    return rawDate
  }
}
export const getMaskDate = (dateObj) => {
  const { day, month, year } = dateObj;
  return `${day}, ${month}, ${year}`;
};
export const typeSearchDefaultMassachusettsMarriages = () => {
  return {
    FirstNameMatch: "2",
    DateMatch: "8",
    PlaceMatch: "1",
    LastNameMatch: "2",
  };
};

export const getMassachusettsMarriagesDefaultValues = () => {
  const { FirstNameMatch, LastNameMatch, DateMatch, PlaceMatch } = typeSearchDefaultMassachusettsMarriages();
  return {
    fm: {
      t: '',
      s: FirstNameMatch
    },
    ln: {
      t: '',
      s: LastNameMatch
    },
    m: {
      li: {
        i: '',
        s: PlaceMatch
      },
      l: {
        l: '',
        s: PlaceMatch
      },
      y: {
        y: "",
        m: "",
        d: "",
        s: DateMatch
      }
    },
    Marriage: {
      id: "",
      name: ""
    }
  }
}

export const typeSearchDefaultOhioDeaths = () => {
  return {
    FirstNameMatch: "2",
    LastNameMatch: "2",
    DateMatch: "8",
    DeathSelfPlace: "1",
  };
};

export const getOhioDeathsDefaultValue = () => {
  const { FirstNameMatch, LastNameMatch, DateMatch, DeathSelfPlace } = typeSearchDefaultOhioDeaths();
  return {
    fm: {
      t: "",
      s: FirstNameMatch,
    },
    ln: {
      t: "",
      s: LastNameMatch,
    },
    d: {
      y: {
        y: "",
        m : "",
        d : "",
        s: DateMatch
      },
      li: {
        i: "",
        s: DeathSelfPlace,
      },
      l: {
        l: "",
        s: DeathSelfPlace,
      }
    },
    Death: {
      id: "",
      name: ""
    }
  }
}


export const getFormattedDate = (year, month, day) => {
  if (year && month && day) {
    const date = `${year}/${month}/${day}`
    return new Date(date).toLocaleDateString('en-GB', {
      day: "numeric",
      month: 'short',
      year: 'numeric',
    })
  } else if (year && month) {
    const date = `${year}/${month}`
    return new Date(date).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    })
  } else {
    return year
  }
}

export const routeNames = [
  "/search/world-war-i-casualties/result",
  "/search/world-war-ii-army-enlistments/result",
  "/search/1790-united-states-federal-census/result",
  "/search/1800-united-states-federal-census/result",
  "/search/1810-united-states-federal-census/result",
  "/search/1820-united-states-federal-census/result",
  "/search/1830-united-states-federal-census/result",
  "/search/1940-united-states-federal-census/result",
  "/search/massachusetts-state-deaths/result",
  "/search/united-states-social-security-death-index/result",
  "/search/russian-immigrants/result",
  "/search/german-immigrants/result",
  "/search/italian-immigrants/result",
  "/search/irish-famine-passenger-records/result",
  "/search/massachusetts-state-marriages/result",
  "/search/texas-marriages/result",
  "/search/washington-state-marriages/result",
  "/search/new-york-city-marriages/result",
  "/search/ohio-state-deaths/result"
];
export const storyWordCountForm = (formik) => {
	let count = formik.values.content?.length,
		newLine = formik.values.content?.split("\n")?.length - 1;
	if (!formik.dirty) {
		count = formik.values.content?.length - newLine;
	}
	return count;
}
export const GetCharacterCountForm = ({ ipadView, formik, ClassNames }) => {
	const values = formik.values
	const contentLength = (ipadView) ? values.ModalContent.length : storyWordCountForm(formik);
	return <span className={ClassNames('count p-1', { 'bg-orange-300 text-gray-600': (contentLength > 450 && contentLength < 500), 'bg-maroon-500 text-white': contentLength > 500 })}  >{contentLength}/500</span>
}