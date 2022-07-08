import { v4 as uuidv4 } from "uuid";

const jsonData = (title, gender, path) => {
  return {
    id: "",
    parentId: uuidv4(),
    name: "",
    firstName: "",
    lastName: "",
    isLiving: true,
    attributes: {
      title: title,
      gender: gender,
      birth: {
        RawDate: "",
        IsApproximate: null,
        IsNormalized: null,
        DayValue: null,
        MonthValue: null,
        YearValue: null,
        Day: "",
        Month: "",
        Year: "",
        NormalizedDate: null,
        Qualifier: null,
      },
      death: {
        RawDate: "",
        IsApproximate: null,
        IsNormalized: null,
        DayValue: null,
        MonthValue: null,
        YearValue: null,
        Day: "",
        Month: "",
        Year: "",
        NormalizedDate: null,
        Qualifier: null,
      },
      birthLocation: "",
      deathLocation: "",
      path: path,
      cFilialId: "",
      imgsrc: "",
      type: "",
      relatedParentIds: null,
    },
  };
};

const generatePath = (childPathVar, gender) => {
   let elements = childPathVar && childPathVar.split("/");
   if (gender === "Male") {
     elements.push("0");
   } else elements.push("1");
 
   elements = elements.join("/");
   return elements;
 };

 export const parentsplaceholder = (obj) => {
  let childPath = obj.attributes.path;
  return [
    jsonData("Add Father", "Male", generatePath(childPath, "Male")),
    jsonData("Add Mother", "Female", generatePath(childPath, "Female")),
  ];
};
