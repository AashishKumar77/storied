import React from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import StoryCard from "./../storyCard";
import Typography from "./../../../../components/Typography";
import Button from "./../../../../components/Button";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import GridLoader from "./contentLoader/GridLoader";
import StartTreeCardIcon from "./../../../../assets/images/start-tree-card-icon.svg";
import AddStoryCardIcon from "./../../../../assets/images/add-story-card-icon.svg";
import Skeleton from "./../../../../components/Skeleton";
import { getLinkStory } from './../../../../utils'
const getLink = (storyId, treeId, primaryPersonId, storiesTab) => {
  let url = `/stories/view`
  if (storiesTab) {
    url =  `${url}${getLinkStory({refType: "1", treeId, primaryPersonId, storyId})}`
  } else {
    url = `${url}/2/${storyId}/${treeId}/${primaryPersonId}`
  }
  return url
}
const getUrl = (storiesTab, treeId, primaryPersonId) => {
  let url
  if(storiesTab && treeId && primaryPersonId) {
    url = `/1/${treeId}/${primaryPersonId}`
  }else if (treeId && primaryPersonId) {
    url = `/2/${treeId}/${primaryPersonId}`
  } else {
    url = `/1/`
  }
  return url;
}
const NoDataLoader = ({
  treeId,
  primaryPersonId,
  history,
  noTree,
  personView,
  storiesTab
}) => {
  let html = null;
  if (personView) {
    if (noTree) {
      html = (
        <div className="no-record-card-solid mt-3 border border-gray-300 text-center bg-gray-100 overflow-hidden relative px-5 py-7 flex items-center flex-col">
          <div className="mb-5">
            <img src={StartTreeCardIcon} alt="start a tree" />
          </div>
          <div className="head mb-5">
            <Typography text="secondary">
              Before you start telling stories we need to know a little bit more about <span className="sml:block"></span>you and your family. Continue by starting a tree.
            </Typography>
          </div>
          <div className="button-wrap">
            <Button
              handleClick={() => {
                let url = `/family`
                history.push(url)
              }}
              title="Start a tree"
            />
          </div>
        </div>
      );
    } else {
      html = (
        <div className="no-record-card-solid mt-3 border border-gray-300 text-center bg-gray-100 overflow-hidden relative rounded-lg px-5 py-7 flex items-center flex-col">
          <div className="mb-5">
            <img src={AddStoryCardIcon} alt="add story" />
          </div>
          <div className="head mb-5">
            <Typography text="secondary">
              There are no stories about Achievements. Would you like to start one?
            </Typography>
          </div>
          <div className="button-wrap">
            <Button
              handleClick={() => {
                let url = `/stories/add`
                if (treeId && primaryPersonId) {
                  url = `${url}/2/${treeId}/${primaryPersonId}`
                } else {
                  url = `${url}/1`
                }
                history.push(url)
              }}
              title="Add Story"
            />
          </div>
        </div>
      );
    }
  } else {
    html = (
      <div className="no-record-card text-center bg-gray-100 overflow-hidden relative rounded-lg px-5 py-11 flex items-center flex-col">
        <div className="head mb-7">
          <Typography text="secondary">
            What do you know about this person? Add a photo, or write down any
            memory to get started.
          </Typography>
        </div>
        <div className="button-wrap">
          <Button
            size="large"
            handleClick={() => {
              let url = `/stories/add`
              history.push(`${url}${getUrl(storiesTab, treeId, primaryPersonId)}`)
            }}
            title="Add Story"
          />
        </div>
      </div>
    );
  }
  return html;
};

const StoryData = ({
  stories,
  isStoryEmpty,
  treeId,
  primaryPersonId,
  history,
  paginationLoader,
  columnsCountBreakPoints,
  noTree = false,
  personView = false,
  storiesTab = false
}) => {
  let html = null;
  if (stories?.length === 0 && !isStoryEmpty) {
    html = NoDataLoader({
      treeId,
      primaryPersonId,
      history,
      noTree,
      personView,
      storiesTab
    });
  } else {
    html = (
      <div className="added-stories flex flex-wrap w-full">
        <ResponsiveMasonry
          className="w-full relative"
          columnsCountBreakPoints={columnsCountBreakPoints}
        >
          <Masonry>
            {stories &&
              stories.map((story, index) => (
                <div
                  className="story-card hover:bg-gray-100 rounded-lg"
                  key={index}
                >
                  <Link
                    to={story?.storyId ? getLink(story.storyId, treeId, primaryPersonId, storiesTab) : "#"}
                  >
                    <StoryCard personView={personView} item={story} index={index} />
                  </Link>
                </div>
              ))}
            {paginationLoader &&
              [1, 2].map((item) => (
                <div className="single-story-loader loader-grid w-full rounded-lg" key={item}>
                  <div className="img-loader-area rounded-lg overflow-hidden">
                    <Skeleton
                      variant={"rect"}
                      width={"100%"}
                      height={"100%"}
                    />
                  </div>
                  <div className="story-info-loader">
                    <Skeleton variant={"text"} width={"46%"} />
                    <Skeleton variant={"text"} width={"100%"} />
                    <Skeleton variant={"text"} width={"100%"} />
                    <Skeleton variant={"text"} width={"80%"} />
                  </div>
                </div>
              ))}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    );
  }
  return html;
};

const AllStories = ({ stories, isStoryEmpty, paginationLoader, columnsCountBreakPoints, noTree, storiesTab= false, personView = false, grid = 3 }) => {
  const { treeId, primaryPersonId } = useParams();
  const history = useHistory();
  return (
    <>
      {isStoryEmpty ? (
        <div className="flex flex-grow flex-wrap flex-shrink-0">
          <GridLoader grid={grid} />
        </div>
      ) : (
        StoryData({
          stories,
          isStoryEmpty,
          treeId,
          primaryPersonId,
          history,
          paginationLoader,
          columnsCountBreakPoints,
          noTree,
          personView,
          grid,
          storiesTab
        })
      )}
    </>
  );
};
export default AllStories;
