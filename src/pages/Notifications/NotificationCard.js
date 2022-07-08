import React, { useRef, useEffect, useCallback } from "react";
import NotifLoader from "./NotifLoader";
import Typography from "./../../components/Typography";
import { getActulNotification, markReadNotification, refreshNotif } from "../../redux/actions/notification";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import ClassNames from "classnames";
import AccountAvatar from "../../components/AccountAvatar";

const NotificationCard = ({ item }) => {
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const notifRef = useRef(null);
  const ioRef = useRef(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const getSplitData = (data) => {
    let combinedGuid = data.split("|"),
      notifId = combinedGuid[0],
      storyId = combinedGuid[1],
      userId = combinedGuid[2],
      isRead = combinedGuid[3];
    return { notifId, storyId, userId, isRead };
  };
  const loadActualNotification = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > 0) {
          if (typeof item === "string") {
            const splitData = getSplitData(item);
            dispatch(getActulNotification(splitData.notifId, splitData.storyId, splitData.userId, splitData.isRead));
            notifRef.current && ioRef.current.unobserve(notifRef.current);
          }
        }
      });
    },
    [dispatch, item]
  );

  const handleViewNotif = (notifId, storyId) => {
    dispatch(markReadNotification(notifId));
    history.push(`/stories/view/3/${storyId}`);
  };
  useEffect(() => {
    if (headingRef?.current?.clientHeight === 24) {
      headingRef?.current?.classList.remove("max-two-lines");
      contentRef?.current?.classList.add("max-three-lines");
    } else if (headingRef?.current?.clientHeight > 24) {
      headingRef?.current?.classList.add("max-two-lines");
      contentRef?.current?.classList.add("max-two-lines");
      contentRef?.current?.classList.remove("max-three-lines");
    }
  }, [headingRef.current, contentRef.current]);
  useEffect(() => {
    if (notifRef.current) {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      ioRef.current = new IntersectionObserver(loadActualNotification, options);
      ioRef.current.observe(notifRef.current);
    }
    return () => {
      notifRef.current && ioRef.current.unobserve(notifRef.current);
    };
  }, [notifRef, loadActualNotification]);

  useEffect(() => {
    return () => {
      dispatch(refreshNotif());
    }
  },[dispatch])
  return (
    <>
      <div className="flex notification-card cursor-pointer" ref={notifRef}>
        {typeof item === "string" ? (
          <NotifLoader />
        ) : (
          <div
            className={ClassNames("flex w-full bg-white pt-4 pb-6 px-4 sm:px-6", {
              "opacity-60 hover:opacity-100": item?.isRead === "True",
            })}
            onClick={() => handleViewNotif(item?.notifId, item?.story?.storyId)}
          >
            <div className="nu-icon mr-4">
              <div className="w-10 h-10 rounded-full overflow-hidden avtar-circle-medium">
                {/* item?.user?.profileImageUrl */}
                <AccountAvatar avatarName={`${item?.user?.givenName?.[0]}${item?.user?.surname?.[0]}`} imgSrc={item?.user?.profileImageUrl} />
                <img src={item?.user?.profileImageUrl} alt="" className="w-10 h-10 rounded-full overflow-hidden object-cover" />
              </div>
            </div>
            <div className="notification-info w-full">
              <div className="mb-2 relative inline-flex pr-26">
                <p className="ol-text">
                  <Typography size={14} weight="bold" text="secondary">
                    {item?.user?.givenName} {item?.user?.surname}{" "}
                  </Typography>
                </p>
                <p className="absolute right-0">
                  <Typography size={14}>liked your story</Typography>
                </p>
              </div>
              <div className="flex">
                <div className="mb-2 flex-grow">
                  <h3 className="notif-head" ref={headingRef}>
                    <Typography size={14} weight="bold" text="secondary">
                      {item?.story?.title}
                    </Typography>
                  </h3>
                  <p className="notif-content" ref={contentRef}>
                    <Typography size={14}>{item?.story?.content}</Typography>
                  </p>
                </div>
                <div className="overflow-hidden ml-6 mt-1 nu-img-r flex items-center justify-center">
                  <img src={item?.story?.storyImages?.[0]?.url} alt="" className="w-auto h-auto object-cover" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
export default NotificationCard;
