import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  encodeDataToURL,
  getPageSize,
  formDataTrim,
  getUSFederalCensusDefaultValue,
  censusPK,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import USFederalCensusSearchForm from "../components/SearchForm";
import { getUSFederalCensusDropdownList } from "../../../../../redux/actions/USFederalCensus";
import MetaData from "../../../MetaData";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import BannerTop from "../../../../../assets/images/ny-public-library-banner.jpg";
import "../../../index.css";
const SearchPage = () => {
  const history = useHistory();
  const defaultValues = getUSFederalCensusDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getUSFederalCensusDropdownList());
    dispatch(getContentCatalog({ partitionKey: censusPK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitUSFederalCensus = (values, { setSubmitting }) => {
    setSubmitting(false);
    if (!values?.b?.l?.l) {
      delete values.b.l;
    }
    if (!values?.b?.li?.i) {
      delete values.b.li;
    }
    if (!values?.b?.y?.y) {
      delete values.b.y;
    }
    if (!values?.r?.l?.l) {
      delete values.r.l;
    }
    if (!values?.r?.li?.i) {
      delete values.r.li;
    }
    if (!values?.pr?.l?.l) {
      delete values.pr.l;
    }
    if (!values?.pr?.li?.i) {
      delete values.pr.li;
    }
    if (!values?.matchExact) {
      delete values.matchExact;
    }
    const urlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: censusPK
    });
    history.push("/search/1940-united-states-federal-census/result?" + urlQuery);
  };
  return (
    <div className="main-container">
      <div
        className="pt-12 md:pt-14 h-full md:bg-transparent bg-white"
      >
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                src={BannerTop}
                className="inline-block h-24 h-full w-full object-cover"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <USFederalCensusSearchForm
            title={contentCatalog?.collectionTitle}
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitUSFederalCensus={handleSubmitUSFederalCensus}
            clear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
