import React, { useState } from "react";
import Typography from "./../../../../components/Typography";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import TailwindModalDialog from "./../../../../components/TailwindModalDialog";
import { useDispatch, useSelector } from 'react-redux'
import { deleteStory } from './../../../../redux/actions/story'
import { useParams, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { getLinkStory } from "./../../../../utils"
const StoryDropdownWidget = props => {
    const [showWidget, setShowWidget] = useState(false)
    const [showDiloge, setShowDialog] = useState(false)
    const story = useSelector(state => state.story);
    const history=useHistory();
    const {storyId, treeId, primaryPersonId, refType}=useParams()
    const dispatch=useDispatch();
    const handleDelete=()=>{
        dispatch(deleteStory({storyId,userId:story?.view?.authorId}, {treeId, primaryPersonId, history, refType}))
    }

    const handleEdit = () => {
        return `/stories/edit${getLinkStory({refType:refType, storyId, treeId, primaryPersonId})}`
    }

    return <>
        <button className="btn ellipsis-button btn-default" onClick={() => setShowWidget(prev => !prev)}>
            <span><svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0.241211 13.752C0.241211 14.2161 0.425585 14.6613 0.753774 14.9895C1.08196 15.3176 1.52708 15.502 1.99121 15.502C2.45534 15.502 2.90046 15.3176 3.22865 14.9895C3.55684 14.6613 3.74121 14.2161 3.74121 13.752C3.74121 13.2879 3.55684 12.8428 3.22865 12.5146C2.90046 12.1864 2.45534 12.002 1.99121 12.002C1.52708 12.002 1.08196 12.1864 0.753774 12.5146C0.425585 12.8428 0.241211 13.2879 0.241211 13.752Z" fill="#747578" />
                <path d="M0.241211 2.25201C0.241211 2.71614 0.425585 3.16126 0.753774 3.48945C1.08196 3.81764 1.52708 4.00201 1.99121 4.00201C2.45534 4.00201 2.90046 3.81764 3.22865 3.48945C3.55684 3.16126 3.74121 2.71614 3.74121 2.25201C3.74121 1.78789 3.55684 1.34277 3.22865 1.01458C2.90046 0.686389 2.45534 0.502014 1.99121 0.502014C1.52708 0.502014 1.08196 0.686389 0.753774 1.01458C0.425585 1.34277 0.241211 1.78789 0.241211 2.25201Z" fill="#747578" />
                <path d="M0.241211 8.00201C0.241211 8.46614 0.425585 8.91126 0.753774 9.23945C1.08196 9.56764 1.52708 9.75201 1.99121 9.75201C2.45534 9.75201 2.90046 9.56764 3.22865 9.23945C3.55684 8.91126 3.74121 8.46614 3.74121 8.00201C3.74121 7.53789 3.55684 7.09277 3.22865 6.76458C2.90046 6.43639 2.45534 6.25201 1.99121 6.25201C1.52708 6.25201 1.08196 6.43639 0.753774 6.76458C0.425585 7.09277 0.241211 7.53789 0.241211 8.00201Z" fill="#747578" />
            </svg>
            </span>
        </button>
        {showWidget ?
            <ClickAwayListener onClickAway={() => setShowWidget(false)}>
              <div className="story-dropdown">
                <div className="dropdown-content">
                  <Link to={handleEdit} className="">
                      <Typography size={14} text="secondary">
                          Edit story
                      </Typography>
                  </Link>

                  <button onClick={() => setShowDialog(true)} >
                      <Typography size={14} text="danger">
                          Delete story
                      </Typography>
                  </button>
                </div>
              </div>
            </ClickAwayListener>
            : null}
        <TailwindModalDialog showModal={showDiloge}
            setShowModal = {setShowDialog}
            title={'Are you sure?'}
            content={"Are you sure you want to delete this story?"}
            handleAction={handleDelete}
        />
    </>
}
export default StoryDropdownWidget