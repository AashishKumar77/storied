import React from "react";
import Skeleton from "./../../../../../components/Skeleton";
import './index.css';
const GridLoader = ({grid = 3,isStory=false}) => {

  return Array.from({length: grid}, (_, i) => i + 1).map((item) => (
    <>
      <div className={`flex-col flex loader-grid loader-grid-${grid} px-3 ${isStory ? 'loader-full' : ''}`} key={item}>
        <div className="img-loader-area rounded-lg overflow-hidden">
          <Skeleton variant={"rect"} width={"100%"} height={"100%"} />
        </div>
        <div className="story-info-loader">
          {" "}
          <Skeleton variant={"text"} width={"46%"} />
          <Skeleton variant={"text"} width={"100%"} />
          <Skeleton variant={"text"} width={"100%"} />
          <Skeleton variant={"text"} width={"80%"} />
        </div>
      </div>
    </>
  ));
};

export default GridLoader;
