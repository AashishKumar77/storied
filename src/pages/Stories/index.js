import React, { useEffect, useRef, useState } from "react";
import { Field, Formik } from "formik";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { treePeopleList } from './../../redux/actions/sidebar';
import { getRecentTree } from "../../services";
import { getStories, getTreesListAsync } from './../../redux/actions/homepage';
import SearchPeople from "./../../components/SearchPeople";
import StoriesPage from "./../PersonViewPage/stories/StoriesPage";
import TextField from '@material-ui/core/TextField';
import {getOptionLabel} from "shared-logics";
const getPersonSelected = (treePeople, id) => {
  if( id && treePeople ) {
    const _person = treePeople.find((_per)=>_per.id === id)
    return {..._person, name:getOptionLabel(_person)}
  }
  return {}
}
const pageSize = 10
const getScrollTopStories = () => {
  return (window.scrollY !== undefined) ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop;
}
const getDocumentHeightStories = () => {
  const body = document.body;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight
  );
};
const getTotalPagesStories = (categoryName, leftPanelDetails) => {
  const total = (categoryName) ? leftPanelDetails[categoryName] : leftPanelDetails['AllStories'];
  if (!total || total < pageSize) {
    return 1
  } else {
    return Math.max(Math.ceil(total / pageSize)-1, 1)
  }
}
const Stories = () => {
  const history = useHistory();
  const storiesPageRef = useRef()
  const pageNumber = useRef(1);
  const isPagintionLoading = useRef(false);
  const getQueryParams = new URLSearchParams(window.location.search);
  const categoryName = getQueryParams.get('categoryName');
  const { leftPanelDetails, isLoading } = useSelector((state) => state.story);
  const { userProfileAccount } = useSelector(state => state.user);
  const { stories: list, isLoading: isListEmpty, isPaginationLoading: isPagintionLoadingR } = useSelector(state => state.homepage)
  const dispatch = useDispatch();
  const [totalPages, setTotalPages] = useState(0);
  const [noTree, setNoTree] = useState(false)
  const { treeId, primaryPersonId } = useParams();
  const selectPeople = (val) => {
    if (!!val.id) {
      history.push(`/stories/${val.treeId}/${val.id}`);
    } else if (!val.name) {
      history.push(`/stories`);
    }
  }
  const handleScroll = () => {
    if (totalPages < pageNumber.current) return;
    const calHeight = getDocumentHeightStories() - window.innerHeight
    if (storiesPageRef.current.scrollHeight > window.innerHeight && (getScrollTopStories() + (storiesPageRef.current.scrollHeight / 2)) < calHeight) return;
    if (!isPagintionLoading.current) {
      dispatch(getStories({...primaryPersonId?{treeId: treeId, personId: primaryPersonId}:{} , categoryName, pageNumber: (pageNumber.current + 1), pageSize }, false, isPagintionLoading));
      pageNumber.current = pageNumber.current + 1
    }
  }
  const {
    treePeople
  } = useSelector(state => {
    return state.sidebar
  });
  useEffect(() => {
      dispatch(getStories({...primaryPersonId?{treeId: treeId, personId: primaryPersonId}:{}, categoryName, pageNumber: 1, pageSize: pageSize*2 }));
      pageNumber.current = 2
  }, [dispatch, treeId, primaryPersonId, categoryName]);
  useEffect(() => {
    if (leftPanelDetails) {
      setTotalPages(getTotalPagesStories(categoryName, leftPanelDetails))
    }
  }, [dispatch, categoryName, leftPanelDetails]);
  useEffect(() => {
    const fun = async ()=>{
      const obj = getRecentTree()
      if( obj ) {
        const _treeId = obj.treeId
        dispatch(treePeopleList({ treeId: _treeId }));
      } else {
        const treesList = await getTreesListAsync(userProfileAccount.id)
        if(treesList.length) {
          dispatch(treePeopleList({ treeId: treesList[0].treeId }));
        } else {
          setNoTree(true)
        }
      }
    }
    fun()
  }, [dispatch])
  useEffect(() => {
    if (totalPages !== 0) {
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      }
    }
  }, [dispatch, categoryName, pageNumber, isPagintionLoading, totalPages]);
  return (
    <>
      <div className="pt-18 md:pt-22.5 all-stories-page-wrap main-wrapper mx-auto w-full">
        <div className={`search-bar-top max-w-xl mx-auto mb-4 px-3 relative`}>

          <Formik
            initialValues={{ search: getPersonSelected(treePeople, primaryPersonId)
            }}
            enableReinitialize={true}
          >
            <Field
              name="search"
              component={SearchPeople}
              placeholder={"Search"}
              freeSolo={true}
              closeIconDisable={false}
              highlight={true}
              height={40}
              fontSize={14}
              popoverMt={36}
              renderInput={params =>
                <div ref={params.InputProps.ref} className="relative">
                  <span className="icon absolute z-10 left-3 top-2">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3.22674 13.1309C4.01019 14.9744 5.49388 16.4311 7.3514 17.1806C9.20892 17.9302 11.2881 17.9111 13.1316 17.1277C14.9751 16.3442 16.4318 14.8605 17.1813 13.003C17.9309 11.1455 17.9118 9.06629 17.1284 7.22282C16.3449 5.37935 14.8612 3.9226 13.0037 3.17306C11.1462 2.42351 9.067 2.44257 7.22353 3.22602C5.38006 4.00948 3.92331 5.49317 3.17377 7.35069C2.42423 9.20821 2.44328 11.2874 3.22674 13.1309V13.1309Z" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                      <path d="M15.5176 15.5167L21.3751 21.3751" stroke="#555658" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </span>
                  <TextField {...params} placeholder={"Search"} variant="outlined" />
                </div>
              }
              options={treePeople}
              selectPeople={selectPeople}
              getOptionDisabled={[]}
            />
          </Formik>
        </div>
        <div className="all-stories-page" ref={storiesPageRef}>
          <StoriesPage storiesTab = {true} noTree = {noTree} personView={true} grid={4}    midleClass="stories-middle-content view-all-stories-page" columnsCountBreakPoints={{ 510: 1, 511: 3, 1280: 4 }} rightPanel={false} stories={list} isStoryEmpty={isListEmpty} isLoading={isLoading} paginationLoader={isPagintionLoadingR} />
        </div>
      </div>
    </>
  );
};
export default Stories;
