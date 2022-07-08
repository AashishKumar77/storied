import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPageSize, formDataTrim, getUSFederal1800DefaultValues, encodeDataToURL, USFederal1830PK } from "../../../../../utils";
import { tr } from "../../../../../components/utils";
import { useTranslation } from "react-i18next";
import MetaData from "../../../MetaData";
import USFederal1830BGImage from "../../../../../assets/images/ny-public-library-banner.jpg";
import "../../../index.css";
import { getContentCatalog, updateContentCatalog } from "../../../../../redux/actions/sidebar";
import { getUSFederal1830DropdownList } from "../../../../../redux/actions/usCensus1830";
import { useHistory } from "react-router-dom";
import USCensus1830SearchForm from "../components/SearchForm";
const SearchPage = () => {
  const defaultValues = getUSFederal1800DefaultValues();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const { contentCatalog } = useSelector((state) => {
    return state.sidebar;
  });
  useEffect(() => {
    dispatch(getUSFederal1830DropdownList());
    dispatch(getContentCatalog({ partitionKey: USFederal1830PK }));
    return () => {
      dispatch(updateContentCatalog());
    };
  }, [dispatch]);
  const handleSubmitUSCensus1830 = (values, { setSubmitting }) => {
    setSubmitting(false);
    const USCensus1830Query = encodeDataToURL({
      ...formDataTrim(values),
      pn: 1,
      ps: getPageSize(),
      ci: USFederal1830PK,
    });
    history.push("/search/1830-united-states-federal-census/result?" + USCensus1830Query);
  };
  return (
    <div className="main-container">
      <div className="pt-12 md:pt-14 h-full md:bg-transparent bg-white">
        <div className="tw-page-banner bg-gray-800 w-full relative md:absolute top-14 left-0 overflow-hidden hidden md:flex">
          <div className="banner flex text-center w-full justify-center">
            <div className="relative w-full">
              <div className="mask absolute bg-black w-full h-full left-0 top-0 bg-opacity-40"></div>
              <img src={USFederal1830BGImage} className="inline-block h-24 h-full w-full object-cover" alt="icon" />
            </div>
          </div>
        </div>
        <div className="bg-white tw-search-form-card md:rounded-2xl p-6 md:p-10 md:shadow-search-modal md:mt-10 md:mb-8 max-w-src-modal-w w-full mx-auto relative">
          <USCensus1830SearchForm title={contentCatalog?.collectionTitle} width={"md:w-1/2"} defaultValues={defaultValues} handleSubmitUSCensus1830={handleSubmitUSCensus1830} UFCClear={true} buttonTitle={tr(t, "search.ww1.form.btn.search")} />
        </div>
        <MetaData />
      </div>
    </div>
  );
};
export default SearchPage;
