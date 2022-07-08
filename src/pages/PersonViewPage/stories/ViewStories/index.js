import React, { useEffect, useState } from "react";
import Typography from "./../../../../components/Typography";
import PermissionCard from "./../../../../components/PermissionCard";
import "./../addStories/index.css";
import { useSelector, useDispatch } from "react-redux";
import ClassNames from "classnames";
import { viewStory } from "../../../../redux/actions/story";
import { useParams, useHistory, useLocation } from "react-router-dom";
import Loader from "./../../../../components/Loader";
import Person from "./Person";
import StoryDropdownWidget from "./StoryDropdownWidget";
import { LAYOUT_ID, getImageSize, getScreen, getFullWidthHeight, getWidgetClass, getStoryRedirectUrl } from "../../../../utils";
import { getOwner } from "../../../../services";
import PrivacyToggle from "./../../../../components/PrivacyToggle";

const getContent = (content) => {
  let strArr = (content && content.split(/\r\n/g)) || [];
  return strArr.map((item) =>
    item ? (
      <>
        {item}
        <br />
      </>
    ) : (
      <br />
    )
  );
};

const getImage = (item, selectedFile, history, storyId) => {
  console.log("itemsss", item);

  let html = null;
  if (item?.storyImages?.length) {
    html = (
      <div className={ClassNames(`main-stroy-img  ${getWidgetClass(item?.layoutId)}`)}>
        <div className="image-container relative">
          <div style={{ ...(item?.layoutId !== LAYOUT_ID.TWO_IMAGE && selectedFile[0]?.calculate && getFullWidthHeight(selectedFile[0]?.calculate)) }} className={`single-img image-cont ${getSmallImgClass(item?.layoutId, selectedFile[0]?.calculate)}`}>
            <img onClick={() => history.push(`/media/view-image/${item?.storyImages[0].mediaId}`)} src={getImageUrl(item?.storyImages[0])} className="object-cover cursor-pointer" />
          </div>
          {item?.storyImages[1]?.url && (
            <div className={`second-image image-cont relative ${getSmallImgClass(item?.layoutId, selectedFile[1]?.calculate)}`}>
              <img onClick={() => history.push(`/media/view-image/${item?.storyImages[1].mediaId}`)} src={getImageUrl(item?.storyImages[1])} className="object-cover cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    );
  }
  return html;
};

const getSmallImgClass = (type, file) => {
  let str = "";
  console.log("type", file);
  if ((type === LAYOUT_ID.TWO_IMAGE && file?.height < 287) || file?.width < 400) {
    str += " sm-item";
  }
  return str;
};

const getImageUrl = (img) => {
  return img?.url;
};

const getSavedToHtml = (view) => {
  let html = null;
  if (view?.personDetail?.length) {
    html = (
      <div className={`tagged-persons mb-5 ${view?.storyImages[0]?.url ? "in-prs" : ""}`}>
        <h2 className="text-sm mb-1">People</h2>
        <div className="person-wrap flex flex-wrap">
          {view.personDetail.map((item, index) => (
            <div key={index} className="person-in-story text-blue-500 text-sm mr-2 flex flex-wrap">
              <Person item={item} authorId={view.authorId} removeIndex={index} personDetail={view.personDetail} />
              {index < view.personDetail.length - 1 && ","}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return html;
};

const getImageClass = (view) => `saved-story-wrap ${view?.storyImages?.length ? "has-image" : ""} w-full mx-auto`;
const getWidget = (view) => {
  let widget = null;
  if (getOwner() === view?.authorId) {
    widget = (
      <div className="saved-story-actions flex">
        <div className="mr-5 mt-1 relative">
          <PrivacyToggle isViewMode />
        </div>
        <StoryDropdownWidget />
      </div>
    );
  }
  return widget;
};
const calculateCropImageSize = (imgCrop, calculateImageSize, layout) => {
  const { width: _width, height: _height, widthActual: _widthActual, heightActual: _heightActual } = getImageSize(imgCrop.naturalWidth, imgCrop.naturalHeight, layout, getScreen());
  calculateImageSize[layout] = {};
  calculateImageSize[layout].calculate = {
    width: _width,
    height: _height,
    widthActual: _widthActual,
    heightActual: _heightActual,
  };
  return calculateImageSize;
};
const updateState = (view, setValidSelectedFileObj) => {
  let img1 = new Image(),
    img2 = new Image();
  img1.src = getImageUrl(view?.storyImages[0]);
  img2.src = getImageUrl(view?.storyImages[1]);
  img1.onload = () => {
    let layout = view.layoutId;
    let calculateImageSize = { calculate: {} };
    const { width, height, widthActual, heightActual } = getImageSize(img1.naturalWidth, img1.naturalHeight, layout, getScreen());
    calculateImageSize.calculate = {
      width: width,
      height: height,
      widthActual: widthActual,
      heightActual: heightActual,
    };
    if (view?.storyImages[0]?.url) {
      let imgCrop = new Image();
      imgCrop.src = view?.storyImages[0].url;
      imgCrop.onload = () => {
        calculateCropImageSize(imgCrop, calculateImageSize, layout);
      };
    }
    setValidSelectedFileObj((prev) => {
      prev[0] = {
        calculate: calculateImageSize?.calculate,
      };
      return [...prev];
    });
  };
  img2.onload = () => {
    let layout = view.layoutId;
    let calculateImageSize = { calculate: {} };
    const { width, height, widthActual, heightActual } = getImageSize(img2.naturalWidth, img2.naturalHeight, layout, getScreen());
    calculateImageSize.calculate = {
      width: width,
      height: height,
      widthActual: widthActual,
      heightActual: heightActual,
    };
    if (view?.storyImages[1]?.url) {
      let imgCrop = new Image();
      imgCrop.src = view?.storyImages[1].url;
      imgCrop.onload = () => {
        calculateCropImageSize(imgCrop, calculateImageSize, layout);
      };
    }

    setValidSelectedFileObj((prev) => {
      prev[1] = {
        calculate: calculateImageSize?.calculate,
      };
      return [...prev];
    });
  };
};
const ViewStories = () => {
  const { view, isLoading, viewPermission } = useSelector((state) => state.story);
  const { refType, storyId, treeId, primaryPersonId } = useParams();
  const [selectedFile, setValidSelectedFileObj] = useState([{}, {}]);

  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation().search;

  const mediaId = new URLSearchParams(location).get("mediaId");

  const handleBack = () => {
    let url;
    if (mediaId) {
      url = `/media/view-image/${mediaId}`;
    } else {
      url = getStoryRedirectUrl({ refType, treeId, primaryPersonId });
    }
    return history.push(url);
  };

  useEffect(() => {
    if (view?.storyImages?.length) {
      updateState(view, setValidSelectedFileObj);
    }
  }, [view]);
  useEffect(() => {
    dispatch(viewStory({ storyId }));
  }, [dispatch]);

  const ViewStoryHtml = (
    <div className="page-wrap-bg-dk story-page-wrap" id="person-page">
      <div className="relative main-wrapper mx-auto pt-8 z-500 lg:z-50">
        <div className="buton-wrap-top fixed sm:absolute left-0 sm:left-4 top-0 sm:top-8 z-1000 sm:z-50 bg-white sm:bg-transparent w-full sm:w-auto flex justify-between px-4 py-2 sm:p-0 shadow-md sm:shadow-none">
          <button onClick={handleBack} type="button" className="bg-gray-100 rounded-lg px-2 py-2 hover:bg-white focus:outline-none focus:ring-2 focus:ring-inset">
            <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.5 8L1.5 8" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 1L1.5 8L8.5 15" stroke="#212122" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        {isLoading ? (
          <div className="text-center mt-20">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col w-full">
            <div className={getImageClass(view)}>
              <div className="story-box relative">
                {getWidget(view)}
                <div className="md:flex w-full">
                  {getImage(view, selectedFile, history, storyId)}
                  <div className="story-body flex">
                    <div className="story-content flex my-auto flex-col">
                      <div className="head mb-6">
                        <div className="story-title">
                          <h2>
                            <Typography size={32} text="secondary" weight="lyon-medium">
                              {view?.title}
                            </Typography>
                          </h2>
                        </div>
                        <p className="mb-1.5">
                          <Typography weight="medium" size={12}>
                            {view?.location}
                          </Typography>
                        </p>
                        <p>
                          <Typography weight="medium" size={12}>
                            {view?.date}
                          </Typography>
                        </p>
                      </div>
                      <div className="mb-9">
                        <p>
                          <Typography size={14} text="secondary">
                            <span className="display-linebreak">{getContent(view?.content)}</span>
                          </Typography>
                        </p>
                      </div>
                      {getSavedToHtml(view)}
                      <div className="tags">
                        {(view?.storyCategories || []).map((item, iIndex) => (
                          <span key={iIndex} className="border border-gray-200 px-3 mb-2 py-1.5 pb-2 rounded-lg mr-2 inline-block">
                            <Typography size={12}>{item}</Typography>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  return viewPermission ? ViewStoryHtml : <PermissionCard />;
};
export default ViewStories;
