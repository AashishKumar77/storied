import React, { useState, useRef } from "react";
import Popover from '@material-ui/core/Popover';
import { getDateString } from "./../../../../components/utils";
import Typography from "./../../../../components/Typography";
import { useParams, Link } from "react-router-dom";
import { deleteStoryPerson } from "../../../../redux/actions/story";
import { useDispatch } from 'react-redux';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { isUserOwner } from './../../../../services';
import { getPersonProfileUrl } from "./../../../../components/utils/genderIcon";
import { removePersonFromMedia } from "../../../../redux/actions/media";
const useStyles = makeStyles({
  paper: {

  },
  root: {
    'boxShadow': '0px 6px 36px -6px rgba(0, 0, 0, 0.15);',
  }
});
const getAnchor = (anchor) => {
  let anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left'
  }
  let transformOrigin = {
    vertical: 'left',
    horizontal: 'bottom'
  }
  if (anchor && (anchor.closest("body").clientHeight - anchor.offsetTop) < 324) {
    anchorOrigin = {
      vertical: 'left',
      horizontal: 'bottom'
    }
    transformOrigin = {
      vertical: 'bottom',
      horizontal: 'left'
    }
  }
  return { anchorOrigin: anchorOrigin, transformOrigin: transformOrigin }
}
const Person = ({ item, personDetail, removeIndex, authorId , personId, mediaId , removePhoto=false , ...props }) => {
  const { storyId } = useParams();
  const [anchorEl, setAnchorEl] = useState(null);
  const scrollRef = useRef()
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleRemove = () => {
    if(removePhoto){
      dispatch(removePersonFromMedia(personId, mediaId));
    } else {
      dispatch(deleteStoryPerson(item, storyId, personDetail, removeIndex))
    }
    setAnchorEl(null);
  }
  const classes = useStyles(props);
  const open = Boolean(anchorEl);
  const id = 'tw-person-dropdown';
  const dateString = getDateString(item)
  return <div ref={scrollRef} className={classnames({
    "cursor-pointer hover:underline": true,
    "underline": open
  })}>
    <span onClick={handleClick}>{item?.givenName?.givenName} {item?.surname?.surname}</span>
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      elevation={10}
      classes={{
        paper: classes.paper,
        root: classes.root
      }}
      {...getAnchor(scrollRef.current)}
    >
      <div className="person-dropdown">
        <div className={classnames({ "flex mb-4 items-center media-wrap": true, 'min-h-10': dateString })}>
          {item.profileImageUrl ? <div className="media overflow-hidden avtar-square-large">
            <img src={item.profileImageUrl} className="object-cover " alt="Story Pic" />
          </div> :
            <div className="media overflow-hidden avtar-square-large">
              <img src={getPersonProfileUrl(item)} alt={item.gender} />
            </div>
          }
          <div className="media-text flex-1 ml-3 avtar-square-large-name">
            <h3 className="main-title"><Typography
              size={18}
              text="secondary"
              weight="medium"
            >
              {item?.givenName?.givenName} {item?.surname?.surname}
            </Typography></h3>
            <p className="sub-title"> <Typography size={14} text="secondary">
              {dateString}
            </Typography>
            </p>
          </div>
        </div>
        <div className="actions">
          <Link className="btn mb-3" to={`/family/person-page/${item.treeId}/${item.id}`}>
            <span className="w-9">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.20026 8.00733C4.45793 7.265 4.04089 6.25818 4.04089 5.20836C4.04089 4.15855 4.45793 3.15173 5.20026 2.4094C5.94259 1.66707 6.94941 1.25003 7.99923 1.25003C9.04904 1.25003 10.0559 1.66707 10.7982 2.4094C11.5405 3.15173 11.9576 4.15855 11.9576 5.20836C11.9576 6.25818 11.5405 7.265 10.7982 8.00733C10.0559 8.74966 9.04904 9.1667 7.99923 9.1667C6.94941 9.1667 5.94259 8.74966 5.20026 8.00733Z" stroke="black" strokeWidth="1.25" />
                <path d="M2.84612 13.805C4.21306 12.438 6.06632 11.669 7.99943 11.6666C9.93254 11.669 11.7858 12.438 13.1527 13.805C14.4705 15.1227 15.2326 16.8924 15.2879 18.7499H0.710995C0.766301 16.8924 1.52837 15.1227 2.84612 13.805ZM0.498946 18.9587V18.9587Z" stroke="black" stroke-width="1.25" />
              </svg>
            </span><span className="text-sm">View<span className="ml-1">{item?.givenName?.givenName}</span></span></Link>
          {personDetail.length > 1 && isUserOwner(authorId) && <div className="btn mb-3" onClick={handleRemove}>
            <span className="w-9">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.25 3.75H18.75" stroke="#212122" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.875 1.25H8.125C7.79348 1.25 7.47554 1.3817 7.24112 1.61612C7.0067 1.85054 6.875 2.16848 6.875 2.5V3.75H13.125V2.5C13.125 2.16848 12.9933 1.85054 12.7589 1.61612C12.5245 1.3817 12.2065 1.25 11.875 1.25Z" stroke="#212122" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.125 14.375V8.125" stroke="#212122" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.875 14.375V8.125" stroke="#212122" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15.7208 17.6033C15.6949 17.9159 15.5524 18.2073 15.3216 18.4197C15.0909 18.6321 14.7887 18.75 14.475 18.75H5.52583C5.21218 18.75 4.90998 18.6321 4.6792 18.4197C4.44842 18.2073 4.30593 17.9159 4.28 17.6033L3.125 3.75H16.875L15.7208 17.6033Z" stroke="#212122" stroke-width="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span><span className="text-sm">Remove from {removePhoto ? "Photo" : "Story"}</span></div>}
        </div>
      </div>
    </Popover>
  </div>
}
export default Person