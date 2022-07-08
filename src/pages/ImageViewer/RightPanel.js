import React, { useEffect, useState } from "react";
import Person from "../PersonViewPage/stories/ViewStories/Person";
import DropdownWidget from "./DropdownWidget";
import TailwindModal from "../../components/TailwindModal";
import { apiRequest } from "../../redux/requests";
import { GET } from "../../redux/constants";
import { useDispatch, useSelector } from "react-redux";
import { getTrees } from "../../redux/actions/sidebar";
import { addPersonToMedia, featuredStoryRedirect, getUserDetails } from "../../redux/actions/media";
import STTForm from "../../components/Sidebar/Components/STTForm";
import { useHistory } from "react-router-dom";
import { getAvatarName, getDate } from "../../utils";

const RightPanel = ({ sidePanel, mSidePanel, mediaDetails }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [personDetails, setPersonDetails] = useState([])
  const [storyDetails, setStoryDetails] = useState([])
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [field , setField] = useState("")


  const handleDialog = () => {
    setShowDialog(!showDialog);
  };


  const getPersonDetails = () => {
    let personarr = []
    if (mediaDetails.taggedPersons) {
      mediaDetails.taggedPersons.map(async (person) => {
        await apiRequest(GET, `persons/${person}/info`).then((res) => {
          personarr.push(res.data)
        });
        personarr.sort(function (a, b) {
          return mediaDetails.taggedPersons.indexOf(a.id) - mediaDetails.taggedPersons.indexOf(b.id);
        });
        setPersonDetails([...personarr])
      })
    }
  }

  const getStoryDetails = () => {
    let storyarr = []
    if (mediaDetails.storyIds) {
      mediaDetails.storyIds.map(async (storyId) => {
        await apiRequest(GET, `Story/${storyId}`).then((res) => {
          storyarr.push(res.data)
        });
        storyarr.sort(function (a, b) {
          return mediaDetails.storyIds.indexOf(a.id) - mediaDetails.storyIds.indexOf(b.id);
        });
        setStoryDetails([...storyarr])
      })
    }
  }


  useEffect(() => {
    getPersonDetails()
    getStoryDetails()
  }, [mediaDetails])



  const { userProfileAccount } = useSelector(state => state.user);
  const { userDetails } = useSelector(state => state.media);


  const dispatch = useDispatch();
  const history = useHistory()

  useEffect(() => {
    if (userProfileAccount) {
      dispatch(getTrees(userProfileAccount.id));
    }
  }, [userProfileAccount])

  useEffect(() => {
    if (mediaDetails && mediaDetails.ownerId) {
      dispatch(getUserDetails(mediaDetails.ownerId))
    }
  }, [mediaDetails])


  const redirectFeaturedStory = (story) => {
    dispatch(featuredStoryRedirect(story.storyId))
    history.push(`/stories/view/0/${story.storyId}?mediaId=${mediaDetails?.mediaId}`)
  }

  const showDialogEdit = (fieldname) => {
    setField(fieldname);
    setShowEditDialog(true)
  }

  const UserDetails = () => (
    <div>
      <div className="flex mb-4 leading-4">
        <div>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.99935 7H4.33268C4.15587 7 3.9863 7.07024 3.86128 7.19526C3.73625 7.32029 3.66602 7.48986 3.66602 7.66667C3.66602 7.84348 3.73625 8.01305 3.86128 8.13807C3.9863 8.2631 4.15587 8.33333 4.33268 8.33333H4.99935C5.17616 8.33333 5.34573 8.2631 5.47075 8.13807C5.59578 8.01305 5.66602 7.84348 5.66602 7.66667C5.66602 7.48986 5.59578 7.32029 5.47075 7.19526C5.34573 7.07024 5.17616 7 4.99935 7Z"
              fill="#747578"
            />
            <path
              d="M8.33333 7H7.66667C7.48986 7 7.32029 7.07024 7.19526 7.19526C7.07024 7.32029 7 7.48986 7 7.66667C7 7.84348 7.07024 8.01305 7.19526 8.13807C7.32029 8.2631 7.48986 8.33333 7.66667 8.33333H8.33333C8.51014 8.33333 8.67971 8.2631 8.80474 8.13807C8.92976 8.01305 9 7.84348 9 7.66667C9 7.48986 8.92976 7.32029 8.80474 7.19526C8.67971 7.07024 8.51014 7 8.33333 7Z"
              fill="#747578"
            />
            <path
              d="M11.6663 7H10.9997C10.8229 7 10.6533 7.07024 10.5283 7.19526C10.4032 7.32029 10.333 7.48986 10.333 7.66667C10.333 7.84348 10.4032 8.01305 10.5283 8.13807C10.6533 8.2631 10.8229 8.33333 10.9997 8.33333H11.6663C11.8432 8.33333 12.0127 8.2631 12.1377 8.13807C12.2628 8.01305 12.333 7.84348 12.333 7.66667C12.333 7.48986 12.2628 7.32029 12.1377 7.19526C12.0127 7.07024 11.8432 7 11.6663 7Z"
              fill="#747578"
            />
            <path
              d="M4.99935 9.66663H4.33268C4.15587 9.66663 3.9863 9.73686 3.86128 9.86189C3.73625 9.98691 3.66602 10.1565 3.66602 10.3333C3.66602 10.5101 3.73625 10.6797 3.86128 10.8047C3.9863 10.9297 4.15587 11 4.33268 11H4.99935C5.17616 11 5.34573 10.9297 5.47075 10.8047C5.59578 10.6797 5.66602 10.5101 5.66602 10.3333C5.66602 10.1565 5.59578 9.98691 5.47075 9.86189C5.34573 9.73686 5.17616 9.66663 4.99935 9.66663Z"
              fill="#747578"
            />
            <path
              d="M8.33333 9.66663H7.66667C7.48986 9.66663 7.32029 9.73686 7.19526 9.86189C7.07024 9.98691 7 10.1565 7 10.3333C7 10.5101 7.07024 10.6797 7.19526 10.8047C7.32029 10.9297 7.48986 11 7.66667 11H8.33333C8.51014 11 8.67971 10.9297 8.80474 10.8047C8.92976 10.6797 9 10.5101 9 10.3333C9 10.1565 8.92976 9.98691 8.80474 9.86189C8.67971 9.73686 8.51014 9.66663 8.33333 9.66663Z"
              fill="#747578"
            />
            <path
              d="M11.6663 9.66663H10.9997C10.8229 9.66663 10.6533 9.73686 10.5283 9.86189C10.4032 9.98691 10.333 10.1565 10.333 10.3333C10.333 10.5101 10.4032 10.6797 10.5283 10.8047C10.6533 10.9297 10.8229 11 10.9997 11H11.6663C11.8432 11 12.0127 10.9297 12.1377 10.8047C12.2628 10.6797 12.333 10.5101 12.333 10.3333C12.333 10.1565 12.2628 9.98691 12.1377 9.86189C12.0127 9.73686 11.8432 9.66663 11.6663 9.66663Z"
              fill="#747578"
            />
            <path
              d="M4.99935 12.3334H4.33268C4.15587 12.3334 3.9863 12.4036 3.86128 12.5286C3.73625 12.6537 3.66602 12.8232 3.66602 13C3.66602 13.1769 3.73625 13.3464 3.86128 13.4714C3.9863 13.5965 4.15587 13.6667 4.33268 13.6667H4.99935C5.17616 13.6667 5.34573 13.5965 5.47075 13.4714C5.59578 13.3464 5.66602 13.1769 5.66602 13C5.66602 12.8232 5.59578 12.6537 5.47075 12.5286C5.34573 12.4036 5.17616 12.3334 4.99935 12.3334Z"
              fill="#747578"
            />
            <path
              d="M8.33333 12.3334H7.66667C7.48986 12.3334 7.32029 12.4036 7.19526 12.5286C7.07024 12.6537 7 12.8232 7 13C7 13.1769 7.07024 13.3464 7.19526 13.4714C7.32029 13.5965 7.48986 13.6667 7.66667 13.6667H8.33333C8.51014 13.6667 8.67971 13.5965 8.80474 13.4714C8.92976 13.3464 9 13.1769 9 13C9 12.8232 8.92976 12.6537 8.80474 12.5286C8.67971 12.4036 8.51014 12.3334 8.33333 12.3334Z"
              fill="#747578"
            />
            <path
              d="M11.6663 12.3334H10.9997C10.8229 12.3334 10.6533 12.4036 10.5283 12.5286C10.4032 12.6537 10.333 12.8232 10.333 13C10.333 13.1769 10.4032 13.3464 10.5283 13.4714C10.6533 13.5965 10.8229 13.6667 10.9997 13.6667H11.6663C11.8432 13.6667 12.0127 13.5965 12.1377 13.4714C12.2628 13.3464 12.333 13.1769 12.333 13C12.333 12.8232 12.2628 12.6537 12.1377 12.5286C12.0127 12.4036 11.8432 12.3334 11.6663 12.3334Z"
              fill="#747578"
            />
            <path
              d="M14.333 2H12.4997C12.4555 2 12.4131 1.98244 12.3818 1.95118C12.3506 1.91993 12.333 1.87754 12.333 1.83333V0.666667C12.333 0.489856 12.2628 0.320286 12.1377 0.195262C12.0127 0.0702379 11.8432 0 11.6663 0C11.4895 0 11.32 0.0702379 11.1949 0.195262C11.0699 0.320286 10.9997 0.489856 10.9997 0.666667V3.83333C10.9997 3.96594 10.947 4.09312 10.8532 4.18689C10.7595 4.28065 10.6323 4.33333 10.4997 4.33333C10.3671 4.33333 10.2399 4.28065 10.1461 4.18689C10.0524 4.09312 9.99967 3.96594 9.99967 3.83333V2.33333C9.99967 2.24493 9.96455 2.16014 9.90204 2.09763C9.83953 2.03512 9.75475 2 9.66634 2H5.49967C5.45559 2 5.4133 1.98253 5.38206 1.95142C5.35082 1.92031 5.33318 1.87809 5.33301 1.834V0.666667C5.33301 0.489856 5.26277 0.320286 5.13775 0.195262C5.01272 0.0702379 4.84315 0 4.66634 0C4.48953 0 4.31996 0.0702379 4.19494 0.195262C4.06991 0.320286 3.99967 0.489856 3.99967 0.666667V3.83333C3.99967 3.96594 3.947 4.09312 3.85323 4.18689C3.75946 4.28065 3.63228 4.33333 3.49967 4.33333C3.36707 4.33333 3.23989 4.28065 3.14612 4.18689C3.05235 4.09312 2.99967 3.96594 2.99967 3.83333V2.33333C2.99967 2.24493 2.96456 2.16014 2.90204 2.09763C2.83953 2.03512 2.75475 2 2.66634 2H1.66634C1.31272 2 0.973581 2.14048 0.723532 2.39052C0.473484 2.64057 0.333008 2.97971 0.333008 3.33333V14.6667C0.333008 15.0203 0.473484 15.3594 0.723532 15.6095C0.973581 15.8595 1.31272 16 1.66634 16H14.333C14.6866 16 15.0258 15.8595 15.2758 15.6095C15.5259 15.3594 15.6663 15.0203 15.6663 14.6667V3.33333C15.6663 2.97971 15.5259 2.64057 15.2758 2.39052C15.0258 2.14048 14.6866 2 14.333 2ZM14.333 14.3333C14.333 14.4217 14.2979 14.5065 14.2354 14.569C14.1729 14.6315 14.0881 14.6667 13.9997 14.6667H1.99967C1.91127 14.6667 1.82648 14.6315 1.76397 14.569C1.70146 14.5065 1.66634 14.4217 1.66634 14.3333V6.33333C1.66634 6.24493 1.70146 6.16014 1.76397 6.09763C1.82648 6.03512 1.91127 6 1.99967 6H13.9997C14.0881 6 14.1729 6.03512 14.2354 6.09763C14.2979 6.16014 14.333 6.24493 14.333 6.33333V14.3333Z"
              fill="#747578"
            />
          </svg>
        </div>
        {mediaDetails?.mediaMetaData?.date && mediaDetails?.mediaMetaData.date.rawDate ?
          (<span className="ml-3 text-gray-700 break-all">{mediaDetails?.mediaMetaData?.date && getDate(mediaDetails?.mediaMetaData?.date)}</span>)
          : (<span onClick={() => showDialogEdit("date")} className="ml-3 text-blue-500 cursor-pointer hover:underline">
            Add Date
          </span>)
        }
      </div>
      <div className="flex mb-4 leading-4">
        <div>
          <svg
            width="12"
            height="16"
            viewBox="0 0 12 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6.00042 0C4.48545 0.00181469 3.03306 0.604437 1.96181 1.67568C0.890569 2.74692 0.287948 4.19932 0.286133 5.71429C0.286133 8.65943 5.00499 15.0514 5.54328 15.7714C5.5965 15.8424 5.66552 15.9 5.74487 15.9397C5.82421 15.9793 5.91171 16 6.00042 16C6.08913 16 6.17662 15.9793 6.25597 15.9397C6.33532 15.9 6.40434 15.8424 6.45756 15.7714C6.99585 15.0514 11.7147 8.65943 11.7147 5.71429C11.7129 4.19932 11.1103 2.74692 10.039 1.67568C8.96778 0.604437 7.51538 0.00181469 6.00042 0ZM6.00042 7.42857C5.66137 7.42857 5.32993 7.32803 5.04801 7.13966C4.7661 6.95129 4.54638 6.68356 4.41663 6.37031C4.28687 6.05707 4.25293 5.71238 4.31907 5.37985C4.38522 5.04731 4.54849 4.74185 4.78824 4.5021C5.02798 4.26236 5.33344 4.09909 5.66598 4.03294C5.99852 3.96679 6.3432 4.00074 6.65645 4.13049C6.96969 4.26024 7.23743 4.47997 7.4258 4.76188C7.61416 5.04379 7.7147 5.37523 7.7147 5.71429C7.7147 6.16894 7.53409 6.60498 7.2126 6.92647C6.89111 7.24796 6.45508 7.42857 6.00042 7.42857Z"
              fill="#747578"
            />
          </svg>
        </div>
        {mediaDetails?.mediaMetaData && mediaDetails?.mediaMetaData?.location ? (
          <span className="ml-4 text-gray-700 break-all">{mediaDetails?.mediaMetaData && mediaDetails?.mediaMetaData?.location}</span>
        ) : (
          <span onClick={() => showDialogEdit("location")} className="ml-4 text-blue-500 cursor-pointer hover:underline">
            Add Location
          </span>
        )}
      </div>
      {mediaDetails?.mediaMetaData && mediaDetails?.mediaMetaData?.description ?
        (<p className="flex mb-4 leading-6 text-gray-700 break-all">
          {mediaDetails?.mediaMetaData?.description}
        </p>) : (
          <span onClick={() => showDialogEdit("caption")} className="flex mb-4 text-blue-500 cursor-pointer hover:underline">
            Add photo caption
          </span>
        )
      }
    </div>
  )


  return (
    <>
      <div
        className={`w-full right-sidepanel ${mSidePanel ? "open-sidebar" : "hidden open-sidebar"
          } md:block m-flow bg-white md:w-1/4 ${sidePanel ? "open-sidebar" : "md:hidden"
          }`}
      >
        <div className="flex justify-between photo-header p-6 border-b">
          <h2 className="text-2xl font-bold break-word pr-7 pt-2">{mediaDetails?.mediaMetaData && mediaDetails?.mediaMetaData.title ? mediaDetails?.mediaMetaData.title : <span onClick={() => showDialogEdit("title")} className="text-gray-400 cursor-pointer hover:underline">
            Photo Title
          </span>} </h2>
          <div className="pt-3">
            <div className="saved-story-actions">
              <DropdownWidget mediaDetails={mediaDetails} fieldName={field} setField={setField} showEditDialog={showEditDialog} setShowEditDialog={setShowEditDialog} />
            </div>
          </div>
        </div>
        <div className="p-6 text-sm">
          {UserDetails()}
          <div className="photo-author py-5">
            <div className="flex">
              {userDetails.profileImageUrl ? (
                <div className="avtar-circle-large mr-2">
                  <img
                    className="rounded-full object-cover"
                    src={userDetails.profileImageUrl}
                    alt=""
                  />
                </div>
              ) : (
                <div class="mr-2 card-avatar overflow-hidden bg-gray-700 flex items-center justify-center avtar-circle-large">
                  <span class="defaultText secondary-color text-sm typo-font-medium">
                    <span class="font-thin text-white">
                      {getAvatarName(userDetails?.givenName, userDetails?.surname, true)}
                    </span>
                  </span>
                </div>
              )}

              <div className="avtar-circle-large-name">
                <p className="text-xs text-gray-700 sub-title">Added by</p>
                <h4 className="text-gray-700 text-sm leading-2 break-all main-title">
                  {userDetails?.givenName} {userDetails?.surname}
                </h4>
              </div>
            </div>
          </div>
          <div>
            <div className="flex justify-between">
              <p className="mb-1 mt-2 text-gray-500 text-xs">Saved to</p>
              <button onClick={() => handleDialog()}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.90223 12.0742C1.09647 10.8683 0.666379 9.45056 0.666341 8.00023C0.668584 6.05595 1.44194 4.19194 2.81676 2.81712C4.19158 1.44231 6.05558 0.66895 7.99986 0.666707C9.45019 0.666745 10.8679 1.09683 12.0739 1.9026C13.2798 2.70839 14.2197 3.8537 14.7748 5.1937C15.3298 6.53369 15.4751 8.00818 15.1921 9.4307C14.9091 10.8532 14.2107 12.1599 13.1851 13.1855C12.1595 14.2111 10.8529 14.9095 9.43034 15.1925C8.00781 15.4754 6.53332 15.3302 5.19333 14.7752C3.85334 14.2201 2.70803 13.2802 1.90223 12.0742ZM9.04011 12.3738L8.80441 12.1381L9.04012 12.3738C9.22765 12.1863 9.33301 11.9319 9.33301 11.6667V9.33337H11.6663C11.9316 9.33337 12.1859 9.22802 12.3734 9.04048L12.1377 8.80478L12.3735 9.04048C12.561 8.85294 12.6663 8.59859 12.6663 8.33337V7.66671C12.6663 7.40149 12.561 7.14714 12.3734 6.9596C12.1859 6.77206 11.9316 6.66671 11.6663 6.66671H9.33301V4.33337C9.33301 4.06816 9.22765 3.8138 9.04012 3.62627C8.85258 3.43873 8.59822 3.33337 8.33301 3.33337H7.66634C7.40112 3.33337 7.14677 3.43873 6.95923 3.62627C6.7717 3.8138 6.66634 4.06816 6.66634 4.33337V6.66671H4.33301C4.06779 6.66671 3.81344 6.77207 3.6259 6.9596C3.43836 7.14714 3.33301 7.40149 3.33301 7.66671V8.33337C3.33301 8.59859 3.43836 8.85294 3.6259 9.04048C3.81344 9.22802 4.06779 9.33337 4.33301 9.33337H6.66634V11.6667C6.66634 11.9319 6.7717 12.1863 6.95923 12.3738C7.14677 12.5614 7.40113 12.6667 7.66634 12.6667H8.33301C8.59822 12.6667 8.85258 12.5614 9.04011 12.3738Z"
                    fill="#747578"
                    stroke="#747578"
                    strokeWidth="0.666667"
                  />
                </svg>
              </button>
            </div>
            <div className="person-wrap flex flex-wrap">
              {personDetails && personDetails.map((item, index) => (
                <div
                  key={index}
                  className="person-in-story text-blue-500 text-sm mr-2 flex flex-wrap"
                >
                  <Person item={item} authorId={userDetails.userId} personLength={personDetails.length} personDetail={personDetails} removePhoto={true} personId={item.id} mediaId={mediaDetails?.mediaId} />
                  {index < personDetails.length - 1 && ","}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-gray-500 text-xs mt-6">Featured in</h3>
            {storyDetails && storyDetails.length > 0 && storyDetails.map((story) => (
              <div className="flex">
                <img
                  className="w-10 p-1 border cursor-pointer"
                  src={story?.storyImages[0].url}
                  alt=""
                  onClick={() => redirectFeaturedStory(story)}
                />
                <h2
                  onClick={() => redirectFeaturedStory(story)}
                  className="text-gray-700 cursor-pointer text-sm font-semibold ml-2 mt-0.5">
                  {story.title}
                </h2>
              </div>
            ))}
              <div className="text-blue-500 mt-3 cursor-pointer hover:underline break-all" onClick={()=>history.push(`/stories/add-from-media/4/${mediaDetails.mediaId}`)}>
                Create a story with this image
              </div>
          </div>
        </div>
      </div>
      <TailwindModal
        title="Save Image"
        showClose={true}
        content={<STTForm getOptionDisabled={personDetails} handleSubmitForm={(values) => {
          const personId = values.peopleList.id
          dispatch(addPersonToMedia(personId, mediaDetails?.mediaId, setShowDialog))
        }} />}
        setShowModal={setShowDialog}
        showModal={showDialog}
        innerClasses="max-w-sm"
      />
    </>
  );
};

export default RightPanel;

