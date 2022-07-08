import React from "react";
import "./index.css";

// Components
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import Typography from "../../components/Typography";
import Translator from "../../components/Translator"
import {titleCase} from "../../components/utils/titlecase"

// Local Components
import Tabs from "./tabs";
import Uploader from "./uploader";

const MainHeader = ({
  personalInfo,
  relation,
  handleViewTree,
  ...props
}) => {
  let birthDate = personalInfo.birthDate.rawDate;
  let birthLocation = personalInfo.birthPlace;
  let deathDate = personalInfo.deathDate.rawDate;
  let deathLocation = personalInfo.deathPlace;
  let isLiving = personalInfo.isLiving;
  let birthInfo, deathInfo;

  //For birth date
  if (birthDate && birthLocation) {
    birthInfo = birthDate + " ∙ " + birthLocation;
  } else if (birthDate) {
    birthInfo = birthDate;
  } else if (birthLocation) {
    birthInfo = birthLocation;
  } else {
    birthInfo = "Unknown";
  }

  //For death date
  if (deathDate && deathLocation) {
    deathInfo = deathDate + " ∙ " + deathLocation;
  } else if (deathDate) {
    deathInfo = deathDate;
  } else if (deathLocation) {
    deathInfo = deathLocation;
  } else if (isLiving) {
    deathInfo = "Living";
  } else {
    deathInfo = "Unknown";
  }

  let imgSrc = personalInfo.profileImageUrl;

  return (
    <div className="main-header">
      <div className="person-page-header header-grey-bg min-h-37">
        <div className="main-wrapper mx-auto w-full">
          <div className="profile-details flex">
            <div className="person-img mb-2 smm:mb-0">
              <Uploader imgSrc={imgSrc} {...props}/>     
            </div>
            <div className="person-name w-full">
              <div className="person-title mb-0.5 min-h-15">
                <Typography size={48} text="secondary" weight="bold">
                  {`${titleCase(personalInfo.givenName.givenName)} ${titleCase(personalInfo.surname.surname)}`}
                </Typography>
              </div>
              <div className="birth-details">
                <div className="birth-info mb-0.5">
                  <span>
                    <Typography text="secondary" weight="light">
                      <Translator tkey="person.header.b" />
                      {` ${titleCase(birthInfo)}`}
                    </Typography>
                  </span>
                </div>
                <div className="death-info mb-0.5">
                  <span>
                    <Typography text="secondary" weight="light">
                      <Translator tkey="person.header.d" />
                      {` ${titleCase(deathInfo)}`}
                    </Typography>
                  </span>
                </div>
                <div className="h-7">
                  <Typography text="secondary" weight="light">
                    {relation.name}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-wrapper mx-auto bg-white">
        <div className="tab-section">
          <nav className="flex">
            <Tabs tab={props.tab} handleTab={props.handleTab} />
          </nav>

          <div className="menu-button">
            <span className="inline-block">
              <Button
                type="default"
                size="medium"
                icon="search"
                tkey="person.btn.search"
              />
            </span>
            <span className="inline-block ml-2">
              <Button
                type="default"
                size="medium"
                icon="plant"
                tkey="person.btn.viewtree"
                handleClick={handleViewTree}
              />
            </span>
          </div>
          <div className="icon-button">
            <span className="inline-block">
              <Icon background type="search" />
            </span>
            <span className="inline-block ml-2">
              <Icon background type="tree" handleClick={handleViewTree} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHeader;