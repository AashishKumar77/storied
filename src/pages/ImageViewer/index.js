import React, { useState, useRef, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import RightPanel from "./RightPanel";
import "./index.css";
import { useDispatch, useSelector } from "react-redux";
import { getMedia, resetMedia } from "../../redux/actions/media";

const printImage = () => {
  const content = document.getElementById("story-image");
  let pri;
  if (document.getElementById("uniqueIframeId")) {
    pri = document.getElementById("uniqueIframeId").contentWindow;
  } else {
    const iframe = document.createElement("iframe");
    iframe.setAttribute("title", "uniqueIframeId");
    iframe.setAttribute("id", "uniqueIframeId");
    iframe.setAttribute(
      "style",
      "height: 0px; width: 0px; position: absolute;"
    );
    document.body.appendChild(iframe);
    pri = iframe.contentWindow;
  }
  pri.document.open();
  pri.document.write(content.innerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
};

const downloadImage = (mediaDetails) => {
  const img = `${mediaDetails?.url}`;
  window.location.assign(img);
};

const SidePanelIcon = ({ show }) => (
  <>
    {show ? (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5 7.99866H8.5"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 10.4987L15.5 7.99866L13 5.49866"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.5 0.498657H5.5V15.4987H0.5V0.498657Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ) : (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 7.99878H7.5"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 10.4988L0.5 7.99878L3 5.49878"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15.5 0.498779H10.5V15.4988H15.5V0.498779Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )}
  </>
);

const getSidebarClass = (bool) => {
  let res = "full open-sidebar";
  if (bool) {
    res = "3/4 open-sidebar";
  }
  return res;
};

const getSidebarBtnClass = (bool, c1, c2) => {
  let res = c1;
  if (bool) {
    res = c2;
  }
  return res;
};

const ViewStoriesImage = () => {
  const dispatch = useDispatch(),
    history = useHistory(),
    zoomRef = useRef(null),
    [sidePanel, setSidePanel] = useState(true),
    [mSidePanel, setmSidePanel] = useState(false);
  const { mediaId } = useParams(),
    { mediaDetails , featuredStoryIdRedirect } = useSelector((state) => state.media);
  const handleSidePanel = () => {
    setSidePanel(!sidePanel);
  };
  const handleZoomIn = () => {
    zoomRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    zoomRef.current.zoomOut();
  };
  useEffect(() => {
    document.querySelector(".main-wrapper").style.display = "none";
    return () => {
      document.querySelector(".main-wrapper").style.display = "block";
    };
  }, []);

  const handleBack = () => {
    if (featuredStoryIdRedirect) {
      return history.push(`/stories/view/0/${featuredStoryIdRedirect}`)
    }
    else {
      return history.goBack()
    }
  }

  useEffect(() => {
    dispatch(getMedia(mediaId));
    return () => {
      dispatch(resetMedia())
    }
  }, []);
  return (
    <div className="w-full grid md:flex h-screen bg-black">
      {!mSidePanel ? (
        <div className={`w-full md:w-${getSidebarClass(sidePanel)} image-bg`}>
          <div className="bg-gray-700 z-20 md:bg-transparent sm:p-2 md:p-0 pt-3 md:pt-0 h-14 md:h-0 md:p-0 fixed md:relative w-full top-0">
            <button
              className="z-50 mt-0 md:mt-7 md:flex btn absolute ml-1 md:ml-4 bg-gray-700 md:bg-gray-600 border-0 p-2"
              onClick={() => handleBack()}
            >
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 8L1.5 8"
                  stroke="white"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 1L1.5 8L8.5 15"
                  stroke="white"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div
              className={`z-50 absolute right-0 md:right-${getSidebarBtnClass(
                sidePanel,
                "1",
                "0"
              )} mt-0 md:mt-7 flex float-right ml-auto`}
            >
              <button
                className="btn mr-3 bg-gray-700 md:bg-gray-600 border-0 p-2"
                onClick={() => printImage()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.5 11.4994H1.5C1.23478 11.4994 0.98043 11.394 0.792893 11.2065C0.605357 11.019 0.5 10.7646 0.5 10.4994V5.49939C0.5 5.23417 0.605357 4.97982 0.792893 4.79228C0.98043 4.60475 1.23478 4.49939 1.5 4.49939H14.5C14.7652 4.49939 15.0196 4.60475 15.2071 4.79228C15.3946 4.97982 15.5 5.23417 15.5 5.49939V10.4994C15.5 10.7646 15.3946 11.019 15.2071 11.2065C15.0196 11.394 14.7652 11.4994 14.5 11.4994H12.5"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 6.49939H3.5"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.5 8.49939H12.5V15.4994H3.5V8.49939Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 4.49939H3.5V1.49939C3.5 1.23417 3.60536 0.979819 3.79289 0.792283C3.98043 0.604746 4.23478 0.49939 4.5 0.49939H11.5C11.7652 0.49939 12.0196 0.604746 12.2071 0.792283C12.3946 0.979819 12.5 1.23417 12.5 1.49939V4.49939Z"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 10.4994H10.5"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 12.4994H9"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="btn mr-3 bg-gray-700 md:bg-gray-600 border-0 p-2"
                onClick={() => downloadImage(mediaDetails)}
              >
                <svg
                  width="18"
                  height="15"
                  viewBox="0 0 18 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L9.00067 10.5"
                    stroke="white"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6.00098 7.5L9.00098 10.5L12.001 7.5"
                    stroke="white"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16.501 10.5V11.5C16.501 12.0304 16.2903 12.5391 15.9152 12.9142C15.5401 13.2893 15.0314 13.5 14.501 13.5H3.50098C2.97054 13.5 2.46184 13.2893 2.08676 12.9142C1.71169 12.5391 1.50098 12.0304 1.50098 11.5V10.5"
                    stroke="white"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                className="z-50 btn mr-5 bg-gray-700 md:bg-gray-600 border-0 p-2 d-hidden hidden md:flex"
                onClick={() => handleSidePanel()}
              >
                <SidePanelIcon show={sidePanel} />
              </button>
            </div>
          </div>
          <div className="mb-5 hidden md:flex float-right mb-auto">
            <div
              className={`z-50 d-grid btn mr-5 float-right bottom-7 right-${getSidebarBtnClass(
                sidePanel,
                "0",
                "1/4"
              )} absolute bg-gray-600 border-0 p-0`}
            >
              <button
                className="btn border-0 p-2"
                onClick={() => handleZoomIn()}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.4375 8H14.5625"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 1.4375V14.5625"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="border-b-1 border-gray-800 rounded-none mb-1 mx-1.5"></span>
              <button
                className="btn border-0 p-2 mb-1.5 ml-0.5"
                onClick={() => handleZoomOut()}
              >
                <svg
                  width="14"
                  height="2"
                  viewBox="0 0 14 2"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.875 1H13.125"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="md:h-screen mx-auto" id="story-image">
            <TransformWrapper
              ref={zoomRef}
            >
              <TransformComponent>
                <img
                  className="md:h-screen mx-auto"
                  src={`${mediaDetails?.url}`}
                  alt=""
                />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      ) : null}
      {/* mobile-footer start */}
      <div
        className={`w-full bg-gray-700 justify-center ${
          mSidePanel ? "relative mt-16 p-2" : "fixed p-3"
        } bottom-0 flex md:hidden`}
      >
        {mSidePanel && (
          <button
            className="relative right-26 cursor-pointer"
            onClick={() => setmSidePanel(false)}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 24C32 28.4183 28.4183 32 24 32L8 32C3.58172 32 0 28.4183 0 24L0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24Z"
                fill="#212122"
              />
              <path
                d="M22 10L10 22"
                stroke="white"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 10L22 22"
                stroke="white"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
        <button
          className={`text-white text-sm ${mSidePanel ? "mr-12" : " mr-0"}`}
          onClick={() => setmSidePanel(true)}
        >
          Details
        </button>
      </div>
      {/* mobile-footer end */}
      <RightPanel sidePanel={sidePanel} mSidePanel={mSidePanel} mediaDetails={mediaDetails} />
    </div>
  );
};

export default ViewStoriesImage;
