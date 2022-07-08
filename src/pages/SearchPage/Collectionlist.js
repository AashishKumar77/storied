import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tr } from "../../components/utils";
import Typography from "./../../components/Typography";
import {
  numToLocaleString,
  wwiGUID,
  censusGUID,
  uscensusGUID,
  wwiiPK,
  irishPK,
  germanPK,
  russianPK,
  massachussetsPK,
  USSocialPK,
  NYCMarriagesPK,
  italiansGUID,
  texasMarriagesPK,
  USFederal1800PK,
  USFederal1810PK,
  MassachusettsMarriagesPK,
  USFederal1820PK,
  USFederal1830PK,
  OhioPK
} from "./../../utils";
import Loader from "../../components/Loader";

const Collectionlist = forwardRef(() => {
  const { t } = useTranslation();

  const { collections, collectionLoading } = useSelector(
    (state) => state.search
  );

  const handleCollectionClick = (collectionGUID) => {
    switch (collectionGUID) {
      case wwiGUID:
        return "search/world-war-i-casualties";
      case wwiiPK:
        return "search/world-war-ii-army-enlistments";
      case uscensusGUID:
        return "search/1790-united-states-federal-census";
      case USFederal1800PK:
        return "search/1800-united-states-federal-census"
      case USFederal1810PK:
        return "search/1810-united-states-federal-census"
      case USFederal1820PK:
        return "search/1820-united-states-federal-census"
      case USFederal1830PK:
          return "search/1830-united-states-federal-census"
      case censusGUID:
        return "search/1940-united-states-federal-census";
      case massachussetsPK:
        return "search/massachusetts-state-deaths"
      case USSocialPK:
        return "search/united-states-social-security-death-index"
      case germanPK:
        return "search/german-immigrants";
      case russianPK:
        return "search/russian-immigrants";
      case italiansGUID:
        return "search/italian-immigrants"
      case irishPK:
        return "search/irish-famine-passenger-records";
      case MassachusettsMarriagesPK:
        return "/search/massachusetts-state-marriages"
      case texasMarriagesPK:
        return "search/texas-marriages"
      case NYCMarriagesPK:
        return "search/new-york-city-marriages"
      case OhioPK : 
        return "search/ohio-state-deaths"

      default:
        return "";
    }
  };

  return (
    <div className="px-6 md:px-9 max-w-src-modal-w w-full mx-auto relative mb-8">
      <table className="w-full">
        <thead>
          <tr className="flex justify-between sm:justify-between w-full items-center pb-1">
            <th className="font-normal">
              <Typography text="secondary" weight="medium">
                {tr(t, "search.start.collectionSearch")}
              </Typography>
            </th>
            <th className="font-normal pb-1">
              <Typography size={14}>{tr(t, "search.start.records")}</Typography>
            </th>
          </tr>
        </thead>
        <tbody>
          {collectionLoading ? (
            <tr>
              <td colSpan="2">
                <Loader />
              </td>
            </tr>
          ) : (
            <>
              {collections &&
                collections?.map((item, index) => (
                  <tr
                    key={index}
                    className="flex justify-between sm:justify-between w-full items-center md:border-b md:border-gray-300"
                  >
                    <td className="py-1.5">
                      <p className="truncate text-blue-400 uni-collection-name">
                        <Typography size={14} text="primary">
                          <Link
                            className="hover:underline"
                            to={handleCollectionClick(item.collectionGUID)}
                          >
                            {item.collectionTitle}
                          </Link>
                        </Typography>
                      </p>
                    </td>
                    <td className="py-1.5">
                      <Typography size={14} text="secondary">
                        {numToLocaleString(item.recordCount || 0)}
                      </Typography>
                    </td>
                  </tr>
                ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default Collectionlist;
