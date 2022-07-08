import React, { useEffect } from "react";
import WWISearchForm from "../components/SearchForm";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getWWIList } from "../../../../redux/actions/ww1";
import { getContentCatalog, updateContentCatalog } from "../../../../redux/actions/sidebar";
import {
  getWWIDefaultValue,
  encodeDataToURL,
  getPageSize,
  formDataTrim,
  wwiPK,
} from "../../../../utils";
import { tr } from "../../../../components/utils";
import { useTranslation } from "react-i18next";
import Typography from "../../../../components/Typography";
import BannerTop from "../../../../assets/images/wwiPhoto.jpg";
import "../../index.css";
import MetaData from "../../MetaData";
const SearchPage = () => {
  const history = useHistory();
  const defaultValues = getWWIDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getWWIList());
    dispatch(getContentCatalog({ partitionKey: wwiPK }));
    return () => {
      dispatch(updateContentCatalog());
    }
  }, [dispatch]);
  const headerContent = () => (
    <div className="head mb-5 flex flex-wrap justify-between items-center">
      <h1 className="inline mb-0">
        <Typography size={24} text="secondary" weight="medium">
          {contentCatalog?.collectionTitle}
        </Typography>
      </h1>
    </div>
  );

  const handleSubmitWWW1 = (formValues, { setSubmitting }) => {
    setSubmitting(false);
    if (!formValues?.matchExact) {
      delete formValues.matchExact;
    }
    if (formValues?.fm?.t?.givenName?.givenName) {
      formValues["fm"]["t"] = formValues?.fm?.t?.givenName?.givenName
    }
    if (formValues?.fm?.t?.name) {
      formValues["fm"]["t"] = formValues?.fm?.t?.name
    }
    const urlQuery = encodeDataToURL({
      ...formDataTrim(formValues),
      pn: 1,
      ps: getPageSize(),
      ci: wwiPK
    });
    history.push("/search/world-war-i-casualties/result?" + urlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
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
          {headerContent()}
          <WWISearchForm
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitWWW1={handleSubmitWWW1}
            clear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
        {/* <div className="page-wrap bg-white md:bg-gray-100">
            </div> */}
      </div>
    </div>
  );
};

export default SearchPage;
