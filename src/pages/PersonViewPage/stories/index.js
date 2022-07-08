import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getStory } from "./../../../redux/actions/story";
import StoriesPage from "./StoriesPage";
const pageSize = 10
const getScrollTop = () => {
	return (window.scrollY !== undefined) ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}
const getDocumentHeight = () => {
	const body = document.body;
	const html = document.documentElement;
	
	return Math.max(
		body.scrollHeight, body.offsetHeight,
		html.clientHeight, html.scrollHeight, html.offsetHeight
	);
};
const getTotalPages = (categoryName, leftPanelDetails)=> {
  const total = (categoryName)?leftPanelDetails[categoryName]:leftPanelDetails['AllStories'];
  if( total < pageSize) {
    return 1
  }  else {
    return Math.max(Math.ceil(total / pageSize)-1, 1)
  }
}
const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const Stories = () => {
  const { treeId, primaryPersonId } = useParams();
  const storiesPageRef = useRef()
  const pageNumber = useRef(1);
  const isPagintionLoading = useRef(false);
  const getQueryParams = new URLSearchParams(window.location.search);
  const categoryName = getQueryParams.get('categoryName');
  const prevCategoryName = usePrevious(categoryName);
  const { leftPanelDetails, list,isListEmpty, isLoading, isPagintionLoading: isPagintionLoadingR } = useSelector((state) => state.story);
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const handleScroll = () => {
    if(totalPages < pageNumber.current) return;
    const calHeight = getDocumentHeight() - window.innerHeight
    if (storiesPageRef.current.scrollHeight > window.innerHeight && (getScrollTop()+(storiesPageRef.current.scrollHeight/2)) < calHeight) return;
    if( !isPagintionLoading.current ) {
      dispatch(getStory({ personId: primaryPersonId, treeId, categoryName, pageNumber:(pageNumber.current+1), pageSize }, false, isPagintionLoading));
      pageNumber.current = pageNumber.current+1
    }
  }
  useEffect(() => {
    if( leftPanelDetails && (totalPages===0   || (prevCategoryName !== categoryName))) {
      dispatch(getStory({ personId: primaryPersonId, treeId, categoryName, pageNumber:1, pageSize: pageSize*2 }));
      pageNumber.current = 2
      setTotalPages(getTotalPages(categoryName, leftPanelDetails))
    }
  }, [dispatch, primaryPersonId, treeId, categoryName, leftPanelDetails, prevCategoryName]);
  
  useEffect(() => {
    if(totalPages!==0 ) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      }
    }
  }, [dispatch, primaryPersonId, treeId, categoryName, pageNumber, isPagintionLoading, totalPages]);
  return (
    <div className=" all-stories-page" ref={storiesPageRef}>      
        <StoriesPage stories={list} isStoryEmpty={isListEmpty} isLoading={isLoading} paginationLoader = {isPagintionLoadingR}/>       
    </div>
  );
};
export default Stories;
