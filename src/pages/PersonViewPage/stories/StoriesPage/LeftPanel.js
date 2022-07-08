import React, { useState, useEffect } from "react";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { icons } from "./icons";
import { getLeftPanelDetails } from "../../../../redux/actions/story";
import { useDispatch, useSelector } from "react-redux";
import LeftLoader from "./contentLoader/Left";
import queryString from "query-string";
import { getQueryParam } from "./../../../../components/utils";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

const LeftPanel = ({storiesTab}) => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { treeId, primaryPersonId } = useParams();
  const [MViewDropdown, setMViewDropdown] = useState(false);

  useEffect(() => {
    if(primaryPersonId && treeId) {
      dispatch(getLeftPanelDetails({ personId: primaryPersonId, treeId }));
    } else {
      dispatch(getLeftPanelDetails());
    }
  }, [dispatch, primaryPersonId, treeId]);

  const { leftPanelDetails, isLoading } = useSelector((state) => state.story);
  const categoryName = queryString.parse(getQueryParam()).categoryName;
  const selectedCategory = (key) => {
    let searchValue = location.search.split("=")[1];
    if (searchValue === undefined || location.search === "?tab=0") {
      searchValue = "AllStories";
    }
    if (searchValue === key) {
      return "is-active";
    }

    return "";
  };

  const handleClick = (key) => {
    setMViewDropdown(false)
    if (key !== "AllStories") {
      return history.push(`${location.pathname}?categoryName=${key}`);
    } else {
      return history.push(`${location.pathname}`);
    }
  };

  const disableButtonCursor = () => {
    if(leftPanelDetails && leftPanelDetails.AllStories < 1){
      return "cursor-default"
    }
    return ""
  }

  return (
    <>
      {" "}
      <div className="tw-stories-left-panel pt-2 lg:pt-0">
        <div className="tw-left-side-content flex w-full lg:block">
          <div className="add-story-top ml-4 lg:ml-0 lg:mb-3 flex lg:w-full order-2 whitespace-nowrap">
            <Button
              handleClick={() =>{
                let url = `/stories/add/${storiesTab?"1":"2"}`
                if(treeId && primaryPersonId) {
                  url = `${url}/${treeId}/${primaryPersonId}`
                }
                history.push(url)
              }}
              size="large"
              title="Add Story"
            />
          </div>
          <ClickAwayListener onClickAway={() => setMViewDropdown(false)}>
            <div
              className={`tw-sidebar-items-wrap w-full relative ${MViewDropdown ? "dd-open" : ""
                }`}
            >
              <div className="device-cat-dd lg:hidden">
                <div className="active-cat-item is-relative flex w-full items-center" onClick={() => setMViewDropdown(prev => !prev)}>
                  <span class="icon w-8 mr-0.5 ml-1.5">
                    {categoryName ? icons[categoryName] : icons.AllStories}
                  </span>
                  <Typography size={14} weight="medium">{categoryName ? categoryName : "All Stories"}</Typography>
                  <span className="absolute right-4 top-4"><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1.13833L6.23556 5.90233C6.20464 5.93329 6.16792 5.95786 6.1275 5.97461C6.08708 5.99137 6.04376 6 6 6C5.95624 6 5.91292 5.99137 5.8725 5.97461C5.83208 5.95786 5.79536 5.93329 5.76444 5.90233L1 1.13833" stroke="#747578" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  </span>
                </div>

              </div>
              <div className={`w-full dd-content absolute overflow-visible lg:relative bg-white z-10 shadow lg:shadow-none rounded-lg w-full py-2 lg:py-1 ${!MViewDropdown ? "hidden" : ""
                } lg:block`}>
                <div className="tw-sidebar-list-items">
                  {isLoading ? (
                    <LeftLoader />
                  ) : (
                    leftPanelDetails &&
                    Object.entries(leftPanelDetails).map(([key, value], i) => (
                      <button
                        disabled={leftPanelDetails && leftPanelDetails.AllStories < 1 ? true : false}
                        onClick={() => handleClick(key)}
                        key={key}
                        className={`tw-list-item ${disableButtonCursor()} rounded-full btn flex  w-full pr-1 ${selectedCategory(
                          key
                        )} `}
                      >
                          {Object.entries(icons).map(([iconKey, iconValue]) => {
                            if (iconKey === key) {
                              return (
                                <span key={iconKey} className={`icon ${disableButtonCursor()} flex justify-center mr-4 ml-1.5`}>
                                   {iconValue}
                                </span>
                              );
                            }
                          })}
                        <Typography
                          weight="medium"
                          text={selectedCategory(key) ? "danger" : "default"}
                          size={14}
                        >
                          {key === "AllStories" ? "All Stories" : key}                          
                        </Typography>
                        <Typography                          
                          text={selectedCategory(key) ? "danger" : "default"}
                          size={14}
                        >
                          <span className={`count pl-2`}>({value})</span>
                        </Typography>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* <LeftLoader/> */}
            </div>
          </ClickAwayListener>
        </div>
      </div>
    </>
  );
};

export default LeftPanel;