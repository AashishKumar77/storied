import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  encodeDataToURL,
  formDataTrim,
  getPageSize,
  getWWIIDefaultValue, wwiiPK,
} from "../../../../utils";
import { tr } from "../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../MetaData";
import WWIIBgImg from "../../../../assets/images/wwll-us-army-banner.jpg";
import "../../index.css";
import WWIISearchForm from "../components/SearchForm";
import { getContentCatalog, updateContentCatalog } from "../../../../redux/actions/sidebar";
import { getWWIIDropdownList } from "../../../../redux/actions/ww2";
import { useHistory } from "react-router-dom";

const SearchPage = () => {
  const defaultValues = getWWIIDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });

  useEffect(() => {
    dispatch(getWWIIDropdownList())
    dispatch(getContentCatalog({ partitionKey: wwiiPK }))
    return () => {
      dispatch(updateContentCatalog())
    }
  }, [dispatch]);

  const history = useHistory()

  const handleSubmitWWII = (wwiiForm, { setSubmitting }) => {
    setSubmitting(false);
    const WWIIUrlQuery = encodeDataToURL({
      ...formDataTrim(wwiiForm),
      pn: 1,
      ps: getPageSize(),
      ci: wwiiPK
    });
    history.push("/search/world-war-ii-army-enlistments/result?" + WWIIUrlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                className="inline-block h-24 h-full w-full object-cover"
                src={WWIIBgImg}
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <WWIISearchForm
            title={contentCatalog?.collectionTitle}
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitWWII={handleSubmitWWII}
            WWIIClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
