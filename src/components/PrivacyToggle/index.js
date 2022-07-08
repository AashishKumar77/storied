import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import Typography from "./../../components/Typography";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { updatePrivacyStatus } from './../../redux/actions/story'
import VectorIicon from "../../assets/images/vector-icon.svg";
import { tr } from "./../../components/utils";

const PrivacyToggle = props => {
  const { view } = useSelector(state => state.story)
  const [selectedValue, setSelectedValue] = useState(view?.privacy === "Private" ? "Private" : "Public")
  const [showWidget, setShowWidget] = useState(false)
  const {storyId} = useParams()
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const handleSelect = (privacy) => {
    setShowWidget(false);
    if(props.isViewMode) {
      dispatch(updatePrivacyStatus(storyId, privacy));
    } else {
      setSelectedValue(privacy);
      props.formik.setFieldValue(props.name, privacy);
    }
  };

  const handleToggle = (event) => {
    event.preventDefault();
    setShowWidget(prev => !prev)
  };

  useEffect(() => {
    setSelectedValue(view?.privacy === "Private" ? "Private" : "Public");
  }, [view?.privacy]);

    return <>
      <div className="flex cursor-pointer" onClick={handleToggle} >
        <Typography size={14}>
          {selectedValue}
        </Typography>
        <span className="icon relative top-0.5 left-1">
        <img src={VectorIicon} alt="" />
        </span>
      </div>
      {showWidget ?
        <ClickAwayListener onClickAway={() => setShowWidget(false)}>
          <div className="privacy-dropdown absolute top-7 -right-4 desktop:right-auto desktop:-left-4 bg-white rounded-lg py-2.5">
            <div className="dropdown-content">
                        <button onClick={() => handleSelect("Public")} className="dropdown-option w-full text-left whitespace-nowrap flex flex-col py-2 px-4 hover:bg-gray-100">
                <Typography size={14} text="secondary">
                  {tr(t, "stories.public")}
                </Typography>
                <Typography size={12}>
                  {tr(t, "stories.publicSubText")}
                </Typography>
              </button>
                        <button onClick={() => handleSelect("Private")} className="dropdown-option w-full text-left whitespace-nowrap flex flex-col py-2 px-4 hover:bg-gray-100">
                <Typography size={14} text="secondary">
                  {tr(t, "stories.private")}
                </Typography>
                <Typography size={12}>
                  {tr(t, "stories.privateSubText")}
                </Typography>
              </button>
            </div>
          </div>
        </ClickAwayListener>
        : null}
    </>
}
export default PrivacyToggle
