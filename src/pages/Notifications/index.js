import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./index.css";
import { getnotification, updateLastTimeUserSawNotification } from "./../../redux/actions/notification";
import NotificationCard from "./NotificationCard";

const Notifications = () => {
  const { notif } = useSelector((state) => state.notification);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const pageEnd = useRef(null);

  const loadMoreNotif = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  useEffect(() => {
    dispatch(updateLastTimeUserSawNotification());
  }, []);

  useEffect(() => {
    dispatch(getnotification({ pageNumber, pageSize: 10 }));
    setLoading(true);
  }, [dispatch, pageNumber]);

  useEffect(() => {
    if (loading) {
      const options = {
        root: null,
        rootMargin: "50px",
        threshold: 0,
      };
      let observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMoreNotif();
        }
      }, options);
      observer.observe(pageEnd.current);
    }
  }, [loading]);

  return (
    <>
      <div className="bg-gray-200">
        <div className="pt-16 pb-8 md:pt-20 main-wrapper notifications-page mx-auto smd:px-3">
          <div className="w-full max-w-2xl mx-auto md:px-4 pt-0.5 md:pt-0">
            <div className="smd:rounded-xl notifications-wrap shadow overflow-hidden">
              {notif && notif.map((item, index) => <NotificationCard key={index} item={item} />)}
              <div ref={pageEnd}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
