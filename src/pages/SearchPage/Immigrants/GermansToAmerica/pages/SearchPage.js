import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  germanPK,
  getGermanToAmericaDefaultValue,
  getPageSize,
  formDataTrim,
  encodeDataToURL,
} from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../../MetaData";
import germanBgImg from "../../../../../assets/images/germans-to-america-banner.jpg";
import "../../../index.css";
import {
  getContentCatalog,
  updateContentCatalog,
} from "../../../../../redux/actions/sidebar";
import GermanToAmericaSearchForm from "../components/SearchForm";
import { getGermanDropdownList } from "../../../../../redux/actions/germanToAmerica";

const SearchPage = () => {
  const history = useHistory();
  const defaultValues = getGermanToAmericaDefaultValue();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });

  useEffect(() => {
    dispatch(getGermanDropdownList());
    dispatch(getContentCatalog({ partitionKey: germanPK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);

  const handleSubmitGermanToAmerica = (values, { setSubmitting }) => {
    setSubmitting(false);
    const germanUrlQuery = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: germanPK
    });
    history.push("/search/german-immigrants/result?" + germanUrlQuery);
  };
  return (
    <div className="main-container">
      <div
        className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img
                src={germanBgImg}
                className="inline-block h-24 h-full w-full object-cover"
                alt="icon"
              />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <GermanToAmericaSearchForm
            title={
              contentCatalog?.collectionTitle
            }
            width={"md:w-1/2"}
            defaultValues={defaultValues}
            handleSubmitGermanToAmerica={handleSubmitGermanToAmerica}
            germanClear={true}
            buttonTitle={tr(t, "search.ww1.form.btn.search")}
          />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
