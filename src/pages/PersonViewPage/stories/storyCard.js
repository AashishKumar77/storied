import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import Typography from "./../../../components/Typography";
import { getPersonProfileUrl } from "./../../../components/utils/genderIcon";
import "./../index.css";
import { LAYOUT_ID, getWidgetClass } from "./../../../utils";
import { getHomeStoryAndUpdateList } from "../../../redux/actions/homepage";
import { getStoryAndUpdateList } from "../../../redux/actions/story";
import GridLoader from "./StoriesPage/contentLoader/GridLoader";
const getPersonMore = (person) => {
  if (person.length > 1) {
    return (
      <div className="flex items-center ml-8">
        <div className="media-info flex-grow avtar-square-small-name">
          <h4 className="main-title">
            <Typography size={14} text="secondary">
              +{person.length - 1} more {person.length === 2 ? "person" : "people"}
            </Typography>
          </h4>
        </div>
      </div>
    );
  }
  return null;
};
const getImageUrl = (img) => {
  return img?.url;
};
const getImage = (item, Img2smalClas) => {
  let html = null;
  let imageProps1 = {};
  let imageProps2 = {};
  if (Img2smalClas[0]) {
    imageProps1 = Img2smalClas[0];
  }
  if (Img2smalClas[1]) {
    imageProps2 = Img2smalClas[1];
  }

  if (item?.storyImages?.length) {
    html = (
      <div className="added-story-img w-full mb-2">
        <div className={`story-img-container ${Img2smalClas[0] ? "st-sm-img" : ""}`}>
          <img {...imageProps1} src={getImageUrl(item.storyImages[0])} className="rounded-lg" alt="img" />
        </div>
        {item.layoutId === LAYOUT_ID.TWO_IMAGE && (
          <div className={`story-img-container ${Img2smalClas[1] ? "st-sm-img" : ""}`}>
            <img {...imageProps2} src={getImageUrl(item.storyImages[1])} className="rounded-lg" alt="img" />
          </div>
        )}
      </div>
    );
  }
  return html;
};
const getMenu = (item, key, clas, TypoProps = {}) => {
  let html = null;
  if (item) {
    if (key === "place" || key === "date") {
      html = (
        <span className={clas}>
          <Typography {...TypoProps} size={12}>
            {item}
          </Typography>
        </span>
      );
    } else {
      html = (
        <p className={clas}>
          <Typography {...TypoProps} size={14}>
            {item}
          </Typography>
        </p>
      );
    }
  }
  return html;
};

const getContentClass = (item) => {
  let clas = "story-text ";
  if (item?.storyImages?.length) {
    clas += "three-lines";
  }
  return clas;
};
const getMenuValue = (item) => {
  let html = [];
  if (item["date"]) {
    html.push(item["date"]);
  }
  if (item["place"]) {
    html.push(item["place"]);
  }
  return html.map((_html) => _html).reduce((acc, x) => (acc === null ? [x] : [acc, <span className="dot-seprator"></span>, x]), null);
};
const StoryCard = ({ item = { title: "Painting & Auto Body", place: "California, USA", date: "1932", content: "Upon returning to California from Carthage Missouri, in 1932, the first job that Roy Franklin Walker could get was this is" }, index, personView = false }) => {
  const dispatch = useDispatch();
  const storyRef = useRef(null);
  const io = useRef(null);
  const [Img2smalClas, setImg2smalClas] = useState([false, false]);
  const loadMore = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        let storyId = typeof item === "string" ? item : item?.storyId;
        if (personView) {
          dispatch(getHomeStoryAndUpdateList({ storyId: storyId }));
        } else {
          setTimeout(() => {
            dispatch(getStoryAndUpdateList({ storyId: storyId }));
          }, 1000);
        }
        storyRef.current && io.current.unobserve(storyRef.current);
      }
    });
  }, []);
  useEffect(() => {
    if (storyRef.current) {
      const options = {
        root: null, // window by default
        rootMargin: "50px",
        threshold: 0,
      };
      io.current = new IntersectionObserver(loadMore, options);
      io.current.observe(storyRef.current);
    }
    return () => {
      storyRef.current && io.current.unobserve(storyRef.current);
    };
  }, [storyRef, loadMore]);
  useEffect(() => {
    const updateState = () => {
      let img1 = new Image(),
        img2 = new Image();
      img1.src = getImageUrl(item.storyImages[0]);
      img2.src = getImageUrl(item.storyImages[1]);
      img1.onload = () => {
        const actualWidth = Math.round(img1.naturalWidth / 1.5444);
        const actualHeight = Math.round(img1.naturalHeight / 1.5444);
        if (actualWidth < 259 || actualHeight < 186) {
          setImg2smalClas((prev) => {
            prev[0] = {
              style: {
                width: "100%",
                height: actualHeight,
                objectFit: "cover",
                backgroundColor: "rgba(0,0,0,0.5)",
              },
              width: actualWidth,
              height: actualHeight,
            };
            return [...prev];
          });
        }
      };
      img2.onload = () => {
        const actualWidth = Math.round(img2.naturalWidth / 1.5444);
        const actualHeight = Math.round(img2.naturalHeight / 1.5444);
        if (actualWidth < 259 || actualHeight < 186) {
          setImg2smalClas((prev) => {
            prev[1] = {
              style: {
                width: "100%",
                height: actualHeight,
                objectFit: "cover",
              },
              width: actualWidth,
              height: actualHeight,
            };
            return [...prev];
          });
        }
      };
    };
    if (item.layoutId === LAYOUT_ID.TWO_IMAGE && item?.storyImages?.length) {
      updateState();
    }
  }, [item]);
  return (
    <div ref={storyRef}>
      {typeof item === "string" ? (
        <div className="flex flex-grow flex-wrap flex-shrink-0">
          <GridLoader grid={1} isStory={true} />
        </div>
      ) : (
        <div className={`story-card-content ${getWidgetClass(item.layoutId)}`}>
          {getImage(item, Img2smalClas)}
          <div className="added-story-text px-1">
            <div className="head mb-2">
              <h3 className="title-story">
                <Typography size={24} text="secondary" weight="lyon-medium">
                  {item?.title}
                </Typography>
              </h3>
            </div>
            <div className="added-story-desc">
              <div className="flex mb-2 date-place-wrap">{getMenu(getMenuValue(item), "date", "")}</div>
              {getMenu(item["content"], "content", getContentClass(item), { text: "secondary" })}
            </div>
            {personView && (
              <div className="added-prsns-in-sc mt-2.5">
                <div className="flex items-center mb-1">
                  <div className="media w-6 h-6 overflow-hidden mr-2.5 avtar-square-small">
                    <img src={getPersonProfileUrl(item.personDetail[0])} class="object-cover w-6 h-6 rounded-md" alt="Profile Pic" />
                  </div>
                  <div className="media-info flex-grow avtar-square-small-name">
                    <h4 className="main-title">
                      <Typography size={14} text="secondary">
                        {item.personDetail[0]?.givenName?.givenName} {item.personDetail[0]?.surname?.surname}
                      </Typography>
                    </h4>
                  </div>
                </div>
                {getPersonMore(item.personDetail)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default StoryCard;
