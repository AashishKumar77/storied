import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getRecentPeopleList } from "../../../redux/actions/homepage";
import Typography from "./../../../components/Typography";
import { tr, getDateString } from "../../../components/utils";
import { getPersonProfileUrl } from "./../../../components/utils/genderIcon";
import RecentLoader from "./RecentLoader";


const RecentPeople = ({ user }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { isRecentProple, recentProple } = useSelector(
    (state) => state.homepage
  );
  const goToPersonPage = (item) => {
    history.push(`/family/person-page/${item.treeId}/${item.personId}`);
  };

  useEffect(() => {
    if (user) dispatch(getRecentPeopleList());
  }, [user, dispatch]);
  const getRecentPeople = () => {
    return (
      <div className="recent-ppl-list">
        {recentProple.map((item, index) => {
          return (
            <div
              className="flex items-center mb-2 cursor-pointer avtar-group"
              key={index}
              onClick={() => goToPersonPage(item)}
            >
              <div className="media mr-2 avtar-square-medium">
                {item.profileImageUrl ? (
                  <img
                    src={item.profileImageUrl}
                    alt=""
                    className="w-8 h-8 object-cover"
                  />
                ) : (
                  <img src={getPersonProfileUrl(item)} alt={item.Gender} />
                )}
              </div>
              <div className="media-info flex-grow avtar-square-medium-name">
                <div className="recent-user-info">
                  <p className="title main-title">
                    <Typography size={12} text="secondary" weight="medium">
                      {`${item.givenName} ${item.surname}`}
                    </Typography>
                  </p>
                  <p className="date-tree flex flex-wrap sub-title">
                    <span className={`${getDateString(item) && 'date relative pr-2'}`}>
                      <Typography size={10}>{getDateString(item)}</Typography>
                    </span>
                    <Typography size={10}>{item.treeName}</Typography>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  return (
    <>
      {recentProple.length === 0 ? (<div id="recent-card" className="bg-white card recent-people-card">
        {isRecentProple && <div className="card-content-wrap py-3 px-6">
          <div className="head flex justify-between items-center mb-4">
            <h3>
              <Typography size={14} text="secondary" weight="medium">
                {tr(t, "home.profile.recentlyViewed")}
              </Typography>
            </h3>
          </div>
          <div className="card-content pb-3">{<RecentLoader />}</div>
        </div>}
      </div>
      ) : (
        <div id="recent-card" className="bg-white card recent-people-card">
          <div className="card-content-wrap py-3 px-6">
            <div className="head flex justify-between items-center mb-4">
              <h3>
                <Typography size={14} text="secondary" weight="medium">
                  {tr(t, "home.profile.recentlyViewed")}
                </Typography>
              </h3>
            </div>
            <div className="card-content pb-3">{getRecentPeople()}</div>
          </div>
        </div>
      )}
    </>
  );
};
export default RecentPeople;
