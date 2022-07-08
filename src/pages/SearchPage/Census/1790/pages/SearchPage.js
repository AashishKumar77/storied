import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getPageSize,
  formDataTrim,
  getUSCensusDefaultValue,
  encodeDataToURL,
  uscensusGUID,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../../MetaData";
import USCensusBGImage from "../../../../../assets/images/ny-public-library-banner.jpg";
import "../../../index.css";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import { useHistory } from "react-router-dom";
import USCensusSearchForm from "../components/SearchForm";
import { getUSCensusDropdownList } from "../../../../../redux/actions/USCensus";

const SearchPage = () => {
  const defaultUSValues = getUSCensusDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });

  useEffect(() => {
    dispatch(getUSCensusDropdownList())
    dispatch(getContentCatalog({ partitionKey: uscensusGUID }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);

  const handleSubmitUSCensus = (values, { setSubmitting }) => {
    setSubmitting(false);
    const USCensusUrlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: uscensusGUID
    });
    history.push("/search/1790-united-states-federal-census/result?" + USCensusUrlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-16 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                src={USCensusBGImage}
                className="inline-block h-24 h-full w-full object-cover"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <USCensusSearchForm
            title={
              contentCatalog?.collectionTitle
            }
            width={"md:w-1/2"}
            defaultUSValues={defaultUSValues}
            handleSubmitUSCensus={handleSubmitUSCensus}
            censusClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
