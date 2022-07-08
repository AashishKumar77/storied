import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Typography from "./../../components/Typography";
import Button from "./../../components/Button";
import { getAvatarName } from "../../utils";

const TellStory = () => {
  const history = useHistory();
  const { userFirstName, userLastName, imgSrc } = useSelector((state) => state.user);
  const handleAddStory = () => {
    history.push(`/stories/add/0`);
  };
  return (
    <div className="bg-white card w-full">
      <div className="card-content-wrap">
        <div className="py-4 px-6">
          <div className="flex items-center">
            <div className="mr-4 card-avatar avtar-circle-large rounded-full overflow-hidden w-10 h-10 bg-gray-700 flex items-center justify-center">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  className="w-10 h-10 rounded-full object-cover bg-gray-300"
                  alt="user"
                />
              ) : (
                <Typography size={14} text="secondary" weight="medium">
                  <span className="text-white">
                    {userFirstName && getAvatarName(userFirstName)}
                    {userLastName && getAvatarName(userLastName)}
                  </span>
                </Typography>
              )}
            </div>
            <div className="flex-grow">
              <div className="tell-story-button">
                <Button
                  handleClick={handleAddStory}
                  size="large"
                  title="Tell a story..."
                  type="default"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TellStory;
