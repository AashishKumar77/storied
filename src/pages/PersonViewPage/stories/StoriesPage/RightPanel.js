import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRightPanelDetails, getSpousesWithChildren } from "../../../../redux/actions/story";
import Typography from "./../../../../components/Typography";
import RightLoader from "./contentLoader/Right";
import { tr } from "./../../../../components/utils";
import { showBirthandDeath } from "shared-logics";
import { getPersonProfileUrl } from "./../../../../components/utils/genderIcon";

const RightPanel = () => {
  const { rightPanelDetails, isLoading, spousesnchildren } = useSelector((state) => state.story);
  const { treeId, primaryPersonId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const childrensRawArray = spousesnchildren && spousesnchildren.Spouses && spousesnchildren.Spouses.map((value) => value.children);
  const childrenArray = [].concat.apply([], childrensRawArray);

  useEffect(() => {
    dispatch(getRightPanelDetails({ personId: primaryPersonId, treeId }));
    dispatch(getSpousesWithChildren({ personId: primaryPersonId, treeId }));
  }, [dispatch, primaryPersonId, treeId]);

  const getUsersLifeSpan = (content) => {
    const startDate = new Date(content.birthDate || content.birth?.Date);
    const endDate = new Date(content.deathDate || content.death?.Date);
    let birthDate = startDate.getFullYear();
    let deathDate = endDate.getFullYear();
    if (isNaN(birthDate)) birthDate = "";
    if (isNaN(deathDate)) deathDate = "";
    return showBirthandDeath(birthDate, deathDate, false);
  };

  return (
    <>
      <div className="tw-stories-right-panel ml-auto">
        <div className="story-relations w-full">
          {isLoading ? (
            <RightLoader />
          ) : (
            <>
              <div className="rel-list-items mb-5">
                {rightPanelDetails?.Parents[0]?.Combination && (
                  <h3 className="mb-3">
                    <Typography size={12}>Parents</Typography>
                  </h3>
                )}
                {rightPanelDetails?.Parents[0]?.Combination.map((parent) => (
                  <div onClick={() => history.push(`/family/person-page/${treeId}/${parent.id}?tab=0`)} key={parent.id} className="rel-list-item cursor-pointer">
                    <div className="rel-item flex w-full items-center avtar-group">
                      <div className="rel-media mr-2 avtar-square-medium ">{parent.profileImageUrl ? <img src={parent.profileImageUrl} className="object-cover" alt="avatar" /> : <img src={getPersonProfileUrl(parent)} alt={parent.Gender} />}</div>
                      <div className="rel-info avtar-square-medium-name">
                        <h5 className="main-title">
                          <Typography size={14} text="secondary" weight="medium">{`${parent.firstName} ${parent.lastName}`}</Typography>
                        </h5>
                        <p className="sub-title">
                          <Typography size={10}>{getUsersLifeSpan(parent)}</Typography>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rel-list-items mb-5">
                {spousesnchildren && !!spousesnchildren.Spouses && !!spousesnchildren.Spouses.length && (
                  <h3 className="mb-3">
                    <Typography size={12}>{tr(t, "person.table.spousechildren.spouse")}</Typography>
                  </h3>
                )}
                {spousesnchildren &&
                  spousesnchildren.Spouses &&
                  spousesnchildren.Spouses.map((spouse) => (
                    <div onClick={() => history.push(`/family/person-page/${treeId}/${spouse.id}?tab=0`)} key={spouse.id} className="rel-list-item cursor-pointer">
                      <div className="rel-item flex w-full items-center avtar-group">
                        <div className="rel-media mr-2 avtar-square-medium ">{spouse.imgsrc ? <img src={spouse.imgsrc} className="object-cover" alt="avatar" /> : <img src={getPersonProfileUrl(spouse)} alt={spouse.Gender} />}</div>
                        <div className="rel-info avtar-square-medium-name">
                          <h5 className="main-title">
                            <Typography size={14} text="secondary" weight="medium">
                              {spouse.firstName?.GivenName || spouse.lastName?.Surname ? `${spouse.firstName?.GivenName} ${spouse.lastName?.Surname}` : tr(t, "person.unknownSpouse")}
                            </Typography>
                          </h5>
                          <p className="sub-title">
                            <Typography size={10}>{getUsersLifeSpan(spouse)}</Typography>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="rel-list-items mb-5">
                {childrenArray && !!childrenArray.length && (
                  <h3 className="mb-3">
                    <Typography size={12}>{tr(t, "person.table.spousechildren.children")}</Typography>
                  </h3>
                )}
                {childrenArray &&
                  childrenArray.map((child) => (
                    <div onClick={() => history.push(`/family/person-page/${treeId}/${child.id}?tab=0`)} key={child.id} className="rel-list-item cursor-pointer">
                      <div className="rel-item flex w-full items-center avtar-group">
                        <div className="rel-media mr-2 avtar-square-medium ">{child.imgsrc ? <img src={child.imgsrc} className="object-cover" alt="avatar" /> : <img src={getPersonProfileUrl(child)} alt={child.Gender} />}</div>
                        <div className="rel-info  avtar-square-medium-name">
                          <h5 className="main-title">
                            <Typography size={14} text="secondary" weight="medium">
                              {child.firstName?.GivenName || child.lastName?.Surname ? `${child.firstName?.GivenName} ${child.lastName?.Surname}` : tr(t, "person.unknownChildren")}
                            </Typography>
                          </h5>
                          <p className="sub-title">
                            <Typography size={10}>{getUsersLifeSpan(child)}</Typography>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RightPanel;
