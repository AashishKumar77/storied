import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import "../../../index.css";
import italianBgImg from "../../../../../assets/images/germans-to-america-banner.jpg";
import { tr } from "../../../../../components/utils";
import {
  italiansGUID,
  getItaliansToAmericaDefaultValue,
  getPageSize,
  formDataTrim,
  encodeDataToURL,
} from "../../../../../utils";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import { getItaliansDropdownList } from "../../../../../redux/actions/ItaliansToAmerica";
import MetaData from "../../../MetaData";
import ItaliansToAmericaSearchForm from "../components/SearchForm";

const SearchPage = () => {
  const history = useHistory(),
    defaultValues = getItaliansToAmericaDefaultValue(),
    { t } = useTranslation(),
    dispatch = useDispatch(),
    { contentCatalog } = useSelector((state) => {
      return state.sidebar;
    });
  useEffect(() => {
    dispatch(getItaliansDropdownList());
    dispatch(getContentCatalog({ partitionKey: italiansGUID }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitForm = (values, { setSubmitting }) => {
    setSubmitting(false);
    const formUrlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: italiansGUID
    });
    history.push("/search/italian-immigrants/result?" + formUrlQuery);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                src={italianBgImg}
                className="inline-block h-24 h-full w-full object-cover"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <ItaliansToAmericaSearchForm
            title={contentCatalog?.collectionTitle}
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitForm={handleSubmitForm}
            italianClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
