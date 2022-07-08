import React from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import AllStories from "./allStories";
import "./index.css";
const StoriesPage = ({ 
  stories, 
  isStoryEmpty, 
  isLoading, 
  paginationLoader, 
  rightPanel = true, 
  personView = false,
  grid = 3,
  storiesTab = false,
  noTree,
  columnsCountBreakPoints = { 510: 1, 511: 2, 1280: 3 }, 
  midleClass="stories-middle-content" }) => {

  return (
    <>
      <div className="lg:flex justify-between">
        <LeftPanel storiesTab = {storiesTab}/>
        <div className="all-stories-container flex flex-grow pt-6 lg:pt-0 ">
          <div className="middle-content-col flex flex-grow">
            <div className={`${midleClass}`}>
              <AllStories storiesTab = {storiesTab} noTree={noTree} grid={grid} personView={personView} paginationLoader ={paginationLoader} stories={stories} isStoryEmpty={isStoryEmpty} isLoading={isLoading} columnsCountBreakPoints = {columnsCountBreakPoints}/>
            </div>
          </div>
          {rightPanel && <RightPanel />}
        </div>
      </div>
    </>
  );
};

export default StoriesPage;
