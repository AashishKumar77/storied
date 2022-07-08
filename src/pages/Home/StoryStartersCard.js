import React from "react";
import Typography from "./../../components/Typography";
import Vector from "./../../assets/images/story-starters-vector.svg";
const StoryStartersCard = () => {
  return (
    <div id="story-card" className="bg-white card recent-people-card">
      <div className="card-content-wrap py-3 px-6">
        <div className="head flex justify-between items-center mb-4">
          <h3>
            <Typography size={14} text="secondary" weight="medium">
              Story Starters
            </Typography>
          </h3>
          <p>
            <Typography size={14}>Coming soon</Typography>
          </p>
        </div>
        <div className="card-content pb-3">
          <div className="vector bg-skyblue-100 rounded-lg flex w-full justify-center p-6">
            <img src={Vector} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default StoryStartersCard;
