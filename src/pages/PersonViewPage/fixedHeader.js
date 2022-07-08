import React from "react";
import "./index.css";

// Components
import Button from "../../components/Button";
import Typography from "../../components/Typography";
import Icon from "../../components/Icon";
import {titleCase} from "../../components/utils/titlecase"

// Local Components
import Tabs from "./tabs";
import Uploader from "./uploader";

const FixedHeader = ({
  personalInfo,
  handleViewTree,
  ...props
}) => {
  let imgSrc = personalInfo.profileImageUrl;

  return (
    <div className="fixed-header">
      <div className="header-grey-bg">
        <div className="main-wrapper flex justify-between items-center py-2 mx-auto">
          <div className="profile-details flex items-center w-full lg:w-2/5">
            <div className="person-img">
              <Uploader imgSrc={imgSrc} {...props}/>
            </div>
            <div className="person-name">
              <div className="person-title line-clamp-2">
                <Typography size={20} text="secondary" weight="bold">
                  {`${titleCase(personalInfo.givenName.givenName)} ${titleCase(personalInfo.surname.surname)}`}
                </Typography>
              </div>
            </div>
          </div>
          <div className="nav-section">
            <nav className="flex space-x-2 md:space-x-4">
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
    </div>
  );
};

export default FixedHeader;
