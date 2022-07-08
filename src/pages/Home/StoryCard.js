import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getImageSizeList, LAYOUT_ID, getWidgetClass, getLinkStory } from "../../utils";
import { getDateString } from "../../components/utils";
import Typography from "./../../components/Typography";
import MyTooltip from "../../components/Tooltip";
import TailwindModal from "../../components/TailwindModal";
import { getPersonProfileUrl } from "../../components/utils/genderIcon";
import { updateStoryIsLiked, storylikespersons, getHomeStoryAndUpdateList } from "../../redux/actions/homepage";
import { getOwner } from "../../services";
import LikespersonsList from "./LikespersonsList";
import MiddleLoader from "./MiddleLoader";
const getImaageUrlDetail = (story, imageProps1, imageProps2, mediaRef, cardWidth) => {
  return (
    story.storyImages[0]?.url && (
      <div ref={mediaRef} className={`story-media bg-gray-300 flex ${story.storyImages[1]?.url ? "sth-two-images" : ""}`} style={story.storyImages[1]?.url ? { height: `${cardWidth / 2}px` } : {}}>
        <div className="flex justify-center sth-image items-center" style={story.storyImages[1]?.url ? { minHeight: `${cardWidth / 2}px`, maxHeight: `${cardWidth / 2}px` } : {}}>
          <img {...imageProps1} src={getImageUrl(story.storyImages[0])} alt="story Image" />
        </div>
        {story.storyImages[1]?.url && (
          <div className="flex justify-center sth-image items-center" style={{ minHeight: `${cardWidth / 2}px`, maxHeight: `${cardWidth / 2}px` }}>
            <img {...imageProps2} src={getImageUrl(story.storyImages[1])} alt="story Image" />
          </div>
        )}
      </div>
    )
  );
};

const getPersonDetail = (storyPerson) => {
  return (
    storyPerson[0] &&
    getDateString(storyPerson[0]) && (
      <p className="card-date-rel flex flex-wrap sub-title">
        <span className="date relative pr-2">
          <Typography size={10}>{storyPerson[0] && getDateString(storyPerson[0])}</Typography>
        </span>
      </p>
    )
  );
};

const handleLikeClick = (event, index, setCurrentLike, currentLike, isLiked, story, dispatch) => {
  event.stopPropagation();
  if (currentLike) return;
  let animateClass = document.querySelectorAll(".heart-animate");
  animateClass[index].classList.add("animate__pulse");
  setTimeout(() => {
    animateClass[index].classList.remove("animate__pulse");
  }, 1000);

  const likeStatus = isLiked ? "unlike" : "like";
  dispatch(updateStoryIsLiked(story?.storyId, likeStatus, index));
  setCurrentLike(true);
};

const getLabel = (option) => {
  const name = [];
  if (option.givenName) {
    name.push(option.givenName.givenName);
  }
  if (option.surname) {
    name.push(option.surname.surname);
  }
  return name.join(" ");
};
const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const getImageUrl = (img) => {
  return img.croppedImageURL ? img.croppedImageURL : img.url;
};
const getStoryDate = (createdDate, updatedDate) => {
  let result = null;

  const storyDate = updatedDate ? new Date(updatedDate) : new Date(createdDate),
    storyDay = storyDate.getDate(),
    todayDate = new Date(),
    todayDay = todayDate.getDate(),
    ONEHOUR = 60 * 60 * 1000,
    dateDiff = todayDate - storyDate,
    currentDay = storyDay === todayDay,
    diffInDays = Math.round((todayDate.getTime() - storyDate.getTime()) / (1000 * 3600 * 24));
  if (dateDiff < ONEHOUR && currentDay) {
    result = "Just now";
  } else if (dateDiff > ONEHOUR && currentDay) {
    let seconds = Math.floor(dateDiff / 1000),
      interval = seconds / 3600;
    result = `${Math.round(interval)} hours ago`;
  } else if (diffInDays < 8 && !currentDay) {
    let day = diffInDays === 0 ? 1 : diffInDays,
      str = day > 1 ? "s" : "";
    result = `${day} day${str} ago`;
  } else if (diffInDays >= 8 && !currentDay) {
    result = `${monthShortNames[storyDate.getMonth()]} ${storyDay}`;
  }
  return result;
};
const getPerson = (person, setPersonModal) => {
  if (person.length === 1) {
    return (
      <>
        {" "}
        <Typography size={14}>was</Typography>{" "}
      </>
    );
  } else if (person.length === 2) {
    return (
      <>
        {" "}
        <Typography size={14}>and</Typography>{" "}
        <Typography size={14} text="secondary" weight="bold" type="link" href={`/family/person-page/${person[1].treeId}/${person[1].id}`}>
          <span className="text-gray-700 hover:text-blue-400">
            {person[1]?.givenName?.givenName} {person[1]?.surname?.surname}
          </span>
        </Typography>{" "}
        <Typography size={14}>were</Typography>
      </>
    );
  } else if (person.length > 2) {
    return (
      <>
        {" "}
        <Typography size={14}>and</Typography>{" "}
        <Typography size={14} weight="bold" text="secondary" type="link" href="javascript:void(0);">
          <span
            className="text-gray-700 hover:text-blue-400"
            onClick={(e) => {
              e.stopPropagation();
              setPersonModal(person);
              return false;
            }}
          >
            {person.length - 1} others{" "}
          </span>
        </Typography>{" "}
        <Typography size={14}>were </Typography>
      </>
    );
  }
};

const calculateHeightWidth = (actualWidth, actualHeight, width, height, story, cardWidth) => {
  let newWidth = width,
    newHeight = height;
  if (story.layoutId === LAYOUT_ID.TWO_IMAGE) {
    if (actualWidth > cardWidth / 2 && actualHeight > cardWidth / 2) {
      newWidth = "100%";
      newHeight = "100%";
    } else if (actualWidth < cardWidth / 2 && actualHeight > cardWidth / 2) {
      newWidth = cardWidth / 2;
      newHeight = "100%";
    } else if (actualWidth > cardWidth / 2 && actualHeight < cardWidth / 2) {
      newWidth = "100%";
      newHeight = cardWidth / 2;
    }
  }
  return { newWidth, newHeight };
};
const StoryCard = ({ story, storyIndex }) => {
  const [Img2smalClas, setImg2smalClas] = useState([false, false]);
  const [showModal, setModal] = useState(false);
  const [isLiked, setIsLiked] = useState(story?.likes?.some((e) => e.userId === getOwner()));
  const [currentLike, setCurrentLike] = useState(false);
  const [showLikedByModal, setIsLikedByModal] = useState(false);
  const [cardWidth, setCardWidth] = useState(0);
  const pageSize = 30;
  const storyRef = useRef(null);
  const mediaRef = useRef(null);
  const ioRef = useRef(null);
  const history = useHistory();
  const dispatch = useDispatch();
  const setPersonModal = (person) => {
    setModal(person);
  };

  const handleLikesCount = (event) => {
    event.stopPropagation();
    dispatch(storylikespersons(story?.storyId, 1, pageSize));
    setIsLikedByModal(true);
  };
  useEffect(() => {
    setIsLiked(story?.likes?.some((e) => e.userId === getOwner()));
  }, [story?.likes]);

  useEffect(() => {
    setCurrentLike(false);
  }, [isLiked]);

  const loadMoreStory = useCallback((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0) {
        let storyId = typeof story === "string" ? story : story?.storyId;
        dispatch(getHomeStoryAndUpdateList({ storyId: storyId }));
        storyRef.current && ioRef.current.unobserve(storyRef.current);
      }
    });
  }, []);

  useEffect(() => {
    setCardWidth(mediaRef?.current?.clientWidth);
  }, [mediaRef.current]);

  useEffect(() => {
    if (storyRef.current) {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      ioRef.current = new IntersectionObserver(loadMoreStory, options);
      ioRef.current.observe(storyRef.current);
    }
    return () => {
      storyRef.current && ioRef.current.unobserve(storyRef.current);
    };
  }, [storyRef, loadMoreStory]);

  useEffect(() => {
    const updateState = () => {
      const boolTwo = story.layoutId === LAYOUT_ID.TWO_IMAGE;
      const heightStoryI = boolTwo ? 248 : 500;
      const widthStoryI = boolTwo ? 346 : 640;
      let img1 = new Image(),
        img2 = new Image();
      img1.src = getImageUrl(story.storyImages[0]);
      img1.onload = () => {
        const actualWidth = img1.naturalWidth;
        const actualHeight = img1.naturalHeight;
        let { width, height } = getImageSizeList(actualWidth, actualHeight, story.layoutId, { width: widthStoryI, height: heightStoryI });
        const { newWidth, newHeight } = calculateHeightWidth(actualWidth, actualHeight, width, height, story, cardWidth);
        setImg2smalClas((prev) => {
          prev[0] = {
            style: {
              width: newWidth,
              height: newHeight,
              objectFit: "cover",
            },
            width: actualWidth,
            height: actualHeight,
          };
          return [...prev];
        });
      };
      if (story.storyImages[1]) {
        img2.src = getImageUrl(story.storyImages[1]);
        img2.onload = () => {
          const actualWidth = img2.naturalWidth;
          const actualHeight = img2.naturalHeight;
          let { width, height } = getImageSizeList(actualWidth, actualHeight, story.layoutId, { width: widthStoryI, height: heightStoryI });
          const { newWidth, newHeight } = calculateHeightWidth(actualWidth, actualHeight, width, height, story, cardWidth);
          setImg2smalClas((prev) => {
            prev[1] = {
              style: {
                width: newWidth,
                height: newHeight,
                objectFit: "cover",
              },
              width: actualWidth,
              height: actualHeight,
            };
            return [...prev];
          });
        };
      }
    };
    if (story?.storyImages?.length) {
      updateState();
    }
  }, [story, cardWidth]);
  let imageProps1 = {};
  if (Img2smalClas[0]) {
    imageProps1 = Img2smalClas[0];
  }
  let imageProps2 = {};
  if (Img2smalClas[1]) {
    imageProps2 = Img2smalClas[1];
  }
  const handleViewStory = () => {
    history.push(`/stories/view${getLinkStory({ refType: 0, storyId: story.storyId })}`);
  };
  const personLink = (person, e) => {
    e.stopPropagation();
    history.push(`/family/person-page/${person.treeId}/${person.id}`);
  };
  const storyPerson = story?.personDetail;
  const getLikeBtnClass = (bool) => (bool ? "liked-btn" : "");
  const getLikeSvgFill = (bool) => (bool ? "#FC4040" : "none");
  const getLikeSvgStroke = (bool) => (bool ? "#FC4040" : "#747578");
  return (
    <div ref={storyRef}>
      {typeof story === "string" ? (
        <div className="bg-white card w-full cursor-pointer">
          <MiddleLoader isStory={true} />
        </div>
      ) : (
        <>
          <div onClick={handleViewStory} className={`bg-white card w-full cursor-pointer ${getWidgetClass(story.layoutId)}`}>
            <div className="card-content-wrap">
              <div className={`story-author-info py-4 px-6 ${!!story.storyImages[0]?.url && "border-b border-gray-200"}`}>
                <div className="inline-flex items-center group avtar-group">
                  <div onClick={personLink.bind(null, story.personDetail[0])} className="mr-2 card-avatar rounded-md overflow-hidden w-10 h-10 flex items-center justify-center avtar-square-large">
                    {storyPerson[0] && <img src={getPersonProfileUrl(storyPerson[0])} className="object-cover w-16 h-10 rounded-lg" alt="Profile Pic" />}
                  </div>
                  <div className="flex-grow avtar-square-large-name">
                    <h3 className="main-title">
                      <Typography size={14} text="secondary" weight="bold">
                        <span onClick={personLink.bind(null, story.personDetail[0])} className="group-hover:text-blue-400 group-hover:underline link-inline">
                          {storyPerson && (
                            <>
                              {storyPerson[0]?.givenName?.givenName} {storyPerson[0]?.surname?.surname}
                            </>
                          )}
                        </span>
                      </Typography>
                    </h3>
                    {getPersonDetail(storyPerson)}
                  </div>
                </div>
                <div className="story-card-persons-top mt-1">
                  <div className="tags break-words" onClick={(e) => e.stopPropagation()}>
                    {getPerson(storyPerson, setPersonModal)}
                    <Typography size={14}> added to this story by </Typography>
                    <Typography size={14} text="secondary" weight="bold">
                      {" "}
                      {story?.author?.displayName || "A User"}{" "}
                    </Typography>
                  </div>
                </div>
              </div>
              {getImaageUrlDetail(story, imageProps1, imageProps2, mediaRef, cardWidth)}
              <div className="story-detail-wrap pt-4 pb-8 px-6">
                <div className="story-detail-container mb-5">
                  <div className="title">
                    <Typography text="secondary" size={24} weight="lyon-medium">
                      {story.title}
                    </Typography>
                  </div>
                  {story?.date && (
                    <div className="location-date mb-2">
                      <Typography size={12} weight="medium">
                        <span className="date">{story?.date}</span>
                        {story?.location && <span className="location">{story?.location}</span>}
                      </Typography>
                    </div>
                  )}
                  <div className="description mb-2">
                    <p>
                      <Typography size={14} text="secondary">
                        {story.content}
                      </Typography>
                    </p>
                  </div>
                </div>
                {!!story?.likes?.length && (
                  <div className="story-likes-container">
                    <div className="inline-flex group">
                      <span onClick={handleLikesCount}>
                        <span className="icon mr-2 mt-0.5">
                          <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.00004 10.422L1.20604 5.42204C0.784708 5.00104 0.506621 4.45807 0.411221 3.87014C0.31582 3.28221 0.407949 2.67917 0.67454 2.14654C0.875568 1.7446 1.16922 1.39618 1.53131 1.12999C1.8934 0.863793 2.31356 0.687443 2.75717 0.61547C3.20078 0.543497 3.65514 0.577959 4.08281 0.716018C4.51049 0.854077 4.89924 1.09178 5.21704 1.40954L6.00004 2.19204L6.78304 1.40954C7.10084 1.09178 7.48959 0.854077 7.91727 0.716018C8.34494 0.577959 8.7993 0.543497 9.24291 0.61547C9.68652 0.687443 10.1067 0.863793 10.4688 1.12999C10.8309 1.39618 11.1245 1.7446 11.3255 2.14654C11.5918 2.67896 11.6837 3.28165 11.5884 3.86924C11.4931 4.45684 11.2154 4.99956 10.7945 5.42054L6.00004 10.422Z" fill="#FC4040" stroke="#C93030" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </span>
                        <Typography size={14} weight="medium">
                          <span className={`group-hover:underline group-hover:text-blue-300 text liked-btn`}>{story?.likes?.length}</span>
                        </Typography>
                      </span>
                    </div>
                  </div>
                )}
                <div className="story-action-buttons flex justify-between overflow-x-auto">
                  <MyTooltip type="hover" open={true} placement="top" title="Coming Soon" fontWeight="400" padding="6">
                    <button className="flex sm:flex-1 justify-center items-center rounded-md h-8 hover:bg-gray-200 px-3" onClick={(e) => e.stopPropagation()}>
                      <span className="icon mr-2 mt-0.5">
                        <svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.5 6H10.5C10.7652 6 11.0196 6.10536 11.2071 6.29289C11.3946 6.48043 11.5 6.73478 11.5 7V15C11.5 15.2652 11.3946 15.5196 11.2071 15.7071C11.0196 15.8946 10.7652 16 10.5 16H1.5C1.23478 16 0.980429 15.8946 0.792893 15.7071C0.605357 15.5196 0.5 15.2652 0.5 15V7C0.5 6.73478 0.605357 6.48043 0.792893 6.29289C0.980429 6.10536 1.23478 6 1.5 6H2.5" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6 1V8" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M3.5 3.5L6 1L8.5 3.5" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <Typography size={14} weight="medium">
                        <span className="text block">Share</span>
                      </Typography>
                    </button>
                  </MyTooltip>
                  <MyTooltip type="hover" open={true} placement="top" title="Coming Soon" fontWeight="400" padding="6">
                    <button className="flex sm:flex-1 justify-center items-center rounded-md h-8 hover:bg-gray-200 px-3" onClick={(e) => e.stopPropagation()}>
                      <span className="icon mr-2 mt-0.5">
                        <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.5 1.00001C7.25253 0.998212 6.02731 1.33029 4.95149 1.96177C3.87566 2.59326 2.98843 3.50115 2.38186 4.59122C1.7753 5.68129 1.47151 6.91383 1.50201 8.16092C1.53251 9.40802 1.8962 10.6242 2.55533 11.6833L0.5 16L4.816 13.9447C5.73647 14.517 6.77726 14.8677 7.85637 14.9692C8.93548 15.0707 10.0234 14.9203 11.0345 14.5297C12.0455 14.1392 12.9521 13.5191 13.6827 12.7185C14.4133 11.9179 14.948 10.9586 15.2447 9.91609C15.5414 8.87361 15.5919 7.77648 15.3924 6.71113C15.1928 5.64579 14.7486 4.64134 14.0947 3.77693C13.4408 2.91253 12.5951 2.21177 11.6242 1.72988C10.6534 1.248 9.58387 0.998144 8.5 1.00001V1.00001Z" stroke="#747578" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <Typography size={14} weight="medium">
                        <span className="text block">Comment</span>
                      </Typography>
                    </button>
                  </MyTooltip>
                  <button className="flex sm:flex-1 justify-center items-center rounded-md h-8 hover:bg-gray-200 px-3" onClick={(e) => handleLikeClick(e, storyIndex, setCurrentLike, currentLike, isLiked, story, dispatch)}>
                    <span className="heart-animate icon mr-2 mt-0.5">
                      <svg className={`${isLiked && "fill_color"}`} width="16" height="15" viewBox="0 0 16 15" fill={`${getLikeSvgFill(isLiked)}`} xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.00006 14.0627L1.60806 7.39606C1.04629 6.83472 0.675505 6.11076 0.548304 5.32686C0.421104 4.54295 0.543942 3.7389 0.899397 3.02873V3.02873C1.16743 2.49281 1.55898 2.02824 2.04176 1.67332C2.52455 1.31839 3.08476 1.08326 3.67623 0.987293C4.26771 0.891329 4.87353 0.937279 5.44376 1.12136C6.014 1.30544 6.53233 1.62237 6.95606 2.04606L8.00006 3.08939L9.04406 2.04606C9.46779 1.62237 9.98613 1.30544 10.5564 1.12136C11.1266 0.937279 11.7324 0.891329 12.3239 0.987293C12.9154 1.08326 13.4756 1.31839 13.9584 1.67332C14.4412 2.02824 14.8327 2.49281 15.1007 3.02873C15.4557 3.73862 15.5783 4.5422 15.4513 5.32566C15.3242 6.10912 14.9539 6.83275 14.3927 7.39406L8.00006 14.0627Z" stroke={`${getLikeSvgStroke(isLiked)}`} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <Typography size={14} weight="medium">
                      <span className={`text block ${getLikeBtnClass(isLiked)}`}>Like</span>
                    </Typography>
                  </button>
                </div>
              </div>
            </div>
            <TailwindModal
              title={"People in this story"}
              showClose={true}
              innerClasses="max-w-errModal"
              content={
                <div className="story-prsns-list">
                  {showModal &&
                    showModal.map((_person, index) => (
                      <div key={index} className="persons-in-story relative mb-2.5">
                        <div className="flex items-center group  avtar-group" onClick={personLink.bind(null, _person)}>
                          <div className="media w-8 h-8 overflow-hidden mr-2 avtar-square-medium">
                            <img src={getPersonProfileUrl(_person)} className="object-cover w-8 h-8" alt="Profile Pic" />
                          </div>
                          <div className="media-info flex-grow avtar-square-medium-name">
                            <div>
                              <h3 className="title group-hover:underline group-hover:text-blue-300 main-title">
                                <Typography size={12} text="secondary" weight="medium">
                                  <span className="group-hover:text-blue-300 hover:text-blue-400 hover:underline">{getLabel(_person)}</span>
                                </Typography>
                              </h3>
                              {getDateString(_person) && (
                                <p className="date-tree flex flex-wrap sub-title">
                                  <span className="date relative pr-2">
                                    <Typography size={10}>{getDateString(_person)}</Typography>
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              }
              showModal={Boolean(showModal)}
              setShowModal={setModal}
            />
            {showLikedByModal && <LikespersonsList showLikedByModal={showLikedByModal} setIsLikedByModal={setIsLikedByModal} story={story} />}
          </div>
        </>
      )}
    </div>
  );
};
export default StoryCard;
