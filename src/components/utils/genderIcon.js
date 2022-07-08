import men from "./../../assets/images/maleVectoriconlg.svg";
import women from "./../../assets/images/femaleVectoriconlg.svg";
import other from "./../../assets/images/otherVectoriconlg.svg";
import { FEMALE, MALE } from "../../utils";
export const getPersonProfileUrl = (person) => {
  let imgUrl = other,
    femaleCond,
    maleCond;
  if (typeof person?.gender === "string") {
    femaleCond = person?.gender === FEMALE || person?.gender === "F";
    maleCond = person?.gender === MALE || person?.gender === "M";
  } else {
    femaleCond = person?.gender?.gender === FEMALE || person?.gender?.gender === "F" || person?.gender?.Gender === FEMALE || person?.gender?.Gender === "Female";
    maleCond = person?.gender?.gender === MALE || person?.gender?.gender === "M" || person?.gender?.Gender === MALE || person?.gender?.Gender === "Male";
  }
  if (person?.profileImageUrl) {
    imgUrl = person?.profileImageUrl;
  } else if (femaleCond) {
    imgUrl = women;
  } else if (maleCond) {
    imgUrl = men;
  }
  return imgUrl;
};
